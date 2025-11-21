import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { usePermissions } from '../../hooks/usePermissions';
import { Box, Typography, Button } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';

/**
 * Componente para proteger rutas con autenticación y permisos
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente hijo a renderizar si tiene acceso
 * @param {string} props.requiredPermission - Permiso requerido (opcional)
 * @param {string[]} props.requiredPermissions - Array de permisos requeridos (todos necesarios)
 * @param {string[]} props.anyPermissions - Array de permisos (al menos uno necesario)
 * @param {string} props.redirectTo - Ruta de redirección si no tiene acceso
 */
export const ProtectedRoute = ({
  children,
  requiredPermission,
  requiredPermissions = [],
  anyPermissions = [],
  redirectTo = '/login',
}) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissions();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Verificar permiso único
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <UnauthorizedView />;
  }

  // Verificar múltiples permisos (todos requeridos)
  if (requiredPermissions.length > 0 && !hasAllPermissions(requiredPermissions)) {
    return <UnauthorizedView />;
  }

  // Verificar al menos un permiso
  if (anyPermissions.length > 0 && !hasAnyPermission(anyPermissions)) {
    return <UnauthorizedView />;
  }

  // Usuario tiene acceso
  return children;
};

/**
 * Vista que se muestra cuando el usuario no tiene permisos
 */
const UnauthorizedView = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        p: 3,
      }}
    >
      <LockIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Acceso Denegado
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        No tienes permisos suficientes para acceder a esta página.
      </Typography>
      <Button variant="contained" href="/dashboard">
        Volver al Dashboard
      </Button>
    </Box>
  );
};
