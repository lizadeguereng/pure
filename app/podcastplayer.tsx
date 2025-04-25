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
  const { name, audioFile, time, imageurl, podcaster, profileimgurl, index, episodes } = useLocalSearchParams();
  const episodeIndex = parseInt(Array.isArray(index) ? index[0] : index);
  const episodeList = typeof episodes === "string" ? JSON.parse(episodes) : [];
  const [currentIndex, setCurrentIndex] = useState(episodeIndex); // adding a state to manage the current episode index

  const router = useRouter(); // router
  const playerRef = useRef(null); // reference to the YoutubeIframe player state for the audio player

  // this will be replaced with the audioFile time
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); //  current time in seconds
  const [duration, setDuration] = useState(0); //  total duration in seconds

  const [isShuffled, setIsShuffled] = useState(false); // set shuffle mode
  const [shuffledList, setShuffledList] = useState([]);

  const [isRepeat, setIsRepeat] = useState(false); // set repeat
  
  
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
  

 // Function to format a time in seconds to "H:MM:SS" if hours exist, otherwise "MM:SS"
const formatTime = (time) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  // Ensure minutes and seconds always have two digits
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return hours > 0 
    ? `${hours}:${formattedMinutes}:${formattedSeconds}`
    : `${formattedMinutes}:${formattedSeconds}`;
};

// Function to convert a time string to seconds
// Expects a string in "HH:MM:SS" or "MM:SS" format.
const convertTimeToSeconds = (timeString) => {
  const parts = timeString.split(":").map(Number);

  if (parts.length === 3) {
    // Format is HH:MM:SS
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  } else if (parts.length === 2) {
    // Format is MM:SS
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  } else {
    throw new Error("Invalid time format. Expected MM:SS or HH:MM:SS");
  }
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

  // update the current episode when the index changes
  useEffect(() => {
    const activeList = isShuffled ? shuffledList : episodeList;
  if (activeList[currentIndex]) {
    const ep = activeList[currentIndex];
    setCurrentTime(0);
    setIsPlaying(false);
  
      router.setParams({
        name: ep.name,
        audioFile: ep.audioFile,
        time: ep.time,
        imageurl: imageurl,
        podcaster: podcaster,
        profileimgurl: ep.profileimgurl,
      });
    }
  }, [currentIndex, isShuffled]);

  // get the current queue based on shuffle mode
  const queue = isShuffled ? shuffledList : episodeList;

  // skip to the next episode in the queue
  const skipForward = () => {
  if (currentIndex < queue.length - 1) {
    setCurrentIndex(currentIndex + 1);
  }
};
// go back to the previous episode in the queue
const skipBack = () => {
  if (currentIndex > 0) {
    setCurrentIndex(currentIndex - 1);
  }
};
// auto play the next episode when the current episode changes
  useEffect(() => {
    if (currentIndex !== episodeIndex) {
      setIsPlaying(true);
    }
  }, [currentIndex]);

  // shuffle mode
  const toggleShuffle = () => {
    if (!isShuffled) {
      const shuffled = [...episodeList];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledList(shuffled);
      setCurrentIndex(0); // restart from the beginning of the shuffled list
    }
    setIsShuffled(!isShuffled);
  };
  
  // repeat mode
  const toggleRepeat = () => {
    if(!isRepeat){
      setCurrentIndex(0); // restart from the beginning of the list 
      

    }
    setIsRepeat((prev) => !prev);
  }
  
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
      height={0}
      width={0}
      play={isPlaying}
      videoId={videoId}
      onChangeState={(state) => {
        if (state === "ended") {
          if (isRepeat) {
            // repeat same episode
            setCurrentTime(0);
            playerRef.current?.seekTo(0, true); // restart the video
            setIsPlaying(true);
          } else {
            setIsPlaying(false);
            skipForward(); //  play next episode if not repeating
          }
        }
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
        <TouchableOpacity onPress={toggleShuffle}>
        <Ionicons name="shuffle" size={26} color={isShuffled ? "#ccc" : "black"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={skipBack}>
        <Ionicons name="play-skip-back-outline" size={40} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePlayPause}>
          <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={60} color="black"/>
          {/* Skip and Repeat */}
        </TouchableOpacity>
        <TouchableOpacity onPress={skipForward}>
        <Ionicons name="play-skip-forward-outline" size={40} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleRepeat}>
        <Ionicons name="repeat" size={26} color={isRepeat ? "#ccc" : "black"} />
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
