import { fonts } from '@/constants/Fonts';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const Index = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo and solgan */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/PureLogo1.png')} style={{ width: 131, height: 195 }} />
        <Text style={styles.tagline}>Purely about podcasts.</Text>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/register')}>
        <Text style={styles.signupButtonText}>Sign up now</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
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
    flexShrink: 0

  },
  tagline: {
    fontFamily: fonts.Medium,
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
    fontFamily: fonts.Medium,
    color: '#fff',
    fontSize: 18,
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
    fontFamily: fonts.Medium,
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Index;
