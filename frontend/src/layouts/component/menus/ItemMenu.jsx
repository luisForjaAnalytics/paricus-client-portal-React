import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const ItemMenu = ({ label, icon, route }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate(`/app/${route}`);
  };

  return (
    <List sx={{ width: "100%", maxWidth: 360 }} aria-label="contacts">
      <ListItem disablePadding>
        <ListItemButton onClick={handleRedirect}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText
            primary={t(`navigation.${label}`)}
            sx={{ color: "white", fontWeight: "bold" }}
          />
        </ListItemButton>
      </ListItem>
    </List>
  );
};
