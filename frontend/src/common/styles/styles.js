// ========================================
// DESIGN SYSTEM - STYLES
// ========================================

import { Margin } from "@mui/icons-material";

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
  secondaryHover: "#0a6a38bb",
  focusRing: "#22C55E", // ring-green-500
  gradiantPrimaryColor: "linear-gradient(90deg, #1fb467c7, #0a6a38bb )",
  gradiantMobilPrimaryColor: "linear-gradient(15deg, #1fb467d0, #0a6a38ff )",
  financialClientAvatar: "#11e7464d",
  drowerIcons: "#D1FAE5",
  folderCloseIcon: "#68686844",
  drawer: "#FFFFFF",

  //Nav Bar
  navBarColor: "#22c55ee8",
  // Tickets Historical Section Divider
  dividerColor: "#59cc835e",
  // Neutral colors (Grays - from Tailwind)
  background: "#F9FAFB", // bg-gray-50 - Page background
  surface: "#FFFFFF", // bg-white - Card background
  surfaceHighest: "#F3F4F6", // bg-gray-100
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

  // ========================================
  //   Sub Sections open
  // ========================================

  subSectionBackground: "#58b98123",
  backgroundOpenSubSection: "#b3b3b32c",
  subSectionBorder: "#26b8633a",

  //Intranet Styles//
  intranetYellow: {
    backgroundColor: "#fff5d3",
    color: "#ffc400",
  },
  intranetgreen: {
    backgroundColor: "#bdf3cf",
    color: "#225339",
  },
  intranetRed: {
    backgroundColor: "#fff0ee",
    color: "#ba1a1a",
  },
  intranetGrey: {
    backgroundColor: "#e8eaeb",
    color: " #161d18",
  },
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
    borderColor: colors.borderVariant,
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
    borderColor: colors.borderVariant,
  },
};

