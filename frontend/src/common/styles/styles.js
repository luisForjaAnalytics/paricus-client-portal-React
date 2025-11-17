// ========================================
// DESIGN SYSTEM - STYLES
// ========================================
// Centralized design system for the entire application
// Compatible with MUI v5+ using sx prop
// Based on STYLE_GUIDE.md (Invoice Rover - Tailwind CSS Design System)

// ========================================
// FONT FAMILY
// ========================================
const fontFamilyCustom = "'Inter', sans-serif";

// ========================================
// COLOR PALETTE
// ========================================
// Adapted from Tailwind CSS default palette (STYLE_GUIDE.md)
export const colors = {
  // Primary colors (Green - Tailwind green-600)
  primary: "#16A34A", // bg-green-600
  primaryLight: "#D1FAE5", // bg-green-100
  primaryDark: "#065F46", // text-green-800
  primaryHover: "#15803c8c", // green-700 for hover
  secondaryHover: "#0a6a38bb", // Kept for button compatibility
  focusRing: "#22C55E", // ring-green-500
  gradiantPrimaryColor: "linear-gradient(90deg, #1fb467c7, #0a6a38bb )", // Kept for button compatibility
  financialClientAvatar: "#11e7464d",
  drowerIcons: "#D1FAE5",
  folderCloseIcon: "#68686844",

  // Secondary colors
  secondary: "#4db66750", // Kept for backward compatibility
  tertiary: "#2160a2", // Kept for backward compatibility

  // Neutral colors (Grays - from Tailwind)
  background: "#F9FAFB", // bg-gray-50 - Page background
  surface: "#FFFFFF", // bg-white - Card background
  surfaceHighest: "#F3F4F6", // bg-gray-100
  outlineButtonIcon: "#2bb41f13", // Kept for button compatibility

  // Borders (from Tailwind)
  border: "#E5E7EB", // border-gray-200
  borderInput: "#D1D5DB", // border-gray-300
  borderSelected: "#374151", //"#16A34A", //"#374151", // border-gray-700
  borderVariant: "#D1D5DB", // border-gray-300
  borderSoft: "#E5E7EB", // Updated to match Tailwind

  // Text colors (from Tailwind)
  textPrimary: "#111827", // text-gray-900
  textSecondary: "#374151", // text-gray-700
  textTertiary: "#4B5563", // text-gray-600
  textMuted: "#6B7281", // text-gray-500
  textIcon: "#9CA3AF", // text-gray-400
  textWhite: "#ffffff",

  // Surface content (kept for compatibility)
  onSurfaceNormal: "#111827", // Aligned with textPrimary
  onSurfaceVariant: "#374151", // Aligned with textSecondary
  onSurfaceLowContrast: "#6B7281", // Aligned with textMuted

  // Additional colors
  accent: "#FFB74D", // Warm orange - kept for backward compatibility
  neutral: "#E8F5E9", // Light green - kept for backward compatibility

  // Status colors (from STYLE_GUIDE.md)
  // Info (Blue) - Used for "Sent" status
  infoBackground: "#DBEAFE", // bg-blue-100
  infoText: "#1E40AF", // text-blue-800
  infoBorder: "#3B82F6", // border-blue-500
  info: "#0EA5E9", // Primary info blue

  // Warning (Yellow) - Used for "Pending" status
  warningBackground: "#FEF3C7", // bg-yellow-100
  warningText: "#92400E", // text-yellow-800
  warningBorder: "#F59E0B", // border-yellow-500
  warning: "#F59E0B", // Primary warning

  // Success (Green) - Used for "Paid" and "Revenue" status
  successBackground: "#D1FAE5", // bg-green-100
  successText: "#065F46", // text-green-800
  successBorder: "#22C55E", // border-green-500
  success: "#16A34A", // Primary success (same as primary)

  // Danger/Error (Red) - Used for "Overdue" status
  errorBackground: "#FEE2E2", // bg-red-100
  errorText: "#991B1B", // text-red-800
  errorBorder: "#EF4444", // border-red-500
  error: "#DC2626", // Primary error
  errorContainer: "#FEE2E2",
};

// ========================================
// TYPOGRAPHY
// ========================================
// Based on STYLE_GUIDE.md typography system
export const typography = {
  fontFamily: fontFamilyCustom, // Inter font
  fontSize: {
    // From STYLE_GUIDE.md
    h1: "24px", // Page Title - text-2xl
    h2: "20px", // Section Title - text-xl
    h3: "18px", // Card Title - text-lg
    cardValue: "24px", // Card Value - text-2xl
    body: "14px", // Body/Table Text - text-sm
    small: "12px", // Subtext/Labels - text-xs
    tableHeader: "12px", // Table Header - text-xs
  },
  lineHeight: {
    base: 1.6,
    tight: 1.2,
  },
  fontWeight: {
    regular: 400, // Regular
    medium: 500, // Medium
    semibold: 600, // Semibold
    bold: 700, // Bold
  },
  // Legacy compatibility
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightHigh: 600,
};

