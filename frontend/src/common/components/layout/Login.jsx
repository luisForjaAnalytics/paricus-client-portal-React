import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginMutation } from "../../../store/api/authApi";
import { setCredentials } from "../../../store/auth/authSlice";
import { colors, primaryIconButton } from "../../styles/styles";
import LanguageMenu from "./AppBar/LanguageMenu";
import { extractApiError } from "../../utils/apiHelpers";
import { useNotification } from "../../hooks";
import { AlertInline } from "../ui/AlertInline";
import { LoadingProgress } from "../ui/LoadingProgress";

// Zod validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "login.emailRequired")
    .email("login.emailInvalid"),
  password: z
    .string()
    .min(1, "login.passwordRequired")
    .min(6, "login.passwordMinLength"),
});

const LoginView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  // Notification hook
  const { notificationRef, showError } = useNotification();

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      navigate("/app/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      showError(extractApiError(error, t("login.invalidCredentials")));
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "colors.background",
        position: "relative",
      }}
    >
      {/* Language Menu - Top Right */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 8, sm: 16 },
          right: { xs: 8, sm: 16 },
          zIndex: 10,
        }}
      >
        <LanguageMenu />
      </Box>

      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            px: 8,
            border: 1,
            borderColor: colors.border,
            borderRadius: "2rem",
            bgcolor: colors.surface,
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              component="img"
              src="/paricus_logo.jpeg"
              alt="Paricus Logo"
              sx={{
                width: open ? 120 : 40,
                height: "auto",
                transition: "all 0.3s ease",
                objectFit: "contain",
              }}
            />

            <Typography
              variant="h4"
              component="h2"
              fontWeight="bold"
              gutterBottom
            >
              {t("login.title")}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {t("login.welcome")}
            </Typography>
          </Box>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <TextField
              id="email-login"
              label={t("login.email")}
              type="email"
              fullWidth
              margin="normal"
              autoComplete="email"
              autoFocus
              error={!!errors.email}
              helperText={errors.email ? t(errors.email.message) : ""}
              {...register("email")}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: colors.surface,
                  borderRadius: "3rem",
                  "& fieldset": {
                    borderColor: errors.email ? colors.error : colors.textIcon,
                  },
                  "&:hover fieldset": {
                    borderColor: errors.email ? colors.error : colors.focusRing,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: errors.email ? colors.error : colors.focusRing,
                  },
                },
                "& .MuiInputLabel-root": {
                  "&.Mui-focused": {
                    color: errors.email ? colors.error : colors.focusRing,
                  },
                },
              }}
            />

            <TextField
              id="password-login"
              label={t("login.password")}
              type="password"
              fullWidth
              margin="normal"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password ? t(errors.password.message) : ""}
              {...register("password")}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: colors.surface,
                  borderRadius: "3rem",
                  "& fieldset": {
                    borderColor: errors.password ? colors.error : colors.textIcon,
                  },
                  "&:hover fieldset": {
                    borderColor: errors.password ? colors.error : colors.focusRing,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: errors.password ? colors.error : colors.focusRing,
                  },
                },
                "& .MuiInputLabel-root": {
                  "&.Mui-focused": {
                    color: errors.password ? colors.error : colors.focusRing,
                  },
                },
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                sx={{
                  color: colors.primary,
                  fontWeight: 500,
                  textDecoration: "none",
                  "&:hover": {
                    color: colors.primaryHover,
                    textDecoration: "underline",
                  },
                }}
              >
                {t("login.forgotPassword")}
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              size="large"
              disabled={isLoading}
              sx={{
                ...primaryIconButton,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {isLoading ? (
                <>
                  <LoadingProgress size={20} sx={{ mr: 1 }} />
                  {t("login.signingIn")}
                </>
              ) : (
                t("login.signIn")
              )}
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Notifications */}
      <AlertInline ref={notificationRef} asSnackbar />
    </Box>
  );
};

export default LoginView;
