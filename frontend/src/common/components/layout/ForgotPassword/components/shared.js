import { colors } from "../../../../styles/styles";

export const inputSx = (hasError) => ({
  mb: 2,
  "& .MuiOutlinedInput-root": {
    backgroundColor: colors.surface,
    borderRadius: "3rem",
    "& fieldset": {
      borderColor: hasError ? colors.error : colors.textIcon,
    },
    "&:hover fieldset": {
      borderColor: hasError ? colors.error : colors.focusRing,
    },
    "&.Mui-focused fieldset": {
      borderColor: hasError ? colors.error : colors.focusRing,
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: hasError ? colors.error : colors.focusRing,
    },
  },
});
