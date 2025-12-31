export const formatDateTime = (dateString) => {
  try {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (err) {
    console.error(`ERROR: formatDateTime - ${err.message}`, err);
    return "N/A";
  }
};
