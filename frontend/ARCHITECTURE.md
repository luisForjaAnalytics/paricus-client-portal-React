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
│   ├── tickets/                  # 🆕 Ticket management system
│   │   ├── components/
│   │   │   ├── CreateTicketButton/
│   │   │   │   ├── CreateTicketButton.jsx
│   │   │   │   └── ticketStatus-js.js
│   │   │   └── index.js
│   │   ├── TicketsView.jsx
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
│   │   ├── authApi.js
│   │   ├── adminApi.js
│   │   ├── profileApi.js
│   │   ├── invoicesApi.js
│   │   ├── reportsApi.js
│   │   ├── audioRecordingsApi.js
│   │   ├── articlesApi.js
│   │   ├── articlesSearchApi.js
│   │   ├── logsApi.js
│   │   └── ticketsApi.js       # 🆕 Tickets API
│   ├── auth/
│   │   └── authSlice.js
│   ├── helper/
│   └── store.js                # 🔄 Updated with ticketsApi
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

## 🎫 Tickets System Implementation (Added 2025-12-22)

### Overview
Complete ticket management system integrated following the project's architecture patterns (Prisma ORM + RTK Query + React).

---

### 📊 Database Schema (Prisma)

**Two new tables created in SQLite:**

#### `tickets` table
```prisma
model Ticket {
  id          String             @id @default(uuid())
  clientId    Int                @map("client_id")
  userId      Int                @map("user_id")
  subject     String
  priority    String             // "High", "Medium", "Low"
  status      String             @default("Open")
  assignedTo  String?            @map("assigned_to")
  createdAt   DateTime           @default(now())
  updatedAt   DateTime           @updatedAt
  client      Client             @relation(...)
  user        User               @relation(...)
  descriptions TicketDescription[]
}
```

#### `ticket_descriptions` table
```prisma
model TicketDescription {
  id              Int      @id @default(autoincrement())
  ticketId        String   @map("ticket_id")
  descriptionData String   @map("description_data")
  timestamp       DateTime @default(now())
  ticket          Ticket   @relation(...)
}
```

**Key Features:**
- UUID primary key for tickets
- Multi-tenant support (clientId)
- User tracking (userId)
- Conversation history (multiple descriptions)
- Automatic timestamps
- Cascade delete protection

---

### 🔌 Backend API (`backend/server/routes/tickets.js`)

**REST Endpoints:**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/tickets` | List all tickets for client | ✅ JWT |
| `GET` | `/api/tickets/:id` | Get single ticket | ✅ JWT |
| `POST` | `/api/tickets` | Create new ticket | ✅ JWT |
| `PUT` | `/api/tickets/:id` | Update ticket | ✅ JWT |
| `POST` | `/api/tickets/:id/descriptions` | Add comment | ✅ JWT |
| `DELETE` | `/api/tickets/:id` | Delete ticket | ✅ JWT |

**Security Features:**
- JWT authentication required on all endpoints
- Client isolation (users only see their client's tickets)
- Input validation
- Proper error handling

**Example Request/Response:**
```javascript
// POST /api/tickets
// Request
{
  "subject": "Payment issue",
  "priority": "High",
  "assignedTo": "Support Team",
  "description": "Cannot process payment"
}

// Response
{
  "data": {
    "id": "uuid-here",
    "clientId": 1,
    "userId": 5,
    "subject": "Payment issue",
    "priority": "High",
    "status": "Open",
    "assignedTo": "Support Team",
    "createdAt": "2025-12-22T...",
    "descriptions": [
      {
        "id": 1,
        "descriptionData": "Cannot process payment",
        "timestamp": "2025-12-22T..."
      }
    ]
  }
}
```

---

### ⚛️ Frontend RTK Query API (`frontend/src/store/api/ticketsApi.js`)

**API Slice Configuration:**
```javascript
export const ticketsApi = createApi({
  reducerPath: "ticketsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/tickets`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Tickets"],
  endpoints: (builder) => ({ ... })
});
```

**Available Hooks:**
```javascript
// Queries (GET)
const { data, isLoading, error } = useGetTicketsQuery();
const { data, isLoading, error } = useGetTicketQuery(ticketId);

