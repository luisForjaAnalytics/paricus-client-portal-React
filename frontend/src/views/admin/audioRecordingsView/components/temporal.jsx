      {/* Results Card */}
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h6">
                {t("audioRecordings.results.title")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {totalCount} {t("audioRecordings.results.totalRecordings")} •{" "}
                {t("audioRecordings.results.showing")} {recordings.length}{" "}
                {t("audioRecordings.results.perPage")}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {currentlyPlaying && (
                <Chip
                  icon={<MicIcon />}
                  label={t("audioRecordings.results.playingAudio")}
                  color="success"
                  variant="outlined"
                />
              )}
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>
                  {t("audioRecordings.results.perPageLabel")}
                </InputLabel>
                <Select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(e.target.value);
                    setPage(1);
                  }}
                  label={t("audioRecordings.results.perPageLabel")}
                >
                  <MenuItem value={10}>
                    10 {t("audioRecordings.results.items")}
                  </MenuItem>
                  <MenuItem value={15}>
                    15 {t("audioRecordings.results.items")}
                  </MenuItem>
                  <MenuItem value={25}>
                    25 {t("audioRecordings.results.items")}
                  </MenuItem>
                  <MenuItem value={50}>
                    50 {t("audioRecordings.results.items")}
                  </MenuItem>
                  <MenuItem value={100}>
                    100 {t("audioRecordings.results.items")}
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Loading State */}
          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 8,
              }}
            >
              <CircularProgress size={48} sx={{ mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                {t("audioRecordings.results.loadingRecordings")}
              </Typography>
            </Box>
          ) : recordings.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <MicIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {t("audioRecordings.results.noRecordings")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("audioRecordings.results.tryAdjusting")}
              </Typography>
            </Box>
          ) : (
            <>
              {/* Data Table */}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {t("audioRecordings.table.interactionId")}
                      </TableCell>
                      <TableCell>
                        {t("audioRecordings.table.company")}
                      </TableCell>
                      <TableCell>
                        {t("audioRecordings.table.callType")}
                      </TableCell>
                      <TableCell>
                        {t("audioRecordings.table.startTime")}
                      </TableCell>
                      <TableCell>
                        {t("audioRecordings.table.endTime")}
                      </TableCell>
                      <TableCell>
                        {t("audioRecordings.table.customerPhone")}
                      </TableCell>
                      <TableCell>
                        {t("audioRecordings.table.agentName")}
                      </TableCell>
                      <TableCell>
                        {t("audioRecordings.table.actions")}
                      </TableCell>
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
                            label={
                              item.company_name ||
                              t("audioRecordings.table.unknown")
                            }
                            color="primary"
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.call_type || "N/A"}
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
                        <TableCell>{item.customer_phone || "N/A"}</TableCell>
                        <TableCell>{item.agent_name || "N/A"}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            {item.audiofilename ? (
                              <>
                                <Tooltip
                                  title={
                                    currentlyPlaying === item.interaction_id
                                      ? t("audioRecordings.tooltips.stop")
                                      : t("audioRecordings.tooltips.play")
                                  }
                                >
                                  <IconButton
                                    size="small"
                                    onClick={() => toggleAudio(item)}
                                    onMouseEnter={() =>
                                      handlePrefetchAudio(item.interaction_id)
                                    }
                                    disabled={
                                      loadingAudioUrl === item.interaction_id
                                    }
                                    color={
                                      currentlyPlaying === item.interaction_id
                                        ? "error"
                                        : "success"
                                    }
                                  >
                                    {loadingAudioUrl === item.interaction_id ? (
                                      <CircularProgress size={20} />
                                    ) : currentlyPlaying ===
                                      item.interaction_id ? (
                                      <StopIcon />
                                    ) : (
                                      <PlayArrowIcon />
                                    )}
                                  </IconButton>
                                </Tooltip>
                                <Tooltip
                                  title={t("audioRecordings.tooltips.download")}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={() => downloadAudio(item)}
                                    onMouseEnter={() =>
                                      handlePrefetchAudio(item.interaction_id)
                                    }
                                    disabled={
                                      loadingAudioUrl === item.interaction_id
                                    }
                                    color="primary"
                                  >
                                    <DownloadIcon />
                                  </IconButton>
                                </Tooltip>
                              </>
                            ) : (
                              <Chip
                                label={t("audioRecordings.table.noAudio")}
                                size="small"
                                variant="outlined"
                              />
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {t("audioRecordings.pagination.showingFrom")}{" "}
                    {(page - 1) * itemsPerPage + 1}{" "}
                    {t("audioRecordings.pagination.to")}{" "}
                    {Math.min(page * itemsPerPage, totalCount)}{" "}
                    {t("audioRecordings.pagination.of")} {totalCount}{" "}
                    {t("audioRecordings.pagination.recordings")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("audioRecordings.pagination.page")} {page}{" "}
                    {t("audioRecordings.pagination.of")} {totalPages}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    onMouseEnter={(e) => {
                      // Prefetch adjacent pages when hovering over pagination
                      const target = e.target.closest("button");
                      if (target) {
                        const ariaLabel = target.getAttribute("aria-label");
                        if (ariaLabel?.includes("page")) {
                          const pageNum = parseInt(ariaLabel.match(/\d+/)?.[0]);
                          if (pageNum) handlePrefetchPage(pageNum);
                        } else if (ariaLabel?.includes("next")) {
                          handlePrefetchPage(page + 1);
                        } else if (ariaLabel?.includes("previous")) {
                          handlePrefetchPage(page - 1);
                        }
                      }
                    }}
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