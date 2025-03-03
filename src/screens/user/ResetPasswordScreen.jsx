import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ResetPasswordScreen = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Check your email</Text>
      <Text style={styles.subtitle}>We sent a reset link to your email ... enter 5 digit code that was sent to your email</Text>
      <View style={styles.codeInputContainer}>
        {[...Array(5)].map((_, index) => (
          <TextInput key={index} style={styles.codeInput} maxLength={1} keyboardType="numeric" />
        ))}
      </View>
      <TouchableOpacity style={styles.verifyButton}>
        <Text style={styles.verifyButtonText}>Verify Code</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  codeInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
  },
  verifyButton: {
    backgroundColor: '#648DDB',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
};

export default ResetPasswordScreen;
