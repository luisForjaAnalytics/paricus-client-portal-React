import { Box } from "@mui/material";
import PropTypes from "prop-types";
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
  headerActions,
  subHeader,
  // State
  loading,
}) => {
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
        subHeader={subHeader}
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
  headerActions: PropTypes.node,
  subHeader: PropTypes.node,
  loading: PropTypes.bool.isRequired,
};
