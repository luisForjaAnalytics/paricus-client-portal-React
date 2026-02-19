import { Box } from "@mui/material";
import PropTypes from "prop-types";
import { UniversalMobilDataTable } from "../../../../common/components/ui/UniversalMobilDataTable";

/**
 * ClientsTabMobile - Mobile view for clients table
 * Receives all data via props from parent (index.jsx)
 * No internal hook calls - pure presentational component
 */
export const ClientsTabMobile = ({
  // Data from useClientsTableConfig (via parent)
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
        primaryField="name"
        primaryIcon={renderPrimaryIcon}
        showTitle={true}
        titleField="name"
        headerTitle={headerTitle}
        headerActions={headerActions}
        subHeader={subHeader}
        loading={isLoading}
        emptyMessage={emptyMessage}
        renderActions={renderActions}
        actionsLabel={actionsLabel}
        labelWidth={100}
        getRowId={(row) => row.id}
      />
    </Box>
  );
};

ClientsTabMobile.propTypes = {
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
