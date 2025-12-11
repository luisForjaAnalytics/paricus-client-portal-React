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
import { QuickFilters } from "../QuickFilters";
import { colors } from "../../../../common/styles/styles";

export const AdvancedFilters = ({
  filters,
  refetch,
  setFilters,
  setLoadCallTypes,
  isDebouncing,
  loading,
  clearFilters,
  callTypes,

}) => {
  const { t } = useTranslation();

  const greenFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "${colors.primary}",
      },
    },
    "& .MuiInputLabel-root": {
      "&.Mui-focused": {
        color: "${colors.primary}",
      },
    },
  };

  return (
    <Box sx={{margin:'0.5rem 0 -0.5rem 0'}}>
      
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
              backgroundColor: "${colors.primary}",
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
              backgroundColor: "${colors.primary}",
              color: "#ffff",
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

export default AdvancedFilters;
