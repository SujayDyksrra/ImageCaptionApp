import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share, Alert } from 'react-native';
// 🌟 NEW: Import Haptics
import * as Haptics from 'expo-haptics';

export default function OptionCard({ optionText, index, onCopy }) {
  
  const handleCopy = () => {
    // 🌟 Trigger a medium vibration for success
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onCopy(optionText);
  };

  const handleShare = async () => {
    try {
      // 🌟 Trigger a medium vibration for success
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await Share.share({ message: optionText });
    } catch (error) {
      Alert.alert('Error', 'Failed to open the share menu.');
    }
  };

  return (
    <View style={styles.optionCard}>
      <Text style={styles.optionNumber}>Option {index + 1}</Text>
      <Text style={styles.resultText}>{optionText}</Text>
      
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
          <Text style={styles.copyButtonText}>Copy 📋</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>Share 📤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  optionCard: { backgroundColor: '#1E1E1E', padding: 20, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#333333' },
  optionNumber: { fontSize: 14, fontWeight: 'bold', color: '#0EA5E9', marginBottom: 12, textTransform: 'uppercase' },
  resultText: { fontSize: 16, color: '#FFFFFF', lineHeight: 24 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  copyButton: { flex: 1, backgroundColor: '#2A2A2A', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  copyButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  shareButton: { flex: 1, backgroundColor: '#0EA5E9', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  shareButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }
});