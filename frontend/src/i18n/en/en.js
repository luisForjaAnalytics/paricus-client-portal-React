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
  },

  // Audio Recordings
  audioRecordings: {
    // Page header
    pageDescription: "View and listen to call recordings from the Workforce Management database",

    // Warnings and errors
    databaseNotConfigured: "Database Not Configured",
    databaseNotConfiguredMessage: "SQL Server credentials are not set. Please configure MSSQL settings in the .env file.",

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
};
