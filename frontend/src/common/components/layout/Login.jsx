import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Snackbar,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  useLoginMutation,
  useLazyGetCSRFTokenQuery,
} from "../../../store/api/authApi";
import { setCredentials } from "../../../store/auth/authSlice";
import { colors, primaryIconButton } from "../../styles/styles";
import LanguageMenu from "./AppBar/LanguageMenu";

const LoginView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [getCSRFToken] = useLazyGetCSRFTokenQuery();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error handling
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage(t("login.fillAllFields"));
      setShowError(true);
      return;
    }

    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials(result));

      // Get CSRF token after successful login
      try {
        await getCSRFToken().unwrap();
      } catch (csrfError) {
        console.warn("Failed to get CSRF token:", csrfError);
      }

      navigate("/app/dashboard");
    } catch (error) {
      console.error("❌ Login error:", error);
      setErrorMessage(error?.data?.error || t("login.invalidCredentials"));
      setShowError(true);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
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
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
            <TextField
              id="email-login"
              name="email"
              label={t("login.email")}
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              autoComplete="email"
              autoFocus
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "1.5rem",
                },
              }}
            />

            <TextField
              id="password-login"
              name="password"
              label={t("login.password")}
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              autoComplete="current-password"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "1.5rem",
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
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  {t("login.signingIn")}
                </>
              ) : (
                t("login.signIn")
              )}
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginView;
