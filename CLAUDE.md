# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

```
paricus-client-portal/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── views/         # Page components
│   │   │   ├── admin/     # Admin module views
│   │   │   ├── financials/ # Financial/Invoice views
│   │   │   └── ProfileView/ # User profile
│   │   ├── layouts/       # Layout components
│   │   ├── router/        # React Router configuration
│   │   ├── store/         # Redux Toolkit store
│   │   │   ├── api/       # RTK Query API slices
│   │   │   └── auth/      # Auth slice
│   │   └── i18n/          # Internationalization
│   ├── package.json
│   └── vite.config.js
│
├── backend/               # Express.js backend
│   └── server/
│       ├── routes/        # API route handlers
│       │   ├── auth-prisma.js
│       │   ├── admin-prisma.js
│       │   ├── reports.js
│       │   ├── invoices.js
│       │   └── audio-recordings.js
│       ├── middleware/    # Auth & validation middleware
│       ├── services/      # Business logic
│       │   ├── s3.js
│       │   └── mssql.js
│       ├── prisma/        # Prisma ORM
│       │   ├── schema.prisma
│       │   └── seed.js
│       └── package.json
│
└── .env                   # Root environment config
```

## Development Commands

### Initial Setup
1. **Frontend setup:**
   ```bash
   cd frontend
   npm install
   ```

2. **Backend setup:**
   ```bash
   cd backend/server
   npm install
   npm run db:setup  # Run migrations and seed
   ```

3. **Environment variables:**
   - Frontend: `frontend/.env` → `VITE_API_URL=http://localhost:3001/api`
   - Backend: `backend/server/.env` → (See Backend Configuration section)

### Local Development

**Start both servers:**
```bash
# Terminal 1 - Frontend (port 5173)
cd frontend
npm run dev

# Terminal 2 - Backend (port 3001)
cd backend/server
npm run dev
```

### Backend Commands
```bash
cd backend/server

npm run dev              # Start server with nodemon
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:seed          # Seed test data
npm run db:setup         # Migrate + seed
npm start               # Production mode
```

### Frontend Commands
```bash
cd frontend

npm run dev             # Start Vite dev server
npm run build           # Build for production
npm run preview         # Preview production build
```

## Tech Stack

### Frontend
- **Framework**: React 19.1 with Hooks
- **UI Library**: Material-UI (MUI) v7
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router v7
- **Build Tool**: Vite v7
- **i18n**: react-i18next

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: SQLite (Prisma ORM) + MSSQL (Audio Recordings)
- **Authentication**: JWT with bcrypt
- **File Storage**: AWS S3
- **File Upload**: Multer

### Key Dependencies
- `@reduxjs/toolkit` - State management & data fetching
- `@mui/material` - UI components
- `react-router-dom` - Client-side routing
- `prisma` - Database ORM
- `mssql` - SQL Server client
- `aws-sdk` - S3 integration

## Architecture Overview

### Multi-Tenant BPO Portal
1. **Clients** - Different organizations (Flex Mobile, IM Telecom, etc.)
2. **Users** - Belong to clients, assigned roles
3. **Roles** - Client-specific with permission sets
4. **Permissions** - Granular access control

### Database Schema (Prisma)
- `Client` → `User` (1:many)
- `Client` → `Role` (1:many)
- `User` → `Role` (many:1)
- `Role` → `Permission` (many:many via `RolePermission`)
- `Client` → `Invoice` (1:many)
- `Client` → `ClientFolderAccess` (1:many)

### RTK Query Pattern

**All API calls use RTK Query instead of axios!**

#### API Slice Structure
```javascript
// frontend/src/store/api/exampleApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const exampleApi = createApi({
  reducerPath: "exampleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/endpoint`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Example'],
  endpoints: (builder) => ({
    // Query (GET)
    getItems: builder.query({
      query: (params) => ({ url: "", params }),
      transformResponse: (response) => response.data || [],
      providesTags: ['Example'],
    }),

    // Mutation (POST/PUT/DELETE)
    createItem: builder.mutation({
      query: (data) => ({
        url: "",
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Example'], // Auto-refetch queries
    }),
  }),
});

