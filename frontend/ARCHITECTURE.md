# Frontend Architecture

## Screaming Architecture

The frontend follows the **Screaming Architecture** pattern, where the folder structure reflects the business domain of the application.

---

## Folder Structure

```
frontend/src/
├── common/                          # Shared code between modules
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   │   ├── ActionButton/
│   │   │   ├── AlertInline/
│   │   │   ├── AppText/
│   │   │   ├── CancelButton/
│   │   │   ├── ColumnHeaderFilter/
│   │   │   ├── DataGrid/           # UniversalDataGrid
│   │   │   ├── DeactivateButton/   # Activate/deactivate with confirm dialog
│   │   │   ├── DeleteButton/
│   │   │   ├── DownloadButton/
│   │   │   ├── EditButton/
│   │   │   ├── GetInitialsAvatar/
│   │   │   ├── HeaderBoxTypography/
│   │   │   ├── LoadingProgress/
│   │   │   ├── MobileFilterPanel/
│   │   │   ├── MobileSpeedDial/
│   │   │   ├── PasswordField/      # Password input with show/hide toggle
│   │   │   ├── SelectMenuItem/
│   │   │   ├── Swiper/             # SwiperView carousel
│   │   │   ├── TicketText/
│   │   │   ├── TiptapEditor/       # Rich text editor
│   │   │   ├── TiptapReadOnly/     # Read-only rich text
│   │   │   ├── UniversalMobilDataTable/
│   │   │   └── ViewButton/
│   │   │
│   │   ├── ErrorBoundary/          # Error boundary with i18n (withTranslation HOC)
│   │   │
│   │   └── layout/                 # Layout components
│   │       ├── AppBar/
│   │       │   ├── AppBarLayout.jsx
│   │       │   ├── AvatarButton.jsx
│   │       │   └── LanguageMenu.jsx
│   │       ├── ForgotPassword/     # 3-phase forgot password flow
│   │       │   ├── ForgotPassword.jsx   # Orchestrator (email -> code -> password)
│   │       │   ├── index.js
│   │       │   └── components/
│   │       │       ├── EmailPhase.jsx   # Email input + RHF/Zod
│   │       │       ├── CodePhase.jsx    # 6-digit OTP input
│   │       │       ├── PasswordPhase.jsx # New password + confirm
│   │       │       └── shared.js        # Shared inputSx styles
│   │       ├── Navigation/
│   │       │   ├── AccordionMenuItem.jsx
│   │       │   ├── ItemMenu.jsx
│   │       │   ├── MenuSection.jsx
│   │       │   ├── MobilMenu.jsx
│   │       │   └── SingOutButton.jsx
│   │       ├── LayoutAccount.jsx
│   │       ├── Login.jsx
│   │       └── index.js
│   │
│   ├── hooks/                      # Shared hooks
│   │   ├── index.js                # Barrel export
│   │   ├── useBreakpoint.js        # Responsive breakpoints
│   │   ├── useModal.js             # Modal open/close state
│   │   ├── useNotification.js      # Snackbar notifications
│   │   ├── usePermissions.js       # Permission checks
│   │   ├── useTesseractOCR.js      # OCR processing
│   │   ├── useTicketAttachments.js
│   │   └── useTicketDetailAttachments.js
│   │
│   ├── styles/                     # Global styles
│   │   └── styles.js               # Centralized colors, typography, layout constants
│   │
│   └── utils/                      # Shared utilities
│       ├── apiHelpers.js           # extractApiError
│       ├── formatDateTime.js
│       ├── formatters.js
│       ├── getAttachmentUrl.js
│       ├── getInitials.js
│       ├── getStatusProperty.js
│       ├── invoiceParser.js
│       ├── logger.js               # Logger utility (replaces console.* in production)
│       └── permissionParser.js     # Permission sections, parent-child mappings
│
├── config/
│   └── menu/
│       └── MenusSection.jsx        # Menu configuration (items, icons, permissions)
│
├── modules/                        # Business modules (Feature-based)
│   ├── dashboard/
│   │   ├── DashboardView.jsx
│   │   ├── components/
│   │   │   ├── ActiveTasks/         # Requires dashboard_active_tasks permission
│   │   │   ├── AnnouncementsInbox/  # Requires dashboard_announcements_inbox permission
│   │   │   ├── DashboardHeader/
│   │   │   ├── DashboardStatisticsView/
│   │   │   ├── DashboardViewSelect/ # Orchestrates sections with granular permissions
│   │   │   └── MasterRepository/    # Requires dashboard_master_repository permission
│   │   └── index.js
│   │
│   ├── financials/
│   │   ├── FinancialsView.jsx
│   │   ├── hooks/
│   │   │   └── useFinancials.jsx
│   │   ├── components/
│   │   │   ├── ClientSummary/      # Desktop + Mobile wrapper
│   │   │   ├── ClientBreakdown/    # Desktop + Mobile wrapper
│   │   │   ├── InvoicesTable/      # Desktop + Mobile wrapper
│   │   │   ├── EditInvoiceModal/
│   │   │   ├── FinancialsContent/
│   │   │   ├── UploadInvoiceButton/
│   │   │   └── index.js
│   │   └── index.js
│   │
│   ├── audio-recordings/
│   │   ├── AudioRecordingsView.jsx
│   │   ├── hooks/
│   │   │   ├── useAudioPlayer.js
│   │   │   └── useAudioRecordings.js
│   │   ├── components/
│   │   │   ├── QuickFilters/       # Desktop + Mobile wrapper
│   │   │   ├── AudioPlayerBar/
│   │   │   ├── AudioRecordingsContent/
│   │   │   ├── FilterButton/
│   │   │   ├── TableView/
│   │   │   ├── AdvancedFilters/
│   │   │   └── index.js
│   │   └── index.js
│   │
│   ├── user-management/
│   │   ├── UserManagementView.jsx
│   │   ├── hooks/
│   │   │   ├── useUsersTableConfig.jsx    # Users table columns, rows, actions
│   │   │   ├── useClientsTableConfig.jsx  # Clients table columns, rows, filters
│   │   │   ├── useRolesTableConfig.jsx    # Roles table columns, rows, actions
│   │   │   └── useLogsTableConfig.jsx     # Logs table columns, filters, pagination
│   │   ├── components/
│   │   │   ├── UsersTab/           # Desktop + Mobile + AddNewUserModal
│   │   │   ├── ClientsTab/        # Desktop + Mobile + AddNewClientModal
│   │   │   ├── RolesTab/          # Desktop + Mobile + AddNewRoleModal + PermissionsModal + ViewPermissionsModal
│   │   │   ├── LogsView/         # Desktop + Mobile + AdvancedFilters (server-side pagination)
│   │   │   ├── FilterButton/
│   │   │   ├── Navigation/        # NavBarOptions (tab navigation)
│   │   │   └── index.js
│   │   └── index.js
│   │
│   ├── knowledge-base/
│   │   ├── KnowledgeBaseView.jsx
│   │   ├── components/
│   │   │   ├── ArticleSearch.jsx
│   │   │   ├── ArticleView.jsx
│   │   │   ├── CKEditor.jsx
│   │   │   ├── TableViewDesktop.jsx
│   │   │   └── TableViewMobil.jsx
│   │   └── index.js
│   │
│   ├── tickets/
│   │   ├── ticketsView.jsx
│   │   ├── components/
│   │   │   ├── CreateTicketButton/
│   │   │   ├── TicketViewDetails/  # Detail view + sub-components
│   │   │   ├── TicketsViewDesktop/
│   │   │   └── TicketsViewMobil/
│   │   └── index.js
│   │
│   ├── profile/
│   │   ├── ProfileView.jsx
│   │   ├── components/
│   │   │   ├── ProfileFormView.jsx      # RHF + Zod form
│   │   │   └── UploadProfilePhoto.jsx   # Avatar upload dialog + getAvatarSrc helper
│   │   └── index.js                     # Exports ProfileView, UploadProfilePhoto, getAvatarSrc
│   │
│   ├── reporting/
│   │   ├── ReportingView.jsx
│   │   └── index.js
│   │
│   ├── reports-management/
│   │   ├── ReportsManagementView.jsx
│   │   ├── hooks/
│   │   │   └── useClientFoldersTableConfig.jsx  # Client folders table config
│   │   ├── components/
│   │   │   ├── ClientFolders/     # Desktop + Mobile wrapper
│   │   │   ├── ClientReports.jsx
│   │   │   ├── ManageAccessModal/
│   │   │   └── UploadReportModal/
│   │   └── index.js
│   │
│   ├── QuickBroadcast/
│   │   ├── QuickBroadcast.jsx
│   │   ├── components/
│   │   │   ├── KpiControl.jsx
│   │   │   ├── QuickBroadcastView.jsx
│   │   │   ├── SwiperControl.jsx
│   │   │   └── options.js
│   │   └── index.js
│   │
│   └── error/
│       ├── ErrorView.jsx
│       └── index.js
│
├── router/
│   ├── AppRouter.jsx
│   └── components/
│       └── ProtectedRoute.jsx      # Redirects to /unauthorized (not blank page)
│
├── store/
│   ├── api/                        # RTK Query API slices
│   │   ├── baseQuery.js             # Shared createBaseQuery factory (JWT auth)
│   │   ├── authApi.js              # Login, logout, forgotPassword, verifyCode, resetPassword
│   │   ├── adminApi.js             # Users, clients, roles CRUD
│   │   ├── profileApi.js           # Profile, password, avatar upload/delete
│   │   ├── invoicesApi.js          # Invoice management
│   │   ├── audioRecordingsApi.js   # Audio recordings + call types
│   │   ├── reportsApi.js           # Reports & folders
│   │   ├── articlesApi.js          # Knowledge base articles
│   │   ├── articlesSearchApi.js    # Article search
│   │   ├── carouselApi.js          # Dashboard carousel/swiper
│   │   ├── dashboardApi.js         # Dashboard data
│   │   ├── logsApi.js              # Activity logs
│   │   └── ticketsApi.js           # Ticket CRUD + descriptions
│   ├── auth/
│   │   └── authSlice.js            # Auth state (token, user, permissions)
│   ├── helper/
│   └── store.js                    # Redux store configuration
│
├── i18n/
│   ├── i18n.js                     # i18next configuration
│   ├── en/                         # English translations
│   └── es/                         # Spanish translations
│
├── App.jsx
└── main.jsx
```

