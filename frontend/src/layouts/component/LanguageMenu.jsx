import { useState } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { Tooltip } from "@mui/material";

export default function LanguageMenu() {
  const { i18n, t } = useTranslation();
  // Language options
  const options = [
    { code: "en", label: t("language.en"), flag: "/flags/en.png" },
    { code: "es", label: t("language.es"), flag: "/flags/es.png" },
  ];
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(
    options.findIndex((opt) => opt.code === i18n.language) || 0
  );

  const open = Boolean(anchorEl);

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    const selectedLang = options[index].code;
    setSelectedIndex(index);
    i18n.changeLanguage(selectedLang);
    localStorage.setItem("lang", selectedLang);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const current = options[selectedIndex];

  return (
    <div>
      <List component="nav" aria-label="Language selector">
        <ListItemButton
          id="language-button"
          aria-haspopup="listbox"
          aria-controls="language-menu"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClickListItem}
          sx={{ bgcolor: "background.paper", borderRadius: 2 }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              src={current.flag}
              alt={current.label}
              sx={{ width: 24, height: 24 }}
            />
            <ListItemText
              //primary={current.label}
              primaryTypographyProps={{ fontWeight: "bold" }}
            />
          </Box>
        </ListItemButton>
      </List>

      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "language-button",
            role: "listbox",
          },
        }}
      >
        {options.map((option, index) => (
          <Tooltip
            key={option.code}
            title={option.label}
            placement="left"
            arrow
          >
            <MenuItem
              key={option.code}
              selected={index === selectedIndex}
              label={option.label}
              onClick={(event) => handleMenuItemClick(event, index)}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar
                  src={option.flag}
                  alt={option.label}
                  sx={{ width: 24, height: 24 }}
                />
              </Box>
            </MenuItem>
          </Tooltip>
        ))}
      </Menu>
    </div>
  );
}
