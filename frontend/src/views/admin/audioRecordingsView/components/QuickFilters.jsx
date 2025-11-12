import React from "react";
import { Box, Button, Typography } from "@mui/material";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import { companies } from "./company.js";
import { useTranslation } from "react-i18next";
import { colors } from "../../../../layouts/style/styles";

export const QuickFilters = ({ setCompanyFilter, setAudioFilter, filters }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        margin: "0.5rem 0 0.5rem 0",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      {/* Left section - Title */}
      <Typography variant="h6" sx={{ minWidth: "fit-content" }}>
        {t("audioRecordings.quickFilter.label")}
      </Typography>

      {/* Center section - Company filter buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 1.2,
          flexWrap: "wrap",
          justifyContent: "center",
          flex: "1 1 auto",
        }}
      >
        {companies.map((item, index) => (
          <Button
            key={index}
            variant="contained"
            onClick={() => setCompanyFilter(item.name)}
            sx={{
              backgroundColor:
                filters.company === item.name ? "${colors.primary}" : "#0c7b4018",
              color: filters.company === item.name ? "#fff" : "#00000075",
              "&:hover": {
                backgroundColor:
                  filters.company === item.name ? "#0a6333" : "#0c7b4094",
              },
              borderRadius: "1rem",
              fontWeight: "bold",
              boxShadow: "none",
              textTransform: "none",
            }}
          >
            {item.name}
          </Button>
        ))}
      </Box>

      {/* Right section - Clear button */}
      <Button
        disabled={Boolean(!filters.company)}
        onClick={() => setCompanyFilter(null)}
        variant="contained"
        startIcon={<FilterListOffIcon />}
        sx={{
          backgroundColor: Boolean(!filters.company) ? "#0c7b4018" : "${colors.primary}",
          color: Boolean(!filters.company) ? "#00000075" : "#fff",
          "&:hover": {
            backgroundColor: Boolean(!filters.company)
              ? "#0c7b4018"
              : "#0a6333",
          },
          borderRadius: "1rem",
          fontWeight: "bold",
          boxShadow: "none",
          textTransform: "none",
          minWidth: "fit-content",
        }}
      >
        {t("audioRecordings.quickFilter.clearCompanyFilter")}
      </Button>
    </Box>
  );
};
