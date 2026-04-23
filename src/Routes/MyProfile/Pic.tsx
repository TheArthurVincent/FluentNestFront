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
    fontFamily: "Lato",
    fontWeight: 600,
    fontStyle: "SemiBold",
    fontSize: "14px",
  };

  const buttonStyle: React.CSSProperties = {
    ...fontBase,
    cursor: "pointer",
    padding: "10px 14px",
    borderRadius: "6px",
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
        picture={
          user.picture ||
          "https://ik.imagekit.io/vjz75qw96/logos/myp?updatedAt=1752031657485"
        }
        change={change ?? false}
        headers={headers}
        _StudentId={user.id}
      />
      <label htmlFor="avatar-file">
        <div
          style={{ ...buttonStyle, position: "relative", overflow: "hidden" }}
        >
          <i className="fa fa-upload" aria-hidden="false" />
          Alterar foto
        </div>
      </label>
      <input
        id="avatar-file"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{
          fontFamily: "Lato",
          fontWeight: 600,
          border: "none",
          outline: "none",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          opacity: 0,
          fontStyle: "SemiBold",
          fontSize: "14px",
        }}
        onChange={handleFileChange}
      />
    </div>
  );
}
