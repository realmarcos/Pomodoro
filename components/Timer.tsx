import { CircularProgress } from '@/components/CircularProgress';
import { TagPicker } from '@/components/TagPicker';
import { HistoryContext } from '@/contexts/HistoryContext';
import { SettingsContext } from '@/contexts/SettingsContext';
import { Tag, TagsContext } from '@/contexts/TagsContext';
import { ThemeContext } from '@/contexts/ThemeContext';
import { playAmbientSound, playNotificationSound, stopSound } from '@/utils/sounds';
import { Feather } from '@expo/vector-icons';
import { AudioPlayer } from 'expo-audio';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const TIMER_SIZE = width * 0.75;
const STROKE_WIDTH = 12;

export const Timer = () => {
  const { theme } = useContext(ThemeContext);
  const { focusMinutes, breakMinutes, autoStartBreak, selectedSoundId } = useContext(SettingsContext);
  const { tags } = useContext(TagsContext);
  const { addSession } = useContext(HistoryContext);

  const [totalSeconds, setTotalSeconds] = useState(focusMinutes * 60);
  const [timeLeft, setTimeLeft] = useState(focusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(true);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(tags[0] || null);
  const [showTagPicker, setShowTagPicker] = useState(false);

  const bgSoundRef = useRef<AudioPlayer | null>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!isRunning) {
      const newTotal = (isFocusMode ? focusMinutes : breakMinutes) * 60;
      setTotalSeconds(newTotal);
      setTimeLeft(newTotal);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusMinutes, breakMinutes]);

  const handleTimeEnd = async () => {
    setIsRunning(false);
    await stopSound(bgSoundRef.current);
    bgSoundRef.current = null;
    await playNotificationSound();

    addSession({
      date: new Date().toISOString(),
      duration: isFocusMode ? focusMinutes : breakMinutes,
      tagName: selectedTag?.name || 'Sem etiqueta',
      tagColor: selectedTag?.color || '#999',
      tagIcon: selectedTag?.icon || 'clock',
      type: isFocusMode ? 'focus' : 'break',
    });

    if (isFocusMode) {
      Alert.alert('🎉 Parabéns!', 'Sessão de foco concluída! Hora de descansar.', [
        { text: 'Iniciar Descanso', onPress: () => switchMode(false, autoStartBreak) },
        { text: 'Fechar', style: 'cancel' },
      ]);
    } else {
      Alert.alert('☕ Fim do Descanso', 'Pronto para voltar ao foco?', [
        { text: 'Iniciar Foco', onPress: () => switchMode(true, false) },
        { text: 'Fechar', style: 'cancel' },
      ]);
    }
  };

  useEffect(() => {
    let interval: any;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      handleTimeEnd();
    }

    return () => clearInterval(interval);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (isRunning && selectedSoundId !== 'none' && isFocusMode) {
      (async () => {
        stopSound(bgSoundRef.current);
        bgSoundRef.current = await playAmbientSound(selectedSoundId);
      })();
    } else {
      stopSound(bgSoundRef.current);
      bgSoundRef.current = null;
    }
    return () => {
      stopSound(bgSoundRef.current);
    };
  }, [isRunning, selectedSoundId, isFocusMode]);

  const switchMode = (focus: boolean, autoStart: boolean = false) => {
    setIsFocusMode(focus);
    const newTotal = (focus ? focusMinutes : breakMinutes) * 60;
    setTotalSeconds(newTotal);
    setTimeLeft(newTotal);
    setIsRunning(autoStart);
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = async () => {
    setIsRunning(false);
    await stopSound(bgSoundRef.current);
    bgSoundRef.current = null;
    const newTotal = (isFocusMode ? focusMinutes : breakMinutes) * 60;
    setTotalSeconds(newTotal);
    setTimeLeft(newTotal);
  };

  const progress = totalSeconds > 0 ? (totalSeconds - timeLeft) / totalSeconds : 0;
  const minutesDisplay = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secondsDisplay = (timeLeft % 60).toString().padStart(2, '0');
  const modeColor = isFocusMode ? '#FF6B6B' : '#4ECDC4';
  const modeBg = isFocusMode ? 'bg-primary' : 'bg-break';
  const textColor = isDark ? 'text-white' : 'text-slate-800';

  return (
    <View className={`flex-1 items-center justify-center ${isDark ? 'bg-darkBg' : 'bg-lightBg'}`}>
      <TouchableOpacity
        onPress={() => setShowTagPicker(true)}
        className={`mb-8 px-5 py-2.5 rounded-full flex-row items-center ${isDark ? 'bg-darkCard' : 'bg-white'} shadow-sm`}
      >
        {selectedTag && (
          <View
            className="w-6 h-6 rounded-full items-center justify-center mr-2"
            style={{ backgroundColor: selectedTag.color + '30' }}
          >
            <Feather name={selectedTag.icon as any} size={14} color={selectedTag.color} />
          </View>
        )}
        <Feather name={isFocusMode ? 'target' : 'coffee'} size={16} color={modeColor} />
        <Text className={`ml-2 font-semibold ${textColor}`}>
          {isFocusMode ? 'Foco' : 'Descanso'}
          {selectedTag ? ` · ${selectedTag.name}` : ''}
        </Text>
        <Feather name="chevron-down" size={16} color={isDark ? '#aaa' : '#666'} style={{ marginLeft: 6 }} />
      </TouchableOpacity>

      <CircularProgress
        size={TIMER_SIZE}
        strokeWidth={STROKE_WIDTH}
        progress={progress}
        color={modeColor}
        bgColor={isDark ? '#333' : '#E5E7EB'}
      >
        <View className="items-center">
          <Text className={`text-6xl font-bold ${textColor}`}>
            {minutesDisplay}:{secondsDisplay}
          </Text>
          <Text className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isFocusMode ? `${focusMinutes} min de foco` : `${breakMinutes} min de descanso`}
          </Text>
        </View>
      </CircularProgress>

      <View className="flex-row items-center mt-12 gap-6">
        <TouchableOpacity
          onPress={resetTimer}
          className={`w-14 h-14 rounded-full items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}
        >
          <Feather name="rotate-ccw" size={22} color={isDark ? '#fff' : '#555'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleTimer}
          className={`w-20 h-20 rounded-full items-center justify-center shadow-lg ${modeBg}`}
          style={{ elevation: 8 }}
        >
          <Feather name={isRunning ? 'pause' : 'play'} size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => switchMode(!isFocusMode)}
          className={`w-14 h-14 rounded-full items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}
        >
          <Feather name="skip-forward" size={22} color={isDark ? '#fff' : '#555'} />
        </TouchableOpacity>
      </View>

      <TagPicker
        visible={showTagPicker}
        onClose={() => setShowTagPicker(false)}
        onSelect={setSelectedTag}
        selectedTagId={selectedTag?.id}
      />
    </View>
  );
};