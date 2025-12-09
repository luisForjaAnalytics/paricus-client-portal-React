import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { usePermissions } from '../../common/hooks/usePermissions';

/**
 * Componente para proteger rutas con autenticación y permisos
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente hijo a renderizar si tiene acceso
 * @param {string} props.requiredPermission - Permiso requerido (opcional)
 * @param {string[]} props.requiredPermissions - Array de permisos requeridos (todos necesarios)
 * @param {string[]} props.anyPermissions - Array de permisos (al menos uno necesario)
 * @param {boolean} props.requireSuperAdmin - Requiere ser super admin (clientId === null)
 * @param {string} props.redirectTo - Ruta de redirección si no tiene acceso
 */
export const ProtectedRoute = ({
  children,
  requiredPermission,
  requiredPermissions = [],
  anyPermissions = [],
  requireSuperAdmin = false,
  redirectTo = '/login',
}) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissions();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Verificar si requiere ser super admin (BPO Administration)
  if (requireSuperAdmin && user?.clientName !== "BPO Administration") {
    return null;
  }

  // Verificar permiso único
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null;
  }

  // Verificar múltiples permisos (todos requeridos)
  if (requiredPermissions.length > 0 && !hasAllPermissions(requiredPermissions)) {
    return null;
  }

  // Verificar al menos un permiso
  if (anyPermissions.length > 0 && !hasAnyPermission(anyPermissions)) {
    return null;
  }

  // Usuario tiene acceso
  return children;
};