export const { useGetItemsQuery, useCreateItemMutation } = exampleApi;
```

#### Store Configuration
```javascript
// frontend/src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { exampleApi } from "./api/exampleApi";
import { authReducer } from "./auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [exampleApi.reducerPath]: exampleApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(exampleApi.middleware),
});
```

#### Component Usage
```javascript
// Component example
import { useGetItemsQuery, useCreateItemMutation } from '../../store/api/exampleApi';

function MyComponent() {
  // Query - automatic loading, caching, refetching
  const { data: items = [], isLoading, error } = useGetItemsQuery(params);

  // Mutation - returns [trigger function, { isLoading, error }]
  const [createItem, { isLoading: creating }] = useCreateItemMutation();

  const handleCreate = async (data) => {
    try {
      await createItem(data).unwrap();
      // Success - queries with 'Example' tag auto-refetch
    } catch (err) {
      // Handle error
    }
  };

  return (/* JSX */);
}
```

### Existing API Slices

1. **authApi** (`frontend/src/store/api/authApi.js`)
   - `useLoginMutation`, `useLogoutMutation`, `useRefreshTokenMutation`

2. **adminApi** (`frontend/src/store/api/adminApi.js`)
   - Users: `useGetUsersQuery`, `useCreateUserMutation`, `useUpdateUserMutation`
   - Clients: `useGetClientsQuery`, `useCreateClientMutation`, `useUpdateClientMutation`, `useDeleteClientMutation`
   - Roles: `useGetRolesQuery`

3. **profileApi** (`frontend/src/store/api/profileApi.js`)
   - `useUpdateProfileMutation`, `useUpdatePasswordMutation`

4. **invoicesApi** (`frontend/src/store/api/invoicesApi.js`)
   - `useGetAllClientsDataQuery`, `useGetClientInvoicesAndStatsQuery`, `useGetMyInvoicesQuery`
   - `useUploadInvoiceMutation`, `useUpdateInvoiceMutation`, `useDeleteInvoiceMutation`

5. **audioRecordingsApi** (`frontend/src/store/api/audioRecordingsApi.js`)
   - `useGetAudioRecordingsQuery`, `useGetCallTypesQuery`, `useLazyGetAudioUrlQuery`

## Authentication Pattern

### Backend JWT Flow

**1. Login Endpoint** (`backend/server/routes/auth-prisma.js`)
```javascript
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find user with relations
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      client: true,
      role: {
        include: {
          rolePermissions: {
            include: { permission: true }
          }
        }
      }
    }
  });

  // Verify password
  const isValid = await bcrypt.compare(password, user.passwordHash);

  // Generate JWT
  const token = jwt.sign({
    userId: user.id,
    clientId: user.clientId,
    roleId: user.roleId,
    permissions: permissions.map(p => p.permissionName)
  }, process.env.JWT_SECRET, { expiresIn: '24h' });

  res.json({
    token,
    user: { id, email, firstName, lastName, clientId, roleId },
    permissions
  });
});
```

**2. Auth Middleware** (`backend/server/middleware/auth-prisma.js`)
```javascript
export const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });

    req.user = {
      userId: decoded.userId,
      clientId: decoded.clientId,
      roleId: decoded.roleId,
      permissions: decoded.permissions
    };
    next();
  });
};

export const requirePermission = (permission) => (req, res, next) => {
  if (!req.user.permissions.includes(permission)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};
```

**3. Protected Routes**
```javascript
router.get('/clients',
  authenticateToken,
  requirePermission('admin_clients'),
  async (req, res) => {
    // Route logic
  }
);
```

### Frontend Auth Flow

**1. Auth Slice** (`frontend/src/store/auth/authSlice.js`)
```javascript
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    permissions: JSON.parse(localStorage.getItem('permissions') || '[]'),
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, user, permissions } = action.payload;
      state.token = token;
      state.user = user;
      state.permissions = permissions;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('permissions', JSON.stringify(permissions));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.permissions = [];

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('permissions');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
```

**2. Auth API** (`frontend/src/store/api/authApi.js`)
```javascript
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/auth`,
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (err) {
          // Handle error
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (err) {
          dispatch(logout()); // Logout anyway
        }
      },
    }),
  }),
});
```

