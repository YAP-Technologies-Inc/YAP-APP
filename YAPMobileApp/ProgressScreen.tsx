import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

export default function ProgressScreen() {
  return (
    <ScrollView style={styles.bg} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.header}>Progress</Text>

        {/* Today's Goal Card */}
        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>Today's Goal</Text>
          <Text style={styles.goalSubtitle}>Complet 5 words and daily quiz</Text>
          <View style={styles.goalProgressRow}>
            <Text style={styles.goalProgressText}>3/5 words</Text>
            <Text style={styles.goalReward}>+10YAP</Text>
          </View>
          <View style={styles.goalProgressBarBg}>
            <View style={styles.goalProgressBarFill} />
          </View>
          <TouchableOpacity style={styles.goalButton}>
            <Text style={styles.goalButtonText}>Continue learning</Text>
          </TouchableOpacity>
        </View>

        {/* Earnings Card */}
        <Text style={styles.sectionTitle}>Your earnings</Text>
        <View style={styles.earningsCard}>
          <View style={styles.earningsLeft}>
            {/* Replace with your own coin icon if available */}
            <Text style={styles.coinIcon}>🪙</Text>
            <View>
              <Text style={styles.earningsAmount}>580 $YAP</Text>
              <Text style={styles.earningsChange}>↑ 15% <Text style={styles.earningsChangeSub}>(25 $YAP)</Text></Text>
            </View>
          </View>
          <TouchableOpacity style={styles.withdrawButton}>
            <Text style={styles.withdrawButtonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Your Progress Card */}
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <View style={styles.progressItem}>
              <Text style={styles.progressIcon}>🔥</Text>
              <Text style={styles.progressLabel}>Days streak</Text>
              <Text style={styles.progressValue}>12</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressIcon}>📒</Text>
              <Text style={styles.progressLabel}>Words learned</Text>
              <Text style={styles.progressValue}>37</Text>
            </View>
          </View>
          <View style={styles.badgeRow}>
            <Text style={styles.badgeText}>Next badge: earn 100$YAP</Text>
            <Text style={styles.badgeProgress}>52/100</Text>
          </View>
          <View style={styles.badgeProgressBarBg}>
            <View style={styles.badgeProgressBarFill} />
          </View>
        </View>

        {/* Leaderboard Card */}
        <Text style={styles.sectionTitle}>Leaderboard</Text>
        <View style={styles.leaderboardCard}>
          <View style={styles.leaderboardHeader}>
            <Text style={styles.leaderboardRank}>Your Rank: <Text style={styles.leaderboardRankBold}>12/40</Text></Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllButtonText}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.leaderboardUserRow}>
            {/* Replace with your own avatar if available */}
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>🧑‍🎤</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.leaderboardUserName}>Jacob jones</Text>
              <Text style={styles.leaderboardUserYap}>2000 $YAP</Text>
            </View>
            <View style={styles.leaderboardUserRankCircle}>
              <Text style={styles.leaderboardUserRank}>1</Text>
            </View>
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
  goalCard: {
    backgroundColor: '#2D1C1C',
    borderRadius: 28,
    padding: 22,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  goalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    fontFamily: 'serif',
  },
  goalSubtitle: {
    fontSize: 15,
    color: '#EFE6D9',
    marginBottom: 12,
  },
  goalProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  goalProgressText: {
    color: '#fff',
    fontSize: 15,
  },
  goalReward: {
    color: '#FFC93C',
    fontWeight: 'bold',
    fontSize: 15,
  },
  goalProgressBarBg: {
    height: 8,
    backgroundColor: '#4B3A3A',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  goalProgressBarFill: {
    width: '60%', // 3/5 progress
    height: 8,
    backgroundColor: '#FFC93C',
    borderRadius: 8,
  },
  goalButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  goalButtonText: {
    color: '#2D1C1C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D1C1C',
    marginBottom: 12,
    fontFamily: 'serif',
  },
  earningsCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  earningsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    fontSize: 36,
    marginRight: 12,
  },
  earningsAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D1C1C',
  },
  earningsChange: {
    color: '#1DBA4C',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 2,
  },
  earningsChangeSub: {
    color: '#2D1C1C',
    fontWeight: 'normal',
    fontSize: 13,
  },
  withdrawButton: {
    backgroundColor: '#FFC93C',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  withdrawButtonText: {
    color: '#2D1C1C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
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
  progressIcon: {
    fontSize: 32,
    marginBottom: 2,
  },
  progressLabel: {
    fontSize: 14,
    color: '#2D1C1C',
    opacity: 0.7,
    marginTop: 2,
    textAlign: 'center',
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D1C1C',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 15,
    color: '#2D1C1C',
    opacity: 0.8,
  },
  badgeProgress: {
    fontSize: 15,
    color: '#2D1C1C',
    fontWeight: 'bold',
  },
  badgeProgressBarBg: {
    height: 8,
    backgroundColor: '#EFE6D9',
    borderRadius: 8,
    marginTop: 4,
    overflow: 'hidden',
  },
  badgeProgressBarFill: {
    width: '52%', // 52/100 progress
    height: 8,
    backgroundColor: '#FFC93C',
    borderRadius: 8,
  },
  leaderboardCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leaderboardRank: {
    fontSize: 15,
    color: '#2D1C1C',
    opacity: 0.8,
  },
  leaderboardRankBold: {
    fontWeight: 'bold',
    color: '#2D1C1C',
    opacity: 1,
  },
  viewAllButton: {
    backgroundColor: '#2D1C1C',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  viewAllButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  leaderboardUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFE6A0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  leaderboardUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D1C1C',
  },
  leaderboardUserYap: {
    fontSize: 14,
    color: '#2D1C1C',
    opacity: 0.7,
  },
  leaderboardUserRankCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E6FFD6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  leaderboardUserRank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D1C1C',
  },
});
