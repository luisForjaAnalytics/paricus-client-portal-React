import { useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  useForgotPasswordMutation,
  useVerifyCodeMutation,
  useResetPasswordMutation,
} from "../../../../store/api/authApi";
import { extractApiError } from "../../../utils/apiHelpers";
import { useNotification } from "../../../hooks";
import { AlertInline } from "../../ui/AlertInline";
import { EmailPhase } from "./components/EmailPhase";
import { CodePhase } from "./components/CodePhase";
import { PasswordPhase } from "./components/PasswordPhase";

export const ForgotPasswordView = ({ onBack }) => {
  const { t } = useTranslation();
  const { notificationRef, showNotification } = useNotification();

  const [forgotPassword, { isLoading: isSendingEmail }] = useForgotPasswordMutation();
  const [verifyCode, { isLoading: isVerifying }] = useVerifyCodeMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  // Phase: "email" → "code" → "password"
  const [phase, setPhase] = useState("email");
  const [verifiedCode, setVerifiedCode] = useState("");

  const onSubmitEmail = async (data) => {
    try {
      await forgotPassword(data.email).unwrap();
      showNotification(t("login.forgotPassword.success"), "success");
      setPhase("code");
    } catch (error) {
      showNotification(
        extractApiError(error, t("login.forgotPassword.error")),
        "error"
      );
    }
  };

  const onSubmitCode = async (enteredCode) => {
    try {
      await verifyCode(enteredCode).unwrap();
      setVerifiedCode(enteredCode);
      setPhase("password");
    } catch (error) {
      showNotification(
        extractApiError(error, t("login.forgotPassword.invalidCode")),
        "error"
      );
    }
  };

  const onSubmitPassword = async (data) => {
    try {
      await resetPassword({
        token: verifiedCode,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }).unwrap();
      showNotification(t("login.forgotPassword.resetSuccess"), "success");
      setTimeout(onBack, 1500);
    } catch (error) {
      showNotification(
        extractApiError(error, t("login.forgotPassword.resetError")),
        "error"
      );
    }
  };

  const descriptionByPhase = {
    email: t("login.forgotPassword.description"),
    code: t("login.forgotPassword.enterCode"),
    password: t("login.forgotPassword.enterNewPassword"),
  };

  return (
    <Box>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          {t("login.forgotPassword.linkTitle")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {descriptionByPhase[phase]}
        </Typography>
      </Box>

      {phase === "email" && (
        <EmailPhase
          onSubmit={onSubmitEmail}
          isLoading={isSendingEmail}
          onBack={onBack}
        />
      )}

      {phase === "code" && (
        <CodePhase
          onSubmit={onSubmitCode}
          isLoading={isVerifying}
          onBack={onBack}
        />
      )}

      {phase === "password" && (
        <PasswordPhase
          onSubmit={onSubmitPassword}
          isLoading={isResetting}
          onBack={onBack}
        />
      )}

      <AlertInline ref={notificationRef} asSnackbar />
    </Box>
  );
};

ForgotPasswordView.propTypes = {
  onBack: PropTypes.func.isRequired,
};
