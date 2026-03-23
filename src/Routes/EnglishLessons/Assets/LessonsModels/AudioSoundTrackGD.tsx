import React from "react";
import { readText, globalAudioController } from "../Functions/FunctionLessons";
import { partnerColor } from "../../../../Styles/Styles";

interface AudioElement {
  subtitle: string;
  order: number;
  type: string;
  link: string;
  text: string;
}

interface AudioFileProps {
  element: AudioElement;
  hideText?: boolean;
  selectedVoice: any;
}

export default function AudioFile({
  element,
  hideText,
  selectedVoice,
}: AudioFileProps) {
  const link = (element?.link || "").trim();

  // Verifica se a URL parece do Google Drive
  const isGoogleDrive = (url: string): boolean => {
    try {
      const u = new URL(url);
      return /(^|\.)drive\.google\.com$/i.test(u.hostname);
    } catch {
      return false;
    }
  };

  // Extrai o ID do arquivo em formatos comuns do Drive
  const getDriveFileId = (url: string): string => {
    try {
      const u = new URL(url);

      // 1) /file/d/{id}/preview | /file/d/{id}/view
      const fileDMatch = u.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileDMatch?.[1]) return fileDMatch[1];

      // 2) /open?id={id}
      const openId = u.searchParams.get("id");
      if (openId) return openId;

      // 3) /uc?id={id}
      const ucId = u.searchParams.get("id");
      if (u.pathname.includes("/uc") && ucId) return ucId;

      return "";
    } catch {
      return "";
    }
  };

  const drive = isGoogleDrive(link);
  const fileId = drive ? getDriveFileId(link) : "";

  const LinkOnly = (
    <a
      href={link || "#"}
      
      rel="noopener noreferrer"
      style={{ textDecoration: "underline" }}
    >
      Abrir arquivo de áudio
    </a>
  );

  const handlePause = () => {
    // Pausa qualquer áudio controlado globalmente
    if (globalAudioController.currentAudio) {
      globalAudioController.currentAudio.pause();
      globalAudioController.currentAudio.currentTime = 0;
    }

    // Fallback: se ainda estiver usando speechSynthesis em algum lugar
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handlePlayText = () => {
    if (!element.text) return;
    // restart = true → mata o áudio anterior e toca este
    readText(element.text, true, selectedVoice, undefined, 0.9);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        width: "100%",
      }}
    >
      {/* Caso link ausente */}
      {!link && <></>}

      {/* Caso não seja Drive OU não foi possível extrair o ID */}
      {link && (!drive || !fileId) && LinkOnly}

      {/* Caso seja Drive com ID válido: iframe + aviso + link */}
      {link && drive && fileId && (
        <>
          <iframe
            src={`https://drive.google.com/file/d/${fileId}/preview`}
            width="97%"
            height="80"
            allow="autoplay"
            title="Reprodutor de áudio (Google Drive)"
            style={{
              border: "1px solid #ddd",
              borderRadius: "6px",
            }}
          />
          {/* <div
            style={{ fontSize: "0.9rem", color: "#555", textAlign: "center" }}
          >
            Se o áudio não tocar no player acima,{" "}
            <a
              href={`https://drive.google.com/file/d/${fileId}/preview`}
              
              rel="noopener noreferrer"
              style={{ textDecoration: "underline" }}
            >
              clique aqui para abrir no Google Drive
            </a>
            .
          </div>
          <a
            href={`https://drive.google.com/file/d/${fileId}/preview`}
            
            rel="noopener noreferrer"
          >
            Abrir arquivo de áudio
          </a> */}
        </>
      )}

      {/* Texto da lição (opcional) */}
      {element.text && !hideText && (
        <div
          style={{
            padding: "5px",
            lineHeight: "1.6",
            fontSize: "1.1rem",
            marginBottom: "1rem",
            width: "100%",
          }}
        >
          <div
            style={{
              whiteSpace: "pre-wrap",
              color: "#0f172a",
              padding: "12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>
              {element.text}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
