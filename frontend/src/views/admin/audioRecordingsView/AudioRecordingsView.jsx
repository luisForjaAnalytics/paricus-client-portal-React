import React, { useState, useEffect, useMemo, useRef } from 'react';
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
} from '@mui/material';
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
} from '@mui/icons-material';
import {
  useGetAudioRecordingsQuery,
  useGetCallTypesQuery,
  useLazyGetAudioUrlQuery,
} from '../../../store/api/audioRecordingsApi';

export const AudioRecordingsView = () => {
  // Filters
  const [filters, setFilters] = useState({
    interactionId: '',
    customerPhone: '',
    agentName: '',
    callType: '',
    startDate: '',
    endDate: '',
    company: null,
    hasAudio: null,
  });

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // RTK Query hooks
  const {
    data: recordingsData,
    isLoading: loading,
    error: apiError,
    refetch
  } = useGetAudioRecordingsQuery({
    page,
    limit: itemsPerPage,
    ...filters,
  });

  const { data: callTypes = [] } = useGetCallTypesQuery(undefined, {
    // Don't fail the component if call types can't be loaded
    refetchOnMountOrArgChange: false,
    skip: true, // Temporarily skip this query until MSSQL is configured
  });
  const [getAudioUrl] = useLazyGetAudioUrlQuery();

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

  // Methods
  // Check for API errors
  React.useEffect(() => {
    if (apiError) {
      if (apiError.status === 503) {
        setDbConfigured(false);
        setError('Database not configured. Please contact your administrator.');
      } else {
        setError(apiError.data?.message || 'Failed to load recordings');
      }
    }
  }, [apiError]);

  const clearFilters = () => {
    setFilters({
      interactionId: '',
      customerPhone: '',
      agentName: '',
      callType: '',
      startDate: '',
      endDate: '',
      company: null,
      hasAudio: null,
    });
    setPage(1);
  };

  const setCompanyFilter = (company) => {
    setFilters((prev) => ({ ...prev, company }));
    setPage(1);
  };

  const setAudioFilter = (hasAudio) => {
    setFilters((prev) => ({ ...prev, hasAudio }));
    setPage(1);
  };

  const toggleAudio = async (item) => {
    if (currentlyPlaying === item.interaction_id) {
      stopAudio();
    } else {
      try {
        setLoadingAudioUrl(item.interaction_id);

        let audioUrl = audioUrlCache.current.get(item.interaction_id);

        if (!audioUrl) {
          const result = await getAudioUrl(item.interaction_id).unwrap();
          audioUrl = result;
          audioUrlCache.current.set(item.interaction_id, audioUrl);
        }

        if (audioPlayer.current && audioUrl) {
          audioPlayer.current.src = audioUrl;
          audioPlayer.current.volume = volume;
          audioPlayer.current.playbackRate = playbackSpeed;
          await audioPlayer.current.play();
          setCurrentlyPlaying(item.interaction_id);
          setIsPlaying(true);
        }
      } catch (err) {
        console.error('Error loading audio:', err);
        setError('Failed to load audio file. Please try again.');
      } finally {
        setLoadingAudioUrl(null);
      }
    }
  };

  const stopAudio = () => {
    if (audioPlayer.current) {
      audioPlayer.current.pause();
      audioPlayer.current.currentTime = 0;
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
    audioPlayer.current.currentTime = Math.max(0, audioPlayer.current.currentTime - 10);
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
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAudioEnded = () => {
    setCurrentlyPlaying(null);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleAudioError = () => {
    setError('Failed to play audio file');
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

      window.open(audioUrl, '_blank');
    } catch (err) {
      console.error('Error downloading audio:', err);
      setError('Failed to download audio file. Please try again.');
    } finally {
      setLoadingAudioUrl(null);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getCallTypeColor = (callType) => {
    const types = {
      inbound: 'info',
      outbound: 'success',
      internal: 'warning',
      missed: 'error',
    };
    return types[callType?.toLowerCase()] || 'default';
  };

  // Note: No useEffect needed - RTK Query automatically fetches data when params change

  return (
    <Box sx={{ p: 3, pb: currentlyPlaying ? 15 : 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Audio Recordings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and listen to call recordings from the Workforce Management database
        </Typography>
      </Box>

      {/* Database Connection Warning */}
      {!dbConfigured && (
        <Alert severity="warning" sx={{ mb: 3 }} icon={<WarningIcon />}>
          <Typography variant="subtitle2" fontWeight="bold">
            Database Not Configured
          </Typography>
          <Typography variant="body2">
            SQL Server credentials are not set. Please configure MSSQL settings in the
            .env file.
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

      {/* Quick Company Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="body2" fontWeight="medium">
                  Quick Filter:
                </Typography>
                <ButtonGroup variant="outlined" size="small">
                  <Button
                    variant={filters.company === 'Flex Mobile' ? 'contained' : 'outlined'}
                    onClick={() => setCompanyFilter('Flex Mobile')}
                  >
                    Flex Mobile
                  </Button>
                  <Button
                    variant={filters.company === 'IM Telecom' ? 'contained' : 'outlined'}
                    onClick={() => setCompanyFilter('IM Telecom')}
                  >
                    IM Telecom
                  </Button>
                  <Button
                    variant={filters.company === 'Tempo Wireless' ? 'contained' : 'outlined'}
                    onClick={() => setCompanyFilter('Tempo Wireless')}
                  >
                    Tempo Wireless
                  </Button>
                </ButtonGroup>
                {filters.company && (
                  <Button size="small" onClick={() => setCompanyFilter(null)}>
                    Clear Company Filter
                  </Button>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
                <Typography variant="body2" fontWeight="medium">
                  Audio:
                </Typography>
                <ButtonGroup variant="outlined" size="small">
                  <Button
                    variant={filters.hasAudio === 'true' ? 'contained' : 'outlined'}
                    color="success"
                    onClick={() => setAudioFilter('true')}
                  >
                    With Audio
                  </Button>
                  <Button
                    variant={filters.hasAudio === 'false' ? 'contained' : 'outlined'}
                    color="error"
                    onClick={() => setAudioFilter('false')}
                  >
                    Without Audio
                  </Button>
                </ButtonGroup>
                {filters.hasAudio && (
                  <Button size="small" onClick={() => setAudioFilter(null)}>
                    All
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Advanced Filters Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Advanced Filters</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => refetch()}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : <SearchIcon />}
              >
                {loading ? 'Loading...' : 'Search'}
              </Button>
              <Button variant="outlined" onClick={clearFilters} startIcon={<ClearIcon />}>
                Clear All Filters
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Interaction ID"
                placeholder="Search by interaction ID"
                value={filters.interactionId}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, interactionId: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Customer Phone"
                placeholder="Search by phone number"
                value={filters.customerPhone}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, customerPhone: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Agent Name"
                placeholder="Search by agent name"
                value={filters.agentName}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, agentName: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Call Type</InputLabel>
                <Select
                  value={filters.callType}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, callType: e.target.value }))
                  }
                  label="Call Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  {callTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results Card */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h6">Call Recordings</Typography>
              <Typography variant="body2" color="text.secondary">
                {totalCount} total recordings found • Showing {recordings.length} per page
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {currentlyPlaying && (
                <Chip
                  icon={<MicIcon />}
                  label="Playing Audio"
                  color="success"
                  variant="outlined"
                />
              )}
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Per Page</InputLabel>
                <Select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(e.target.value);
                    setPage(1); // Reset to first page when changing items per page
                  }}
                  label="Per Page"
                >
                  <MenuItem value={10}>10 items</MenuItem>
                  <MenuItem value={15}>15 items</MenuItem>
                  <MenuItem value={25}>25 items</MenuItem>
                  <MenuItem value={50}>50 items</MenuItem>
                  <MenuItem value={100}>100 items</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Loading State */}
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
              <CircularProgress size={48} sx={{ mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Loading recordings...
              </Typography>
            </Box>
          ) : recordings.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <MicIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No recordings found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search filters
              </Typography>
            </Box>
          ) : (
            <>
              {/* Data Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Interaction ID</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell>Call Type</TableCell>
                      <TableCell>Start Time</TableCell>
                      <TableCell>End Time</TableCell>
                      <TableCell>Customer Phone</TableCell>
                      <TableCell>Agent Name</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recordings.map((item) => (
                      <TableRow key={item.interaction_id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {item.interaction_id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.company_name || 'Unknown'}
                            color="primary"
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.call_type || 'N/A'}
                            color={getCallTypeColor(item.call_type)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDateTime(item.start_time)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDateTime(item.end_time)}
                          </Typography>
                        </TableCell>
                        <TableCell>{item.customer_phone || 'N/A'}</TableCell>
                        <TableCell>{item.agent_name || 'N/A'}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {item.audiofilename ? (
                              <>
                                <Tooltip
                                  title={
                                    currentlyPlaying === item.interaction_id
                                      ? 'Stop'
                                      : 'Play'
                                  }
                                >
                                  <IconButton
                                    size="small"
                                    onClick={() => toggleAudio(item)}
                                    disabled={loadingAudioUrl === item.interaction_id}
                                    color={
                                      currentlyPlaying === item.interaction_id
                                        ? 'error'
                                        : 'success'
                                    }
                                  >
                                    {loadingAudioUrl === item.interaction_id ? (
                                      <CircularProgress size={20} />
                                    ) : currentlyPlaying === item.interaction_id ? (
                                      <StopIcon />
                                    ) : (
                                      <PlayArrowIcon />
                                    )}
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Download">
                                  <IconButton
                                    size="small"
                                    onClick={() => downloadAudio(item)}
                                    disabled={loadingAudioUrl === item.interaction_id}
                                    color="primary"
                                  >
                                    <DownloadIcon />
                                  </IconButton>
                                </Tooltip>
                              </>
                            ) : (
                              <Chip label="No Audio" size="small" variant="outlined" />
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {((page - 1) * itemsPerPage) + 1} to {Math.min(page * itemsPerPage, totalCount)} of {totalCount} recordings
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Page {page} of {totalPages}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                    showFirstButton
                    showLastButton
                    size="large"
                  />
                </Box>
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      {/* Audio Player Control Bar (Fixed Bottom) */}
      <Collapse in={!!currentlyPlaying}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            borderTop: 2,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ p: 2 }}>
            {/* Recording Info */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MicIcon sx={{ color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {currentRecording?.interaction_id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {currentRecording?.agent_name || 'Unknown Agent'}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={stopAudio} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Progress Bar */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption">{formatTime(currentTime)}</Typography>
                <Typography variant="caption">{formatTime(duration)}</Typography>
              </Box>
              <Slider
                value={progressPercentage}
                onChange={seekAudio}
                sx={{ py: 0 }}
              />
            </Box>

            {/* Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Tooltip title="Rewind 10s">
                <IconButton onClick={rewind} size="large">
                  <FastRewindIcon />
                </IconButton>
              </Tooltip>

              <IconButton
                onClick={togglePlayPause}
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #63408b 100%)',
                  },
                }}
              >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>

              <Tooltip title="Forward 10s">
                <IconButton onClick={forward} size="large">
                  <FastForwardIcon />
                </IconButton>
              </Tooltip>

              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

              <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
                <IconButton onClick={toggleMute} size="small">
                  {isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
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
        style={{ display: 'none' }}
      />
    </Box>
  );
};


