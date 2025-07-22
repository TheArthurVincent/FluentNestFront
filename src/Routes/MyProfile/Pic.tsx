import React, { useEffect, useRef } from "react";
import { ArvinButton } from "../../Resources/Components/ItemsLibrary";
import { notifyAlert } from "../EnglishLessons/Assets/Functions/FunctionLessons";
interface Av {
  user: any;
  setUser: any;
  uploadStudentPhoto: any;
}

export function AvatarUpload({ user, setUser, uploadStudentPhoto }: Av) {
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "center",
        paddingBottom: "1.5rem",
      }}
    >
      {/* Avatar clicável */}
      <img
        src={
          user.picture ||
          "https://ik.imagekit.io/vjz75qw96/logos/myp?updatedAt=1752031657485"
        }
        alt="Profile"
        onClick={() => fileInputRef.current?.click()}
        style={{
          width: "8rem",
          height: "8rem",
          borderRadius: "50%",
          objectFit: "cover",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      />

      {/* Input de arquivo (único e com ref funcional) */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Botão alternativo de upload */}
      <ArvinButton onClick={() => fileInputRef.current?.click()}>
        Nova foto
      </ArvinButton>
    </div>
  );
}
