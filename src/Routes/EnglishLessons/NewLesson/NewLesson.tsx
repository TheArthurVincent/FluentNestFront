import React, { useState, useEffect } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import { backDomain } from "../../../Resources/UniversalComponents";
import { partnerColor } from "../../../Styles/Styles";

interface CreateClassButtonProps {
  courseId: string;
  studentId?: string;
  headers?: any;
  moduleId: string;
}

export default function CreateClassButton({
  courseId,
  moduleId,
  studentId,
  headers,
}: CreateClassButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");

  const handleCreateClass = async () => {
    if (!title.trim()) {
      alert("Please enter a title!");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${backDomain}/api/v1/courseclass`,
        {
          newClass: {
            title,
            courseId,
            studentId,
            module: moduleId,
          },
        },
        headers // se precisar, aqui pode virar { headers }
      );

      setShowModal(false);
      window.location.reload();
    } catch (error: any) {
      console.error("Error creating class:", error);
      alert("Error creating class. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const modal =
    showModal &&
    createPortal(
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
        onClick={() => !loading && setShowModal(false)}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "90%",
            maxWidth: "400px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
          onClick={(e) => e.stopPropagation()} // não fechar ao clicar dentro
        >
          <h3 style={{ margin: 0, color: "#333" }}>Criar Nova Aula</h3>
          <input
            type="text"
            placeholder="Título da aula..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
            disabled={loading}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              disabled={loading}
              style={{
                backgroundColor: "#ddd",
                border: "none",
                borderRadius: "6px",
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              <i className="fa fa-times" /> Cancel
            </button>

            <button
              onClick={handleCreateClass}
              disabled={loading}
              style={{
                backgroundColor: partnerColor(),
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "8px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {loading ? (
                <>
                  <i className="fa fa-spinner fa-spin" /> Creating...
                </>
              ) : (
                <>
                  <i className="fa fa-check" /> Create
                </>
              )}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      {/* Botão principal */}
      <button
        onClick={() => setShowModal(true)}
        disabled={loading}
        style={{
          backgroundColor: partnerColor(),
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "8px 14px",
          margin: "8px 0",
          fontSize: "13px",
          cursor: "pointer",
          display: "flex",
          maxWidth: "fit-content",
          marginLeft: "auto",
          alignItems: "center",
          gap: "6px",
          opacity: loading ? 0.7 : 1,
        }}
      >
        <i className="fa fa-plus" />
        Nova Aula
      </button>

      {modal}
    </>
  );
}
