import React from "react";
import { useBreakpoint } from "../../../../common/hooks/useBreakpoint";
import { QuickFiltersDesktop } from "./QuickFiltersDesktop";
import { QuickFiltersMobile } from "./QuickFiltersMobile";

/**
 * Componente unificado QuickFilters que renderiza la versión
 * móvil o desktop según el breakpoint actual.
 */
export const QuickFilters = (props) => {
  const { isMobile } = useBreakpoint();

  return isMobile ? (
    <QuickFiltersMobile {...props} />
  ) : (
    <QuickFiltersDesktop {...props} />
  );
};
