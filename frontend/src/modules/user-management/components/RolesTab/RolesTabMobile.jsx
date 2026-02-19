import { Box } from "@mui/material";
import PropTypes from "prop-types";
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
  headerActions,
  subHeader,
  // State
  isLoading,
}) => {
  return (
    <Box sx={{ display: { xs: "block", md: "none" } }}>
      <UniversalMobilDataTable
        rows={rows}
        columns={columns}
        primaryField="role_name"
        primaryIcon={renderPrimaryIcon}
        showTitle={true}
        titleField="role_name"
        headerTitle={headerTitle}
        headerActions={headerActions}
        subHeader={subHeader}
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
  headerActions: PropTypes.node,
  subHeader: PropTypes.node,
  isLoading: PropTypes.bool.isRequired,
};
