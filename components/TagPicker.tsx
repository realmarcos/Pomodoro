import { Tag, TagsContext } from '@/contexts/TagsContext';
import { ThemeContext } from '@/contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface TagPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (tag: Tag) => void;
  selectedTagId?: string;
}

export const TagPicker = ({ visible, onClose, onSelect, selectedTagId }: TagPickerProps) => {
  const { tags } = useContext(TagsContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end">
        <TouchableOpacity className="flex-1" onPress={onClose} activeOpacity={1}>
          <View className="flex-1 bg-black/40" />
        </TouchableOpacity>
        <View className={`rounded-t-3xl p-6 pb-10 ${isDark ? 'bg-darkCard' : 'bg-white'}`}>
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Selecionar Etiqueta
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={isDark ? '#fff' : '#333'} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ maxHeight: 300 }}>
            {tags.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                onPress={() => {
                  onSelect(tag);
                  onClose();
                }}
                className={`flex-row items-center p-4 mb-2 rounded-xl ${
                  selectedTagId === tag.id ? 'border-2 border-primary' : ''
                } ${isDark ? 'bg-darkBg' : 'bg-slate-50'}`}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: tag.color + '25' }}
                >
                  <Feather name={tag.icon as any} size={20} color={tag.color} />
                </View>
                <Text className={`text-base font-medium flex-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {tag.name}
                </Text>
                {selectedTagId === tag.id && <Feather name="check" size={20} color="#FF6B6B" />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
