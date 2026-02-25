import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ActionButton } from "../../../ui/ActionButton";
import { CancelButton } from "../../../ui/CancelButton";
import { LoadingProgress } from "../../../ui/LoadingProgress";
import { PasswordField } from "../../../ui/PasswordField";
import { inputSx } from "./shared";

const buildSchema = (t) =>
  z
    .object({
      password: z
        .string()
        .min(8, t("login.forgotPassword.passwordMinLength"))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
          t("login.forgotPassword.passwordRequirements")
        ),
      confirmPassword: z.string().min(1, t("login.forgotPassword.confirmRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("login.forgotPassword.passwordsNotMatch"),
      path: ["confirmPassword"],
    });

export const PasswordPhase = ({ onSubmit, isLoading, onBack }) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(buildSchema(t)),
    mode: "onChange",
    defaultValues: { password: "", confirmPassword: "" },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
      <PasswordField
        id="new-password"
        label={t("login.forgotPassword.newPassword")}
        fullWidth
        margin="normal"
        autoComplete="new-password"
        autoFocus
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register("password")}
        sx={inputSx(!!errors.password)}
      />

      <PasswordField
        id="confirm-password"
        label={t("login.forgotPassword.confirmPassword")}
        fullWidth
        margin="normal"
        autoComplete="new-password"
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        {...register("confirmPassword")}
        sx={inputSx(!!errors.confirmPassword)}
      />

      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 1 }}>
        <ActionButton
          type="submit"
          handleClick={handleSubmit(onSubmit)}
          disabled={isLoading || !isValid}
          text={
            isLoading
              ? t("common.saving")
              : t("login.forgotPassword.savePassword")
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

PasswordPhase.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
};
