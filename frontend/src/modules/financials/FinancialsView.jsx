import { Box, Container } from "@mui/material";
import { HeaderBoxTypography } from "../../common/components/ui/HeaderBoxTypography/HeaderBoxTypography";
import { FinancialsContent } from "./components/FinancialsContent";

/**
 * FinancialsView - Main financials view component
 * Simple wrapper that renders header and content
 */
export const FinancialsView = () => {
  return (
    <Box>
      <Container maxWidth="100%" sx={{ margin: "2rem 0 0 0" }}>
        {/* Page Header */}
        <HeaderBoxTypography text="Financials" />

        {/* Financials Content */}
        <FinancialsContent />
      </Container>
    </Box>
  );
};