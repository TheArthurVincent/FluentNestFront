import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { backDomain } from "../../../Resources/UniversalComponents";
import SentencesEditor, {
  SentencesBlock,
} from "./SentencesEditor/SentencesEditor";
import VocabularyEditor from "./VocabularyEditor/VocabularyEditor";
import VideoEditor, { VideoBlock } from "./VideoEditor/VideoEditor";

type ElementItem =
  | {
      subtitle?: string;
      order?: number;
      grid?: number;
      type: string; // "video" | "sentences" | "vocabulary" ...
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
  [k: string]: any;
}

interface EditLessonModelProps {
  classId: string;
  setSeeEdit?: (v: boolean) => void;
  headers?: any;
  onUpdated?: (updated: ClassDetails) => void;
}

export default function EditLesson({
  classId,
  headers,
  onUpdated,
  setSeeEdit,
}: EditLessonModelProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false); // agora só controla o painel inline
  const [elementsMode, setElementsMode] = useState<"inputs" | "json">("inputs");

  const [lesson, setLesson] = useState<ClassDetails | null>(null);

  // campos editáveis no form principal
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [mainTag, setMainTag] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [elementsJSON, setElementsJSON] = useState<string>("");

  const [elements, setElements] = useState<any[]>([]);

  const getClass = async () => {
    setSeeEdit?.(true);
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/course/${classId}`,
        { headers }
      );
      const data: ClassDetails =
        response?.data?.classDetails || response?.data || response?.data?.data;

      if (!data) throw new Error("Resposta sem dados de aula (classDetails).");

      setLesson(data);
      setDescription(data.description ?? "");
      setImage(data.image ?? "");
      setMainTag(data.mainTag ?? "");
      setOrder(Number(data.order ?? 0));

      const raw = Array.isArray(data.elements) ? data.elements : [];
      setElementsJSON(JSON.stringify(raw, null, 2));
      if (elementsMode === "inputs") setElements(raw);

      setOpen(true); // exibe painel inline
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
      if (!Array.isArray(parsed))
        throw new Error("O campo 'elements' precisa ser um array JSON.");
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
      // mantém aberto para continuar editando; feche se quiser:
      // setOpen(false);
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

  // Quando alternar para "inputs", sincroniza a partir do JSON atual
  useEffect(() => {
    if (elementsMode === "inputs") {
      try {
        const parsed = JSON.parse(elementsJSON);
        if (Array.isArray(parsed)) setElements(parsed);
      } catch {
        /* ignora */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementsMode]);

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
      {!open && (
        <button
          onClick={open ? () => setOpen(false) : getClass}
          disabled={loading}
          style={{
            borderRadius: "4px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            fontSize: "11px",
            fontWeight: 400,
            color: "#64748b",
            padding: "4px 6px",
            height: 28,
            outline: "none",
            cursor: "pointer",
            display: "block",
          }}
        >
          {loading ? "Carregando..." : open ? "Fechar editor" : "Editar Aula"}
        </button>
      )}

      {open && (
        <div
          aria-label="Editor de aula"
          style={{
            marginTop: 12,
            borderRadius: 12,
            padding: 16,
          }}
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
              onClick={() => {
                setOpen(false);
                setSeeEdit?.(false);
              }}
              style={{
                border: "none",
                background: "transparent",
                fontSize: 14,
                cursor: "pointer",
                color: "#64748b",
              }}
              aria-label="Fechar"
              title="Fechar"
            >
              Fechar
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
                <label style={{ fontSize: 12, color: "#334155" }}>Image</label>
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

                {image && (
                  <div
                    style={{
                      marginTop: 8,
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      overflow: "hidden",
                      maxHeight: 180,
                      display: "grid",
                      placeItems: "center",
                      background: "#f8fafc",
                    }}
                  >
                    <img
                      src={image}
                      alt="Lesson thumbnail"
                      style={{
                        width: "300px",
                        height: "300px",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>Main Tag</label>
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

            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: 12, color: "#334155" }}>
                  Language
                </label>
                <select
                  value={lesson?.language ?? "en"}
                  onChange={(e) =>
                    setLesson((prev) =>
                      prev ? { ...prev, language: e.target.value } : prev
                    )
                  }
                  style={{
                    width: "100%",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    padding: 8,
                    fontSize: 13,
                    background: "white",
                    color: "#0f172a",
                  }}
                >
                  <option value="en">English (en)</option>
                  <option value="es">Spanish (es)</option>
                  <option value="fr">French (fr)</option>
                </select>
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontSize: 12, color: "#334155" }}>Order</label>
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

          {/* Seletor de modo */}
          <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
            <div
              style={{
                display: "inline-flex",
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                // overflow: "hidden",
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
            <h1 style={{ fontSize: 22, textAlign: "center", color: "#0f172a" }}>
              Conteúdo da Aula
            </h1>
            {/* Conteúdo dos modos */}
            {elementsMode === "inputs" ? (
              <div style={{ display: "grid", gap: 50 }}>
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
                      <div
                        key={idx}
                        style={{
                          paddingBottom: 20,
                          marginBottom: 20,
                          borderBottom: "2px solid #e2e8f0",
                        }}
                      >
                        <SentencesEditor
                          key={idx}
                          value={el as SentencesBlock}
                          onChange={(next) => updateElementAt(idx, next)}
                          onRemove={() => removeElementAt(idx)}
                        />
                      </div>
                    );
                  } else if (el?.type === "vocabulary") {
                    return (
                      <div
                        key={idx}
                        style={{
                          paddingBottom: 20,
                          marginBottom: 20,
                          borderBottom: "2px solid #e2e8f0",
                        }}
                      >
                        <VocabularyEditor
                          key={idx}
                          value={el as SentencesBlock}
                          onChange={(next) => updateElementAt(idx, next)}
                          onRemove={() => removeElementAt(idx)}
                        />
                      </div>
                    );
                  } else if (el?.type === "video") {
                    return (
                      <div
                        key={idx}
                        style={{
                          display: "grid",
                          gap: 8,
                          paddingBottom: 20,
                          marginBottom: 20,
                          borderBottom: "2px solid #e2e8f0",
                        }}
                      >
                        <VideoEditor
                          value={el as VideoBlock}
                          onChange={(next) => updateElementAt(idx, next)}
                          onRemove={() => removeElementAt(idx)}
                        />
                      </div>
                    );
                  }

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
              onClick={() => {
                setOpen(false);
                setSeeEdit?.(false);
              }}
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
              Fechar editor
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
      )}
    </>
  );
}
