import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { ReactNode, createContext, useCallback, useEffect, useState } from 'react';

export interface Tag {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const TAG_COLORS = [
  '#FF6B6B', '#4ECDC4', '#FFD166', '#6C5CE7', '#A8E6CF',
  '#FF8A5C', '#EA5455', '#00B894', '#E17055', '#74B9FF',
  '#FD79A8', '#FDCB6E', '#E84393', '#00CEC9', '#636E72',
];

export const TAG_ICONS = [
  'briefcase', 'book', 'book-open', 'code', 'coffee',
  'edit-3', 'heart', 'home', 'music', 'star',
  'zap', 'award', 'camera', 'compass', 'cpu',
  'database', 'film', 'globe', 'headphones', 'layers',
];

interface TagsContextData {
  tags: Tag[];
  addTag: (tag: Omit<Tag, 'id'>) => void;
  removeTag: (id: string) => void;
  updateTag: (tag: Tag) => void;
}

export const TagsContext = createContext<TagsContextData>({} as TagsContextData);

const STORAGE_KEY = '@pomodoro_tags';

const DEFAULT_TAGS: Tag[] = [
  { id: '1', name: 'Trabalho', icon: 'briefcase', color: '#FF6B6B' },
  { id: '2', name: 'Estudo', icon: 'book', color: '#4ECDC4' },
  { id: '3', name: 'Leitura', icon: 'book-open', color: '#FFD166' },
  { id: '4', name: 'Exercício', icon: 'zap', color: '#6C5CE7' },
  { id: '5', name: 'Projeto', icon: 'code', color: '#00B894' },
];

export const TagsProvider = ({ children }: { children: ReactNode }) => {
  const [tags, setTags] = useState<Tag[]>(DEFAULT_TAGS);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setTags(JSON.parse(raw));
      } catch {}
    };
    load();
  }, []);

  const save = useCallback(async (newTags: Tag[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTags));
    } catch {}
  }, []);

  const addTag = useCallback((tag: Omit<Tag, 'id'>) => {
    setTags(prev => {
      const newTags = [...prev, { ...tag, id: Date.now().toString() }];
      save(newTags);
      return newTags;
    });
  }, [save]);

  const removeTag = useCallback((id: string) => {
    setTags(prev => {
      const newTags = prev.filter(t => t.id !== id);
      save(newTags);
      return newTags;
    });
  }, [save]);

  const updateTag = useCallback((tag: Tag) => {
    setTags(prev => {
      const newTags = prev.map(t => (t.id === tag.id ? tag : t));
      save(newTags);
      return newTags;
    });
  }, [save]);

  return (
    <TagsContext.Provider value={{ tags, addTag, removeTag, updateTag }}>
      {children}
    </TagsContext.Provider>
  );
};
