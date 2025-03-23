import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { ref, get } from 'firebase/database';
import { db } from '../firebaseConfig';

// this is where the users can view a podcast profile 
const PodcastProfile: React.FC = () => {
    const { id, name, imageurl, description, bio, podcaster, profileimgurl, headerurl } = useLocalSearchParams(); // pulling data from the passing params
    const [podcastepisode, setEpisodes] = useState([]); // podcast episode array
    const [loading, setLoading] = useState(true); // if page is loading the information

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
            {/* Search Bar */}
            <View style={styles.searchBar}>
                <Ionicons style={styles.backbutton} name="chevron-back-outline" size={30} color="black" onPress={() => { router.back(); }} />
                <TextInput style={styles.searchInput} placeholder="Search this podcast" />
                <Ionicons style={styles.searchbutton} name="search" size={24} color="black" />
            </View>

            {/* Podcast Header */}
            <View style={styles.header}>
                <Image source={{ uri: imageurl }} style={styles.coverImage} />
                <View style={styles.headerText}>
                    <Text style={styles.title}>{name}</Text>
                    <TouchableOpacity
                        style={styles.hostContainer}
                        onPress={() =>
                            router.push({
                                pathname: '/podcasterprofile',
                                params: {
                                    id: id, // pass the podcast id to fetch episodes
                                    podcaster,
                                    profileimgurl,
                                    headerurl: headerurl,
                                    imageurl: imageurl,
                                    bio: bio,
                                    episodes: JSON.stringify(podcastepisode),
                                }
                            })
                        }
                    >
                        <Image source={{ uri: profileimgurl }} style={styles.hostImage} />
                        <Text style={styles.hostName}>{podcaster}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Podcast Description */}
            <Text style={styles.description}>{description}</Text>

            {/* Episodes Section */}
            <Text style={styles.episodesTitle}>Episodes</Text>

            {/*Episode list container*/}
            <FlatList
                data={podcastepisode}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() =>
                            //on press, navigate to the podcast player screen and pass the episode details
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
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        marginBottom: 10
    },
    // redirect button
    backbutton: {
        position: "absolute",
        left: -40,
    },
    // search bar container
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        right: -45,
        borderRadius: 25,
        height: 50,
        width: 300,
        marginTop: 15,
        marginBottom: 20,
        paddingLeft: -20
    },
    // search icon
    searchbutton: {
        position: "absolute",
        right: 17
    },
    // search input
    searchInput: {
        flex: 1,
        marginHorizontal: 10,
        paddingHorizontal: 30,
        fontSize: 16,
        color: "#000",
        left: -22,
    },
    header: {
        flexDirection: "row",
        marginBottom: 15
    },
    // podcast cover image
    coverImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 15
    },
    // header text container
    headerText: {
        flex: 1,
        justifyContent: "center"
    },
    // podcast title
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5
    },
    // podcaster container
    hostContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    // podcaster profile pic
    hostImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10
    },
    // podcaster name
    hostName: {
        fontSize: 16,
        color: "#555",
        flexShrink: 1,
    },
    // podcast description text
    description: {
        fontSize: 14,
        color: "#666",
        marginBottom: 10
    },
    // podcast episode title
    episodesTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5
    },
    // container that holds the array od podcasts
    episodeContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },
    // image of the podcast
    episodeImage: {
        width: 60,
        height: 60,
        borderRadius: 4,
        marginRight: 15
    },
    episodeText: {
        flex: 1
    },
    // name of the individual episode
    episodeTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5
    },
    // description of the individual episode
    episodeDescription: {
        fontSize: 14,
        color: "#666"
    },
});
export default PodcastProfile;