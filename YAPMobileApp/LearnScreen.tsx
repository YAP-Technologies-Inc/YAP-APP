import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

export default function LearnScreen() {
  return (
    <ScrollView style={styles.bg} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.header}>Learn</Text>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Your Current Progress</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressItem}>
              {/* Replace with your own icon if available */}
              <Text style={styles.icon}>📒</Text>
              <Text style={styles.progressNumber}>37</Text>
              <Text style={styles.progressLabel}>Words learned</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.icon}>📄</Text>
              <Text style={styles.progressNumber}>24</Text>
              <Text style={styles.progressLabel}>Sentences learned</Text>
            </View>
          </View>
          <View style={styles.lessonRow}>
            <Text style={styles.lessonLabel}>Lesson 2</Text>
            <Text style={styles.lessonProgress}>3/5</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

        {/* Daily Quiz */}
        <Text style={styles.quizHeader}>Daily Quiz</Text>
        <View style={styles.quizGrid}>
          <View style={styles.quizCard}>
            <View style={styles.quizTag}><Text style={styles.quizTagText}>work</Text></View>
            <Text style={styles.quizText}>I work best in the morning with coffee.</Text>
          </View>
          <View style={styles.quizCard}>
            <View style={styles.quizTag}><Text style={styles.quizTagText}>wallet</Text></View>
            <Text style={styles.quizText}>I stake tokens in my wallet to earn rewards.</Text>
          </View>
          <View style={styles.quizCard}>
            <View style={styles.quizTag}><Text style={styles.quizTagText}>earn</Text></View>
            <Text style={styles.quizText}>I learn English to earn crypto while I speak.</Text>
          </View>
          <View style={styles.quizCard}>
            <View style={styles.quizTag}><Text style={styles.quizTagText}>schedule</Text></View>
            <Text style={styles.quizText}>Let’s schedule a meeting to get the report.</Text>
          </View>
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
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D1C1C',
    marginBottom: 18,
    fontFamily: 'serif',
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D1C1C',
    marginBottom: 16,
    fontFamily: 'serif',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressItem: {
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 36,
    marginBottom: 4,
  },
  progressNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D1C1C',
  },
  progressLabel: {
    fontSize: 14,
    color: '#2D1C1C',
    opacity: 0.7,
    marginTop: 2,
    textAlign: 'center',
  },
  lessonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  lessonLabel: {
    fontSize: 16,
    color: '#2D1C1C',
    opacity: 0.8,
  },
  lessonProgress: {
    fontSize: 16,
    color: '#2D1C1C',
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#EFE6D9',
    borderRadius: 8,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '60%', // 3/5 progress
    height: 8,
    backgroundColor: '#FFC93C',
    borderRadius: 8,
  },
  quizHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D1C1C',
    marginBottom: 16,
    fontFamily: 'serif',
  },
  quizGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quizCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  quizTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#F6F1E7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginBottom: 10,
  },
  quizTagText: {
    fontSize: 13,
    color: '#2D1C1C',
    opacity: 0.7,
    fontWeight: '500',
  },
  quizText: {
    fontSize: 16,
    color: '#2D1C1C',
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
});
