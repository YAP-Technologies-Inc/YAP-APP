import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

export default function FeedbackScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Skip button */}
        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('Streak')}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
        {/* Logo */}
        <Image source={require('./assets/YAP.png')} style={styles.logo} resizeMode="contain" />
        {/* Paper image */}
        <View style={styles.imageContainer}>
          <Image source={require('./assets/paper.png')} style={styles.paperImage} resizeMode="contain" />
        </View>
        {/* Text */}
        <Text style={styles.title}>GET{"\n"}INSTANT{"\n"}FEEDBACK</Text>
        {/* Start button */}
        <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('Streak')}>
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFC93C',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFC93C',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  skipButton: {
    position: 'absolute',
    top: 48,
    right: 24,
    zIndex: 10,
  },
  skipButtonText: {
    fontSize: 18,
    color: '#2D1C1C',
    fontWeight: '500',
  },
  logo: {
    width: 70,
    height: 40,
    marginBottom: 8,
    alignSelf: 'center',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  paperImage: {
    width: 220,
    height: 220,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D1C1C',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
    lineHeight: 36,
  },
  startButton: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    backgroundColor: '#2D1C1C',
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
