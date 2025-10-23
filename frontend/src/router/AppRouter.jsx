import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  // createHashRouter, // para el despliegue ya que rgithub no reconoce rutas dinamicas
} from "react-router-dom";
import { LayoutAccount } from "../layouts/LayoutAccount";
import LoginView from "../layouts/Login";
import { ReportsManagementView } from "../views/reportsManagementView/ReportsManagementView";
import { FinancialsView } from "../views/financials/FinancialsView";
import { UsersManagement } from "../views/admin/usersManagement/UsersManagement";
import { AudioRecordingsView } from "../views/admin/audioRecordingsView/AudioRecordingsView";
import { Dashboard } from "../views/dashboard/dashboard.jsx";
import { KnowledgeBaseView } from "../views/knowledgeBaseView/KnowledgeBaseView.jsx";
import { ReportingView } from "../views/reportingView/ReportingView.jsx";
import { ClientsView } from "../views/admin/usersManagement/clientsView/ClientsView.jsx";
import { ProfileView } from "../views/ProfileView/ProfileView.jsx";
import { ErrorView } from "../views/errorView/ErrorView.jsx";

const router = createBrowserRouter(
  [
    {
      path: "/app",
      element: <LayoutAccount />,
      errorElement: <ErrorView />,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
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
          element: <UsersManagement />,
        },
        {
          path: "users-profile",
          element: <ProfileView />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginView />,
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
