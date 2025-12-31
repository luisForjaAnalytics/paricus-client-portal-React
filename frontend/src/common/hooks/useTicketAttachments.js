import { useState } from "react";
import {
  useUploadTicketAttachmentMutation,
  useDeleteTicketAttachmentMutation,
  useLazyGetAttachmentUrlQuery,
} from "../../store/api/ticketsApi";

export const useTicketAttachments = (ticketId) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [uploadAttachment, { isLoading: isUploading }] =
    useUploadTicketAttachmentMutation();
  const [deleteAttachment, { isLoading: isDeleting }] =
    useDeleteTicketAttachmentMutation();
  const [getAttachmentUrl] = useLazyGetAttachmentUrlQuery();

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Only image files (JPEG, PNG, GIF, WEBP) are allowed");
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size must be less than 10MB");
      return;
    }

    try {
      await uploadAttachment({
        ticketId,
        file,
      }).unwrap();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
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

      // The response might be the URL directly or wrapped in an object
      const url = typeof response === 'string' ? response : response.url;

      if (!url) {
        throw new Error('No URL returned from server');
      }

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
