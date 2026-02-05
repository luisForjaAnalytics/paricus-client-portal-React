import { Box, Typography } from "@mui/material";
import { ClientSummary } from "../ClientSummary";
import { ClientBreakdown } from "../ClientBreakdown";
import { InvoicesTable } from "../InvoicesTable";
import { EditInvoiceModal } from "../EditInvoiceModal";
import { typography } from "../../../../common/styles/styles";
import { useFinancials } from "../../hooks/useFinancials";
import { AlertInline } from "../../../../common/components/ui/AlertInline";

/**
 * FinancialsContent - Main content component for financials module
 * Renders all financial data and components
 */
export const FinancialsContent = () => {
  const {
    // Permissions
    isBPOAdmin,
    isClientAdmin,

    // Data
    clientBreakdowns,
    clientAdminBreakdown,
    statsToDisplay,
    ClientSummaryCardInfo,
    invoices,
    selectedFolder,
    loading,

    // Refs
    invoicesSection,

    // Refetch functions
    refetchAllClients,
    refetchMyInvoices,

    // Modal state
    showEditInvoiceModal,
    setShowEditInvoiceModal,
    editInvoiceForm,
    setEditInvoiceForm,
    savingInvoiceEdit,

    // Notification
    notificationRef,

    // Actions
    selectClient,
    viewInvoice,
    downloadInvoice,
    handleDeleteInvoice,
    openPaymentLink,
    openEditInvoiceModal,
    markAsPaid,
    handleSaveInvoiceEdit,
    showNotification,

    // Utilities
    formatDate,
    formatCurrency,
    getStatusColor,
  } = useFinancials();

  return (
    <Box sx={{ marginLeft: "0rem" }}>
      {/* Overall Statistics - Desktop (BPO Admin and Client Admin) */}
      {statsToDisplay && (
        <ClientSummary
          loading={loading}
          refetchAllClients={isBPOAdmin ? refetchAllClients : refetchMyInvoices}
          formatCurrency={formatCurrency}
          overallStats={statsToDisplay}
          payload={ClientSummaryCardInfo}
          isAdmin={isBPOAdmin}
        />
      )}

      {/* BPO Admin: Client Breakdown */}
      {isBPOAdmin && (
        <ClientBreakdown
          clientBreakdowns={clientBreakdowns}
          selectedFolder={selectedFolder}
          formatCurrency={formatCurrency}
          selectClient={selectClient}
          invoices={invoices}
          isAdmin={isBPOAdmin}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
          viewInvoice={viewInvoice}
          downloadInvoice={downloadInvoice}
          openEditInvoiceModal={openEditInvoiceModal}
          handleDeleteInvoice={handleDeleteInvoice}
          openPaymentLink={openPaymentLink}
          onPaymentLinkSuccess={(message) =>
            showNotification(message, "success")
          }
          onPaymentLinkError={(message) =>
            showNotification(message, "error")
          }
        />
      )}

      {/* Client Admin: Client Breakdown Table */}
      {isClientAdmin && clientAdminBreakdown.length > 0 && (
        <ClientBreakdown
          clientBreakdowns={clientAdminBreakdown}
          selectedFolder={clientAdminBreakdown[0].folder}
          formatCurrency={formatCurrency}
          selectClient={selectClient}
          invoices={invoices}
          isAdmin={false}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
          viewInvoice={viewInvoice}
          downloadInvoice={downloadInvoice}
          openEditInvoiceModal={openEditInvoiceModal}
          handleDeleteInvoice={handleDeleteInvoice}
          openPaymentLink={openPaymentLink}
          onPaymentLinkSuccess={(message) =>
            showNotification(message, "success")
          }
          onPaymentLinkError={(message) =>
            showNotification(message, "error")
          }
        />
      )}

      {/* Client User (non-admin): Invoices Table */}
      {!isBPOAdmin && !isClientAdmin && invoices.length > 0 && (
        <Box sx={{ mb: 4 }} ref={invoicesSection}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: typography.fontWeight.semibold,
              fontFamily: typography.fontFamily,
            }}
          >
            Your Invoices
          </Typography>
          <InvoicesTable
            invoices={invoices}
            isAdmin={false}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            getStatusColor={getStatusColor}
            viewInvoice={viewInvoice}
            downloadInvoice={downloadInvoice}
            openPaymentLink={openPaymentLink}
            openEditInvoiceModal={openEditInvoiceModal}
            handleDeleteInvoice={handleDeleteInvoice}
            onPaymentLinkSuccess={(message) =>
              showNotification("success", message)
            }
            onPaymentLinkError={(message) =>
              showNotification("error", message)
            }
          />
        </Box>
      )}

      {/* Edit Invoice Modal */}
      <EditInvoiceModal
        showEditInvoiceModal={showEditInvoiceModal}
        editInvoiceForm={editInvoiceForm}
        setEditInvoiceForm={setEditInvoiceForm}
        handleSaveInvoiceEdit={handleSaveInvoiceEdit}
        setShowEditInvoiceModal={setShowEditInvoiceModal}
        savingInvoiceEdit={savingInvoiceEdit}
        markAsPaid={markAsPaid}
      />

      {/* Notifications */}
      <AlertInline ref={notificationRef} asSnackbar />
    </Box>
  );
};
