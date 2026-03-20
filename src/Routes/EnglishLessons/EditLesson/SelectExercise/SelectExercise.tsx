// SelectExerciseEditor.tsx
import React, { useMemo, useState } from "react";
import {
  backDomain,
  truncateString,
} from "../../../../Resources/UniversalComponents";
import SimpleAIGenerator from "../AIGenerator/AIGenerator";
import { notifyAlert } from "../../Assets/Functions/FunctionLessons";
import { partnerColor } from "../../../../Styles/Styles";

export type SelectExerciseChoice = {
  option: string;
  status: "right" | "wrong";
  reason: string;
};

export type SelectExerciseQuestion = {
  audio: string;
  options: SelectExerciseChoice[];
  answer: string;
  studentsWhoDidIt: string[];
};

export type SelectExerciseBlock = {
  type: "selectexercise";
  subtitle?: string;
  comments?: string; // ✅ novo
  order?: number;
  options: SelectExerciseQuestion[];
};

type HeadersLike = Record<string, string>;

type Props = {
  value: SelectExerciseBlock;
  onChange: (next: SelectExerciseBlock) => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;

  studentId: any;
  headers?: HeadersLike | null;
  language: string;
};

const inputStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 6,
  padding: 8,
  fontSize: 13,
  width: "100%",
  boxSizing: "border-box",
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

