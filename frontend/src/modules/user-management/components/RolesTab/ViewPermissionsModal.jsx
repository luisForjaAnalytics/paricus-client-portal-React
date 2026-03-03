import { useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { colors, modalCard, titlesTypography, outlinedIconButton } from "../../../../common/styles/styles";
import { useGetPermissionsQuery, useGetRolePermissionsQuery } from "../../../../store/api/adminApi";
import { permissionSections } from "../../../../common/utils/permissionParser";
import { LoadingProgress } from "../../../../common/components/ui/LoadingProgress";
import { AlertInline } from "../../../../common/components/ui/AlertInline";

// Section labels mapping to i18n navigation keys
const sectionLabels = {
  dashboard: "dashboard",
  reporting: "reporting",
  audioRetrieval: "audioRetrieval",
  knowledgeBase: "knowledgeBase",
  tickets: "tickets",
  financial: "financial",
  reportsManagement: "reportsManagement",
  userManagement: "userManagement",
  broadcast: "broadcast",
};

export const ViewPermissionsModal = ({ open, onClose, role }) => {
  const { t } = useTranslation();
  const { data: allPermissions = [] } = useGetPermissionsQuery();
  const {
    data: rolePermissionIds = [],
    isLoading,
    error,
  } = useGetRolePermissionsQuery(role?.id, { skip: !open || !role?.id });

  // Group permissions by section, only showing sections that have at least one assigned permission
  const sections = useMemo(() =>
    Object.entries(permissionSections)
      .map(([key, permNames]) => {
        const sectionPermissions = allPermissions.filter((p) =>
          permNames.includes(p.permissionName)
        );
        const assigned = sectionPermissions.filter((p) =>
          rolePermissionIds.includes(p.id)
        );
        return {
          key,
          label: sectionLabels[key],
          assigned,
        };
      })
      .filter((section) => section.assigned.length > 0),
    [allPermissions, rolePermissionIds],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: { sx: modalCard?.dialogSection },
      }}
    >
      <DialogTitle>
        <Typography sx={titlesTypography.primaryTitle}>
          {t("roles.viewPermissionsTitle")} - {role?.role_name || role?.roleName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {rolePermissionIds.length} {t("roles.permissionsAssigned")}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <LoadingProgress size={32} />
          </Box>
        ) : error ? (
          <AlertInline
            severity="error"
            message={t("roles.errorLoadingPermissions")}
            sx={{ my: 2 }}
          />
        ) : sections.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
            {t("roles.noPermissions")}
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {sections.map((section) => (
              <Box key={section.key}>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: colors.textMuted,
                    mb: 1,
                  }}
                >
                  {t(`navigation.${section.label}`)}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                  {section.assigned.map((perm) => (
                    <Chip
                      key={perm.id}
                      icon={<CheckCircleIcon sx={{ fontSize: "0.9rem", color: `${colors.permissionButton} !important` }} />}
                      label={t(`permission.${perm.permissionName}`)}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: "0.5rem",
                        fontSize: "0.75rem",
                        borderColor: colors.permissionButton,
                        color: colors.permissionButton,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>

      <Box sx={{ display: "flex", justifyContent: "center", px: 3, py: 2 }}>
        <Button onClick={onClose} sx={outlinedIconButton}>
          {t("common.close")}
        </Button>
      </Box>
    </Dialog>
  );
};

ViewPermissionsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  role: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    role_name: PropTypes.string,
    roleName: PropTypes.string,
  }),
};
