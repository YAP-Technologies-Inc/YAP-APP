import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { storage } from './utils/storage';

export default function HomeScreen() {
  const navigation: any = useNavigation();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;
        const res = await fetch(`https://yapapp.io/api/profile/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View style={styles.headerCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={require('./assets/pfp.png')} style={styles.profileImage} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.welcomeText}>
                Welcome {profile?.name ? profile.name : 'User'}
              </Text>
              <Text style={styles.greetingText}>Hola, ¿cómo estás hoy?</Text>
            </View>
            {/* Logout button */}
            <TouchableOpacity
              style={{ marginLeft: 'auto', padding: 8 }}
              onPress={async () => {
                await storage.logout();
                navigation.replace('SignInScreen');
              }}
            >
              <Text style={{ color: '#F85C5C', fontWeight: 'bold', fontSize: 16 }}>Logout</Text>
            </TouchableOpacity>
          </View>
          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('./assets/coin.png')} style={styles.coinIcon} />
              <Text style={styles.balanceText}>580 $YAP</Text>
            </View>
            <TouchableOpacity style={styles.withdrawButton}>
              <Text style={styles.withdrawButtonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.balanceFooterRow}>
            <Text style={styles.balanceChangeText}>↑ 15% <Text style={{ color: '#A59C9C' }}>(25 $YAP)</Text></Text>
          </View>
        </View>

        {/* Daily Streak */}
        <View style={styles.streakCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={styles.streakFire}>🔥</Text>
            <Text style={styles.streakTitle}>Daily Streak</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.streakArrow}>{'>'}</Text>
          </View>
          <View style={styles.streakRow}>
            {[0,1,2,3,4,5,6].map((d, i) => (
              <View key={i} style={[styles.streakCircle, i < 5 ? styles.streakActive : styles.streakInactive]}>
                {i < 5 ? <Text style={styles.streakCheck}>✓</Text> : null}
              </View>
            ))}
          </View>
          <View style={styles.streakDaysRow}>
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <Text key={i} style={styles.streakDay}>{d}</Text>
            ))}
          </View>
        </View>

        {/* Lesson Section */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Lesson</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        <View style={styles.lessonRow}>
          <TouchableOpacity
            style={[styles.lessonCard, styles.lessonCardActive]}
            onPress={() => navigation.navigate('LessonScreen', { lessonId: 1 })}
          >
            <Text style={styles.lessonCardTitle}>Lesson 1</Text>
          </TouchableOpacity>
          <View style={[styles.lessonCard, styles.lessonCardInactive]}>
            <Text style={[styles.lessonCardTitle, styles.lessonCardTitleInactive]}>Lesson 2</Text>
          </View>
        </View>

        {/* Daily Quiz */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Daily Quiz</Text>
        </View>
        <View style={styles.quizCard}>
          <Text style={styles.quizTitle}>Use 3 new words in a sentence</Text>
          <View style={styles.quizWordsRow}>
            {['schedule','entrepreneur','rural'].map((w, i) => (
              <View key={i} style={styles.quizWord}><Text style={styles.quizWordText}>{w}</Text></View>
            ))}
          </View>
          <View style={styles.quizFooterRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('./assets/coin.png')} style={styles.quizCoinIcon} />
              <Text style={styles.quizReward}>+10 $YAP</Text>
            </View>
            <View style={styles.quizProgressRow}>
              <View style={styles.quizProgressCircle} />
              <Text style={styles.quizProgressText}>2/3 attempts left</Text>
            </View>
          </View>
        </View>

        {/* AI Spanish Teacher Button */}
        <TouchableOpacity
          style={styles.aiTeacherButton}
          onPress={() => navigation.navigate('AITeacherScreen')}
        >
          <Text style={styles.aiTeacherButtonText}>Talk To AI Spanish Teacher</Text>
        </TouchableOpacity>

        {/* Bottom padding for tab bar */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f3ec',
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f3ec',
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  headerCard: {
    backgroundColor: '#f7f3ec',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFD166',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D1C1C',
  },
  greetingText: {
    fontSize: 15,
    color: '#5C4B4B',
    marginTop: 2,
  },
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  coinIcon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  balanceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D1C1C',
  },
  withdrawButton: {
    backgroundColor: '#FFD166',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  withdrawButtonText: {
    color: '#2D1C1C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  balanceFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 8,
  },
  balanceChangeText: {
    color: '#1DBF73',
    fontWeight: 'bold',
    fontSize: 15,
  },
  streakCard: {
    backgroundColor: '#2D1C1C',
    borderRadius: 24,
    marginHorizontal: 20,
    marginTop: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  streakFire: {
    fontSize: 20,
    marginRight: 6,
  },
  streakTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  streakArrow: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 2,
  },
  streakCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  streakActive: {
    backgroundColor: '#3B2B2B',
  },
  streakInactive: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E3DED4',
  },
  streakCheck: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  streakDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    marginHorizontal: 2,
  },
  streakDay: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    width: 32,
    textAlign: 'center',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 28,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D1C1C',
    marginHorizontal: 20, // align with other sections
  },
  seeAll: {
    color: '#A59C9C',
    fontWeight: 'bold',
    fontSize: 15,
  },
  lessonRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
  },
  lessonCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    flex: 1,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  lessonCardActive: {
    backgroundColor: '#F85C5C',
  },
  lessonCardInactive: {
    backgroundColor: '#F0F0F0', // light gray
  },
  lessonCardTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#fff',
    marginBottom: 4,
  },
  lessonCardTitleInactive: {
    color: '#A59C9C',
  },
  lessonCardDesc: {
    color: '#fff',
    fontSize: 13,
  },
  quizCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 20,
    marginTop: 12,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  quizTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2D1C1C',
    marginBottom: 10,
  },
  quizWordsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  quizWord: {
    backgroundColor: '#F7F3EC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  quizWordText: {
    color: '#2D1C1C',
    fontWeight: 'bold',
    fontSize: 14,
  },
  quizFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quizCoinIcon: {
    width: 22,
    height: 22,
    marginRight: 4,
  },
  quizReward: {
    color: '#F85C5C',
    fontWeight: 'bold',
    fontSize: 15,
  },
  quizProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizProgressCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 4,
    borderColor: '#F85C5C',
    marginRight: 6,
  },
  quizProgressText: {
    color: '#2D1C1C',
    fontWeight: 'bold',
    fontSize: 14,
  },
  aiTeacherButton: {
    backgroundColor: '#FFD166',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  aiTeacherButtonText: {
    color: '#2D1C1C',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
