import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Folder as FolderIcon,
  Refresh as RefreshIcon,
  Lock as LockIcon,
  FolderOpen as FolderOpenIcon,
  OpenInNew as OpenIcon,
} from "@mui/icons-material";
import {
  primaryIconButton,
  outlinedIconButton,
  clientCard,
  clientCardSelected,
  colors,
  typography,
  spacing,
  titlesTypography,
} from "../../../layouts/style/styles";

export const ClientFolders = ({
  clientFolders = [],
  loading = false,
  selectedFolder = "",
  handleFolderSelect,
  refetchFolders,
  openFolderAccessModal,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          sx={{
            ...titlesTypography.primaryTitle,
          }}
        >
          Client Folders
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="success"
            startIcon={<LockIcon />}
            onClick={openFolderAccessModal}
            sx={primaryIconButton}
          >
            Manage Access
          </Button>
          <Button
            variant="outlined"
            startIcon={
              loading ? <CircularProgress size={20} /> : <RefreshIcon />
            }
            onClick={() => refetchFolders()}
            disabled={loading}
            sx={outlinedIconButton}
          >
            {loading ? "Loading..." : "Refresh Folders"}
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: spacing.md / 8,
          width: "100%",
        }}
      >
        {clientFolders.map((folder) => (
          <Box flex={1} key={folder}>
            <Card
              sx={{
                ...(selectedFolder === folder
                  ? clientCardSelected
                  : clientCard),
              }}
              onClick={() => handleFolderSelect(folder)}
            >
              <CardContent sx={{ p: spacing.gap5 / 8 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    {selectedFolder === folder ? (
                      <FolderOpenIcon
                        sx={{
                          fontSize: 40,
                          color: colors.primary,
                        }}
                      />
                    ) : (
                      <FolderIcon
                        sx={{
                          fontSize: 40,
                          color: colors.folderCloseIcon,
                        }}
                      />
                    )}
                    <Box>
                      <Typography
                        sx={{
                          ...titlesTypography.sectionTitle,
                          marginTop: "0.5rem",
                        }}
                      >
                        {folder}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: typography.fontSize.small,
                          color: colors.textMuted,
                          fontFamily: typography.fontFamily,
                        }}
                      >
                        Client folder
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    sx={{
                      color: colors.primary,
                      "&:hover": {
                        backgroundColor: colors.primaryLight,
                      },
                    }}
                  >
                    <OpenIcon />
                  </IconButton>
                </Box>

                <Divider
                  sx={{
                    width: selectedFolder === folder ? "100%" : "30%",
                    backgroundColor:
                      selectedFolder === folder
                        ? colors.primaryLight
                        : "#ffffffff",
                    borderBottomWidth: 2,
                    borderRadius: "2rem",
                    transition: "0.4s ease",
                    mx: "auto",
                  }}
                />
              </CardContent>
            </Card>
          </Box>
        ))}

        {/* Empty State */}
        {clientFolders.length === 0 && !loading && (
          <Box sx={{ textAlign: "center", py: 8, width: "100%" }}>
            <FolderOpenIcon
              sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
            />
            <Typography variant="h6" fontWeight="medium" gutterBottom>
              No client folders found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create folders in your S3 bucket:
              client-access-reports/your-client-name/
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
