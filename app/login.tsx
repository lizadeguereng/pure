import { router } from 'expo-router';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const LoginScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
      <Image source={require('../assets/images/PureLogo2.png')} style={{ width: 131, height: 195 }} />
      </View>

      {/* Username Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Username</Text>
        <TextInput style={styles.input} placeholder="Enter your username" />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
        />
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.signInButton}>
        <Text style={styles.signInButtonText}>Sign in</Text>
      </TouchableOpacity>

      {/* New Here Link */}
      <TouchableOpacity>
        <Text style={styles.newHereText} onPress={() => {router.push('/register')}}>New Here?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    fontSize: 100,
    fontWeight: 'bold',
    color: '#000',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#e5e5e5',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#000',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#000',
    textAlign: 'right',
    marginTop: 5,
  },
  signInButton: {
    width: '60%',
    height: 50,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  newHereText: {
    fontSize: 16,
    color: '#000',
    marginTop: 20,
  },
});

export default LoginScreen;
