import { useEffect, useState, useMemo } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import { Outlet, useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { boxTypography, colors, titlesTypography } from "../../common/styles/styles";

function a11yProps(index) {
  return {
    id: `quick-broadcast-tab-${index}`,
    "aria-controls": `quick-broadcast-tabpanel-${index}`,
  };
}

const allTabs = [
  { route: "quick-broadcast", label: "quickBroadcast", permission: "broadcast_announcements" },
  { route: "swiper-control", label: "swiperControl", permission: "broadcast_swiper" },
  { route: "kpi-control", label: "kpiControl", permission: "broadcast_kpi" },
];

export const QuickBroadcast = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const userPermissions = useSelector((state) => state.auth.user?.permissions || []);

  let setTitleState;
  try {
    const context = useOutletContext();
    setTitleState = context?.setTitleState;
  } catch {
    // no context available
  }

  // Filter tabs based on user's specific sub-permissions
  const tabs = useMemo(() => {
    return allTabs.filter((tab) => userPermissions.includes(tab.permission));
  }, [userPermissions]);

  // Determine active tab from current URL
  const currentPath = location.pathname.split("/").pop();
  const initialTab = tabs.findIndex((tab) => tab.route === currentPath);
  const [activeTab, setActiveTab] = useState(initialTab >= 0 ? initialTab : 0);

  useEffect(() => {
    if (tabs.length === 0) return;
    const safeTab = activeTab >= tabs.length ? 0 : activeTab;
    const selected = tabs[safeTab];
    navigate(`/app/broadcast/${selected.route}`, { replace: true });
    if (setTitleState) setTitleState(selected.label);
  }, [activeTab, tabs, navigate, setTitleState]);

  // Sync tab when URL changes externally (e.g. from mobile drawer)
  useEffect(() => {
    const path = location.pathname.split("/").pop();
    const idx = tabs.findIndex((tab) => tab.route === path);
    if (idx >= 0 && idx !== activeTab) {
      setActiveTab(idx);
    }
  }, [location.pathname, tabs]);

  const handleChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  if (tabs.length === 0) return null;

  return (
    <Box sx={boxTypography.box}>
      {/* Tabs - hidden on mobile (mobile uses drawer accordion) */}
      <Box sx={{ borderBottom: 0, display: { xs: "none", md: "contents" } }}>
        <Tabs
          value={activeTab >= tabs.length ? 0 : activeTab}
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
