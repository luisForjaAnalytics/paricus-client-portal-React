import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Box, IconButton, Divider, Tooltip } from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code,
  Undo,
  Redo,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  Highlight as HighlightIcon,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import { tiptapEditorStyle } from "../../../styles/styles";

const MenuBar = ({ editor, customLeftButtons = [] }) => {
  if (!editor) {
    return null;
  }

  try {
    const toolbarButtons = [
      {
        icon: <FormatBold fontSize="small" />,
        onClick: () => editor.chain().focus().toggleBold().run(),
        isActive: editor.isActive("bold"),
        tooltip: "Bold (Ctrl+B)",
      },
      {
        icon: <FormatItalic fontSize="small" />,
        onClick: () => editor.chain().focus().toggleItalic().run(),
        isActive: editor.isActive("italic"),
        tooltip: "Italic (Ctrl+I)",
      },
      {
        icon: <FormatUnderlined fontSize="small" />,
        onClick: () => editor.chain().focus().toggleUnderline().run(),
        isActive: editor.isActive("underline"),
        tooltip: "Underline (Ctrl+U)",
      },
      {
        icon: <HighlightIcon fontSize="small" />,
        onClick: () => editor.chain().focus().toggleHighlight().run(),
        isActive: editor.isActive("highlight"),
        tooltip: "Highlight",
      },
      { divider: true },
      {
        icon: <FormatAlignLeft fontSize="small" />,
        onClick: () => {
          const isActive = editor.isActive({ textAlign: "left" });
          if (isActive) {
            editor.chain().focus().unsetTextAlign().run();
          } else {
            editor.chain().focus().setTextAlign("left").run();
          }
        },
        isActive: editor.isActive({ textAlign: "left" }),
        tooltip: "Align Left",
      },
      {
        icon: <FormatAlignCenter fontSize="small" />,
        onClick: () => {
          const isActive = editor.isActive({ textAlign: "center" });
          if (isActive) {
            editor.chain().focus().unsetTextAlign().run();
          } else {
            editor.chain().focus().setTextAlign("center").run();
          }
        },
        isActive: editor.isActive({ textAlign: "center" }),
        tooltip: "Align Center",
      },
      {
        icon: <FormatAlignRight fontSize="small" />,
        onClick: () => {
          const isActive = editor.isActive({ textAlign: "right" });
          if (isActive) {
            editor.chain().focus().unsetTextAlign().run();
          } else {
            editor.chain().focus().setTextAlign("right").run();
          }
        },
        isActive: editor.isActive({ textAlign: "right" }),
        tooltip: "Align Right",
      },
      {
        icon: <FormatAlignJustify fontSize="small" />,
        onClick: () => {
          const isActive = editor.isActive({ textAlign: "justify" });
          if (isActive) {
            editor.chain().focus().unsetTextAlign().run();
          } else {
            editor.chain().focus().setTextAlign("justify").run();
          }
        },
        isActive: editor.isActive({ textAlign: "justify" }),
        tooltip: "Justify",
      },
      { divider: true },
      {
        icon: <FormatListBulleted fontSize="small" />,
        onClick: () => editor.chain().focus().toggleBulletList().run(),
        isActive: editor.isActive("bulletList"),
        tooltip: "Bullet List",
      },
      {
        icon: <FormatListNumbered fontSize="small" />,
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
        isActive: editor.isActive("orderedList"),
        tooltip: "Numbered List",
      },
      { divider: true },
      {
        icon: <FormatQuote fontSize="small" />,
        onClick: () => editor.chain().focus().toggleBlockquote().run(),
        isActive: editor.isActive("blockquote"),
        tooltip: "Quote",
      },
      {
        icon: <Code fontSize="small" />,
        onClick: () => editor.chain().focus().toggleCodeBlock().run(),
        isActive: editor.isActive("codeBlock"),
        tooltip: "Code Block",
      },
      { divider: true },
      {
        icon: <Undo fontSize="small" />,
        onClick: () => editor.chain().focus().undo().run(),
        isActive: false,
        disabled: !editor.can().undo(),
        tooltip: "Undo (Ctrl+Z)",
      },
      {
        icon: <Redo fontSize="small" />,
        onClick: () => editor.chain().focus().redo().run(),
        isActive: false,
        disabled: !editor.can().redo(),
        tooltip: "Redo (Ctrl+Y)",
      },
    ];

    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0.3,
          padding: "8px",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          backgroundColor: "#fafafa",
        }}
      >
        {/* Custom left buttons */}
        {customLeftButtons.map((button, index) => (
          <span key={`custom-${index}`}>{button}</span>
        ))}

        {customLeftButtons.length > 0 && (
          <Divider orientation="vertical" flexItem sx={{ mx: 0.3 }} />
        )}

        {/* Standard toolbar buttons */}
        {toolbarButtons.map((button, index) => {
          if (button.divider) {
            return (
              <Divider
                key={`divider-${index}`}
                orientation="vertical"
                flexItem
                sx={{ mx: 0.3 }}
              />
            );
          }

          return (
            <Tooltip key={index} title={button.tooltip} arrow placement="top">
              <span>
                <IconButton
                  onClick={button.onClick}
                  disabled={button.disabled}
                  size="small"
                  sx={{
                    padding: "4px",
                    backgroundColor: button.isActive
                      ? "#29b85e80"
                      : "transparent",
                    color: button.isActive ? "white" : "rgba(0, 0, 0, 0.54)",
                    "&:hover": {
                      backgroundColor: button.isActive
                        ? "#29b85e59"
                        : "rgba(0, 0, 0, 0.04)",
                    },
                    "&:disabled": {
                      color: "rgba(0, 0, 0, 0.26)",
                    },
                    minWidth: "28px",
                    minHeight: "28px",
                  }}
                >
                  {button.icon}
                </IconButton>
              </span>
            </Tooltip>
          );
        })}
      </Box>
    );
  } catch (err) {
    console.error("Error rendering MenuBar:", err);
    return null;
  }
};

