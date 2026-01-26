import { useMemo, useState, useRef } from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  useGetChangeRequestsQuery,
  useApproveChangeRequestMutation,
  useRejectChangeRequestMutation,
} from "../../../../store/api/ticketsApi";
import {
  UniversalDataGrid,
  useDataGridColumns,
} from "../../../../common/components/ui/DataGrid/UniversalDataGrid";
import { formatDateTime } from "../../../../common/utils/formatDateTime";
import { colors } from "../../../../common/styles/styles";
import { CancelButton } from "../../../../common/components/ui/CancelButton/CancelButton";
import { SuccessErrorSnackbar } from "../../../../common/components/ui/SuccessErrorSnackbar/SuccessErrorSnackbar";

export const TicketsCenter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    data: changeRequests = [],
    isLoading,
    isError,
  } = useGetChangeRequestsQuery(undefined, {
    refetchOnMountOrArgChange: true, // Always fetch fresh data when component mounts
  });
  const [approveChangeRequest, { isLoading: isApproving }] =
    useApproveChangeRequestMutation();
  const [rejectChangeRequest, { isLoading: isRejecting }] =
    useRejectChangeRequestMutation();

  // State for reject dialog
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Snackbar ref for notifications
  const snackbarRef = useRef();

  // Transform data for DataGrid
  const rows = useMemo(() => {
    try {
      return changeRequests.map((request) => ({
        id: request.id,
        ticketId: request.ticket?.id || "",
        subject: request.ticket?.subject || "",
        requestedBy: request.requestedBy
          ? `${request.requestedBy.firstName} ${request.requestedBy.lastName}`
          : "Unknown",
        // Current values
        currentStatus: request.currentStatus,
        currentPriority: request.currentPriority,
        currentAssignedTo: request.ticket?.assignedTo
          ? `${request.ticket.assignedTo.firstName} ${request.ticket.assignedTo.lastName}`
          : "Unassigned",
        // Requested values
        requestedStatus: request.requestedStatus,
        requestedPriority: request.requestedPriority,
        requestedAssignedTo: request.requestedAssignedTo
          ? `${request.requestedAssignedTo.firstName} ${request.requestedAssignedTo.lastName}`
          : null,
        createdAt: request.createdAt,
        // Keep full request for actions
        _request: request,
      }));
    } catch (error) {
      console.error("Error transforming change request data:", error);
      return [];
    }
  }, [changeRequests]);

  // Handle approve
  const handleApprove = async (request) => {
    try {
      await approveChangeRequest(request.id).unwrap();
      snackbarRef.current?.showSuccess(
        t("tickets.changeRequests.approveSuccess") ||
          "Change request approved successfully"
      );
    } catch (error) {
      console.error("Error approving change request:", error);
      snackbarRef.current?.showError(
        error?.data?.error ||
          t("tickets.changeRequests.approveError") ||
          "Failed to approve change request"
      );
    }
  };

  // Handle reject dialog open
  const handleRejectClick = (request) => {
    setSelectedRequest(request);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  // Handle reject confirm
  const handleRejectConfirm = async () => {
    if (!selectedRequest) return;

    try {
      await rejectChangeRequest({
        changeRequestId: selectedRequest.id,
        rejectionReason: rejectionReason || null,
      }).unwrap();
      snackbarRef.current?.showSuccess(
        t("tickets.changeRequests.rejectSuccess") || "Change request rejected"
      );
      setRejectDialogOpen(false);
      setSelectedRequest(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Error rejecting change request:", error);
      snackbarRef.current?.showError(
        error?.data?.error ||
          t("tickets.changeRequests.rejectError") ||
          "Failed to reject change request"
      );
    }
  };

  // Helper to render change cell with arrow
  const renderChangeCell = (current, requested, type) => {
    if (!requested) return null;

    const getChipColor = (value, type) => {
      if (type === "priority") {
        switch (value?.toLowerCase()) {
          case "high":
            return { bg: "#ffebee", color: "#c62828" };
          case "medium":
            return { bg: "#fff3e0", color: "#e65100" };
          case "low":
            return { bg: "#e3f2fd", color: "#1565c0" };
          default:
            return { bg: "#f5f5f5", color: "#757575" };
        }
      }
      if (type === "status") {
        switch (value?.toLowerCase()) {
          case "open":
            return { bg: "#e3f2fd", color: "#1565c0" };
          case "in progress":
            return { bg: "#fff3e0", color: "#e65100" };
          case "resolved":
            return { bg: "#e8f5e9", color: "#2e7d32" };
          case "closed":
            return { bg: "#f5f5f5", color: "#616161" };
          default:
            return { bg: "#f5f5f5", color: "#757575" };
        }
      }
      return { bg: "#f5f5f5", color: "#616161" };
    };

    const currentColors = getChipColor(current, type);
    const requestedColors = getChipColor(requested, type);

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          justifyContent: "center",
          marginTop: "0.6rem",
          px: type === "assignedTo" ? 1 : 4,
        }}
      >
        <Chip
          label={current || "N/A"}
          size="small"
          sx={{
            backgroundColor: currentColors.bg,
            color: currentColors.color,
            fontSize: "0.75rem",
            flex: 1,
          }}
        />
        <ArrowRightAltIcon
          sx={{ fontSize: "1.5rem", color: colors.primary, flex: 1 }}
        />
        <Chip
          label={requested}
          size="small"
          sx={{
            backgroundColor: requestedColors.bg,
            color: requestedColors.color,
            fontSize: "0.75rem",
            fontWeight: "bold",
            flex: 1,
          }}
        />
      </Box>
    );
  };

  // DataGrid columns
  const columns = useDataGridColumns([
    {
      field: "ticketId",
      headerName: t("tickets.changeRequests.ticketId") || "Ticket ID",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            marginTop: "0.6rem",
            color: colors.primary,
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/app/tickets/ticketTable/${params.value}`);
          }}
        >
          {params.value?.substring(0, 8)}...
        </Typography>
      ),
    },
    {
      field: "subject",
      headerName: t("tickets.table.subject") || "Subject",
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: "requestedBy",
      headerName: t("tickets.changeRequests.requestedBy") || "Requested By",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "statusChange",
      headerName: t("tickets.changeRequests.statusChange") || "Status Change",
      flex: 1.5,
      minWidth: 200,
      sortable: false,
      renderCell: (params) => {
        const row = params.row;
        if (!row.requestedStatus)
          return (
            <Typography variant="body2" color="text.secondary">
              -
            </Typography>
          );
        return renderChangeCell(
          row.currentStatus,
          row.requestedStatus,
          "status"
        );
      },
    },
    {
      field: "priorityChange",
      headerName:
        t("tickets.changeRequests.priorityChange") || "Priority Change",
      flex: 1.5,
      minWidth: 200,
      sortable: false,
      renderCell: (params) => {
        const row = params.row;
        if (!row.requestedPriority)
          return (
            <Typography variant="body2" color="text.secondary">
              -
            </Typography>
          );
        return renderChangeCell(
          row.currentPriority,
          row.requestedPriority,
          "priority"
        );
      },
    },
    {
      field: "assignedToChange",
      headerName:
        t("tickets.changeRequests.assignedToChange") || "Assigned To Change",
      flex: 1.5,
      minWidth: 200,
      sortable: false,
      renderCell: (params) => {
        const row = params.row;
        if (!row.requestedAssignedTo)
          return (
            <Typography variant="body2" color="text.secondary">
              -
            </Typography>
          );
        return renderChangeCell(
          row.currentAssignedTo,
          row.requestedAssignedTo,
          "assignedTo"
        );
      },
    },
    {
      field: "createdAt",
      headerName: t("tickets.changeRequests.requestedAt") || "Requested At",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => formatDateTime(params.value),
    },
    {
      field: "actions",
      headerName: t("common.actions") || "Actions",
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            justifyContent: "center",
            marginTop: "0.6rem",
          }}
        >
          <Tooltip title={t("tickets.changeRequests.approve") || "Approve"}>
            <IconButton
              size="small"
              // color="success"
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(params.row._request);
              }}
              disabled={isApproving || isRejecting}
              sx={{
                color: colors.successBorder,
              }}
            >
              <CheckCircleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("tickets.changeRequests.reject") || "Reject"}>
            <IconButton
              size="small"
              // color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleRejectClick(params.row._request);
              }}
              disabled={isApproving || isRejecting}
              sx={{
                color: colors.errorBorder,
              }}
            >
              <CancelIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]);

  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      {/* DataGrid */}
      <UniversalDataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        error={
          isError
            ? t("tickets.changeRequests.loadError") ||
              "Error loading change requests"
            : null
        }
        emptyMessage={
          t("tickets.changeRequests.noRequests") || "No pending change requests"
        }
        autoHeight={true}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick={true}
        sx={{
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
      />

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {t("tickets.changeRequests.rejectTitle") || "Reject Change Request"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {t("tickets.changeRequests.rejectMessage") ||
              "Are you sure you want to reject this change request? You can optionally provide a reason."}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={
              t("tickets.changeRequests.rejectionReason") ||
              "Rejection Reason (Optional)"
            }
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder={
              t("tickets.changeRequests.rejectionReasonPlaceholder") ||
              "Enter reason for rejection..."
            }
          />
        </DialogContent>
        <DialogActions>
          <CancelButton
            handleClick={() => setRejectDialogOpen(false)}
            disabled={isRejecting}
            text={t("common.cancel") || "Cancel"}
          />
          <Button
            onClick={handleRejectConfirm}
            color="error"
            variant="contained"
            disabled={isRejecting}
          >
            {isRejecting
              ? t("common.loading") || "Loading..."
              : t("tickets.changeRequests.reject") || "Reject"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <SuccessErrorSnackbar ref={snackbarRef} />
    </Box>
  );
};
