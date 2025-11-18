import { useState, useEffect, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useParams } from "react-router-dom";
import { useGetArticleByIdQuery } from "../../../store/api/articlesApi";
import {
  DecoupledEditor,
  Alignment,
  AutoImage,
  Autoformat,
  AutoLink,
  Autosave,
  BalloonToolbar,
  ImageBlock,
  BlockQuote,
  BlockToolbar,
  Bold,
  Bookmark,
  Code,
  CodeBlock,
  Emoji,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Fullscreen,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  HorizontalLine,
  ImageCaption,
  ImageEditing,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  ImageUtils,
  ImageInline,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  Markdown,
  MediaEmbed,
  Mention,
  PageBreak,
  Paragraph,
  PasteFromMarkdownExperimental,
  PasteFromOffice,
  PlainTableOutput,
  RemoveFormat,
  SimpleUploadAdapter,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableLayout,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  WordCount,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

// Make sure this CSS file has your styles!
import "./App.css";

// This config is now a constant outside the component,
// as it doesn't change. I've removed 'initialData' from it.
const editorConfig = {
  toolbar: {
    items: [
      "undo",
      "redo",
      "|",
      "findAndReplace",
      "fullscreen",
      "|",
      "heading",
      "|",
      "fontSize",
      "fontFamily",
      "fontColor",
      "fontBackgroundColor",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "subscript",
      "superscript",
      "code",
      "removeFormat",
      "|",
      "emoji",
      "specialCharacters",
      "horizontalLine",
      "pageBreak",
      "link",
      "bookmark",
      "insertImage",
      "insertImageViaUrl",
      "mediaEmbed",
      "insertTable",
      "insertTableLayout",
      "highlight",
      "blockQuote",
      "codeBlock",
      "|",
      "alignment",
      "|",
      "bulletedList",
      "numberedList",
      "todoList",
      "outdent",
      "indent",
    ],
    shouldNotGroupWhenFull: false,
  },
  plugins: [
    Alignment,
    Autoformat,
    AutoImage,
    AutoLink,
    Autosave,
    BalloonToolbar,
    BlockQuote,
    BlockToolbar,
    Bold,
    Bookmark,
    Code,
    CodeBlock,
    Emoji,
    Essentials,
    FindAndReplace,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    Fullscreen,
    GeneralHtmlSupport,
    Heading,
    Highlight,
    HorizontalLine,
    ImageBlock,
    ImageCaption,
    ImageEditing,
    ImageInline,
    ImageInsert,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    ImageUtils,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    Markdown,
    MediaEmbed,
    Mention,
    PageBreak,
    Paragraph,
    PasteFromMarkdownExperimental,
    PasteFromOffice,
    PlainTableOutput,
    RemoveFormat,
    SimpleUploadAdapter,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableLayout,
    TableProperties,
    TableToolbar,
    TextTransformation,
    TodoList,
    Underline,
    WordCount,
  ],
  // ... (all your other config options like balloonToolbar, heading, etc.) ...

  // Example for simpleUpload from your Vue component:
  // simpleUpload: {
  //   uploadUrl: `${process.env.REACT_APP_API_BASE_URL || ''}/api/v1/documents/upload-image`,
  // },

  image: {
    toolbar: [
      "imageTextAlternative",
      "toggleImageCaption",
      "|",
      "imageStyle:inline",
      "imageStyle:block",
      "imageStyle:side",
      "|",
      "linkImage",
    ],
    resizeOptions: [
      {
        name: "resizeImage:original",
        label: "Original",
        value: null,
      },
      {
        name: "resizeImage:50",
        label: "50%",
        value: "50",
      },
      {
        name: "resizeImage:75",
        label: "75%",
        value: "75",
      },
    ],
  },

  table: {
    contentToolbar: [
      "tableColumn",
      "tableRow",
      "mergeTableCells",
      "tableCellProperties",
      "tableProperties",
    ],
  },

  placeholder: "Type or paste your content here!",
  licenseKey: "GPL",
};

// This is your new reusable component
export default function CKEditorComponent({
  //content,
  onChange,
  disabled,
  small,
}) {
  const editorMenuBarRef = useRef(null);
  const editorToolbarRef = useRef(null);
  const editorWordCountRef = useRef(null);

  // Obtener articleId de la URL
  const { articleId } = useParams();

  const {
    data: articleData,
    isLoading,
    error,
  } = useGetArticleByIdQuery(articleId, {
    skip: !articleId, // Solo ejecutar si hay articleId
  });

  const [articleContent, setArticleContent] = useState("");

  // Cargar contenido del artículo desde RTK Query
  useEffect(() => {
    if (articleData?.document) {
      setArticleContent(articleData?.document);
    }
  }, [articleData]);

  // --- THIS IS THE VUE WATCH/ONUNMOUNTED EQUIVALENT ---
  useEffect(() => {
    if (disabled) {
      document.body.classList.add("editor-is-readonly");
    } else {
      document.body.classList.remove("editor-is-readonly");
    }

    // This return function is the "cleanup" (like onUnmounted)
    return () => {
      document.body.classList.remove("editor-is-readonly");
    };
  }, [disabled]); // This array makes the hook re-run ONLY when 'disabled' changes

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="main-container">
        <div style={{ padding: "2rem", textAlign: "center" }}>
          Loading article...
        </div>
      </div>
    );
  }

  // Mostrar error si falla la carga
  if (error) {
    return (
      <div className="main-container">
        <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
          Error loading article: {error?.message || "Unknown error"}
        </div>
      </div>
    );
  }

  return (
    <div className={`main-container ${small ? "small" : ""}`}>
      <div
        className={`editor-container editor-container_document-editor ${
          disabled ? "is-readonly" : ""
        } ${small ? "small" : ""}`}
        // Removed: editor-container_include-word-count editor-container_include-fullscreen
        // You can add these back if needed
      >
        <div
          className={`editor-container__menu-bar ${disabled ? "disabled" : ""}`}
          ref={editorMenuBarRef}
        ></div>
        <div
          className={`editor-container__toolbar ${disabled ? "disabled" : ""}`}
          ref={editorToolbarRef}
        ></div>
        <div className="editor-container__editor-wrapper">
          <div
            className={`editor-container__editor ${disabled ? "disabled" : ""}`}
          >
            <div>

                <CKEditor
                  editor={DecoupledEditor}
                  config={editorConfig}
                  data={articleContent}
                  disabled={true}
                  onReady={(editor) => {
                    if (editorToolbarRef.current) {
                      editorToolbarRef.current.appendChild(
                        editor.ui.view.toolbar.element
                      );
                    }
                    if (editorMenuBarRef.current) {
                      editorMenuBarRef.current.appendChild(
                        editor.ui.view.menuBarView.element
                      );
                    }
                    if (editorWordCountRef.current) {
                      const wordCount = editor.plugins.get("WordCount");
                      editorWordCountRef.current.appendChild(
                        wordCount.wordCountContainer
                      );
                    }
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setArticleContent(data);
                    // Notificar al componente padre si existe la función onChange
                    if (onChange) {
                      onChange(data);
                    }
                  }}
                  onAfterDestroy={() => {
                    // Clean up refs
                    if (editorWordCountRef.current) {
                      Array.from(editorWordCountRef.current.children).forEach(
                        (child) => child.remove()
                      );
                    }
                    if (editorToolbarRef.current) {
                      Array.from(editorToolbarRef.current.children).forEach(
                        (child) => child.remove()
                      );
                    }
                    if (editorMenuBarRef.current) {
                      Array.from(editorMenuBarRef.current.children).forEach(
                        (child) => child.remove()
                      );
                    }
                  }}
                />
            </div>
          </div>
        </div>
        <div
          className="editor_container__word-count"
          ref={editorWordCountRef}
        ></div>
      </div>
    </div>
  );
}