// Fixed character limit - standardized across all usages
const MAX_CHARACTERS = 2000;

export const TiptapEditor = ({
  value = "",
  onChange,
  placeholder = "",
  error,
  helperText,
  sx = {},
  fullWidth = true,
  customLeftButtons = [],
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        underline: false, // Disable built-in underline to use our own
      }),
      Underline,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: placeholder,
      }),
      CharacterCount.configure({
        limit: MAX_CHARACTERS,
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      try {
        const html = editor.getHTML();
        const text = editor.getText();

        if (onChange) {
          onChange(html, text.length);
        }
      } catch (err) {
        console.error("Error updating editor content:", err);
      }
    },
    onFocus: () => {
      setIsFocused(true);
    },
    onBlur: () => {
      setIsFocused(false);
    },
    editorProps: {
      attributes: {
        style: "outline: none;",
      },
    },
  });

  useEffect(() => {
    try {
      if (editor && value !== undefined && value !== editor.getHTML()) {
        editor.commands.setContent(value || "");
      }
    } catch (err) {
      console.error("Error setting editor content:", err);
    }
  }, [value, editor]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  // Get character count from the extension
  const currentLength = editor?.storage.characterCount?.characters() || 0;
  const isOverLimit = MAX_CHARACTERS && currentLength > MAX_CHARACTERS;
  const isNearLimit = MAX_CHARACTERS && currentLength > MAX_CHARACTERS * 0.9;

  return (
    <Box
      sx={{
        width: fullWidth ? "100%" : "auto",
        ...tiptapEditorStyle,
        ...sx,
      }}
    >
      {/* TextField-like container that mimics MUI TextField with ticketStyle */}
      <Box
        className={`MuiOutlinedInput-root ${isFocused ? "Mui-focused" : ""}`}
        sx={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Toolbar */}
        <MenuBar editor={editor} customLeftButtons={customLeftButtons} />

        {/* Editor Content */}
        <Box
          sx={{
            overflow: "hidden",
            "& .ProseMirror": {
              minHeight: "150px",
              maxHeight: "400px",
              overflowY: "auto",
              padding: "16.5px 14px",
              fontSize: "1rem",
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              lineHeight: 1.4375,
              color: "rgba(0, 0, 0, 0.87)",
              outline: "none",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              "& p, & ul, & ol, & blockquote, & pre": {
                maxWidth: "100%",
                overflowWrap: "break-word",
                wordBreak: "break-word",
              },
              "& img": {
                maxWidth: "100%",
                height: "auto",
              },
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Box>

      {/* Helper Text & Character Counter */}
      {(helperText || MAX_CHARACTERS) && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 0.5,
            px: 1.75,
          }}
        >
          <Box
            sx={{
              fontSize: "0.75rem",
              color: error || isOverLimit ? "#d32f2f" : "rgba(0, 0, 0, 0.6)",
              lineHeight: 1.66,
            }}
          >
            {helperText}
          </Box>
          {MAX_CHARACTERS && (
            <Box
              sx={{
                fontSize: "0.75rem",
                color: isOverLimit ? "#d32f2f" : isNearLimit ? "#ed6c02" : "rgba(0, 0, 0, 0.6)",
                fontWeight: isNearLimit ? 500 : 400,
                lineHeight: 1.66,
                whiteSpace: "nowrap",
              }}
            >
              {currentLength}/{MAX_CHARACTERS}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

TiptapEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  sx: PropTypes.object,
  fullWidth: PropTypes.bool,
  customLeftButtons: PropTypes.arrayOf(PropTypes.node),
};

MenuBar.propTypes = {
  editor: PropTypes.object,
  customLeftButtons: PropTypes.arrayOf(PropTypes.node),
};
