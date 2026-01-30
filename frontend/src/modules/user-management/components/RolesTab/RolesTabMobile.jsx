import { Box } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { ActionButton } from "../../../../common/components/ui/ActionButton/ActionButton";
import { UniversalMobilDataTable } from "../../../../common/components/ui/UniversalMobilDataTable";

/**
 * RolesTabMobile - Mobile view for roles table
 * Receives all data via props from parent (index.jsx)
 * No internal hook calls - pure presentational component
 */
export const RolesTabMobile = ({
  // Data from useRolesTableConfig (via parent)
  rows,
  columns,
  renderActions,
  renderPrimaryIcon,
  actionsLabel,
  emptyMessage,
  headerTitle,
  // State
  isLoading,
  // Actions
  openAddDialog,
}) => {
  const { t } = useTranslation();

  // Header actions
  const headerActions = (
    <ActionButton
      handleClick={openAddDialog}
      icon={<AddIcon />}
      text={t("roles.addRole")}
    />
  );

  return (
    <Box sx={{ display: { xs: "block", md: "none" }, px: 2 }}>
      <UniversalMobilDataTable
        rows={rows}
        columns={columns}
        primaryField="role_name"
        primaryIcon={renderPrimaryIcon}
        showTitle={true}
        titleField="role_name"
        headerTitle={headerTitle}
        headerActions={headerActions}
        loading={isLoading}
        emptyMessage={emptyMessage}
        renderActions={renderActions}
        actionsLabel={actionsLabel}
        labelWidth={110}
        getRowId={(row) => row.id}
      />
    </Box>
  );
};

RolesTabMobile.propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  renderActions: PropTypes.func.isRequired,
  renderPrimaryIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  actionsLabel: PropTypes.string,
  emptyMessage: PropTypes.string,
  headerTitle: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  openAddDialog: PropTypes.func.isRequired,
};