**3. Protected Routes** (`frontend/src/router/AppRouter.jsx`)
```javascript
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredPermission }) {
  const { token, permissions } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !permissions.includes(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
```

**4. Login Component Example**
```javascript
import { useLoginMutation } from '../../store/api/authApi';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password }).unwrap();
      navigate('/dashboard');
    } catch (err) {
      // Error already in `error` from mutation
    }
  };

  return (/* Login form */);
}
```

## Key Features & Permissions

### All Available Permissions

```javascript
// Defined in backend/server/prisma/seed.js
const permissions = [
  { permissionName: 'view_dashboard', description: 'View dashboard and basic metrics' },
  { permissionName: 'view_financials', description: 'View financial information and invoices' },
  { permissionName: 'download_invoices', description: 'Download invoice files' },
  { permissionName: 'view_reporting', description: 'View reports and KPIs' },
  { permissionName: 'download_reports', description: 'Download report files' },
  { permissionName: 'view_interactions', description: 'View interaction history' },
  { permissionName: 'download_audio_files', description: 'Download audio interaction files' },
  { permissionName: 'view_knowledge_base', description: 'View knowledge base articles' },
  { permissionName: 'create_kb_articles', description: 'Create knowledge base articles' },
  { permissionName: 'edit_kb_articles', description: 'Edit knowledge base articles' },
  { permissionName: 'admin_clients', description: 'Manage clients (BPO Admin only)' },
  { permissionName: 'admin_users', description: 'Manage users (BPO Admin only)' },
  { permissionName: 'admin_roles', description: 'Manage roles and permissions (BPO Admin only)' },
  { permissionName: 'admin_reports', description: 'Upload and manage client reports (BPO Admin only)' },
  { permissionName: 'admin_dashboard_config', description: 'Configure dashboard layouts (BPO Admin only)' },
  { permissionName: 'admin_invoices', description: 'Manage invoices - create, send, and set payment links (BPO Admin only)' },
  { permissionName: 'admin_audio_recordings', description: 'View and manage audio call recordings from Workforce Management database (BPO Admin only)' },
  { permissionName: 'view_invoices', description: 'View client invoices (Client Admin only)' },
  { permissionName: 'pay_invoices', description: 'Access payment links for invoices' },
];
```

### Role-Based Permission Sets

**BPO Admin** (Full System Access):
- ALL permissions listed above
- Can manage all clients, users, and roles
- Full administrative control

**Client Admin** (Administrative access for client users):
```javascript
const clientAdminPermissions = [
  'view_dashboard',
  'view_financials',
  'download_invoices',
  'view_reporting',
  'download_reports',
  'view_interactions',
  'view_knowledge_base',
  'create_kb_articles',
  'edit_kb_articles',
  'view_invoices',
  'pay_invoices'
];
```

**Client User** (View-only access):
```javascript
const clientUserPermissions = [
  'view_dashboard',
  'view_financials',
  'download_invoices',
  'view_reporting',
  'view_interactions',
  'view_knowledge_base',
  'view_invoices',
  'pay_invoices'
];
```

### Permission Usage Examples

**Backend Route Protection:**
```javascript
// Admin only
router.get('/clients',
  authenticateToken,
  requirePermission('admin_clients'),
  async (req, res) => { /* ... */ }
);

// Client Admin can view invoices
router.get('/invoices',
  authenticateToken,
  requirePermission('view_invoices'),
  async (req, res) => { /* ... */ }
);
```

