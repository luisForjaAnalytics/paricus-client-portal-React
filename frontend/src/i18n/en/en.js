export default {
  // Brand
  brand: {
    name: "PARICUS",
  },

  // Navigation - Sidebar
  navigation: {
    dashboard: "Dashboard",
    reporting: "Reporting",
    audioRetrieval: "Audio Recordings",
    knowledgeBase: "Knowledge Base",
    financial: "Financial",
    reportsManagement: "Reports Management",
    userManagement: "Management",
    clientManagement: "Client Management",
    usersManagement: "User Management",
    roleManagement: "Role Management",
    logs: "Logs",
    myProfile: "My Profile",
  },

  // Navigation tooltips (when sidebar is collapsed)
  tooltips: {
    dashboard: "Dashboard",
    reporting: "Reporting",
    audioRetrieval: "Audio Retrieval",
    knowledgeBase: "Knowledge Base",
    financial: "Financial",
    reportsManagement: "Reports Management",
    userManagement: "Management",
    collapseMenu: "Collapse menu",
    expandMenu: "Expand menu",
    myProfile: "My Profile",
  },

  // Sidebar control buttons
  sidebar: {
    collapse: "Collapse",
  },

  // Header
  header: {
    searchPlaceholder: "Search...",
  },

  // User dropdown
  userDropdown: {
    defaultUser: "User",
    myProfile: "My Profile",
    userManagement: "User Management",
    signOut: "Sign out",
  },

  // Alt text
  altText: {
    userAvatar: "User avatar",
  },
  // language
  language: {
    label: "language",
    es: "Spanish",
    en: "English",
  },

  //Users Management
  userManagement: {
    clients: { label: "Clients", title: "Client Management" },
    users: { label: "Users", title: "User Management" },
    rolesPermissions: {
      label: "Roles & Permissions",
      title: "Role Management",
    },
    logs: {
      label: "Logs",
      title: "Logs Management",
      logDetails: "Log Details",
      eventId: "Event ID",
      timestamp: "Timestamp",
      userId: "User ID",
      eventType: "Event Type",
      entity: "Entity",
      description: "Description",
      ipAddress: "IP Address",
      status: "Status",
      noLogsFound: "No logs found",
      errorLoading: "Error loading logs",
      unknownError: "Unknown error",
    },
  },

  // Audio Recordings
  audioRecordings: {
    // Page header
    sectionTitle: "Audio Recordings",
    pageDescription:
      "View and listen to call recordings from the Workforce Management database",

    // Warnings and errors
    databaseNotConfigured: "Database Not Configured",
    databaseNotConfiguredMessage:
      "SQL Server credentials are not set. Please configure MSSQL settings in the .env file.",

    // Quick Filters
    quickFilter: {
      label: "Company Filter:",
      clearCompanyFilter: "Clear Company Filter",
      audio: "Audio:",
      withAudio: "With Audio",
      withoutAudio: "Without Audio",
      all: "All",
    },

    // Advanced Filters
    advancedFilters: {
      title: "Advanced Filters",
      typing: "Typing...",
      search: "Search",
      loading: "Loading...",
      clearAll: "Clear All Filters",
      interactionId: "Interaction ID",
      interactionIdPlaceholder: "Search by interaction ID",
      customerPhone: "Customer Phone",
      customerPhonePlaceholder: "Search by phone number",
      agentName: "Agent Name",
      agentNamePlaceholder: "Search by agent name",
      callType: "Call Type",
      allTypes: "All Types",
      startDate: "Start Date",
      endDate: "End Date",
    },

    // Results table
    results: {
      title: "Call Recordings",
      totalRecordings: "total recordings found",
      showing: "Showing",
      perPage: "per page",
      playingAudio: "Playing Audio",
      perPageLabel: "Per Page",
      items: "items",
      noRecordings: "No recordings found",
      tryAdjusting: "Try adjusting your search filters",
      loadingRecordings: "Loading recordings...",
    },

    // Table columns
    table: {
      interactionId: "Interaction ID",
      company: "Company",
      callType: "Call Type",
      startTime: "Start Time",
      endTime: "End Time",
      customerPhone: "Customer Phone",
      agentName: "Agent Name",
      actions: "Actions",
      unknown: "Unknown",
      noAudio: "No Audio",
    },

    // Tooltips
    tooltips: {
      stop: "Stop",
      play: "Play",
      download: "Download",
      rewind10s: "Rewind 10s",
      forward10s: "Forward 10s",
      mute: "Mute",
      unmute: "Unmute",
    },

    // Pagination
    pagination: {
      showingFrom: "Showing",
      to: "to",
      of: "of",
      recordings: "recordings",
      page: "Page",
    },

    // Audio player
    audioPlayer: {
      unknownAgent: "Unknown Agent",
    },
  },

  // Invoices
  invoices: {
    // Table columns
    table: {
      invoiceNumber: "Invoice #",
      fileName: "File Name",
      amount: "Amount",
      status: "Status",
      dueDate: "Due Date",
      paymentDate: "Payment Date",
      paymentLink: "Payment Link",
      actions: "Actions",
    },

    // Actions
    actions: {
      payNow: "Pay Now",
      editInvoice: "Edit Invoice",
      download: "Download",
      delete: "Delete",
      view: "View Invoice"
    },

    // Payment Link Modal
    paymentLink: {
      pendingLink: "PENDING LINK",
      linkSet: "✓ Link Set",
      updateLink: "Update link",
      modalTitle: "Set Payment Link",
      invoiceLabel: "Invoice",
      urlLabel: "Payment Link URL",
      urlPlaceholder: "https://example.com/payment/invoice-123",
      urlHelper: "Enter a valid payment URL (Stripe, PayPal, etc.)",
      cancel: "Cancel",
      saving: "Saving...",
      saveButton: "Save Link",
      successMessage: "Payment link saved successfully",
      errorMessage: "Failed to save payment link",
    },
  },

  // Common strings
  common: {
    cancel: "Cancel",
    save: "Save",
    saving: "Saving...",
    delete: "Delete",
    deleting: "Deleting...",
    edit: "Edit",
    add: "Add",
    search: "Search",
    filter: "Filter",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    confirm: "Confirm",
    close: "Close",
    refresh: "Refresh",
    download: "Download",
    upload: "Upload",
    uploading: "Uploading...",
    actions: "Actions",
    active: "Active",
    inactive: "Inactive",
    all: "All",
    none: "None",
    yes: "Yes",
    no: "No",
    select: "Select",
    tryAgain: "Try Again",
    backToHome: "Back to Home",
    goHome: "Go Home",
    noResults: "No results found",
    perPage: "Per page",
    showing: "Showing",
    of: "of",
    items: "items",
    required: "Required",
    optional: "Optional",
    updating: "Updating...",
    update: "Update",
  },

  // Login
  login: {
    title: "Client Portal",
    welcome: "Welcome back! Please enter your details.",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot password?",
    signIn: "Sign in",
    signingIn: "Signing in...",
    fillAllFields: "Please fill in all fields",
    invalidCredentials: "Invalid credentials",
  },

  // Profile
  profile: {
    title: "My Profile",
    description: "Manage your account settings and preferences",
    photoLabel: "Profile photo",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone",
    phoneOptional: "Phone (Optional)",
    emailCannotChange: "Email cannot be changed",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm New Password",
    passwordMinLength: "Password must be at least 8 characters",
    passwordsNotMatch: "Passwords do not match",
    saveProfile: "Save Profile",
    updatePassword: "Update Password",
    profileUpdated: "Profile updated successfully",
    profileUpdateFailed: "Failed to update profile",
    passwordUpdated: "Password updated successfully",
    passwordUpdateFailed: "Failed to update password",
  },

  // Users Management
  users: {
    title: "User Management",
    description: "Manage user accounts and permissions",
    addUser: "Add New User",
    editUser: "Edit User",
    searchPlaceholder: "Search by name or email...",
    filterByClient: "Filter by Client",
    allClients: "All Clients",
    table: {
      id: "ID",
      name: "Name",
      email: "Email",
      client: "Client",
      role: "Role",
      status: "Status",
      created: "Created",
      actions: "Actions",
      noRole: "No role assigned",
    },
    form: {
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      client: "Client",
      role: "Role",
      password: "Password",
      selectClient: "Select a client",
      selectClientFirst: "Select a client first",
      noRolesAvailable: "No roles available for this client",
      selectRole: "Select a role",
    },
    actions: {
      edit: "Edit user",
      deactivate: "Deactivate user",
      activate: "Activate user",
    },
    messages: {
      userUpdated: "User updated successfully",
      userCreated: "User created successfully",
      userSaveFailed: "Failed to save user",
      userActivated: "User activated successfully",
      userDeactivated: "User deactivated successfully",
    },
  },

  // Roles Management
  roles: {
    title: "Role Management",
    description: "Manage roles and permissions",
    addRole: "Add New Role",
    editRole: "Edit Role",
    configurePermissions: "Configure Permissions",
    cannotEditOwnRole: "You cannot edit the permissions of your own role",
    confirmDelete: "Confirm Delete",
    deleteWarning: "Are you sure you want to delete the role",
    deleteWarningContinue:
      "This action cannot be undone and will affect all users with this role.",
    filterByClient: "Client",
    allClients: "All Clients",
    table: {
      id: "ID",
      roleName: "Role Name",
      description: "Description",
      client: "Client",
      permissions: "Permissions",
      created: "Created",
      actions: "Actions",
    },
    form: {
      roleName: "Role Name",
      description: "Description",
      client: "Client",
      roleNameMinLength: "Role name must be at least 2 characters",
      permissionsTitle: "Select which permissions this role should have:",
    },
    actions: {
      edit: "Edit role",
      configurePermissions: "Configure permissions",
      delete: "Delete role",
      savePermissions: "Save Permissions",
    },
    messages: {
      roleUpdated: "Role updated successfully",
      roleCreated: "Role created successfully",
      roleSaveFailed: "Failed to save role",
      roleDeleted: "Role deleted successfully",
      roleDeleteFailed: "Failed to delete role",
      permissionsUpdated: "Permissions updated successfully",
      permissionsUpdateFailed: "Failed to update permissions",
    },
  },

  // Permissions
  permission: {
    view_dashboard: "View Dashboard",
    view_financials: "View Financials",
    download_invoices: "Download Invoices",
    view_reporting: "View Reports",
    download_reports: "Download Reports",
    view_interactions: "View Interactions",
    download_audio_files: "Download Audio Files",
    view_knowledge_base: "View Knowledge Base",
    create_kb_articles: "Create KB Articles",
    edit_kb_articles: "Edit KB Articles",
    admin_clients: "Manage Clients",
    admin_users: "Manage Users",
    admin_roles: "Manage Roles",
    admin_reports: "Manage Reports",
    admin_dashboard_config: "Configure Dashboard",
    admin_invoices: "Manage Invoices",
    admin_audio_recordings: "Manage Audio Recordings",
    view_invoices: "View Invoices",
    pay_invoices: "Pay Invoices",
  },

  // Clients Management
  clients: {
    title: "Client Management",
    description: "Manage and configure client accounts",
    addClient: "Add New Client",
    editClient: "Edit Client",
    confirmDeactivation: "Confirm Deactivation",
    deactivationWarning: "Are you sure you want to deactivate",
    deactivationWarningContinue:
      "This will also deactivate all users belonging to this client.",
    table: {
      clientName: "Client Name",
      type: "Type",
      status: "Status",
      users: "Users",
      roles: "Roles",
      created: "Created",
      actions: "Actions",
      prospect: "Prospect",
      client: "Client",
    },
    form: {
      clientName: "Client Name",
      isProspect: "Is Prospect",
      active: "Active",
    },
    actions: {
      edit: "Edit client",
      deactivate: "Deactivate client",
      deactivate: "Deactivate",
    },
    messages: {
      clientUpdated: "Client updated successfully",
      clientCreated: "Client created successfully",
      clientSaveFailed: "Failed to save client",
      clientDeactivated: "Client deactivated successfully",
      clientDeactivateFailed: "Failed to deactivate client",
    },
  },

  // Financials
  financials: {
    title: "Financial Overview",
    clientTitle: "Your Invoices",
    description: "Manage all client invoices and track accounts receivable",
    clientDescription: "View and download your invoices",
    uploadInvoice: "Upload Invoice",
    editInvoice: "Edit Invoice",
    uploadNewInvoice: "Upload New Invoice",
    markAsPaid: "Mark as Paid",
    stats: {
      totalRevenue: "Total Revenue",
      outstandingBalance: "Outstanding Balance",
      overdueAmount: "Overdue Amount",
      activeClients: "Active Clients",
      paidInvoices: "paid invoices",
      unpaidInvoices: "unpaid invoices",
      overdueInvoices: "overdue invoices",
      totalInvoices: "total invoices",
      totalPaid: "Total Paid",
      nextPaymentDue: "Next Payment Due",
      unpaid: "unpaid",
      invoices: "invoices",
    },
    invoicesSection: "Invoices",
    loadingInvoices: "Loading invoices...",
    errorLoading: "Error loading invoices",
    noInvoices: "No invoices found",
    noInvoicesClient: "Invoices will appear here when available",
    uploadSomeInvoices: "Upload some PDF invoices for this client",
    form: {
      invoiceNumber: "Invoice Number",
      title: "Title",
      amount: "Amount",
      currency: "Currency",
      status: "Status",
      paymentMethod: "Payment Method",
      paymentMethodOptional: "Payment Method (Optional)",
      issuedDate: "Issued Date",
      dueDate: "Due Date",
      paidDate: "Paid Date",
      description: "Description",
      descriptionOptional: "Description (Optional)",
      descriptionPlaceholder: "Add notes or description for this invoice",
      paymentLink: "Payment Link URL",
      paymentLinkOptional: "Payment Link URL (Optional)",
      paymentLinkHelper: "Enter a valid payment URL (Stripe, PayPal, etc.)",
      invoiceName: "Invoice Name",
      chooseFile: "Choose PDF File",
      chooseFileRequired: "Choose PDF File *",
      autoSetToday: "Leave empty to auto-set to today",
      currencies: {
        usd: "USD - US Dollar",
        eur: "EUR - Euro",
        gbp: "GBP - British Pound",
        mxn: "MXN - Mexican Peso",
      },
      statuses: {
        draft: "Draft",
        sent: "Sent",
        viewed: "Viewed",
        paid: "Paid",
        overdue: "Overdue",
        cancelled: "Cancelled",
      },
      paymentMethods: {
        notSet: "Not Set",
        creditCard: "Credit Card",
        bankTransfer: "Bank Transfer",
        check: "Check",
        cash: "Cash",
        other: "Other",
      },
    },
    messages: {
      invoiceUpdated: "Invoice updated successfully",
      invoiceUpdateFailed: "Failed to update invoice",
      invoiceUploaded: "Invoice uploaded successfully",
      invoiceUploadFailed: "Failed to upload invoice",
      invoiceDeleted: "Invoice deleted successfully",
      invoiceDeleteFailed: "Failed to delete invoice",
      noPermission: "You do not have permission to view invoices",
      invoiceNameRequired: "Invoice name is required",
      amountGreaterThanZero: "Amount must be greater than 0",
      dueDateRequired: "Due date is required",
      issuedDateRequired: "Issued date is required",
      downloadStarted: "Download started",
      downloadFailed: "Failed to download invoice",
      confirmDeleteInvoice: "Are you sure you want to delete this invoice?",
      openingPaymentPage: "Opening payment page...",
      saveChanges: "Save Changes",
      processingPdf: "Processing PDF with OCR...",
      processingFile: "Processing...",
    },
    clientBreakdown: {
      title: "Client Breakdown",
      noClientsFound: "No clients found",
      uploadInvoicesMessage: "Upload invoices to see client data",
      columns: {
        company: "COMPANY",
        invoices: "INVOICES",
        revenue: "REVENUE",
        outstanding: "OUTSTANDING",
        overdue: "OVERDUE",
      },
      invoicesTitle: "Invoices",
      noInvoicesFound: "No invoices found for this client",
    },
    clientSummary: {
      title: "All Clients Summary",
      waveAppsButton: "Wave Apps",
      refreshButton: "Refresh All",
      loading: "Loading...",
    },
  },

  // Reporting
  reporting: {
    title: "Operations Dashboard",
    clientTitle: "Your Reports",
    refreshReports: "Refresh Reports",
    loadingReports: "Loading your reports...",
    errorLoading: "Error loading reports",
    noReports: "No reports available",
    noReportsMessage:
      "Reports will appear here when they are uploaded by our team",
    noReportsInFolder: "No reports found in this folder",
    downloadStarted: "Download started",
    downloadFailed: "Failed to download report",
    generatingLink: "Generating download link...",
  },

  // Error Pages
  errors: {
    notFound: {
      code: "404",
      title: "Page Not Found",
      description:
        "The page you're looking for doesn't exist or has been moved.",
      goHome: "Go Home",
    },
  },

  // Knowledge Base
  knowledgeBase: {
    title: "Knowledge Base",
    description: "Browse and manage knowledge base articles",
    comingSoon: "Knowledge Base Module",
    comingSoonDescription:
      "This module will include article management, search functionality, and content creation tools.",
    phase: "Coming in Phase 5",
    articles: "Articles",
    synopsis: "Synopsis",
    updatedAt: "Updated At",
    actions: "Actions",
    edit: "Edit",
    view: "View",
    noArticlesFound: "No articles found",
    loadingArticles: "Loading articles...",
  },

  // Permission
  permission: {
    admin_audio_recordings: "Admin audio recordings",
    admin_clients: "Admin clients",
    admin_dashboard_config: "Admin dashboard configuration",
    admin_invoices: "Admin invoices",
    admin_reports: "Admin reports",
    admin_roles: "Admin roles",
    admin_users: "Admin users",
    create_kb_articles: "Create knowledge base articles",
    download_audio_files: "Download audio files",
    download_invoices: "Download invoices",
    download_reports: "Download reports",
    edit_kb_articles: "Edit knowledge base articles",
    pay_invoices: "Pay invoices",
    view_dashboard: "View dashboard",
    view_financials: "View financials",
    view_interactions: "View interactions",
    view_invoices: "View invoices",
    view_knowledge_base: "View knowledge base",
    view_reporting: "View reporting",
  },
};