// Predefined text styles (legacy compatibility)
export const textStyles = {
  regular: {
    fontFamily: fontFamilyCustom,
    fontWeight: 400,
  },
  medium: {
    fontFamily: fontFamilyCustom,
    fontWeight: 500,
  },
  high: {
    fontFamily: fontFamilyCustom,
    fontWeight: 600,
  },
};

// ========================================
// SPACING SYSTEM
// ========================================
// Based on Tailwind's default spacing scale (multiples of 0.25rem/4px)
// From STYLE_GUIDE.md: Page Padding: p-6 md:p-8, Grid Gaps: gap-5, gap-6
export const spacing = {
  xs: 8, // 1 unidad MUI / 0.5rem / 8px
  sm: 16, // 2 unidades MUI / 1rem / 16px
  md: 24, // 3 unidades MUI / 1.5rem / 24px (p-6 from guide)
  lg: 32, // 4 unidades MUI / 2rem / 32px (p-8 from guide)
  xl: 48, // 6 unidades MUI / 3rem / 48px
  "2xl": 64, // 8 unidades MUI / 4rem / 64px
  "3xl": 80, // 10 unidades MUI / 5rem / 80px
  // Additional spacing from STYLE_GUIDE
  gap5: 20, // gap-5 (1.25rem / 20px)
  gap6: 24, // gap-6 (1.5rem / 24px)
  sectionSpacing: 32, // space-y-8 (2rem / 32px)
};

// ========================================
// LAYOUT
// ========================================
// Based on STYLE_GUIDE.md (Tailwind: rounded-lg for most elements)
export const layout = {
  maxWidthContainer: "1440px",
  borderRadius: {
    sm: "8px", // rounded-lg (0.5rem)
    md: "12px", // rounded-lg (0.75rem)
    lg: "16px", // rounded-lg (1rem)
    full: "9999px", // rounded-full - For pill-shaped buttons and badges
  },
};

// ========================================
// TRANSITIONS
// ========================================
export const transitions = {
  fast: "150ms ease-in-out",
  base: "250ms ease-in-out",
  slow: "350ms ease-in-out",
};

// ========================================
// BUTTON STYLES - BASE
// ========================================
const baseButton = {
  height: 40,
  padding: "0 24px",
  fontSize: 14,
  fontWeight: typography.fontWeight.medium,
  borderRadius: layout.borderRadius.full,
  fontFamily: fontFamilyCustom,
  textTransform: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: transitions.base,
  border: "none",
};

// ========================================
// PRIMARY BUTTON (WITH GRADIENT)
// ========================================
export const primaryButton = {
  ...baseButton,
  background: colors.gradiantPrimaryColor,
  color: colors.surface,
  "&:hover": {
    background:
      "linear-gradient(90deg, rgba(32, 103, 135, 1) 0%, rgba(67, 179, 113, 1) 50%, rgba(217, 201, 63, 1) 100%)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  "&:disabled": {
    background: colors.surfaceHighest,
    color: colors.textTertiary,
  },
};

// ========================================
// PRIMARY DROPDOWN BUTTON
// ========================================
export const primaryDropdownButton = {
  ...primaryButton,
  paddingRight: "12px",
  gap: "8px",
};

// ========================================
// PRIMARY BUTTON WITH ICON
// ========================================
export const primaryIconButton = {
  ...baseButton,
  background: colors.gradiantPrimaryColor,
  color: colors.surface,
  gap: "8px",
  padding: "8px 16px",
  "& svg": {
    width: 14,
    height: 14,
  },
  "&:hover": {
    background: ` ${colors.secondaryHover}`,
    transition: "background ease",
    "&:hover": {
      background: "#0a6a38bb",
    },
    boxShadow: `0 4px 10px ${colors.primaryHover}`,
  },
  "&:disabled": {
    background: colors.surfaceHighest,
    color: colors.textTertiary,
  },
};

// ========================================
// SECONDARY BUTTON
// ========================================
export const secondaryButton = {
  ...baseButton,
  backgroundColor: colors.surface,
  color: colors.primary,
  border: `2px solid ${colors.primary}`,
  "&:hover": {
    backgroundColor: colors.primary,
    color: colors.surface,
    borderColor: colors.primary,
  },
  "&:disabled": {
    backgroundColor: colors.surface,
    color: colors.textTertiary,
    borderColor: colors.borderrVariant,
  },
};