// ========================================
// BUTTON WITHOUT LABEL JUST ICON
// ========================================
export const buttonIconNoLabel = {
  ...outlinedButton,
  width: "1.5rem",
  height: "2.6rem",
  borderRadius: "50%",
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

// Reports Card Selected
export const reportsCardSelected = {
  display: { xs: "none", md: "block" },
  backgroundColor: colors.surface,
  borderRadius: layout.borderRadius.sm,
  border: `1px solid ${colors.borderSoft}`,
  boxShadow: "0px 0.5px 0.5px 0px rgba(0, 0, 0, 0.32)",
  padding: "1rem 1rem 0.2rem 1rem",
  borderRadius: "1rem",
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
  headerCellInvoice: {
    padding: "12px 30px", // px-6 py-3
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

// ================================================
// TABLE DATAGRID STYLES
// ================================================
export const dataGridTable = {
  ...card,
  padding: "0 0 0 0",
  border: `1px solid ${colors.border}`,
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: `${colors.background} !important`,
    borderBottom: `2px solid ${colors.border}`,
  },
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: `${colors.background} !important`,
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: typography.fontWeight.bold,
    textTransform: "uppercase",
    fontSize: typography.fontSize.tableHeader,
    fontFamily: typography.fontFamily,
    color: colors.textMuted,
    letterSpacing: "0.05em",
  },
  "& .MuiDataGrid-sortIcon": {
    color: colors.primary,
  },
  "& .MuiDataGrid-columnHeader--sorted": {
    backgroundColor: `${colors.primaryLight} !important`,
  },
  "& .MuiDataGrid-filler": {
    backgroundColor: `${colors.background} !important`,
    width: "0 !important",
    minWidth: "0 !important",
    maxWidth: "0 !important",
  },
  "& .MuiDataGrid-scrollbarFiller": {
    display: "none !important",
  },
  "& .MuiDataGrid-scrollbar--vertical": {
    position: "absolute",
    right: 0,
  },
  "& .MuiDataGrid-cell": {
    borderBottom: `1px solid ${colors.border}`,
    fontSize: typography.fontSize.body,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
  },
  "& .MuiDataGrid-cell:focus": {
    outline: "none",
  },
  "& .MuiDataGrid-cell:focus-within": {
    outline: "none",
  },
  "& .MuiDataGrid-columnHeader:focus": {
    outline: "none",
  },
  "& .MuiDataGrid-columnHeader:focus-within": {
    outline: "none",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: colors.background,
  },
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
  managementSection: {
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily,
    textTransform: "none",
    fontSize: "1.5rem",
  },
};

// ================================================
// Payment Link  color and backGround color select
// ================================================

export const PaymentLinkStyle = {
  intranetYellow: colors.intranetYellow,
  intranetgreen: colors.intranetgreen,
};

// ================================================
// Filters Styles
// ================================================

export const filterStyles = {
  boxFilterbyGroup: {
    display: "flex",
    flexDirection: "row",
    gap: 1,
  },
  formControlStyleCUR: {
    minWidth: 250,
    "& .MuiOutlinedInput-root": {
      height: "2.6rem",
    },
    "& .MuiInputLabel-root": {
      top: "-0.4rem",
      "&.MuiInputLabel-shrink": {
        top: "0",
      },
    },
  },
  inputFilter: {
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.focusRing,
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: colors.surface,
      borderRadius: "3rem",
      height: "2.6rem",
      "&.Mui-focused fieldset": {
        borderColor: colors.focusRing,
      },
    },
    "& .MuiInputLabel-root": {
      top: "-0.4rem",
      "&.Mui-focused": {
        color: colors.focusRing,
      },
      "&.MuiInputLabel-shrink": {
        top: "0",
      },
    },
  },

  multiOptionFilter: {
    selectSection: {
      backgroundColor: colors.surface,
      borderRadius: "3rem",
      "& .MuiSelect-select": {
        color: colors.textPrimary,
        display: "flex",
        alignItems: "center",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: colors.textIcon,
        borderRadius: "3rem",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: colors.focusRing,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: colors.focusRing,
      },
    },
    inputLabelSection: {
      paddingTop: "0",
      "&.Mui-focused": {
        color: colors.focusRing,
      },
    },
  },
  //Company filter Audio Recording //
  formControlSection: {
    width: "10rem",
    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
    },
    "& .MuiOutlinedInput-root": {
      height: "2.6rem",
    },
    "& .MuiInputLabel-root": {
      top: "-0.4rem",
      "&.Mui-focused": {
        color: colors.focusRing,
      },
      "&.MuiInputLabel-shrink": {
        top: "0",
      },
    },
    "& .MuiSelect-icon": {
      color: `${colors.textIcon} !important`,
    },
    "& .MuiSelect-iconOutlined": {
      color: `${colors.textIcon} !important`,
    },
  },
};

