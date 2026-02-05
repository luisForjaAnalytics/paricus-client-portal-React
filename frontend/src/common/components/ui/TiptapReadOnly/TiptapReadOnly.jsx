import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Box } from "@mui/material";
import { AlertInline } from "../AlertInline";
import PropTypes from "prop-types";
import "./TiptapReadOnly.css";

/**
 * TiptapReadOnly - Componente reutilizable para renderizar contenido HTML
 * de forma segura usando Tiptap en modo solo lectura.
 *
 * Reemplaza el uso de html-react-parser para tener consistencia en toda la app.
 *
 * @param {string} content - HTML content to render
 * @param {string} className - Optional additional CSS class
 * @param {object} sx - Optional Material-UI sx prop for styling
 * @param {boolean} showErrorAlert - Show error alert on render failure (default: false)
 */
export const TiptapReadOnly = ({
  content,
  className = "",
  sx = {},
  showErrorAlert = false
}) => {
  // Validate content - provide empty string fallback to allow hook to run
  const safeContent = content && typeof content === 'string' ? content : '';

  // Always call useEditor unconditionally (React Hooks rule)
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
        underline: false,
      }),
      Underline,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'tiptap-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'tiptap-link',
        },
      }),
      Table.configure({
        resizable: false,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: safeContent,
    editable: false,
    editorProps: {
      attributes: {
        class: 'tiptap-readonly',
      },
    },
  });

  // Return null for empty/invalid content after hook call
  if (!safeContent) {
    return null;
  }

  // Handle editor initialization failure
  if (!editor) {
    if (showErrorAlert) {
      return (
        <AlertInline
          message="Error rendering content. Please try refreshing the page."
          severity="error"
          sx={sx}
        />
      );
    }
    return null;
  }

  return (
    <Box
      className={`tiptap-readonly-wrapper ${className}`}
      sx={sx}
    >
      <EditorContent editor={editor} />
    </Box>
  );
};

TiptapReadOnly.propTypes = {
  content: PropTypes.string.isRequired,
  className: PropTypes.string,
  sx: PropTypes.object,
  showErrorAlert: PropTypes.bool,
};
