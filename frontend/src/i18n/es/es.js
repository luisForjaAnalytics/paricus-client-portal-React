export default {
  // Marca
  brand: {
    name: "PARICUS",
  },

  // Navegación - Sidebar
  navigation: {
    dashboard: "Dashboard",
    reporting: "Reportes",
    audioRetrieval: "Grabaciones de Audio",
    knowledgeBase: "Conocimientos",
    financial: "Financiero",
    reportsManagement: "Gestión de Reportes",
    userManagement: "Gestión de Usuarios",
    myProfile: "My Profile",
  },

  // Tooltips de navegación (cuando el sidebar está colapsado)
  tooltips: {
    dashboard: "Dashboard",
    reporting: "Reportes",
    audioRetrieval: "Recuperación de Audio",
    knowledgeBase: "Conocimientos",
    financial: "Financiero",
    reportsManagement: "Gestión de Reportes",
    userManagement: "Gestión de Usuarios",
    collapseMenu: "Contraer menú",
    expandMenu: "Expandir menú",
    myProfile: "Mi Perfil",
  },

  // Botones de control del sidebar
  sidebar: {
    collapse: "Contraer",
  },

  // Header
  header: {
    searchPlaceholder: "Buscar...",
  },

  // Dropdown de usuario
  userDropdown: {
    defaultUser: "Usuario",
    myProfile: "Mi Perfil",
    userManagement: "Gestión de Usuarios",
    signOut: "Cerrar Sesión",
  },

  // Textos alternativos
  altText: {
    userAvatar: "Avatar de usuario",
  },
  // language
  language: {
    label: "Idioma",
    es: "Español",
    en: "Ingles",
  },
  //Users Management
  userManagement: {
    clients: { label: "Clientes", title: "Administrador de Clientes" },
    users: { label: "Usuarios", title: "Administrador de Usuarios" },
    rolesPermissions: {
      label: "Roles y Permisos",
      title: "Roles y Permisos",
    },
  },

  // Audio Recordings
  audioRecordings: {
    // Page header
    pageDescription: "Ver y escuchar grabaciones de llamadas de la base de datos de Workforce Management",

    // Warnings and errors
    databaseNotConfigured: "Base de Datos No Configurada",
    databaseNotConfiguredMessage: "Las credenciales de SQL Server no están configuradas. Por favor configure los ajustes de MSSQL en el archivo .env.",

    // Quick Filters
    quickFilter: {
      label: "Compañía:",
      clearCompanyFilter: "Limpiar Filtro de Compañía",
      audio: "Audio:",
      withAudio: "Con Audio",
      withoutAudio: "Sin Audio",
      all: "Todos",
    },

    // Advanced Filters
    advancedFilters: {
      title: "Filtros Avanzados",
      typing: "Escribiendo...",
      search: "Buscar",
      loading: "Cargando...",
      clearAll: "Limpiar Todos los Filtros",
      interactionId: "ID de Interacción",
      interactionIdPlaceholder: "Buscar por ID de interacción",
      customerPhone: "Teléfono del Cliente",
      customerPhonePlaceholder: "Buscar por número de teléfono",
      agentName: "Nombre del Agente",
      agentNamePlaceholder: "Buscar por nombre del agente",
      callType: "Tipo de Llamada",
      allTypes: "Todos los Tipos",
      startDate: "Fecha de Inicio",
      endDate: "Fecha de Fin",
    },

    // Results table
    results: {
      title: "Grabaciones de Llamadas",
      totalRecordings: "grabaciones encontradas en total",
      showing: "Mostrando",
      perPage: "por página",
      playingAudio: "Reproduciendo Audio",
      perPageLabel: "Por Página",
      items: "elementos",
      noRecordings: "No se encontraron grabaciones",
      tryAdjusting: "Intenta ajustar tus filtros de búsqueda",
      loadingRecordings: "Cargando grabaciones...",
    },

    // Table columns
    table: {
      interactionId: "ID de Interacción",
      company: "Compañía",
      callType: "Tipo de Llamada",
      startTime: "Hora de Inicio",
      endTime: "Hora de Fin",
      customerPhone: "Teléfono del Cliente",
      agentName: "Nombre del Agente",
      actions: "Acciones",
      unknown: "Desconocido",
      noAudio: "Sin Audio",
    },

    // Tooltips
    tooltips: {
      stop: "Detener",
      play: "Reproducir",
      download: "Descargar",
      rewind10s: "Retroceder 10s",
      forward10s: "Avanzar 10s",
      mute: "Silenciar",
      unmute: "Activar Sonido",
    },

    // Pagination
    pagination: {
      showingFrom: "Mostrando",
      to: "a",
      of: "de",
      recordings: "grabaciones",
      page: "Página",
    },

    // Audio player
    audioPlayer: {
      unknownAgent: "Agente Desconocido",
    },
  },
};
