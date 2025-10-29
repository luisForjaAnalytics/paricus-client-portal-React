import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const ItemMenu = ({ label, icon, route, setTitleState, titleState }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isSelected = titleState === label;

  const handleRedirect = () => {
    setTitleState(label);
    navigate(`/app/${route}`);
  };

  return (
    <List sx={{ width: "100%", maxWidth: 360 }} aria-label="contacts">
      <ListItem disablePadding>
        <ListItemButton
          onClick={handleRedirect}
          disableRipple
          sx={{
            opacity: isSelected ? 1 : 0.5,
            backgroundColor: "transparent",
            "&:hover": {
              opacity: 1,
              backgroundColor: "transparent",
              boxShadow: "none",
              "& .icon-circle": {
                backgroundColor: isSelected ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.2)",
              },
            },
            "&:active": {
              backgroundColor: "transparent",
            },
          }}
        >
          <ListItemIcon>
            <Box
              className="icon-circle"
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isSelected ? "#ffffff" : "transparent",
                transition: "all 0.3s ease",
                "& svg": {
                  color: isSelected ? "#0c7b3f" : "white",
                },
              }}
            >
              {icon}
            </Box>
          </ListItemIcon>
          <ListItemText
            primary={t(`navigation.${label}`)}
            sx={{
              color: "white",
              fontWeight: isSelected ? "bold" : "normal",
            }}
          />
        </ListItemButton>
      </ListItem>
    </List>
  );
};
