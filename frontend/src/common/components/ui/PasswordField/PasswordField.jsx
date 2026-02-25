import { useState } from "react";
import { TextField, IconButton, InputAdornment, Tooltip } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTranslation } from "react-i18next";

export const PasswordField = ({ slotProps, ...rest }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  const tooltipLabel = showPassword
    ? t("common.hidePassword")
    : t("common.showPassword");

  return (
    <TextField
      {...rest}
      type={showPassword ? "text" : "password"}
      slotProps={{
        ...slotProps,
        input: {
          ...slotProps?.input,
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title={tooltipLabel}>
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                  size="small"
                  aria-label={tooltipLabel}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};
