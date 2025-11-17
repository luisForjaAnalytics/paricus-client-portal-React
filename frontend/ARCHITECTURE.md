# Nueva Arquitectura del Frontend

## 🎯 Estructura Implementada: Screaming Architecture

La estructura del frontend ha sido reorganizada siguiendo el patrón **Screaming Architecture**, donde la organización grita el dominio de negocio de la aplicación.

---

## 📁 Estructura de Carpetas

```
frontend/src/
├── common/                      # Código compartido entre módulos
│   ├── components/
│   │   ├── ui/                 # Componentes UI reutilizables
│   │   │   └── TableItems.jsx
│   │   └── layout/             # Componentes de layout
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
│   ├── hooks/                  # Hooks compartidos
│   │   ├── index.js            # Barrel export
│   │   ├── useBreakpoint.js    # 🆕 Hook para responsive (elimina *Movil.jsx)
│   │   ├── usePermissions.js
│   │   └── useTesseractOCR.js
│   │
│   ├── styles/                 # Estilos globales
│   │   └── styles.js
│   │
│   └── utils/                  # Utilidades compartidas
│
├── modules/                    # Módulos de negocio (Feature-based)
│   ├── financials/
│   │   ├── components/
│   │   │   ├── ClientSummary/
│   │   │   │   ├── index.jsx               # 🆕 Wrapper unificado
│   │   │   │   ├── ClientSummaryDesktop.jsx
│   │   │   │   ├── ClientSummaryMobile.jsx
│   │   │   │   └── ClientSummaryCard.jsx
│   │   │   ├── ClientBreakdown/
│   │   │   │   ├── index.jsx               # 🆕 Wrapper unificado
│   │   │   │   ├── ClientBreakdownDesktop.jsx
│   │   │   │   └── ClientBreakdownMobile.jsx
│   │   │   ├── InvoicesTable/
│   │   │   │   ├── index.jsx               # 🆕 Wrapper unificado
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
│   │   │   │   ├── index.jsx               # 🆕 Wrapper unificado
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
│   │   │   │   ├── index.jsx               # 🆕 Wrapper unificado
│   │   │   │   ├── UsersTabDesktop.jsx
│   │   │   │   └── UsersTabMobile.jsx
│   │   │   ├── ClientsTab/
│   │   │   │   ├── index.jsx               # 🆕 Wrapper unificado
│   │   │   │   ├── ClientsTabDesktop.jsx
│   │   │   │   └── ClientsTabMobile.jsx
│   │   │   ├── RolesTab/
│   │   │   │   ├── index.jsx               # 🆕 Wrapper unificado
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
│   └── error/
│       ├── ErrorView.jsx
│       └── index.js
│
├── router/
│   ├── AppRouter.jsx           # 🔄 Actualizado con nuevos imports
│   └── components/
│       └── ProtectedRoute.jsx
│
├── store/
│   ├── api/                    # RTK Query API slices
│   ├── auth/
│   ├── helper/
│   └── store.js
│
├── i18n/
│
├── App.jsx
└── main.jsx
```

---

## 🚀 Mejoras Implementadas

### 1. **Eliminación de Duplicación Móvil**
**Antes:**
```jsx
// ❌ Dos archivos separados
ClientSummary.jsx
ClientSummaryMovil.jsx
```

**Después:**
```jsx
// ✅ Un solo wrapper + componentes específicos
ClientSummary/
├── index.jsx                 // Wrapper que usa useBreakpoint
├── ClientSummaryDesktop.jsx
└── ClientSummaryMobile.jsx
```

**Implementación:**
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

### 2. **Hook useBreakpoint Reutilizable**
```jsx
// common/hooks/useBreakpoint.js
export const useBreakpoint = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  // También incluye: isXs, isSm, isMd, isLg, isXl, current

  return { isMobile, isTablet, isDesktop, ... };
};
```

### 3. **Barrel Exports (Clean Imports)**
**Antes:**
```jsx
import { FinancialsView } from "../views/financials/FinancialsView";
import { ClientSummary } from "../views/financials/components/ClientSummary";
```

**Después:**
```jsx
import { FinancialsView, ClientSummary } from "../modules/financials";
```

### 4. **Organización por Dominio de Negocio**
- Cada módulo contiene TODO lo relacionado con esa funcionalidad
- Fácil encontrar código relacionado
- Facilita el trabajo en equipo (cada dev puede trabajar en un módulo)

