import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * Hook para manejar breakpoints responsivos de Material-UI
 * Reemplaza la necesidad de tener componentes duplicados (*Movil.jsx)
 *
 * @returns {Object} Objeto con banderas booleanas para cada breakpoint
 * @example
 * const { isMobile, isTablet, isDesktop } = useBreakpoint();
 * return isMobile ? <MobileView /> : <DesktopView />;
 */
export const useBreakpoint = () => {
  const theme = useTheme();

  // Mobile: < 768px (sm)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Tablet: 768px - 1024px (md - lg)
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // Desktop: > 1024px (lg)
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  // Extra small: < 600px (xs)
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  // Small: 600px - 768px (sm)
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Medium: 768px - 1024px (md)
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // Large: 1024px - 1440px (lg)
  const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl'));

  // Extra large: > 1440px (xl)
  const isXl = useMediaQuery(theme.breakpoints.up('xl'));

  return {
    // Breakpoints simples
    isMobile,
    isTablet,
    isDesktop,

    // Breakpoints específicos de MUI
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,

    // Helper para obtener el breakpoint actual como string
    current: isXs ? 'xs' : isSm ? 'sm' : isMd ? 'md' : isLg ? 'lg' : 'xl',
  };
};
