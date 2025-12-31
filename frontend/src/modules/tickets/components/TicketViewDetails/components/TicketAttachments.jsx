import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Alert,
  Dialog,
  DialogContent,
  DialogActions,
  Skeleton,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Close as CloseIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useTicketAttachments } from "../../../../../common/hooks/useTicketAttachments";
import { useLazyGetAttachmentUrlQuery } from "../../../../../store/api/ticketsApi";

const AttachmentThumbnail = ({ attachment, ticketId }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [getUrl] = useLazyGetAttachmentUrlQuery();

  useEffect(() => {
    const loadThumbnail = async () => {
      try {
        const response = await getUrl({
          ticketId,
          attachmentId: attachment.id,
        }).unwrap();

        const url = typeof response === 'string' ? response : response.url;
        setThumbnailUrl(url);
        setLoading(false);
      } catch (err) {
        console.error('Error loading thumbnail:', err);
        setError(true);
        setLoading(false);
      }
    };

    loadThumbnail();
  }, [attachment.id, ticketId, getUrl]);

  if (loading) {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        height={180}
        sx={{ borderRadius: 1 }}
      />
    );
  }

  if (error || !thumbnailUrl) {
    return (
      <Box
        sx={{
          width: "100%",
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
          borderRadius: 1,
        }}
      >
        <ImageIcon sx={{ fontSize: 60, color: "#999" }} />
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={thumbnailUrl}
      alt={attachment.fileName}
      sx={{
        width: "100%",
        height: 180,
        objectFit: "cover",
        borderRadius: 1,
      }}
      onError={() => setError(true)}
    />
  );
};

export const TicketAttachments = ({ ticket }) => {
  const {
    isDeleting,
    selectedImage,
    imageUrl,
    openDialog,
    handleDelete,
    handleImageClick,
    handleCloseDialog,
  } = useTicketAttachments(ticket?.id);

  const attachments = ticket?.attachments || [];

  return (
    <>
      {attachments.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No attachments yet. Upload an image to get started.
        </Alert>
      ) : (
        <ImageList
          sx={{ width: "100%", maxHeight: 400 }}
          cols={3}
          rowHeight={180}
          gap={8}
        >
          {attachments.map((attachment) => (
            <ImageListItem
              key={attachment.id}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
              onClick={() => handleImageClick(attachment)}
            >
              <AttachmentThumbnail
                attachment={attachment}
                ticketId={ticket.id}
              />
              <ImageListItemBar
                title={attachment.fileName}
                subtitle={`${(attachment.fileSize / 1024).toFixed(1)} KB`}
                actionIcon={
                  <IconButton
                    sx={{ color: "white" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(attachment.id);
                    }}
                    disabled={isDeleting}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}

      {/* Image Preview Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogActions sx={{ p: 1 }}>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent sx={{ p: 0 }}>
          {imageUrl && (
            <Box
              component="img"
              src={imageUrl}
              alt={selectedImage?.fileName}
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