---

## Key Patterns

### 1. Responsive Components (Desktop/Mobile Wrapper)

```jsx
// modules/my-module/components/MyComponent/index.jsx
import { useBreakpoint } from "../../../../common/hooks";
import { MyComponentDesktop } from "./MyComponentDesktop";
import { MyComponentMobile } from "./MyComponentMobile";

export const MyComponent = (props) => {
  const { isMobile } = useBreakpoint();
  return isMobile ?
    <MyComponentMobile {...props} /> :
    <MyComponentDesktop {...props} />;
};
```

### 2. Barrel Exports

```jsx
// modules/financials/index.js
export { FinancialsView } from "./FinancialsView";

// Usage
import { FinancialsView } from "../modules/financials";
```

### 3. Forms with React Hook Form + Zod

```jsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().min(1, "Required").email("Invalid"),
});

const { control, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
  mode: "onChange",
  defaultValues: { email: "" },
});
```

### 4. RTK Query API Slices

All internal API slices use the shared `createBaseQuery` factory from `store/api/baseQuery.js`:

```jsx
// store/api/baseQuery.js — single source for auth header injection
export const createBaseQuery = (endpoint = "") =>
  fetchBaseQuery({
    baseUrl: `${API_URL}${endpoint}`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  });

// Usage in API slices:
import { createBaseQuery } from "./baseQuery";
export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: createBaseQuery("/admin"),
  // ...
});
```

