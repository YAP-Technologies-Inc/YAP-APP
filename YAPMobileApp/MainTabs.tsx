import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import LearnScreen from './LearnScreen';
import ProgressScreen from './ProgressScreen';
import ProfileScreen from './ProfileScreen';
import { TablerHome } from './icons/Home';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <TablerHome width={size} height={size} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
