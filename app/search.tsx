import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ref, get } from 'firebase/database';
import { db } from '../firebaseConfig';

// this is where the user can search for a podcast or a podcaster (author)
const Search: React.FC = () => {

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  
  // recent searches
  const recentSearches = [
    { name: "", uri: "" },
  ];

  // searches the database for a podcast or a podcaster
  useEffect(() => {
    const searchDatabase = async () => {
      if (!searchText.trim()) {
        setSearchResults([]);
        return;
      }

      // fetch podcasts from the database
      const snapshot = await get(ref(db, "podcasts"));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const results = [];

        Object.keys(data).forEach((key) => {
          const item = data[key];

          // Match by podcast name
          if (item.name.toLowerCase().includes(searchText.toLowerCase())) {
            results.push({
              id: key,
              name: item.name,
              uri: item.imageurl,
              podcaster: item.podcaster,
              profileimgurl: item.profileimgurl,
              description: item.description,
              type: "podcast",
            });
          }

          // Match by podcaster name
          if (item.podcaster && item.podcaster.toLowerCase().includes(searchText.toLowerCase())) {
            results.push({
              id: key,
              name: item.podcaster,
              uri: item.profileimgurl,
              imageurl: item.imageurl,
              headerurl: item.headerurl,
              bio: item.bio,
              type: "podcaster",
            });
          }
        });
        setSearchResults(results);
      }
    };
    searchDatabase();
  }, [searchText]);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="The gears are turning!"
          placeholderTextColor="#888"
          style={styles.input}
          value={searchText}
          onChangeText={setSearchText}
        />
        <Ionicons name="search" size={24} color="black" style={styles.searchIcon} />
      </View>

      {/* Recently Searched */}
      <Text style={styles.sectionTitle}>{searchText.trim() ? "Search Results" : "Recently Searched"}</Text>
      {
        searchText.trim() && searchResults.length === 0 && (
          <Text>No results found.</Text>
        )
      }
      {/* List of Recently Searched or Search Results */}
      <FlatList
        data={searchText.trim() ? searchResults : recentSearches}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.recentSearchContainer}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {
            if (item.type === "podcast") {
              router.push({ pathname: "/podcastprofile", params: {
                 id: item.id,
                 imageurl: item.uri,
                 name: item.name,
                 podcaster: item.podcaster,
                 profileimgurl: item.profileimgurl,
                  description: item.description,
                } });
            } 
            else {
              router.push({ pathname: "/podcasterprofile", params: {
                id: item.id,
                podcaster: item.name,
                profileimgurl: item.uri,
                imageurl: item.imageurl,
                headerurl: item.headerurl,
                bio: item.bio,
              } });
            }
          }}>
            <View style={styles.recentSearchItem}>
              <Image source={{ uri: item.uri }} style={item.type === "podcaster" ? styles.circleImage : styles.squareImage} />
              <Text style={styles.recentSearchName} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

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
        <TouchableOpacity>
          <View style={styles.active}>
            <Ionicons name="search" size={26} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person-outline" size={30} color="#D9D9D9" onPress={() => router.push("/account")} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  /*page styling*/
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  /*search bar styling*/
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  // search bar input
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  // search icon
  searchIcon: {
    marginLeft: 10,
  },
  // recently searched title
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  /*recently searched container styling*/
  recentSearchContainer: {
    paddingBottom: 20,
    paddingRight: 100,
  },
  // recent searched item
  recentSearchItem: {
    flexDirection: "column",
    marginBottom: 15,
    paddingRight: 10,
  },
  // recent searched image
  recentSearchImage: {
    width: 90,
    height: 90,
    borderRadius: 13,
    marginBottom: 5,
  },
  // name under the image
  recentSearchName: {
    fontSize: 13,
    color: "#000",
    textAlign: "center",
    flexWrap: "wrap",
    width: 95, // restricts width so text wraps under image
    lineHeight: 16,
  },
  circleImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 5,
  },
  // square image for podcasts
  squareImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginBottom: 5,
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
  },
});

export default Search;
