import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Alert,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Pagination,
  Slider,
  Tooltip,
  ButtonGroup,
  Collapse,
  LinearProgress,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
  Pause as PauseIcon,
  FastRewind as FastRewindIcon,
  FastForward as FastForwardIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Mic as MicIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import {
  useGetAudioRecordingsQuery,
  useGetCallTypesQuery,
  useLazyGetAudioUrlQuery,
  usePrefetch,
} from "../../store/api/audioRecordingsApi";
import { useCreateLogMutation } from "../../store/api/logsApi";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next"; // ADDED: i18n support
import { QuickFilters } from "./components/QuickFilters";
import { QuickFiltersMobile } from "./components/QuickFilters/QuickFiltersMobile.jsx";
import { AdvancedFilters } from "./components/AdvancedFilters/AdvancedFilters.jsx";
import { TableView } from "./components/TableView/TableView.jsx";
import { typography } from "../../common/styles/styles.js";

export const AudioRecordingsView = () => {
  const { t } = useTranslation(); // ADDED: Translation hook
  const authUser = useSelector((state) => state.auth.user);
  const [createLog] = useCreateLogMutation();

  // Filters - Internal state for immediate UI updates
  const [filters, setFilters] = useState({
    interactionId: "",
    customerPhone: "",
    agentName: "",
    callType: "",
    startDate: "",
    endDate: "",
    company: null,
    hasAudio: "true", // MODIFIED: Default filter to show only recordings with audio on component mount. Change to null to show all recordings by default, or "false" to show only recordings without audio.
  });

  // Debounced filters - Used for API calls (500ms delay)
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [isDebouncing, setIsDebouncing] = useState(false);

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Debounce filter changes to reduce API calls while typing
  // Apply debounce only to text fields (not company/hasAudio for instant response)
  useEffect(() => {
    const textFields = {
      interactionId: filters.interactionId,
      customerPhone: filters.customerPhone,
      agentName: filters.agentName,
      callType: filters.callType,
      startDate: filters.startDate,
      endDate: filters.endDate,
    };

    // Only show debouncing indicator for text input changes
    const hasTextInput =
      filters.interactionId || filters.customerPhone || filters.agentName;
    if (hasTextInput) {
      setIsDebouncing(true);
    }

    const timer = setTimeout(() => {
      setDebouncedFilters((prev) => ({
        ...prev,
        ...textFields,
      }));
      setIsDebouncing(false);
    }, 500); // Wait 500ms after user stops typing

    return () => {
      clearTimeout(timer);
      setIsDebouncing(false);
    };
  }, [
    filters.interactionId,
    filters.customerPhone,
    filters.agentName,
    filters.callType,
    filters.startDate,
    filters.endDate,
  ]);

  // RTK Query hooks
  const {
    data: recordingsData,
    isLoading: loading,
    error: apiError,
    refetch,
  } = useGetAudioRecordingsQuery(
    {
      page,
      limit: itemsPerPage,
      ...debouncedFilters, // Use debounced filters instead of immediate filters
    },
    {
      // Use cache for 10 minutes - much faster for repeated queries (data updates hourly)
      refetchOnMountOrArgChange: 600,
      // Refetch when window regains focus (detects changes while user was away)
      refetchOnFocus: true,
      // Don't refetch when reconnecting
      refetchOnReconnect: false,
    }
  );

  // Lazy load call types only when dropdown is opened
  const [loadCallTypes, setLoadCallTypes] = useState(false);
  const { data: callTypes = [] } = useGetCallTypesQuery(undefined, {
    // Don't fail the component if call types can't be loaded
    refetchOnMountOrArgChange: false,
    skip: !loadCallTypes, // Only load when dropdown is opened
  });
  const [getAudioUrl] = useLazyGetAudioUrlQuery();
  const prefetchAudioRecordings = usePrefetch("getAudioRecordings");

  // Extract data from query
  const recordings = recordingsData?.data || [];
  const totalCount = recordingsData?.totalCount || 0;

  // State
  const [error, setError] = useState(null);
  const [dbConfigured, setDbConfigured] = useState(true);
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
  const totalPages = useMemo(
    () => Math.ceil(totalCount / itemsPerPage),
    [totalCount, itemsPerPage]
  );

  const progressPercentage = useMemo(() => {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  }, [currentTime, duration]);

  const currentRecording = useMemo(() => {
    return recordings.find((r) => r.interaction_id === currentlyPlaying);
  }, [recordings, currentlyPlaying]);

  // Prefetch next page automatically when current page loads
  useEffect(() => {
    if (!loading && page < totalPages) {
      // Prefetch next page in background
      const nextPageParams = {
        page: page + 1,
        limit: itemsPerPage,
        ...debouncedFilters,
      };
      prefetchAudioRecordings(nextPageParams);
    }
  }, [
    page,
    totalPages,
    itemsPerPage,
    debouncedFilters,
    loading,
    prefetchAudioRecordings,
  ]);

  // Handler to prefetch page on hover
  const handlePrefetchPage = (targetPage) => {
    if (targetPage !== page && targetPage >= 1 && targetPage <= totalPages) {
      const prefetchParams = {
        page: targetPage,
        limit: itemsPerPage,
        ...debouncedFilters,
      };
      prefetchAudioRecordings(prefetchParams);
    }
  };

  // Methods
  // Check for API errors
  React.useEffect(() => {
    if (apiError) {
      if (apiError.status === 503) {
        setDbConfigured(false);
        setError("Database not configured. Please contact your administrator.");
      } else {
        setError(apiError.data?.message || "Failed to load recordings");
      }
    } else {
      // Clear error if request succeeded
      setError(null);
      setDbConfigured(true);
    }
  }, [apiError]);

  const clearFilters = () => {
    setFilters({
      interactionId: "",
      customerPhone: "",
      agentName: "",
      callType: "",
      startDate: "",
      endDate: "",
      company: null,
      hasAudio: null,
    });
    setPage(1);
  };

  const setCompanyFilter = (company) => {
    setFilters((prev) => ({ ...prev, company }));
    setDebouncedFilters((prev) => ({ ...prev, company })); // Apply immediately without debounce
    setPage(1);
  };

  const setAudioFilter = (hasAudio) => {
    setFilters((prev) => ({ ...prev, hasAudio }));
    setDebouncedFilters((prev) => ({ ...prev, hasAudio })); // Apply immediately without debounce
    setPage(1);
  };

  const toggleAudio = async (item) => {
    if (currentlyPlaying === item.interaction_id) {
      stopAudio(item);
    } else {
      try {
        setLoadingAudioUrl(item.interaction_id);

        // ALWAYS call the backend to register the log, even if URL is cached
        const result = await getAudioUrl(item.interaction_id).unwrap();
        const audioUrl = result;

        // Update cache with the new URL
        audioUrlCache.current.set(item.interaction_id, audioUrl);

        if (audioPlayer.current && audioUrl) {
          audioPlayer.current.src = audioUrl;
          audioPlayer.current.volume = volume;
          audioPlayer.current.playbackRate = playbackSpeed;
          await audioPlayer.current.play();
          setCurrentlyPlaying(item.interaction_id);
          setIsPlaying(true);

          // Log the play action
          try {
            await createLog({
              userId: authUser.id.toString(),
              eventType: 'PLAY',
              entity: 'AudioRecording',
              description: `Played audio recording ${item.interaction_id} (Agent: ${item.agent_name || 'Unknown'})`,
              status: 'SUCCESS',
            }).unwrap();
          } catch (logErr) {
            console.error("Error logging play audio action:", logErr);
          }
        }
      } catch (err) {
        console.error("Error loading audio:", err);
        setError("Failed to load audio file. Please try again.");

        // Log the failed play action
        try {
          await createLog({
            userId: authUser.id.toString(),
            eventType: 'PLAY',
            entity: 'AudioRecording',
            description: `Failed to play audio recording ${item.interaction_id}`,
            status: 'FAILURE',
          }).unwrap();
        } catch (logErr) {
          console.error("Error logging play audio failure:", logErr);
        }
      } finally {
        setLoadingAudioUrl(null);
      }
    }
  };

  const stopAudio = async (item) => {
    // Get recording info before clearing state
    const recordingToLog = item || recordings.find((r) => r.interaction_id === currentlyPlaying);

    if (audioPlayer.current) {
      audioPlayer.current.pause();
      audioPlayer.current.currentTime = 0;
    }

    // Log the stop action
    if (recordingToLog && currentlyPlaying) {
      try {
        await createLog({
          userId: authUser.id.toString(),
          eventType: 'STOP',
          entity: 'AudioRecording',
          description: `Stopped audio recording ${recordingToLog.interaction_id} (Agent: ${recordingToLog.agent_name || 'Unknown'})`,
          status: 'SUCCESS',
        }).unwrap();
      } catch (logErr) {
        console.error("Error logging stop audio action:", logErr);
      }
    }

    setCurrentlyPlaying(null);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlayPause = () => {
    if (!audioPlayer.current) return;

    if (isPlaying) {
      audioPlayer.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayer.current.play();
      setIsPlaying(true);
    }
  };

  const updateProgress = () => {
    if (audioPlayer.current) {
      setCurrentTime(audioPlayer.current.currentTime);
    }
  };

  const handleMetadataLoaded = () => {
    if (audioPlayer.current) {
      setDuration(audioPlayer.current.duration);
    }
  };

  const seekAudio = (event, newValue) => {
    if (!audioPlayer.current) return;
    const seekTime = (newValue / 100) * duration;
    audioPlayer.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const rewind = () => {
    if (!audioPlayer.current) return;
    audioPlayer.current.currentTime = Math.max(
      0,
      audioPlayer.current.currentTime - 10
    );
  };

  const forward = () => {
    if (!audioPlayer.current) return;
    audioPlayer.current.currentTime = Math.min(
      duration,
      audioPlayer.current.currentTime + 10
    );
  };

  const toggleMute = () => {
    if (!audioPlayer.current) return;

    if (isMuted) {
      audioPlayer.current.volume = volume;
      setIsMuted(false);
    } else {
      audioPlayer.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (event, newValue) => {
    const newVolume = newValue / 100;
    setVolume(newVolume);
    if (audioPlayer.current) {
      audioPlayer.current.volume = newVolume;
    }
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const cyclePlaybackSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);

    if (audioPlayer.current) {
      audioPlayer.current.playbackRate = speeds[nextIndex];
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAudioEnded = () => {
    setCurrentlyPlaying(null);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleAudioError = () => {
    setError("Failed to play audio file");
    setCurrentlyPlaying(null);
    setIsPlaying(false);
  };

  const downloadAudio = async (item) => {
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
      console.error("Error downloading audio:", err);
      setError("Failed to download audio file. Please try again.");
    } finally {
      setLoadingAudioUrl(null);
    }
  };

  // Prefetch audio URL on hover over play button
  const handlePrefetchAudio = async (interactionId) => {
    // Only prefetch if not already cached
    if (!audioUrlCache.current.has(interactionId)) {
      try {
        const result = await getAudioUrl(interactionId).unwrap();
        audioUrlCache.current.set(interactionId, result);
      } catch (err) {
        // Silently fail - user can try again on click
        console.debug("Prefetch failed for audio:", interactionId);
      }
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getCallTypeColor = (callType) => {
    const types = {
      inbound: "info",
      outbound: "success",
      internal: "warning",
      missed: "error",
    };
    return types[callType?.toLowerCase()] || "default";
  };

  // Note: No useEffect needed - RTK Query automatically fetches data when params change

  return (
    <Box sx={{ p: 3, pb: currentlyPlaying ? 15 : 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 2, mt:1 }}>
        <Typography
          variant="h5"
          sx={{
            //fontSize: typography.fontSize.h4, // text-xl (20px) - Section Title
            fontWeight: typography.fontWeight.semibold,
            fontFamily: typography.fontFamily,
          }}
        >
          {t("audioRecordings.sectionTitle")}
        </Typography>
      </Box>

      {/* Database Connection Warning */}
      {!dbConfigured && (
        <Alert severity="warning" sx={{ mb: 3 }} icon={<WarningIcon />}>
          <Typography variant="subtitle2" fontWeight="bold">
            {t("audioRecordings.databaseNotConfigured")}
          </Typography>
          <Typography variant="body2">
            {t("audioRecordings.databaseNotConfiguredMessage")}
          </Typography>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setError(null)}
          icon={<ErrorIcon />}
        >
          {error}
        </Alert>
      )}

      {/* Audio Recordings Table */}
      <TableView
        dataViewInfo={recordings}
        formatDateTime={formatDateTime}
        loading={loading}
        toggleAudio={toggleAudio}
        downloadAudio={downloadAudio}
        currentlyPlaying={currentlyPlaying}
        loadingAudioUrl={loadingAudioUrl}
        handlePrefetchAudio={handlePrefetchAudio}
        page={page}
        itemsPerPage={itemsPerPage}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setItemsPerPage}
        filters={filters}
        refetch={refetch}
        setFilters={setFilters}
        setLoadCallTypes={setLoadCallTypes}
        isDebouncing={isDebouncing}
        clearFilters={clearFilters}
        callTypes={callTypes}
        setCompanyFilter={setCompanyFilter}
        setAudioFilter={setAudioFilter}
      />

      {/* Mobile-Friendly Collapsible Table */}
      <QuickFiltersMobile
        dataViewInfo={recordings}
        formatDateTime={formatDateTime}
        toggleAudio={toggleAudio}
        downloadAudio={downloadAudio}
        currentlyPlaying={currentlyPlaying}
        loadingAudioUrl={loadingAudioUrl}
        handlePrefetchAudio={handlePrefetchAudio}
        filters={filters}
        setFilters={setFilters}
        refetch={refetch}
        setLoadCallTypes={setLoadCallTypes}
        isDebouncing={isDebouncing}
        loading={loading}
        clearFilters={clearFilters}
        callTypes={callTypes}
        page={page}
        itemsPerPage={itemsPerPage}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setItemsPerPage}
      />

      {/* Audio Player Control Bar (Fixed Bottom) */}
      <Collapse in={!!currentlyPlaying}>
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            borderTop: 2,
            borderColor: "divider",
          }}
        >
          <Box sx={{ p: 2 }}>
            {/* Recording Info */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MicIcon sx={{ color: "white" }} />
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {currentRecording?.interaction_id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {currentRecording?.agent_name ||
                      t("audioRecordings.audioPlayer.unknownAgent")}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={stopAudio} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Progress Bar */}
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography variant="caption">
                  {formatTime(currentTime)}
                </Typography>
                <Typography variant="caption">
                  {formatTime(duration)}
                </Typography>
              </Box>
              <Slider
                value={progressPercentage}
                onChange={seekAudio}
                sx={{ py: 0 }}
              />
            </Box>

            {/* Controls */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Tooltip title={t("audioRecordings.tooltips.rewind10s")}>
                <IconButton onClick={rewind} size="large">
                  <FastRewindIcon />
                </IconButton>
              </Tooltip>

              <IconButton
                onClick={togglePlayPause}
                size="large"
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5568d3 0%, #63408b 100%)",
                  },
                }}
              >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>

              <Tooltip title={t("audioRecordings.tooltips.forward10s")}>
                <IconButton onClick={forward} size="large">
                  <FastForwardIcon />
                </IconButton>
              </Tooltip>

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              <Tooltip
                title={
                  isMuted
                    ? t("audioRecordings.tooltips.unmute")
                    : t("audioRecordings.tooltips.mute")
                }
              >
                <IconButton onClick={toggleMute} size="small">
                  {isMuted || volume === 0 ? (
                    <VolumeOffIcon />
                  ) : (
                    <VolumeUpIcon />
                  )}
                </IconButton>
              </Tooltip>

              <Slider
                value={volume * 100}
                onChange={handleVolumeChange}
                sx={{ width: 100 }}
                size="small"
              />

              <Button
                variant="outlined"
                size="small"
                onClick={cyclePlaybackSpeed}
                sx={{ minWidth: 60 }}
              >
                {playbackSpeed}x
              </Button>
            </Box>
          </Box>
        </Paper>
      </Collapse>

      {/* Hidden Audio Element */}
      <audio
        ref={audioPlayer}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        onTimeUpdate={updateProgress}
        onLoadedMetadata={handleMetadataLoaded}
        style={{ display: "none" }}
      />
    </Box>
  );
};

export default AudioRecordingsView;
