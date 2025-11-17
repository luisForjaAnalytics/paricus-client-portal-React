import React from "react";
import { useBreakpoint } from "../../../../common/hooks/useBreakpoint";
import { ClientsTabDesktop } from "./ClientsTabDesktop";
import { ClientsTabMobile } from "./ClientsTabMobile";

/**
 * Componente unificado ClientsTab que renderiza la versión
 * móvil o desktop según el breakpoint actual.
 */
export const ClientsTab = (props) => {
  const { isMobile } = useBreakpoint();

  return isMobile ? <ClientsTabMobile {...props} /> : <ClientsTabDesktop {...props} />;
};
