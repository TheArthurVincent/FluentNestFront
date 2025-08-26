import React, { useState, useRef, useMemo, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

function HTMLEditor({ onChange, initialContent }) {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const quill = new Quill(editorRef.current, {
      theme: "snow",
      modules: {
        toolbar: false,
      },
    });

    // Simple LTR setup
    quill.root.setAttribute("dir", "ltr");
    quill.root.style.direction = "ltr";
    quill.root.style.textAlign = "left";

    // Force LTR on the actual editor element
    const editorElement = quill.root.querySelector(".ql-editor");
    if (editorElement) {
      editorElement.setAttribute("dir", "ltr");
      editorElement.style.direction = "ltr";
      editorElement.style.textAlign = "left";
    }

    setEditor(quill);

    return () => {
      if (quill) {
        quill.off("text-change");
      }
    };
  }, []);

  
  useEffect(() => {
    if (!editor) return;

    const handleChange = () => {
      const htmlContent = editor.root.innerHTML;

      // Quick LTR check after each change
      if (editor.root.style.direction !== "ltr") {
        editor.root.setAttribute("dir", "ltr");
        editor.root.style.direction = "ltr";
        editor.root.style.textAlign = "left";
      }

      onChange(htmlContent);
    };

    editor.on("text-change", handleChange);

    return () => {
      editor.off("text-change", handleChange);
    };
  }, [editor, onChange]);

  useEffect(() => {
    if (!editor || !initialContent) return;

    // Set content and immediately force LTR
    editor.root.innerHTML = initialContent;
    editor.root.setAttribute("dir", "ltr");
    editor.root.style.direction = "ltr";
    editor.root.style.textAlign = "left";

    const editorElement = editor.root.querySelector(".ql-editor");
    if (editorElement) {
      editorElement.setAttribute("dir", "ltr");
      editorElement.style.direction = "ltr";
      editorElement.style.textAlign = "left";
    }
  }, [editor, initialContent]);

  if (editor) {
    editor.root.setAttribute("spellcheck", "false");
  }

  const memoizedEditor = useMemo(() => {
    return (
      <div
        ref={editorRef}
        style={{
          marginTop: "1rem",
          fontSize: "18px",
          width: "100%",
          direction: "ltr",
          textAlign: "left",
          boxSizing: "border-box",
          overflow: "auto",
          height: "90.5%",
        }}
      />
    );
  }, []);

  return memoizedEditor;
}

export default HTMLEditor;
