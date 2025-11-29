const permissionList = [
  {
    id: 1,
    permissionName: "view_dashboard",
    description: "View dashboard and basic metrics",
    createdAt: "2025-10-13T19:03:13.526Z",
  },
  {
    id: 2,
    permissionName: "view_financials",
    description: "View financial information and invoices",
    createdAt: "2025-10-13T19:03:13.549Z",
  },
  {
    id: 3,
    permissionName: "download_invoices",
    description: "Download invoice files",
    createdAt: "2025-10-13T19:03:13.556Z",
  },
  {
    id: 4,
    permissionName: "view_reporting",
    description: "View reports and KPIs",
    createdAt: "2025-10-13T19:03:13.564Z",
  },
  {
    id: 5,
    permissionName: "download_reports",
    description: "Download report files",
    createdAt: "2025-10-13T19:03:13.570Z",
  },
  {
    id: 6,
    permissionName: "view_interactions",
    description: "View interaction history",
    createdAt: "2025-10-13T19:03:13.576Z",
  },
  {
    id: 7,
    permissionName: "download_audio_files",
    description: "Download audio interaction files",
    createdAt: "2025-10-13T19:03:13.583Z",
  },
  {
    id: 8,
    permissionName: "view_knowledge_base",
    description: "View knowledge base articles",
    createdAt: "2025-10-13T19:03:13.590Z",
  },
  {
    id: 9,
    permissionName: "create_kb_articles",
    description: "Create knowledge base articles",
    createdAt: "2025-10-13T19:03:13.597Z",
  },
  {
    id: 10,
    permissionName: "edit_kb_articles",
    description: "Edit knowledge base articles",
    createdAt: "2025-10-13T19:03:13.605Z",
  },
  {
    id: 11,
    permissionName: "admin_clients",
    description: "Manage clients (BPO Admin only)",
    createdAt: "2025-10-13T19:03:13.612Z",
  },
  {
    id: 12,
    permissionName: "admin_users",
    description: "Manage users (BPO Admin only)",
    createdAt: "2025-10-13T19:03:13.619Z",
  },
  {
    id: 13,
    permissionName: "admin_roles",
    description: "Manage roles and permissions (BPO Admin only)",
    createdAt: "2025-10-13T19:03:13.626Z",
  },
  {
    id: 14,
    permissionName: "admin_reports",
    description: "Upload and manage client reports (BPO Admin only)",
    createdAt: "2025-10-13T19:03:13.633Z",
  },
  {
    id: 15,
    permissionName: "admin_dashboard_config",
    description: "Configure dashboard layouts (BPO Admin only)",
    createdAt: "2025-10-13T19:03:13.640Z",
  },
  {
    id: 16,
    permissionName: "admin_invoices",
    description:
      "Manage invoices - create, send, and set payment links (BPO Admin only)",
    createdAt: "2025-10-13T19:03:13.647Z",
  },
  {
    id: 17,
    permissionName: "view_invoices",
    description: "View client invoices (Client Admin only)",
    createdAt: "2025-10-13T19:03:13.653Z",
  },
  {
    id: 18,
    permissionName: "pay_invoices",
    description: "Access payment links for invoices",
    createdAt: "2025-10-13T19:03:13.659Z",
  },
  {
    id: 19,
    permissionName: "admin_audio_recordings",
    description:
      "View and manage audio call recordings from Workforce Management database (BPO Admin only)",
    createdAt: "2025-10-13T20:08:41.561Z",
  },
];

export const permissionListSection = (
  permissionArray = permissionList || []
) => {
  const sections = {
    dashboard: ["view_dashboard", "admin_dashboard_config"],
    reporting: ["view_reporting"],
    audioRetrieval: [
      "view_interactions",
      "admin_audio_recordings",
      "download_audio_files",
    ],
    knowledgeBase: [
      "view_knowledge_base",
      "create_kb_articles",
      "edit_kb_articles",
    ],
    financial: [
      "view_financials",
      "admin_invoices",
      "download_invoices",
      "pay_invoices",
    ],
    reportsManagement: ["admin_reports", "download_reports"],
  };

  try {
    const result = {};

    for (const [key, permissionNames] of Object.entries(sections)) {
      result[key] = permissionArray.filter((item) =>
        permissionNames.includes(item.permissionName)
      );
    }

    return result;
  } catch (err) {
    console.warn(err);
  }
};
