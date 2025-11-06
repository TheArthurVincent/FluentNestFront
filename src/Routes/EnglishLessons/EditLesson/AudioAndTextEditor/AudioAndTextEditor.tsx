import React, { useState } from "react";
import { uploadImageViaBackend } from "../../../../Resources/ImgUpload";

export type AudioBlock = {
  type: "audio";
  subtitle?: string;
  order?: number;
  text: string; // texto que acompanha o áudio
  link: string; // URL do arquivo de áudio (Drive, CDN, etc.)
  image?: string; // ícone/capa
};

type Props = {
  value: AudioBlock;
  onChange: (next: AudioBlock) => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  headers?: any; // para envio autenticado se necessário
};

const ghostBtnStyle: React.CSSProperties = {
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  backgroundColor: "white",
  color: "#0f172a",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 13,
};

const dangerBtnStyle: React.CSSProperties = {
  borderRadius: 8,
  border: "1px solid #ef4444",
  backgroundColor: "#ef4444",
  color: "white",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
};
export default function AudioAndTextEditor({
  value,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  headers,
}: Props) {
  const [showConfig, setShowConfig] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);

  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const update = (patch: Partial<AudioBlock>) =>
    onChange({ ...value, ...patch });

  const onPickCover = async (file: File | null) => {
    if (!file) return;
    try {
      setCoverError(null);
      setUploadingCover(true);
      const url = await uploadImageViaBackend(file, {
        folder: "/lessons/audio/covers",
        fileName: `audio_cover_${Date.now()}_${file.name}`,
        headers,
      });
      update({ image: url });
    } catch (e: any) {
      setCoverError("Falha ao enviar imagem. Tente novamente.");
      console.error(e?.message || e);
    } finally {
      setUploadingCover(false);
    }
  };

  // OPCIONAL: upload do arquivo de áudio (usa o mesmo helper; seu backend deve aceitar)
  const onPickAudio = async (file: File | null) => {
    if (!file) return;
    try {
      setAudioError(null);
      setUploadingAudio(true);
      const url = await uploadImageViaBackend(file, {
        folder: "/lessons/audio/files",
        fileName: `audio_${Date.now()}_${file.name}`,
        headers,
      });
      update({ link: url });
    } catch (e: any) {
      setAudioError("Falha ao enviar áudio. Tente novamente.");
      console.error(e?.message || e);
    } finally {
      setUploadingAudio(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 6,
        padding: 10,
        background: "linear-gradient(to right, #f7dbfe55, #ffffff)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong
          onClick={() => setShowConfig(!showConfig)}
          style={{
            cursor: "pointer",
            fontSize: 16,
            color: "#0f172a",
          }}
        >
          Text & Audio {value.subtitle ? `- ${value.subtitle}` : ""}
        </strong>
        <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div>
            {onMoveUp && (
              <button onClick={onMoveUp} style={ghostBtnStyle} title="Mover ↑">
                ↑
              </button>
            )}
            {onMoveDown && (
              <button
                onClick={onMoveDown}
                style={ghostBtnStyle}
                title="Mover ↓"
              >
                ↓
              </button>
            )}
          </div>
          {onRemove && (
            <button onClick={onRemove} style={dangerBtnStyle}>
              Remover bloco
            </button>
          )}
        </span>
      </div>

      {showConfig && (
        <div style={{ display: "grid", gap: 12 }}>
          {/* Linha: Subtitle / Order */}
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#334155" }}>Subtitle</label>
            <input
              value={value.subtitle ?? ""}
              onChange={(e) => update({ subtitle: e.target.value })}
              placeholder="Ex.: Life Expectancy Audio Explanation"
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: 8,
                fontSize: 13,
              }}
            />
          </div>

          {/* Texto longo */}
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#334155" }}>Text</label>
            <textarea
              value={value.text ?? ""}
              onChange={(e) => update({ text: e.target.value })}
              rows={8}
              placeholder="Texto que acompanha o áudio..."
              style={{
                width: "100%",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: 10,
                fontSize: 13,
                lineHeight: 1.45,
              }}
            />
          </div>

          {/* Área: Link do áudio + Upload opcional */}
          <div
            style={{
              display: "grid",
              gap: 12,
              alignItems: "end",
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>
                Link do áudio
              </label>
              <input
                value={value.link ?? ""}
                onChange={(e) => update({ link: e.target.value })}
                placeholder="Cole a URL do áudio (Drive, CDN, etc.)"
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: 8,
                  fontSize: 13,
                }}
              />
              {audioError && (
                <small style={{ color: "#b91c1c" }}>{audioError}</small>
              )}
            </div>
          </div>

          {/* Capa/ícone do áudio */}
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "110px 1fr",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 96,
                height: 96,
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                overflow: "hidden",
                display: "grid",
                placeItems: "center",
                background: "#f8fafc",
              }}
            >
              {value.image ? (
                <img
                  src={value.image}
                  alt="cover"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: 11, color: "#64748b" }}>Sem capa</span>
              )}
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <label
                  style={{
                    ...ghostBtnStyle,
                    display: "inline-block",
                    textAlign: "center",
                  }}
                >
                  {uploadingCover ? "Enviando..." : "Upload capa/ícone"}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => onPickCover(e.target.files?.[0] || null)}
                    disabled={uploadingCover}
                  />
                </label>

                <button
                  style={ghostBtnStyle}
                  onClick={() => update({ image: "" })}
                >
                  Remover capa
                </button>
              </div>
              {coverError && (
                <small style={{ color: "#b91c1c" }}>{coverError}</small>
              )}
              <small style={{ color: "#64748b" }}>
                Dica: use um ícone quadrado (ex.: 512×512) para melhor
                visualização.
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
