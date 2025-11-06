import React, { useState } from "react";
import { uploadImageViaBackend } from "../../../../Resources/ImgUpload";

export type SingleImagesBlock = {
  type: "singleimages";
  subtitle?: string;
  order?: number;
  images: string[]; // array de URLs
};

type Props = {
  value: SingleImagesBlock;
  onChange: (next: SingleImagesBlock) => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  headers?: any; // p/ upload autenticado, se necessário
};

const ghostBtn: React.CSSProperties = {
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  backgroundColor: "white",
  color: "#0f172a",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 13,
};
const dangerBtn: React.CSSProperties = {
  borderRadius: 8,
  border: "1px solid #ef4444",
  backgroundColor: "#ef4444",
  color: "white",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
};

export default function SingleImagesEditor({
  value,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  headers,
}: Props) {
  const [show, setShow] = useState(true);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const update = (patch: Partial<SingleImagesBlock>) =>
    onChange({ ...value, ...patch });

  const addUrl = () => {
    if (!urlInput.trim()) return;
    const next = [...(value.images || []), urlInput.trim()];
    update({ images: next });
    setUrlInput("");
  };

  const removeAt = (i: number) => {
    const next = [...(value.images || [])];
    next.splice(i, 1);
    update({ images: next });
  };

  const moveImg = (from: number, to: number) => {
    const imgs = [...(value.images || [])];
    if (to < 0 || to >= imgs.length) return;
    const [item] = imgs.splice(from, 1);
    imgs.splice(to, 0, item);
    update({ images: imgs });
  };

  const onPickFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setErr(null);
    setUploading(true);
    try {
      const uploaded: string[] = [];
      // aceita múltiplos
      for (const f of Array.from(files)) {
        const url = await uploadImageViaBackend(f, {
          folder: "/lessons/singleimages",
          fileName: `single_${Date.now()}_${f.name}`,
          headers,
        });
        uploaded.push(url);
      }
      update({ images: [...(value.images || []), ...uploaded] });
    } catch (e: any) {
      console.error(e);
      setErr("Falha ao enviar uma ou mais imagens.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        padding: 12,
        background: "linear-gradient(to right, #eef2ff77, #ffffff)",
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
          style={{ cursor: "pointer", fontSize: 16, color: "#0f172a" }}
          onClick={() => setShow(!show)}
        >
          Single Images {value.subtitle ? `- ${value.subtitle}` : ""}
        </strong>

        <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div>
            {onMoveUp && (
              <button title="Mover ↑" onClick={onMoveUp} style={ghostBtn}>
                ↑
              </button>
            )}
            {onMoveDown && (
              <button title="Mover ↓" onClick={onMoveDown} style={ghostBtn}>
                ↓
              </button>
            )}
          </div>
          {onRemove && (
            <button onClick={onRemove} style={dangerBtn}>
              Remover bloco
            </button>
          )}
        </span>
      </div>

      {show && (
        <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
          {/* Subtitle */}
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#334155" }}>Subtitle</label>
            <input
              value={value.subtitle ?? ""}
              onChange={(e) => update({ subtitle: e.target.value })}
              placeholder="Ex.: Practice giving directions with the image below:"
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: 8,
                fontSize: 13,
              }}
            />
          </div>

          {/* Adicionar por URL */}
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#334155" }}>
              Adicionar imagem por URL
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 8,
              }}
            >
              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://..."
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: 8,
                  fontSize: 13,
                }}
              />
              <button onClick={addUrl} style={ghostBtn}>
                + Adicionar
              </button>
            </div>
          </div>

          {/* Upload múltiplo */}
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#334155" }}>
              Upload (múltiplas imagens)
            </label>
            <label
              style={{
                ...ghostBtn,
                display: "inline-block",
                textAlign: "center",
              }}
            >
              {uploading ? "Enviando..." : "Selecionar arquivos"}
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={(e) => onPickFiles(e.target.files)}
                disabled={uploading}
              />
            </label>
            {err && <small style={{ color: "#b91c1c" }}>{err}</small>}
          </div>

          {/* Grid de previews + ações por item */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 12,
            }}
          >
            {(value.images || []).map((img, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "white",
                  display: "grid",
                  gridTemplateRows: "140px auto",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 140,
                    background: "#f8fafc",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {/* preview */}
                  <img
                    src={img}
                    alt={`img-${i}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                    onError={(e) =>
                      ((e.currentTarget as HTMLImageElement).style.display =
                        "none")
                    }
                  />
                </div>

                <div style={{ padding: 8, display: "grid", gap: 6 }}>
                  <input
                    value={img}
                    onChange={(e) => {
                      const next = [...(value.images || [])];
                      next[i] = e.target.value;
                      update({ images: next });
                    }}
                    style={{
                      width: "100%",
                      border: "1px solid #e2e8f0",
                      borderRadius: 6,
                      padding: "6px 8px",
                      fontSize: 12,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      justifyContent: "space-between",
                    }}
                  >
                    <button style={ghostBtn} onClick={() => moveImg(i, i - 1)}>
                      ↑
                    </button>
                    <button style={ghostBtn} onClick={() => moveImg(i, i + 1)}>
                      ↓
                    </button>
                    <button style={dangerBtn} onClick={() => removeAt(i)}>
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dica */}
          <small style={{ color: "#64748b" }}>
            Dica: use imagens quadradas ou retangulares com boa resolução (ex.:
            800px+ no maior lado).
          </small>
        </div>
      )}
    </div>
  );
}
