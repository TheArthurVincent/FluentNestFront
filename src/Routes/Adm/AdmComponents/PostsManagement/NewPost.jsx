import React, { useState } from "react";
import axios from "axios";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { HOne } from "../../../../Resources/Components/RouteBox";
import { partnerColor } from "../../../../Styles/Styles";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import HTMLEditor from "../../../../Resources/Components/HTMLEditor";
import { CircularProgress } from "@mui/material";

export function NewPost({ headers }) {
  const [newTitle, setNewTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTextChange = (htmlContent) => {
    setNewText(htmlContent);
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    let newPost = {
      title: newTitle,
      videoUrl: newVideoUrl,
      text: newText,
    };
    try {
      const { id } = JSON.parse(localStorage.getItem("loggedIn"));
      await axios.post(`${backDomain}/api/v1/blogposts/${id}`, newPost, {
        headers,
      });
      notifyAlert("Post criado com sucesso!", "green");
      window.location.href = "/";
      setLoading(false);
    } catch (error) {
      notifyAlert(error.response.data.message, "red");
      console.error("Error creating post:", error);
      setLoading(false);
    }
  };

  return loading ? (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <CircularProgress style={{ color: partnerColor() }} />
    </div>
  ) : (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "1rem",
      }}
    >
      <HOne
        style={{
          color: partnerColor(),
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        Nova Postagem
      </HOne>

      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "4px",
          padding: "2rem",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
      >
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
          onSubmit={handleSubmit}
        >
          {/* Título */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              📝 Título da Postagem *
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              placeholder="Digite o título da postagem"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #e2e8f0",
                borderRadius: "4px",
                fontSize: "16px",
                outline: "none",
                transition: "border-color 0.2s",
                backgroundColor: "#f8fafc",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = partnerColor();
                e.target.style.backgroundColor = "#ffffff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.backgroundColor = "#f8fafc";
              }}
            />
          </div>

          {/* Vídeo (opcional) */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              📹 URL do Vídeo (YouTube/Vimeo){" "}
              <span style={{ color: "#888", fontWeight: 400 }}>(opcional)</span>
            </label>
            <input
              type="url"
              value={newVideoUrl}
              onChange={(e) => setNewVideoUrl(e.target.value)}
              placeholder="Cole aqui a URL do vídeo"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #e2e8f0",
                borderRadius: "4px",
                fontSize: "16px",
                outline: "none",
                backgroundColor: "#f8fafc",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = partnerColor();
                e.target.style.backgroundColor = "#ffffff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.backgroundColor = "#f8fafc";
              }}
            />
          </div>

          {/* Editor de Texto */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              ✍️ Conteúdo da Postagem *
            </label>
            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "4px",
                backgroundColor: "#ffffff",
                minHeight: "300px",
                overflow: "hidden",
              }}
            >
              <HTMLEditor onChange={handleTextChange} initialContent={"."} />
            </div>
          </div>

          {/* Botão Submit */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1rem",
            }}
          >
            <button
              type="submit"
              style={{
                backgroundColor: partnerColor(),
                color: "#ffffff",
                border: "none",
                padding: "12px 24px",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              <i className="fa fa-plus" />
              Criar Postagem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewPost;