**Frontend UI Conditional Rendering:**
```javascript
import { useSelector } from 'react-redux';

function InvoiceActions() {
  const permissions = useSelector((state) => state.auth.permissions);

  const canManageInvoices = permissions.includes('admin_invoices');
  const canViewInvoices = permissions.includes('view_invoices');
  const canDownload = permissions.includes('download_invoices');

  return (
    <Box>
      {canViewInvoices && <InvoiceList />}
      {canDownload && <Button>Download</Button>}
      {canManageInvoices && <Button>Create Invoice</Button>}
    </Box>
  );
}
```

### Adding New Permissions

**1. Add to seed script** (`backend/server/prisma/seed.js`):
```javascript
const permissions = [
  // ... existing permissions
  { permissionName: 'new_permission', description: 'Description of new permission' },
];
```

**2. Run seed:**
```bash
cd backend/server
npm run db:seed
```

**3. Assign to role** (in seed.js):
```javascript
const clientAdminPermissions = [
  // ... existing permissions
  'new_permission',
];

await assignPermissionsToRole(roleId, clientAdminPermissions, 'Role Name');
```

**4. Use in routes/components:**
```javascript
// Backend
requirePermission('new_permission')

// Frontend
permissions.includes('new_permission')
```

## Test Credentials

**Run `npm run seed` in backend to create these accounts:**

### BPO Administration (Full Access)
- Email: `admin@paricus.com`
- Password: `admin123!`

### Flex Mobile
- Admin: `admin@flexmobile.com` / `flex123!`
- User: `user@flexmobile.com` / `flexuser123!`

### IM Telecom
- Admin: `admin@imtelecom.com` / `imtelecom123!`
- User: `user@imtelecom.com` / `imuser123!`

### North American Local
- Admin: `admin@northamericanlocal.com` / `northam123!`
- User: `user@northamericanlocal.com` / `naluser123!`

## Backend Configuration

### Required Environment Variables (`backend/server/.env`)

```bash
# Database
DATABASE_URL="file:./prisma/dev.db"

# JWT (REQUIRED - min 32 characters)
JWT_SECRET=dev-jwt-secret-minimum-32-chars-long-change-in-production-12345678
JWT_EXPIRES_IN=24h

# Server
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# AWS S3 (for invoices/reports)
AWS_REGION=us-east-2
AWS_ACCESS_KEY_ID=your_key_here
AWS_SECRET_ACCESS_KEY=your_secret_here
S3_BUCKET_NAME=paricus-client-portal

# MSSQL (for audio recordings - optional)
MSSQL_SERVER=your_server.database.windows.net
MSSQL_PORT=1433
MSSQL_USER=your_user
MSSQL_PASSWORD=your_password
MSSQL_DATABASE=Workforce_Management

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=5

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
```

### Frontend Environment (`frontend/.env`)

```bash
# API URL
VITE_API_URL=http://localhost:3001/api
```

## Common Patterns

### Adding New Protected API Endpoint

**Backend** (`backend/server/routes/example.js`):
```javascript
import express from 'express';
import { authenticateToken, requirePermission } from '../middleware/auth-prisma.js';

const router = express.Router();

router.get('/items',
  authenticateToken,
  requirePermission('view_items'),
  async (req, res) => {
    try {
      const items = await prisma.item.findMany({
        where: { clientId: req.user.clientId }
      });
      res.json({ data: items });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
```

**Frontend RTK Query** (`frontend/src/store/api/itemsApi.js`):
```javascript
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const itemsApi = createApi({
  reducerPath: "itemsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/items`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Items'],
  endpoints: (builder) => ({
    getItems: builder.query({
      query: () => "",
      transformResponse: (response) => response.data || [],
      providesTags: ['Items'],
    }),
  }),
});

export const { useGetItemsQuery } = itemsApi;
```

**Register in Store** (`frontend/src/store/store.js`):
```javascript
import { itemsApi } from "./api/itemsApi";

export const store = configureStore({
  reducer: {
    // ...other reducers
    [itemsApi.reducerPath]: itemsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      // ...other middleware
      itemsApi.middleware
    ),
});
```

### Permission-Based UI Rendering

```javascript
import { useSelector } from 'react-redux';

