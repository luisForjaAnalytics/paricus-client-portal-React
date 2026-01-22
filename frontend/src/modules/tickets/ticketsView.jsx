import { useEffect, useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  typography,
  colors,
  titlesTypography,
} from "../../common/styles/styles";
import { usePermissions } from "../../common/hooks/usePermissions";

function a11yProps(index) {
  return {
    id: `tickets-tab-${index}`,
    "aria-controls": `tickets-tabpanel-${index}`,
  };
}

export const TicketsView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isBPOAdmin, isClientAdmin } = usePermissions();

  // Only BPO Admin and Client Admin can see Change Requests tab
  const canSeeChangeRequests = isBPOAdmin() || isClientAdmin();

  // Build tabs array
  const availableTabs = [
    { route: "ticketTable", label: t("tickets.sectionTitle") || "Tickets" },
  ];

  if (canSeeChangeRequests) {
    availableTabs.push({
      route: "changeRequests",
      label: t("tickets.changeRequests.tabTitle") || "Change Requests",
    });
  }

  // Determine current tab based on URL
  const getCurrentTabIndex = () => {
    const path = location.pathname;
    if (path.includes("changeRequests")) return 1;
    return 0;
  };

  const [value, setValue] = useState(getCurrentTabIndex());

  // Update tab when URL changes
  useEffect(() => {
    setValue(getCurrentTabIndex());
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const selectedTab = availableTabs[newValue];
    navigate(`/app/tickets/${selectedTab.route}`);
  };

  return (
    <Box sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
      {/* Tabs Navigation */}
      {availableTabs.length > 1 && (
        <Box sx={{ borderBottom: 0, display: { xs: "none", md: "block" } }}>
          <Tabs
            value={value}
            onChange={handleChange}
            sx={{
              "& .MuiTab-root": {
                color: "#1a7e22ff 0%",
              },
              "& .Mui-selected": {
                color: `black !important`,
              },
              "& .MuiTabs-indicator": {
                backgroundColor: `${colors.primary}`,
              },
            }}
          >
            {availableTabs.map((tab, index) => (
              <Tab
                key={tab.route}
                label={
                  <Typography
                    sx={{ ...titlesTypography.managementSection, mt: -2 }}
                  >
                    {tab.label}
                  </Typography>
                }
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
        </Box>
      )}

      <Outlet />
    </Box>
  );
};
