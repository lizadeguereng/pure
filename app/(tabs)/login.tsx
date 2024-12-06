import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Login = () => {
  return (
    <View style={styles.container}>
      {/* Logo and Tagline */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>P</Text>
        <Text style={styles.tagline}>Purely about podcasts.</Text>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.signupButton} onPress={() => alert('Sign up')}>
        <Text style={styles.signupButtonText}>Sign up now</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={() => alert('Login')}>
        <Text style={styles.loginButtonText}>Login</Text>
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
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    fontSize: 100,
    fontWeight: 'bold',
    color: '#000',
  },
  tagline: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
  },
  signupButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 20,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    borderColor: '#000',
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;
