import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  TextField,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import { useTranslation } from "react-i18next";
import {
  useAddTicketDescriptionMutation,
  useGetTicketQuery,
} from "../../../../store/api/ticketsApi";
import { formatDateTime } from "../../../../common/utils/formatDateTime";
import { colors, typography } from "../../../../common/styles/styles";

export const TicketViewDetails = () => {
  const { t } = useTranslation();
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");

  // Fetch ticket data
  const {
    data: ticket,
    isLoading,
    error,
  } = useGetTicketQuery(ticketId, {
    skip: !ticketId,
  });

  // Add comment mutation
  const [addComment, { isLoading: isAddingComment }] =
    useAddTicketDescriptionMutation();

  // Handle back navigation
  const handleBack = () => {
    navigate("/app/tickets");
  };

  // Handle add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await addComment({
        id: ticketId,
        description: newComment,
      }).unwrap();
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return { bgcolor: "#ffebee", color: "#c62828" };
      case "medium":
        return { bgcolor: "#fff3e0", color: "#e65100" };
      case "low":
        return { bgcolor: "#e3f2fd", color: "#1565c0" };
      default:
        return { bgcolor: "#f5f5f5", color: "#757575" };
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return { bgcolor: "#e3f2fd", color: "#1976d2" };
      case "in progress":
        return { bgcolor: "#fff3e0", color: "#f57c00" };
      case "resolved":
        return { bgcolor: "#e8f5e9", color: "#388e3c" };
      case "closed":
        return { bgcolor: "#f5f5f5", color: "#616161" };
      default:
        return { bgcolor: "#f5f5f5", color: "#757575" };
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        //justifyContent: "flex-end",
        marginBottom: 1,
        marginRight: 2,
        gap: 1,
      }}
    >
      data...
    </Box>
  );
};
