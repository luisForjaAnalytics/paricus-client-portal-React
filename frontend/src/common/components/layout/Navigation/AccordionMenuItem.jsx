import { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { colors } from "../../../styles/styles";

export const AccordionMenuItem = ({
  label,
  icon,
  subItems,
  setTitleState,
  titleState,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const authUser = useSelector((state) => state.auth.user);

  // Filter subItems based on permissions
  const filteredSubItems = subItems.filter((subItem) => {
    if (!subItem.permission) return true;
    return authUser?.permissions?.includes(subItem.permission);
  });

  const handleClick = () => {
    setOpen(!open);
  };

  const handleSubItemClick = (subItem) => {
    setTitleState(subItem.label);
    navigate(`/app/${subItem.route}`);
  };

  // Check if any subItem is selected
  const isSubItemSelected = filteredSubItems.some((item) => titleState === item.label);
  const isSelected = isSubItemSelected || titleState === label;

  // Don't render if no subItems are available after filtering
  if (filteredSubItems.length === 0) {
    return null;
  }

  return (
    <>
      <List sx={{ width: "100%", py: 0.5 }} aria-label="contacts">
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleClick}
            disableRipple
            sx={{
              backgroundColor: "transparent",
              border: isSelected
                ? `2px solid ${colors.drowerIcons}`
                : "2px solid transparent",
              borderRadius: isSelected ? "10px" : "0",
              px: 2.5,
              paddingTop: "0%",
              paddingBottom: "0%",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "transparent",
              },
              "&:active": {
                backgroundColor: "transparent",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: "auto",
                justifyContent: "center",
              }}
            >
              <Box
                className="icon-circle"
                sx={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "15%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "transparent",
                  transition: "all 0.3s ease",
                  "& svg": {
                    color: "#D1FAE5",
                  },
                }}
              >
                {icon}
              </Box>
            </ListItemIcon>
            <ListItemText
              primary={t(`navigation.${label}`)}
              sx={{
                color: "#D1FAE5",
                fontWeight: isSelected ? "bold" : "normal",
              }}
            />
            {open ? (
              <ExpandLess sx={{ color: "#D1FAE5" }} />
            ) : (
              <ExpandMore sx={{ color: "#D1FAE5" }} />
            )}
          </ListItemButton>
        </ListItem>
      </List>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {filteredSubItems.map((subItem, index) => {
            const isSubSelected = titleState === subItem.label;
            return (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => handleSubItemClick(subItem)}
                  sx={{
                    pl: 9,
                    backgroundColor: "transparent",
                    border: isSubSelected
                      ? `2px solid ${colors.drowerIcons}`
                      : "2px solid transparent",
                    borderRadius: isSubSelected ? "10px" : "0",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <ListItemText
                    primary={t(`navigation.${subItem.label}`)}
                    sx={{
                      color: "#D1FAE5",
                      fontWeight: isSubSelected ? "bold" : "normal",
                    }}
                  />
                  {subItem.icon && (
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        ml: 1,
                        justifyContent: "center",
                        "& svg": {
                          color: "#D1FAE5",
                        },
                      }}
                    >
                      {subItem.icon}
                    </ListItemIcon>
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </>
  );
};
