/**
 * Extract a user-friendly error message from an RTK Query error response.
 * Normalizes the various error response formats from the backend.
 *
 * @param {Object} error - The error object from RTK Query's .unwrap() rejection
 * @param {string} [fallbackMessage] - Fallback message if no error message is found
 * @returns {string} The extracted error message
 *
 * @example
 * try {
 *   await mutation(data).unwrap();
 * } catch (error) {
 *   const message = extractApiError(error, t("fallback.key"));
 *   showNotification("error", message);
 * }
 */
export const extractApiError = (error, fallbackMessage = "An error occurred") => {
  return (
    error?.data?.error ||
    error?.data?.message ||
    error?.data?.errors?.map((e) => e.msg).join(", ") ||
    error?.message ||
    fallbackMessage
  );
};
