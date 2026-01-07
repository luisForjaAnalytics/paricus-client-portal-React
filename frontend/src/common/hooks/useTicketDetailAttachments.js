import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useUploadDetailAttachmentMutation,
  useDeleteDetailAttachmentMutation,
  useLazyGetDetailAttachmentUrlQuery,
} from "../../store/api/ticketsApi";

export const useTicketDetailAttachments = (ticketId, detailId) => {
  const { t } = useTranslation();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [uploadAttachment, { isLoading: isUploading }] =
    useUploadDetailAttachmentMutation();
  const [deleteAttachment, { isLoading: isDeleting }] =
    useDeleteDetailAttachmentMutation();
  const [getAttachmentUrl] = useLazyGetDetailAttachmentUrlQuery();

  // Calculate total size of selected files
  const getTotalSelectedSize = () => {
    return selectedFiles.reduce((total, file) => total + file.size, 0);
  };

  // For collecting files before detail is created
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

    // Validate total size (5MB max for all files combined)
    const MAX_TOTAL_SIZE = 5 * 1024 * 1024; // 5MB
    const currentTotalSize = getTotalSelectedSize();
    const newTotalSize = currentTotalSize + file.size;

    if (newTotalSize > MAX_TOTAL_SIZE) {
      const remainingMB = ((MAX_TOTAL_SIZE - currentTotalSize) / (1024 * 1024)).toFixed(2);
      alert(
        t("tickets.attachments.totalSizeExceeded", { remaining: remainingMB }) ||
        `Total attachment size cannot exceed 5MB. You have ${remainingMB}MB remaining.`
      );
      return;
    }

    // Add to selected files list
    setSelectedFiles((prev) => [...prev, file]);

    // Reset input
    event.target.value = "";
  };

  // Upload all selected files after detail is created
  const uploadAllFiles = async (detailId) => {
    console.log('🔍 uploadAllFiles called with:', { ticketId, detailId, filesCount: selectedFiles.length });

    if (!ticketId || !detailId || selectedFiles.length === 0) {
      console.log('⚠️ Validation failed:', { ticketId, detailId, filesCount: selectedFiles.length });
      return;
    }

    const uploadPromises = selectedFiles.map((file) => {
      console.log('📤 Uploading file:', file.name);
      return uploadAttachment({
        ticketId,
        detailId,
        file,
      }).unwrap();
    });

    try {
      const results = await Promise.all(uploadPromises);
      console.log('✅ All uploads successful:', results);
      setSelectedFiles([]); // Clear after successful upload
    } catch (error) {
      console.error('❌ Upload failed:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        data: error.data
      });
      throw error;
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setSelectedFiles([]);
  };

  const handleDelete = async (attachmentId) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await deleteAttachment({
        ticketId,
        detailId,
        attachmentId,
      }).unwrap();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    }
  };

  const handleImageClick = async (attachment) => {
    try {
      console.log('Loading detail image:', { ticketId, detailId, attachmentId: attachment.id });

      const response = await getAttachmentUrl({
        ticketId,
        detailId,
        attachmentId: attachment.id,
      }).unwrap();

      console.log('Detail image URL response:', response);

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

      console.log('Final detail image URL:', url);

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
    selectedFiles,
    isUploading,
    isDeleting,
    selectedImage,
    imageUrl,
    openDialog,
    handleFileSelect,
    uploadAllFiles,
    removeFile,
    clearFiles,
    handleDelete,
    handleImageClick,
    handleCloseDialog,
  };
};
