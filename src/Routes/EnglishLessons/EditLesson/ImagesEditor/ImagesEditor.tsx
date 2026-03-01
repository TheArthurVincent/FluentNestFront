import React, { useMemo, useState } from "react";
import { uploadImageViaBackend } from "../../../../Resources/ImgUpload";
import { truncateString } from "../../../../Resources/UniversalComponents";

export type ImageLanguages = {
  language1: string; // língua associada ao "english"
  language2: string; // língua associada ao "portuguese"
};

export type ImageEntry = {
  img: string; // URL final (ImageKit)
  text?: string; // ✅ sempre espelha "english"
  english?: string; // label 1
  portuguese?: string; // label 2
  languages?: ImageLanguages; // opcional; default en/pt
};

export interface ImagesBlock {
  type: "images";
  subtitle?: string;
  comments?: string; // ✅ novo (não é description)
  order?: number;
  grid?: number;
  images: ImageEntry[];
}

type Props = {
  value: ImagesBlock;
  onChange: (next: ImagesBlock) => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  headers?: any; // para o upload
};

/* ===================== CONSTANTS ===================== */
const LANG_DEFAULT: ImageLanguages = { language1: "en", language2: "pt" };

const rowStyles: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 8,
  alignItems: "center",
  justifyContent: "center",
  justifyItems: "center",
  alignContent: "center",
  marginBottom: 25,
  borderTop: "1px solid #e2e8f0",
  borderBottom: "1px solid #e2e8f0",
  padding: "8px 0",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: 8,
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

const headerBtnWrap: React.CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "center",
};

export default function ImagesEditor({
  value,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  headers,
}: Props) {
  const [showConfig, setShowConfig] = useState(true);
  const images = useMemo(() => value.images ?? [], [value.images]);

  const updateBlock = (patch: Partial<ImagesBlock>) =>
    onChange({
      ...value,
      ...patch,
      type: "images",
      comments: patch.comments ?? value.comments ?? "",
      images: patch.images ?? value.images ?? [],
    });

  const ensureLanguages = (item: ImageEntry): ImageEntry => {
    if (!item.languages) return { ...item, languages: LANG_DEFAULT };
    return item;
  };

  const commitImageAt = (index: number, next: ImageEntry) => {
    const normalized: ImageEntry = {
      ...ensureLanguages(next),
      // ✅ garante text sempre = english
      text: (next.english ?? "").toString(),
    };

    const nextImages = images.slice();
    nextImages[index] = normalized;

    updateBlock({ images: nextImages });
  };

  const updateImageAt = (index: number, patch: Partial<ImageEntry>) => {
    const current = ensureLanguages(images[index]);
    commitImageAt(index, { ...current, ...patch });
  };

  const removeImageAt = (index: number) => {
    const nextImages = images.slice();
    nextImages.splice(index, 1);
    updateBlock({ images: nextImages });
  };

  const addImage = () => {
    const nextImages = images.slice();
    nextImages.push({
      img: "",
      english: "",
      portuguese: "",
      text: "",
      languages: LANG_DEFAULT,
    });
    updateBlock({ images: nextImages });
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const nextImages = images.slice();
    const [item] = nextImages.splice(from, 1);
    nextImages.splice(to, 0, item);
    updateBlock({ images: nextImages });
  };

  const onPickImage = async (file: File | null, idx: number) => {
    if (!file) return;
    const url = await uploadImageViaBackend(file, {
      folder: "/lessons/images",
      fileName: `lesson_images_${Date.now()}_${file.name}`,
      headers,
    });
    updateImageAt(idx, { img: url });
  };

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 6,
        padding: "5px 12px",
        background: "linear-gradient(to right, #36dbd355, #ffffff)",
        display: "grid",
        gap: 12,
      }}
    >
      {/* Header do bloco */}
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
            : "Adicione um título"}
        </strong>

        <span style={headerBtnWrap}>
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
        <div style={{ display: "grid", gap: 12 }}>
          {/* Subtitle */}
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#334155" }}>Subtitle</label>
            <input
              value={value.subtitle ?? ""}
              onChange={(e) => updateBlock({ subtitle: e.target.value })}
              placeholder="Ex.: Colors"
              style={inputStyle}
            />
          </div>

          {/* Comments */}
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#334155" }}>Comments</label>
            <textarea
              value={value.comments ?? ""}
              onChange={(e) => updateBlock({ comments: e.target.value })}
              placeholder="Observações, instruções, contexto..."
              style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
            />
          </div>

          {/* Linhas */}
          <div style={{ display: "grid", gap: 10 }}>
            {images.map((it, idx) => {
              const withLang = ensureLanguages(it);

              return (
                <div key={idx} style={rowStyles}>
                  {/* Preview + upload */}
                  <div
                    style={{ display: "grid", gap: 6, justifyItems: "center" }}
                  >
                    <div
                      style={{
                        width: 96,
                        height: 72,
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                        overflow: "hidden",
                        display: "grid",
                        placeItems: "center",
                        background: "#f8fafc",
                      }}
                    >
                      {withLang.img ? (
                        <img
                          src={withLang.img}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: 11, color: "#64748b" }}>
                          Sem imagem
                        </span>
                      )}
                    </div>

                    <label
                      style={{
                        ...ghostBtnStyle,
                        display: "inline-block",
                        textAlign: "center",
                      }}
                    >
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) =>
                          onPickImage(e.target.files?.[0] || null, idx)
                        }
                      />
                    </label>
                  </div>

                  {/* Textos */}
                  <div style={{ display: "grid", gap: 12, width: "100%" }}>
                    {/* English (espelha em text) */}
                    <div style={{ display: "grid", gap: 6 }}>
                      <input
                        value={withLang.english ?? ""}
                        onChange={(e) =>
                          updateImageAt(idx, {
                            english: e.target.value,
                            text: e.target.value, // ✅ espelha
                          })
                        }
                        placeholder="Image description"
                        style={inputStyle}
                      />
                    </div>

                    {/* Portuguese */}
                    <div style={{ display: "grid", gap: 6 }}>
                      <input
                        value={withLang.portuguese ?? ""}
                        onChange={(e) =>
                          updateImageAt(idx, { portuguese: e.target.value })
                        }
                        placeholder="Meaning/Description"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Ações da linha */}
                  <div
                    style={{ display: "flex", gap: 4, alignItems: "flex-end" }}
                  >
                    {idx !== 0 && (
                      <button
                        onClick={() => moveImage(idx, idx - 1)}
                        style={ghostBtnStyle}
                        title="↑"
                      >
                        ↑
                      </button>
                    )}
                    {idx !== images.length - 1 && (
                      <button
                        onClick={() => moveImage(idx, idx + 1)}
                        style={ghostBtnStyle}
                        title="↓"
                      >
                        ↓
                      </button>
                    )}
                    <button
                      onClick={() => removeImageAt(idx)}
                      style={dangerBtnStyle}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rodapé */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <button onClick={addImage} style={ghostBtnStyle}>
              + Adicionar imagem
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
