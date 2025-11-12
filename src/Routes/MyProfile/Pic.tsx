import React, { useRef } from "react";
import { notifyAlert } from "../EnglishLessons/Assets/Functions/FunctionLessons";
import LevelCardBlog from "../LevelCard/LevelCardBlog";

interface Av {
  user: any;
  setUser: any;
  change?: boolean;
  headers: any;
  _StudentId: string;
  uploadStudentPhoto: (file: File) => Promise<string>;
}

export function AvatarUpload({
  user,
  setUser,
  change,
  headers,
  _StudentId,
  uploadStudentPhoto,
}: Av) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadStudentPhoto(file);
        setUser((prev: any) => ({ ...prev, picture: url }));
      } catch (error) {
        notifyAlert("Erro ao fazer upload da foto.");
        console.error(error);
      }
    }
  };

  // estilos padrão
  const fontBase: React.CSSProperties = {
    margin: "0 auto",
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 600,
    fontStyle: "SemiBold",
    fontSize: "14px",
  };

  const buttonStyle: React.CSSProperties = {
    ...fontBase,
    cursor: "pointer",
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#111827",
    lineHeight: 1.2,
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "center",
        paddingBottom: "1.5rem",
        zIndex: 1, // garante que o container fique acima
      }}
    >
      {/* Avatar clicável */}
      <LevelCardBlog
        picture={user.picture}
        change={change ?? false}
        headers={headers}
        _StudentId={user.id}
      />

      {/* Botão que dispara o input pelo ref */}
      <button
        type="button"
        style={{
          opacity: 0,
        }}
        onClick={() => {
          // proteção: se algum overlay bloquear, o label abaixo funciona como fallback
          fileInputRef.current?.click();
        }}
      >
        Nova foto
      </button>
      {/* Fallback 100% nativo: label estilizada como botão */}
      <label
        htmlFor="avatar-file"
        style={{
          ...buttonStyle,
          userSelect: "none",
          translate: "transformY(-40px)",
        }}
      >
        Escolher do dispositivo
      </label>

      {/* Input de arquivo (único, com ref e id pro label) */}
      <input
        id="avatar-file"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      />
    </div>
  );
}
