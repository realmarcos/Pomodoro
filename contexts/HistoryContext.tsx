import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { ReactNode, createContext, useCallback, useEffect, useState } from 'react';

export interface Session {
  id: string;
  date: string;
  duration: number;
  tagName: string;
  tagColor: string;
  tagIcon: string;
  type: 'focus' | 'break';
}

interface HistoryContextData {
  sessions: Session[];
  addSession: (session: Omit<Session, 'id'>) => void;
  clearHistory: () => void;
}

export const HistoryContext = createContext<HistoryContextData>({} as HistoryContextData);

const STORAGE_KEY = '@pomodoro_history';

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setSessions(JSON.parse(raw));
      } catch {}
    };
    load();
  }, []);

  const save = useCallback(async (newSessions: Session[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions));
    } catch {}
  }, []);

  const addSession = useCallback((session: Omit<Session, 'id'>) => {
    setSessions(prev => {
      const newSessions = [{ ...session, id: Date.now().toString() }, ...prev];
      save(newSessions);
      return newSessions;
    });
  }, [save]);

  const clearHistory = useCallback(() => {
    setSessions([]);
    save([]);
  }, [save]);

  return (
    <HistoryContext.Provider value={{ sessions, addSession, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};
