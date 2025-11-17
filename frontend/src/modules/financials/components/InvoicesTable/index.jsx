import React from "react";
import { useBreakpoint } from "../../../../common/hooks/useBreakpoint";
import { InvoicesTableDesktop } from "./InvoicesTableDesktop";
import { InvoicesTableMobile } from "./InvoicesTableMobile";

/**
 * Componente unificado InvoicesTable que renderiza la versión
 * móvil o desktop según el breakpoint actual.
 */
export const InvoicesTable = (props) => {
  const { isMobile } = useBreakpoint();

  return isMobile ? (
    <InvoicesTableMobile {...props} />
  ) : (
    <InvoicesTableDesktop {...props} />
  );
};

// Re-export otros componentes del módulo
export { PendingLinkModal } from "./PendingLinkModal";
