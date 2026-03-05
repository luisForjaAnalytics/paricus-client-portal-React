import { logger } from "./logger";

export const getInitials = (name = "") => {
  try {
    const companyName = name.trim().split(" ");
    const firstInitial = companyName[0]?.[0] || "";
    const lastInitial = companyName[companyName.length - 1]?.[0] || "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  } catch (err) {
    logger.error(`ERROR: ${err}`);
    return "";
  }
};