import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  // createHashRouter, // para el despliegue ya que rgithub no reconoce rutas dinamicas
} from "react-router-dom";

// Layout components
import { LayoutAccount, Login } from "../common/components/layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Module views
import { DashboardView, DashboardViewSelect } from "../modules/dashboard";
import { FinancialsView } from "../modules/financials";
import { AudioRecordingsView } from "../modules/audio-recordings";
import {
  KnowledgeBaseView,
  CKEditor,
  TableView,
} from "../modules/knowledge-base";
import { ReportingView } from "../modules/reporting";
import { ProfileView } from "../modules/profile";
import { ReportsManagementView } from "../modules/reports-management";
import {
  UserManagementView,
  UsersTab,
  ClientsTab,
  RolesTab,
  LogsView,
} from "../modules/user-management";
import { ErrorView } from "../modules/error";
import { ArticleView } from "../modules/knowledge-base/components/ArticleView";
import LoginView from "../common/components/layout/Login";
import {
  TicketsView,
  TicketsViewDesktop,
  TicketViewDetails,
} from "../modules/tickets";
import { QuickBroadcast, QuickBroadcastView, SwiperControl, KpiControl } from "../modules/QuickBroadcast";

const router = createBrowserRouter(
  [
    {
      path: "/login",
      element: <LoginView />,
      errorElement: <ErrorView />,
    },
    {
      path: "/app",
      element: <LayoutAccount />,
      errorElement: <ErrorView />,
      children: [
        {
          path: "dashboard",
          element: (
            <ProtectedRoute requiredPermission="view_dashboard">
              <DashboardView />
            </ProtectedRoute>
          ),
          children: [
            {
              index: true,
              element: <DashboardViewSelect />,
            },
            {
              path: "kpi",
              element: <DashboardViewSelect />,
            },
            {
              path: "swiper",
              element: <DashboardViewSelect />,
            },
            {
              path: "general-info",
              element: <DashboardViewSelect />,
            },
          ],
        },
        {
          path: "reporting",
          element: (
            <ProtectedRoute requiredPermission="view_reporting">
              <ReportingView />
            </ProtectedRoute>
          ),
        },
        {
          path: "audio-recordings",
          element: (
            <ProtectedRoute requiredPermission="view_interactions">
              <AudioRecordingsView />
            </ProtectedRoute>
          ),
        },
        {
          path: "knowledge-base",
          element: (
            <ProtectedRoute requiredPermission="view_knowledge_base">
              <KnowledgeBaseView />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "articles",
              element: <TableView />,
            },
            {
              path: "editorView/:articleId",
              element: (
                <ProtectedRoute
                  anyPermissions={["create_kb_articles", "edit_kb_articles"]}
                >
                  <CKEditor />
                </ProtectedRoute>
              ),
            },
            {
              path: "articleView/:articleId",
              element: <ArticleView />,
            },
          ],
        },
        {
          path: "tickets",
          element: (
            <ProtectedRoute requiredPermission="view_tickets">
              <TicketsView />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "ticketTable",
              element: <TicketsViewDesktop />,
            },
            {
              path: "ticketTable/:ticketId",
              element: <TicketViewDetails />,
            },
          ],
        },
        {
          path: "financial",
          element: (
            <ProtectedRoute requiredPermission="view_financials">
              <FinancialsView />
            </ProtectedRoute>
          ),
        },
        {
          path: "reports-management",
          element: (
            <ProtectedRoute requiredPermission="admin_reports">
              <ReportsManagementView />
            </ProtectedRoute>
          ),
        },
        {
          path: "users-management",
          element: (
            <ProtectedRoute requiredPermission="admin_users">
              <UserManagementView />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "clients",
              element: (
                <ProtectedRoute requiredPermission="admin_clients">
                  <ClientsTab />
                </ProtectedRoute>
              ),
            },
            {
              path: "users",
              element: (
                <ProtectedRoute requiredPermission="admin_users">
                  <UsersTab />
                </ProtectedRoute>
              ),
            },
            {
              path: "rolesPermissions",
              element: (
                <ProtectedRoute requiredPermission="admin_roles">
                  <RolesTab />
                </ProtectedRoute>
              ),
            },
            {
              path: "logs",
              element: (
                <ProtectedRoute requireSuperAdmin={true}>
                  <LogsView />
                </ProtectedRoute>
              ),
            },
          ],
        },
        {
          path: "users-profile",
          element: <ProfileView />,
        },
        {
          path: "broadcast",
          element: (
            <ProtectedRoute requiredPermission="admin_broadcast">
              <QuickBroadcast />
            </ProtectedRoute>
          ),
          children: [
            {
              index: true,
              element: <QuickBroadcastView />,
            },
            {
              path: "quick-broadcast",
              element: <QuickBroadcastView />,
            },
            {
              path: "swiper-control",
              element: <SwiperControl />,
            },
            {
              path: "kpi-control",
              element: <KpiControl />,
            },
          ],
        },
      ],
    },
    {
      path: "/",
      element: <Navigate to="/login" replace />,
    },
    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
      v7_startTransition: true,
    },
  }
);

export const AppRouter = () => {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
      }}
    />
  );
};

export default AppRouter;
