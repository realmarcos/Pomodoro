import "../global.css";

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

import { ThemeContext } from '@/contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useContext } from 'react';
import { TouchableOpacity } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <ThemeProvider value={DefaultTheme}  >
      <Stack
        screenOptions={{
          // Estilização dinâmica do header com base no tema
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
          name="index"
          options={{
            title: 'Pomodoro',
            headerRight: () => (
              <TouchableOpacity onPress={toggleTheme} className="p-2">
                <Feather name={isDark ? "sun" : "moon"} size={24} color={isDark ? "#FFF" : "#333"} />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Configurações',
            presentation: 'modal' // Abre de baixo para cima no iOS (opcional)
          }}
        />
        <Stack.Screen
          name="history"
          options={{
            title: 'Histórico'
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