**Exception**: `articlesApi` and `articlesSearchApi` use direct `fetchBaseQuery` (external intranet API with API key auth).

```jsx
// Component usage:
const { data = [], isLoading, error } = useGetItemsQuery(params);
const [createItem, { isLoading: creating }] = useCreateItemMutation();

// Mutations auto-refetch via tag invalidation
await createItem(payload).unwrap();
```

### 5. Error Handling in Mutations

```jsx
import { extractApiError } from "../../../common/utils/apiHelpers";
import { useNotification } from "../../../common/hooks";

const { showNotification } = useNotification();

try {
  await createItem(data).unwrap();
  showNotification(t("success.message"), "success");
} catch (error) {
  showNotification(extractApiError(error, t("error.fallback")), "error");
}
```

### 6. Multi-Phase Flow (ForgotPassword Pattern)

```jsx
// Orchestrator manages phase state, delegates to phase components
const [phase, setPhase] = useState("email"); // "email" -> "code" -> "password"

{phase === "email" && <EmailPhase onSubmit={...} />}
{phase === "code" && <CodePhase onSubmit={...} />}
{phase === "password" && <PasswordPhase onSubmit={...} />}
```

### 7. Custom UI Components

All reusable UI components live in `common/components/ui/` with barrel exports:

| Component | Purpose |
|-----------|---------|
| ActionButton | Primary action button (submit, save) |
| CancelButton | Cancel/back button |
| AlertInline | Notification snackbar |
| DeactivateButton | Activate/deactivate toggle with confirm dialog |
| PasswordField | Password input with show/hide toggle |
| LoadingProgress | Circular loading indicator |
| UniversalDataGrid | Desktop data table |
| UniversalMobilDataTable | Mobile data table |
| ColumnHeaderFilter | Table header with filter |
| MobileFilterPanel | Slide-out filter panel for mobile |
| MobileSpeedDial | FAB speed dial for mobile actions |
| EditButton / ViewButton / DeleteButton / DownloadButton | Icon action buttons |
| TiptapEditor / TiptapReadOnly | Rich text editor |
| SwiperView | Image carousel |
| SelectMenuItem | Dropdown menu item |