// ========================================
// SECONDARY ICON BUTTON
// ========================================
export const secondaryIconButton = {
  ...baseButton,
  backgroundColor: colors.surface,
  color: colors.primary,
  border: `2px solid ${colors.primary}`,
  padding: "8px 16px",
  gap: "8px",
  "&:hover": {
    backgroundColor: colors.primary,
    color: colors.surface,
    borderColor: colors.primary,
  },
  "&:disabled": {
    backgroundColor: colors.surface,
    color: colors.textTertiary,
    borderColor: colors.borderrVariant,
  },
};

// ========================================
// OUTLINED BUTTON
// ========================================
export const outlinedButton = {
  ...baseButton,
  backgroundColor: colors.surface,
  color: colors.primary,
  border: `1px solid ${colors.border}`,
  "&:hover": {
    backgroundColor: colors.surfaceHighest,
  },
  "&:disabled": {
    backgroundColor: colors.surface,
    color: colors.onSurfaceLowContrast,
    borderColor: colors.borderrVariant,
  },
};

// ========================================
// OUTLINED BUTTON WITH ICON
// ========================================
export const outlinedIconButton = {
  ...baseButton,
  backgroundColor: colors.surface,
  color: colors.primary,
  border: `1px solid ${colors.primary}`,
  gap: "8px",
  "& svg": {
    width: 16,
    height: 20,
  },
  "&:hover": {
    backgroundColor: colors.outlineButtonIcon,
  },
  "&:disabled": {
    backgroundColor: colors.surface,
    color: colors.onSurfaceLowContrast,
    borderColor: colors.borderrVariant,
  },
};

// ========================================
// SHADOWED BUTTON WITH ICON
// ========================================
export const shadowedIconButton = {
  ...primaryIconButton,
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  "&:hover": {
    background:
      "linear-gradient(90deg, rgba(32, 103, 135, 1) 0%, rgba(67, 179, 113, 1) 50%, rgba(217, 201, 63, 1) 100%)",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.25)",
  },
  "&:disabled": {
    background: colors.surfaceHighest,
    color: colors.textTertiary,
    boxShadow: "none",
  },
  "& svg": {
    width: 20,
    height: 14,
  },
};

// ========================================
// CARD STYLES
// ========================================
// Based on STYLE_GUIDE.md card components
export const card = {
  backgroundColor: colors.surface,
  borderRadius: layout.borderRadius.sm, // rounded-lg
  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", // shadow-sm from Tailwind
  transition: transitions.base,
  border: `1px solid ${colors.border}`,
};

export const cardHover = {
  ...card,
  "&:hover": {
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // shadow-md from Tailwind
  },
};

