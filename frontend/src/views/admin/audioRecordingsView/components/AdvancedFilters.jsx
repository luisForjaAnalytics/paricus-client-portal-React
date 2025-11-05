import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  ClickAwayListener,
  Collapse,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterListOff as FilterListOffIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { QuickFilters } from "./QuickFilters";

export const AdvancedFilters = ({
  filters,
  refetch,
  setFilters,
  setLoadCallTypes,
  isDebouncing,
  loading,
  clearFilters,
  callTypes,
  setCompanyFilter,
  setAudioFilter,
}) => {
  const { t } = useTranslation();
  // const [isExpanded, setIsExpanded] = useState(false);

  // Green theme styling for TextField and Select components
  const greenFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#0c7b3f",
      },
    },
    "& .MuiInputLabel-root": {
      "&.Mui-focused": {
        color: "#0c7b3f",
      },
    },
  };

  // const handleToggle = () => {
  //   setIsExpanded(!isExpanded);
  // };

  // const handleClickAway = () => {
  //   setIsExpanded(false);
  // };

  return (
    <Box sx={{margin:'0.5rem 0 -0.5rem 0'}}>
      {/* COMMENTED OUT: Original Card/ClickAwayListener wrapper */}
      {/* <ClickAwayListener onClickAway={handleClickAway}>
        <Card sx={{ mb: 3, borderRadius: "0.7rem" }}>
          <CardContent> */}

      {/* <QuickFilters
              setCompanyFilter={setCompanyFilter}
              setAudioFilter={setAudioFilter}
              filters={filters}
            /> */}

      {/* <Divider
              sx={{
                width: "95%",
                margin: "1.5rem auto",
                backgroundColor: "#0c7b3f",
                height: "2px",
              }}
            /> */}

      {/* COMMENTED OUT: Header with expand/collapse button */}
      {/* <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: { xs: "flex-start", sm: "space-between" },
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2,
                mb: isExpanded ? 2 : 0,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                  cursor: "pointer",
                }}
                onClick={handleToggle}
              >
                <Typography variant="h6">
                  {t("audioRecordings.advancedFilters.title")}
                </Typography>
                <IconButton
                  size="small"
                  sx={{
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s",
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
                {isDebouncing && (
                  <Chip
                    icon={<CircularProgress size={16} />}
                    label={t("audioRecordings.advancedFilters.typing")}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box> */}

      {/* COMMENTED OUT: Collapse wrapper */}
      {/* <Collapse in={isExpanded}> */}

      {/* COMMENTED OUT: Action Buttons - Now in Grid */}
      {/* <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                width: "100%",
                mb: 2,
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                onClick={() => refetch()}
                disabled={loading || isDebouncing}
                startIcon={
                  loading ? <CircularProgress size={16} /> : <SearchIcon />
                }
                sx={{
                  flex: { xs: "1 1 auto", sm: "0 1 auto" },
                  borderRadius:'1rem',
                  backgroundColor: "#0c7b3f",
                  "&:hover": {
                    backgroundColor: "#0a6333",
                  },
                  "&:disabled": {
                    backgroundColor: "#0c7b404b",
                  },
                }}
              >
                {loading
                  ? t("audioRecordings.advancedFilters.loading")
                  : t("audioRecordings.advancedFilters.search")}
              </Button>
              <Button
                variant="contained"
                onClick={clearFilters}
                startIcon={<FilterListOffIcon />}
                sx={{
                  flex: { xs: "1 1 auto", sm: "0 1 auto" },
                  backgroundColor: "#0c7b3f",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#0a6333",
                  },
                  borderRadius:'1rem',
                  fontWeight: "bold",
                  boxShadow: "none",
                  textTransform: "none",
                }}
              >
                {t("audioRecordings.advancedFilters.clearAll")}
              </Button>
            </Box> */}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label={t("audioRecordings.advancedFilters.interactionId")}
            placeholder={t(
              "audioRecordings.advancedFilters.interactionIdPlaceholder"
            )}
            value={filters.interactionId}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                interactionId: e.target.value,
              }))
            }
            sx={greenFieldStyles}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label={t("audioRecordings.advancedFilters.customerPhone")}
            placeholder={t(
              "audioRecordings.advancedFilters.customerPhonePlaceholder"
            )}
            value={filters.customerPhone}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                customerPhone: e.target.value,
              }))
            }
            sx={greenFieldStyles}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label={t("audioRecordings.advancedFilters.agentName")}
            placeholder={t(
              "audioRecordings.advancedFilters.agentNamePlaceholder"
            )}
            value={filters.agentName}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                agentName: e.target.value,
              }))
            }
            sx={greenFieldStyles}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl
            sx={{
              width: "10rem",
              ...greenFieldStyles,
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
              },
            }}
          >
            <InputLabel id="call-type-label">
              {t("audioRecordings.advancedFilters.callType")}
            </InputLabel>
            <Select
              labelId="call-type-label"
              id="call-type-select"
              value={filters.callType}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  callType: e.target.value,
                }))
              }
              onOpen={() => setLoadCallTypes(true)}
              label={t("audioRecordings.advancedFilters.callType")}
            >
              <MenuItem value="">
                {t("audioRecordings.advancedFilters.allTypes")}
              </MenuItem>
              {callTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label={t("audioRecordings.advancedFilters.startDate")}
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.startDate}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                startDate: e.target.value,
              }))
            }
            sx={greenFieldStyles}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label={t("audioRecordings.advancedFilters.endDate")}
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.endDate}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, endDate: e.target.value }))
            }
            sx={greenFieldStyles}
          />
        </Grid>

        {/* Action Buttons as Grid Items */}
        <Grid item xs={12} sm={6} md={4} sx={{ marginTop: "0.5rem" }}>
          <Button
            fullWidth
            variant="contained"
            size="small"
            onClick={() => refetch()}
            disabled={loading || isDebouncing}
            startIcon={
              loading ? (
                <CircularProgress size={14} />
              ) : (
                <SearchIcon fontSize="small" />
              )
            }
            sx={{
              height: "40px",
              borderRadius: "0.8rem",
              backgroundColor: "#0c7b3f",
              "&:hover": {
                backgroundColor: "#0a6333",
              },
              "&:disabled": {
                backgroundColor: "#0c7b404b",
              },
              fontSize: "0.875rem",
            }}
          >
            {loading
              ? t("audioRecordings.advancedFilters.loading")
              : t("audioRecordings.advancedFilters.search")}
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={4} sx={{ marginTop: "0.5rem" }}>
          <Button
            fullWidth
            variant="contained"
            size="small"
            onClick={clearFilters}
            startIcon={<FilterListOffIcon fontSize="small" />}
            sx={{
              height: "40px",
              backgroundColor: "#0c7b3f",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#0a6333",
              },
              borderRadius: "0.8rem",
              fontWeight: "bold",
              boxShadow: "none",
              textTransform: "none",
              fontSize: "0.875rem",
            }}
          >
            {t("audioRecordings.advancedFilters.clearAll")}
          </Button>
        </Grid>
      </Grid>

      {/* COMMENTED OUT: Closing tags for Collapse, CardContent, Card, ClickAwayListener */}
      {/* </Collapse>
        </CardContent>
      </Card>
    </ClickAwayListener> */}
    </Box>
  );
};
