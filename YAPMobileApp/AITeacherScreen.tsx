import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Import the web conversation component
import SpanishTeacherConversation from './SpanishTeacherConversation';

export default function AITeacherScreen() {
  const navigation: any = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // On web, render the conversation component
  if (Platform.OS === 'web') {
    return (
      <div style={{ height: '100vh', background: '#f7f3ec' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', paddingTop: 64 }}>
          <SpanishTeacherConversation />
        </div>
      </div>
    );
  }

  // On native, keep the placeholder
  const handleStartConversation = async () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Coming Soon', 'Voice AI conversation will be available here!');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'< Back'}</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title}>Talk To AI Spanish Teacher</Text>
        <Text style={styles.subtitle}>Practice your Spanish conversation with our AI-powered teacher. Click start to begin!</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity style={styles.startButton} onPress={handleStartConversation} disabled={isLoading}>
          <Text style={styles.startButtonText}>{isLoading ? 'Connecting...' : 'Start Conversation'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f3ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 32,
    left: 16,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: '#2D1C1C',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D1C1C',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#5C4B4B',
    marginBottom: 24,
    textAlign: 'center',
  },
  error: {
    color: '#e74c3c',
    marginBottom: 12,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#FFD166',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  startButtonText: {
    color: '#2D1C1C',
    fontWeight: 'bold',
    fontSize: 18,
  },
}); 