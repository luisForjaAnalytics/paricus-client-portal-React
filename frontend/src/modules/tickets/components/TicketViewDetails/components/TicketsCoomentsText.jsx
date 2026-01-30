import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { AlertInline } from "../../../../../common/components/ui/AlertInline";
import HistoryIcon from "@mui/icons-material/History";
import CommentIcon from "@mui/icons-material/Comment";
import { useTranslation } from "react-i18next";
import { TicketUpdateStatus } from "./TicketUpdateStatus";
import { TicketHistoricalInfo } from "./TicketHistoricalInfo";
import { colors } from "../../../../../common/styles/styles";

export const TicketsCoomentsText = ({ ticket }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    try {
      setActiveTab(newValue);
    } catch (error) {
      console.error("Error changing tab:", error);
    }
  };

  // Validate ticket prop
  if (!ticket) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: "#fff",
          borderRadius: "12px",
          border: "1px solid #E5E7EB",
          padding: "1rem",
        }}
      >
        <AlertInline
          message={t("common.error") || "Ticket data not available"}
          severity="warning"
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "65%", // Ocupa el 60% de la altura disponible
        backgroundColor: "#fff",
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
        overflow: "hidden",
        margin: "1rem 0 1rem 1rem", // Same margin as descriptionSection
      }}
    >
      {/* Tabs Header */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="ticket tabs"
          sx={{
            "& .MuiTab-root": {
              textTransform: "uppercase",
              fontWeight: 600,
              fontSize: "0.75rem", // Same as descriptionTitle
              letterSpacing: "0.05em",
              minHeight: "48px",
              color: colors.datailsTitleColor, // Same color as DESCRIPTION title
            },
            "& .MuiTab-root.Mui-selected": {
              color: colors.datailsTitleColor, // Keep same color when selected
            },
            "& .MuiTabs-indicator": {
              backgroundColor: colors.datailsTitleColor, // Indicator color
            },
          }}
        >
          <Tab
            icon={<HistoryIcon sx={{ fontSize: "1rem", color: colors.datailsTitleColor }} />}
            iconPosition="start"
            label={t("tickets.ticketView.historical")}
          />
          <Tab
            icon={<CommentIcon sx={{ fontSize: "1rem", color: colors.datailsTitleColor }} />}
            iconPosition="start"
            label={t("tickets.ticketView.comments")}
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {/* Historical Tab Content */}
        {activeTab === 0 && (
          <Box
            sx={{
              height: "100%",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TicketHistoricalInfo ticket={ticket} />
          </Box>
        )}

        {/* Comments Tab Content */}
        {activeTab === 1 && (
          <Box
            sx={{
              height: "100%",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TicketUpdateStatus />
          </Box>
        )}
      </Box>
    </Box>
  );
};
