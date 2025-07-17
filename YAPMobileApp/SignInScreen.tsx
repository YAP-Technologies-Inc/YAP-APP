import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignInScreen() {
  const navigation: any = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        // Save userId and token to AsyncStorage
        await AsyncStorage.setItem('userId', data.userId);
        await AsyncStorage.setItem('token', data.token);
        // Navigate to main page
        navigation.replace('MainTabs');
      } else {
        Alert.alert('Login Failed', data.error || 'Invalid credentials');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset flow coming soon!');
    // navigation.navigate('ForgotPassword'); // Uncomment if you have this screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        {/* Logo */}
        <Text style={styles.logo}>YAP</Text>
        {/* Title and subtitle */}
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.subtitle}>Let’s get started! Enter the details to create an account.</Text>
        {/* Input fields */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A59C9C"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Password"
              placeholderTextColor="#A59C9C"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
              <Text style={{ color: '#A59C9C', fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
            <Text style={{ color: '#2D1C1C', fontSize: 14, textAlign: 'right' }}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
        {/* Next button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleLogin} disabled={loading}>
          <Text style={styles.nextButtonText}>{loading ? 'Signing in...' : 'Next'}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f3ec',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 24,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 28,
    color: '#2D1C1C',
    fontWeight: '400',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D1C1C',
    marginTop: 32,
    marginBottom: 16,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D1C1C',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#5C4B4B',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    color: '#2D1C1C',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  nextButton: {
    backgroundColor: '#2D1C1C',
    borderRadius: 32,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
