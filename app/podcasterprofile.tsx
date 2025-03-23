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
          if (!id) return;
          // fetch podcast episodes from the database
          const fetchEpisodes = async () => {
              try {
                  console.log(`Fetching episodes for podcast: ${id}`); // print the podcast that was found
                  const snapshot = await get(ref(db, `podcasts/${id}/podcastepisode`));
  
                  if (snapshot.exists()) {
                      const data = snapshot.val();
                      // convert episodes object to an array
                      const formattedEpisodes = Object.keys(data).map((key) => ({
                          id: key,
                          ...data[key],
                      }));
                      setEpisodes(formattedEpisodes);
                  } else {
                      console.log("No episodes found.");
                  }
              } catch (error) {
                  console.error("Error fetching episodes:", error);
              } finally {
                  setLoading(false);
              }
          };
          // return the episodes
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
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followText}>Follow</Text>
        </TouchableOpacity>
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
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 4,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -2,
    paddingHorizontal: 20,
  },
  profileImage: {
    top: -70,
    width: 100,
    height: 100,
    borderRadius: 47,
    borderWidth: 3,
    borderColor: "white",
  },
  profileTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  podcasterName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    top: -45,
  },
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
  bio: {
    fontSize: 14,
    color: "#333",
    marginVertical: 3,
    lineHeight: 20,
    top: -60,
    paddingHorizontal: 20,
  },
  popularTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 14,
    marginBottom: -60,
    top: -70,
    paddingHorizontal: 20,
  },
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
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  episodeText: {
    flex: 1
},
  episodeDescription: {
    fontSize: 13,
    color: "#444",
    marginTop: 2,
  },
  seeAllButton: {
    backgroundColor: "#000",
    borderRadius: 25,
    alignItems: "center",
    paddingVertical: 12,
    marginVertical: 20,
    width: "70%",
    alignSelf: "center",
  },
  seeAllText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default PodcasterProfile;