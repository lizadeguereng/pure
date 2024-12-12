import { router } from 'expo-router';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const RegisterScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Logo and Welcome Message */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
        <Image source={require('../assets/images/PureLogo3.png')} style={{ width: 150, height: 150 }} />
        </View>
        <Text style={styles.title}>Welcome to Pure!</Text>
      </View>

      {/* Input Fields */}
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="Enter your email" keyboardType="email-address" />

        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} placeholder="Enter your name" />

        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input} placeholder="Choose a username" />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          secureTextEntry
        />
      </View>

      {/* Create Account Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Create account</Text>
      </TouchableOpacity>

      {/* Already a Member Link */}
      <TouchableOpacity>
        <Text style={styles.footerText} onPress={() => router.push("/login")}>Already a member?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#000',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    bottom: -25,
  },
  form: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#e5e5e5',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    color: '#000',
  },
  button: {
    width: '60%',
    height: 50,
    backgroundColor: '#000',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 16,
    color: '#000',
  },
});

export default RegisterScreen;
