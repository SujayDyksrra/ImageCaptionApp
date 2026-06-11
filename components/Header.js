// components/Header.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header({ title, subtitle }) {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: { 
    alignItems: 'center', 
    marginBottom: 30 
  },
  headerTitle: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    
    textAlign: 'center'
  },
  headerSubtitle: { 
    fontSize: 16, 
    color: '#A0AEC0', 
    textAlign: 'center', 
    marginTop: 8, 
    fontWeight: 'bold' 
  }
});