function MyComponent() {
  const permissions = useSelector((state) => state.auth.permissions);

  const canEdit = permissions.includes('edit_items');

  return (
    <div>
      {canEdit && <Button onClick={handleEdit}>Edit</Button>}
    </div>
  );
}
```

## Important Notes

### RTK Query Cache Invalidation
- Use `providesTags` on queries to tag cached data
- Use `invalidatesTags` on mutations to trigger refetch
- Mutations automatically refetch all queries with matching tags

### Authentication Flow
1. User logs in → `useLoginMutation`
2. Backend returns `{ token, user, permissions }`
3. Frontend stores in Redux + localStorage
4. All API requests include `Authorization: Bearer ${token}` header
5. Backend middleware validates token on each request

### Database Locations
- SQLite: `backend/server/prisma/dev.db`
- MSSQL: External (for audio recordings only)

### S3 Folder Structure
```
s3://paricus-client-portal/
├── flex-mobile/
│   ├── invoices/
│   │   ├── 2024/invoice-001.pdf
│   │   └── 2025/invoice-002.pdf
│   └── reports/report-q1.pdf
└── im-telecom/
    ├── invoices/...
    └── reports/...
```

## Troubleshooting

### "Cannot read properties of undefined (reading 'length')"
- **Cause**: State from RTK Query is `undefined` instead of array
- **Fix**: Use default values: `const { data: items = [] } = useGetItemsQuery()`

### 500 Internal Server Error on API calls
- **Check**: Backend is running (`npm run dev` in `backend/server`)
- **Check**: Environment variables are set (`.env` files)
- **Check**: Database connection (MSSQL or SQLite)

### JWT Token Errors
- **Verify**: `JWT_SECRET` in backend `.env` (min 32 chars)
- **Check**: Token in localStorage (`localStorage.getItem('token')`)
- **Fix**: Clear localStorage and re-login

### RTK Query not refetching after mutation
- **Check**: Mutation has `invalidatesTags: ['TagName']`
- **Check**: Query has `providesTags: ['TagName']`
- **Both must use same tag name**

## Complete Permission Implementation Examples

### Example 1: Protected Route in Router

```javascript
// frontend/src/router/AppRouter.jsx
import { ProtectedRoute } from '../components/ProtectedRoute';
import { ClientsView } from '../views/admin/ClientsView';
import { DashboardView } from '../views/DashboardView';

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected route - requires authentication */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardView />
          </ProtectedRoute>
        }
      />

      {/* Protected route - requires specific permission */}
      <Route
        path="/admin/clients"
        element={
          <ProtectedRoute requiredPermission="admin_clients">
            <ClientsView />
          </ProtectedRoute>
        }
      />

      {/* Protected route - requires ALL permissions */}
      <Route
        path="/admin/advanced"
        element={
          <ProtectedRoute
            requiredPermissions={['admin_users', 'admin_clients']}
          >
            <AdvancedAdminView />
          </ProtectedRoute>
        }
      />

      {/* Protected route - requires ANY permission */}
      <Route
        path="/financials"
        element={
          <ProtectedRoute
            anyPermissions={['view_financials', 'admin_invoices']}
          >
            <FinancialsView />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

### Example 2: Conditional UI Rendering in Components

```javascript
// Using the usePermissions hook
import { usePermissions } from '../hooks/usePermissions';
import { Box, Button, Chip } from '@mui/material';

function InvoiceCard({ invoice }) {
  const {
    hasPermission,
    hasAnyPermission,
    isBPOAdmin,
  } = usePermissions();

  const canEdit = hasPermission('admin_invoices');
  const canView = hasAnyPermission(['view_invoices', 'view_financials']);
  const canDownload = hasPermission('download_invoices');

  return (
    <Box>
      <h3>{invoice.title}</h3>

      {/* Show different content based on permissions */}
      {canView && (
        <p>Amount: ${invoice.amount}</p>
      )}

      {/* Admin-only actions */}
      {canEdit && (
        <Button onClick={() => handleEdit(invoice)}>
          Edit Invoice
        </Button>
      )}

      {/* Download button for users with permission */}
      {canDownload && (
        <Button onClick={() => handleDownload(invoice)}>
          Download PDF
        </Button>
      )}

      {/* BPO Admin badge */}
      {isBPOAdmin() && (
        <Chip label="Admin View" color="primary" size="small" />
      )}
    </Box>
  );
}
```

### Example 3: Direct Permission Check in Redux Selector

```javascript
// Using useSelector directly (alternative to usePermissions hook)
import { useSelector } from 'react-redux';

function MyComponent() {
  const permissions = useSelector((state) => state.auth.permissions);
  const user = useSelector((state) => state.auth.user);

  const isAdmin = permissions.includes('admin_users');
  const canManageClients = permissions.includes('admin_clients');

  return (
    <div>
      {isAdmin && <AdminPanel />}
      {canManageClients && <ClientManagement />}
    </div>
  );
}
```

### Example 4: Protecting API Calls

```javascript
// Show/hide features based on permissions
import { usePermissions } from '../hooks/usePermissions';
import { useCreateClientMutation } from '../store/api/adminApi';

function ClientManagement() {
  const { hasPermission } = usePermissions();
  const [createClient, { isLoading }] = useCreateClientMutation();

  const handleCreate = async (data) => {
    // Double-check permission before calling API
    if (!hasPermission('admin_clients')) {
      alert('No tienes permiso para realizar esta acción');
      return;
    }

    try {
      await createClient(data).unwrap();
      // Success
    } catch (error) {
      // Backend will also validate permissions
    }
  };

  // Don't even show the button if no permission
  if (!hasPermission('admin_clients')) {
    return <div>No tienes acceso a esta funcionalidad</div>;
  }

  return (
    <Button onClick={handleCreate} disabled={isLoading}>
      Crear Cliente
    </Button>
  );
}
```

### Example 5: Nested Permission Logic

```javascript
import { usePermissions } from '../hooks/usePermissions';

function ComplexView() {
  const {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    isBPOAdmin,
    isClientAdmin,
  } = usePermissions();

  // Complex permission logic
  const canUploadReports = hasAllPermissions([
    'admin_reports',
    'view_reporting',
  ]);

  const canAccessFinancials = hasAnyPermission([
    'view_financials',
    'admin_invoices',
    'view_invoices',
  ]);

  const showAdvancedFeatures = isBPOAdmin() || isClientAdmin();

  return (
    <div>
      {canUploadReports && <ReportUploader />}
      {canAccessFinancials && <FinancialDashboard />}
      {showAdvancedFeatures && <AdvancedSettings />}
    </div>
  );
}
```

### Example 6: Menu Items Based on Permissions

```javascript
import { usePermissions } from '../hooks/usePermissions';
import { List, ListItem, ListItemText } from '@mui/material';

function NavigationMenu() {
  const { hasPermission } = usePermissions();

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', permission: null },
    { label: 'Financials', path: '/financials', permission: 'view_financials' },
    { label: 'Reports', path: '/reports', permission: 'view_reporting' },
    { label: 'Clients', path: '/admin/clients', permission: 'admin_clients' },
    { label: 'Users', path: '/admin/users', permission: 'admin_users' },
    { label: 'Audio', path: '/admin/audio', permission: 'admin_audio_recordings' },
  ];

  return (
    <List>
      {menuItems.map((item) => {
        // Skip items user doesn't have permission for
        if (item.permission && !hasPermission(item.permission)) {
          return null;
        }

        return (
          <ListItem key={item.path} button component="a" href={item.path}>
            <ListItemText primary={item.label} />
          </ListItem>
        );
      })}
    </List>
  );
}
```

## Migration Notes

This project was migrated from:
- Vue.js → React 19
- Axios → RTK Query
- Vuetify → Material-UI
- Pinia → Redux Toolkit

All API calls should use RTK Query. Do NOT use axios in new code.
