import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
// 🌟 NEW: Import Haptics
import * as Haptics from 'expo-haptics';

export default function ToneChip({ tone, isActive, onPress }) {
  
  const handlePress = () => {
    // Trigger a light physical tap
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(); // Call the original function
  };

  return (
    <TouchableOpacity 
      style={[styles.toneChip, isActive && styles.activeToneChip]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={[styles.toneText, isActive && styles.activeToneText]}>
        {tone.charAt(0).toUpperCase() + tone.slice(1)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toneChip: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 25, backgroundColor: '#1E1E1E', borderWidth: 1, borderColor: '#333333' },
  activeToneChip: { backgroundColor: '#0EA5E9', borderColor: '#0EA5E9' },
  toneText: { color: '#A0AEC0', fontWeight: 'bold' },
  activeToneText: { color: '#FFFFFF' }
});