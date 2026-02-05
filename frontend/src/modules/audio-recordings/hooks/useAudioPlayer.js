import { useState, useRef, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useLazyGetAudioUrlQuery } from "../../../store/api/audioRecordingsApi";
import { useCreateLogMutation } from "../../../store/api/logsApi";

/**
 * Custom hook for audio player logic
 * Handles all audio playback state and controls
 */
export const useAudioPlayer = (recordings = []) => {
  const authUser = useSelector((state) => state.auth.user);
  const [getAudioUrl] = useLazyGetAudioUrlQuery();
  const [createLog] = useCreateLogMutation();

  // State
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [loadingAudioUrl, setLoadingAudioUrl] = useState(null);
  const audioUrlCache = useRef(new Map());
  const audioPlayer = useRef(null);

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Computed values
  const progressPercentage = useMemo(() => {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  }, [currentTime, duration]);

  const currentRecording = useMemo(() => {
    return recordings.find((r) => r.interaction_id === currentlyPlaying);
  }, [recordings, currentlyPlaying]);

  const stopAudio = useCallback(
    async (item) => {
      const recordingToLog =
        item || recordings.find((r) => r.interaction_id === currentlyPlaying);

      if (audioPlayer.current) {
        audioPlayer.current.pause();
        audioPlayer.current.currentTime = 0;
      }

      if (recordingToLog && currentlyPlaying) {
        createLog({
          userId: authUser?.id?.toString() || "unknown",
          eventType: "STOP",
          entity: "AudioRecording",
          description: `Stopped audio recording ${
            recordingToLog.interaction_id
          } (Agent: ${recordingToLog.agent_name || "Unknown"})`,
          status: "SUCCESS",
        }).catch((logErr) => {
          console.error(
            `ERROR: stopAudio (createLog) - ${logErr.message}`,
            logErr,
          );
        });
      }

      setCurrentlyPlaying(null);
      setIsPlaying(false);
      setCurrentTime(0);
    },
    [recordings, currentlyPlaying, createLog, authUser],
  );

  const toggleAudio = useCallback(
    async (item) => {
      if (currentlyPlaying === item.interaction_id) {
        stopAudio(item);
      } else {
        try {
          setLoadingAudioUrl(item.interaction_id);

          const result = await getAudioUrl(item.interaction_id).unwrap();
          const audioUrl = result;

          audioUrlCache.current.set(item.interaction_id, audioUrl);

          if (audioPlayer.current && audioUrl) {
            audioPlayer.current.src = audioUrl;
            audioPlayer.current.volume = volume;
            audioPlayer.current.playbackRate = playbackSpeed;
            await audioPlayer.current.play();
            setCurrentlyPlaying(item.interaction_id);
            setIsPlaying(true);

            createLog({
              userId: authUser?.id?.toString() || "unknown",
              eventType: "PLAY",
              entity: "AudioRecording",
              description: `Played audio recording ${
                item.interaction_id
              } (Agent: ${item.agent_name || "Unknown"})`,
              status: "SUCCESS",
            }).catch((logErr) => {
              console.error(
                `ERROR: toggleAudio (createLog) - ${logErr.message}`,
                logErr,
              );
            });
          }
        } catch (err) {
          console.error(`ERROR: toggleAudio - ${err.message}`, err);

          createLog({
            userId: authUser?.id?.toString() || "unknown",
            eventType: "PLAY",
            entity: "AudioRecording",
            description: `Failed to play audio recording ${item.interaction_id}`,
            status: "FAILURE",
          }).catch((logErr) => {
            console.error(
              `ERROR: toggleAudio (createLog failure) - ${logErr.message}`,
              logErr,
            );
          });

          throw err;
        } finally {
          setLoadingAudioUrl(null);
        }
      }
    },
    [
      currentlyPlaying,
      volume,
      playbackSpeed,
      getAudioUrl,
      createLog,
      authUser,
      stopAudio,
    ],
  );

  const togglePlayPause = useCallback(() => {
    try {
      if (!audioPlayer.current) return;

      if (isPlaying) {
        audioPlayer.current.pause();
        setIsPlaying(false);
      } else {
        audioPlayer.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error(`ERROR: togglePlayPause - ${err.message}`, err);
    }
  }, [isPlaying]);

  const updateProgress = useCallback(() => {
    try {
      if (audioPlayer.current) {
        setCurrentTime(audioPlayer.current.currentTime);
      }
    } catch (err) {
      console.error(`ERROR: updateProgress - ${err.message}`, err);
    }
  }, []);

  const handleMetadataLoaded = useCallback(() => {
    try {
      if (audioPlayer.current) {
        setDuration(audioPlayer.current.duration);
      }
    } catch (err) {
      console.error(`ERROR: handleMetadataLoaded - ${err.message}`, err);
    }
  }, []);

  const seekAudio = useCallback((event, newValue) => {
    try {
      if (!audioPlayer.current) return;
      const seekTime = (newValue / 100) * duration;
      audioPlayer.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    } catch (err) {
      console.error(`ERROR: seekAudio - ${err.message}`, err);
    }
  }, [duration]);

  const rewind = useCallback(() => {
    try {
      if (!audioPlayer.current) return;
      audioPlayer.current.currentTime = Math.max(
        0,
        audioPlayer.current.currentTime - 10,
      );
    } catch (err) {
      console.error(`ERROR: rewind - ${err.message}`, err);
    }
  }, []);

  const forward = useCallback(() => {
    try {
      if (!audioPlayer.current) return;
      audioPlayer.current.currentTime = Math.min(
        duration,
        audioPlayer.current.currentTime + 10,
      );
    } catch (err) {
      console.error(`ERROR: forward - ${err.message}`, err);
    }
  }, [duration]);

  const toggleMute = useCallback(() => {
    try {
      if (!audioPlayer.current) return;

      if (isMuted) {
        audioPlayer.current.volume = volume;
        setIsMuted(false);
      } else {
        audioPlayer.current.volume = 0;
        setIsMuted(true);
      }
    } catch (err) {
      console.error(`ERROR: toggleMute - ${err.message}`, err);
    }
  }, [isMuted, volume]);

  const handleVolumeChange = useCallback((event, newValue) => {
    try {
      const newVolume = newValue / 100;
      setVolume(newVolume);
      if (audioPlayer.current) {
        audioPlayer.current.volume = newVolume;
      }
      if (newVolume > 0) {
        setIsMuted(false);
      }
    } catch (err) {
      console.error(`ERROR: handleVolumeChange - ${err.message}`, err);
    }
  }, []);

  const cyclePlaybackSpeed = useCallback(() => {
    try {
      const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
      const currentIndex = speeds.indexOf(playbackSpeed);
      const nextIndex = (currentIndex + 1) % speeds.length;
      setPlaybackSpeed(speeds[nextIndex]);

      if (audioPlayer.current) {
        audioPlayer.current.playbackRate = speeds[nextIndex];
      }
    } catch (err) {
      console.error(`ERROR: cyclePlaybackSpeed - ${err.message}`, err);
    }
  }, [playbackSpeed]);

  const formatTime = useCallback((seconds) => {
    try {
      if (isNaN(seconds)) return "0:00";
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    } catch (err) {
      console.error(`ERROR: formatTime - ${err.message}`, err);
      return "0:00";
    }
  }, []);

  const handleAudioEnded = useCallback(() => {
    try {
      setCurrentlyPlaying(null);
      setIsPlaying(false);
      setCurrentTime(0);
    } catch (err) {
      console.error(`ERROR: handleAudioEnded - ${err.message}`, err);
    }
  }, []);

  const handleAudioError = useCallback((err) => {
    try {
      console.error(`ERROR: handleAudioError - Audio playback failed`, err);
      setCurrentlyPlaying(null);
      setIsPlaying(false);
    } catch (error) {
      console.error(`ERROR: handleAudioError - ${error.message}`, error);
    }
  }, []);

  const downloadAudio = useCallback(
    async (item) => {
      try {
        setLoadingAudioUrl(item.interaction_id);

        let audioUrl = audioUrlCache.current.get(item.interaction_id);

        if (!audioUrl) {
          const result = await getAudioUrl(item.interaction_id).unwrap();
          audioUrl = result;
          audioUrlCache.current.set(item.interaction_id, audioUrl);
        }

        window.open(audioUrl, "_blank");
      } catch (err) {
        console.error(`ERROR: downloadAudio - ${err.message}`, err);
        throw err;
      } finally {
        setLoadingAudioUrl(null);
      }
    },
    [getAudioUrl],
  );

  const handlePrefetchAudio = useCallback(() => {
    // Disabled for performance
  }, []);

  return {
    // Refs
    audioPlayer,

    // State
    currentlyPlaying,
    loadingAudioUrl,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackSpeed,

    // Computed
    progressPercentage,
    currentRecording,

    // Actions
    toggleAudio,
    stopAudio,
    togglePlayPause,
    seekAudio,
    rewind,
    forward,
    toggleMute,
    handleVolumeChange,
    cyclePlaybackSpeed,
    downloadAudio,
    handlePrefetchAudio,

    // Handlers
    updateProgress,
    handleMetadataLoaded,
    handleAudioEnded,
    handleAudioError,

    // Utilities
    formatTime,
  };
};
