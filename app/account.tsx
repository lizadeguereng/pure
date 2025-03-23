import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ref, get } from 'firebase/database';
import { db, auth } from '../firebaseConfig';

// this page is where the user can view their account information
const Account: React.FC = () => {
  const router = useRouter();

  const [userData, setUserData] = useState({
    name: "", // user's name
    username: "", // user's username
    email: "", // user's email
    profileimgurl: "", // user's profile image
  })

  // fetch user data from the database
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const snapshot = await get(ref(db, `users/${user.uid}`));
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: userData.profileimgurl || "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg" }} // Replace with user's image URL
          style={styles.profileImage}
        />
        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.label}>Username</Text>
        <Text style={styles.username}>{userData.username}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.email}>{userData.email}</Text>
      </View>

      {/* Account Settings */}
      <View style={styles.settingsContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Terms & Agreements</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Contact Pure</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
          <Text style={styles.buttonText}>Log out</Text>
        </TouchableOpacity>
      </View>


      {/* Playback Controls */}
      <View style={styles.playbackContainer}>
        <Image
          source={{ uri: "https://i1.sndcdn.com/artworks-ILOJyoq0yf1xI1Jj-EMULfg-t500x500.jpg" }}
          style={styles.albumArt}
        />
        <View>
          <Text style={styles.trackTitle}>Going Back to Basics</Text>
          <View style={styles.progress}>
            <Text style={styles.progressTime1}>0:50</Text>
            <Text style={styles.progressTime2}>20:39</Text>
          </View>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity>
            <Ionicons style={styles.rewind} name="play-skip-back-outline" size={35} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="pause-circle" size={50} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons style={styles.fastForward} name="play-skip-forward-outline" size={35} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Ionicons name="home-outline" size={30} color="#D9D9D9" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/search")}>
          <Ionicons name="search-outline" size={30} color="#D9D9D9" />
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.active}>
            <Ionicons name="person" size={26} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "left",
  },
  profileContainer: {
    alignItems: "left",
    marginBottom: 20,
  },
  // profile image styling
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  // name at the top
  name: {
    fontSize: 20,
    fontWeight: "bold",
    top: -70,
    left: 115,
    fontFamily: "Georgia", // personal reminder: remove for coolvectiva font
  },
  // username styling
  username: {
    color: "#000",
    fontSize: 14,
    marginBottom: 10,
  },
  // username label styling
  label: {
    marginBottom: 5,
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
  },
  // email label styling
  email: {
    fontSize: 14,
    color: "#000",
    marginBottom: 15,
  },
  // account settings container styling
  settingsContainer: {
    width: "100%",
    marginTop: -10,
  },
  // account settings button styling
  button: {
    width: "50%",
    paddingVertical: 5,
    borderWidth: 1.3,
    borderColor: "black",
    borderRadius: 25,
    marginBottom: 17,
    alignItems: "center",
  },
  // button text styling
  buttonText: {
    fontSize: 14,
    fontWeight: "600"
  },
  // playback container styling (above the navigation bar
  playbackContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    paddingTop: 13,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#black",
    position: "absolute",
    bottom: 65,
    left: 20,
    right: 20,
  },
  // album cover (apart of the playback container)
  albumArt: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  // track title (apart of the playback container)
  trackTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
    top: -12
  },
  // progress bar (apart of the playback container)
  progress: {
    flexDirection: "row",
  },
  // progress time (apart of the playback container)
  progressTime1: {
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
    paddingLeft: 2
  },
  // progress time (apart of the playback container)
  progressTime2: {
    fontSize: 12,
    color: "black",
    paddingLeft: 159,
    fontWeight: "bold"
  },
  // playback controls styling
  controls: {
    flexDirection: "row",
    alignItems: "center",
    left: -182,
    bottom: -10,
  },
  fastForward: {
    left: 15
  },
  rewind: {
    left: -12
  },
  // bottom navigation bar
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
    height: 60,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  active: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});

export default Account;
