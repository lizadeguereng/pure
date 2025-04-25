import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { ref, get } from 'firebase/database';
import { db } from '../firebaseConfig';

// this is the podcaster profile page that shows the podcaster's information and their episodes
const PodcasterProfile: React.FC = () => {
  const router = useRouter();
  const { id, podcaster, profileimgurl, imageurl, headerurl, bio} = useLocalSearchParams();
  const [loading, setLoading] = useState(true); // if page is loading the information
  const [podcastepisode, setEpisodes] = useState([]); // podcast episode array

  useEffect(() => {
    if (!id) {
      console.warn("No ID provided in route parameters.");
      return;
    }
  
    console.log("Component mounted. Podcaster ID:", id);
  
    // 
    const fetchEpisodes = async () => {
      try {
        console.log(`Fetching episodes for podcast with ID: ${id}`);
        const snapshot = await get(ref(db, `podcasts/${id}/podcastepisode`));
  
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log("Episodes retrieved from Firebase:", data); // log the retrieved data
  
          const formattedEpisodes = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
  
          console.log("Formatted episodes:", formattedEpisodes); // log the formatted episodes
          setEpisodes(formattedEpisodes);
        } else {
          console.log("No episodes found for this podcaster.");
        }
      } catch (error) {
        console.error("Error fetching episodes:", error);
      } finally {
        setLoading(false);
        console.log("Finished loading episodes.");
      }
    };
  
    fetchEpisodes();
  }, [id]);

  return (
      <View style={styles.container}>
      {/* Header Section */}
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
          <Image source={{ uri: headerurl }} style={styles.headerImage} />
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back-outline" size={28} color="white" />
      </TouchableOpacity>

      {/* Profile Info Section */}
      <View style={styles.profileSection}>
        <Image source={{ uri: profileimgurl }} style={styles.profileImage} />
        <View style={styles.profileTextContainer}>
          <Text style={styles.podcasterName}>{podcaster}</Text>
        </View>
      </View>

      {/* Bio Section */}
      <Text style={styles.bio}>{bio}</Text>

      {/* Episodes Section */}
      <Text style={styles.popularTitle}>Popular Episodes</Text>

       <FlatList
                      data={podcastepisode}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                          <TouchableOpacity
                              onPress={() =>
                                  // navigate to the podcast player screen and pass the episode details
                                  router.push({
                                      pathname: "/podcastplayer",
                                      params: {
                                          id: item.id,
                                          name: item.name,
                                          audioFile: item.audioFile,
                                          description: item.description,
                                          date: item.date,
                                          time: item.time,
                                          imageurl: imageurl,
                                          profileimgurl: item.profileimgurl,
                                          podcaster: podcaster,
                                      },
                                  })
                              }
                          >
                              {/*Episode individual list item*/}
                              <View style={styles.episodeContainer}>
                                  <Image source={{ uri: imageurl }} style={styles.episodeImage} />
                                  <View style={styles.episodeText}>
                                      <Text style={styles.episodeTitle}>{item.name}</Text>
                                      <Text style={styles.episodeDescription} numberOfLines={2}>
                                          {item.description}
                                      </Text>
                                  </View>
                              </View>
                          </TouchableOpacity>
                      )}
                  />

      {/* "See All Episodes" Button */}
      <TouchableOpacity style={styles.seeAllButton}>
        <Text style={styles.seeAllText}>See all episodes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // header image of the podcaster
  headerImage: {
    marginTop: -5,
    width: "100%",
    height: 230,
    resizeMode: "cover",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginHorizontal: 0,
    paddingTop: -50,
    top: -42,
  },
  // naviagtion arrow at the top of the screen
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 4,
  },
  // profile section of the podcaster
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -2,
    paddingHorizontal: 20,
  },
  // profile image of the podcaster
  profileImage: {
    top: -70,
    width: 100,
    height: 100,
    borderRadius: 47,
    borderWidth: 3,
    borderColor: "white",
  },
  // profile text of the podcaster
  profileTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  // name of the podcaster
  podcasterName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    top: -45,
  },
 // description of the podcaster
  followerInfo: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  followButton: {
    backgroundColor: "#000",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 6,
    left: -10,
    top: -45,
  },
  followText: {
    color: "#fff",
    fontWeight: "600",
  },
  // bio of the podcaster
  bio: {
    fontSize: 14,
    color: "#333",
    marginVertical: 3,
    lineHeight: 20,
    top: -60,
    paddingHorizontal: 20,
  },
  // title of the popular episodes
  popularTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 14,
    marginBottom: -60,
    top: -70,
    paddingHorizontal: 20,
  },
  // individual episode card
  episodeCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    
  },
  // container that holds the array of podcasts
  episodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 20,
},

  episodeImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 10,
  },
  // image of the episode
  episodeInfo: {
    flex: 1,
  },
  // title of the episode
  episodeTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  episodeText: {
    flex: 1
},
  // description of the episode
  episodeDescription: {
    fontSize: 13,
    color: "#444",
    marginTop: 2,
  },
  // button that allows the user to see all episodes of the podcaster
  seeAllButton: {
    backgroundColor: "#000",
    borderRadius: 25,
    alignItems: "center",
    paddingVertical: 12,
    marginVertical: 20,
    width: "70%",
    alignSelf: "center",
  },
  // text that is displayed on the button
  seeAllText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default PodcasterProfile;