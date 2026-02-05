import { useRef, useCallback } from "react";

/**
 * Hook for managing snackbar notifications via AlertInline ref.
 * Eliminates the repeated pattern of useRef + wrapper functions.
 *
 * @returns {Object} Notification utilities
 * @returns {Object} notificationRef - Ref to attach to <AlertInline asSnackbar />
 * @returns {Function} showSuccess - Show success notification
 * @returns {Function} showError - Show error notification
 * @returns {Function} showWarning - Show warning notification
 * @returns {Function} showInfo - Show info notification
 * @returns {Function} showNotification - Show notification with explicit severity
 *
 * @example
 * import { useNotification } from "../../common/hooks";
 * import { AlertInline } from "../../common/components/ui/AlertInline";
 *
 * function MyComponent() {
 *   const { notificationRef, showSuccess, showError } = useNotification();
 *
 *   const handleSave = async () => {
 *     try {
 *       await saveMutation(data).unwrap();
 *       showSuccess("Saved successfully");
 *     } catch (error) {
 *       showError(extractApiError(error, "Failed to save"));
 *     }
 *   };
 *
 *   return (
 *     <>
 *       {/* content *\/}
 *       <AlertInline ref={notificationRef} asSnackbar />
 *     </>
 *   );
 * }
 */
export const useNotification = () => {
  const ref = useRef();

  const showSuccess = useCallback((msg) => {
    ref.current?.showSuccess(msg);
  }, []);

  const showError = useCallback((msg) => {
    ref.current?.showError(msg);
  }, []);

  const showWarning = useCallback((msg) => {
    ref.current?.showWarning(msg);
  }, []);

  const showInfo = useCallback((msg) => {
    ref.current?.showInfo(msg);
  }, []);

  /**
   * Show a notification with explicit severity.
   * @param {string} message - The notification message
   * @param {"success"|"error"|"warning"|"info"} severity - The notification type
   */
  const showNotification = useCallback((message, severity = "success") => {
    const methods = {
      success: "showSuccess",
      error: "showError",
      warning: "showWarning",
      info: "showInfo",
    };
    ref.current?.[methods[severity] || "showInfo"]?.(message);
  }, []);

  return {
    notificationRef: ref,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showNotification,
  };
};
