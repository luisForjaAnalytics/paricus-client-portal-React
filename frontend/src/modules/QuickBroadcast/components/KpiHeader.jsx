import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListSubheader,
} from "@mui/material";
import {
  boxTypography,
  modalCard,
  selectMenuProps,
} from "../../../common/styles/styles";
import {
  useGetClientsQuery,
  useGetUsersQuery,
} from "../../../store/api/adminApi";
import { LoadingProgress } from "../../../common/components/ui/LoadingProgress";

/**
 * KpiHeader - Header with user/client selector for BPO Admin in KPI Controller
 * @param {function} onSelectionChange - Callback when selection changes, receives { userId }
 */
export const KpiHeader = ({ onSelectionChange }) => {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState("");

  // Check if user is BPO Admin
  const permissions = useSelector((state) => state.auth?.permissions);
  const isBPOAdmin = permissions?.includes("admin_clients") ?? false;

  // Fetch clients and users (only for BPO Admin)
  const { data: clients = [], isLoading: isLoadingClients } =
    useGetClientsQuery(undefined, { skip: !isBPOAdmin });

  const { data: allUsers = [], isLoading: isLoadingUsers } = useGetUsersQuery(
    undefined,
    { skip: !isBPOAdmin },
  );

  // Parse selected value to extract userId
  const selectedUserId = useMemo(() => {
    if (!selectedValue) return null;
    const parts = selectedValue.split("-");
    if (parts.length === 2 && parts[0] === "user") {
      const id = parseInt(parts[1], 10);
      return isNaN(id) ? null : id;
    }
    return null;
  }, [selectedValue]);

  // Notify parent of selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({ userId: selectedUserId });
    }
  }, [selectedUserId, onSelectionChange]);

  const handleChange = (event) => {
    setSelectedValue(event.target.value ?? "");
  };

  // Group users by client (excluding BPO Administration)
  const clientsWithUsers = useMemo(() => {
    if (!Array.isArray(clients) || !Array.isArray(allUsers)) return [];
    return clients
      .filter((client) => client?.id !== 1)
      .map((client) => ({
        ...client,
        users: allUsers.filter((user) => user?.client?.id === client?.id),
      }))
      .filter((client) => client.users.length > 0);
  }, [clients, allUsers]);

  // Build menu items
  const menuItems = useMemo(() => {
    const items = [];

    items.push(
      <MenuItem key="all" value="" sx={{ color: "text.primary" }}>
        <Typography fontWeight="medium">{t("kpiControl.viewAll")}</Typography>
      </MenuItem>,
    );

    clientsWithUsers.forEach((client) => {
      items.push(
        <ListSubheader
          key={`header-${client.id}`}
          sx={{
            backgroundColor: "grey.100",
            fontWeight: "bold",
            color: "text.primary",
            lineHeight: "32px",
          }}
        >
          {client.name}
        </ListSubheader>,
      );

      client.users.forEach((user) => {
        items.push(
          <MenuItem
            key={`user-${user.id}`}
            value={`user-${user.id}`}
            sx={{ pl: 4, color: "text.primary" }}
          >
            {user.firstName} {user.lastName}
            <Typography
              component="span"
              variant="caption"
              sx={{ ml: 1, color: "text.secondary" }}
            >
              ({user.role?.roleName || t("common.user")})
            </Typography>
          </MenuItem>,
        );
      });
    });

    return items;
  }, [clientsWithUsers, t]);

  // Get display value for selected option
  const getDisplayValue = useCallback(() => {
    if (!selectedValue) return t("kpiControl.viewAll");
    const parts = selectedValue.split("-");
    if (parts.length === 2 && parts[0] === "user") {
      const id = parseInt(parts[1], 10);
      const user = allUsers.find((u) => u.id === id);
      if (user) {
        return `${user.firstName} ${user.lastName} (${user.client?.name || ""})`;
      }
    }
    return "";
  }, [selectedValue, allUsers, t]);

  const isLoading = isBPOAdmin && (isLoadingClients || isLoadingUsers);

  // Don't render anything for non-admin users
  if (!isBPOAdmin) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
        mb: 2,
      }}
    >
      {isLoading && <LoadingProgress size={24} />}

      {!isLoading && clientsWithUsers.length > 0 && (
        <FormControl sx={{ minWidth: 280 }}>
          <InputLabel
            id="kpi-user-selector-label"
            sx={modalCard?.multiOptionFilter?.inputLabelSection}
          >
            {t("kpiControl.viewAs")}
          </InputLabel>
          <Select
            labelId="kpi-user-selector-label"
            id="kpi-user-selector"
            value={selectedValue}
            onChange={handleChange}
            label={t("kpiControl.viewAs")}
            MenuProps={selectMenuProps}
            renderValue={getDisplayValue}
            sx={{
              ...modalCard?.multiOptionFilter?.selectSection,
              height: "3rem",
            }}
          >
            {menuItems}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

KpiHeader.propTypes = {
  onSelectionChange: PropTypes.func,
};
