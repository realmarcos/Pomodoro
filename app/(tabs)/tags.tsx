import { TAG_COLORS, TAG_ICONS, TagsContext } from '@/contexts/TagsContext';
import { ThemeContext } from '@/contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TagsScreen() {
  const { tags, addTag, removeTag } = useContext(TagsContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState(TAG_ICONS[0]);
  const [newColor, setNewColor] = useState(TAG_COLORS[0]);

  const insets = useSafeAreaInsets();
  const textColor = isDark ? 'text-white' : 'text-slate-800';
  const cardBg = isDark ? 'bg-darkCard' : 'bg-white';

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) {
      Alert.alert('Atenção', 'Digite um nome para a etiqueta.');
      return;
    }
    addTag({ name: trimmed, icon: newIcon, color: newColor });
    setNewName('');
    setNewIcon(TAG_ICONS[0]);
    setNewColor(TAG_COLORS[0]);
    setShowModal(false);
  };

  const handleRemove = (id: string, name: string) => {
    Alert.alert('Remover Etiqueta', `Deseja remover "${name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => removeTag(id) },
    ]);
  };

  return (
    <View className={`flex-1 p-6 ${isDark ? 'bg-darkBg' : 'bg-lightBg'}`}>
      <View className="flex-row justify-between items-center mb-6">
        <Text className={`text-xl font-bold ${textColor}`}>Etiquetas</Text>
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          className="bg-primary px-4 py-2 rounded-full flex-row items-center"
        >
          <Feather name="plus" size={18} color="white" />
          <Text className="text-white font-semibold ml-1">Nova</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tags}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            className={`flex-row items-center p-4 mb-3 rounded-xl ${cardBg} shadow-sm`}
          >
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: item.color + '20' }}
            >
              <Feather name={item.icon as any} size={22} color={item.color} />
            </View>
            <View className="flex-1">
              <Text className={`font-semibold text-base ${textColor}`}>{item.name}</Text>
              <Text className="text-slate-500 text-xs">{item.icon}</Text>
            </View>
            <View className="w-4 h-4 rounded-full mr-4" style={{ backgroundColor: item.color }} />
            <TouchableOpacity onPress={() => handleRemove(item.id, item.name)} className="p-2">
              <Feather name="trash-2" size={18} color="#EA5455" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        ListEmptyComponent={
          <Text className="text-slate-500 text-center mt-10">
            Nenhuma etiqueta criada ainda.
          </Text>
        }
      />

      {/* Modal de Criação */}
      <Modal visible={showModal} transparent animationType="slide">
        <KeyboardAvoidingView
          className="flex-1 justify-end"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity className="flex-1" onPress={() => setShowModal(false)} activeOpacity={1}>
            <View className="flex-1 bg-black/40" />
          </TouchableOpacity>
          <View className={`rounded-t-3xl p-6 pb-10 ${isDark ? 'bg-darkCard' : 'bg-white'}`}>
            <View className="flex-row justify-between items-center mb-5">
              <Text className={`text-xl font-bold ${textColor}`}>Nova Etiqueta</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Feather name="x" size={24} color={isDark ? '#fff' : '#333'} />
              </TouchableOpacity>
            </View>

            {/* Nome */}
            <Text className={`font-semibold mb-2 ${textColor}`}>Nome</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Ex: Estudo, Trabalho..."
              placeholderTextColor={isDark ? '#666' : '#aaa'}
              maxLength={30}
              className={`p-4 rounded-xl mb-5 text-base ${isDark ? 'bg-darkBg text-white' : 'bg-slate-100 text-slate-800'}`}
            />

            {/* Ícone */}
            <Text className={`font-semibold mb-2 ${textColor}`}>Ícone</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
              <View className="flex-row gap-2">
                {TAG_ICONS.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    onPress={() => setNewIcon(icon)}
                    className={`w-12 h-12 rounded-xl items-center justify-center ${
                      newIcon === icon ? 'border-2 border-primary bg-primary/10' : isDark ? 'bg-darkBg' : 'bg-slate-100'
                    }`}
                  >
                    <Feather
                      name={icon as any}
                      size={20}
                      color={newIcon === icon ? '#FF6B6B' : isDark ? '#aaa' : '#666'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Cor */}
            <Text className={`font-semibold mb-2 ${textColor}`}>Cor</Text>
            <View className="flex-row flex-wrap gap-3 mb-6">
              {TAG_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => setNewColor(color)}
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    newColor === color ? 'border-2 border-slate-400' : ''
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {newColor === color && <Feather name="check" size={16} color="white" />}
                </TouchableOpacity>
              ))}
            </View>

            {/* Preview + Salvar */}
            <View className="flex-row items-center mb-4">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: newColor + '25' }}
              >
                <Feather name={newIcon as any} size={20} color={newColor} />
              </View>
              <Text className={`font-semibold ${textColor}`}>{newName || 'Preview'}</Text>
            </View>

            <TouchableOpacity onPress={handleAdd} className="bg-primary p-4 rounded-xl items-center">
              <Text className="text-white font-bold text-base">Criar Etiqueta</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
