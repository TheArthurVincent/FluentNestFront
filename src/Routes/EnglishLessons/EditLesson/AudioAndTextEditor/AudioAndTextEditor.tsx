import React, { useState } from "react";
import { uploadImageViaBackend } from "../../../../Resources/ImgUpload";
import { notifyAlert } from "../../Assets/Functions/FunctionLessons";
import { partnerColor } from "../../../../Styles/Styles";
import {
  backDomain,
  truncateString,
} from "../../../../Resources/UniversalComponents";
import SimpleAIGenerator from "../AIGenerator/AIGenerator";

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
  studentId: any;
  language: string;
  onChange: (next: AudioBlock) => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  headers?: any; // para envio autenticado se necessário
  // opcional: disparar re-render no pai
  setChange?: any;
  change?: any;
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

const primaryBtnStyle: React.CSSProperties = {
  borderRadius: 8,
  border: "1px solid #0891b2",
  backgroundColor: "#06b6d4",
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
  studentId,
  language,
  setChange,
  change,
}: Props) {
  const studentPermissions = JSON.parse(
    localStorage.getItem("loggedIn") || "null",
  );

  const [showConfig, setShowConfig] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);

  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const [aiOpen, setAiOpen] = useState(false);

  const update = (patch: Partial<AudioBlock>) =>
    onChange({ ...value, ...patch, type: "audio" });

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

  // upload do arquivo de áudio (opcional)
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

  // ===== Helpers IA
  function parseMaybeJson(input: any): any {
    if (Array.isArray(input) || (input && typeof input === "object"))
      return input;
    if (typeof input !== "string") return input;
    const cleaned = input
      .trim()
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/, "")
      .trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      return input;
    }
  }

  // extrai src de iframes (ex.: SoundCloud embed)
  function extractSrcFromIframe(linkOrHtml: string): string {
    if (!linkOrHtml || typeof linkOrHtml !== "string") return linkOrHtml;
    const html = linkOrHtml.trim();
    if (!html.includes("<iframe")) return linkOrHtml;
    const m = html.match(/src=["']([^"']+)["']/i);
    return m?.[1] || linkOrHtml;
  }

  // normaliza campos típicos {text, link, image} ou similares
  function normalizeAudioPayload(raw: any): Partial<AudioBlock> {
    if (!raw) return {};
    if (typeof raw === "string") {
      // se for só texto longo, preenche text
      return { text: raw };
    }
    if (Array.isArray(raw)) {
      // se vier array, junta em parágrafos
      return {
        text: raw
          .map((x) => (typeof x === "string" ? x : JSON.stringify(x)))
          .join("\n\n"),
      };
    }
    if (typeof raw === "object") {
      const text =
        raw.text ??
        raw.body ??
        raw.content ??
        raw.transcript ??
        raw.caption ??
        raw.description ??
        "";
      let link = raw.link ?? raw.url ?? raw.audio ?? raw.src ?? raw.sound ?? "";
      const image =
        raw.image ?? raw.cover ?? raw.thumbnail ?? raw.icon ?? undefined;

      link = typeof link === "string" ? extractSrcFromIframe(link) : link;

      return {
        text: typeof text === "string" ? text : JSON.stringify(text ?? ""),
        link: typeof link === "string" ? link : "",
        image: typeof image === "string" ? image : undefined,
      };
    }
    return {};
  }

  const handleReceiveJson = (raw: any) => {
    const json = parseMaybeJson(raw);

    // suporta envelopes {data|result|json|item}
    let payload: any = json;
    if (json && typeof json === "object" && !Array.isArray(json)) {
      const inner =
        json.data ??
        json.result ??
        json.json ??
        json.item ??
        json.response ??
        null;
      if (inner) payload = parseMaybeJson(inner);
    }

    const norm = normalizeAudioPayload(payload);
    if (!norm.text && !norm.link && !norm.image) {
      notifyAlert(
        "Não reconheci campos para Audio. Retorne { text, link?, image? } ou um texto simples.",
        partnerColor(),
      );
      console.warn("IA (bruto) audio:", raw);
      return;
    }

    update({
      text: norm.text ?? value.text,
      link: norm.link ?? value.link,
      image: norm.image ?? value.image,
    });

    setShowConfig(true);
    setChange?.(!change);
  };

  // detecta se é embed de soundcloud player
  const isSoundCloudEmbed =
    typeof value.link === "string" &&
    value.link.includes("w.soundcloud.com/player");

  // preview de áudio genérico
  const canHtml5Audio =
    typeof value.link === "string" &&
    /^https?:\/\//i.test(value.link) &&
    !isSoundCloudEmbed;

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 6,
        padding: "5px 12px",
        background: "linear-gradient(to right, #f7dbfe55, #ffffff)",
        display: "grid",
        gap: 10,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
            : "Adicione  um título"}
        </strong>
        <span
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
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
          {/* IA */}
          <button
            style={primaryBtnStyle}
            onClick={() => setAiOpen(true)}
            title="Gerar texto/áudio por IA"
          >
            ✨ IA
          </button>
          {onRemove && (
            <button onClick={onRemove} style={dangerBtnStyle}>
              <i className="fa fa-trash" />
            </button>
          )}
        </span>
      </div>
      {showConfig && (
        <div style={{ display: "grid", gap: 12 }}>
          {/* Subtitle */}
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
          {studentPermissions.permissions == "superadmin" && (
            <div style={{ display: "grid", gap: 12, alignItems: "end" }}>
              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: 12, color: "#334155" }}>
                  Link do áudio
                </label>
                <input
                  value={value.link ?? ""}
                  onChange={(e) =>
                    update({ link: extractSrcFromIframe(e.target.value) })
                  }
                  placeholder='Cole a URL (Drive/CDN) ou um <iframe> de embed (pegarei o "src")'
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
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <label
                    style={{
                      ...ghostBtnStyle,
                      display: "inline-block",
                      textAlign: "center",
                    }}
                  >
                    {uploadingAudio ? "Enviando áudio..." : "Upload de áudio"}
                    <input
                      type="file"
                      accept="audio/*"
                      style={{ display: "none" }}
                      onChange={(e) => onPickAudio(e.target.files?.[0] || null)}
                      disabled={uploadingAudio}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

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

      {/* Modal IA: gera { text, link?, image? } */}
      <SimpleAIGenerator
        visible={aiOpen}
        language1={language || "en"}
        type="audio"
        onClose={() => setAiOpen(false)}
        postUrl={`${backDomain}/api/v1/generateSection/${studentId}`} // seu endpoint: ajuste se preferir usar /:studentId
        headers={headers}
        onReceiveJson={handleReceiveJson}
        title="Gerar Text & Audio por IA"
      />
    </div>
  );
}
