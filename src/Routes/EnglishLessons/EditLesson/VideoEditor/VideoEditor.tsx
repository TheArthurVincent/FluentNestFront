import React, { useMemo, useState } from "react";
import { truncateString } from "../../../../Resources/UniversalComponents";

export type VideoBlock = {
  subtitle?: string;
  comments?: string; // ✅ novo
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
  onMoveUp?: () => void;
  onMoveDown?: () => void;
};

export default function VideoEditor({
  value,
  onChange,
  onRemove,
  titleRightExtra,
  onMoveUp,
  onMoveDown,
}: Props) {
  const [forcePreviewKey, setForcePreviewKey] = useState(0);
  const [showConfig, setShowConfig] = useState(true);

  const update = (patch: Partial<VideoBlock>) =>
    onChange({
      ...value,
      ...patch,
      comments: patch.comments ?? value.comments ?? "", // ✅ garante string
    });

  const updateSubtitle = (subtitle: string) => update({ subtitle });
  const updateVideo = (video: string) => update({ video });
  const updateComments = (comments: string) => update({ comments });

  const trimAll = () => {
    update({
      subtitle: (value.subtitle || "").trim(),
      video: (value.video || "").trim(),
      comments: (value.comments || "").trim(),
    });
  };

  const testPreview = () => setForcePreviewKey((k) => k + 1);

  /* ---------------- helpers de embed ---------------- */
  const classifyVideo = (url?: string) => {
    const u = (url || "").trim();
    if (!u) return { kind: "empty" as const };

    const isFile = /\.(mp4|webm|ogg)(\?|#|$)/i.test(u);
    if (isFile) return { kind: "file" as const, src: u };

    // YouTube
    // https://www.youtube.com/watch?v=ID
    // https://youtu.be/ID
    try {
      const ytMatch1 = u.match(
        /(?:youtube\.com\/watch\?v=)([A-Za-z0-9_\-]{6,})/i,
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
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <strong
          onClick={() => setShowConfig(!showConfig)}
          style={{
            cursor: "pointer",
            fontSize: 12,
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
            ? truncateString(value.subtitle, 25)
            : "Adicione um título"}
        </strong>

        <span
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {titleRightExtra}

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

          {onRemove && (
            <button
              onClick={onRemove}
              style={dangerBtnStyle}
              title="Remover bloco"
            >
              <i className="fa fa-trash" />
            </button>
          )}
        </span>
      </div>

      {showConfig && (
        <>
          {/* Subtitle */}
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#334155" }}>Subtitle</label>
            <input
              value={value.subtitle ?? ""}
              onChange={(e) => updateSubtitle(e.target.value)}
              placeholder="Ex.: Verbs"
              style={inputStyle}
              onBlur={trimAll}
            />
          </div>

          {/* Comments */}
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#334155" }}>Comments</label>
            <textarea
              value={value.comments ?? ""}
              onChange={(e) => updateComments(e.target.value)}
              placeholder="Observações, instruções, contexto..."
              style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
              onBlur={trimAll}
            />
          </div>

          {/* URL do vídeo */}
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#334155" }}>
              Vídeo (YouTube / Vimeo / MP4)
            </label>
            <input
              type="url"
              value={value.video ?? ""}
              onChange={(e) => updateVideo(e.target.value)}
              placeholder="Ex.: https://youtu.be/ID | https://vimeo.com/123456789 | https://site.com/video.mp4"
              style={inputStyle}
              onBlur={trimAll}
            />

            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={testPreview}
                style={ghostBtnStyle}
                title="Forçar recarregar a prévia"
              >
                Testar link
              </button>

              {!isValid && (value.video || "").trim() && (
                <span style={{ color: "#b91c1c", fontSize: 12 }}>
                  URL não reconhecida. Use YouTube, Vimeo ou arquivo
                  .mp4/.webm/.ogg.
                </span>
              )}
            </div>
          </div>

          {/* Preview responsivo */}
          {(value.video || "").trim() && (
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>Prévia</label>

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
                    <iframe
                      src={embed.src}
                      title="video preview"
                      style={iframeStyle}
                    />
                  )}
                </div>
              </div>

              <small style={{ color: "#64748b" }}>
                YouTube: <code>youtube.com/watch?v=ID</code> ou{" "}
                <code>youtu.be/ID</code>. Vimeo:{" "}
                <code>vimeo.com/123456789</code>. Arquivo: link direto{" "}
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
  boxSizing: "border-box",
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
  paddingBottom: "56.25%",
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
