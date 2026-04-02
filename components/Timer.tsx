import { Feather } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;

export const Timer = () => {
  const { theme } = useContext(ThemeContext);
  const [timeLeft, setTimeLeft] = useState(FOCUS_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(true);

  const isDark = theme === 'dark';

  // Gerenciamento do cronômetro
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeEnd();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/meldix-success-340660.mp3') 
    );
    await sound.playAsync();
  };

  const handleTimeEnd = () => {
    setIsRunning(false);
    playSound();
    
    if (isFocusMode) {
      Alert.alert("Parabéns!", "Sessão de foco concluída. Hora de descansar!", [
        { text: "Iniciar Descanso", onPress: () => switchMode(false) }
      ]);
    } else {
      Alert.alert("Fim do Descanso", "Pronto para voltar ao foco?", [
        { text: "Iniciar Foco", onPress: () => switchMode(true) }
      ]);
    }
  };

  const switchMode = (focus: boolean) => {
    setIsFocusMode(focus);
    setTimeLeft((focus ? FOCUS_MINUTES : BREAK_MINUTES) * 60);
    setIsRunning(false);
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft((isFocusMode ? FOCUS_MINUTES : BREAK_MINUTES) * 60);
  };

  // Formatação do tempo (MM:SS)
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  // Estilos dinâmicos baseados no modo e no tema
  const modeColor = isFocusMode ? 'bg-primary' : 'bg-break';
  const textColor = isDark ? 'text-white' : 'text-slate-800';
  const containerBg = isDark ? 'bg-darkBg' : 'bg-lightBg';

  return (
    <View className={`flex-1 items-center justify-center ${containerBg}`}>
      
      {/* Etiqueta / Status */}
      <View className="mb-10 px-4 py-2 rounded-full bg-slate-200 dark:bg-darkCard flex-row items-center">
        <Feather name={isFocusMode ? "briefcase" : "coffee"} size={18} color={isFocusMode ? "#FF6B6B" : "#4ECDC4"} />
        <Text className={`ml-2 font-semibold ${textColor}`}>
          {isFocusMode ? "Sessão de Foco" : "Tempo de Descanso"}
        </Text>
      </View>

      {/* Círculo do Timer Principal */}
      <View className={`w-72 h-72 rounded-full border-8 items-center justify-center ${isFocusMode ? 'border-primary' : 'border-break'} bg-transparent`}>
        <Text className={`text-6xl font-bold ${textColor}`}>
          {minutes}:{seconds}
        </Text>
      </View>

      {/* Botões de Ação */}
      <View className="flex-row mt-12 space-x-6">
        <TouchableOpacity 
          onPress={toggleTimer}
          className={`w-20 h-20 rounded-full items-center justify-center shadow-lg ${modeColor}`}
        >
          <Feather name={isRunning ? "pause" : "play"} size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={resetTimer}
          className="w-20 h-20 rounded-full items-center justify-center bg-slate-300 dark:bg-slate-700 shadow-lg"
        >
          <Feather name="square" size={24} color={isDark ? "white" : "#333"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};