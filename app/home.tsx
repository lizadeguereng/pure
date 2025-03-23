import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { db } from "../firebaseConfig";
import { ref, get } from "firebase/database";

// this page is where the user can view diff podcasts
const Home: React.FC = () => {

  const [isPlaying, setIsPlaying] = useState(false); // is the podcast playing
  const [podcasts, setPodcasts] = useState([]); // podcast array
  const [loading, setLoading] = useState(true); // is page loading
  const router = useRouter(); // router

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // fetching all podcasts from database
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const snapshot = await get(ref(db, "podcasts"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const podcastArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
          setPodcasts(podcastArray);
        } else {
          console.log("No podcasts are in the database");
        }
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPodcasts();
  }, []);

  // fetching podcasts by category
  const getPodcastsByCategory = (category) => podcasts.filter(podcast => podcast.category === category);

  //  podcast component aand what it includes 
  const PodcastItem = ({ item }) => (
    <TouchableOpacity onPress={() => router.push({
      pathname: "/podcastprofile", params: {
        // if pressed pass the following information
        id: item.id,
        name: item.name,
        imageurl: item.imageurl,
        description: item.description,
        podcaster: item.podcaster,
        profileimgurl: item.profileimgurl,
        headerurl: item.headerurl,
        bio: item.bio,
        
      },
    })}>
      <Image source={{ uri: item.imageurl }} style={{ width: 110, height: 110, borderRadius: 10, marginRight: 10 }} />
    </TouchableOpacity>
  );

  const PodcastList = ({ title, category }) => {
    const data = getPodcastsByCategory(category);

    if (data.length === 0) return null; // to not render empty sections

    return (
      // flatlist for podcasts in the horizontal scroll
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{title}</Text>
        <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PodcastItem item={item} />}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.greeting}>
        Good Afternoon,
        <Text style={styles.username}> Madison!</Text> {/* pulls user's name from db */}
      </Text>

      {/* Podcast horizontal slide with its specific category*/}
      <ScrollView style={styles.horizontalscroll}>
        <PodcastList title="Jump Back In" category="JumpBackIn" />
        <PodcastList title="We Think You'll Like" category="WeThinkYouMayLike" />
        <PodcastList title="What's New" category="WhatsNew" />
      </ScrollView>

      {/* Playback Controls */}
      <TouchableOpacity style={styles.playbackContainer} onPress={() => router.push('/podcastplayer')}>
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
          <TouchableOpacity onPress={() => router.push('/podcastplayer')}>
            <Ionicons style={styles.rewind} name="play-skip-back-outline" size={35} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePlayPause}>
            <Ionicons name={isPlaying ? "play-circle" : "pause-circle"} size={50} color="black"/>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons style={styles.fastForward} name="play-skip-forward-outline" size={35} color="black" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <View style={styles.active}>
            <Ionicons name="home" size={26} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={30} color="#D9D9D9" onPress={() => router.push('/search')} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person-outline" size={30} color="#D9D9D9" onPress={() => router.push('/account')} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  // name gretting at the top
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    fontFamily: "Georgia", // personal reminder: remove for coolvectiva font
  },
  username: {
    fontWeight: "bold",
  },
  // horizontal scroll bar
  horizontalscroll: {
    marginRight: -20
  },
  section: {
    marginBottom: 14,
  },
  // category title
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 7,
  },
  // images inside the horizontal scroll
  imageContainer: {
    marginRight: 9,
  },
  // each individual podcast image
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  // playback container styling (above the nav bar)
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
  // image from the playback container
  albumArt: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  // podcast episode title from the playback container
  trackTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
    top: -12
  },
  // progress bar from the playback container
  progress: {
    flexDirection: "row",
  },
  progressTime1: {
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
    paddingLeft: 2
  },
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
  // navigation bar at the bottom
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
  // active styling (currently on the page)
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
  }
});

export default Home;