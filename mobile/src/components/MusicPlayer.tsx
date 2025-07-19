import React, { useEffect, useState } from "react";
import {
  Animated,
  Image,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../css/styles";

interface Track {
  title: string;
  artist: string;
  thumbnail: string;
  duration?: number;
  currentTime?: number;
  isPlaying?: boolean;
}

interface MusicPlayerProps {
  track?: Track;
  onPlayPause?: () => void;
  onSeek?: (time: number) => void;
  visible?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  track,
  onPlayPause,
  onSeek,
  visible = false,
}) => {
  const [currentTime, setCurrentTime] = useState(track?.currentTime || 0);
  const [isDragging, setIsDragging] = useState(false);
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    if (track && !isDragging) {
      setCurrentTime(track.currentTime || 0);
      updateProgress();
    }
  }, [track?.currentTime, track?.duration]);

  const updateProgress = () => {
    if (track?.duration) {
      const progress = (currentTime / track.duration) * 100;
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsDragging(true);
    },
    onPanResponderMove: (_, gestureState) => {
      if (track?.duration) {
        const progress = Math.max(0, Math.min(100, gestureState.dx));
        const newTime = (progress / 100) * track.duration;
        setCurrentTime(newTime);
        progressAnim.setValue(progress);
      }
    },
    onPanResponderRelease: () => {
      setIsDragging(false);
      if (onSeek) {
        onSeek(currentTime);
      }
    },
  });

  if (!visible || !track) {
    return null;
  }

  return (
    <View style={styles.musicPlayer}>
      <View style={styles.playerContent}>
        <Image
          source={{ uri: track.thumbnail }}
          style={styles.playerThumbnail}
          defaultSource={require("../../assets/icon.png")}
        />
        <View style={styles.playerInfo}>
          <Text style={styles.playerTitle} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={styles.playerArtist} numberOfLines={1}>
            {track.artist}
          </Text>
        </View>
        <View style={styles.playerControls}>
          <TouchableOpacity style={styles.controlButton} onPress={onPlayPause}>
            <Text style={styles.playButtonText}>
              {track.isPlaying ? "⏸️" : "▶️"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {track.duration && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar} {...panResponder.panHandlers}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
          <View style={styles.progressText}>
            <Text style={styles.progressTime}>{formatTime(currentTime)}</Text>
            <Text style={styles.progressTime}>
              {formatTime(track.duration)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};
