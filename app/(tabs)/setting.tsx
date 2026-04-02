// app/settings.tsx
import { ThemeContext } from '@/contexts/ThemeContext';
import React, { useContext } from 'react';
import { Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const textColor = isDark ? 'text-white' : 'text-slate-800';
  const cardBg = isDark ? 'bg-darkCard' : 'bg-white';

  return (
    <View className="flex-1 p-6">
      <Text className={`text-xl font-bold mb-6 ${textColor}`}>Preferências</Text>

      {/* Card de Configuração de Tema */}
      <View className={`${cardBg} p-4 rounded-xl flex-row justify-between items-center shadow-sm mb-4`}>
        <View>
          <Text className={`font-semibold text-lg ${textColor}`}>Modo Escuro</Text>
          <Text className="text-slate-500 text-sm">Alternar visual do aplicativo</Text>
        </View>
        <Switch 
          value={isDark} 
          onValueChange={toggleTheme}
          trackColor={{ false: '#cbd5e1', true: '#FF6B6B' }}
          thumbColor={'#ffffff'}
        />
      </View>

      {/* Placeholder para Configuração de Tempo */}
      <View className={`${cardBg} p-4 rounded-xl shadow-sm mb-4`}>
        <Text className={`font-semibold text-lg mb-2 ${textColor}`}>Tempo Padrão</Text>
        <Text className="text-slate-500 text-sm">Futuramente: Adicionar inputs para editar os 25min de foco e 5min de descanso aqui e salvar no AsyncStorage.</Text>
      </View>
    </View>
  );
}