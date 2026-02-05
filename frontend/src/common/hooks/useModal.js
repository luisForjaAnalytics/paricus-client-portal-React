import { useState, useCallback } from "react";

/**
 * Generic hook for modal/dialog state management.
 * Manages a selected item and open/close state in a single call.
 *
 * @returns {{ isOpen: boolean, data: any, open: (item: any) => void, close: () => void }}
 *
 * @example
 * const imageModal = useModal();
 * // Open:  imageModal.open(attachment)
 * // Close: imageModal.close()
 * // Dialog: <Dialog open={imageModal.isOpen} onClose={imageModal.close}>
 * // Data:  imageModal.data?.fileName
 */
export const useModal = () => {
  const [data, setData] = useState(null);

  const open = useCallback((item = true) => {
    setData(item);
  }, []);

  const close = useCallback(() => {
    setData(null);
  }, []);

  return {
    isOpen: !!data,
    data,
    open,
    close,
  };
};