// Mutations (POST/PUT/DELETE)
const [createTicket, { isLoading }] = useCreateTicketMutation();
const [updateTicket, { isLoading }] = useUpdateTicketMutation();
const [addDescription, { isLoading }] = useAddTicketDescriptionMutation();
const [deleteTicket, { isLoading }] = useDeleteTicketMutation();
```

**RTK Query Features:**
- ✅ Automatic caching
- ✅ Auto-refetch after mutations (`invalidatesTags`)
- ✅ Loading states included
- ✅ Error handling built-in
- ✅ Optimistic updates ready

**Redux Store Integration:**
```javascript
// store/store.js
export const store = configureStore({
  reducer: {
    // ... other reducers
    [ticketsApi.reducerPath]: ticketsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      // ... other middleware
      ticketsApi.middleware
    ),
});
```

---

### 🎨 Frontend Component (`modules/tickets/components/CreateTicketButton/`)

**Component Structure:**
```
CreateTicketButton/
├── CreateTicketButton.jsx    # Main component
└── ticketStatus-js.js         # Status constants
```

**Implementation Highlights:**

```javascript
import { useCreateTicketMutation } from "../../../../store/api/ticketsApi";

export const CreateTicketButton = () => {
  const [createTicket, { isLoading, error }] = useCreateTicketMutation();

  const onSubmit = async (data) => {
    try {
      const payload = {
        subject: data.subject,
        priority: data.priority,
        assignedTo: data.assignedTo,
        description: data.description.descriptionData,
      };

      await createTicket(payload).unwrap();
      // Auto closes modal and resets form
    } catch (err) {
      // Error shown via Alert component
    }
  };

  // ... form JSX
};
```

**Features:**
- ✅ React Hook Form validation
- ✅ Loading state (disabled button during submission)
- ✅ Error alerts (MUI Alert component)
- ✅ Auto-close on success
- ✅ Form reset after submission
- ✅ i18n support (react-i18next)

**Form Fields:**
- Subject (text, required)
- Priority (dropdown: High/Medium/Low, required)
- Assigned To (dropdown, required)
- Description (textarea, required)

---

### 🔄 Data Flow Diagram

```
User Interaction
      ↓
CreateTicketButton.jsx
      ↓ (handleSubmit)
useCreateTicketMutation()
      ↓ (POST request)
ticketsApi → /api/tickets
      ↓ (JWT validation)
Backend routes/tickets.js
      ↓ (authenticateToken middleware)
Prisma ORM
      ↓ (SQL INSERT)
SQLite Database
      ↓ (response)
Backend sends ticket data
      ↓
RTK Query updates cache
      ↓ (invalidatesTags: ['Tickets'])
All useGetTicketsQuery() refetch automatically
      ↓
UI updates with new ticket
      ↓
Modal closes, form resets
```

---

### 🚀 Usage Examples

#### Creating a Ticket
```javascript
// In any component
import { useCreateTicketMutation } from "@/store/api/ticketsApi";

function MyComponent() {
  const [createTicket, { isLoading, error }] = useCreateTicketMutation();

  const handleCreate = async () => {
    try {
      const result = await createTicket({
        subject: "Bug report",
        priority: "Medium",
        assignedTo: "Tech Support",
        description: "Login button not working"
      }).unwrap();

      console.log("Ticket created:", result);
    } catch (err) {
      console.error("Failed:", err);
    }
  };

  return (
    <button onClick={handleCreate} disabled={isLoading}>
      {isLoading ? "Creating..." : "Create Ticket"}
    </button>
  );
}
```

#### Listing Tickets
```javascript
import { useGetTicketsQuery } from "@/store/api/ticketsApi";

