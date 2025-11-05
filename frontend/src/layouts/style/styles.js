// ========================================
// DESIGN SYSTEM - STYLES
// ========================================
// Centralized design system for the entire application
// Compatible with MUI v5+ using sx prop

// ========================================
// COLOR PALETTE
// ========================================

export const colors = {
  // Main colors
  primario: "#0c7b3f",
  terciario: "#2160a2",

  // Borders
  borde: "#6c7a70",
  bordeVariante: "#bbcabe",

  // Surfaces
  superficie: "#ffffff",
  superficieMasAlto: "#e1e1e1",

  // Surface content
  enSuperficieNormal: "#161d18",
  enSuperficieVariante: "#3d4a40",
  enSuperficieBajoContraste: "#6f767d",

  // States
  error: "#ba1a1a",
  errorContenedor: "#ffdad6",
};

// ========================================
// TYPOGRAPHY
// ========================================

const fontFamily = "Roboto Flex, sans-serif";

export const typography = {
  // Font weights
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightHigh: 600,

  // Base font
  fontFamily: fontFamily,
};

// Predefined text styles
export const textStyles = {
  regular: {
    fontFamily: fontFamily,
    fontWeight: 400,
  },
  medium: {
    fontFamily: fontFamily,
    fontWeight: 500,
  },
  high: {
    fontFamily: fontFamily,
    fontWeight: 600,
  },
};

// ========================================
// BUTTONS - BASE STYLES
// ========================================

const baseButton = {
  height: 40, // All buttons have a height of 40px
  padding: "0 24px", // Lateral padding of 24px
  fontSize: 14, // Font size 14px
  fontWeight: 500, // Medium font weight
  borderRadius: 999, // Fully rounded borders
  fontFamily: fontFamily,
  textTransform: "none", // Prevents automatic uppercase
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  border: "none",
};

// ========================================
// PRIMARY BUTTON (REGULAR)
// ========================================

export const primaryButton = {
  ...baseButton,
  backgroundColor: colors.primario,
  color: colors.superficie,
  "&:hover": {
    backgroundColor: "#0a6a38", // Darker version of primary
  },
  "&:disabled": {
    backgroundColor: colors.superficieMasAlto,
    color: colors.enSuperficieBajoContraste,
  },
};

// ========================================
// PRIMARY DROPDOWN BUTTON
// ========================================

export const primaryDropdownButton = {
  ...baseButton,
  backgroundColor: colors.primario,
  color: colors.superficie,
  paddingRight: "12px", // Reduced right padding
  gap: "8px", // Space between text and icon
  "&:hover": {
    backgroundColor: "#0a6a38",
  },
  "&:disabled": {
    backgroundColor: colors.superficieMasAlto,
    color: colors.enSuperficieBajoContraste,
  },
};

// ========================================
// PRIMARY BUTTON WITH ICON
// ========================================

export const primaryIconButton = {
  ...baseButton,
  backgroundColor: colors.primario,
  color: colors.superficie,
  gap: "8px", // Space between text and icon
  "& svg": {
    width: 14,
    height: 14, // Icon size 14x14px
  },
  "&:hover": {
    backgroundColor: "#0a6a38",
  },
  "&:disabled": {
    backgroundColor: colors.superficieMasAlto,
    color: colors.enSuperficieBajoContraste,
  },
};

// ========================================
// OUTLINED BUTTON
// ========================================

export const outlinedButton = {
  ...baseButton,
  backgroundColor: colors.superficie,
  color: colors.primario,
  border: `1px solid ${colors.borde}`,
  "&:hover": {
    backgroundColor: colors.superficieMasAlto,
  },
  "&:disabled": {
    backgroundColor: colors.superficie,
    color: colors.enSuperficieBajoContraste,
    borderColor: colors.bordeVariante,
  },
};

// ========================================
// OUTLINED BUTTON WITH ICON
// ========================================

export const outlinedIconButton = {
  ...baseButton,
  backgroundColor: colors.superficie,
  color: colors.primario,
  border: `1px solid ${colors.borde}`,
  gap: "8px", // Space between text and icon
  "& svg": {
    width: 16,
    height: 20, // Icon size 16x20px
  },
  "&:hover": {
    backgroundColor: colors.superficieMasAlto,
  },
  "&:disabled": {
    backgroundColor: colors.superficie,
    color: colors.enSuperficieBajoContraste,
    borderColor: colors.bordeVariante,
  },
};

// ========================================
// SHADOWED BUTTON WITH ICON
// ========================================

export const shadowedIconButton = {
  ...baseButton,
  backgroundColor: colors.primario,
  color: colors.superficie,
  gap: "8px", // Space between text and icon
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Soft shadow
  "& svg": {
    width: 20,
    height: 14, // Icon size 20x14px
  },
  "&:hover": {
    backgroundColor: "#0a6a38",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.25)", // More pronounced shadow
  },
  "&:disabled": {
    backgroundColor: colors.superficieMasAlto,
    color: colors.enSuperficieBajoContraste,
    boxShadow: "none",
  },
};

// ========================================
// GROUPED EXPORTS
// ========================================

// Export all button styles
export const buttonStyles = {
  base: baseButton,
  primary: primaryButton,
  primaryDropdown: primaryDropdownButton,
  primaryIcon: primaryIconButton,
  outlined: outlinedButton,
  outlinedIcon: outlinedIconButton,
  shadowedIcon: shadowedIconButton,
};

// Export the entire design system
export const designSystem = {
  colors,
  typography,
  textStyles,
  buttonStyles,
};
