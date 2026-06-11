
import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// ✅ Add this:
import { AuthContext } from '../AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

// --- 1. THE REGISTER SCREEN ---
export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

 const handleRegister = async () => {
    // 1. Check for empty fields
    if (!email || !password || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

  
   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a properly formatted email address.');
      return;
    }

    // 2. Check if passwords match
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    // 3. Password Strength Validation
    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters long.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      Alert.alert('Weak Password', 'Password must contain at least one uppercase letter (A-Z).');
      return;
    }

    
    try {
      const existingUsersJson = await AsyncStorage.getItem('@registered_users');
      let usersArray = existingUsersJson ? JSON.parse(existingUsersJson) : [];

      const userExists = usersArray.some(u => u.email === email.toLowerCase());
      if (userExists) {
        Alert.alert('Error', 'An account with this email already exists.');
        return;
      }

      usersArray.push({ email: email.toLowerCase(), password });
      await AsyncStorage.setItem('@registered_users', JSON.stringify(usersArray));

      Alert.alert('Success! 🎉', 'Account created successfully. You can now log in.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error("Failed to register", error);
      Alert.alert('Error', 'Failed to save account.');
    }
  };

  return (
    <View style={styles.loginContainer}>
      <View style={styles.loginCenterWrapper}>
        <View style={styles.loginCard}>
          <Header title="Create Account ✨" subtitle="Join to start generating AI captions." />
          
          <Text style={styles.label}>Email</Text>
          <TextInput 
            style={styles.input} 
            placeholder="new.student@utem.edu" 
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput 
              style={styles.passwordInput} 
              placeholder="••••••••" 
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
              <Text style={{fontSize: 20}}>{showPassword ? '👁️' : '🙈'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput 
              style={styles.passwordInput} 
              placeholder="••••••••" 
              placeholderTextColor="#888"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Text style={{fontSize: 20}}>{showConfirmPassword ? '👁️' : '🙈'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
            <Text style={styles.loginButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>Already have an account? Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer text="© 2026 UTeM - AI Caption Generator Project" />
    </View>
  );
}



const styles = StyleSheet.create({
  loginContainer: { 
    flex: 1, 
    backgroundColor: '#121212', 
    justifyContent: 'space-between' 
  },
  loginCenterWrapper: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 25 
  },
  loginCard: { 
    backgroundColor: '#1E1E1E', 
    padding: 30, 
    borderRadius: 16, 
    borderWidth: 1,
    borderColor: '#333333',
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
  passwordContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#2A2A2A', 
    borderRadius: 12, 
    marginBottom: 20, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333'
  },
  passwordInput: { 
    flex: 1, 
    padding: 16, 
    fontSize: 16,
    color: '#FFFFFF'
  },
  eyeIcon: { 
    padding: 15 
  },
  loginButton: { 
    backgroundColor: '#0EA5E9', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10, 
  },
  loginButtonText: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: 'bold' 
  }, 
  linkButton: { 
    marginTop: 25, 
    alignItems: 'center' 
  },
  linkText: { 
    color: '#0EA5E9', 
    fontWeight: '600', 
    fontSize: 15, 
  }
});