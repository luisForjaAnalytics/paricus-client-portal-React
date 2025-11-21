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
    clientManagement: "Administrador de Clientes",
    usersManagement: "Administrador de Usuarios",
    roleManagement: "Administrador de Roles",
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
    sectionTitle: "Grabaciones",
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

  // Facturas
  invoices: {
    // Columnas de tabla
    table: {
      invoiceNumber: "Factura #",
      fileName: "Nombre del Archivo",
      amount: "Monto",
      status: "Estado",
      dueDate: "Fecha de Vencimiento",
      paymentDate: "Fecha de Pago",
      paymentLink: "Enlace de Pago",
      actions: "Acciones",
    },

    // Acciones
    actions: {
      payNow: "Pagar Ahora",
      editInvoice: "Editar Factura",
      download: "Descargar",
      delete: "Eliminar",
    },

    // Modal de Enlace de Pago
    paymentLink: {
      pendingLink: "ENLACE PENDIENTE",
      linkSet: "✓ Enlace Configurado",
      updateLink: "Actualizar enlace",
      modalTitle: "Configurar Enlace de Pago",
      invoiceLabel: "Factura",
      urlLabel: "URL del Enlace de Pago",
      urlPlaceholder: "https://ejemplo.com/pago/factura-123",
      urlHelper: "Ingrese una URL de pago válida (Stripe, PayPal, etc.)",
      cancel: "Cancelar",
      saving: "Guardando...",
      saveButton: "Guardar Enlace",
      successMessage: "Enlace de pago guardado exitosamente",
      errorMessage: "Error al guardar el enlace de pago",
    },
  },

  // Strings comunes
  common: {
    cancel: "Cancelar",
    save: "Guardar",
    saving: "Guardando...",
    delete: "Eliminar",
    deleting: "Eliminando...",
    edit: "Editar",
    add: "Agregar",
    search: "Buscar",
    filter: "Filtrar",
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    confirm: "Confirmar",
    close: "Cerrar",
    refresh: "Actualizar",
    download: "Descargar",
    upload: "Subir",
    uploading: "Subiendo...",
    actions: "Acciones",
    active: "Activo",
    inactive: "Inactivo",
    all: "Todos",
    none: "Ninguno",
    yes: "Sí",
    no: "No",
    select: "Seleccionar",
    tryAgain: "Intentar de Nuevo",
    backToHome: "Volver al Inicio",
    goHome: "Ir al Inicio",
    noResults: "No se encontraron resultados",
    perPage: "Por página",
    showing: "Mostrando",
    of: "de",
    items: "elementos",
    required: "Requerido",
    optional: "Opcional",
    updating: "Actualizando...",
    update: "Actualizar",
  },

  // Login
  login: {
    title: "Portal de Clientes",
    welcome: "¡Bienvenido de nuevo! Por favor ingrese sus datos.",
    email: "Correo Electrónico",
    password: "Contraseña",
    forgotPassword: "¿Olvidó su contraseña?",
    signIn: "Iniciar Sesión",
    signingIn: "Iniciando sesión...",
    fillAllFields: "Por favor complete todos los campos",
    invalidCredentials: "Credenciales inválidas",
  },

  // Perfil
  profile: {
    title: "Mi Perfil",
    description: "Administre la configuración y preferencias de su cuenta",
    photoLabel: "Foto de perfil",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo Electrónico",
    phone: "Teléfono",
    phoneOptional: "Teléfono (Opcional)",
    emailCannotChange: "El correo electrónico no se puede cambiar",
    changePassword: "Cambiar Contraseña",
    currentPassword: "Contraseña Actual",
    newPassword: "Nueva Contraseña",
    confirmPassword: "Confirmar Nueva Contraseña",
    passwordMinLength: "La contraseña debe tener al menos 8 caracteres",
    passwordsNotMatch: "Las contraseñas no coinciden",
    saveProfile: "Guardar Perfil",
    updatePassword: "Actualizar Contraseña",
    profileUpdated: "Perfil actualizado exitosamente",
    profileUpdateFailed: "Error al actualizar el perfil",
    passwordUpdated: "Contraseña actualizada exitosamente",
    passwordUpdateFailed: "Error al actualizar la contraseña",
  },

  // Gestión de Usuarios
  users: {
    title: "Gestión de Usuarios",
    description: "Administre cuentas de usuario y permisos",
    addUser: "Agregar Nuevo Usuario",
    editUser: "Editar Usuario",
    searchPlaceholder: "Buscar por nombre o correo...",
    filterByClient: "Filtrar por Cliente",
    allClients: "Todos los Clientes",
    table: {
      id: "ID",
      name: "Nombre",
      email: "Correo",
      client: "Cliente",
      role: "Rol",
      status: "Estado",
      created: "Creado",
      actions: "Acciones",
      noRole: "Sin rol asignado",
    },
    form: {
      firstName: "Nombre",
      lastName: "Apellido",
      email: "Correo Electrónico",
      client: "Cliente",
      role: "Rol",
      password: "Contraseña",
      selectClient: "Seleccione un cliente",
      selectClientFirst: "Primero seleccione un cliente",
      noRolesAvailable: "No hay roles disponibles para este cliente",
      selectRole: "Seleccione un rol",
    },
    actions: {
      edit: "Editar usuario",
      deactivate: "Desactivar usuario",
      activate: "Activar usuario",
    },
    messages: {
      userUpdated: "Usuario actualizado exitosamente",
      userCreated: "Usuario creado exitosamente",
      userSaveFailed: "Error al guardar el usuario",
      userActivated: "Usuario activado exitosamente",
      userDeactivated: "Usuario desactivado exitosamente",
    },
  },

  // Gestión de Roles
  roles: {
    title: "Gestión de Roles",
    description: "Administre roles y permisos",
    addRole: "Agregar Nuevo Rol",
    editRole: "Editar Rol",
    configurePermissions: "Configurar Permisos",
    confirmDelete: "Confirmar Eliminación",
    deleteWarning: "¿Está seguro de que desea eliminar el rol",
    deleteWarningContinue: "Esta acción no se puede deshacer y afectará a todos los usuarios con este rol.",
    filterByClient: "Cliente",
    allClients: "Todos los Clientes",
    table: {
      id: "ID",
      roleName: "Nombre del Rol",
      description: "Descripción",
      client: "Cliente",
      permissions: "Permisos",
      created: "Creado",
      actions: "Acciones",
    },
    form: {
      roleName: "Nombre del Rol",
      description: "Descripción",
      client: "Cliente",
      roleNameMinLength: "El nombre del rol debe tener al menos 2 caracteres",
      permissionsTitle: "Seleccione los permisos que debe tener este rol:",
    },
    actions: {
      edit: "Editar rol",
      configurePermissions: "Configurar permisos",
      delete: "Eliminar rol",
      savePermissions: "Guardar Permisos",
    },
    messages: {
      roleUpdated: "Rol actualizado exitosamente",
      roleCreated: "Rol creado exitosamente",
      roleSaveFailed: "Error al guardar el rol",
      roleDeleted: "Rol eliminado exitosamente",
      roleDeleteFailed: "Error al eliminar el rol",
      permissionsUpdated: "Permisos actualizados exitosamente",
      permissionsUpdateFailed: "Error al actualizar los permisos",
    },
  },

  // Gestión de Clientes
  clients: {
    title: "Gestión de Clientes",
    description: "Administre y configure cuentas de clientes",
    addClient: "Agregar Nuevo Cliente",
    editClient: "Editar Cliente",
    confirmDeactivation: "Confirmar Desactivación",
    deactivationWarning: "¿Está seguro de que desea desactivar",
    deactivationWarningContinue: "Esto también desactivará a todos los usuarios pertenecientes a este cliente.",
    table: {
      clientName: "Nombre del Cliente",
      type: "Tipo",
      status: "Estado",
      users: "Usuarios",
      roles: "Roles",
      created: "Creado",
      actions: "Acciones",
      prospect: "Prospecto",
      client: "Cliente",
    },
    form: {
      clientName: "Nombre del Cliente",
      isProspect: "Es Prospecto",
      active: "Activo",
    },
    actions: {
      edit: "Editar cliente",
      deactivate: "Desactivar cliente",
      deactivate: "Desactivar",
    },
    messages: {
      clientUpdated: "Cliente actualizado exitosamente",
      clientCreated: "Cliente creado exitosamente",
      clientSaveFailed: "Error al guardar el cliente",
      clientDeactivated: "Cliente desactivado exitosamente",
      clientDeactivateFailed: "Error al desactivar el cliente",
    },
  },

  // Financiero
  financials: {
    title: "Resumen Financiero",
    clientTitle: "Sus Facturas",
    description: "Administre todas las facturas de clientes y rastree cuentas por cobrar",
    clientDescription: "Vea y descargue sus facturas",
    uploadInvoice: "Subir Factura",
    editInvoice: "Editar Factura",
    uploadNewInvoice: "Subir Nueva Factura",
    markAsPaid: "Marcar como Pagada",
    stats: {
      totalRevenue: "Ingresos Totales",
      outstandingBalance: "Saldo Pendiente",
      overdueAmount: "Monto Vencido",
      activeClients: "Clientes Activos",
      paidInvoices: "facturas pagadas",
      unpaidInvoices: "facturas sin pagar",
      overdueInvoices: "facturas vencidas",
      totalInvoices: "facturas totales",
      totalPaid: "Total Pagado",
      nextPaymentDue: "Próximo Pago Vencido",
      unpaid: "sin pagar",
      invoices: "facturas",
    },
    invoicesSection: "Facturas",
    loadingInvoices: "Cargando facturas...",
    errorLoading: "Error al cargar facturas",
    noInvoices: "No se encontraron facturas",
    noInvoicesClient: "Las facturas aparecerán aquí cuando estén disponibles",
    uploadSomeInvoices: "Suba algunas facturas en PDF para este cliente",
    form: {
      invoiceNumber: "Número de Factura",
      title: "Título",
      amount: "Monto",
      currency: "Moneda",
      status: "Estado",
      paymentMethod: "Método de Pago",
      paymentMethodOptional: "Método de Pago (Opcional)",
      issuedDate: "Fecha de Emisión",
      dueDate: "Fecha de Vencimiento",
      paidDate: "Fecha de Pago",
      description: "Descripción",
      descriptionOptional: "Descripción (Opcional)",
      descriptionPlaceholder: "Agregue notas o descripción para esta factura",
      paymentLink: "URL de Enlace de Pago",
      paymentLinkOptional: "URL de Enlace de Pago (Opcional)",
      paymentLinkHelper: "Ingrese una URL de pago válida (Stripe, PayPal, etc.)",
      invoiceName: "Nombre de la Factura",
      chooseFile: "Elegir Archivo PDF",
      chooseFileRequired: "Elegir Archivo PDF *",
      autoSetToday: "Dejar vacío para establecer automáticamente a hoy",
      currencies: {
        usd: "USD - Dólar Estadounidense",
        eur: "EUR - Euro",
        gbp: "GBP - Libra Esterlina",
        mxn: "MXN - Peso Mexicano",
      },
      statuses: {
        draft: "Borrador",
        sent: "Enviada",
        viewed: "Vista",
        paid: "Pagada",
        overdue: "Vencida",
        cancelled: "Cancelada",
      },
      paymentMethods: {
        notSet: "No Establecido",
        creditCard: "Tarjeta de Crédito",
        bankTransfer: "Transferencia Bancaria",
        check: "Cheque",
        cash: "Efectivo",
        other: "Otro",
      },
    },
    messages: {
      invoiceUpdated: "Factura actualizada exitosamente",
      invoiceUpdateFailed: "Error al actualizar la factura",
      invoiceUploaded: "Factura subida exitosamente",
      invoiceUploadFailed: "Error al subir la factura",
      invoiceDeleted: "Factura eliminada exitosamente",
      invoiceDeleteFailed: "Error al eliminar la factura",
      noPermission: "No tiene permiso para ver facturas",
      invoiceNameRequired: "El nombre de la factura es requerido",
      amountGreaterThanZero: "El monto debe ser mayor a 0",
      dueDateRequired: "La fecha de vencimiento es requerida",
      issuedDateRequired: "La fecha de emisión es requerida",
      downloadStarted: "Descarga iniciada",
      downloadFailed: "Error al descargar la factura",
      confirmDeleteInvoice: "¿Está seguro de que desea eliminar esta factura?",
      openingPaymentPage: "Abriendo página de pago...",
      saveChanges: "Guardar Cambios",
      processingPdf: "Procesando PDF con OCR...",
      processingFile: "Procesando...",
    },
    clientBreakdown: {
      title: "Desglose por Cliente",
      noClientsFound: "No se encontraron clientes",
      uploadInvoicesMessage: "Sube facturas para ver datos de clientes",
      columns: {
        company: "EMPRESA",
        invoices: "FACTURAS",
        revenue: "INGRESOS",
        outstanding: "PENDIENTE",
        overdue: "VENCIDO",
      },
      invoicesTitle: "Facturas",
      noInvoicesFound: "No se encontraron facturas para este cliente",
    },
    clientSummary: {
      title: "Resumen de Todos los Clientes",
      waveAppsButton: "Wave Apps",
      refreshButton: "Actualizar Todo",
      loading: "Cargando...",
    },
  },

  // Reportes
  reporting: {
    title: "Dashboard de Operaciones",
    clientTitle: "Sus Reportes",
    refreshReports: "Actualizar Reportes",
    loadingReports: "Cargando sus reportes...",
    errorLoading: "Error al cargar reportes",
    noReports: "No hay reportes disponibles",
    noReportsMessage: "Los reportes aparecerán aquí cuando sean subidos por nuestro equipo",
    noReportsInFolder: "No se encontraron reportes en esta carpeta",
    downloadStarted: "Descarga iniciada",
    downloadFailed: "Error al descargar el reporte",
    generatingLink: "Generando enlace de descarga...",
  },

  // Páginas de Error
  errors: {
    notFound: {
      code: "404",
      title: "Página No Encontrada",
      description: "La página que está buscando no existe o ha sido movida.",
      goHome: "Ir al Inicio",
    },
  },

  // Base de Conocimientos
  knowledgeBase: {
    title: "Base de Conocimientos",
    description: "Explore y administre artículos de la base de conocimientos",
    comingSoon: "Módulo de Base de Conocimientos",
    comingSoonDescription: "Este módulo incluirá gestión de artículos, funcionalidad de búsqueda y herramientas de creación de contenido.",
    phase: "Próximamente en Fase 5",
  },
};
