import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { outlinedButton } from "../../../styles/styles";

export const CancelButton = ({
  handleClick,
  disabled = false,
  icon,
  text,
  variant = "outlined",
  type = "button",
  sx,
  item
}) => {
  const handleButtonClick = () => {
    try {
      if (handleClick) {
        handleClick(item);
      }
    } catch (error) {
      console.error("CancelButton click error:", error);
    }
  };

  return (
    <Button
      type={type}
      variant={variant}
      startIcon={icon}
      onClick={handleButtonClick}
      disabled={disabled}
      sx={{ minWidth: "16vh", ...outlinedButton, ...sx }}
    >
      {text}
    </Button>
  );
};

CancelButton.propTypes = {
  handleClick: PropTypes.func,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["contained", "outlined", "text"]),
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  sx: PropTypes.object,
};
