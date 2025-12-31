import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import { typography, colors } from "../../../styles/styles";

/**
 * AppText - Universal Typography Component
 *
 * Provides consistent text styling across ALL modules (tickets, financials, audio, etc.)
 * Uses the centralized typography system from styles.js
 *
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Content to display
 * @param {string} [props.variant="body"] - Typography variant
 * @param {string} [props.color="primary"] - Text color variant
 * @param {string} [props.component] - HTML element to render (e.g., "span", "div", "p")
 * @param {object} [props.sx={}] - Additional MUI sx styles to merge
 *
 * @example
 * // Basic usage
 * <AppText>Regular body text</AppText>
 *
 * @example
 * // Heading variants
 * <AppText variant="h1">Page Title</AppText>
 * <AppText variant="h2">Section Title</AppText>
 * <AppText variant="h3">Card Title</AppText>
 *
 * @example
 * // Size variants
 * <AppText variant="small">Small text or label</AppText>
 * <AppText variant="body">Default body text</AppText>
 *
 * @example
 * // Weight variants
 * <AppText variant="bodyBold">Bold emphasis</AppText>
 * <AppText variant="bodySemibold">Semi-bold text</AppText>
 *
 * @example
 * // Color variants
 * <AppText color="secondary">Secondary text</AppText>
 * <AppText color="muted">Muted text</AppText>
 * <AppText color="error">Error message</AppText>
 *
 * @example
 * // Combined
 * <AppText variant="h2" color="primary" sx={{ mb: 2 }}>
 *   Custom styled heading
 * </AppText>
 */
export const AppText = ({
  children,
  variant = "body",
  color = "primary",
  component,
  sx = {},
}) => {
  // Typography variant styles
  const variantStyles = {
    // Headings
    h1: {
      fontSize: typography.fontSize.h1,
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
    },
    h2: {
      fontSize: typography.fontSize.h2,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.tight,
    },
    h3: {
      fontSize: typography.fontSize.h3,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.tight,
    },

    // Body variants
    body: {
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.regular,
    },
    bodyMedium: {
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.medium,
    },
    bodySemibold: {
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.semibold,
    },
    bodyBold: {
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.bold,
    },

    // Small text variants
    small: {
      fontSize: typography.fontSize.small,
      fontWeight: typography.fontWeight.regular,
    },
    smallMedium: {
      fontSize: typography.fontSize.small,
      fontWeight: typography.fontWeight.medium,
    },
    smallBold: {
      fontSize: typography.fontSize.small,
      fontWeight: typography.fontWeight.bold,
    },

    // Special variants
    cardValue: {
      fontSize: typography.fontSize.cardValue,
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
    },
    tableHeader: {
      fontSize: typography.fontSize.tableHeader,
      fontWeight: typography.fontWeight.bold,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
  };

  // Color mapping
  const colorStyles = {
    primary: { color: colors.textPrimary },
    secondary: { color: colors.textSecondary },
    tertiary: { color: colors.textTertiary },
    muted: { color: colors.textMuted },
    white: { color: colors.textWhite },
    success: { color: colors.successText },
    error: { color: colors.errorText },
    warning: { color: colors.warningText },
    info: { color: colors.infoText },
  };

  return (
    <Typography
      component={component}
      sx={{
        fontFamily: typography.fontFamily,
        lineHeight: typography.lineHeight.base,
        ...variantStyles[variant],
        ...colorStyles[color],
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
};

AppText.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    // Headings
    "h1",
    "h2",
    "h3",
    // Body
    "body",
    "bodyMedium",
    "bodySemibold",
    "bodyBold",
    // Small
    "small",
    "smallMedium",
    "smallBold",
    // Special
    "cardValue",
    "tableHeader",
  ]),
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "tertiary",
    "muted",
    "white",
    "success",
    "error",
    "warning",
    "info",
  ]),
  component: PropTypes.string,
  sx: PropTypes.object,
};