function TicketsList() {
  const { data: tickets = [], isLoading, error } = useGetTicketsQuery();

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;

  return (
    <List>
      {tickets.map(ticket => (
        <ListItem key={ticket.id}>
          <ListItemText
            primary={ticket.subject}
            secondary={`Priority: ${ticket.priority} | Status: ${ticket.status}`}
          />
        </ListItem>
      ))}
    </List>
  );
}
```

#### Adding Comments
```javascript
import { useAddTicketDescriptionMutation } from "@/store/api/ticketsApi";

function AddComment({ ticketId }) {
  const [addDescription] = useAddTicketDescriptionMutation();

  const handleAddComment = async (comment) => {
    await addDescription({
      id: ticketId,
      description: comment
    }).unwrap();
    // Automatically refetches ticket details
  };

  return <CommentForm onSubmit={handleAddComment} />;
}
```

---

### 📁 Files Modified/Created

**Backend:**
- ✅ `backend/server/prisma/schema.prisma` - Added Ticket & TicketDescription models
- ✅ `backend/server/routes/tickets.js` - New API routes (created)
- ✅ `backend/server/index.js` - Registered ticket routes
- ✅ `backend/server/prisma/migrations/` - Migration SQL files

**Frontend:**
- ✅ `frontend/src/store/api/ticketsApi.js` - RTK Query slice (created)
- ✅ `frontend/src/store/store.js` - Registered ticketsApi reducer & middleware
- ✅ `frontend/src/modules/tickets/components/CreateTicketButton/CreateTicketButton.jsx` - Updated with mutation

**Database:**
- ✅ Migration: `20251222235419_add_tickets_table`
- ✅ Tables created: `tickets`, `ticket_descriptions`

---

### 🎯 Next Steps (Recommended)

1. **Ticket List View**
   ```javascript
   // Create TicketsView.jsx using useGetTicketsQuery()
   ```

2. **Ticket Detail View**
   ```javascript
   // Create TicketDetailView.jsx using useGetTicketQuery(id)
   ```

3. **Status Updates**
   ```javascript
   // Use useUpdateTicketMutation() to change status
   ```

4. **Filters & Search**
   ```javascript
   // Add filters by priority, status, date
   ```

5. **Permissions**
   ```javascript
   // Add permissions: 'view_tickets', 'create_tickets', 'manage_tickets'
   // in prisma/seed.js
   ```

6. **Real-time Updates** (Optional)
   ```javascript
   // Add WebSocket support for live ticket updates
   ```

---

### 🧪 Testing

**Manual Testing Steps:**
1. Start backend: `cd backend/server && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Login with test credentials
4. Navigate to Tickets section
5. Click "Create New Ticket"
6. Fill form and submit
7. Verify ticket appears in database: `npx prisma studio`

**Test Credentials:**
```
BPO Admin: admin@paricus.com / admin123!
Client Admin: admin@flexmobile.com / flex123!
Client User: user@flexmobile.com / flexuser123!
```

---

### 🔍 Troubleshooting

**Issue: "Cannot read properties of undefined"**
- Solution: Use default values in hooks
  ```javascript
  const { data: tickets = [] } = useGetTicketsQuery();
  ```

**Issue: Tickets not refetching after creation**
- Solution: Ensure mutation has `invalidatesTags: ['Tickets']`
- Check query has `providesTags: ['Tickets']`

**Issue: 401 Unauthorized**
- Solution: Verify JWT token in localStorage
- Check `Authorization` header is set in `prepareHeaders`

**Issue: 500 Internal Server Error**
- Solution: Check backend logs
- Verify database migration completed
- Ensure Prisma client is generated

---

### 📝 Implementation Summary

**Date:** 2025-12-22
**Pattern:** RTK Query + Prisma ORM
**Database:** SQLite
**Status:** ✅ Fully functional
**Migration:** `20251222235419_add_tickets_table`

**Key Metrics:**
- 2 database tables created
- 6 REST API endpoints
- 6 React hooks generated
- 1 component integrated
- Full CRUD operations supported

---

**Structure implemented on:** 2025-11-17
**Tickets system added on:** 2025-12-22
**Pattern:** Screaming Architecture
**Status:** ✅ Completed and functional
