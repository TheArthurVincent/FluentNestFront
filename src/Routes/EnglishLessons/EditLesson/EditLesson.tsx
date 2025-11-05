import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { backDomain } from "../../../Resources/UniversalComponents";
import SentencesEditor, {
  SentencesBlock,
} from "./SentencesEditor/SentencesEditor";

type ElementItem =
  | {
      subtitle?: string;
      order?: number;
      grid?: number;
      type: string; // "video" | "sentences" | ...
      video?: string;
      sentences?: Array<any>;
    }
  | Record<string, any>;

interface ClassDetails {
  courseId: string;
  description: string;
  elements: ElementItem[];
  image: string;
  language: string;
  mainTag: string;
  module: string;
  moduleId?: string;
  order: number;
  [k: string]: any; // tolerante a campos extras vindos do back
}

interface EditLessonModelProps {
  classId: string;
  headers?: any;
  onUpdated?: (updated: ClassDetails) => void; // callback opcional
}

export default function EditLesson({
  classId,
  headers,
  onUpdated,
}: EditLessonModelProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [elementsMode, setElementsMode] = useState<"inputs" | "json">("inputs");

  const [lesson, setLesson] = useState<ClassDetails | null>(null);

  // campos editáveis no form principal
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [mainTag, setMainTag] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [elementsJSON, setElementsJSON] = useState<string>("");

  const getClass = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/course/${classId}`,
        {
          headers,
        }
      );
      const data: ClassDetails =
        response?.data?.classDetails || response?.data || response?.data?.data;

      if (!data) {
        throw new Error("Resposta sem dados de aula (classDetails).");
      }

      setLesson(data);
      // Preenche o form
      setDescription(data.description ?? "");
      setImage(data.image ?? "");
      setMainTag(data.mainTag ?? "");
      setOrder(Number(data.order ?? 0));

      try {
        setElementsJSON(JSON.stringify(data.elements ?? [], null, 2));
      } catch {
        setElementsJSON("[]");
      }

      setOpen(true);
    } catch (err: any) {
      console.error(err);
      setError("Erro ao obter aula. Verifique o ID e as credenciais.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!lesson) return;
    setSaving(true);
    setError(null);

    // Valida JSON dos elements
    let parsedElements: ElementItem[] = [];
    try {
      const parsed = JSON.parse(elementsJSON);
      if (!Array.isArray(parsed)) {
        throw new Error("O campo 'elements' precisa ser um array JSON.");
      }
      parsedElements = parsed;
    } catch (e: any) {
      setSaving(false);
      setError(`Elements inválido: ${e.message}`);
      return;
    }

    const payload: ClassDetails = {
      ...lesson,
      description,
      image,
      mainTag,
      order: Number(order),
      elements: parsedElements,
    };

    try {
      const res = await axios.put(
        `${backDomain}/api/v1/course/${classId}`,
        payload,
        { headers }
      );

      const updated: ClassDetails =
        res?.data?.classDetails || res?.data || res?.data?.data || payload;

      setLesson(updated);
      onUpdated?.(updated);
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao salvar a aula.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };
  const [elements, setElements] = useState<any[]>([]);

  useEffect(() => {
    if (elementsMode === "inputs") {
      try {
        const parsed = JSON.parse(elementsJSON);
        if (Array.isArray(parsed)) setElements(parsed);
      } catch {
        // se der erro, mantenha o que tinha
      }
    }
  }, [elementsMode]); // só quando mudar de modo
  const updateElementAt = (index: number, next: any) => {
    setElements((prev) => {
      const clone = prev.slice();
      clone[index] = next;
      return clone;
    });
  };

  const removeElementAt = (index: number) => {
    setElements((prev) => {
      const clone = prev.slice();
      clone.splice(index, 1);
      return clone;
    });
  };
  return (
    <>
      <button
        onClick={getClass}
        disabled={loading}
        style={{
          borderRadius: "4px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc",
          fontSize: "11px",
          fontWeight: "400",
          color: "#64748b",
          padding: "4px 6px",
          height: "28px",
          outline: "none",
          cursor: "pointer",
          display: "block",
        }}
      >
        {loading ? "Carregando..." : "Editar Aula"}
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            top: 250,
            zIndex: 9999,
            background: "rgba(15, 23, 42, 0.6)",
            display: "grid",
            placeItems: "center",
            padding: 16,
          }}
          onClick={() => {
            // fechar ao clicar no backdrop
            setOpen(false);
          }}
        >
          <div
            style={{
              width: "min(960px, 99vw)",
              maxHeight: "90vh",
              overflow: "auto",
              background: "white",
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              padding: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <h2
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 18,
                  margin: 0,
                }}
              >
                Editar Aula
              </h2>
              <button
                onClick={() => setOpen(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: 20,
                  cursor: "pointer",
                }}
                aria-label="Fechar"
                title="Fechar"
              >
                ×
              </button>
            </div>

            {error && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#991b1b",
                  padding: 8,
                  borderRadius: 8,
                  marginBottom: 12,
                  fontSize: 12,
                }}
              >
                {error}
              </div>
            )}

            {/* Campos principais */}
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "1fr",
                marginBottom: 12,
              }}
            >
              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: 12, color: "#334155" }}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Descrição da aula"
                  style={{
                    width: "100%",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    padding: 8,
                    fontSize: 13,
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 12,
                  gridTemplateColumns: "1fr 1fr",
                }}
              >
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontSize: 12, color: "#334155" }}>
                    Image
                  </label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://..."
                    style={{
                      width: "100%",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      padding: 8,
                      fontSize: 13,
                    }}
                  />
                </div>

                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontSize: 12, color: "#334155" }}>
                    Main Tag
                  </label>
                  <input
                    value={mainTag}
                    onChange={(e) => setMainTag(e.target.value)}
                    placeholder="businessenglish"
                    style={{
                      width: "100%",
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
                  display: "grid",
                  gap: 12,
                  gridTemplateColumns: "1fr 1fr",
                }}
              >
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontSize: 12, color: "#334155" }}>
                    Language (somente leitura)
                  </label>
                  <input
                    value={lesson?.language ?? ""}
                    readOnly
                    style={{
                      width: "100%",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      padding: 8,
                      fontSize: 13,
                      background: "#f1f5f9",
                      color: "#64748b",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontSize: 12, color: "#334155" }}>
                    Order
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    style={{
                      width: "100%",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      padding: 8,
                      fontSize: 13,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Elements como JSON para edição flexível */}

            <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
              <div
                style={{
                  display: "inline-flex",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  overflow: "hidden",
                  width: "fit-content",
                }}
                role="tablist"
                aria-label="Modo de edição dos elementos"
              >
                <button
                  role="tab"
                  aria-selected={elementsMode === "inputs"}
                  onClick={() => setElementsMode("inputs")}
                  style={{
                    padding: "6px 12px",
                    border: "none",
                    cursor: "pointer",
                    background: elementsMode === "inputs" ? "#0ea5e9" : "white",
                    color: elementsMode === "inputs" ? "white" : "#0f172a",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Editor por Inputs
                </button>
                <button
                  role="tab"
                  aria-selected={elementsMode === "json"}
                  onClick={() => setElementsMode("json")}
                  style={{
                    padding: "6px 12px",
                    border: "none",
                    cursor: "pointer",
                    background: elementsMode === "json" ? "#0ea5e9" : "white",
                    color: elementsMode === "json" ? "white" : "#0f172a",
                    fontSize: 13,
                    fontWeight: 600,
                    borderLeft: "1px solid #e2e8f0",
                  }}
                >
                  JSON
                </button>
              </div>

              {/* CONTEÚDO DOS MODOS */}
              {elementsMode === "inputs" ? (
                // >>> VAZIO POR ENQUANTO (placeholder)
                <div style={{ display: "grid", gap: 12 }}>
                  {elements.length === 0 && (
                    <div
                      style={{
                        border: "1px dashed #94a3b8",
                        borderRadius: 8,
                        padding: 16,
                        color: "#64748b",
                      }}
                    >
                      Nenhum elemento. Altere para o modo JSON e cole seu array,
                      depois volte para Inputs.
                    </div>
                  )}

                  {elements.map((el, idx) => {
                    if (el?.type === "sentences") {
                      return (
                        <SentencesEditor
                          key={idx}
                          value={el as SentencesBlock}
                          onChange={(next) => updateElementAt(idx, next)}
                          onRemove={() => removeElementAt(idx)}
                        />
                      );
                    }

                    // Outros tipos ainda não implementados
                    return (
                      <div
                        key={idx}
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: 10,
                          padding: 12,
                          background: "#fff7ed",
                          color: "#9a3412",
                        }}
                      >
                        <strong>Tipo não suportado ainda:</strong>{" "}
                        {String(el?.type)}
                      </div>
                    );
                  })}

                  {/* Opcional: botão para sincronizar de volta ao JSON antes de salvar */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 8,
                    }}
                  >
                    <button
                      onClick={() => {
                        try {
                          const str = JSON.stringify(elements, null, 2);
                          setElementsJSON(str);
                        } catch {}
                      }}
                      style={{
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                        backgroundColor: "white",
                        color: "#0f172a",
                        padding: "8px 12px",
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                    >
                      Atualizar JSON a partir dos Inputs
                    </button>
                  </div>
                </div>
              ) : (
                // >>> MODO JSON
                <div style={{ display: "grid", gap: 8 }}>
                  <label style={{ fontSize: 12, color: "#334155" }}>
                    Elements (JSON)
                  </label>
                  <textarea
                    value={elementsJSON}
                    onChange={(e) => setElementsJSON(e.target.value)}
                    spellCheck={false}
                    rows={16}
                    style={{
                      width: "100%",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      padding: 10,
                      fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      fontSize: 12.5,
                      lineHeight: 1.45,
                      whiteSpace: "pre",
                    }}
                  />
                  <small style={{ color: "#64748b" }}>
                    Edite o array <code>elements</code> em JSON. Ao salvar,
                    validarei e enviarei.
                  </small>
                </div>
              )}
            </div>

            {/* Ações */}
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
                marginTop: 16,
              }}
            >
              <button
                onClick={() => setOpen(false)}
                disabled={saving}
                style={{
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  backgroundColor: "white",
                  color: "#0f172a",
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  borderRadius: 8,
                  border: "1px solid #0891b2",
                  backgroundColor: "#06b6d4",
                  color: "white",
                  padding: "8px 12px",
                  cursor: saving ? "not-allowed" : "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
