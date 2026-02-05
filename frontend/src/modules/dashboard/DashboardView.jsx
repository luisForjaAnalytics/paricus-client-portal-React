import { useState } from "react";
import { Box } from "@mui/material";
import { boxTypography } from "../../common/styles/styles";
import { DashboardHeader } from "./components/DashboardHeader/DashboardHeader";
import { DashboardViewSelect } from "./components/DashboardViewSelect/DashboardViewSelect";

/**
 * DashboardView - Main dashboard component
 * Simple wrapper that renders header and content components
 */
export const DashboardView = () => {
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleSelectionChange = ({ clientId, userId }) => {
    setSelectedClientId(clientId);
    setSelectedUserId(userId);
  };

  return (
    <Box sx={boxTypography.box}>
      {/* Page Header with Selector */}
      <DashboardHeader onSelectionChange={handleSelectionChange} />

      {/* Dashboard Content */}
      <DashboardViewSelect
        selectedClientId={selectedClientId}
        selectedUserId={selectedUserId}
      />
    </Box>
  );
};
