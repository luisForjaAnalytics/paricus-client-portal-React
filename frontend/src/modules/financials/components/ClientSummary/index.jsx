import React from "react";
import { useBreakpoint } from "../../../../common/hooks/useBreakpoint";
import { ClientSummaryDesktop } from "./ClientSummaryDesktop";
import { ClientSummaryMobile } from "./ClientSummaryMobile";

/**
 * Componente unificado ClientSummary que renderiza la versión
 * móvil o desktop según el breakpoint actual.
 * Elimina la necesidad de tener archivos duplicados.
 */
export const ClientSummary = (props) => {
  const { isMobile } = useBreakpoint();

  return isMobile ? (
    <ClientSummaryMobile {...props} />
  ) : (
    <ClientSummaryDesktop {...props} />
  );
};
