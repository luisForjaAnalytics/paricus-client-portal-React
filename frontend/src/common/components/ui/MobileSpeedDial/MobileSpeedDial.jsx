import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { colors } from "../../../styles/styles";

const FAB_SIZE = 40;

/**
 * MobileSpeedDial - Reusable component to group actions in mobile.
 * Use only when there are 2+ actions (filter + add/create).
 * If only filter, keep the regular IconButton.
 *
 * Wrapped in a fixed-size Box (FAB_SIZE x FAB_SIZE) so it takes
 * exactly the fab's space in any layout (flex, grid, etc.).
 * The SpeedDial is absolutely positioned inside and actions overflow downward.
 *
 * @param {Array} actions - Array of { icon, name, onClick }
 * @param {object} sx - Additional styles for the container
 */
export const MobileSpeedDial = ({ actions = [], sx }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const handleActionClick = useCallback((onClick) => {
    try {
      onClick();
    } catch (error) {
      console.error("MobileSpeedDial action error:", error);
    }
    setOpen(false);
  }, []);

  if (!actions.length) return null;

  return (
    <Box
      sx={{ width: FAB_SIZE, height: FAB_SIZE, position: "relative", ...sx }}
    >
      <SpeedDial
        ariaLabel={t("common.actions", "Actions")}
        icon={<SpeedDialIcon openIcon={<CloseIcon />} />}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        direction="down"
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          "& .MuiSpeedDial-fab": {
            width: FAB_SIZE,
            height: FAB_SIZE,
            backgroundColor: colors.MobileSpeedDialColor,
            color: colors.primaryLight,
            "&:hover": { backgroundColor: colors.MobileSpeedDialColor,
            color: colors.primaryLight, },
          },
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            slotProps={{ tooltip: { title: action.name } }}
            onClick={() => handleActionClick(action.onClick)}
            sx={{
              "& .MuiSvgIcon-root": { color: colors.primary },
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

MobileSpeedDial.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node.isRequired,
      name: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    }),
  ).isRequired,
  sx: PropTypes.object,
};
