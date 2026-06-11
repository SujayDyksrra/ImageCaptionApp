
import React, { useState, useContext, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard'; 
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../AuthContext';

// Import Custom Components
import Header from '../components/Header';
import HistoryCard from '../components/HistoryCard';

// Helper function to format the saved history text
const parseCaptionText = (text) => {
  const splitRegex = /###\s*Option\s*\d+:?|\*\*Option\s*\d+:?\*\*?/i;
  let options = text.split(splitRegex);
  options = options.filter(opt => opt.trim().length > 20);
  if (options.length === 0) return [text.replace(/^>\s?/gm, '').trim()];
  return options.map(opt => opt.replace(/^>\s?/gm, '').trim());
};

// --- 4. THE HISTORY SCREEN ---
export default function HistoryScreen() {
// ... rest of your code stays exactly the same
  const { logout } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [expandedId, setExpandedId] = useState(null); 

  useFocusEffect( useCallback(() => { loadHistory(); }, []) );

  const loadHistory = async () => {
    try {
      const savedData = await AsyncStorage.getItem('@caption_history');
      
      if (savedData !== null && JSON.parse(savedData).length > 0) {
        setHistory(JSON.parse(savedData));
      } else {
        const mockData = [
          { id: '1', date: '10/06/2026', tone: 'professional', topic: '8th place nice try', caption: '### Option 1\nFocus on Growth & Teamwork.\n\nProud of the team’s effort at the latest CTF competition! The Homelanders secured 8th place.', imageUri: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500' },
          { id: '2', date: '09/06/2026', tone: 'funny', topic: 'Happy win in eFootball', caption: '### Option 1\nThey named their team "LESGO" but after that seventh goal, I think they meant "let\'s go home..." 💀🚶‍♂️ Safe travels!', imageUri: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500' },
          { id: '3', date: '08/06/2026', tone: 'engaging', topic: 'Graduation day with friends', caption: '### Option 1\nWe finally did it! 🎓 All those late nights in the library finally paid off. On to the next chapter! ✨', imageUri: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500' },
          { id: '4', date: '07/06/2026', tone: 'aesthetic', topic: 'Sunset at the beach', caption: '### Option 1\nChasing the sun. 🌅 Sometimes you just need to pause and appreciate the colors of the sky.', imageUri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500' },
          { id: '5', date: '06/06/2026', tone: 'professional', topic: 'New coding setup', caption: '### Option 1\nWorkspace upgraded. 💻 Ready to tackle the final year project with a clean desk and a fresh mind.', imageUri: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500' },
          { id: '6', date: '05/06/2026', tone: 'funny', topic: 'Coffee addiction', caption: '### Option 1\nI run purely on 1% battery and 99% iced coffee. ☕️ Please don\'t ask me questions until I\'ve finished this cup.', imageUri: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500' }
        ];
        await AsyncStorage.setItem('@caption_history', JSON.stringify(mockData));
        setHistory(mockData);
      }
    } catch (e) { console.error("Failed to load", e); }
  };

  const clearHistory = async () => {
    Alert.alert("Clear", "Delete all saved posts?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await AsyncStorage.removeItem('@caption_history'); setHistory([]); } }
    ]);
  };

  const copyToClipboard = async (textToCopy) => {
    await Clipboard.setStringAsync(textToCopy);
    Alert.alert('Copied!', 'Caption copied to clipboard.');
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;
    const parsedOptions = parseCaptionText(item.caption);

    return (
      <HistoryCard 
        item={item} 
        isExpanded={isExpanded} 
        onToggle={() => setExpandedId(isExpanded ? null : item.id)} 
        onCopy={copyToClipboard} 
        parsedOptions={parsedOptions} 
      />
    );
  };

  return (
    <View style={[styles.container, { paddingTop: 60 }]}>
      <Header title="Your Posts" subtitle="Review and copy your saved captions" />
      
      {/* 🌟 Notice how clean this is now! Only the Clear All button remains. */}
      <View style={styles.historyActionRow}>
        {history.length > 0 && (
          <TouchableOpacity style={styles.actionButton} onPress={clearHistory}>
            <Text style={{ color: '#E1306C', fontWeight: 'bold' }}>Clear All History</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList 
        data={history} 
        keyExtractor={(item) => item.id} 
        renderItem={renderItem} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 80, flexGrow: 1 }} 
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No posts generated yet.</Text>
            <Text style={styles.emptyStateSubText}>Go make some magic! ✨</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: '#121212', 
    padding: 25, 
    paddingTop: 60, 
    paddingBottom: 150 
  },
  historyActionRow: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems: 'center', 
    marginBottom: 20, 
    gap: 15 
  },
  actionButton: { 
    backgroundColor: '#1E1E1E', 
    paddingHorizontal: 15, 
    paddingVertical: 8, 
    borderRadius: 8, 
    borderWidth: 1,
    borderColor: '#333333'
  },
  emptyStateContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: -80 
  },
  emptyStateText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    marginBottom: 8 
  },
  emptyStateSubText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#A0AEC0' 
  }
});