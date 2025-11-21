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

  const handleClick = () => {
    setOpen(!open);
  };

  const handleSubItemClick = (subItem) => {
    setTitleState(subItem.label);
    navigate(`/app/${subItem.route}`);
  };

  // Check if any subItem is selected
  const isSubItemSelected = subItems.some((item) => titleState === item.label);
  const isSelected = isSubItemSelected || titleState === label;

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
          {subItems.map((subItem, index) => {
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
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </>
  );
};
