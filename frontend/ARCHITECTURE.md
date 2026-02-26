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
│   │   └── layout/                 # Layout components
│   │       ├── AppBar/
│   │       │   ├── AppBarLayout.jsx
│   │       │   ├── AvatarButton.jsx
│   │       │   └── LanguageMenu.jsx
│   │       ├── ForgotPassword/     # 3-phase forgot password flow
│   │       │   ├── ForgotPassword.jsx   # Orchestrator (email → code → password)
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
│   │   └── styles.js
│   │
│   └── utils/                      # Shared utilities
│       ├── apiHelpers.js           # extractApiError
│       ├── formatDateTime.js
│       ├── formatters.js
│       ├── getAttachmentUrl.js
│       ├── getInitials.js
│       ├── getStatusProperty.js
│       ├── invoiceParser.js
│       ├── logger.js
│       └── permissionParser.js
│
├── config/
│   └── menu/
│       └── MenusSection.jsx        # Menu configuration (items, icons, permissions)
│
├── modules/                        # Business modules (Feature-based)
│   ├── dashboard/
│   │   ├── DashboardView.jsx
│   │   ├── components/
│   │   │   ├── ActiveTasks/
│   │   │   ├── AnnouncementsInbox/
│   │   │   ├── DashboardHeader/
│   │   │   ├── DashboardStatisticsView/
│   │   │   ├── DashboardViewSelect/
│   │   │   └── MasterRepository/
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
│   │   ├── components/
│   │   │   ├── UsersTab/           # Desktop + Mobile + AddNewUserModal
│   │   │   ├── ClientsTab/        # Desktop + Mobile + AddNewClientModal
│   │   │   ├── RolesTab/          # Desktop + Mobile + AddNewRoleModal + PermissionsModal
│   │   │   ├── LogsView/         # Desktop + Mobile + AdvancedFilters
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
│   │   │   └── ProfileFormView.jsx # RHF + Zod form
│   │   └── index.js
│   │
│   ├── reporting/
│   │   ├── ReportingView.jsx
│   │   └── index.js
│   │
│   ├── reports-management/
│   │   ├── ReportsManagementView.jsx
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
│       └── ProtectedRoute.jsx
│
├── store/
│   ├── api/                        # RTK Query API slices
│   │   ├── authApi.js              # Login, logout, refresh, forgotPassword, verifyCode, resetPassword
│   │   ├── adminApi.js             # Users, clients, roles CRUD
│   │   ├── profileApi.js           # Profile & password update
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

```jsx
// All API calls use RTK Query (no axios)
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
const [phase, setPhase] = useState("email"); // "email" → "code" → "password"

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

---

## Module Summary

| Module | Description | Permission |
|--------|-------------|------------|
| dashboard | KPIs, announcements, active tasks | `view_dashboard` |
| financials | Invoices, client summaries, breakdowns | `view_financials` / `admin_invoices` |
| audio-recordings | Call recordings from WFM database | `admin_audio_recordings` |
| user-management | Users, clients, roles, permissions, logs | `admin_users` / `admin_clients` / `admin_roles` |
| knowledge-base | Articles with rich text editor | `view_knowledge_base` |
| tickets | Support ticket CRUD with attachments | JWT auth |
| profile | User profile & password change | JWT auth |
| reporting | Report viewing | `view_reporting` |
| reports-management | Upload/manage client reports & folders | `admin_reports` |
| QuickBroadcast | Dashboard carousel & KPI management | Admin |

---

## Adding a New Module

1. Create folder: `src/modules/new-module/`
2. Create view: `NewModuleView.jsx`
3. Create barrel: `index.js`
4. Add components: `components/` subfolder
5. Add route in `router/AppRouter.jsx`
6. Add menu item in `config/menu/MenusSection.jsx`
7. Add i18n keys in `i18n/en/en.js` and `i18n/es/es.js`
8. If needed: create RTK Query slice in `store/api/`

---

**Last updated:** 2026-02-25
**Pattern:** Screaming Architecture
**Status:** Active development
