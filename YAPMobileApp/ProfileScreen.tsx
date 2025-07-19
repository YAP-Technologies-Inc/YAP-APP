import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Linking, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [themeEnabled, setThemeEnabled] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUserIdAndFetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
        if (!storedUserId) {
          setError('User ID not found. Please sign up or log in.');
          setLoading(false);
          return;
        }
        setUserId(storedUserId);
        // Fetch user profile
        const profileRes = await fetch(`https://yapapp.io/api/profile/${storedUserId}`);
        if (!profileRes.ok) {
          const text = await profileRes.text();
          console.log('Profile fetch failed:', profileRes.status, text);
          throw new Error('Failed to fetch profile');
        }
        const profileData = await profileRes.json();
        setProfile(profileData);
        // Fetch user lessons progress (DISABLED: endpoint not available)
        // const progressRes = await fetch(`http://delta-sandbox-7k3m.goyap.ai/learning/api/cefr/progress/${storedUserId}`, {
        //   headers: token ? { Authorization: `Bearer ${token}` } : {},
        // });
        // if (!progressRes.ok) {
        //   const text = await progressRes.text();
        //   console.log('Progress fetch failed:', progressRes.status, text);
        //   throw new Error('Failed to fetch progress');
        // }
        // const progressData = await progressRes.json();
        // setProgress(progressData);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    loadUserIdAndFetch();
  }, []);

  // Function to handle buying $YAP
  const handleBuyYAP = async () => {
    try {
      const response = await fetch('https://yapapp.io/api/create-payment-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1000 }), // Example: buy 1000 $YAP
      });
      const data = await response.json();
      if (data.url) {
        Linking.openURL(data.url);
      } else {
        Alert.alert('Error', 'Failed to start payment.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || String(err));
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2D1C1C" />
        <Text>Loading profile...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.bg} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.header}>Profile</Text>
          <TouchableOpacity>
            <Text style={styles.logout}>Log out</Text>
          </TouchableOpacity>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.userInfoRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>🧑‍🎨</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{profile?.name || 'Unknown'}</Text>
              <Text style={styles.userDate}>{profile?.email || ''}</Text>
            </View>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Buy $YAP Button */}
        <TouchableOpacity style={styles.buyYapButton} onPress={handleBuyYAP}>
          <Text style={styles.buyYapButtonText}>Buy $YAP</Text>
        </TouchableOpacity>

        {/* General Settings */}
        <Text style={styles.sectionTitle}>General settings</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <Text style={styles.settingIcon}>💳</Text>
            <Text style={styles.settingLabel}>Wallet</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.walletAddress}>
              {profile?.sei_address?.slice(0, 8) + '...' || 'N/A'}
            </Text>
            <TouchableOpacity>
              <Text style={styles.copyIcon}>📋</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingIcon}>🔔</Text>
            <Text style={styles.settingLabel}>Daily notifications</Text>
            <View style={{ flex: 1 }} />
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#EFE6D9', true: '#2D1C1C' }}
              thumbColor={notificationsEnabled ? '#FFC93C' : '#fff'}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingIcon}>🎨</Text>
            <Text style={styles.settingLabel}>App theme</Text>
            <View style={{ flex: 1 }} />
            <Switch
              value={themeEnabled}
              onValueChange={setThemeEnabled}
              trackColor={{ false: '#EFE6D9', true: '#2D1C1C' }}
              thumbColor={themeEnabled ? '#FFC93C' : '#fff'}
            />
          </View>
        </View>

        {/* Statistics */}
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsRow}>
          <View style={styles.statsCard}>
            <Text style={styles.statsIcon}>⏰</Text>
            <Text style={styles.statsLabel}>Days practiced</Text>
            <Text style={styles.statsValue}>{progress?.daysPracticed ?? 'N/A'}</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsIcon}>🔥</Text>
            <Text style={styles.statsLabel}>Highest streak</Text>
            <Text style={styles.statsValue}>{progress?.highestStreak ?? 'N/A'}</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsIcon}>🪙</Text>
            <Text style={styles.statsLabel}>Total $YAP</Text>
            <Text style={styles.statsValue}>{profile?.token_bonus ?? 'N/A'}</Text>
          </View>
        </View>

        {/* Others */}
        <Text style={styles.sectionTitle}>Others</Text>
        <View style={styles.othersCard}>
          <TouchableOpacity style={styles.othersRow}>
            <Text style={styles.othersIcon}>❗</Text>
            <Text style={styles.othersLabel}>About app</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.othersRow}>
            <Text style={styles.othersIcon}>❓</Text>
            <Text style={styles.othersLabel}>Help & Support</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.othersRow}>
            <Text style={styles.othersIcon}>📄</Text>
            <Text style={styles.othersLabel}>Terms & Conditions</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#F6F1E7',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D1C1C',
    fontFamily: 'serif',
  },
  logout: {
    color: '#E14B4B',
    fontWeight: 'bold',
    fontSize: 17,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFE6A0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D1C1C',
  },
  userDate: {
    fontSize: 14,
    color: '#2D1C1C',
    opacity: 0.7,
  },
  editProfileButton: {
    backgroundColor: '#2D1C1C',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editProfileButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D1C1C',
    marginBottom: 12,
    fontFamily: 'serif',
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  settingIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 16,
    color: '#2D1C1C',
    fontWeight: '500',
  },
  walletAddress: {
    fontSize: 15,
    color: '#2D1C1C',
    opacity: 0.7,
    marginRight: 8,
  },
  copyIcon: {
    fontSize: 18,
    color: '#2D1C1C',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  statsIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 14,
    color: '#2D1C1C',
    opacity: 0.7,
    marginBottom: 2,
    textAlign: 'center',
  },
  statsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D1C1C',
  },
  othersCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 8,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  othersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EFE6D9',
  },
  othersIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  othersLabel: {
    fontSize: 16,
    color: '#2D1C1C',
    fontWeight: '500',
  },
  arrowIcon: {
    fontSize: 22,
    color: '#2D1C1C',
    opacity: 0.5,
  },
  buyYapButton: {
    backgroundColor: '#FFC93C',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 4,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  buyYapButtonText: {
    color: '#2D1C1C',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
