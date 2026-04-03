import { HistoryContext, Session } from '@/contexts/HistoryContext';
import { ThemeContext } from '@/contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import React, { useContext, useMemo } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  if (isToday) return `Hoje, ${time}`;
  if (isYesterday) return `Ontem, ${time}`;
  return `${date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}, ${time}`;
}

export default function HistoryScreen() {
  const { sessions, clearHistory } = useContext(HistoryContext);
  const { theme } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-slate-800';
  const cardBg = isDark ? 'bg-darkCard' : 'bg-white';

  const focusSessions = useMemo(() => sessions.filter(s => s.type === 'focus'), [sessions]);

  const totalMinutes = useMemo(
    () => focusSessions.reduce((sum, s) => sum + s.duration, 0),
    [focusSessions]
  );

  const handleClear = () => {
    Alert.alert('Limpar Histórico', 'Deseja apagar todas as sessões?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: clearHistory },
    ]);
  };

  const renderItem = ({ item }: { item: Session }) => (
    <View className={`p-4 mb-3 rounded-xl flex-row items-center justify-between ${cardBg} shadow-sm`}>
      <View className="flex-row items-center flex-1">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: item.tagColor + '25' }}
        >
          <Feather name={item.tagIcon as any} size={20} color={item.tagColor} />
        </View>
        <View className="ml-4 flex-1">
          <Text className={`font-semibold text-base ${textColor}`}>{item.tagName}</Text>
          <Text className="text-slate-500 text-xs">{formatDate(item.date)}</Text>
        </View>
      </View>
      <View className="items-end">
        <Text className={`font-bold text-lg ${textColor}`}>
          {item.duration}
          <Text className="text-sm font-normal"> min</Text>
        </Text>
        <View className="flex-row items-center mt-1">
          <Feather
            name={item.type === 'focus' ? 'target' : 'coffee'}
            size={12}
            color={item.type === 'focus' ? '#FF6B6B' : '#4ECDC4'}
          />
          <Text className="text-xs text-slate-500 ml-1">
            {item.type === 'focus' ? 'Foco' : 'Descanso'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className={`flex-1 p-6 ${isDark ? 'bg-darkBg' : 'bg-lightBg'}`}>
      <View className="flex-row justify-between items-center mb-2">
        <Text className={`text-xl font-bold ${textColor}`}>Histórico</Text>
        {sessions.length > 0 && (
          <TouchableOpacity onPress={handleClear} className="p-2">
            <Feather name="trash-2" size={20} color="#EA5455" />
          </TouchableOpacity>
        )}
      </View>

      {focusSessions.length > 0 && (
        <View className={`${cardBg} p-4 rounded-xl mb-5 flex-row justify-around shadow-sm`}>
          <View className="items-center">
            <Text className={`text-2xl font-bold ${textColor}`}>{focusSessions.length}</Text>
            <Text className="text-slate-500 text-xs">Sessões</Text>
          </View>
          <View className="w-px bg-slate-300" />
          <View className="items-center">
            <Text className={`text-2xl font-bold ${textColor}`}>{totalMinutes}</Text>
            <Text className="text-slate-500 text-xs">Minutos</Text>
          </View>
          <View className="w-px bg-slate-300" />
          <View className="items-center">
            <Text className={`text-2xl font-bold ${textColor}`}>
              {Math.round((totalMinutes / 60) * 10) / 10}
            </Text>
            <Text className="text-slate-500 text-xs">Horas</Text>
          </View>
        </View>
      )}

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Feather name="clock" size={48} color={isDark ? '#444' : '#ccc'} />
            <Text className="text-slate-500 text-center mt-4">
              Nenhum pomodoro concluído ainda.
            </Text>
            <Text className="text-slate-400 text-center text-sm mt-1">
              Complete uma sessão de foco para ver aqui.
            </Text>
          </View>
        }
      />
    </View>
  );
}