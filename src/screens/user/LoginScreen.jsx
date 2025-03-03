import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
  const [secureText, setSecureText] = useState(true);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.activeTab}>Log in</Text>
        <Text style={styles.inactiveTab}>Sign up</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Your Email</Text>
        <TextInput style={styles.input} placeholder="Enter your email" />
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput 
            style={[styles.input, styles.fullWidthInput]} 
            placeholder="Enter your password" 
            secureTextEntry={secureText} 
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <Ionicons style={{marginLeft:-30, zIndex:1000, marginBottom:10}} name={secureText ? "eye-off" : "eye"} size={20} color="#aaa" />
          </TouchableOpacity>
        </View>
        <Text style={styles.forgotPassword}>Forget password</Text>
      </View>
      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>Or</Text>
      <TouchableOpacity style={styles.loginWithButton}>
        <Ionicons name="logo-apple" size={20} color="black" />
        <Text style={styles.loginWithText}>Login with Apple</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginWithButton}>
        <Ionicons name="logo-google" size={20} color="black" />
        <Text style={styles.loginWithText}>Login with Google</Text>
      </TouchableOpacity>
      <Text style={styles.signupText}>
        Don’t have an account? <Text style={styles.signupLink}>Sign up</Text>
      </Text>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  backButton: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  activeTab: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#648DDB',
    borderBottomWidth: 2,
    borderBottomColor: '#648DDB',
    marginRight: 20,
  },
  inactiveTab: {
    fontSize: 18,
    color: 'gray',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  fullWidthInput: {
    flex: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  forgotPassword: {
    textAlign: 'right',
    color: '#648DDB',
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: '#648DDB',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#aaa',
  },
  loginWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  loginWithText: {
    marginLeft: 10,
    fontSize: 16,
  },
  signupText: {
    textAlign: 'center',
    marginTop: 20,
  },
  signupLink: {
    color: '#648DDB',
    fontWeight: 'bold',
  },
};

export default LoginScreen;