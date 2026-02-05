import PropTypes from "prop-types";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Slider,
  Button,
  Tooltip,
  Collapse,
  Divider,
} from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  Close as CloseIcon,
  Pause as PauseIcon,
  FastRewind as FastRewindIcon,
  FastForward as FastForwardIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Mic as MicIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

/**
 * AudioPlayerBar - Fixed bottom audio player component
 */
export const AudioPlayerBar = ({
  currentlyPlaying,
  currentRecording,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  playbackSpeed,
  progressPercentage,
  audioPlayer,
  // Actions
  stopAudio,
  togglePlayPause,
  seekAudio,
  rewind,
  forward,
  toggleMute,
  handleVolumeChange,
  cyclePlaybackSpeed,
  // Handlers
  updateProgress,
  handleMetadataLoaded,
  handleAudioEnded,
  handleAudioError,
  // Utilities
  formatTime,
}) => {
  const { t } = useTranslation();

  return (
    <>
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
    </>
  );
};

AudioPlayerBar.propTypes = {
  currentlyPlaying: PropTypes.string,
  currentRecording: PropTypes.shape({
    interaction_id: PropTypes.string,
    agent_name: PropTypes.string,
  }),
  isPlaying: PropTypes.bool.isRequired,
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  volume: PropTypes.number.isRequired,
  isMuted: PropTypes.bool.isRequired,
  playbackSpeed: PropTypes.number.isRequired,
  progressPercentage: PropTypes.number.isRequired,
  audioPlayer: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  stopAudio: PropTypes.func.isRequired,
  togglePlayPause: PropTypes.func.isRequired,
  seekAudio: PropTypes.func.isRequired,
  rewind: PropTypes.func.isRequired,
  forward: PropTypes.func.isRequired,
  toggleMute: PropTypes.func.isRequired,
  handleVolumeChange: PropTypes.func.isRequired,
  cyclePlaybackSpeed: PropTypes.func.isRequired,
  updateProgress: PropTypes.func.isRequired,
  handleMetadataLoaded: PropTypes.func.isRequired,
  handleAudioEnded: PropTypes.func.isRequired,
  handleAudioError: PropTypes.func.isRequired,
  formatTime: PropTypes.func.isRequired,
};

AudioPlayerBar.defaultProps = {
  currentlyPlaying: null,
  currentRecording: null,
  audioPlayer: null,
};