### 8. Browser Autofill Override

To prevent Chrome's gray autofill background on inputs:

```jsx
const autofillOverride = {
  "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus": {
    WebkitBoxShadow: "0 0 0 1000px white inset !important",
    WebkitTextFillColor: "inherit !important",
    transition: "background-color 5000s ease-in-out 0s",
  },
};
```

### 9. Logger Utility

All frontend code uses `logger` instead of `console.*`. In production, log calls are suppressed.

```jsx
import { logger } from "../../../common/utils/logger";

logger.error("Something failed:", error);
logger.warn("Unexpected state:", data);
```

### 10. Module Hooks Convention

Custom hooks are organized in `hooks/` folders at the module level, not alongside components:

```
modules/my-module/
├── hooks/
│   └── useMyTableConfig.jsx   # Table columns, rows, filters, actions
├── components/
│   └── MyTab/
│       ├── index.jsx           # Imports from ../../hooks/useMyTableConfig
│       ├── MyTabDesktop.jsx
│       └── MyTabMobile.jsx
└── index.js
```

Shared hooks across all modules live in `common/hooks/` (useBreakpoint, useModal, useNotification, usePermissions, etc.).

### 11. Permission-Based Rendering

#### Granular Dashboard Permissions

Dashboard sections are controlled by individual permissions. The parent permission `view_dashboard` toggles all children:

| Permission | Controls |
|-----------|----------|
| `view_dashboard` | Parent: enables dashboard content (route always accessible) |
| `dashboard_announcements_inbox` | AnnouncementsInbox component |
| `dashboard_master_repository` | MasterRepository component |
| `dashboard_swiper` | SwiperView carousel |
| `dashboard_active_tasks` | ActiveTasks component |

#### Broadcast Permissions (same parent-child pattern)

| Permission | Controls |
|-----------|----------|
| `admin_broadcast` | Parent: access to broadcast management |
| `broadcast_announcements` | Manage announcements |
| `broadcast_swiper` | Manage swiper/carousel |
| `broadcast_kpi` | Manage KPI display |

#### Dashboard Empty State

The dashboard route (`/app/dashboard`) does not require any permission — any authenticated user can access it. This ensures users are always redirected to the dashboard after login. If `view_dashboard` is removed, `DashboardViewSelect` renders an empty container (only the page header from `DashboardView` is visible). Individual sub-permissions control each section independently.

#### Profile Avatar Upload

Users can upload a profile photo via `UploadProfilePhoto` dialog. The avatar is displayed in both the profile page and the AppBar. Architecture:

- **Backend**: `POST/GET/DELETE /api/auth/avatar` — multer upload to `uploads/avatars/`, stores `avatarUrl` in User model
- **Frontend**: `UploadProfilePhoto.jsx` — standalone dialog component with upload/delete/preview
- **Shared helper**: `getAvatarSrc(avatarUrl)` — converts relative `avatarUrl` to full URL, exported from `modules/profile`
- **Consumers**: `ProfileFormView` (profile page) and `AvatarButton` (AppBar) both use `getAvatarSrc`
- **Redux sync**: After upload/delete, `setCredentials` updates `user.avatarUrl` so both avatars update immediately
- **Fallback**: When no avatar image, displays user initials with `colors.primary` background

