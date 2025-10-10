import React from "react";

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
  selectedVoice,
  hideText,
}: AudioFileProps) {
  // Extrair o ID do arquivo do Google Drive
  const getFileId = (url: string): string => {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : "";
  };

  const fileId = getFileId(element.link);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      {/* Player de áudio do Google Drive via iframe */}
      {fileId && (
        <iframe
          src={`https://drive.google.com/file/d/${fileId}/preview`}
          width="97%"
          height="80"
          allow="autoplay"
          title="Audio Player"
          style={{
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
      )}

      {/* Texto da lição */}
      {element.text && !hideText && (
        <div
          style={{
            padding: "5px",
            lineHeight: "1.6",
            fontSize: "1.1rem",
            marginBottom: "1rem",
          }}
        >
          <div>{element.text}</div>
        </div>
      )}
    </div>
  );
}