---

## 📖 Guía de Uso

### Importar Hooks Comunes
```jsx
// ✅ Desde barrel export
import { useBreakpoint, usePermissions } from "@/common/hooks";

// ✅ Específico
import { useBreakpoint } from "@/common/hooks/useBreakpoint";
```

### Importar Componentes de Layout
```jsx
import { LayoutAccount, Login } from "@/common/components/layout";
import { AppBarLayout } from "@/common/components/layout/AppBar";
```

### Importar Módulos
```jsx
// Vista completa
import { FinancialsView } from "@/modules/financials";

// Componentes específicos
import { ClientSummary, InvoicesTable } from "@/modules/financials";
```

### Crear Componente Responsivo
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

## 🎯 Ventajas de la Nueva Estructura

### ✅ **DRY (Don't Repeat Yourself)**
- Sin archivos `*Movil.jsx` duplicados
- Hook `useBreakpoint` centralizado
- Barrel exports evitan imports largos

### ✅ **Screaming Architecture**
- Estructura grita el dominio: "financials", "user-management", "audio-recordings"
- Fácil saber qué hace la app con solo ver carpetas
- Nuevos devs entienden rápido el proyecto

### ✅ **Modularidad**
- Cada módulo es independiente
- Fácil mover o extraer módulos
- Preparado para microfrontends futuro

### ✅ **Mantenibilidad**
- Código relacionado está junto
- Cambios en un módulo no afectan otros
- Fácil hacer refactoring

### ✅ **Escalabilidad**
- Agregar nuevo módulo: copiar estructura existente
- Sin límite de crecimiento
- Patrones claros y consistentes

---

## 🔄 Cómo Agregar un Nuevo Módulo

```bash
# 1. Crear estructura
mkdir -p src/modules/nuevo-modulo/components

# 2. Crear vista principal
touch src/modules/nuevo-modulo/NuevoModuloView.jsx

# 3. Crear barrel export
cat > src/modules/nuevo-modulo/index.js << EOF
export { default as NuevoModuloView } from "./NuevoModuloView";
EOF

# 4. Agregar ruta en router
# src/router/AppRouter.jsx
import { NuevoModuloView } from "../modules/nuevo-modulo";
```

---

## 📚 Patrones de Código

### Componente Responsivo
```jsx
// modules/mi-modulo/components/MiComponente/index.jsx
import { useBreakpoint } from "@/common/hooks";
import { MiComponenteDesktop } from "./MiComponenteDesktop";
import { MiComponenteMobile } from "./MiComponenteMobile";

export const MiComponente = (props) => {
  const { isMobile } = useBreakpoint();
  return isMobile ?
    <MiComponenteMobile {...props} /> :
    <MiComponenteDesktop {...props} />;
};
```

### Barrel Export de Módulo
```jsx
// modules/mi-modulo/index.js
export { default as MiModuloView } from "./MiModuloView";
export { MiComponente } from "./components/MiComponente";
export { OtroComponente } from "./components/OtroComponente";
```

---

## 🛠️ Migración Completada

### ✅ Archivos Eliminados
- `src/views/` (completo)
- `src/layouts/` (completo)
- `src/hooks/` (completo)
- Todos los `*Movil.jsx` (reemplazados por wrappers)

### ✅ Archivos Migrados
- ✅ Componentes comunes → `common/components/`
- ✅ Hooks → `common/hooks/`
- ✅ Estilos → `common/styles/`
- ✅ Vistas → `modules/{nombre-modulo}/`
- ✅ Componentes de módulos → `modules/{nombre}/components/`

### ✅ Imports Actualizados
- ✅ Router (`AppRouter.jsx`)
- ✅ Todos los componentes migrados
- ✅ Rutas de estilos
- ✅ Rutas de hooks

---

## 📝 Notas Finales

- **Sin librerías adicionales**: Todo con React + MUI existente
- **Compatible con RTK Query**: No afecta el state management
- **Backward compatible**: Los componentes internos siguen funcionando igual
- **Preparado para alias**: Puedes configurar `@/` en vite.config.js

### Configurar Alias (Opcional)
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

Luego:
```jsx
import { useBreakpoint } from '@common/hooks';
import { FinancialsView } from '@modules/financials';
```

---

**Estructura implementada el:** 2025-11-17
**Patrón:** Screaming Architecture
**Estado:** ✅ Completado y funcional
