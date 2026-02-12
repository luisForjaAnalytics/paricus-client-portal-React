import { Box } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { FilterButton } from "../FilterButton/FilterButton";
import { ActionButton } from "../../../../common/components/ui/ActionButton";
import { UniversalDataGrid } from "../../../../common/components/ui/DataGrid/UniversalDataGrid";

/**
 * UsersTabDesktop - Desktop view for users table
 * Receives all data via props from parent (index.jsx)
 * No internal hook calls - pure presentational component
 */
export const UsersTabDesktop = ({
  // Data from useUsersTableConfig (via parent)
  rows,
  columns,
  emptyMessage,
  // State
  loading,
  isOpen,
  setIsOpen,
  // Actions
  openAddDialog,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ px: 3 }}>
      {/* Users Data Table - Desktop Only */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          height: "auto",
          width: "100%",
        }}
      >
        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 1,
            marginRight: 2,
            gap: 1,
          }}
        >
          <ActionButton
            handleClick={openAddDialog}
            icon={<AddIcon />}
            text={t("users.addNewUser")}
          />

          {/* filter Button */}
          <FilterButton
            folderName="users.filters"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </Box>

        <UniversalDataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          emptyMessage={emptyMessage}
          pageSizeOptions={[10, 25, 50, 100]}
          columnHeaderHeight={isOpen ? 90 : 56}
        />
      </Box>
    </Box>
  );
};

UsersTabDesktop.propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  emptyMessage: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  openAddDialog: PropTypes.func.isRequired,
};
