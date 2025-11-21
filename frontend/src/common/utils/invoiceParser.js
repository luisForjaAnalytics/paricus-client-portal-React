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

  console.log("=== OCR Text Received ===");
  console.log(text);
  console.log("=== End OCR Text ===");

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

  // Buscar monto total (EXCLUIR "Subtotal")
  // Patrones: Solo buscar valores asociados con "Total", NO "Subtotal"
  const amountPatterns = [
    /(?<!sub)total\s*:?\s*\$?\s*([\d,]+\.?\d*)/i, // Negative lookbehind para excluir "subtotal"
    /\btotal\b\s*:?\s*\$?\s*([\d,]+\.?\d*)/i, // Word boundary para "total" exacto
    /monto\s*total\s*:?\s*\$?\s*([\d,]+\.?\d*)/i,
    /total\s*a\s*pagar\s*:?\s*\$?\s*([\d,]+\.?\d*)/i,
    /grand\s*total\s*:?\s*\$?\s*([\d,]+\.?\d*)/i, // Grand Total
  ];

  for (const pattern of amountPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const fullMatch = match[0].toLowerCase();
      // Doble verificación: excluir si contiene "subtotal"
      if (fullMatch.includes('subtotal')) {
        console.log(`⚠️ Skipping Subtotal: "${match[0]}"`);
        continue;
      }

      const amountStr = match[1].replace(/,/g, "");
      const amount = parseFloat(amountStr);
      if (!isNaN(amount) && amount > 0) {
        console.log(`✅ Total Amount found: $${amount} from "${match[0]}"`);
        result.amount = amount;
        break;
      }
    }
  }
  if (!result.amount || result.amount === 0) {
    console.log("❌ No Total Amount found in OCR text");
  }

  // Buscar fecha de emisión (Issue Date)
  // Patrones PRIORITARIOS: "Invoice date" primero
  const issuedDatePatterns = [
    // Prioridad 1: "Invoice date" con múltiples variaciones de espacios
    /invoice\s+date\s*:?\s*(\d{1,2}[\/\-\.\s]\d{1,2}[\/\-\.\s]\d{2,4})/i,
    /invoice\s+date\s*:?\s*([a-z]+\s+\d{1,2},?\s+\d{4})/i, // Enero 15, 2024
    // Prioridad 2: "Issue date" u otras variantes
    /(?:issue\s*date|fecha\s*de\s*emisión|issued|emitida?)\s*:?\s*(\d{1,2}[\/\-\.\s]\d{1,2}[\/\-\.\s]\d{2,4})/i,
    /(?:fecha\s*de\s*factura)\s*:?\s*(\d{1,2}[\/\-\.\s]\d{1,2}[\/\-\.\s]\d{2,4})/i,
    // Fallback: Fechas en formato completo
    /(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/,
    /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/,
  ];

  for (const pattern of issuedDatePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const dateStr = match[1];
      console.log(`🔍 Issue Date MATCH found: "${dateStr}" using pattern: ${pattern}`);
      console.log(`📄 Full match: "${match[0]}"`);
      const parsedDate = parseDate(dateStr);
      if (parsedDate) {
        console.log(`✅ Issue Date parsed successfully: ${parsedDate}`);
        result.issuedDate = parsedDate;
        break;
      } else {
        console.log(`⚠️ Issue Date found but failed to parse: "${dateStr}"`);
      }
    }
  }
  if (!result.issuedDate) {
    console.log("❌ No Issue Date found in OCR text");
  }

  // Buscar fecha de vencimiento (Due Date)
  // Patrones PRIORITARIOS: "Payment due" primero
  const dueDatePatterns = [
    // Prioridad 1: "Payment due" con múltiples variaciones
    /payment\s+due\s*:?\s*(\d{1,2}[\/\-\.\s]\d{1,2}[\/\-\.\s]\d{2,4})/i,
    /payment\s+due\s*:?\s*([a-z]+\s+\d{1,2},?\s+\d{4})/i, // Enero 15, 2024
    // Prioridad 2: Otras variantes
    /(?:due\s*date|fecha\s*de\s*vencimiento|vencimiento)\s*:?\s*(\d{1,2}[\/\-\.\s]\d{1,2}[\/\-\.\s]\d{2,4})/i,
    /(?:pago\s*antes\s*de)\s*:?\s*(\d{1,2}[\/\-\.\s]\d{1,2}[\/\-\.\s]\d{2,4})/i,
  ];

  for (const pattern of dueDatePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const dateStr = match[1];
      console.log(`🔍 Due Date MATCH found: "${dateStr}" using pattern: ${pattern}`);
      console.log(`📄 Full match: "${match[0]}"`);
      const parsedDate = parseDate(dateStr);
      if (parsedDate) {
        console.log(`✅ Due Date parsed successfully: ${parsedDate}`);
        result.dueDate = parsedDate;
        break;
      } else {
        console.log(`⚠️ Due Date found but failed to parse: "${dateStr}"`);
      }
    }
  }
  if (!result.dueDate) {
    console.log("❌ No Due Date found in OCR text");
  }

  // Extraer descripción desde "Notes / Terms"
  // Buscar el inicio de la sección "Notes / Terms" y capturar TODO el contenido después
  const notesPatterns = [
    // Patrón 1: "Notes / Terms:" seguido de todo hasta el final o hasta encontrar otro encabezado importante
    /notes?\s*[\/\\]?\s*terms?\s*:?\s*([\s\S]+?)(?=\n\s*(?:payment\s+(?:information|details|method)|invoice\s+(?:number|date|details)|bill\s+to|ship\s+to|subtotal|grand\s+total|page\s+\d+)|\n{3,}|$)/i,
    // Patrón 2: Solo "Notes:"
    /notes?\s*:?\s*([\s\S]+?)(?=\n\s*(?:payment\s+(?:information|details|method)|invoice\s+(?:number|date|details)|bill\s+to|ship\s+to|subtotal|grand\s+total|page\s+\d+)|\n{3,}|$)/i,
    // Patrón 3: "Terms and Conditions:"
    /terms?\s*(?:and|&)?\s*conditions?\s*:?\s*([\s\S]+?)(?=\n\s*(?:payment\s+(?:information|details|method)|invoice\s+(?:number|date|details)|bill\s+to|ship\s+to|subtotal|grand\s+total|page\s+\d+)|\n{3,}|$)/i,
    // Patrón 4: "Comments:"
    /comments?\s*:?\s*([\s\S]+?)(?=\n\s*(?:payment\s+(?:information|details|method)|invoice\s+(?:number|date|details)|bill\s+to|ship\s+to|subtotal|grand\s+total|page\s+\d+)|\n{3,}|$)/i,
  ];

  for (const pattern of notesPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      // Limpiar el texto: eliminar saltos de línea excesivos y espacios extras
      const notesText = match[1]
        .trim()
        .replace(/\n{2,}/g, ' ') // Reemplazar múltiples saltos de línea por un espacio
        .replace(/\s+/g, ' ') // Normalizar espacios múltiples
        .trim();

      if (notesText.length > 10) { // Solo si tiene contenido significativo
        console.log(`📝 Notes/Terms found (${notesText.length} chars): "${notesText}"`);
        result.description = notesText;
        break;
      }
    }
  }

  // Fallback: Si no se encontró "Notes/Terms", usar las primeras líneas
  if (!result.description) {
    const lines = text.split("\n").filter((line) => line.trim().length > 0);
    if (lines.length > 0) {
      const descriptionLines = lines.slice(0, 5).join(" ");
      result.description = descriptionLines.substring(0, 200);
      console.log(`📝 Using fallback description (first lines)`);
    }
  }

  console.log("=== Parsed Invoice Data ===");
  console.log(result);
  console.log("=== End Parsed Data ===");

  return result;
};

