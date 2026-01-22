import PropTypes from "prop-types";
import { IconButton, Tooltip } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { colors } from "../../../styles/styles";

export const EditButton = ({
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
      console.error("EditButton click error:", error);
    }
  };

  return (
    <Tooltip title={title || t("common.edit")}>
      <IconButton
        color={color}
        size={size}
        onClick={handleButtonClick}
        disabled={disabled}
        sx={{ ...sx }}
      >
        {icon || <EditIcon fontSize={size} sx={{ color: colors.info }} />}
      </IconButton>
    </Tooltip>
  );
};

EditButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  item: PropTypes.any,
  title: PropTypes.string,
  icon: PropTypes.node,
  sx: PropTypes.object,
  color: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  disabled: PropTypes.bool,
};
