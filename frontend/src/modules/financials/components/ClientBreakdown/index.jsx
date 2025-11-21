import React from "react";
import { useBreakpoint } from "../../../../common/hooks/useBreakpoint";
import { ClientBreakdownDesktop } from "./ClientBreakdownDesktop";
import { ClientBreakdownMobile } from "./ClientBreakdownMobile";

/**
 * Componente unificado ClientBreakdown que renderiza la versión
 * móvil o desktop según el breakpoint actual.
 */
export const ClientBreakdown = (props) => {
  const { isMobile } = useBreakpoint();

  return isMobile ? (
    <ClientBreakdownMobile {...props} />
  ) : (
    <ClientBreakdownDesktop {...props} />
  );
};
