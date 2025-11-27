import React, { useMemo, useState } from "react";
import { uploadImageViaBackend } from "../../../../Resources/ImgUpload";
import { truncateString } from "../../../../Resources/UniversalComponents";

export type ExplanationSection = {
  image?: string | null; // pode ser null/undefined
  title: string;
  list: string[]; // lista de bullets
};

export type ExplanationBlock = {
  type: "explanation";
  subtitle?: string;
  order?: number;
  explanation: ExplanationSection[];
};

type Props = {
  value: ExplanationBlock;
  onChange: (next: ExplanationBlock) => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  headers?: any;
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

export default function ExplanationEditor({
  value,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  headers,
}: Props) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const [errorByIdx, setErrorByIdx] = useState<Record<number, string | null>>(
    {}
  );

  const explanation = useMemo(
    () => (Array.isArray(value.explanation) ? value.explanation : []),
    [value.explanation]
  );

  const update = (patch: Partial<ExplanationBlock>) =>
    onChange({ ...value, ...patch });

  const updateSection = (idx: number, patch: Partial<ExplanationSection>) => {
    const next = explanation.slice();
    next[idx] = { ...next[idx], ...patch };
    update({ explanation: next });
  };

  const addSection = () => {
    const next: ExplanationSection = {
      image: null,
      title: "",
      list: [""],
    };
    update({ explanation: [...explanation, next] });
  };

  const removeSection = (idx: number) => {
    const next = explanation.slice();
    next.splice(idx, 1);
    update({ explanation: next });
  };

  const moveSection = (from: number, to: number) => {
    if (to < 0 || to >= explanation.length) return;
    const next = explanation.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    update({ explanation: next });
  };

  const addListItem = (sectionIdx: number) => {
    const sec = explanation[sectionIdx];
    const nextList = Array.isArray(sec.list) ? sec.list.slice() : [];
    nextList.push("");
    updateSection(sectionIdx, { list: nextList });
  };

  const updateListItem = (
    sectionIdx: number,
    itemIdx: number,
    text: string
  ) => {
    const sec = explanation[sectionIdx];
    const nextList = sec.list.slice();
    nextList[itemIdx] = text;
    updateSection(sectionIdx, { list: nextList });
  };

  const removeListItem = (sectionIdx: number, itemIdx: number) => {
    const sec = explanation[sectionIdx];
    const nextList = sec.list.slice();
    nextList.splice(itemIdx, 1);
    updateSection(sectionIdx, { list: nextList });
  };

  const onPickImage = async (sectionIdx: number, file: File | null) => {
    if (!file) return;
    try {
      setErrorByIdx((p) => ({ ...p, [sectionIdx]: null }));
      setUploading(sectionIdx);
      const url = await uploadImageViaBackend(file, {
        folder: "/lessons/explanation",
        fileName: `explanation_${Date.now()}_${file.name}`,
        headers,
      });
      updateSection(sectionIdx, { image: url });
    } catch (e: any) {
      setErrorByIdx((p) => ({
        ...p,
        [sectionIdx]: "Falha ao enviar imagem. Tente novamente.",
      }));
      console.error(e?.message || e);
    } finally {
      setUploading(null);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 6,
        padding: "5px 12px",
        background: "linear-gradient(to right, #eef2ff55, #ffffff)",
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
          onClick={() => setOpen(!open)}
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
            className={open ? "fa fa-arrow-down" : "fa fa-arrow-right"}
            style={{ color: "#0f172a" }}
          />
          {value.subtitle
            ? truncateString(value.subtitle, 15)
            : "Adicione  um título"}{" "}
          | EXPLICAÇÃO
        </strong>
        <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div>
            {onMoveUp && (
              <button onClick={onMoveUp} style={ghostBtn} title="Mover ↑">
                ↑
              </button>
            )}
            {onMoveDown && (
              <button onClick={onMoveDown} style={ghostBtn} title="Mover ↓">
                ↓
              </button>
            )}
          </div>
          {onRemove && (
            <button onClick={onRemove} style={dangerBtn}>
              <i className="fa fa-trash" />
            </button>
          )}
        </span>
      </div>

      {open && (
        <div style={{ display: "grid", gap: 14, marginTop: 8 }}>
          {/* Subtitle */}
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#334155" }}>Subtitle</label>
            <input
              value={value.subtitle ?? ""}
              onChange={(e) => update({ subtitle: e.target.value })}
              placeholder="Ex.: Introduction"
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: 8,
                fontSize: 13,
              }}
            />
          </div>

          {/* Seções */}
          <div style={{ display: "grid", gap: 14 }}>
            {explanation.length === 0 && (
              <div
                style={{
                  border: "1px dashed #94a3b8",
                  borderRadius: 8,
                  padding: 16,
                  color: "#64748b",
                  fontSize: 13,
                }}
              >
                Nenhuma seção. Clique em <em>Adicionar seção</em>.
              </div>
            )}

            {explanation.map((sec, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  padding: 12,
                  background: "#ffffff",
                }}
              >
                {/* Toolbar da seção */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <strong style={{ fontSize: 14, color: "#0f172a" }}>
                    Seção {idx + 1} - {sec.title || "Sem título"}
                  </strong>
                  <span
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <button
                      style={ghostBtn}
                      onClick={() => moveSection(idx, idx - 1)}
                      title="Mover seção ↑"
                    >
                      ↑
                    </button>
                    <button
                      style={ghostBtn}
                      onClick={() => moveSection(idx, idx + 1)}
                      title="Mover seção ↓"
                    >
                      ↓
                    </button>
                    <button
                      style={dangerBtn}
                      onClick={() => removeSection(idx)}
                    >
                      Remover seção
                    </button>
                  </span>
                </div>

                {/* Linha imagem + título */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 110,
                      height: 110,
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      overflow: "hidden",
                      display: "grid",
                      placeItems: "center",
                      background: "#f8fafc",
                    }}
                  >
                    {sec.image ? (
                      <img
                        src={sec.image}
                        alt="section"
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
                  <div style={{ display: "grid", gap: 8 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <label
                        style={{
                          ...ghostBtn,
                          display: "inline-block",
                          textAlign: "center",
                        }}
                      >
                        {uploading === idx
                          ? "Enviando..."
                          : "Upload imagem (opcional)"}
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) =>
                            onPickImage(idx, e.target.files?.[0] || null)
                          }
                          disabled={uploading === idx}
                        />
                      </label>
                      <button
                        style={ghostBtn}
                        onClick={() => updateSection(idx, { image: null })}
                      >
                        Remover imagem
                      </button>
                    </div>
                    {errorByIdx[idx] && (
                      <small style={{ color: "#b91c1c" }}>
                        {errorByIdx[idx]}
                      </small>
                    )}

                    <div style={{ display: "grid", gap: 6 }}>
                      <label style={{ fontSize: 12, color: "#334155" }}>
                        Título
                      </label>
                      <input
                        value={sec.title}
                        onChange={(e) =>
                          updateSection(idx, { title: e.target.value })
                        }
                        placeholder="Ex.: Uso de 'The'"
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: 8,
                          padding: 8,
                          fontSize: 13,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Lista de bullets */}
                <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                  <label style={{ fontSize: 12, color: "#334155" }}>
                    Lista
                  </label>
                  {sec.list.map((item, liIdx) => (
                    <div
                      key={liIdx}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: 8,
                      }}
                    >
                      <input
                        value={item}
                        onChange={(e) =>
                          updateListItem(idx, liIdx, e.target.value)
                        }
                        placeholder="Digite um ponto da lista…"
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: 8,
                          padding: 8,
                          fontSize: 13,
                        }}
                      />
                      <button
                        style={ghostBtn}
                        onClick={() => removeListItem(idx, liIdx)}
                        title="Remover item"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                  <div>
                    <button style={ghostBtn} onClick={() => addListItem(idx)}>
                      + Adicionar item
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <button style={ghostBtn} onClick={addSection}>
              + Adicionar seção
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
