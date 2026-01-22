import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { primaryIconButton } from "../../../styles/styles";

export const ActionButton = ({
  handleClick,
  disabled = false,
  icon,
  text,
  variant = "contained",
  type = "button",
  sx,
}) => {
  const handleButtonClick = (event) => {
    try {
      if (handleClick) {
        handleClick(event);
      }
    } catch (error) {
      console.error("ActionButton click error:", error);
    }
  };

  return (
    <Button
      type={type}
      variant={variant}
      startIcon={icon}
      onClick={handleButtonClick}
      disabled={disabled}
      sx={{ ...primaryIconButton, ...sx }}
    >
      {text}
    </Button>
  );
};

ActionButton.propTypes = {
  handleClick: PropTypes.func,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["contained", "outlined", "text"]),
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  sx: PropTypes.object,
};
