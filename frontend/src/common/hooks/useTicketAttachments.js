import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useUploadTicketAttachmentMutation,
  useDeleteTicketAttachmentMutation,
  useLazyGetAttachmentUrlQuery,
} from "../../store/api/ticketsApi";

export const useTicketAttachments = (ticketId, existingAttachments = []) => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [uploadAttachment, { isLoading: isUploading }] =
    useUploadTicketAttachmentMutation();
  const [deleteAttachment, { isLoading: isDeleting }] =
    useDeleteTicketAttachmentMutation();
  const [getAttachmentUrl] = useLazyGetAttachmentUrlQuery();

  // Calculate total size of existing attachments
  const getTotalAttachmentsSize = () => {
    return existingAttachments.reduce((total, att) => total + (att.fileSize || 0), 0);
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type - now includes PDFs and Office documents
    const allowedTypes = [
      // Images
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      // PDFs
      "application/pdf",
      // Word documents
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      // Excel spreadsheets
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      // PowerPoint presentations
      "application/vnd.ms-powerpoint", // .ppt
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        t("tickets.attachments.invalidFileType") ||
        "Only images, PDFs, and Office documents (Word, Excel, PowerPoint) are allowed"
      );
      return;
    }

    // Validate total size (5MB max for all attachments combined)
    const MAX_TOTAL_SIZE = 5 * 1024 * 1024; // 5MB
    const currentTotalSize = getTotalAttachmentsSize();
    const newTotalSize = currentTotalSize + file.size;

    if (newTotalSize > MAX_TOTAL_SIZE) {
      const remainingMB = ((MAX_TOTAL_SIZE - currentTotalSize) / (1024 * 1024)).toFixed(2);
      alert(
        t("tickets.attachments.totalSizeExceeded", { remaining: remainingMB }) ||
        `Total attachment size cannot exceed 5MB. You have ${remainingMB}MB remaining.`
      );
      return;
    }

    try {
      await uploadAttachment({
        ticketId,
        file,
      }).unwrap();
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMsg = error?.data?.error || error?.message || "Failed to upload file";
      alert(errorMsg);
    }

    // Reset input
    event.target.value = "";
  };

  const handleDelete = async (attachmentId) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await deleteAttachment({
        ticketId,
        attachmentId,
      }).unwrap();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    }
  };

  const handleImageClick = async (attachment) => {
    try {
      console.log('Loading image:', { ticketId, attachmentId: attachment.id });

      const response = await getAttachmentUrl({
        ticketId,
        attachmentId: attachment.id,
      }).unwrap();

      console.log('Image URL response:', response);

      // The response is the URL string (transformed by RTK Query)
      let url = response;

      if (!url) {
        throw new Error('No URL returned from server');
      }

      // If it's a relative URL, convert to absolute
      if (url.startsWith('/api/')) {
        const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
        url = `${baseUrl}${url}`;
      }

      console.log('Final image URL:', url);

      setImageUrl(url);
      setSelectedImage(attachment);
      setOpenDialog(true);
    } catch (error) {
      console.error("Error loading image:", error);
      const errorMessage = error?.data?.error || error?.message || "Failed to load image";
      alert(errorMessage);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImage(null);
    setImageUrl(null);
  };

  return {
    isUploading,
    isDeleting,
    selectedImage,
    imageUrl,
    openDialog,
    handleFileSelect,
    handleDelete,
    handleImageClick,
    handleCloseDialog,
  };
};
