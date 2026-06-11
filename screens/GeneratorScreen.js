
import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../AuthContext';

// Import Custom Components
import Header from '../components/Header';
import ToneChip from '../components/ToneChip';
import OptionCard from '../components/OptionCard';

// ⚠️ Paste your API Key here since it moved out of App.js
const API_KEY = 'YOUR_API_KEY_HERE'; 

// Helper function to format the AI text
const parseCaptionText = (text) => {
  const splitRegex = /###\s*Option\s*\d+:?|\*\*Option\s*\d+:?\*\*?/i;
  let options = text.split(splitRegex);
  options = options.filter(opt => opt.trim().length > 20);
  if (options.length === 0) return [text.replace(/^>\s?/gm, '').trim()];
  return options.map(opt => opt.replace(/^>\s?/gm, '').trim());
};

// --- 3. THE GENERATOR SCREEN ---
export default function GeneratorScreen({ navigation }) {
// ... rest of your code stays exactly the same
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null); 
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('engaging');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const tones = ['engaging', 'funny', 'aesthetic', 'professional'];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: true,
      quality: 0.5, 
      base64: true, 
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); 
      setImageBase64(result.assets[0].base64); 
    }
  };

  const saveToHistory = async (img, context, selectedTone, generatedCaption) => {
    try {
      const newPost = {
        id: Date.now().toString(),
        imageUri: img,
        topic: context,
        tone: selectedTone,
        caption: generatedCaption,
        date: new Date().toLocaleDateString()
      };
      const existingHistory = await AsyncStorage.getItem('@caption_history');
      let historyArray = existingHistory ? JSON.parse(existingHistory) : [];
      historyArray.unshift(newPost);
      await AsyncStorage.setItem('@caption_history', JSON.stringify(historyArray));
    } catch (e) {
      console.error("Failed to save", e);
    }
  };

  const handleGenerate = async () => {
    if (!imageBase64) { Alert.alert('Missing Image', 'Please select a photo first!'); return; }
    if (!topic.trim()) { Alert.alert('Missing Topic', 'Please tell us what the post is about!'); return; }

    setLoading(true); setCaption('');
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${API_KEY}`;

    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: `Write 3 distinct ${tone} social media caption options for this image. Context: ${topic}. Format each option clearly starting with "### Option 1:", "### Option 2:", etc.` },
              { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } }
            ]
          }]
        })
      });

      const data = await response.json();
      if (data.error) { Alert.alert('Google AI Error', data.error.message); setLoading(false); return; }
      
      if (data.candidates && data.candidates.length > 0) {
        if (data.candidates[0].finishReason === 'SAFETY') {
          Alert.alert('Blocked by AI', 'The AI safety filters flagged this image.');
          setLoading(false); return;
        }
        const textPart = data.candidates[0]?.content?.parts?.[0]?.text;
        if (textPart) {
          const aiCaption = textPart.trim();
          setCaption(aiCaption);
          await saveToHistory(imageUri, topic, tone, aiCaption);
        } else {
          Alert.alert('Error', 'Empty response from AI.');
        }
      } else { throw new Error('Unexpected format'); }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate caption.');
    } finally { setLoading(false); } 
  };

  const copyToClipboard = async (textToCopy) => {
    await Clipboard.setStringAsync(textToCopy);
    Alert.alert('Copied!', 'Caption copied to clipboard.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Header title="📸 AI Image Captioner" subtitle="Upload an image to get started" />
      
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>{imageUri ? 'Change Image 🔄' : 'Select an Image 🖼️'}</Text>
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="contain" />}

      <Text style={styles.label}>What is the context of this photo?</Text>
      <TextInput style={styles.input} placeholder="e.g., Hiking at sunrise..." placeholderTextColor="#888" value={topic} onChangeText={setTopic} />

      <Text style={styles.label}>Select Tone:</Text>
      <View style={styles.toneContainer}>
        {tones.map((t) => (
          <ToneChip key={t} tone={t} isActive={tone === t} onPress={() => setTone(t)} />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGenerate} disabled={loading}>
        {loading ? <ActivityIndicator color="#006064" /> : <Text style={styles.buttonText}>Analyze & Generate ✨</Text>}
      </TouchableOpacity>

      {caption !== '' && (
        <View style={styles.resultsContainer}>
          <View style={styles.divider} />
          <Text style={styles.resultsHeader}>✨ Your Captions</Text>
          {parseCaptionText(caption).map((optText, index) => (
            <OptionCard key={index} optionText={optText} index={index} onCopy={copyToClipboard} />
          ))}
        </View>
      )}
      <View style={{ height: 80 }} /> 
    </ScrollView>
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
  imageButton: { 
    backgroundColor: '#1E1E1E', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#0EA5E9' 
  },
  imageButtonText: { 
    color: '#0EA5E9', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  previewImage: { 
    width: '100%', 
    height: 280, 
    borderRadius: 12, 
    marginBottom: 25, 
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333333'
  },
  label: { 
    fontWeight: '600', 
    fontSize: 16, 
    color: '#A0AEC0', 
    marginTop: 10, 
    marginBottom: 8 
  },
  input: { 
    backgroundColor: '#2A2A2A', 
    color: '#FFFFFF',
    borderRadius: 12, 
    padding: 16, 
    fontSize: 16, 
    marginBottom: 20, 
    borderWidth: 1,
    borderColor: '#333333'
  },
  toneContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10, 
    marginBottom: 30 
  },
  button: { 
    backgroundColor: '#0EA5E9', 
    padding: 18, 
    borderRadius: 12, 
    alignItems: 'center', 
  },
  buttonText: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  resultsContainer: { 
    marginTop: 10, 
    paddingBottom: 20 
  },
  divider: { 
    height: 1, 
    backgroundColor: '#333333', 
    marginVertical: 30, 
  },
  resultsHeader: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    marginBottom: 20, 
    textAlign: 'center' 
  }
});