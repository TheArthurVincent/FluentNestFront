import React, { useMemo, useState } from "react";
import { truncateString } from "../../../../Resources/UniversalComponents";
export type VideoBlock = {
  subtitle?: string;
  type: "video";
  video?: string;
  order?: number;
  grid?: number;
};

type Props = {
  value: VideoBlock;
  onChange: (next: VideoBlock) => void;
  onRemove?: () => void;
  titleRightExtra?: any;
  onMoveUp?: () => void; // NOVO
  onMoveDown?: () => void; // NOVO
};

export default function VideoEditor({
  value,
  onChange,
  onRemove,
  titleRightExtra,
  onMoveUp,
  onMoveDown,
}: Props) {
  const [forcePreviewKey, setForcePreviewKey] = useState(0); // para recarregar preview
  const [showConfig, setShowConfig] = useState(false);

  const updateSubtitle = (subtitle: string) => onChange({ ...value, subtitle });
  const updateVideo = (video: string) => onChange({ ...value, video });

  const trimAll = () => {
    onChange({
      ...value,
      subtitle: (value.subtitle || "").trim(),
      video: (value.video || "").trim(),
    });
  };

  const testPreview = () => {
    // força recarregar o iframe/video
    setForcePreviewKey((k) => k + 1);
  };

  // --- helpers de embed ---
  const classifyVideo = (url?: string) => {
    const u = (url || "").trim();
    if (!u) return { kind: "empty" as const };

    const isMP4 = /\.(mp4|webm|ogg)(\?|#|$)/i.test(u);
    if (isMP4) return { kind: "file" as const, src: u };

    // YouTube
    // https://www.youtube.com/watch?v=ID
    // https://youtu.be/ID
    try {
      const ytMatch1 = u.match(
        /(?:youtube\.com\/watch\?v=)([A-Za-z0-9_\-]{6,})/i
      );
      const ytMatch2 = u.match(/(?:youtu\.be\/)([A-Za-z0-9_\-]{6,})/i);
      const ytId = ytMatch1?.[1] || ytMatch2?.[1];
      if (ytId) {
        return {
          kind: "youtube" as const,
          src: `https://www.youtube.com/embed/${ytId}`,
        };
      }
    } catch {}

    // Vimeo
    // https://vimeo.com/123456789
    try {
      const vmMatch = u.match(/vimeo\.com\/(\d+)/i);
      const vmId = vmMatch?.[1];
      if (vmId) {
        return {
          kind: "vimeo" as const,
          src: `https://player.vimeo.com/video/${vmId}`,
        };
      }
    } catch {}

    // fallback: tentar embed direto (pode falhar, mas deixa o autor decidir)
    return { kind: "unknown" as const, src: u };
  };

  const embed = useMemo(() => classifyVideo(value.video), [value.video]);
  const isValid =
    embed.kind === "file" ||
    embed.kind === "youtube" ||
    embed.kind === "vimeo" ||
    (embed.kind === "unknown" && /^https?:\/\//i.test(embed.src || ""));

  return (
    <div
      style={{
        border: "1px solid #ece2f0ff",
        background: "linear-gradient(to right, #e455552c, #ffffff)",
        borderRadius: 6,
        padding: "5px 12px",
        display: "grid",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <strong
          onClick={() => setShowConfig(!showConfig)}
          style={{
            cursor: "pointer",
            fontSize: 14,
            color: "#0f172a",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <i
            className={showConfig ? "fa fa-arrow-down" : "fa fa-arrow-right"}
            style={{ color: "#0f172a" }}
          />
          {value.subtitle
            ? truncateString(value.subtitle, 15)
            : "Adicione  um título"}{" "}
          | VÍDEO
        </strong>

        <span
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <div>
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveUp?.();
                }}
                style={ghostBtnStyle}
                title="Mover bloco para cima"
              >
                ↑
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveDown?.();
                }}
                style={ghostBtnStyle}
                title="Mover bloco para baixo"
              >
                ↓
              </button>
            </div>
          </div>
          {onRemove && (
            <button onClick={onRemove} style={dangerBtnStyle}>
              <i className="fa fa-trash" />
            </button>
          )}
        </span>
      </div>
      {showConfig && (
        <>
          {/* header + ações */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>Subtitle</label>
              <input
                value={value.subtitle}
                onChange={(e) => updateSubtitle(e.target.value)}
                placeholder="Ex.: Verbs"
                style={inputStyle}
              />
            </div>
          </div>
          {/* URL do vídeo */}
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#334155" }}>
              Vídeo (YouTube/Vimeo/MP4)
            </label>
            <input
              type="url"
              value={value.video}
              onChange={(e) => updateVideo(e.target.value)}
              placeholder="https://vimeo.com/1020740651"
              style={inputStyle}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={testPreview} style={ghostBtnStyle}>
                Testar link
              </button>
              {!isValid && value.video && (
                <span style={{ color: "#b91c1c", fontSize: 12 }}>
                  URL não reconhecida. Use YouTube, Vimeo ou arquivo
                  .mp4/.webm/.ogg.
                </span>
              )}
            </div>
          </div>

          {/* Preview responsivo */}
          {value.video && (
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>Prévia</label>

              {/* container 16:9 responsivo */}
              <div style={ratioBox}>
                <div style={ratioContent} key={forcePreviewKey}>
                  {embed.kind === "youtube" || embed.kind === "vimeo" ? (
                    <iframe
                      src={embed.src}
                      title="video preview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      style={iframeStyle}
                    />
                  ) : embed.kind === "file" ? (
                    <video controls style={videoStyle}>
                      <source src={embed.src} />
                      Seu navegador não suporta vídeo.
                    </video>
                  ) : (
                    // unknown: tentar iframe mesmo assim
                    <iframe
                      src={embed.src}
                      title="video preview"
                      style={iframeStyle}
                    />
                  )}
                </div>
              </div>

              {/* dicas de link */}
              <small style={{ color: "#64748b" }}>
                YouTube: cole a URL do vídeo (ex.:{" "}
                <code>youtube.com/watch?v=ID</code> ou <code>youtu.be/ID</code>
                ). Vimeo: <code>vimeo.com/123456789</code>. Arquivo: link direto{" "}
                <code>.mp4/.webm/.ogg</code>.
              </small>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* -------- estilos -------- */
const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 13,
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

const ratioBox: React.CSSProperties = {
  position: "relative",
  width: "100%",
  paddingBottom: "56.25%", // 16:9
  background: "#0b1220",
  borderRadius: 8,
  overflow: "hidden",
  border: "1px solid #0b1220",
};

const ratioContent: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "grid",
};

const iframeStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  border: "0",
};

const videoStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  background: "black",
  display: "block",
};
