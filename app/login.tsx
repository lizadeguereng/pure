import { router } from 'expo-router';
import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import {db} from '../firebaseConfig'; // firebaseconfig file
import {ref, get, child} from 'firebase/database'; // databse connection

const LoginScreen: React.FC = () => {

  const [username, setUsername] = useState(''); // username property
  const [password, setPassword] = useState(''); // password property

  // this method is purley for testing purposes - will be removed during final production
  const testFirebaseConnection = async () => {
    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, 'users'));
  
      if (snapshot.exists()) {
        console.log('Data retrieved:', snapshot.val());
        Alert.alert('Firebase Test', 'Successfully connected to Firebase!');
      } else {
        console.log('No data available');
        Alert.alert('Firebase Test', 'No data found in the database.');
      }
    } catch (error) {
      console.error('Error testing Firebase:', error);
      Alert.alert('Firebase Test Failed');
    }
  };

  // login ever
  const handleLogin = async () => {
    try {
      if (!username || !password) {
        Alert.alert('Error', 'Please enter both username and password.'); // missing fields alert
        return;
      }
  
      const dbRef = ref(db); // creating a variable to make a call to the database
      console.log('Fetching data from Firebase...');
      const snapshot = await get(child(dbRef, 'users')); // get from table users
  
      if (snapshot.exists()) { // if database is not empty
        const users = snapshot.val();
        console.log('Data retrieved successfully:', users); // pulls all the users inside the table
  
        const matchedUser = Object.values(users).find(
          (user: any) => user.username === username && user.password === password // find the user from the input fields in the database (compare for a match)
        );
  
        if (matchedUser) { // if the user is found
          console.log('Matched user:', matchedUser);
          Alert.alert('Login Successful', `Welcome back!`); // display a temporty notifcation - only for testing purposes
          router.push('/home'); // redirect to home
        }
      } else { // if no  matching results
        console.log('No data found in the database.'); 
        Alert.alert('Login Failed', 'No users found in the database.');
      }
    } catch (error) {
      console.error('Error logging in:');
      Alert.alert('Login Error', 'An error occurred during login. Please try again.');
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
      <Image source={require('../assets/images/PureLogo2.png')} style={{ width: 131, height: 195 }} />
      </View>

      {/* Username Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Username</Text>
        <TextInput style={styles.input} placeholder="Enter your username" value={username} onChangeText={setUsername}/>
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry value={password} onChangeText={setPassword}
        />
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
        <Text style={styles.signInButtonText}>Sign in</Text>
      </TouchableOpacity>

      {/* Takes you to the register page */}
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
  // logo div styling
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    fontSize: 100,
    fontWeight: 'bold',
    color: '#000',
  },
  // input fields div styling
  inputContainer: {
    width: '93%',
    marginBottom: 20,
  },
  // input labels styling
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  // input fields styling
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#e5e5e5',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#000',
  },
  // forgot password link
  forgotPassword: {
    fontSize: 14,
    color: '#000',
    textAlign: 'right',
    marginTop: 5,
  },
  // submit button
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
  // text inside submit button
  signInButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  // register link
  newHereText: {
    fontSize: 16,
    color: '#000',
    marginTop: 20,
  },
});

export default LoginScreen;
