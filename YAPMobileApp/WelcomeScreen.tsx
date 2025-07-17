import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

// Define the navigation stack param list
 type RootStackParamList = {
   Welcome: undefined;
   Signup: undefined;
   SignInScreen: undefined;
 };

export default function WelcomeScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section with dark background */}
      <View style={styles.topSection}>
        <Image source={require('./assets/YAP.png')} style={styles.logo} resizeMode="contain" />
        <Image source={require('./assets/group.png')} style={styles.groupImage} resizeMode="contain" />
        {/* Floating elements (placeholders for now) */}
        <View style={[styles.floating, styles.floatingHomme]}>
          <Text style={styles.floatingText}>Homme</Text>
        </View>
        <View style={[styles.floating, styles.floatingCoin]}>
          <Text style={styles.floatingCoinText}>30 $YAP</Text>
        </View>
        {/* Add more floating avatars if you want, using Image and styles */}
      </View>
      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Text style={styles.welcomeTitle}>Welcome to{"\n"}YAP!</Text>
        <Text style={styles.subtitle}>The only app that pays you to practice languages.</Text>
        <TouchableOpacity style={styles.emailButton} onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.emailButtonText}>Continue with Email</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>OR</Text>
        <TouchableOpacity style={styles.appleButton}>
          <Text style={styles.appleButtonText}>Continue with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
          <Text style={[styles.signInText, { textAlign: 'left' }]}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignInScreen')}
            style={{ marginLeft: 4 }}
            accessible={true}
          >
            <Text style={styles.signInLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f3ec',
  },
  topSection: {
    backgroundColor: '#2D1C1C',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    position: 'relative',
  },
  logo: {
    width: 80,
    height: 40,
    marginBottom: 8,
  },
  groupImage: {
    width: 220,
    height: 140,
    marginBottom: 8,
  },
  floating: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  floatingHomme: {
    left: 30,
    top: 60,
    backgroundColor: '#E15B7E',
  },
  floatingCoin: {
    right: 30,
    top: 120,
    backgroundColor: '#FFD166',
  },
  floatingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  floatingCoinText: {
    color: '#2D1C1C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomSection: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D1C1C',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#5C4B4B',
    textAlign: 'center',
    marginBottom: 24,
  },
  emailButton: {
    backgroundColor: '#2D1C1C',
    borderRadius: 32,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  emailButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  orText: {
    color: '#A59C9C',
    marginVertical: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  appleButton: {
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  appleButtonText: {
    color: '#2D1C1C',
    fontWeight: 'bold',
    fontSize: 18,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleButtonText: {
    color: '#2D1C1C',
    fontWeight: 'bold',
    fontSize: 18,
  },
  signInText: {
    color: '#5C4B4B',
    fontSize: 15,
    // Remove textAlign: 'center'
    // Remove width: '100%'
  },
  signInLink: {
    color: '#2D1C1C',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 15, // Match signInText fontSize
    // Optionally add: lineHeight: 20,
  },
}); 