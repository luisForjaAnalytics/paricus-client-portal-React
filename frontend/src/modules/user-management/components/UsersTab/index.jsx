import React from "react";
import { useBreakpoint } from "../../../../common/hooks/useBreakpoint";
import { UsersTabDesktop } from "./UsersTabDesktop";
import { UsersTabMobile } from "./UsersTabMobile";

/**
 * Componente unificado UsersTab que renderiza la versión
 * móvil o desktop según el breakpoint actual.
 */
export const UsersTab = (props) => {
  const { isMobile } = useBreakpoint();

  return isMobile ? <UsersTabMobile {...props} /> : <UsersTabDesktop {...props} />;
};
