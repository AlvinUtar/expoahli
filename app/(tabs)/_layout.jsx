import { View, Text } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors.PRIMARY,
      tabBarLabelStyle: {
          fontFamily: 'outfit-medium', // Replace 'outfit-medium' with your custom font family
          fontSize: 12, // You can adjust the font size as needed
        },
    }}>
      <Tabs.Screen
        name="mytrip"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color }) => <Ionicons name="globe-outline" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="accessibility" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          tabBarLabel: 'Near By',
          tabBarIcon: ({ color }) => <Ionicons name="locate" size={24} color={color} />
        }}
      />
    </Tabs>
  );
}
