
import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// ✅ Add this:
import { AuthContext } from '../AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

// --- 2. THE LOGIN SCREEN ---
export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    const lowerEmail = email.toLowerCase();
    
    if (lowerEmail === 'student@utem.edu' && password === '123456') {
      login(lowerEmail); 
      return;
    }

    try {
      const existingUsersJson = await AsyncStorage.getItem('@registered_users');
      if (existingUsersJson) {
        const usersArray = JSON.parse(existingUsersJson);
        const validUser = usersArray.find(u => u.email === lowerEmail && u.password === password);
        
        if (validUser) {
          login(lowerEmail);
          return;
        }
      }
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    } catch (error) {
      console.error("Login check failed", error);
    }
  };

  return (
    <View style={styles.loginContainer}>
      <View style={styles.loginCenterWrapper}>
        <View style={styles.loginCard}>
          <Header title="Welcome Back 👋" subtitle="Sign in to access your AI captions." />
          
          <Text style={styles.label}>Email</Text>
          <TextInput 
            style={styles.input} 
            placeholder="student@utem.edu" 
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


          
<TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
            <Text style={styles.loginButtonText}>Log In 🚀</Text>
          </TouchableOpacity>

          {/* 🌟 NEW: Forgot Password Link */}
          <TouchableOpacity style={{alignItems: 'center', marginTop: 15}} onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={{color: '#555555', fontWeight: 'bold'}}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Don't have an account? Register</Text>
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