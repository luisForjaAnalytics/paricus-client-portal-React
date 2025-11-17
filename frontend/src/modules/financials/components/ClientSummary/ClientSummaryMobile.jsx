import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Avatar,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  OpenInNew as OpenIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

function Row({ item, formatCurrency }) {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ bgcolor: item.icon.color, width: 32, height: 32 }}>
              {item.icon.icon}
            </Avatar>
            <Typography variant="body2" fontWeight="medium">
              {item.label}
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                component="div"
                fontWeight="bold"
              >
                {item.label}
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                {/* Main Value */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 80 }}
                  >
                    Amount:
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color={item.borderCol}
                  >
                    {item.label === "Active Clients"
                      ? item.overallStatsInfo.tp1
                      : formatCurrency(item.overallStatsInfo.tp1)}
                  </Typography>
                </Box>

                {/* Secondary Value */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{ minWidth: 80 }}
                  >
                    Count:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.overallStatsInfo.tp2} {item.invoiceState}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  item: PropTypes.shape({
    borderCol: PropTypes.string.isRequired,
    cardColor: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    invoiceState: PropTypes.string.isRequired,
    overallStatsInfo: PropTypes.shape({
      tp1: PropTypes.number.isRequired,
      tp2: PropTypes.number.isRequired,
    }).isRequired,
    icon: PropTypes.shape({
      icon: PropTypes.node.isRequired,
      color: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  formatCurrency: PropTypes.func.isRequired,
};

export const ClientSummaryMobile = ({
  loading,
  refetchAllClients,
  formatCurrency,
  payload,
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        display: { xs: "block", md: "none" },
        mt: 1,
        mb: 4,
        maxHeight: "70vh",
        overflowY: "auto",
        overflowX: "hidden",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#c5c5c5",
          borderRadius: "8px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#9e9e9e",
        },
      }}
    >
      <Table aria-label="all clients summary table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: "#f5f5f5" }} />
            <TableCell sx={{ backgroundColor: "#f5f5f5" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle2" fontWeight="600">
                  All Clients Summary
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <Tooltip title="Wave Apps">
                    <IconButton
                      color="secondary"
                      size="small"
                      href="https://my.waveapps.com/login_external/"
                      target="_blank"
                      rel="noopener noreferrer"
                      component="a"
                    >
                      <OpenIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Refresh">
                    <IconButton
                      color="default"
                      size="small"
                      onClick={refetchAllClients}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={18} />
                      ) : (
                        <RefreshIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payload.map((item, index) => (
            <Row key={index} item={item} formatCurrency={formatCurrency} />
          ))}
          {payload.length === 0 && (
            <TableRow>
              <TableCell colSpan={2}>
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No data available
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

ClientSummaryMobile.propTypes = {
  loading: PropTypes.bool,
  refetchAllClients: PropTypes.func.isRequired,
  formatCurrency: PropTypes.func.isRequired,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      borderCol: PropTypes.string.isRequired,
      cardColor: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      invoiceState: PropTypes.string.isRequired,
      overallStatsInfo: PropTypes.shape({
        tp1: PropTypes.number.isRequired,
        tp2: PropTypes.number.isRequired,
      }).isRequired,
      icon: PropTypes.shape({
        icon: PropTypes.node.isRequired,
        color: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};
