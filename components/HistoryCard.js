import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function HistoryCard({ item, isExpanded, onToggle, onCopy, parsedOptions }) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onToggle} style={styles.historyCard}>
      {item.imageUri && (
        <Image source={{ uri: item.imageUri }} style={styles.historyImage} resizeMode="contain" />
      )}
      <View style={styles.historyContent}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTone}>{item.tone.toUpperCase()}</Text>
          <Text style={styles.historyDate}>{item.date}</Text>
        </View>
        <Text style={styles.historyTopic}>Context: {item.topic}</Text>
        
        {isExpanded ? (
          <View style={styles.expandedSection}>
            <View style={styles.dividerLight} />
            {parsedOptions.map((optText, idx) => (
              <View key={idx} style={styles.historyOptionBlock}>
                <Text style={styles.optionNumber}>Option {idx + 1}</Text>
                <Text style={styles.historyCaption}>{optText}</Text>
                <TouchableOpacity style={styles.copyButton} onPress={() => onCopy(optText)}>
                  <Text style={styles.copyButtonText}>Copy This Caption 📋</Text>
                </TouchableOpacity>
              </View>
            ))}
            <Text style={styles.collapseHint}>Tap card to collapse ⬆️</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.historyCaption} numberOfLines={3}>{parsedOptions[0]}</Text>
            <Text style={styles.expandHint}>Tap to view all options ⬇️</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  historyCard: { backgroundColor: '#1E1E1E', borderRadius: 12, marginBottom: 25, overflow: 'hidden', borderWidth: 1, borderColor: '#333333' },
  historyImage: { width: '100%', height: 220, backgroundColor: '#121212' },
  historyContent: { padding: 20 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' },
  historyTone: { fontSize: 12, fontWeight: 'bold', color: '#FFFFFF', backgroundColor: '#0EA5E9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, overflow: 'hidden' },
  historyDate: { fontSize: 13, color: '#A0AEC0', fontWeight: 'bold' },
  historyTopic: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 10 },
  historyCaption: { fontSize: 15, color: '#CBD5E1', lineHeight: 24 },
  optionNumber: { fontSize: 14, fontWeight: 'bold', color: '#0EA5E9', marginBottom: 12, textTransform: 'uppercase' },
  copyButton: { marginTop: 15, backgroundColor: '#2A2A2A', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  copyButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  expandHint: { color: '#0EA5E9', fontWeight: 'bold', marginTop: 12, textAlign: 'center', opacity: 0.8 },
  collapseHint: { color: '#0EA5E9', fontWeight: 'bold', marginTop: 20, textAlign: 'center', opacity: 0.8 },
  expandedSection: { marginTop: 10 },
  dividerLight: { height: 1, backgroundColor: '#333333', marginVertical: 15 },
  historyOptionBlock: { marginBottom: 25 }
});