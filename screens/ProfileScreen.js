import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import our custom components (notice the '../' to go up one folder!)
import Header from '../components/Header';

// Import the Context from App.js
// ✅ Add this:
import { AuthContext } from '../AuthContext';

export default function ProfileScreen() {
  const { logout, currentUser } = useContext(AuthContext);

  const deleteAccount = () => {
    if (currentUser === 'student@utem.edu') {
      Alert.alert("Admin Account", "You cannot delete the master university account.");
      return;
    }

    Alert.alert(
      "Delete Account ⚠️", 
      "Are you absolutely sure? This will permanently erase your account credentials and history from this device.", 
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete Forever", style: "destructive", onPress: async () => {
            try {
              const existingUsersJson = await AsyncStorage.getItem('@registered_users');
              if (existingUsersJson) {
                let usersArray = JSON.parse(existingUsersJson);
                usersArray = usersArray.filter(user => user.email !== currentUser);
                await AsyncStorage.setItem('@registered_users', JSON.stringify(usersArray));
              }

              await AsyncStorage.removeItem('@caption_history');
              logout();
            } catch (error) {
              console.error("Failed to delete account", error);
            }
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Your Profile 👤" subtitle="Manage your account settings" />
      
      <View style={styles.profileCard}>
        <Text style={styles.profileLabel}>Logged in as:</Text>
        <Text style={styles.profileEmail}>{currentUser}</Text>

        <View style={styles.dividerLight} />

        <TouchableOpacity style={styles.profileLogoutButton} onPress={logout}>
          <Text style={styles.profileLogoutText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileDeleteButton} onPress={deleteAccount}>
          <Text style={styles.profileDeleteText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// We moved the Profile-specific styles here to keep App.js clean!
const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: '#121212', 
    padding: 25, 
    paddingTop: 60, 
    paddingBottom: 150 
  },
  profileCard: { 
    backgroundColor: '#1E1E1E', 
    padding: 30, 
    borderRadius: 16, 
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#333333'
  },
  profileLabel: { 
    fontSize: 16, 
    color: '#A0AEC0', 
    fontWeight: '600', 
    marginBottom: 5 
  },
  profileEmail: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    marginBottom: 20 
  },
  profileLogoutButton: { 
    backgroundColor: '#2A2A2A', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 15, 
  },
  profileLogoutText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  profileDeleteButton: { 
    backgroundColor: 'transparent', 
    borderWidth: 1,
    borderColor: '#EF4444', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 15, 
  },
  profileDeleteText: { 
    color: '#EF4444', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  dividerLight: {
    height: 1,
    backgroundColor: '#333333',
    marginVertical: 15
  }
});