const ghostSm: React.CSSProperties = {
  ...ghostBtn,
  padding: "3px 6px",
  fontSize: 11,
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

export default function SelectExerciseEditor({
  value,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  studentId,
  headers,
  language,
}: Props) {
  const [showConfig, setShowConfig] = useState(true);
  const [aiOpen, setAiOpen] = useState(false);

  const update = (patch: Partial<SelectExerciseBlock>) =>
    onChange({
      ...value,
      ...patch,
      type: "selectexercise",
      comments: patch.comments ?? value.comments ?? "", // ✅ garante string
      options: patch.options ?? value.options ?? [],
    });

  const questions = useMemo(() => value.options ?? [], [value.options]);

  /* -------------------- bloco: perguntas -------------------- */
  const addQuestion = () => {
    const next: SelectExerciseQuestion = {
      audio: "",
      options: [
        { option: "", status: "wrong", reason: "" },
        { option: "", status: "wrong", reason: "" },
        { option: "", status: "right", reason: "" },
      ],
      answer: "",
      studentsWhoDidIt: [],
    };
    update({ options: [...questions, next] });
  };

  const removeQuestionAt = (idx: number) => {
    const next = [...questions];
    next.splice(idx, 1);
    update({ options: next });
  };

  const moveQuestion = (from: number, to: number) => {
    if (to < 0 || to >= questions.length) return;
    const next = [...questions];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    update({ options: next });
  };

  const setQuestionAt = (idx: number, q: SelectExerciseQuestion) => {
    const next = [...questions];
    next[idx] = q;
    update({ options: next });
  };

  /* -------------------- alternativas -------------------- */
  const addChoice = (qIndex: number) => {
    const q = { ...questions[qIndex] };
    q.options = [...q.options, { option: "", status: "wrong", reason: "" }];
    setQuestionAt(qIndex, q);
  };

  const removeChoice = (qIndex: number, cIndex: number) => {
    const q = { ...questions[qIndex] };
    const nextOpts = [...q.options];
    const removedWasRight = nextOpts[cIndex]?.status === "right";

    nextOpts.splice(cIndex, 1);
    q.options = nextOpts;

    if (removedWasRight) {
      const firstRight = nextOpts.find((o) => o.status === "right");
      if (!firstRight && nextOpts.length > 0) nextOpts[0].status = "right";
      q.answer = (
        nextOpts.find((o) => o.status === "right")?.option ?? ""
      ).trim();
    }

    setQuestionAt(qIndex, q);
  };

  const moveChoice = (qIndex: number, from: number, to: number) => {
    const q = { ...questions[qIndex] };
    if (to < 0 || to >= q.options.length) return;

    const nextOpts = [...q.options];
    const [it] = nextOpts.splice(from, 1);
    nextOpts.splice(to, 0, it);
    q.options = nextOpts;

    setQuestionAt(qIndex, q);
  };

  const setChoiceAt = (
    qIndex: number,
    cIndex: number,
    patch: Partial<SelectExerciseChoice>,
  ) => {
    const q = { ...questions[qIndex] };
    const nextOpts = [...q.options];
    const prev = nextOpts[cIndex];

    const nextChoice: SelectExerciseChoice = {
      option: String(patch.option ?? prev.option ?? ""),
      status: (patch.status ?? prev.status ?? "wrong") as "right" | "wrong",
      reason: String(patch.reason ?? prev.reason ?? ""),
    };

    nextOpts[cIndex] = nextChoice;

    // garante 1 correta: se marcou essa como right, derruba as outras
    if (patch.status === "right") {
      for (let i = 0; i < nextOpts.length; i++) {
        if (i !== cIndex) nextOpts[i] = { ...nextOpts[i], status: "wrong" };
      }
    }

    q.options = nextOpts;

    // sincroniza answer
    const right = q.options.find((c) => c.status === "right");
    q.answer = (right?.option ?? "").trim();

    setQuestionAt(qIndex, q);
  };

  const markAsRight = (qIndex: number, cIndex: number) => {
    const q = { ...questions[qIndex] };
    q.options = q.options.map((c, i) => ({
      ...c,
      status: i === cIndex ? "right" : "wrong",
    }));
    q.answer = (q.options[cIndex]?.option ?? "").trim();
    setQuestionAt(qIndex, q);
  };

  /* -------------------- IA helpers -------------------- */
  function parseMaybeJson(input: any): any {
    if (Array.isArray(input) || (input && typeof input === "object"))
      return input;
    if (typeof input !== "string") return input;

    const cleaned = input
      .trim()
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      return input;
    }
  }

  const shuffleArray = <T,>(arr: T[]) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const normalizeQuestion = (rawQ: any): SelectExerciseQuestion | null => {
    const audio =
      rawQ?.audio ??
      rawQ?.question ??
      rawQ?.prompt ??
      rawQ?.statement ??
      rawQ?.enunciado ??
      "";

    const rawOptions =
      rawQ?.options ?? rawQ?.choices ?? rawQ?.alternatives ?? rawQ?.items ?? [];

    if (!audio && (!Array.isArray(rawOptions) || rawOptions.length === 0))
      return null;

    let options: SelectExerciseChoice[] = (
      Array.isArray(rawOptions) ? rawOptions : []
    )
      .map((o: any) => {
        const option = o?.option ?? o?.text ?? o?.value ?? o?.label ?? "";

        let status: "right" | "wrong" = "wrong";
        const s = o?.status ?? o?.correct ?? o?.isCorrect ?? o?.right;
        if (s === "right" || s === true || s === "correct") status = "right";

        const reason = o?.reason ?? o?.explanation ?? "";

        return {
          option: String(option ?? ""),
          status,
          reason: String(reason ?? ""),
        };
      })
      .filter((c) => (c.option || c.reason).trim().length > 0);

    if (options.length === 1)
      options.push({ option: "—", status: "wrong", reason: "" });
    if (options.length === 0) return null;

    // garante 1 correta
    const rightIdxs = options
      .map((c, i) => (c.status === "right" ? i : -1))
      .filter((i) => i >= 0);

    if (rightIdxs.length === 0) {
      const givenAnswer =
        rawQ?.answer ?? rawQ?.correctAnswer ?? rawQ?.rightAnswer ?? "";

      if (givenAnswer) {
        const match = options.findIndex(
          (c) =>
            c.option.trim().toLowerCase() ===
            String(givenAnswer).trim().toLowerCase(),
        );
        options[Math.max(0, match)].status = "right";
      } else {
        options[0].status = "right";
      }
    } else if (rightIdxs.length > 1) {
      const keep = rightIdxs[0];
      options = options.map((c, i) => ({
        ...c,
        status: i === keep ? "right" : "wrong",
      }));
    }

    // ✅ embaralha (sua regra: correta não fica sempre na mesma posição)
    options = shuffleArray(options);

    const right = options.find((c) => c.status === "right");
    const answer = (right?.option ?? "").trim();

    return {
      audio: String(audio ?? ""),
      options,
      answer,
      studentsWhoDidIt: Array.isArray(rawQ?.studentsWhoDidIt)
        ? rawQ.studentsWhoDidIt
        : [],
    };
  };

  const handleReceiveJson = (raw: any) => {
    const json = parseMaybeJson(raw);

    let arr: any[] = [];
    if (Array.isArray(json)) {
      arr = json;
    } else if (json && typeof json === "object") {
      const candidate =
        json.options ??
        json.questions ??
        json.items ??
        json.list ??
        json.data ??
        null;

      if (Array.isArray(candidate)) {
        arr = candidate;
      } else if (
        typeof json.result === "string" ||
        typeof json.json === "string"
      ) {
        const inner = parseMaybeJson(json.result ?? json.json);
        if (Array.isArray(inner)) arr = inner;
        else if (inner && typeof inner === "object") {
          const innerCandidate =
            inner.options ??
            inner.questions ??
            inner.items ??
            inner.list ??
            inner.data ??
            null;
          if (Array.isArray(innerCandidate)) arr = innerCandidate;
        }
      }
    } else if (typeof json === "string") {
      const maybe = parseMaybeJson(json);
      if (Array.isArray(maybe)) arr = maybe;
    }

    if (!Array.isArray(arr) || arr.length === 0) {
      notifyAlert(
        "Esperado um ARRAY de perguntas (ex.: [{ audio, options:[{option,status,reason}], answer }]). Ajuste o prompt/retorno.",
        partnerColor(),
      );
      console.warn("Conteúdo recebido (bruto):", raw);
      return;
    }

    const mapped = arr
      .map((q) => normalizeQuestion(q))
      .filter((q): q is SelectExerciseQuestion => !!q);

    if (mapped.length === 0) {
      notifyAlert(
        "Nenhuma pergunta válida encontrada no retorno da IA.",
        partnerColor(),
      );
      console.warn("Conteúdo recebido (bruto):", raw);
      return;
    }

    update({ options: mapped });
    setShowConfig(true);
  };

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 6,
        padding: "5px 12px",
        background: "linear-gradient(to right, #3b50c655, #ffffff)",
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
          <div>
            {onMoveUp && (
              <button onClick={onMoveUp} style={ghostBtn} title="Mover bloco ↑">
                ↑
              </button>
            )}
            {onMoveDown && (
              <button
                onClick={onMoveDown}
                style={ghostBtn}
                title="Mover bloco ↓"
              >
                ↓
              </button>
            )}
          </div>

          <button
            style={{ ...ghostBtn, border: "1px solid #0891b2" }}
            onClick={() => setAiOpen(true)}
            title="Gerar perguntas por IA"
          >
            ✨ IA
          </button>

          <SimpleAIGenerator
            visible={aiOpen}
            language1={language}
            type="selectexercise"
            onClose={() => setAiOpen(false)}
            postUrl={`${backDomain}/api/v1/generateSection/${studentId}`}
            headers={headers}
            onReceiveJson={handleReceiveJson}
            title="Gerar Select Exercise por IA"
          />

          {onRemove && (
            <button onClick={onRemove} style={dangerBtn} title="Remover bloco">
              <i className="fa fa-trash" />
            </button>
          )}
        </span>
      </div>

      {showConfig && (
        <div style={{ display: "grid", gap: 12 }}>
          {/* Subtitle + Order */}
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "1fr 140px",
              alignItems: "start",
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>Subtitle</label>
              <input
                value={value.subtitle ?? ""}
                onChange={(e) => update({ subtitle: e.target.value })}
                placeholder="Exercise 4 - Choose the Correct Answer"
                style={inputStyle}
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>Order</label>
              <input
                type="number"
                value={Number(value.order ?? 0)}
                onChange={(e) => update({ order: Number(e.target.value) })}
                style={inputStyle}
              />
            </div>
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

          {/* Lista */}
          <div style={{ display: "grid", gap: 14 }}>
            {questions.length === 0 && (
              <div
                style={{
                  padding: 10,
                  border: "1px dashed #94a3b8",
                  borderRadius: 6,
                  color: "#64748b",
                }}
              >
                Nenhuma pergunta. Clique em <em>+ Adicionar pergunta</em> ou use
                ✨ IA.
              </div>
            )}

            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  padding: 10,
                  display: "grid",
                  gap: 10,
                  background: "#fff",
                }}
              >
                {/* Header da pergunta */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <strong style={{ color: "#0f172a" }}>
                      Pergunta #{qIndex + 1}
                    </strong>
                    <small style={{ color: "#64748b" }}>
                      {q.answer
                        ? `Correta: "${q.answer}"`
                        : "Sem correta definida"}
                    </small>
                  </div>

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button
                      style={ghostSm}
                      onClick={() => moveQuestion(qIndex, qIndex - 1)}
                      disabled={qIndex === 0}
                      title="Mover pergunta ↑"
                    >
                      ↑
                    </button>
                    <button
                      style={ghostSm}
                      onClick={() => moveQuestion(qIndex, qIndex + 1)}
                      disabled={qIndex === questions.length - 1}
                      title="Mover pergunta ↓"
                    >
                      ↓
                    </button>
                    <button
                      style={dangerBtn}
                      onClick={() => removeQuestionAt(qIndex)}
                      title="Remover pergunta"
                    >
                      Remover
                    </button>
                  </div>
                </div>

                {/* Enunciado */}
                <div style={{ display: "grid", gap: 6 }}>
                  <label style={{ fontSize: 12, color: "#334155" }}>
                    Enunciado (audio)
                  </label>
                  <input
                    value={q.audio}
                    onChange={(e) =>
                      setQuestionAt(qIndex, { ...q, audio: e.target.value })
                    }
                    placeholder="Which sentence is correct?"
                    style={inputStyle}
                  />
                </div>

                {/* Alternativas */}
                <div style={{ display: "grid", gap: 10 }}>
                  {q.options.map((c, cIndex) => (
                    <div
                      key={cIndex}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 10,
                        padding: 10,
                        display: "grid",
                        gap: 8,
                        background:
                          c.status === "right" ? "#f0fdf4" : "#ffffff",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              padding: "2px 8px",
                              borderRadius: 6,
                              border:
                                c.status === "right"
                                  ? "1px solid #86efac"
                                  : "1px solid #e2e8f0",
                              background:
                                c.status === "right" ? "#dcfce7" : "#f8fafc",
                              color:
                                c.status === "right" ? "#166534" : "#334155",
                              whiteSpace: "nowrap",
                            }}
                            title={
                              c.status === "right"
                                ? "Alternativa correta"
                                : "Alternativa incorreta"
                            }
                          >
                            {c.status === "right" ? "✔ right" : "✘ wrong"}
                          </span>
                          <small style={{ color: "#64748b" }}>
                            Opção #{cIndex + 1}
                          </small>
                        </div>

                        <div
                          style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                        >
                          <button
                            style={ghostSm}
                            onClick={() =>
                              moveChoice(qIndex, cIndex, cIndex - 1)
                            }
                            disabled={cIndex === 0}
                            title="Mover alternativa ↑"
                          >
                            ↑
                          </button>
                          <button
                            style={ghostSm}
                            onClick={() =>
                              moveChoice(qIndex, cIndex, cIndex + 1)
                            }
                            disabled={cIndex === q.options.length - 1}
                            title="Mover alternativa ↓"
                          >
                            ↓
                          </button>
                          <button
                            style={ghostSm}
                            onClick={() => markAsRight(qIndex, cIndex)}
                            title="Marcar como correta"
                          >
                            Tornar correta
                          </button>
                          <button
                            style={dangerBtn}
                            onClick={() => removeChoice(qIndex, cIndex)}
                            title="Remover alternativa"
                          >
                            Remover
                          </button>
                        </div>
                      </div>

                      <input
                        value={c.option}
                        onChange={(e) =>
                          setChoiceAt(qIndex, cIndex, {
                            option: e.target.value,
                          })
                        }
                        placeholder="I am an engineer."
                        style={inputStyle}
                      />

                      <input
                        value={c.reason}
                        onChange={(e) =>
                          setChoiceAt(qIndex, cIndex, {
                            reason: e.target.value,
                          })
                        }
                        placeholder="Reason/explanation for this option"
                        style={{ ...inputStyle, fontSize: 12.5 }}
                      />
                    </div>
                  ))}

                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={ghostBtn} onClick={() => addChoice(qIndex)}>
                      + Adicionar alternativa
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div>
              <button style={ghostBtn} onClick={addQuestion}>
                + Adicionar pergunta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