/**
 * Convierte una fecha en string a formato YYYY-MM-DD
 * @param {string} dateStr - Fecha en formato string
 * @returns {string} - Fecha en formato YYYY-MM-DD o string vacío
 */
const parseDate = (dateStr) => {
  try {
    if (!dateStr) return "";

    // Limpiar espacios extras y normalizar separadores
    let cleanedDate = dateStr.trim().replace(/\s+/g, ' ');
    console.log(`🔧 Parsing date: "${cleanedDate}"`);

    let date;

    // Formato: DD/MM/YYYY o DD-MM-YYYY o DD.MM.YYYY (con espacios o sin ellos)
    if (/^\d{1,2}[\s\/\-\.]\d{1,2}[\s\/\-\.]\d{4}$/.test(cleanedDate)) {
      const parts = cleanedDate.split(/[\s\/\-\.]/);
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Mes es 0-indexed
      const year = parseInt(parts[2], 10);
      date = new Date(year, month, day);
      console.log(`📅 Format DD/MM/YYYY detected: ${day}/${month + 1}/${year}`);
    }
    // Formato: YYYY/MM/DD o YYYY-MM-DD o YYYY.MM.DD
    else if (/^\d{4}[\s\/\-\.]\d{1,2}[\s\/\-\.]\d{1,2}$/.test(cleanedDate)) {
      const parts = cleanedDate.split(/[\s\/\-\.]/);
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      date = new Date(year, month, day);
      console.log(`📅 Format YYYY/MM/DD detected: ${year}/${month + 1}/${day}`);
    }
    // Formato: MM/DD/YYYY (común en USA)
    else if (/^\d{1,2}[\s\/\-\.]\d{1,2}[\s\/\-\.]\d{2,4}$/.test(cleanedDate)) {
      const parts = cleanedDate.split(/[\s\/\-\.]/);
      const month = parseInt(parts[0], 10) - 1;
      const day = parseInt(parts[1], 10);
      let year = parseInt(parts[2], 10);
      if (year < 100) year += 2000; // Convertir 24 a 2024
      date = new Date(year, month, day);
      console.log(`📅 Format MM/DD/YYYY detected: ${month + 1}/${day}/${year}`);
    }
    // Formato: Mes DD, YYYY (ejemplo: January 15, 2024)
    else if (/^[a-z]+\s+\d{1,2},?\s+\d{4}$/i.test(cleanedDate)) {
      date = new Date(cleanedDate);
      console.log(`📅 Format "Month DD, YYYY" detected`);
    }
    else {
      console.log(`⚠️ Date format not recognized: "${cleanedDate}"`);
      return "";
    }

    // Validar que la fecha es válida
    if (isNaN(date.getTime())) {
      console.log(`❌ Invalid date object created from: "${cleanedDate}"`);
      return "";
    }

    // Convertir a formato YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const result = `${year}-${month}-${day}`;
    console.log(`✅ Date successfully parsed to: ${result}`);
    return result;
  } catch (error) {
    console.error(`❌ Error parsing date "${dateStr}":`, error);
    return "";
  }
};
