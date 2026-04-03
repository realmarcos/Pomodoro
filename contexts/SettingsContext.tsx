import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { ReactNode, createContext, useCallback, useEffect, useState } from 'react';

export interface AmbientSound {
  id: string;
  name: string;
  icon: string;
}

export const AMBIENT_SOUNDS: AmbientSound[] = [
  { id: 'none', name: 'Nenhum', icon: 'volume-x' },
  { id: 'rain', name: 'Chuva', icon: 'cloud-rain' },
  { id: 'waves', name: 'Ondas do Mar', icon: 'wind' },
  { id: 'fire', name: 'Lareira', icon: 'sunset' },
  { id: 'white-noise', name: 'Ruído Branco', icon: 'radio' },
  { id: 'lofi', name: 'Lo-Fi', icon: 'headphones' },
];

interface SettingsContextData {
  focusMinutes: number;
  breakMinutes: number;
  autoStartBreak: boolean;
  selectedSoundId: string;
  setFocusMinutes: (minutes: number) => void;
  setBreakMinutes: (minutes: number) => void;
  setAutoStartBreak: (value: boolean) => void;
  setSelectedSoundId: (id: string) => void;
}

export const SettingsContext = createContext<SettingsContextData>({} as SettingsContextData);

const STORAGE_KEY = '@pomodoro_settings';

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [focusMinutes, setFocusMinutesState] = useState(25);
  const [breakMinutes, setBreakMinutesState] = useState(5);
  const [autoStartBreak, setAutoStartBreakState] = useState(false);
  const [selectedSoundId, setSelectedSoundIdState] = useState('none');

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          if (data.focusMinutes) setFocusMinutesState(data.focusMinutes);
          if (data.breakMinutes) setBreakMinutesState(data.breakMinutes);
          if (data.autoStartBreak !== undefined) setAutoStartBreakState(data.autoStartBreak);
          if (data.selectedSoundId) setSelectedSoundIdState(data.selectedSoundId);
        }
      } catch {}
    };
    load();
  }, []);

  const persist = useCallback(async (updates: Record<string, unknown>) => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const current = raw ? JSON.parse(raw) : {};
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...updates }));
    } catch {}
  }, []);

  const setFocusMinutes = useCallback((v: number) => {
    setFocusMinutesState(v);
    persist({ focusMinutes: v });
  }, [persist]);

  const setBreakMinutes = useCallback((v: number) => {
    setBreakMinutesState(v);
    persist({ breakMinutes: v });
  }, [persist]);

  const setAutoStartBreak = useCallback((v: boolean) => {
    setAutoStartBreakState(v);
    persist({ autoStartBreak: v });
  }, [persist]);

  const setSelectedSoundId = useCallback((v: string) => {
    setSelectedSoundIdState(v);
    persist({ selectedSoundId: v });
  }, [persist]);

  return (
    <SettingsContext.Provider
      value={{
        focusMinutes,
        breakMinutes,
        autoStartBreak,
        selectedSoundId,
        setFocusMinutes,
        setBreakMinutes,
        setAutoStartBreak,
        setSelectedSoundId,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
