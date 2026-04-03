import { ThemeContext } from '@/contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useContext } from 'react';

export default function TabLayout() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: isDark ? '#888' : '#999',
        tabBarStyle: {
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderTopColor: isDark ? '#333' : '#eee',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Timer',
          tabBarIcon: ({ color }) => <Feather name="clock" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tags"
        options={{
          title: 'Etiquetas',
          tabBarIcon: ({ color }) => <Feather name="tag" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color }) => <Feather name="bar-chart-2" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => <Feather name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
