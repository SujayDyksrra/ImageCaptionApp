// components/Footer.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Footer({ text }) {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: { 
    padding: 20, 
    alignItems: 'center', 
    
  },
  footerText: { 
    color: '#718096', 
    fontWeight: 'bold', 
    opacity: 0.8 
  }
});