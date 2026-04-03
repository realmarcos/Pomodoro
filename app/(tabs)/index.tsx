import { Timer } from '@/components/Timer';
import React from 'react';
import { View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1">
      <Timer />
    </View>
  );
}
