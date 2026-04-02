import { Timer } from '@/components/Timer';
import { ThemeContext } from '@/contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const SIZE = width * 0.7;
const STROKE_WIDTH = 10;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const MIN_MINUTES = 10;
const MAX_MINUTES = 120;

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <View className="flex-1">
      {/* Barra de atalhos para navegação */}
      <View className="flex-row justify-between px-6 pt-4 pb-2">
        <TouchableOpacity 
          onPress={() => router.push('/history')}
          className="flex-row items-center space-x-2 bg-slate-200 dark:bg-slate-800 px-4 py-2 rounded-full"
        >
          <Feather name="clock" size={18} color={isDark ? "#FFF" : "#333"} />
          <Text className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          // onPress={() => router.push('/settings')}
          className="flex-row items-center space-x-2 bg-slate-200 dark:bg-slate-800 px-4 py-2 rounded-full"
        >
          <Feather name="settings" size={18} color={isDark ? "#FFF" : "#333"} />
          <Text className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>Ajustes</Text>
        </TouchableOpacity>
      </View>

      {/* Componente central do Pomodoro */}
      <Timer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center'
  },
  timerWrapper: { width: SIZE, height: SIZE, justifyContent: 'center', alignItems: 'center' },
  textContainer: { position: 'absolute', alignItems: 'center', width: '100%' },
  timerText: { fontSize: 60, fontWeight: 'bold', color: '#333', marginVertical: -10 },
  sessionText: { fontSize: 14, color: '#BBB', marginTop: 5 },
  adjustButton: { padding: 10, width: 60, alignItems: 'center' },
  adjustText: { fontSize: 30, color: '#FF6B6B', fontWeight: '300' },
  instructionText: { marginTop: 30, marginBottom: 50, color: '#888' },
  controlsRow: { flexDirection: 'row', alignItems: 'center', gap: 30 },
  mainButton: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#FF6B6B',
    justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8
  },
  secondaryButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  playIcon: { color: '#FFF', fontSize: 32, marginLeft: 4 },
  iconSmall: { fontSize: 22, color: '#666' },
  stopSquare: { width: 16, height: 16, backgroundColor: '#DDD', borderRadius: 2 },
});
