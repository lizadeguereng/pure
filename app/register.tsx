import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ref, push, set } from "firebase/database";
import { db } from "../firebaseConfig"; 

const Register: React.FC = () => {
  const [email, setEmail] = useState(''); // email adress property
  const [name, setName] = useState(''); // name property
  const [username, setUsername] = useState(''); // username property
  const [password, setPassword] = useState(''); // password property
  const [confirmPassword, setConfirmPassword] = useState(''); // confirm password property

  //register event
  const handleRegister = async () => {
    if (!email || !name || !username || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required."); // if a field is empty notfiy the user
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match."); // if the password does not match notify the user
      return;
    }

    // email restrictions 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "PLease enter a valid email address."); // if the email is invalid notify the user
      return;
    }

    // password restrictions
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // at least 8 characters, 1 letter and 1 number
    if(!passwordRegex.test(password)) {
      Alert.alert("Error", "Your password is not at least 8 characters long, or does not meet the requirements of one number or special character."); // if the password is invalid notify the user
      return;}

    try {
      // Creating a new user reference with a unique key
      const newUserRef = push(ref(db, "users"));
      await set(newUserRef, {
        email,
        name,
        username,
        password,
      });

      // for testing purposes only - will remove after testing 
      Alert.alert("Success", "User registered successfully!");
      // Navigate to the login page after registration
      router.push("/login");
    } catch (error) {
      console.error("Error adding user:", error); // notify user if login failed
      Alert.alert("Error", "Failed to register user. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
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
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Choose a username"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {/* Register user button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Create account</Text>
      </TouchableOpacity>

      {/* Takes user back to login page button */}
      <TouchableOpacity>
        <Text style={styles.footerText} onPress={() => router.push("/login")}>Already a member?</Text>
      </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// styling for this page
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
  // logo styling
  logoContainer: {
    marginBottom: 10,
  },
  // welcome message
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    bottom: -30,
  },
  // form input containter
  form: {
    width: '85%',
    marginBottom: 20,
  },
  // labels for the input fields
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  // input fields
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
  // sumbmit button
  button: {
    width: '60%',
    height: 50,
    backgroundColor: '#000',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  // submit button text
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

export default Register;
