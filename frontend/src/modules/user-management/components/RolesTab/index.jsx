import React from "react";
import { useBreakpoint } from "../../../../common/hooks/useBreakpoint";
import { RolesTabDesktop } from "./RolesTabDesktop";
import { RolesTabMobile } from "./RolesTabMobile";

/**
 * Componente unificado RolesTab que renderiza la versión
 * móvil o desktop según el breakpoint actual.
 */
export const RolesTab = (props) => {
  const { isMobile } = useBreakpoint();

  return isMobile ? <RolesTabMobile {...props} /> : <RolesTabDesktop {...props} />;
};
