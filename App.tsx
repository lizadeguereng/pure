import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Welcome from "./app/index";
import Login from "./app/login";
import Register from "./app/register";
import Home from './app/home';
import Search from './app/search';
import PodcastProfile from './app/podcastprofile';
import PodcastPlayer from './app/podcastplayer';
import Account from './app/account';



const Stack = createNativeStackNavigator();

const App = () => {
  return (
    //  the navigation for the application
    // listed below are the different pages so far
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false,}}>
        <Stack.Screen name={"Welcome"} component={Welcome}/>
        <Stack.Screen name={"Login"} component={Login}/>
        <Stack.Screen name={"Register"} component={Register}/>
        <Stack.Screen name={"Home"} component={Home}/>
        <Stack.Screen name={"Search"} component={Search}/>
        <Stack.Screen name={"PodcastProfile"} component={PodcastProfile}/>
        <Stack.Screen name={"PodcastPlayer"} component={PodcastPlayer}/>
        <Stack.Screen name={"Account"} component={Account}/>
        <Stack.Screen name={"PodcasterProfile"} component={PodcastProfile}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
} 

export default App

const styles = StyleSheet.create({})