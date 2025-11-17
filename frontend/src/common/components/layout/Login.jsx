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
import { Language as LanguageIcon } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../../store/api/authApi";
import { setCredentials } from "../../../store/auth/authSlice";
import { primaryButton, colors } from "../../styles/styles";

const LoginView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error handling
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      setShowError(true);
      return;
    }

    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials(result));
      navigate("/app/dashboard");
    } catch (error) {
      console.error("❌ Login error:", error);
      setErrorMessage(error?.data?.error || "Invalid credentials");
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
        bgcolor: colors.background,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: 1,
            borderColor: colors.border,
            borderRadius: 2,
            bgcolor: colors.surface,
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: colors.neutral,
                margin: "0 auto",
                mb: 2,
              }}
            >
              <LanguageIcon sx={{ fontSize: 32, color: colors.primary }} />
            </Avatar>

            <Typography
              variant="h4"
              component="h2"
              fontWeight="bold"
              gutterBottom
            >
              Client Portal
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Welcome back! Please enter your details.
            </Typography>
          </Box>

          {/* Login Form */}
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
            <TextField
              id="email-login"
              name="email"
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              autoComplete="email"
              autoFocus
              sx={{ mb: 2 }}
            />

            <TextField
              id="password-login"
              name="password"
              label="Password"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              autoComplete="current-password"
              sx={{ mb: 2 }}
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
                Forgot password?
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
                ...primaryButton,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Signing in...
                </>
              ) : (
                "Sign in"
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
