import React from "react";
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const Search: React.FC = () => {
  // placeholder images
  const recentSearches = [
    { name: "Emy Moore", uri: "https://yt3.googleusercontent.com/-ptrqe9imuSXrKEJWuQ6oOEbZNXSIOI9nHUHKTZ3Neb1-nO2B1vq5ogtTJ9pTdCnUhiHEmlx3Q=s900-c-k-c0x00ffffff-no-rj" },
    { name: "Hayley Mulenda", uri: "https://londonspeakerbureau.com/wp-content/uploads/2019/04/Hayley-Mulenda-keynote-speaker-1.jpg" },
  ];

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="The gears are turning!"
          placeholderTextColor="#888"
          style={styles.input}
        />
        <Ionicons name="search" size={24} color="black" style={styles.searchIcon} />
      </View>

      {/* Recently Searched */}
      <Text style={styles.sectionTitle}>Recently searched</Text>
      <FlatList
        data={recentSearches}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.recentSearchContainer}
        renderItem={({ item }) => (
          <View style={styles.recentSearchItem}>
            <Image source={{ uri: item.uri }} style={styles.recentSearchImage} />
            <Text style={styles.recentSearchName}>{item.name}</Text>
          </View>
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
          <Ionicons name="person-outline" size={30} color="#D9D9D9" />
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
  },
  recentSearchItem: {
    alignItems: "center",
    marginRight: 20,
  },
  // recent searched image
  recentSearchImage: {
    width: 90,
    height: 90,
    borderRadius: 40,
    marginBottom: 5,
  },
  // name under the image
  recentSearchName: {
    fontSize: 14,
    color: "#000",
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
