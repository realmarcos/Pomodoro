import "../global.css";

import { HistoryProvider } from '@/contexts/HistoryContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { TagsProvider } from '@/contexts/TagsContext';
import { ThemeContext, ThemeProvider } from '@/contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <NavThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          },
          headerTintColor: isDark ? '#FFFFFF' : '#333333',
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: isDark ? '#121212' : '#F7F9FC',
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            title: 'Pomodoro',
            headerRight: () => (
              <TouchableOpacity onPress={toggleTheme} className="p-2">
                <Feather name={isDark ? 'sun' : 'moon'} size={24} color={isDark ? '#FFF' : '#333'} />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="modal"
          options={{
            title: 'Modal',
            presentation: 'modal',
          }}
        />
      </Stack>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <TagsProvider>
          <HistoryProvider>
            <RootLayoutNav />
          </HistoryProvider>
        </TagsProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
