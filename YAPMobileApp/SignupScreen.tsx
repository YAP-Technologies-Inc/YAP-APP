import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SecuringLoader from './SecuringLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Try to import crypto modules, but handle gracefully if they're not available
let DirectSecp256k1HdWallet: any, ethers: any, bip39: any, CryptoJS: any, Buffer: any;
try {
  DirectSecp256k1HdWallet = require("@cosmjs/proto-signing").DirectSecp256k1HdWallet;
  ethers = require("ethers");
  bip39 = require("bip39");
  CryptoJS = require("crypto-js");
  Buffer = require("buffer").Buffer;
  if (typeof global.Buffer === "undefined") global.Buffer = Buffer;
} catch (error) {
  console.log('Crypto modules not available (likely running in Expo Go):', error);
}

// Helper to generate a random array of numbers
function randomArray(length: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * 256));
}

export default function SignupScreen() {
  const navigation: any = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [languageToLearn, setLanguageToLearn] = useState('');
  const [nativeLanguage, setNativeLanguage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const handleSignup = async () => {
    console.log('handleSignup called!');
    console.log('Form values:', { fullName, email, password: password ? '***' : '', confirmPassword: confirmPassword ? '***' : '', languageToLearn, nativeLanguage });
    
    if (!fullName || !email || !password || !confirmPassword || !languageToLearn || !nativeLanguage) {
      console.log('Validation failed - missing fields');
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    // Email format validation
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed - invalid email');
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      console.log('Validation failed - password too short');
      Alert.alert('Error', 'Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      console.log('Validation failed - passwords do not match');
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    console.log('Crypto modules check:');
    console.log('- bip39:', !!bip39);
    console.log('- DirectSecp256k1HdWallet:', !!DirectSecp256k1HdWallet);
    console.log('- ethers:', !!ethers);
    console.log('- CryptoJS:', !!CryptoJS);

    // Check if crypto modules are available
    if (!bip39 || !DirectSecp256k1HdWallet || !ethers || !CryptoJS) {
      console.log('Crypto modules not available, showing alert');
      Alert.alert(
        'Development Build Required', 
        'This feature requires a development build with native modules. Please use the development build instead of Expo Go.'
      );
      return;
    }

    setShowLoader(true);
    try {
      // 1. Generate a mnemonic
      let mnemonic, seiPrefix, seiWallet, seiAccount, sei_address, sei_public_key, ethWallet, eth_address, eth_public_key, encrypted_mnemonic;
      try {
        mnemonic = bip39.generateMnemonic(128); // 12 words

        // 2. Create SEI wallet (Cosmos-based)
        seiPrefix = "sei";
        seiWallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: seiPrefix });
        [seiAccount] = await seiWallet.getAccounts();
        sei_address = seiAccount.address;
        sei_public_key = Buffer.from(seiAccount.pubkey).toString("hex");

        console.log("Generated SEI address:", sei_address);
        console.log("Generated SEI public key:", sei_public_key);
        console.log("Generated mnemonic:", mnemonic);

        // 3. Create EVM wallet (Ethereum)
        ethWallet = ethers.Wallet.fromMnemonic(mnemonic);
        eth_address = ethWallet.address;
        eth_public_key = ethWallet.publicKey;

        // 4. Encrypt the mnemonic with the user's password
        encrypted_mnemonic = CryptoJS.AES.encrypt(mnemonic, password).toString();
      } catch (err) {
        console.log('Wallet generation error:', err);
        Alert.alert(
          'Wallet Error',
          'There was a problem generating your wallet. Please make sure you are running a development build (not Expo Go), and that all dependencies are installed.'
        );
        setShowLoader(false);
        return;
      }

      // 5. Generate salts/nonces if your backend expects them
      const encryptedStretchedKey = randomArray(32);
      const encryptionSalt = randomArray(16);
      const stretchedKeyNonce = randomArray(12);
      const mnemonic_salt = randomArray(16);
      const mnemonic_nonce = randomArray(12);

      // 6. Build the payload
      const payload = {
        name: fullName,
        email,
        password,
        language_to_learn: languageToLearn,
        native_language: nativeLanguage,
        encryptedStretchedKey,
        encryptionSalt,
        stretchedKeyNonce,
        encrypted_mnemonic,
        mnemonic_salt,
        mnemonic_nonce,
        sei_address,
        sei_public_key,
        eth_address,
        eth_public_key,
      };

      console.log('Signup payload:', payload);

      const response = await fetch('http://localhost:4000/api/auth/secure-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      const data = await response.json();
      console.log('Backend response:', data);
      if (data.success) {
        // Save userId and token to AsyncStorage for later use
        if (data.userId) {
          try {
            await AsyncStorage.setItem('userId', data.userId);
            console.log('Saved userId to AsyncStorage:', data.userId);
          } catch (storageErr) {
            console.log('Failed to save userId:', storageErr);
          }
        }
        if (data.token) {
          try {
            await AsyncStorage.setItem('token', data.token);
            console.log('Saved token to AsyncStorage:', data.token);
          } catch (storageErr) {
            console.log('Failed to save token:', storageErr);
          }
        }
        Alert.alert('Signup successful!', `Your SEI Address: ${sei_address}`);
        setTimeout(() => {
          navigation.replace('MainTabs');
        }, 1000); // 1 second delay
        return;
      } else {
        // Show the backend error message if available
        Alert.alert('Signup Failed', data.message || 'Please try again.');
      }
    } catch (err) {
      console.log('Signup error:', err);
      Alert.alert('Network Error', 'Please check your connection and try again.');
    } finally {
      setShowLoader(false);
    }
  };

  if (showLoader) return <SecuringLoader />;

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
        <Image source={require('./assets/YAP.png')} style={styles.logo} resizeMode="contain" />
        {/* Title and subtitle */}
        <Text style={styles.title}>Create an Account</Text>
        <Text style={styles.subtitle}>Let’s get started! Enter the details to create an account.</Text>
        {/* Input fields */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#A59C9C"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A59C9C"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Language to Learn (e.g. Spanish)"
            placeholderTextColor="#A59C9C"
            value={languageToLearn}
            onChangeText={setLanguageToLearn}
          />
          <TextInput
            style={styles.input}
            placeholder="Native Language (e.g. English)"
            placeholderTextColor="#A59C9C"
            value={nativeLanguage}
            onChangeText={setNativeLanguage}
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
              textContentType="none"      // <--- add this
              autoComplete="off"          // <--- add this
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
              <Text style={{ color: '#A59C9C', fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Confirm Password"
              placeholderTextColor="#A59C9C"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              textContentType="none"      // <--- add this
              autoComplete="off"          // <--- add this
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
              <Text style={{ color: '#A59C9C', fontSize: 18 }}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Next button */}
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={() => {
            console.log('Next button pressed!');
            handleSignup();
          }} 
          disabled={loading}
        >
          <Text style={styles.nextButtonText}>{loading ? 'Submitting...' : 'Next'}</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24, alignItems: 'center' }}>
          <Text style={{ color: '#2D1C1C', fontSize: 16 }}>
            Already have an account?
          </Text>
          <Pressable
            onPress={() => { console.log('Sign in pressed'); navigation.navigate('SignInScreen'); }}
            style={{ marginLeft: 4 }}
            accessible={true}
            tabIndex={0}
          >
            <Text
              style={{
                color: '#2D1C1C',
                fontWeight: 'bold',
                textDecorationLine: 'underline',
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              Sign in
            </Text>
          </Pressable>
        </View>
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
    width: 70,
    height: 40,
    marginTop: 16,
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
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
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