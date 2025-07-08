import React, { useState, useRef, useMemo, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

function HTMLJustWrite({ onChange, displayy }) {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const quill = new Quill(editorRef.current, {
      theme: "snow",
      modules: {
        toolbar: false,
        keyboard: {
          bindings: {
            bold: {
              key: "B",
              shortKey: true,
              handler: function (range, context) {
                this.quill.format("bold", !context.format.bold);
              },
            },
            italic: {
              key: "I",
              shortKey: true,
              handler: function (range, context) {
                this.quill.format("italic", !context.format.italic);
              },
            },
            underline: {
              key: "U",
              shortKey: true,
              handler: function (range, context) {
                this.quill.format("underline", !context.format.underline);
              },
            },
            header1: {
              key: "1",
              shortKey: true,
              shiftKey: true,
              handler: function (range, context) {
                this.quill.format(
                  "header",
                  context.format.header === 1 ? false : 1
                );
              },
            },
            orderedList: {
              key: "7",
              shortKey: true,
              shiftKey: true,
              handler: function (range, context) {
                this.quill.format(
                  "list",
                  context.format.list === "ordered" ? false : "ordered"
                );
              },
            },
            bulletList: {
              key: "8",
              shortKey: true,
              shiftKey: true,
              handler: function (range, context) {
                this.quill.format(
                  "list",
                  context.format.list === "bullet" ? false : "bullet"
                );
              },
            },
          },
        },
      },
    });
    setEditor(quill);

    return () => {
      quill.off("text-change");
    };
  }, []);

  useEffect(() => {
    if (!editor) return;

    const handleChange = () => {
      const htmlContent =
        editorRef.current.querySelector(".ql-editor").innerHTML;
      onChange(htmlContent);
    };

    editor.on("text-change", handleChange);

    return () => {
      editor.off("text-change", handleChange);
    };
  }, [editor, onChange]);

  const memoizedEditor = useMemo(() => {
    return (
      <>
        <div
          ref={editorRef}
          style={{
            height: "500%",
            border: "none",
            padding: "1rem",
            marginTop: "1rem",
            fontSize: "1.5rem",
            width: "90%",
            display: displayy ? displayy : "block",
          }}
        />
      </>
    );
  }, []);

  return memoizedEditor;
}

export default HTMLJustWrite;
