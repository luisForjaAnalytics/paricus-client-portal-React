import { useEffect, useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import { Outlet, useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { boxTypography, colors, titlesTypography } from "../../common/styles/styles";

function a11yProps(index) {
  return {
    id: `quick-broadcast-tab-${index}`,
    "aria-controls": `quick-broadcast-tabpanel-${index}`,
  };
}

const tabs = [
  { route: "quick-broadcast", label: "quickBroadcast" },
  { route: "swiper-control", label: "swiperControl" },
  { route: "kpi-control", label: "kpiControl" },
];

export const QuickBroadcast = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  let setTitleState;
  try {
    const context = useOutletContext();
    setTitleState = context?.setTitleState;
  } catch {
    // no context available
  }

  // Determine active tab from current URL
  const currentPath = location.pathname.split("/").pop();
  const initialTab = tabs.findIndex((tab) => tab.route === currentPath);
  const [activeTab, setActiveTab] = useState(initialTab >= 0 ? initialTab : 0);

  useEffect(() => {
    const selected = tabs[activeTab];
    navigate(`/app/broadcast/${selected.route}`, { replace: true });
    if (setTitleState) setTitleState(selected.label);
  }, [activeTab, navigate, setTitleState]);

  // Sync tab when URL changes externally (e.g. from mobile drawer)
  useEffect(() => {
    const path = location.pathname.split("/").pop();
    const idx = tabs.findIndex((tab) => tab.route === path);
    if (idx >= 0 && idx !== activeTab) {
      setActiveTab(idx);
    }
  }, [location.pathname]);

  const handleChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={boxTypography.box}>
      {/* Tabs - hidden on mobile (mobile uses drawer accordion) */}
      <Box sx={{ borderBottom: 0, display: { xs: "none", md: "contents" } }}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          sx={{
            "& .MuiTab-root": {
              color: "#1a7e22ff 0%",
            },
            "& .Mui-selected": {
              color: "black !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: colors.primary,
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={tab.route}
              label={
                <Typography sx={titlesTypography.managementSection}>
                  {t(`navigation.${tab.label}`)}
                </Typography>
              }
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Box>

      {/* Content - rendered by nested routes */}
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};
