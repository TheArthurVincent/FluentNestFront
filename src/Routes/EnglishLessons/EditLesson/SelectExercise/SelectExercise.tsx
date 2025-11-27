// SelectExerciseEditor.tsx
import React, { useMemo, useState } from "react";
import { truncateString } from "../../../../Resources/UniversalComponents";

export type SelectExerciseChoice = {
  option: string;
  status: "right" | "wrong";
  reason: string;
};

export type SelectExerciseQuestion = {
  audio: string; // enunciado/pergunta falada ou texto do áudio
  options: SelectExerciseChoice[];
  answer: string; // espelha a alternativa com status "right"
  studentsWhoDidIt: string[];
};

export type SelectExerciseBlock = {
  type: "selectexercise";
  subtitle?: string;
  order?: number;
  options: SelectExerciseQuestion[];
};

type Props = {
  value: SelectExerciseBlock;
  onChange: (next: SelectExerciseBlock) => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
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

const ghostSm: React.CSSProperties = {
  ...ghostBtn,
  padding: "3px 6px",
  fontSize: 11,
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

export default function SelectExerciseEditor({
  value,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: Props) {
  const [showConfig, setShowConfig] = useState(false);

  const update = (patch: Partial<SelectExerciseBlock>) =>
    onChange({ ...value, ...patch });

  const questions = useMemo(() => value.options ?? [], [value.options]);

  // ----- Helpers de bloco -----
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

  const moveQuestionUp = (i: number) => moveQuestion(i, i - 1);
  const moveQuestionDown = (i: number) => moveQuestion(i, i + 1);

  const setQuestionAt = (idx: number, q: SelectExerciseQuestion) => {
    const next = [...questions];
    next[idx] = q;
    update({ options: next });
  };

  // ----- Helpers de alternativas -----
  const addChoice = (qIndex: number) => {
    const q = { ...questions[qIndex] };
    q.options = [...q.options, { option: "", status: "wrong", reason: "" }];
    setQuestionAt(qIndex, q);
  };

  const removeChoice = (qIndex: number, cIndex: number) => {
    const q = { ...questions[qIndex] };
    const nextOpts = [...q.options];
    nextOpts.splice(cIndex, 1);
    // se removeu a correta, zera answer e garante que alguma outra seja correta depois (opcional)
    const hadRight = q.options[cIndex]?.status === "right";
    q.options = nextOpts;
    if (hadRight) {
      const first = nextOpts.find((o) => o.status === "right");
      if (!first) {
        // se nenhuma correta restou, defina a primeira como correta (se existir)
        if (nextOpts.length > 0) {
          nextOpts[0].status = "right";
          q.answer = nextOpts[0].option;
        } else {
          q.answer = "";
        }
      } else {
        q.answer = first.option;
      }
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

  const moveChoiceUp = (qIndex: number, i: number) =>
    moveChoice(qIndex, i, i - 1);
  const moveChoiceDown = (qIndex: number, i: number) =>
    moveChoice(qIndex, i, i + 1);

  const setChoiceAt = (
    qIndex: number,
    cIndex: number,
    patch: Partial<SelectExerciseChoice>
  ) => {
    const q = { ...questions[qIndex] };
    const choice = { ...q.options[cIndex], ...patch };
    const nextOpts = [...q.options];
    nextOpts[cIndex] = choice;
    q.options = nextOpts;

    // se mexeu no texto da correta, manter answer em sincronia
    if (choice.status === "right") {
      q.answer = choice.option;
    } else if (patch.option && q.options[cIndex].status === "right") {
      // No caso de só editar o option da correta
      q.answer = patch.option;
    }

    setQuestionAt(qIndex, q);
  };

  const markAsRight = (qIndex: number, cIndex: number) => {
    const q = { ...questions[qIndex] };
    q.options = q.options.map((c, i) => ({
      ...c,
      status: i === cIndex ? "right" : "wrong",
    }));
    q.answer = q.options[cIndex].option;
    setQuestionAt(qIndex, q);
  };

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 6,
        padding: "5px 12px",
        background: "linear-gradient(to right, #3b50c655, #ffffff)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <strong
          onClick={() => setShowConfig(!showConfig)}
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
            className={showConfig ? "fa fa-arrow-down" : "fa fa-arrow-right"}
            style={{ color: "#0f172a" }}
          />
          {value.subtitle
            ? truncateString(value.subtitle, 15)
            : "Adicione  um título"}{" "}
          | EXERCÍCIO DE MÚLTIPLA ESCOLHA
        </strong>

        <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
          {onRemove && (
            <button onClick={onRemove} style={dangerBtn}>
              <i className="fa fa-trash" />
            </button>
          )}
        </span>
      </div>

      {showConfig && (
        <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
          {/* Subtitle / Order */}
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
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: 8,
                  fontSize: 13,
                }}
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>Order</label>
              <input
                type="number"
                value={Number(value.order ?? 0)}
                onChange={(e) => update({ order: Number(e.target.value) })}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: 8,
                  fontSize: 13,
                }}
              />
            </div>
          </div>

          {/* Lista de perguntas */}
          <div style={{ display: "grid", gap: 14 }}>
            {questions.length === 0 && (
              <div
                style={{
                  padding: 10,
                  border: "1px dashed #94a3b8",
                  borderRadius: 8,
                  color: "#64748b",
                }}
              >
                Nenhuma pergunta. Clique em <em>+ Adicionar pergunta</em>.
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
                  }}
                >
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
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
                      onClick={() => moveQuestionUp(qIndex)}
                      disabled={qIndex === 0}
                      title="Mover pergunta ↑"
                    >
                      ↑
                    </button>
                    <button
                      style={ghostSm}
                      onClick={() => moveQuestionDown(qIndex)}
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

                {/* Enunciado (audio) */}
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
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      padding: 8,
                      fontSize: 13,
                    }}
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
                              borderRadius: 999,
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
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            style={ghostSm}
                            onClick={() => moveChoiceUp(qIndex, cIndex)}
                            disabled={cIndex === 0}
                            title="Mover alternativa ↑"
                          >
                            ↑
                          </button>
                          <button
                            style={ghostSm}
                            onClick={() => moveChoiceDown(qIndex, cIndex)}
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
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: 8,
                          padding: 8,
                          fontSize: 13,
                        }}
                      />
                      <input
                        value={c.reason}
                        onChange={(e) =>
                          setChoiceAt(qIndex, cIndex, {
                            reason: e.target.value,
                          })
                        }
                        placeholder="Reason/explanation for this option"
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: 8,
                          padding: 8,
                          fontSize: 12.5,
                        }}
                      />
                    </div>
                  ))}

                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={ghostBtn} onClick={() => addChoice(qIndex)}>
                      + Adicionar alternativa
                    </button>
                  </div>
                </div>

                {/* Answer & Students (read-only answer editável via 'Tornar correta') */}
                {/* <div
                  style={{
                    display: "grid",
                    gap: 10,
                    gridTemplateColumns: "1fr",
                  }}
                >
                  <div style={{ display: "grid", gap: 6 }}>
                    <label style={{ fontSize: 12, color: "#334155" }}>
                      Resposta correta (sincronizada automaticamente)
                    </label>
                    <input
                      value={q.answer}
                      readOnly
                      placeholder="É definida ao marcar uma alternativa como correta"
                      style={{
                        border: "1px dashed #cbd5e1",
                        background: "#f8fafc",
                        borderRadius: 8,
                        padding: 8,
                        fontSize: 13,
                        color: "#475569",
                      }}
                    />
                  </div>
                </div> */}
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
