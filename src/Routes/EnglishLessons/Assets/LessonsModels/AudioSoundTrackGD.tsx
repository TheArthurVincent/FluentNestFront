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
  selectedVoice: any;
}

export default function AudioFile({ element, selectedVoice }: AudioFileProps) {
  // Extrair o ID do arquivo do Google Drive
  const getFileId = (url: string): string => {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : "";
  };

  const fileId = getFileId(element.link);

  return (
    <div style={{ marginBottom: "2rem" }}>
      {/* Player de áudio do Google Drive via iframe */}
      {fileId && (
        <div style={{ marginBottom: "1rem" }}>
          <iframe
            src={`https://drive.google.com/file/d/${fileId}/preview`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay"
            title="Audio Player"
            style={{
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>
      )}

      {/* Texto da lição */}
      {element.text && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            lineHeight: "1.6",
            fontSize: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div style={{ color: "#444" }}>{element.text}</div>
        </div>
      )}
    </div>
  );
}