// ========================================
//  Modal styles
// ========================================
//Main border Radious
const actionButtons = "10rem";
const borderRadiusSection = "1.5rem";
export const modalCard = {
  //Dialogue main style
  dialogSection: {
    borderRadius: "1.5rem",
    overflow: "hidden",
    width: "auto",
  },
  //Box style
  boxModalStyle: {
    boxManagementModal: {
      display: "flex",
      flexDirection: "row",
      gap: 1.5,
      margin: "0 0 1rem 0",
    },

    //upload invouces
    boxUploadInvoiceModal: {
      display: "flex",
      flexDirection: "row",
      gap: 1.5,
      margin: "0 0 1rem 0",
    },
    textFielUploadInvoiceModal: {
      "& .MuiOutlinedInput-root": {
        borderRadius: "1.5rem",
        "&.Mui-focused fieldset": {
          borderColor: colors.primary,
        },
      },
    },
  },
  //Create New Ticket Style
  createNewTiketStyle: {
    dialogTicketSection: {
      borderRadius: "1.5rem",
      overflow: "hidden",
      width: "30rem",
    },
    boxTicketModal: {
      display: "flex",
      flexDirection: "row",
      gap: 1.5,
      margin: "0 0 1rem 0",
    },

    //Description section
    inputDescriptionSection: {
      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: colors.focusRing,
      },
      "& .MuiOutlinedInput-root": {
        backgroundColor: colors.surface,
        borderRadius: borderRadiusSection,
        paddingBottom: "10rem",
        "&.Mui-focused fieldset": {
          borderColor: colors.focusRing,
        },
      },
      "& .MuiInputLabel-root": {
        top: "-0.4rem",
        "&.Mui-focused": {
          color: colors.focusRing,
        },
        "&.MuiInputLabel-shrink": {
          top: "0",
        },
      },
    },
  },
  //Input style
  inputSection: {
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.focusRing,
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: colors.surface,
      borderRadius: borderRadiusSection,
      height: "3rem",
      "&.Mui-focused fieldset": {
        borderColor: colors.focusRing,
      },
    },
    "& .MuiInputLabel-root": {
      top: "-0.4rem",
      "&.Mui-focused": {
        color: colors.focusRing,
      },
      "&.MuiInputLabel-shrink": {
        top: "0",
      },
    },
  },

  //Input Description style
  inputDescriptionSection: {
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.focusRing,
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: colors.surface,
      borderRadius: borderRadiusSection,
      paddingBottom: "3rem",
      "&.Mui-focused fieldset": {
        borderColor: colors.focusRing,
      },
    },
    "& .MuiInputLabel-root": {
      top: "-0.4rem",
      "&.Mui-focused": {
        color: colors.focusRing,
      },
      "&.MuiInputLabel-shrink": {
        top: "0",
      },
    },
  },

  //Multiple Options style
  multiOptionFilter: {
    selectSection: {
      backgroundColor: colors.surface,
      borderRadius: borderRadiusSection,
      "& .MuiSelect-select": {
        color: colors.textPrimary,
        display: "flex",
        alignItems: "center",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: colors.textIcon,
        borderRadius: borderRadiusSection,
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: colors.focusRing,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: colors.focusRing,
      },
    },
    inputLabelSection: {
      paddingTop: "0",
      "&.Mui-focused": {
        color: colors.focusRing,
      },
    },
  },
};

// ========================================
//  Ticket section styles
// ========================================
export const ticketStyle = {
  // Typography variants (simplified from nested structure)
  typography: {
    fontSize: typography.fontSize.body,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
  },
  typographyLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    fontWeight: 600,
  },
  typographyBold: {
    fontSize: typography.fontSize.body,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
    fontWeight: 600,
  },

  //Container for historical descriptions
  historicalContainer: {
    padding: "1rem 0 1rem 2rem", // p-5 (20px)
    backgroundColor: colors.surface,
    borderRadius: borderRadiusSection,
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    border: `1px solid ${colors.border}`,
    overflow: "hidden",
    transition: "border 1000ms ",
    "&:hover": {
      border: `1px solid ${colors.focusRing}`,
    },
  },

  // Historical description container (simplified from historicalDescription.textInfo.box)
  historicalDescriptionBox: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
    width: "100%",
  },

  divider: {
    border: `0.2px solid ${colors.dividerColor}`,
  },

  //Description section
  inputDescriptionSection: {
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.focusRing,
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: colors.surface,
      borderRadius: borderRadiusSection,
      paddingBottom: "4rem",
      "&.Mui-focused fieldset": {
        borderColor: colors.focusRing,
      },
    },
    "& .MuiInputLabel-root": {
      top: "-0.4rem",
      "&.Mui-focused": {
        color: colors.focusRing,
      },
      "&.MuiInputLabel-shrink": {
        top: "0",
      },
    },
  },
  updateButton: { ...primaryIconButton, width: actionButtons },
  cancelButton: { ...outlinedButton, width: actionButtons },
};
