import PropTypes from "prop-types";
import { IconButton, Tooltip } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { colors } from "../../../styles/styles";

export const ViewButton = ({
  handleClick,
  item,
  title,
  icon,
  sx,
  color = "",
  size = "small",
  disabled = false,
}) => {
  const { t } = useTranslation();

  const handleButtonClick = () => {
    try {
      if (handleClick) {
        handleClick(item);
      }
    } catch (error) {
      console.error("ViewButton click error:", error);
    }
  };

  return (
    <Tooltip title={title || t("common.view")}>
      <IconButton
        color={color}
        size={size}
        onClick={handleButtonClick}
        disabled={disabled}
        sx={{ ...sx }}
      >
        {icon || <Visibility fontSize={size} sx={{ color: colors.focusRing }} />}
      </IconButton>
    </Tooltip>
  );
};

ViewButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  item: PropTypes.any,
  title: PropTypes.string,
  icon: PropTypes.node,
  sx: PropTypes.object,
  color: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  disabled: PropTypes.bool,
};
