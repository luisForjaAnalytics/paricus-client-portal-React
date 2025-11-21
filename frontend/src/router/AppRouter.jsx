import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  // createHashRouter, // para el despliegue ya que rgithub no reconoce rutas dinamicas
} from "react-router-dom";

// Layout components
import { LayoutAccount, Login } from "../common/components/layout";

// Module views
import { DashboardView } from "../modules/dashboard";
import { FinancialsView } from "../modules/financials";
import { AudioRecordingsView } from "../modules/audio-recordings";
import { KnowledgeBaseView, CKEditor, TableView } from "../modules/knowledge-base";
import { ReportingView } from "../modules/reporting";
import { ProfileView } from "../modules/profile";
import { ReportsManagementView } from "../modules/reports-management";
import { UserManagementView, UsersTab, ClientsTab, RolesTab } from "../modules/user-management";
import { ErrorView } from "../modules/error";

const router = createBrowserRouter(
  [
    {
      path: "/app",
      element: <LayoutAccount />,
      errorElement: <ErrorView />,
      children: [
        {
          path: "dashboard",
          element: <DashboardView />,
        },
        {
          path: "reporting",
          element: <ReportingView />,
        },
        {
          path: "audio-recordings",
          element: <AudioRecordingsView />,
        },
        {
          path: "knowledge-base",
          element: <KnowledgeBaseView />,
          children: [
            {
              path: "articles",
              element: <TableView />,
            },
            {
              path: "editorView/:articleId",
              element: <CKEditor />,
            },
          ],
        },
        {
          path: "financial",
          element: <FinancialsView />,
        },
        {
          path: "reports-management",
          element: <ReportsManagementView />,
        },
        {
          path: "users-management",
          element: <UserManagementView />,
          children: [
            {
              path: "clients",
              element: <ClientsTab />,
            },
            {
              path: "users",
              element: <UsersTab />,
            },
            {
              path: "rolesPermissions",
              element: <RolesTab />,
            },
          ],
        },
        {
          path: "users-profile",
          element: <ProfileView />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "*",
      element: <Navigate to="/app" />,
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
