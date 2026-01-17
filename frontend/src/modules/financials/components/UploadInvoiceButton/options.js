/**
 * Opciones para los Select de UploadInvoiceButton
 * Formato: { value: string, labelKey: string }
 */

// Opciones de moneda
export const currencyOptions = [
  { value: "USD", labelKey: "financials.form.currencies.usd" },
  { value: "EUR", labelKey: "financials.form.currencies.eur" },
  { value: "GBP", labelKey: "financials.form.currencies.gbp" },
  { value: "MXN", labelKey: "financials.form.currencies.mxn" },
];

// Opciones de estado de factura
export const invoiceStatusOptions = [
  { value: "draft", labelKey: "financials.form.statuses.draft" },
  { value: "sent", labelKey: "financials.form.statuses.sent" },
  { value: "viewed", labelKey: "financials.form.statuses.viewed" },
  { value: "paid", labelKey: "financials.form.statuses.paid" },
  { value: "overdue", labelKey: "financials.form.statuses.overdue" },
  { value: "cancelled", labelKey: "financials.form.statuses.cancelled" },
];

// Opciones de método de pago
export const paymentMethodOptions = [
  { value: "", labelKey: "financials.form.paymentMethods.notSet" },
  { value: "credit_card", labelKey: "financials.form.paymentMethods.creditCard" },
  { value: "bank_transfer", labelKey: "financials.form.paymentMethods.bankTransfer" },
  { value: "check", labelKey: "financials.form.paymentMethods.check" },
  { value: "cash", labelKey: "financials.form.paymentMethods.cash" },
  { value: "other", labelKey: "financials.form.paymentMethods.other" },
];
