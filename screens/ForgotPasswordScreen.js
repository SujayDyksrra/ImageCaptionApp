
import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// ✅ Add this:
import { AuthContext } from '../AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

// --- THE FORGOT PASSWORD SCREEN ---
export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  // 🌟 NEW: Track password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async () => {
    if (!email || !newPassword) {
      Alert.alert('Missing Fields', 'Please enter your email and a new password.');
      return;
    }

    // Optional: You can also add your password strength regex here!
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword)) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters long and contain one uppercase letter.');
      return;
    }

    try {
      const existingUsersJson = await AsyncStorage.getItem('@registered_users');
      if (existingUsersJson) {
        let usersArray = JSON.parse(existingUsersJson);
        
        const userIndex = usersArray.findIndex(u => u.email === email.toLowerCase());
        
        if (userIndex !== -1) {
          usersArray[userIndex].password = newPassword;
          await AsyncStorage.setItem('@registered_users', JSON.stringify(usersArray));
          
          Alert.alert('Success! 🔐', 'Your password has been reset. You can now log in.', [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]);
          return;
        }
      }
      
      Alert.alert('Error', 'No account found with that email address.');
      
    } catch (error) {
      console.error("Failed to reset password", error);
      Alert.alert('Error', 'Failed to reset password.');
    }
  };

  return (
    <View style={styles.loginContainer}>
      <View style={styles.loginCenterWrapper}>
        <View style={styles.loginCard}>
          <Header title="Reset Password 🔐" subtitle="Enter your email to create a new password." />
          
          <Text style={styles.label}>Account Email</Text>
          <TextInput 
            style={styles.input} 
            placeholder="student@utem.edu" 
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>New Password</Text>
          {/* 🌟 NEW: Wrapped the input in our eye-icon container */}
          <View style={styles.passwordContainer}>
            <TextInput 
              style={styles.passwordInput} 
              placeholder="Enter new password" 
              placeholderTextColor="#888"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
              <Text style={{fontSize: 20}}>{showPassword ? '👁️' : '🙈'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleReset}>
            <Text style={styles.loginButtonText}>Reset Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
            <Text style={styles.linkText}>Back to Login</Text>
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