/**
 * Extrae información de una factura desde texto OCR
 * @param {string} text - Texto extraído del PDF
 * @returns {Object} - Datos de la factura extraídos
 */
export const parseInvoiceData = (text) => {
  const result = {
    invoiceName: "",
    invoiceNumber: "",
    amount: 0,
    issuedDate: "",
    dueDate: "",
    description: "",
  };

  if (!text) return result;

  // Convertir a minúsculas para búsqueda case-insensitive
  const lowerText = text.toLowerCase();

  // Buscar número de factura
  // Solo buscar patrones específicos de "Invoice Number" o "Invoice"
  // Acepta letras, números, guiones (-), guiones bajos (_), puntos (.) y barras (/)
  const invoiceNumberPatterns = [
    /invoice\s*number\s*:?\s*([a-z0-9\-_\.\/]+)/i,
    /invoice\s*no\.?\s*:?\s*([a-z0-9\-_\.\/]+)/i,
    /invoice\s*#\s*:?\s*([a-z0-9\-_\.\/]+)/i,
    /invoice\s+([a-z0-9\-_\.\/]+)/i,
    /factura\s*n[úu]mero\s*:?\s*([a-z0-9\-_\.\/]+)/i,
    /factura\s*no\.?\s*:?\s*([a-z0-9\-_\.\/]+)/i,
    /factura\s*#\s*:?\s*([a-z0-9\-_\.\/]+)/i,
  ];

  for (const pattern of invoiceNumberPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      result.invoiceNumber = match[1].trim();
      result.invoiceName = match[1].trim();
      break;
    }
  }

  // Buscar monto total
  // Patrones: Solo buscar valores asociados con "Total"
  const amountPatterns = [
    /total\s*:?\s*\$?\s*([\d,]+\.?\d*)/i,
    /monto\s*total\s*:?\s*\$?\s*([\d,]+\.?\d*)/i,
    /total\s*a\s*pagar\s*:?\s*\$?\s*([\d,]+\.?\d*)/i,
  ];

  for (const pattern of amountPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const amountStr = match[1].replace(/,/g, "");
      const amount = parseFloat(amountStr);
      if (!isNaN(amount) && amount > 0) {
        result.amount = amount;
        break;
      }
    }
  }

  // Buscar fecha de emisión
  // Patrones: "01/15/2024", "2024-01-15", "January 15, 2024", "15 de Enero de 2024", etc.
  const issuedDatePatterns = [
    /(?:invoice\s*date|fecha\s*de\s*factura|date|fecha)\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /(?:issued|emitida?)\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/,
  ];

  for (const pattern of issuedDatePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const dateStr = match[1];
      const parsedDate = parseDate(dateStr);
      if (parsedDate) {
        result.issuedDate = parsedDate;
        break;
      }
    }
  }

  // Buscar fecha de vencimiento
  const dueDatePatterns = [
    /(?:due\s*date|fecha\s*de\s*vencimiento|vencimiento)\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /(?:payment\s*due|pago\s*antes\s*de)\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
  ];

  for (const pattern of dueDatePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const dateStr = match[1];
      const parsedDate = parseDate(dateStr);
      if (parsedDate) {
        result.dueDate = parsedDate;
        break;
      }
    }
  }

  // Extraer descripción (primeras líneas del texto, limitado)
  const lines = text.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length > 0) {
    // Tomar las primeras 3-5 líneas como descripción potencial
    const descriptionLines = lines.slice(0, 5).join(" ");
    result.description = descriptionLines.substring(0, 200); // Limitar a 200 caracteres
  }

  return result;
};

/**
 * Convierte una fecha en string a formato YYYY-MM-DD
 * @param {string} dateStr - Fecha en formato string
 * @returns {string} - Fecha en formato YYYY-MM-DD o string vacío
 */
const parseDate = (dateStr) => {
  try {
    // Intentar parsear diferentes formatos
    let date;

    // Formato: DD/MM/YYYY o DD-MM-YYYY
    if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/.test(dateStr)) {
      const parts = dateStr.split(/[\/\-]/);
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Mes es 0-indexed
      const year = parseInt(parts[2], 10);
      date = new Date(year, month, day);
    }
    // Formato: YYYY/MM/DD o YYYY-MM-DD
    else if (/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(dateStr)) {
      const parts = dateStr.split(/[\/\-]/);
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      date = new Date(year, month, day);
    }
    // Formato: MM/DD/YYYY
    else if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(dateStr)) {
      const parts = dateStr.split(/[\/\-]/);
      const month = parseInt(parts[0], 10) - 1;
      const day = parseInt(parts[1], 10);
      let year = parseInt(parts[2], 10);
      if (year < 100) year += 2000; // Convertir 24 a 2024
      date = new Date(year, month, day);
    } else {
      return "";
    }

    // Validar que la fecha es válida
    if (isNaN(date.getTime())) {
      return "";
    }

    // Convertir a formato YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error parsing date:", error);
    return "";
  }
};
