# New Frontend Architecture

## 🎯 Implemented Structure: Screaming Architecture

The frontend structure has been reorganized following the **Screaming Architecture** pattern, where the organization screams the business domain of the application.

---

## 📁 Folder Structure

```
frontend/src/
├── common/                      # Shared code between modules
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   └── TableItems.jsx
│   │   └── layout/             # Layout components
│   │       ├── LayoutAccount.jsx
│   │       ├── Login.jsx
│   │       ├── AppBar/
│   │       │   ├── AppBarLayout.jsx
│   │       │   ├── AvatarButton.jsx
│   │       │   └── LanguageMenu.jsx
│   │       └── Navigation/
│   │           ├── ItemMenu.jsx
│   │           ├── MenuSection.jsx
│   │           ├── MobilMenu.jsx
│   │           └── SingOutButton.jsx
│   │
│   ├── hooks/                  # Shared hooks
│   │   ├── index.js            # Barrel export
│   │   ├── useBreakpoint.js    # 🆕 Hook for responsive (eliminates *Movil.jsx)
│   │   ├── usePermissions.js
│   │   └── useTesseractOCR.js
│   │
│   ├── styles/                 # Global styles
│   │   └── styles.js
│   │
│   └── utils/                  # Shared utilities
│
├── modules/                    # Business modules (Feature-based)
│   ├── financials/
│   │   ├── components/
│   │   │   ├── ClientSummary/
│   │   │   │   ├── index.jsx               # 🆕 Unified wrapper
│   │   │   │   ├── ClientSummaryDesktop.jsx
│   │   │   │   ├── ClientSummaryMobile.jsx
│   │   │   │   └── ClientSummaryCard.jsx
│   │   │   ├── ClientBreakdown/
│   │   │   │   ├── index.jsx               # 🆕 Unified wrapper
│   │   │   │   ├── ClientBreakdownDesktop.jsx
│   │   │   │   └── ClientBreakdownMobile.jsx
│   │   │   ├── InvoicesTable/
│   │   │   │   ├── index.jsx               # 🆕 Unified wrapper
│   │   │   │   ├── InvoicesTableDesktop.jsx
│   │   │   │   ├── InvoicesTableMobile.jsx
│   │   │   │   └── PendingLinkModal.jsx
│   │   │   ├── OcrButton/
│   │   │   │   ├── index.jsx
│   │   │   │   └── OcrButton.jsx
│   │   │   └── index.js                    # Barrel export
│   │   ├── FinancialsView.jsx
│   │   └── index.js                        # Barrel export
│   │
│   ├── audio-recordings/
│   │   ├── components/
│   │   │   ├── QuickFilters/
│   │   │   │   ├── index.jsx               # 🆕 Unified wrapper
│   │   │   │   ├── QuickFiltersDesktop.jsx
│   │   │   │   └── QuickFiltersMobile.jsx
│   │   │   ├── AdvancedFilters/
│   │   │   │   ├── AdvancedFilters.jsx
│   │   │   │   └── company.js
│   │   │   ├── TableView/
│   │   │   │   └── TableView.jsx
│   │   │   └── index.js
│   │   ├── AudioRecordingsView.jsx
│   │   └── index.js
│   │
│   ├── user-management/
│   │   ├── components/
│   │   │   ├── UsersTab/
│   │   │   │   ├── index.jsx               # 🆕 Unified wrapper
│   │   │   │   ├── UsersTabDesktop.jsx
│   │   │   │   └── UsersTabMobile.jsx
│   │   │   ├── ClientsTab/
│   │   │   │   ├── index.jsx               # 🆕 Unified wrapper
│   │   │   │   ├── ClientsTabDesktop.jsx
│   │   │   │   └── ClientsTabMobile.jsx
│   │   │   ├── RolesTab/
│   │   │   │   ├── index.jsx               # 🆕 Unified wrapper
│   │   │   │   ├── RolesTabDesktop.jsx
│   │   │   │   └── RolesTabMobile.jsx
│   │   │   ├── Navigation/
│   │   │   │   └── NavBarOptions.jsx
│   │   │   └── index.js
│   │   ├── UserManagementView.jsx
│   │   └── index.js
│   │
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── DashboardCards.jsx
│   │   │   ├── DashboardCards1.jsx
│   │   │   └── SwierDashBoard.jsx
│   │   ├── DashboardView.jsx
│   │   └── index.js
│   │
│   ├── knowledge-base/
│   │   ├── components/
│   │   │   ├── CKEditor.jsx
│   │   │   ├── TableView.jsx
│   │   │   └── ArticleExample.jsx
│   │   ├── KnowledgeBaseView.jsx
│   │   └── index.js
│   │
│   ├── reporting/
│   │   ├── ReportingView.jsx
│   │   └── index.js
│   │
│   ├── profile/
│   │   ├── ProfileView.jsx
│   │   └── index.js
│   │
│   ├── reports-management/
│   │   ├── components/
│   │   │   ├── ClientFolders.jsx
│   │   │   └── ClientReports.jsx
│   │   ├── ReportsManagementView.jsx
│   │   └── index.js
│   │
│   └── error/
│       ├── ErrorView.jsx
│       └── index.js
│
├── router/
│   ├── AppRouter.jsx           # 🔄 Updated with new imports
│   └── components/
│       └── ProtectedRoute.jsx
│
├── store/
│   ├── api/                    # RTK Query API slices
│   ├── auth/
│   ├── helper/
│   └── store.js
│
├── i18n/
│
├── App.jsx
└── main.jsx
```

---

## 🚀 Implemented Improvements

