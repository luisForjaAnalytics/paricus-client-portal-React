import { Box } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { ActionButton } from "../../../../common/components/ui/ActionButton/ActionButton";
import { UniversalMobilDataTable } from "../../../../common/components/ui/UniversalMobilDataTable";

/**
 * UsersTabMobile - Mobile view for users table
 * Receives all data via props from parent (index.jsx)
 * No internal hook calls - pure presentational component
 */
export const UsersTabMobile = ({
  // Data from useUsersTableConfig (via parent)
  rows,
  columns,
  renderActions,
  renderPrimaryIcon,
  actionsLabel,
  emptyMessage,
  headerTitle,
  // State
  loading,
  // Actions
  openAddDialog,
}) => {
  const { t } = useTranslation();

  // Header actions
  const headerActions = (
    <ActionButton
      handleClick={openAddDialog}
      icon={<AddIcon />}
      text={t("users.addNewUser")}
    />
  );

  return (
    <Box sx={{ display: { xs: "block", md: "none" } }}>
      <UniversalMobilDataTable
        rows={rows}
        columns={columns}
        primaryField="name"
        primaryIcon={renderPrimaryIcon}
        secondaryField="email"
        showTitle={true}
        titleField="name"
        headerTitle={headerTitle}
        headerActions={headerActions}
        loading={loading}
        emptyMessage={emptyMessage}
        renderActions={renderActions}
        actionsLabel={actionsLabel}
        labelWidth={80}
        getRowId={(row) => row.id}
      />
    </Box>
  );
};

UsersTabMobile.propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  renderActions: PropTypes.func.isRequired,
  renderPrimaryIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  actionsLabel: PropTypes.string,
  emptyMessage: PropTypes.string,
  headerTitle: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  openAddDialog: PropTypes.func.isRequired,
};
