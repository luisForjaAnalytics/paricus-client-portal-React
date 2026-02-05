/**
 * Centralized formatting utilities.
 */

export const formatDate = (dateString, locale, options) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString(locale, options);
  } catch (err) {
    console.error(`ERROR formatDate: ${err}`);
    return "N/A";
  }
};

export const formatDateTime = (dateString, locale = "en-US") => {
  if (!dateString) return "N/A";
  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  } catch (err) {
    console.error(`ERROR formatDateTime: ${err}`);
    return "N/A";
  }
};

export const formatTimestamp = (dateString, locale = "en-US") => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleString(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch (err) {
    console.error(`ERROR formatTimestamp: ${err}`);
    return dateString || "N/A";
  }
};

export const formatFileSize = (bytes, labels) => {
  try {
    const sizes = labels || ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return `0 ${sizes[0]}`;
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  } catch (err) {
    console.error(`ERROR formatFileSize: ${err}`);
    return `0 ${(labels || ["Bytes"])[0]}`;
  }
};

export const formatCurrency = (amount, currency = "USD") => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  } catch (err) {
    console.error(`ERROR formatCurrency: ${err}`);
    return `$${amount}`;
  }
};

export const capitalizeFirst = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const slugToTitle = (slug, separator = "-") => {
  if (!slug) return "";
  return slug
    .split(separator)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
