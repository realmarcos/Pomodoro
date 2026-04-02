// app/history.tsx
import { ThemeContext } from '@/contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { FlatList, Text, View } from 'react-native';

// Dados falsos para ilustrar o layout
const DUMMY_HISTORY = [
  { id: '1', date: 'Hoje, 10:00', duration: 25, tag: 'Estudo', color: '#4ECDC4' },
  { id: '2', date: 'Hoje, 10:30', duration: 25, tag: 'Trabalho', color: '#FF6B6B' },
  { id: '3', date: 'Ontem, 15:00', duration: 50, tag: 'Leitura', color: '#FFD166' },
];

export default function HistoryScreen() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-slate-800';

  return (
    <View className="flex-1 p-6">
      <Text className={`text-xl font-bold mb-6 ${textColor}`}>Sessões Concluídas</Text>

      <FlatList
        data={DUMMY_HISTORY}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className={`p-4 mb-4 rounded-xl flex-row items-center justify-between ${isDark ? 'bg-darkCard' : 'bg-white'} shadow-sm`}>
            <View className="flex-row items-center space-x-4">
              <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: item.color + '30' }}>
                <Feather name="check-circle" size={20} color={item.color} />
              </View>
              <View>
                <Text className={`font-semibold text-base ${textColor}`}>{item.tag}</Text>
                <Text className="text-slate-500 text-xs">{item.date}</Text>
              </View>
            </View>
            <Text className={`font-bold text-lg ${textColor}`}>
              {item.duration} <Text className="text-sm font-normal">min</Text>
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-slate-500 text-center mt-10">Nenhum pomodoro concluído ainda.</Text>
        }
      />
    </View>
  );
}