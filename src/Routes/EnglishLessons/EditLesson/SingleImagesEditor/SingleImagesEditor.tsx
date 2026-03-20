import React, { useCallback, useState } from "react";
import { uploadImageViaBackend } from "../../../../Resources/ImgUpload";
import { truncateString } from "../../../../Resources/UniversalComponents";

export type SingleImagesBlock = {
  type: "singleimages";
  subtitle?: string;
  comments?: string; // ✅ novo
  order?: number;
  images: string[];
};

type Props = {
  value: SingleImagesBlock;
  onChange: (next: SingleImagesBlock) => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  headers?: any;
};

const ghostBtn: React.CSSProperties = {
  borderRadius: 6,
  border: "1px solid #e2e8f0",
  backgroundColor: "white",
  color: "#0f172a",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 13,
};

const dangerBtn: React.CSSProperties = {
  borderRadius: 6,
  border: "1px solid #ef4444",
  backgroundColor: "#ef4444",
  color: "white",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 6,
  padding: 8,
  fontSize: 13,
  width: "100%",
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
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const update = (patch: Partial<SingleImagesBlock>) =>
    onChange({
      ...value,
      ...patch,
      comments: patch.comments ?? value.comments ?? "", // ✅ garante string
      images: patch.images ?? value.images ?? [],
    });

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

  const addByUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setErr(null);
    setUploading(true);

    try {
      const uploaded: string[] = [];

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

  const replaceAt = async (i: number, file: File | null) => {
    if (!file) return;
    setErr(null);
    setUploading(true);

    try {
      const url = await uploadImageViaBackend(file, {
        folder: "/lessons/singleimages",
        fileName: `single_replace_${Date.now()}_${file.name}`,
        headers,
      });

      const next = [...(value.images || [])];
      next[i] = url;
      update({ images: next });
    } catch (e: any) {
      console.error(e);
      setErr("Falha ao substituir a imagem.");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (uploading) return;
      await addByUpload(e.dataTransfer.files);
    },
    [uploading],
  );

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 6,
        padding: "5px 12px",
        background: "linear-gradient(to right, #eef2ff77, #ffffff)",
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <strong
          onClick={() => setShow(!show)}
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
            className={show ? "fa fa-arrow-down" : "fa fa-arrow-right"}
            style={{ color: "#0f172a" }}
          />
          {value.subtitle
            ? truncateString(value.subtitle, 25)
            : "Adicione um título"}
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
            <button onClick={onRemove} style={dangerBtn} title="Remover bloco">
              <i className="fa fa-trash" />
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
              style={inputStyle}
            />
          </div>

          {/* Comments */}
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#334155" }}>Comments</label>
            <textarea
              value={value.comments ?? ""}
              onChange={(e) => update({ comments: e.target.value })}
              placeholder="Observações, instruções, contexto..."
              style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
            />
          </div>

          {/* Upload múltiplo (adicionar) */}
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#334155" }}>
              Upload (múltiplas imagens) — obrigatório para gerar a URL
            </label>

            <label
              style={{
                ...ghostBtn,
                display: "inline-block",
                textAlign: "center",
                opacity: uploading ? 0.7 : 1,
                cursor: uploading ? "not-allowed" : "pointer",
              }}
            >
              {uploading ? "Enviando..." : "Selecionar arquivos"}
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={(e) => addByUpload(e.target.files)}
                disabled={uploading}
              />
            </label>

            <small style={{ color: "#64748b" }}>
              Você também pode arrastar e soltar as imagens aqui.
            </small>
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
                  borderRadius: 6,
                  overflow: "hidden",
                  background: "white",
                  display: "grid",
                  gridTemplateRows: "140px auto",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 150,
                    background: "#f8fafc",
                    display: "grid",
                    placeItems: "center",
                    position: "relative",
                  }}
                >
                  <a
                    style={{
                      position: "absolute",
                      top: 6,
                      left: 8,
                      fontSize: 12,
                      color: "#2563eb",
                      textDecoration: "underline",
                      background: "rgba(255,255,255,0.85)",
                      padding: "2px 6px",
                      borderRadius: 6,
                    }}
                    href={img}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir
                  </a>

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

                <div style={{ padding: 8, display: "grid", gap: 8 }}>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Substituir por upload */}
                    <label
                      style={{
                        ...ghostBtn,
                        opacity: uploading ? 0.7 : 1,
                        cursor: uploading ? "not-allowed" : "pointer",
                      }}
                      title="Substituir imagem"
                    >
                      Substituir
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) =>
                          replaceAt(i, e.target.files?.[0] || null)
                        }
                        disabled={uploading}
                      />
                    </label>

                    <button
                      style={ghostBtn}
                      onClick={() => moveImg(i, i - 1)}
                      disabled={uploading}
                      title="Mover para cima"
                    >
                      ↑
                    </button>

                    <button
                      style={ghostBtn}
                      onClick={() => moveImg(i, i + 1)}
                      disabled={uploading}
                      title="Mover para baixo"
                    >
                      ↓
                    </button>

                    <button
                      style={dangerBtn}
                      onClick={() => removeAt(i)}
                      disabled={uploading}
                      title="Excluir"
                    >
                      Excluir
                    </button>
                  </div>

                  <div style={{ fontSize: 12, color: "#64748b" }}>#{i + 1}</div>
                </div>
              </div>
            ))}
          </div>

          <small style={{ color: "#64748b" }}>
            Dica: use imagens quadradas/retangulares com boa resolução (≥ 800px
            no maior lado).
          </small>
        </div>
      )}
    </div>
  );
}
