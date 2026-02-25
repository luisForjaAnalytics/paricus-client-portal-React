import PropTypes from "prop-types";
import { Box, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ActionButton } from "../../../ui/ActionButton";
import { CancelButton } from "../../../ui/CancelButton";
import { LoadingProgress } from "../../../ui/LoadingProgress";
import { inputSx } from "./shared";

const buildSchema = (t) =>
  z.object({
    email: z
      .string()
      .min(1, t("login.emailRequired"))
      .email(t("login.emailInvalid")),
  });

export const EmailPhase = ({ onSubmit, isLoading, onBack }) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(buildSchema(t)),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
      <TextField
        id="email-forgot"
        label={t("login.email")}
        type="email"
        fullWidth
        margin="normal"
        autoComplete="email"
        autoFocus
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register("email")}
        sx={inputSx(!!errors.email)}
      />

      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 1 }}>
        <ActionButton
          type="submit"
          handleClick={handleSubmit(onSubmit)}
          disabled={isLoading || !isValid}
          text={
            isLoading
              ? t("login.forgotPassword.sending")
              : t("login.forgotPassword.resetPassword")
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

EmailPhase.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
};
