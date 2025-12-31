import PropTypes from "prop-types";
import { AppText } from "../AppText";

/**
 * TicketText - Typography component for ticket-related text
 *
 * This is a convenience wrapper around AppText with ticket-specific variant names.
 * Uses the universal AppText component internally for consistency.
 *
 * Provides consistent styling across all ticket components with variants:
 * - body: Standard text (default) → maps to AppText "body"
 * - label: Small, bold text for labels → maps to AppText "smallBold"
 * - bold: Bold body text → maps to AppText "bodyBold"
 *
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Content to display
 * @param {string} [props.variant="body"] - Typography variant
 * @param {string} [props.component] - HTML element to render (e.g., "span", "div")
 * @param {object} [props.sx={}] - Additional MUI sx styles to merge
 *
 * @example
 * // Basic usage
 * <TicketText>Regular text</TicketText>
 *
 * @example
 * // With label variant
 * <TicketText variant="label">Status:</TicketText>
 *
 * @example
 * // With custom styles
 * <TicketText sx={{ color: "red" }}>Error message</TicketText>
 *
 * @example
 * // With custom component
 * <TicketText component="span" variant="bold">Important</TicketText>
 *
 * @note For more variants, use AppText directly
 */
export const TicketText = ({
  children,
  variant = "body",
  component,
  sx = {}
}) => {
  // Map ticket-specific variants to AppText variants
  const variantMap = {
    body: "body",
    label: "smallBold",
    bold: "bodyBold",
  };

  const appTextVariant = variantMap[variant] || "body";

  return (
    <AppText
      variant={appTextVariant}
      component={component}
      sx={sx}
    >
      {children}
    </AppText>
  );
};

TicketText.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["body", "label", "bold"]),
  component: PropTypes.string,
  sx: PropTypes.object,
};