### 1. **Elimination of Mobile Duplication**
**Before:**
```jsx
// ❌ Two separate files
ClientSummary.jsx
ClientSummaryMovil.jsx
```

**After:**
```jsx
// ✅ Single wrapper + specific components
ClientSummary/
├── index.jsx                 // Wrapper using useBreakpoint
├── ClientSummaryDesktop.jsx
└── ClientSummaryMobile.jsx
```

**Implementation:**
```jsx
// ClientSummary/index.jsx
import { useBreakpoint } from "../../../../common/hooks/useBreakpoint";

export const ClientSummary = (props) => {
  const { isMobile } = useBreakpoint();

  return isMobile ?
    <ClientSummaryMobile {...props} /> :
    <ClientSummaryDesktop {...props} />;
};
```

### 2. **Reusable useBreakpoint Hook**
```jsx
// common/hooks/useBreakpoint.js
export const useBreakpoint = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  // Also includes: isXs, isSm, isMd, isLg, isXl, current

  return { isMobile, isTablet, isDesktop, ... };
};
```

### 3. **Barrel Exports (Clean Imports)**
**Before:**
```jsx
import { FinancialsView } from "../views/financials/FinancialsView";
import { ClientSummary } from "../views/financials/components/ClientSummary";
```

**After:**
```jsx
import { FinancialsView, ClientSummary } from "../modules/financials";
```

### 4. **Business Domain Organization**
- Each module contains EVERYTHING related to that functionality
- Easy to find related code
- Facilitates team collaboration (each dev can work on a module)

---

## 📖 Usage Guide

### Importing Common Hooks
```jsx
// ✅ From barrel export
import { useBreakpoint, usePermissions } from "@/common/hooks";

// ✅ Specific
import { useBreakpoint } from "@/common/hooks/useBreakpoint";
```

### Importing Layout Components
```jsx
import { LayoutAccount, Login } from "@/common/components/layout";
import { AppBarLayout } from "@/common/components/layout/AppBar";
```

### Importing Modules
```jsx
// Full view
import { FinancialsView } from "@/modules/financials";

// Specific components
import { ClientSummary, InvoicesTable } from "@/modules/financials";
```

### Creating a Responsive Component
```jsx
import { useBreakpoint } from "@/common/hooks";

export const MyComponent = () => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  if (isMobile) return <MobileLayout />;
  if (isTablet) return <TabletLayout />;
  return <DesktopLayout />;
};
```

---

## 🎯 Advantages of the New Structure

### ✅ **DRY (Don't Repeat Yourself)**
- No duplicate `*Movil.jsx` files
- Centralized `useBreakpoint` hook
- Barrel exports avoid long imports

### ✅ **Screaming Architecture**
- Structure screams the domain: "financials", "user-management", "audio-recordings"
- Easy to know what the app does just by looking at folders
- New devs understand the project quickly

### ✅ **Modularity**
- Each module is independent
- Easy to move or extract modules
- Ready for future microfrontends

### ✅ **Maintainability**
- Related code stays together
- Changes in one module don't affect others
- Easy to refactor

### ✅ **Scalability**
- Add new module: copy existing structure
- No growth limit
- Clear and consistent patterns

---

## 🔄 How to Add a New Module

```bash
# 1. Create structure
mkdir -p src/modules/new-module/components

# 2. Create main view
touch src/modules/new-module/NewModuleView.jsx

# 3. Create barrel export
cat > src/modules/new-module/index.js << EOF
export { default as NewModuleView } from "./NewModuleView";
EOF

# 4. Add route in router
# src/router/AppRouter.jsx
import { NewModuleView } from "../modules/new-module";
```

---

## 📚 Code Patterns

### Responsive Component
```jsx
// modules/my-module/components/MyComponent/index.jsx
import { useBreakpoint } from "@/common/hooks";
import { MyComponentDesktop } from "./MyComponentDesktop";
import { MyComponentMobile } from "./MyComponentMobile";

export const MyComponent = (props) => {
  const { isMobile } = useBreakpoint();
  return isMobile ?
    <MyComponentMobile {...props} /> :
    <MyComponentDesktop {...props} />;
};
```

### Module Barrel Export
```jsx
// modules/my-module/index.js
export { default as MyModuleView } from "./MyModuleView";
export { MyComponent } from "./components/MyComponent";
export { OtherComponent } from "./components/OtherComponent";
```

---

## 🛠️ Migration Completed

### ✅ Deleted Files
- `src/views/` (complete)
- `src/layouts/` (complete)
- `src/hooks/` (complete)
- All `*Movil.jsx` files (replaced by wrappers)

### ✅ Migrated Files
- ✅ Common components → `common/components/`
- ✅ Hooks → `common/hooks/`
- ✅ Styles → `common/styles/`
- ✅ Views → `modules/{module-name}/`
- ✅ Module components → `modules/{name}/components/`

### ✅ Updated Imports
- ✅ Router (`AppRouter.jsx`)
- ✅ All migrated components
- ✅ Style paths
- ✅ Hook paths

---

## 📝 Final Notes

- **No additional libraries**: Everything with existing React + MUI
- **Compatible with RTK Query**: Doesn't affect state management
- **Backward compatible**: Internal components still work the same
- **Ready for aliases**: You can configure `@/` in vite.config.js

### Configure Aliases (Optional)
```js
// vite.config.js
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      '@common': '/src/common',
      '@modules': '/src/modules',
    },
  },
});
```

Then:
```jsx
import { useBreakpoint } from '@common/hooks';
import { FinancialsView } from '@modules/financials';
```

---

**Structure implemented on:** 2025-11-17
**Pattern:** Screaming Architecture
**Status:** ✅ Completed and functional