// Summary Card (with left border for status)
export const summaryCard = {
  backgroundColor: colors.surface,
  borderRadius: layout.borderRadius.sm,
  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  //padding: spacing.gap5, // p-5 (20px)
  overflow: "hidden",
  transition: "box-shadow 300ms ease-in-out",
  "&:hover": {
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
};

// Client Card (selectable)
export const clientCard = {
  backgroundColor: colors.surface,
  borderRadius: layout.borderRadius.sm,
  border: `1px solid ${colors.borderVariant}`,
  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  // padding: spacing.gap5,
  cursor: "pointer",
  transition: "all 300ms ease-in-out",
  "&:hover": {
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
};

// Selected Client Card
export const clientCardSelected = {
  ...clientCard,
  border: `1px solid ${colors.borderSelected}`,
  boxShadow: `0 0 0 2px ${colors.border}`, // ring-2
};

// Reports Card Selected
export const reportsCardSelected = {
  display: { xs: "none", md: "block" },
  backgroundColor: colors.surface,
  borderRadius: layout.borderRadius.sm,
  border: `1px solid ${colors.borderSoft}`,
  boxShadow:
    "0px 0.5px 0.5px 0px rgba(0, 0, 0, 0.32)",
  padding: "1rem 1rem 0.2rem 1rem",
  borderRadius: "1rem",
};

// ========================================
// FORM STYLES
// ========================================
// Based on STYLE_GUIDE.md form components
export const searchInput = {
  width: "100%",
  borderRadius: layout.borderRadius.sm,
  border: `1px solid ${colors.borderInput}`,
  backgroundColor: colors.background, // bg-gray-50
  padding: "10px 16px 10px 40px", // py-2.5 pl-10 pr-4
  fontSize: typography.fontSize.body, // text-sm
  color: colors.textPrimary,
  fontFamily: typography.fontFamily,
  outline: "none",
  transition: transitions.base,
  "&:focus": {
    borderColor: colors.focusRing,
    boxShadow: `0 0 0 1px ${colors.focusRing}`,
  },
};

export const textInput = {
  width: "100%",
  borderRadius: layout.borderRadius.sm,
  border: `1px solid ${colors.borderInput}`,
  backgroundColor: colors.surface,
  padding: "10px 16px",
  fontSize: typography.fontSize.body,
  color: colors.textPrimary,
  fontFamily: typography.fontFamily,
  outline: "none",
  transition: transitions.base,
  "&:focus": {
    borderColor: colors.focusRing,
    boxShadow: `0 0 0 1px ${colors.focusRing}`,
  },
};

// ========================================
// STATUS BADGE STYLES
// ========================================
// Based on STYLE_GUIDE.md status badges
const baseBadge = {
  padding: "4px 12px", // px-3 py-1
  fontSize: typography.fontSize.small, // text-xs
  fontWeight: typography.fontWeight.medium,
  borderRadius: layout.borderRadius.full, // rounded-full
  display: "inline-block",
  fontFamily: typography.fontFamily,
};

export const statusBadges = {
  // Info (Blue) - Used for "Sent" status
  sent: {
    ...baseBadge,
    backgroundColor: colors.infoBackground,
    color: colors.infoText,
  },
  info: {
    ...baseBadge,
    backgroundColor: colors.infoBackground,
    color: colors.infoText,
  },
  // Success (Green) - Used for "Paid" status
  paid: {
    ...baseBadge,
    backgroundColor: colors.successBackground,
    color: colors.successText,
  },
  success: {
    ...baseBadge,
    backgroundColor: colors.successBackground,
    color: colors.successText,
  },
  // Danger (Red) - Used for "Overdue" status
  overdue: {
    ...baseBadge,
    backgroundColor: colors.errorBackground,
    color: colors.errorText,
  },
  error: {
    ...baseBadge,
    backgroundColor: colors.errorBackground,
    color: colors.errorText,
  },
  // Warning (Yellow) - Used for "Pending" status
  pending: {
    ...baseBadge,
    backgroundColor: colors.warningBackground,
    color: colors.warningText,
  },
  warning: {
    ...baseBadge,
    backgroundColor: colors.warningBackground,
    color: colors.warningText,
  },
};

// ========================================
// TABLE STYLES
// ========================================
// Based on STYLE_GUIDE.md table components
export const table = {
  container: {
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadius.sm,
    border: `1px solid ${colors.border}`,
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
  },
  header: {
    backgroundColor: colors.background, // bg-gray-50
  },
  headerCell: {
    padding: "12px 24px", // px-6 py-3
    textAlign: "left",
    fontSize: typography.fontSize.tableHeader, // text-xs
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted, // text-gray-500
    textTransform: "uppercase",
    letterSpacing: "0.05em", // tracking-wider
    fontFamily: typography.fontFamily,
  },
  body: {
    backgroundColor: colors.surface,
    "& tr": {
      borderBottom: `1px solid ${colors.border}`,
      "&:last-child": {
        borderBottom: "none",
      },
    },
  },
  row: {
    transition: "background-color 200ms ease-in-out",
    "&:hover": {
      backgroundColor: colors.background, // hover:bg-gray-50
    },
  },
  cell: {
    padding: "16px 24px", // px-6 py-4
    fontSize: typography.fontSize.body, // text-sm
    color: colors.textPrimary,
    whiteSpace: "nowrap",
    fontFamily: typography.fontFamily,
  },
};

// ========================================
// UTILITIES
// ========================================
export const utilities = {
  textBalance: {
    textWrap: "balance",
  },
  smoothHover: {
    transition: transitions.base,
  },
  container: {
    maxWidth: layout.maxWidthContainer,
    marginLeft: "auto",
    marginRight: "auto",
    paddingLeft: "8%",
    paddingRight: "8%",
  },
  section: {
    paddingTop: spacing["3xl"],
    paddingBottom: spacing["3xl"],
  },
};

// ========================================
// GROUPED EXPORTS
// ========================================

// Export all button styles
export const buttonStyles = {
  base: baseButton,
  primary: primaryButton,
  secondary: secondaryButton,
  primaryDropdown: primaryDropdownButton,
  primaryIcon: primaryIconButton,
  secondaryIcon: secondaryIconButton,
  outlined: outlinedButton,
  outlinedIcon: outlinedIconButton,
  shadowedIcon: shadowedIconButton,
};

// Export all card styles
export const cardStyles = {
  base: card,
  hover: cardHover,
  summary: summaryCard,
  client: clientCard,
  clientSelected: clientCardSelected,
};

// Export all form styles
export const formStyles = {
  searchInput,
  textInput,
};

// Export the entire design system
export const designSystem = {
  colors,
  typography,
  spacing,
  layout,
  transitions,
  textStyles,
  buttonStyles,
  cardStyles,
  formStyles,
  statusBadges,
  table,
  utilities,
};

// ========================================
// Titles Text styles
// ========================================

export const titlesTypography = {
  sectionTitle: {
    fontSize: typography.fontSize.h3, // text-lg (18px)
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
  },
  primaryTitle: {
    fontSize: typography.fontSize.h2, // text-xl (20px) - Section Title
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily,
  },
};

export const boxWrapCards = {
  marginLeft: "1.5rem",
};
