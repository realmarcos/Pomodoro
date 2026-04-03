import { AMBIENT_SOUNDS, SettingsContext } from '@/contexts/SettingsContext';
import { ThemeContext } from '@/contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const {
    focusMinutes,
    breakMinutes,
    autoStartBreak,
    selectedSoundId,
    setFocusMinutes,
    setBreakMinutes,
    setAutoStartBreak,
    setSelectedSoundId,
  } = useContext(SettingsContext);

  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-slate-800';
  const cardBg = isDark ? 'bg-darkCard' : 'bg-white';
  const subText = 'text-slate-500 text-sm';

  const adjustTime = (
    current: number,
    delta: number,
    min: number,
    max: number,
    setter: (v: number) => void
  ) => {
    const next = current + delta;
    if (next >= min && next <= max) setter(next);
  };

  return (
    <ScrollView className={`flex-1 ${isDark ? 'bg-darkBg' : 'bg-lightBg'}`}>
      <View className="p-6">
        <Text className={`text-xl font-bold mb-6 ${textColor}`}>Configurações</Text>

        <View className={`${cardBg} p-5 rounded-xl shadow-sm mb-4`}>
          <Text className={`font-semibold text-lg mb-1 ${textColor}`}>Tempo de Concentração</Text>
          <Text className={subText}>Duração de cada sessão de foco</Text>
          <View className="flex-row items-center justify-center mt-4 gap-4">
            <TouchableOpacity
              onPress={() => adjustTime(focusMinutes, -5, 5, 120, setFocusMinutes)}
              className={`w-12 h-12 rounded-full items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}
            >
              <Feather name="minus" size={20} color={isDark ? '#fff' : '#555'} />
            </TouchableOpacity>
            <View className="items-center min-w-[80px]">
              <Text className={`text-4xl font-bold ${textColor}`}>{focusMinutes}</Text>
              <Text className={subText}>minutos</Text>
            </View>
            <TouchableOpacity
              onPress={() => adjustTime(focusMinutes, 5, 5, 120, setFocusMinutes)}
              className={`w-12 h-12 rounded-full items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}
            >
              <Feather name="plus" size={20} color={isDark ? '#fff' : '#555'} />
            </TouchableOpacity>
          </View>
        </View>

        <View className={`${cardBg} p-5 rounded-xl shadow-sm mb-4`}>
          <Text className={`font-semibold text-lg mb-1 ${textColor}`}>Tempo de Descanso</Text>
          <Text className={subText}>Duração do intervalo entre sessões</Text>
          <View className="flex-row items-center justify-center mt-4 gap-4">
            <TouchableOpacity
              onPress={() => adjustTime(breakMinutes, -1, 1, 30, setBreakMinutes)}
              className={`w-12 h-12 rounded-full items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}
            >
              <Feather name="minus" size={20} color={isDark ? '#fff' : '#555'} />
            </TouchableOpacity>
            <View className="items-center min-w-[80px]">
              <Text className={`text-4xl font-bold ${textColor}`}>{breakMinutes}</Text>
              <Text className={subText}>minutos</Text>
            </View>
            <TouchableOpacity
              onPress={() => adjustTime(breakMinutes, 1, 1, 30, setBreakMinutes)}
              className={`w-12 h-12 rounded-full items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}
            >
              <Feather name="plus" size={20} color={isDark ? '#fff' : '#555'} />
            </TouchableOpacity>
          </View>
        </View>

        <View className={`${cardBg} p-5 rounded-xl flex-row justify-between items-center shadow-sm mb-4`}>
          <View className="flex-1 mr-4">
            <Text className={`font-semibold text-lg ${textColor}`}>Descanso Automático</Text>
            <Text className={subText}>Iniciar descanso ao terminar o foco</Text>
          </View>
          <Switch
            value={autoStartBreak}
            onValueChange={setAutoStartBreak}
            trackColor={{ false: '#cbd5e1', true: '#FF6B6B' }}
            thumbColor="#ffffff"
          />
        </View>

        <View className={`${cardBg} p-5 rounded-xl shadow-sm mb-4`}>
          <Text className={`font-semibold text-lg mb-1 ${textColor}`}>Som Ambiente</Text>
          <Text className={`${subText} mb-4`}>Música de fundo durante o foco</Text>
          {AMBIENT_SOUNDS.map((sound) => (
            <TouchableOpacity
              key={sound.id}
              onPress={() => setSelectedSoundId(sound.id)}
              className={`flex-row items-center p-3 mb-2 rounded-xl ${
                selectedSoundId === sound.id
                  ? 'bg-primary/10 border border-primary'
                  : isDark
                    ? 'bg-darkBg'
                    : 'bg-slate-50'
              }`}
            >
              <Feather
                name={sound.icon as any}
                size={20}
                color={selectedSoundId === sound.id ? '#FF6B6B' : isDark ? '#aaa' : '#666'}
              />
              <Text
                className={`ml-3 font-medium ${
                  selectedSoundId === sound.id ? 'text-primary' : textColor
                }`}
              >
                {sound.name}
              </Text>
              {selectedSoundId === sound.id && (
                <Feather name="check" size={18} color="#FF6B6B" style={{ marginLeft: 'auto' }} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View className={`${cardBg} p-5 rounded-xl flex-row justify-between items-center shadow-sm mb-4`}>
          <View className="flex-1 mr-4">
            <Text className={`font-semibold text-lg ${textColor}`}>Modo Escuro</Text>
            <Text className={subText}>Alternar visual do aplicativo</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#cbd5e1', true: '#FF6B6B' }}
            thumbColor="#ffffff"
          />
        </View>
      </View>
    </ScrollView>
  );
}