import { useState, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  OutlinedInput,
  TextField,
} from "@mui/material";
import {
  AttachFile,
  Send,
  CheckBox,
  CheckBoxOutlineBlank,
  Campaign,
  Close,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { TiptapEditor } from "../../../../common/components/ui/TiptapEditor/TiptapEditor";
import { useGetClientsQuery } from "../../../../store/api/adminApi";
import { useCreateAnnouncementMutation } from "../../../../store/api/dashboardApi";
import { useSelector } from "react-redux";
import {
  dashboardStyles,
  colors,
  primaryIconButton,
  filterStyles,
} from "../../../../common/styles/styles";

export const QuickBroadcast = () => {
  const { t } = useTranslation();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectedClients, setSelectedClients] = useState([]);
  const [priority, setPriority] = useState("medium");
  const [attachments, setAttachments] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Get clients from API
  const { data: clients = [], isLoading: loadingClients } =
    useGetClientsQuery();

  // Create announcement mutation
  const [createAnnouncement, { isLoading: creatingAnnouncement }] =
    useCreateAnnouncementMutation();

  // Get current user permissions
  const permissions = useSelector((state) => state.auth.permissions);
  const isBPOAdmin = permissions.includes("admin_clients");

  // Handle select change
  const handleSelectChange = (event) => {
    const value = event.target.value;

    // Check if "Select All" was clicked
    if (value.includes("all")) {
      if (selectedClients.length === clients.length) {
        // If all are selected, deselect all
        setSelectedClients([]);
      } else {
        // Otherwise, select all
        setSelectedClients(clients.map((c) => c.id));
      }
    } else {
      setSelectedClients(value);
    }
  };

  // Handle file attachment
  const handleAttachFile = (event) => {
    const files = Array.from(event.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  // Handle remove attachment
  const handleRemoveAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle submit
  const handleSubmit = async () => {
    // Validation
    if (!subject.trim()) {
      setError(t("dashboard.quickBroadcast.emptySubject"));
      return;
    }

    const textContent = content.replace(/<[^>]*>/g, "").trim();
    if (!textContent) {
      setError(t("dashboard.quickBroadcast.emptyMessage"));
      return;
    }

    if (selectedClients.length === 0) {
      setError(t("dashboard.quickBroadcast.noClientsSelected"));
      return;
    }

    setError(null);
    setSending(true);

    try {
      // Call API to create announcement (without attachments field)
      const result = await createAnnouncement({
        title: subject.trim(),
        content,
        priority,
        clientIds: selectedClients,
      }).unwrap();

      // Upload attachments if any
      if (attachments.length > 0 && result.data?.id) {
        const token = localStorage.getItem("token");

        for (const file of attachments) {
          const formData = new FormData();
          formData.append("file", file);

          try {
            await fetch(
              `${import.meta.env.VITE_API_URL}/dashboard/announcements/${
                result.data.id
              }/attachments`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: formData,
              }
            );
          } catch (uploadErr) {
            console.error("Error uploading attachment:", uploadErr);
            // Continue with other files even if one fails
          }
        }
      }

      setSuccess(true);
      setSubject("");
      setContent("");
      setSelectedClients([]);
      setPriority("medium");
      setAttachments([]);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error creating announcement:", err);
      setError(err?.data?.error || t("dashboard.quickBroadcast.error"));
    } finally {
      setSending(false);
    }
  };

  // Attach file button component
  const attachFileButton = (
    <IconButton
      size="small"
      component="label"
      sx={{
        padding: "4px",
        minWidth: "28px",
        minHeight: "28px",
      }}
    >
      <AttachFile fontSize="small" />
      <input
        type="file"
        hidden
        multiple
        onChange={handleAttachFile}
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
      />
    </IconButton>
  );

  return (
    <Card
      sx={{
        ...dashboardStyles.quickBroadcastCard,
        minWidth: { xs: "100%", md: "400px" },
      }}
    >
      <CardContent sx={{ padding: "1.5rem" }}>
        {/* Header with Icon */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            gap: 1.5,
          }}
        >
          <Box sx={dashboardStyles.dashboardIconContainer}>
            <Campaign sx={{ fontSize: "1.25rem" }} />
          </Box>
          <Typography sx={dashboardStyles.dashboardSectionTitle}>
            {t("dashboard.quickBroadcast.title")}
          </Typography>
        </Box>

        {/* Success/Error messages */}
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccess(false)}
          >
            {t("dashboard.quickBroadcast.success")}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Subject Field */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label={t("dashboard.quickBroadcast.subject")}
            placeholder={t("dashboard.quickBroadcast.subjectPlaceholder")}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                borderRadius: "0.75rem",
                fontSize: "0.875rem",
                "& fieldset": {
                  borderColor: colors.border,
                },
                "&:hover fieldset": {
                  borderColor: colors.primary,
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.primary,
                },
              },
            }}
          />
        </Box>

        {/* Editor with modern styling */}
        <Box
          sx={{
            mb: 2,
            "& .tiptap": {
              backgroundColor: colors.background,
              borderRadius: "0.75rem",
              border: "none",
              minHeight: "120px",
              padding: "1rem",
              fontSize: "0.875rem",
              "&:focus": {
                outline: "none",
                boxShadow: `0 0 0 2px ${colors.primaryLight}`,
              },
            },
          }}
        >
          <TiptapEditor
            value={content}
            onChange={(html) => setContent(html)}
            placeholder={t("dashboard.quickBroadcast.placeholder")}
            customLeftButtons={[attachFileButton]}
          />
        </Box>

        {/* Attachments list with chips */}
        {attachments.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: "block" }}
            >
              {attachments.length} {t("dashboard.quickBroadcast.filesAttached")}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {attachments.map((file, index) => (
                <Chip
                  key={index}
                  label={file.name}
                  onDelete={() => handleRemoveAttachment(index)}
                  deleteIcon={<Close />}
                  size="small"
                  sx={{
                    maxWidth: "200px",
                    "& .MuiChip-label": {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    },
                  }}
                  icon={<AttachFile sx={{ fontSize: "1rem" }} />}
                />
              ))}
            </Box>
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flex: 1,
              gap: 2,
            }}
          >
            {/* Client Selection - Only for BPO Admin */}
            {isBPOAdmin && (
              <Box sx={{ display: "flex", mb: 2, flex: 1 }}>
                {loadingClients ? (
                  <CircularProgress size={20} />
                ) : (
                  <FormControl fullWidth>
                    <InputLabel
                      id="clients-select-label"
                      sx={filterStyles?.multiOptionFilter?.inputLabelSection}
                    >
                      {t("dashboard.quickBroadcast.selectClients")}
                    </InputLabel>
                    <Select
                      labelId="clients-select-label"
                      id="clients-select"
                      multiple
                      value={selectedClients}
                      onChange={handleSelectChange}
                      input={
                        <OutlinedInput
                          label={t("dashboard.quickBroadcast.selectClients")}
                        />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.length === clients.length ? (
                            <Chip
                              label={t("dashboard.quickBroadcast.selectAll")}
                              size="small"
                              color="primary"
                            />
                          ) : (
                            selected.map((clientId) => {
                              const client = clients.find(
                                (c) => c.id === clientId
                              );
                              return (
                                <Chip
                                  key={clientId}
                                  label={client?.name || clientId}
                                  size="small"
                                />
                              );
                            })
                          )}
                        </Box>
                      )}
                      sx={{
                        ...filterStyles?.multiOptionFilter?.selectSection,
                        backgroundColor: "white",
                      }}
                    >
                      {/* Select All Option */}
                      <MenuItem value="all">
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {selectedClients.length === clients.length ? (
                            <CheckBox color="primary" />
                          ) : (
                            <CheckBoxOutlineBlank />
                          )}
                          <Typography fontWeight="bold">
                            {t("dashboard.quickBroadcast.selectAll")}
                          </Typography>
                        </Box>
                      </MenuItem>

                      {/* Individual Client Options */}
                      {clients.map((client) => (
                        <MenuItem key={client.id} value={client.id}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {selectedClients.includes(client.id) ? (
                              <CheckBox color="primary" />
                            ) : (
                              <CheckBoxOutlineBlank />
                            )}
                            <Typography>{client.name}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
            )}
            {/* Priority Selection */}
            <Box sx={{ display: "flex", mb: 2, flex: 1 }}>
              <FormControl fullWidth>
                <InputLabel
                  id="priority-select-label"
                  sx={dashboardStyles?.prioritySelector?.inputLabelSection}
                >
                  {t("dashboard.quickBroadcast.priority")}
                </InputLabel>
                <Select
                  labelId="priority-select-label"
                  id="priority-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  label={t("dashboard.quickBroadcast.priority")}
                  sx={{
                    ...dashboardStyles?.prioritySelector?.selectSection,
                    backgroundColor: "white",
                  }}
                >
                  <MenuItem value="low">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: colors.success,
                        }}
                      />
                      <Typography>
                        {t("dashboard.quickBroadcast.priorityLevels.low")}
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="medium">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: colors.warning,
                        }}
                      />
                      <Typography>
                        {t("dashboard.quickBroadcast.priorityLevels.medium")}
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="high">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: colors.error,
                        }}
                      />
                      <Typography>
                        {t("dashboard.quickBroadcast.priorityLevels.high")}
                      </Typography>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Submit Button */}
          <Box
            sx={{
              display: "flex",
              //flex: 1,
              marginLeft:'30vh'
            }}
          >
            <Button
              variant="contained"
              startIcon={
                sending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Send />
                )
              }
              onClick={handleSubmit}
              disabled={sending || loadingClients || creatingAnnouncement}
              sx={{
                ...primaryIconButton,
                boxShadow: `0 4px 12px ${colors.primaryLight}`,
                fontSize: "0.75rem",
                fontWeight: "bold",
                px: 3,
                "&:hover": {
                  boxShadow: `0 6px 16px ${colors.primaryLight}`,
                },
              }}
            >
              {t("dashboard.quickBroadcast.sendAnnouncement")}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
