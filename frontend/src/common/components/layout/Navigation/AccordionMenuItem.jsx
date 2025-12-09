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
              border: "2px solid transparent",
              borderRadius: "0",
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
                  backgroundColor: isSelected ? colors.drowerIcons : "transparent",
                  transition: "all 0.3s ease",
                  "& svg": {
                    color: isSelected ? "grey.700" : "grey.500",
                  },
                }}
              >
                {icon}
              </Box>
            </ListItemIcon>
            <ListItemText
              primary={t(`navigation.${label}`)}
              sx={{
                color: isSelected ? colors.textPrimary : colors.textSecondary,
                fontWeight: isSelected ? "bold" : "normal",
              }}
            />
            {open ? (
              <ExpandLess sx={{ color: colors.textPrimary }} />
            ) : (
              <ExpandMore sx={{ color: colors.textSecondary }} />
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
                    pl: 4,
                    backgroundColor: "transparent",
                    border: "2px solid transparent",
                    borderRadius: "0",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  {subItem.icon && (
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 2,
                        justifyContent: "center",
                        "& svg": {
                          color: isSubSelected ? "grey.700" : "grey.500",
                        },
                      }}
                    >
                      {subItem.icon}
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={t(`navigation.${subItem.label}`)}
                    sx={{
                      color: isSubSelected ? colors.textPrimary : colors.textSecondary,
                      fontWeight: isSubSelected ? "bold" : "normal",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </>
  );
};