#### Swiper Recommended Dimensions

`SwiperControl` displays a warning-colored hint above the carousel preview: "Recommended size: 1920 x 600 px (16:5 ratio)". The hint is placed outside the swiper's `overflow: hidden` container to avoid clipping.

#### Upload Invoice Form Validation

The upload invoice button uses explicit required field checks instead of `react-hook-form`'s `isValid`, ensuring optional fields (`paymentMethod`, `paymentLink`, `description`) never block submission:

```jsx
const hasRequiredFields = watchedInvoiceName && watchedAmount > 0 && watchedIssuedDate && watchedDueDate;

<ActionButton disabled={uploading || ocrLoading || !hasRequiredFields || isOverLimit} />
```

#### Parent-Child Permission Toggle (PermissionsModal)

When configuring role permissions, clicking a parent permission toggles all its children. Deselecting a child only removes that specific permission (and the parent if no siblings remain). Defined in `permissionParser.js`:

```js
export const parentChildPermissions = {
  view_dashboard: ["dashboard_announcements_inbox", "dashboard_master_repository", "dashboard_swiper", "dashboard_active_tasks"],
  admin_broadcast: ["broadcast_announcements", "broadcast_swiper", "broadcast_kpi"],
};
```

---

## Audit Logging

Backend audit logs are created for key admin operations via `backend/server/services/logger.js`:

| Operation | Entity | Event Type | Details |
|-----------|--------|-----------|---------|
| Create client | Client | CREATE | Client name |
| Edit client | Client | UPDATE | Client name |
| Activate/deactivate client | Client | UPDATE | "activated" / "deactivated" |
| Create user | User | CREATE | User email |
| Edit user | User | UPDATE | User email |
| Activate/deactivate user | User | UPDATE | "activated" / "deactivated" |
| Create/update/delete role | Role | CREATE/UPDATE/DELETE | Role name + changes |
| Permission changes | Role | UPDATE | Added/removed permission names |
| Login/logout | Auth | LOGIN/LOGOUT | User email |
| Invoice CRUD | Invoice | CREATE/UPDATE/DELETE | Invoice number |
| Announcement CRUD | Announcement | CREATE/DELETE | Title |
| Carousel changes | Carousel | CREATE/DELETE | Image details |
| Avatar upload/delete | User | UPDATE | Avatar URL |

Logs are viewable in User Management > Logs with server-side pagination and inline column filters.

---

## Module Summary

| Module | Description | Permission |
|--------|-------------|------------|
| dashboard | KPIs, announcements, active tasks, swiper | `view_dashboard` + granular sub-permissions |
| financials | Invoices, client summaries, breakdowns | `view_financials` / `admin_invoices` |
| audio-recordings | Call recordings from WFM database | `admin_audio_recordings` |
| user-management | Users, clients, roles, permissions, logs | `admin_users` / `admin_clients` / `admin_roles` |
| knowledge-base | Articles with rich text editor | `view_knowledge_base` |
| tickets | Support ticket CRUD with attachments | `view_tickets` |
| profile | User profile, password change, avatar upload | JWT auth |
| reporting | Report viewing | `view_reporting` |
| reports-management | Upload/manage client reports & folders | `admin_reports` |
| QuickBroadcast | Dashboard carousel & KPI management | `admin_broadcast` + granular sub-permissions |

---

## Adding a New Module

1. Create folder: `src/modules/new-module/`
2. Create view: `NewModuleView.jsx`
3. Create barrel: `index.js`
4. Add components: `components/` subfolder
5. Add hooks: `hooks/` subfolder (custom hooks for table configs, data logic, etc.)
6. Add route in `router/AppRouter.jsx`
7. Add menu item in `config/menu/MenusSection.jsx`
8. Add i18n keys in `i18n/en/en.js` and `i18n/es/es.js`
9. If needed: create RTK Query slice in `store/api/`

---

**Last updated:** 2026-03-16
**Pattern:** Screaming Architecture
**Status:** Active development
