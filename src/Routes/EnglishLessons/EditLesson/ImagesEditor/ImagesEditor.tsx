import React, { useMemo, useState } from "react";
import { uploadImageViaBackend } from "../../../../Resources/ImgUpload";
import { truncateString } from "../../../../Resources/UniversalComponents";

export type ImageLanguages = {
  language1: string; // língua associada ao "english"
  language2: string; // língua associada ao "portuguese"
};

export type ImageEntry = {
  img: string; // URL final (ImageKit)
  text?: string; // SEMPRE = english (preenchido automaticamente)
  english?: string; // label 1
  portuguese?: string; // label 2
  languages?: ImageLanguages; // opcional; default en/pt
};

export interface ImagesBlock {
  type: "images";
  subtitle?: string;
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

const LANG_OPTIONS = ["en", "pt", "es", "fr"];

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
  padding: "12px 0",
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

  const ensureLanguages = (item: ImageEntry): ImageEntry => {
    if (!item.languages) {
      return { ...item, languages: { language1: "en", language2: "pt" } };
    }
    return item;
  };

  const commitImageAt = (index: number, next: ImageEntry) => {
    // garante text = english
    const normalized: ImageEntry = {
      ...next,
      text: next.english ?? "",
    };
    const nextImages = images.slice();
    nextImages[index] = normalized;
    onChange({ ...value, images: nextImages });
  };

  const updateImageAt = (index: number, patch: Partial<ImageEntry>) => {
    const current = ensureLanguages(images[index]);
    commitImageAt(index, { ...current, ...patch });
  };

  const removeImageAt = (index: number) => {
    const nextImages = images.slice();
    nextImages.splice(index, 1);
    onChange({ ...value, images: nextImages });
  };

  const addImage = () => {
    const nextImages = images.slice();
    nextImages.push({
      img: "",
      english: "",
      portuguese: "",
      text: "",
      languages: { language1: "en", language2: "pt" },
    });
    onChange({ ...value, images: nextImages });
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const nextImages = images.slice();
    const [item] = nextImages.splice(from, 1);
    nextImages.splice(to, 0, item);
    onChange({ ...value, images: nextImages });
  };

  const moveImageUp = (i: number) => moveImage(i, i - 1);
  const moveImageDown = (i: number) => moveImage(i, i + 1);

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
        borderRadius: 12,
        padding: 12,
        background: "white",
      }}
    >
      {/* Header do bloco */}
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
          Images - {value.subtitle && truncateString(value.subtitle, 15)}
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
            <button onClick={onRemove} style={dangerBtnStyle}>
              Remover bloco
            </button>
          )}
        </span>
      </div>

      {showConfig && (
        <div style={{ display: "grid", gap: 12 }}>
          {/* Config do bloco */}
          <div
            style={{
              display: "grid",
              gap: 8,
              gridTemplateColumns: "1fr",
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>Subtitle</label>
              <input
                value={value.subtitle ?? ""}
                onChange={(e) =>
                  onChange({ ...value, subtitle: e.target.value })
                }
                placeholder="Ex.: Colors"
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: 8,
                  fontSize: 13,
                }}
              />
            </div>
          </div>

          {/* Cabeçalho da tabela */}
          {/* <div
            style={{
              ...rowStyles,
              fontWeight: 700,
              color: "#334155",
              borderBottom: "1px solid #e2e8f0",
              paddingBottom: 4,
              marginTop: 6,
            }}
          >
            <span>Pré-visualização</span>
            <span>English (L1)</span>
            <span>Portuguese (L2)</span>
            <span style={{ textAlign: "right" }}>Ações</span>
          </div> */}

          {/* Linhas */}
          <div style={{ display: "grid", gap: 10 }}>
            {images.map((it, idx) => {
              const withLang = ensureLanguages(it);
              return (
                <div key={idx} style={{ ...rowStyles }}>
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
                        onChange={async (e) =>
                          onPickImage(e.target.files?.[0] || null, idx)
                        }
                      />
                    </label>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: 12,
                    }}
                  >
                    {/* ENGLISH + seletor L1 */}
                    <div
                      style={{
                        display: "grid",
                        gap: 6,
                        gridTemplateColumns: "50px 1fr",
                      }}
                    >
                      <select
                        value={withLang.languages!.language1}
                        onChange={(e) =>
                          updateImageAt(idx, {
                            languages: {
                              ...withLang.languages!,
                              language1: e.target.value,
                            },
                          })
                        }
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: 8,
                          background: "white",
                        }}
                      >
                        {LANG_OPTIONS.map((code) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </select>
                      <input
                        value={withLang.english ?? ""}
                        onChange={(e) =>
                          updateImageAt(idx, {
                            english: e.target.value,
                            text: e.target.value,
                          })
                        }
                        placeholder={
                          "Language 1: " + withLang.languages!.language1
                        }
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: 8,
                        }}
                      />
                    </div>

                    {/* PORTUGUESE + seletor L2 */}
                    <div
                      style={{
                        display: "grid",
                        gap: 6,
                        gridTemplateColumns: "50px 1fr",
                      }}
                    >
                      <select
                        value={withLang.languages!.language2}
                        onChange={(e) =>
                          updateImageAt(idx, {
                            languages: {
                              ...withLang.languages!,
                              language2: e.target.value,
                            },
                          })
                        }
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: 8,
                          padding: 8,
                          fontSize: 13,
                          background: "white",
                        }}
                      >
                        {LANG_OPTIONS.map((code) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </select>
                      <input
                        value={withLang.portuguese ?? ""}
                        onChange={(e) =>
                          updateImageAt(idx, { portuguese: e.target.value })
                        }
                        placeholder={
                          "Language 2: " + withLang.languages!.language2
                        }
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: 8,
                          padding: 8,
                          fontSize: 13,
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      alignItems: "flex-end",
                    }}
                  >
                    {idx !== 0 && (
                      <button
                        onClick={() => moveImageUp(idx)}
                        style={ghostBtnStyle}
                        title="↑"
                      >
                        ↑
                      </button>
                    )}
                    {idx !== images.length - 1 && (
                      <button
                        onClick={() => moveImageDown(idx)}
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
