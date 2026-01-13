import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Box, Alert } from "@mui/material";
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
  // Validate content
  if (!content || typeof content !== 'string') {
    return null;
  }

  let editor;

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    editor = useEditor({
      extensions: [
        StarterKit.configure({
          // Exclude Link from StarterKit since we're configuring it manually
          link: false,
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
      content: content,
      editable: false,
      editorProps: {
        attributes: {
          class: 'tiptap-readonly',
        },
      },
    });
  } catch (error) {
    console.error('Error initializing TiptapReadOnly editor:', error);

    if (showErrorAlert) {
      return (
        <Alert severity="error" sx={sx}>
          Error rendering content. Please try refreshing the page.
        </Alert>
      );
    }

    return null;
  }

  if (!editor) {
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
