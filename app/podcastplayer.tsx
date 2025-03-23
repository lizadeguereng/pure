import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import YoutubeIframe from "react-native-youtube-iframe";
import { useEffect } from "react";
import {useRef} from 'react';

// this is where the podcast episodes are player
const PodcastPlayer: React.FC = () => {
  //initilizing properties that will be pulled from db 
  const { name, audioFile, time, imageurl, podcaster, profileimgurl } = useLocalSearchParams();
  const router = useRouter(); // router
  const playerRef = useRef(null); // reference to the YoutubeIframe player state for the audio player

  // this will be replaced with the audioFile time
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); //  current time in seconds
  const [duration, setDuration] = useState(0); //  total duration in seconds

  
  // function to toggle play and pause
  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  // function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };
  
  // Extract YouTube video ID from the audioFile URL
  const videoId = getYouTubeVideoId(audioFile);
  

  // function to format time
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // function to convert time string to seconds
  const convertTimeToSeconds = (timeString) => {
    const parts = timeString.split(":");
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    return (minutes * 60) + seconds;
  };

  // set the duration of the audio file in seconds
  useEffect(() => {
    if (time) {
      const totalSeconds = convertTimeToSeconds(time);
      setDuration(totalSeconds);
    }
  }, [time]);
  
  // update current time every second when playing
  useEffect(() => {
    let interval;
    if (isPlaying && playerRef.current) {
      interval = setInterval(async () => {
        const time = await playerRef.current?.getCurrentTime();
        if (typeof time === "number") {
          setCurrentTime(Math.floor(time));
        }
      }, 1000); // poll every second
    }
  
    return () => clearInterval(interval); // clear interval on pause or unmount
  }, [isPlaying]);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Ionicons
        name="chevron-back-outline"
        size={35}
        color="black"
        style={styles.backButton}
        onPress={() => router.back()}
      />

{videoId && (
    <YoutubeIframe
    ref={playerRef}
      height={0} // Make it hidden for "audio-only" style
      width={0}
      play={isPlaying}
      videoId={videoId}
      onChangeState={(state) => {
        if (state === "ended") setIsPlaying(false);
      }}
    />
  )}

      {/* Podcast Image */}
      <Image source={{ uri: imageurl }} style={styles.podcastImage} />

      {/* Podcast Title */}
      <Text style={styles.episodeTitle}>{name}</Text>
      <Text style={styles.podcasterName}>{podcaster}</Text>


      {/* Slider */}
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={currentTime}
          onValueChange={(value) => setCurrentTime(value)}
          onSlidingComplete={(value) => {
            setCurrentTime(value);
            playerRef.current?.seekTo(value, true);
          }}
          minimumTrackTintColor="#000"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#000"
        />
        {/* Time Display */}
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{formatTime(currentTime)}</Text>
          <Text style={styles.time}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Playback Controls */}
      <View style={styles.controls}>
        <Ionicons name="shuffle" size={20} color="black" />
        <Ionicons name="play-skip-back-outline" size={40} color="black" />
        <TouchableOpacity onPress={togglePlayPause}>
          <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={60} color="black"/>
          {/* Skip and Repeat */}
        </TouchableOpacity>
        <Ionicons name="play-skip-forward-outline" size={40} color="black" />
        <Ionicons name="repeat" size={20} color="black" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    marginTop: 40,
  },
  // refirect button
  backButton: {
    position: "absolute",
    top: -20,
    left: 25,
    transform: [{ rotate: "270deg" }],
  },
  // podcast image
  podcastImage: {
    width: 300,
    height: 300,
    borderRadius: 15,
    marginTop: 50,
  },
  // podcast episode
  episodeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  // container that has the silder and text
  sliderContainer: {
    width: "100%",
    marginTop: 20,
    alignItems: "center",
  },
  // slider itself
  slider: {
    width: "85%",
    height: 40,
  },
  // time display container
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginTop: -1,
  },
  // time text
  time: {
    fontSize: 14,
    color: "#000",
  },
  // playbackControls
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    marginTop: 4,
  },
  // podcast container
  podcasterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    left: -20
  },
  // podcaster profile image
  podcasterImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  // podcaster
  podcasterName: {
    fontSize: 13,
    color: "#a1a1a1"
  },
  // follow button - out of scope
  followButton: {
    backgroundColor: "#000",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  // follow button txt - out of scope
  followButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PodcastPlayer;
