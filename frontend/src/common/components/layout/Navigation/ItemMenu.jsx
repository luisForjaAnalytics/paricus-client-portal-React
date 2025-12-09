import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { colors } from "../../../styles/styles";

export const ItemMenu = ({
  label,
  icon,
  route,
  setTitleState,
  titleState,
  open,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isSelected = titleState === label;

  const handleRedirect = () => {
    setTitleState(label);
    navigate(`/app/${route}`);
  };

  return (
    <List sx={{ width: "100%", py: 0.5 }} aria-label="contacts">
      <ListItem disablePadding>
        <ListItemButton
          onClick={handleRedirect}
          disableRipple
          sx={{
            backgroundColor: "transparent",
            border: "2px solid transparent",
            borderRadius: "0",
            justifyContent: open ? "initial" : "center",
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
              mr: open ? 2 : "auto",
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
                backgroundColor: ((open !== undefined && isSelected) || (open === undefined && isSelected))
                  ? colors.drowerIcons
                  : "transparent",
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
              opacity: open === undefined ? 1 : (open ? 1 : 0),
              color: isSelected ? colors.textPrimary : colors.textSecondary,
              fontWeight: isSelected ? "bold" : "normal",
            }}
          />
        </ListItemButton>
      </ListItem>
    </List>
  );
};
