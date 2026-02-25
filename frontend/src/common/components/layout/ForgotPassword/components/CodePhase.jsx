import { useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { Box, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { colors } from "../../../../styles/styles";
import { ActionButton } from "../../../ui/ActionButton";
import { CancelButton } from "../../../ui/CancelButton";
import { LoadingProgress } from "../../../ui/LoadingProgress";

const CODE_LENGTH = 6;

const CodeInputs = ({ code, onChange }) => {
  const inputRefs = useRef([]);

  const handleChange = useCallback(
    (index, value) => {
      const char = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(-1);
      const newCode = [...code];
      newCode[index] = char;
      onChange(newCode);
      if (char && index < CODE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [code, onChange]
  );

  const handleKeyDown = useCallback(
    (index, e) => {
      if (e.key === "Backspace" && !code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [code]
  );

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData("text")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .slice(0, CODE_LENGTH);
      const newCode = Array.from({ length: CODE_LENGTH }, (_, i) => pasted[i] || "");
      onChange(newCode);
      const focusIndex = Math.min(pasted.length, CODE_LENGTH - 1);
      inputRefs.current[focusIndex]?.focus();
    },
    [onChange]
  );

  return (
    <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", mb: 3 }}>
      {Array.from({ length: CODE_LENGTH }).map((_, i) => (
        <TextField
          key={i}
          inputRef={(el) => (inputRefs.current[i] = el)}
          value={code[i]}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          autoFocus={i === 0}
          slotProps={{
            htmlInput: {
              maxLength: 1,
              style: {
                textAlign: "center",
                fontSize: "1.5rem",
                fontWeight: 700,
                padding: "12px 0",
              },
            },
          }}
          sx={{
            width: 48,
            "& .MuiOutlinedInput-root": {
              borderRadius: "0.75rem",
              "& fieldset": { borderColor: colors.textIcon },
              "&:hover fieldset": { borderColor: colors.focusRing },
              "&.Mui-focused fieldset": { borderColor: colors.focusRing },
            },
          }}
        />
      ))}
    </Box>
  );
};

CodeInputs.propTypes = {
  code: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

export const CodePhase = ({ onSubmit, isLoading, onBack }) => {
  const { t } = useTranslation();
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));

  const codeComplete = code.every((c) => c !== "");

  const handleSubmit = () => {
    if (!codeComplete) return;
    onSubmit(code.join(""));
  };

  return (
    <Box sx={{ mt: 3 }}>
      <CodeInputs code={code} onChange={setCode} />

      <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
        <ActionButton
          handleClick={handleSubmit}
          disabled={!codeComplete || isLoading}
          text={
            isLoading
              ? t("login.forgotPassword.verifying")
              : t("login.forgotPassword.submit")
          }
          icon={isLoading ? <LoadingProgress size={18} /> : undefined}
        />
        <CancelButton
          handleClick={onBack}
          text={t("login.forgotPassword.backToLogin")}
        />
      </Box>
    </Box>
  );
};

CodePhase.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
};
