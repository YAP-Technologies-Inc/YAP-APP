import 'react-native-get-random-values';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './WelcomeScreen';
import SignupScreen from './SignupScreen';
import HomeScreen from './HomeScreen'; // Make sure this import exists
import FeedbackScreen from './FeedbackScreen';
import IntroScreen from './IntroScreen';
import SecuringLoader from './SecuringLoader';
import StreakScreen from './StreakScreen';
import MainTabs from './MainTabs';
import SignInScreen from './SignInScreen';
import LessonScreen from './LessonScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="SecuringLoader" component={SecuringLoader} />
        <Stack.Screen name="Intro" component={IntroScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen name="Streak" component={StreakScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="LessonScreen" component={LessonScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
