import React, { useState, useCallback, createContext, useContext } from 'react';
import { 
  StyleSheet, Text, TextInput, TouchableOpacity, View, 
  ScrollView, ActivityIndicator, Alert, Image, FlatList 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// --- CUSTOM COMPONENTS ---
import Header from './components/Header';
import Footer from './components/Footer';
import ToneChip from './components/ToneChip';
import OptionCard from './components/OptionCard';
import HistoryCard from './components/HistoryCard';
import ProfileScreen from './screens/ProfileScreen';
// Screen Imports
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import GeneratorScreen from './screens/GeneratorScreen';
import HistoryScreen from './screens/HistoryScreen';


// Context Import
import { AuthContext } from './AuthContext';


const API_KEY = 'YOUR_API_KEY_HERE'; 



const parseCaptionText = (text) => {
  const splitRegex = /###\s*Option\s*\d+:?|\*\*Option\s*\d+:?\*\*?/i;
  let options = text.split(splitRegex);
  options = options.filter(opt => opt.trim().length > 20);
  if (options.length === 0) return [text.replace(/^>\s?/gm, '').trim()];
  return options.map(opt => opt.replace(/^>\s?/gm, '').trim());
};















// --- 6. THE NAVIGATORS ---
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainAppTabs() {
  return (
    <Tab.Navigator screenOptions={{ 
      headerShown: false, 
      tabBarActiveTintColor: '#0EA5E9', // Electric Blue accent
      tabBarInactiveTintColor: '#888888',
      tabBarStyle: { 
        backgroundColor: '#1E1E1E', // Dark surface color
        height: 65, 
        paddingBottom: 10, 
        paddingTop: 10, 
        borderTopWidth: 1, 
        borderTopColor: '#333333', // Subtle dark border
        elevation: 0 // Removed shadow for flat minimalist look
      },
      tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold' }
    }}>
      <Tab.Screen name="Create" component={GeneratorScreen} options={{ tabBarIcon: () => <Text style={{fontSize: 22}}>✨</Text> }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarIcon: () => <Text style={{fontSize: 22}}>📚</Text> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: () => <Text style={{fontSize: 22}}>👤</Text> }} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          {/* 🌟 NEW: Add the Forgot Password Screen here */}
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      ) : (
        <Stack.Screen name="Main" component={MainAppTabs} />
      )}
    </Stack.Navigator>
  );
}

// --- THE ROOT APP ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // 🌟 NEW: Track exactly whose account is active
  const [currentUser, setCurrentUser] = useState(null); 

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      currentUser, // Make it available to the rest of the app
      login: (email) => { 
        setIsAuthenticated(true);
        setCurrentUser(email); // Save the email when they log in
      },
      logout: () => { 
        setIsAuthenticated(false);
        setCurrentUser(null); // Clear the email when they log out
      }
    }}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

// --- 6. STYLES (MINIMALIST DARK THEME) ---
const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: '#121212', // Deep Dark Background
    padding: 25, 
    paddingTop: 60, 
    paddingBottom: 150 
  },
});