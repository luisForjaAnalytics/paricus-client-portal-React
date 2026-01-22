import React from "react";
import {
  useNavigate,
  useRouteError,
  isRouteErrorResponse,
} from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { primaryIconButton } from "../../common/styles/styles";

export const ErrorView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const error = useRouteError();

  const handleGoHome = () => {
    navigate("/app/dashboard");
  };

  let errorMessage = t("errors.notFound.description");
  let statusCode = 404; // default number

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    errorMessage = error.statusText || `Error ${error.status}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          textAlign: "center",
          py: 8,
        }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: 120,
            color: "error.main",
            mb: 3,
          }}
        />

        <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
          {statusCode}
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
          {errorMessage.toUpperCase()}
        </Typography>

        {/* <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 500 }}
        >
          {errorMessage}
        </Typography> */}

        <Button
          variant="contained"
          size="large"
          onClick={handleGoHome}
          sx={primaryIconButton}
        >
          {t("errors.notFound.goHome")}
        </Button>
      </Container>
    </Box>
  );
};
