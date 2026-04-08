import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { notifyAlert, readText } from "../Functions/FunctionLessons";
import {
  backDomain,
  onLoggOut,
  truncateString,
} from "../../../../Resources/UniversalComponents";
import axios from "axios";
import { Tooltip } from "@mui/material";
import {
  partnerColor,
  textpartnerColorContrast,
} from "../../../../Styles/Styles";
import { DictationExercise } from "../../Exercises/Exercises/DictationExercise";
import { LessonListeningExercise } from "../../Exercises/Exercises/ListenInEnglishExercise";
import { defaultLabels } from "../../Exercises/Exercises";
import { HelpInfo } from "../../../../Application/Info/Info";

interface SentenceLessonModelProps {
  headers: MyHeadersType | null;
  element: any;
  studentId: string;
  mainTag: string;
  selectedVoice: any;
  studentsIds?: string[];
  courseId?: string;
  language?: string; // se você quiser controlar Listening (ele só roda em "en")
  exerciseScore?: any;
}

export default function SentenceLessonModel({
  headers,
  element,
  mainTag,
  studentId,
  selectedVoice,
  studentsIds,
  courseId,
  language,
  exerciseScore,
}: SentenceLessonModelProps) {
  const actualHeaders = headers || {};
  const [clickedButtons, setClickedButtons] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // ✅ modal exercises
  const [showExercisesModal, setShowExercisesModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"dictation" | "listening">(
    "dictation",
  );

  const { permissions } = JSON.parse(localStorage.getItem("loggedIn") || "{}");

  const sentences: any[] = useMemo(() => {
    return Array.isArray(element?.sentences) ? element.sentences : [];
  }, [element?.sentences]);

  useEffect(() => {
    setClickedButtons(new Set());
    setLoading(false);
    setDone(false);
  }, [element?.sentences]);

  const getTargetIds = (): string[] => {
    if (
      permissions !== "student" &&
      Array.isArray(studentsIds) &&
      studentsIds.length > 0
    ) {
      return studentsIds;
    }
    return studentId ? [studentId] : [];
  };

  const addNewCards = async (
    frontText: string,
    backText: string,
    index: number,
    languages: any | null,
  ) => {
    if (loading) return;

    const targetIds = getTargetIds();
    if (targetIds.length === 0) {
      notifyAlert(
        "Nenhum aluno selecionado para adicionar flashcards.",
        "orange",
      );
      return;
    }

    const newCards = [
      {
        front: {
          text: frontText,
          language: languages ? languages.language1 : "en",
        },
        back: {
          text: backText,
          language: languages ? languages.language2 : "pt",
        },
        tags: [mainTag ? mainTag : ""],
      },
    ];

    try {
      const messages: string[] = [];

      for (const sid of targetIds) {
        const response = await axios.post(
          `${backDomain}/api/v1/flashcard/${sid}`,
          { newCards },
          { headers: actualHeaders },
        );

        const showThis =
          `${response.data.addedNewFlashcards ? response.data.addedNewFlashcards : ""}` +
          `${response.data.invalidNewCards ? response.data.invalidNewCards : ""}`;

        if (showThis) messages.push(showThis);
      }

      notifyAlert(
        truncateString(messages.join(" | ") || "Flashcards adicionados.", 25),
        partnerColor(),
      );
      setClickedButtons((prev) => new Set(prev).add(index));
    } catch (error) {
      alert("Erro ao enviar cards");
      onLoggOut();
    }
  };

  const addAllCards = async () => {
    if (loading) return;

    const targetIds = getTargetIds();
    if (sentences.length === 0) {
      notifyAlert("Não há sentences para adicionar.", "orange");
      return;
    }
    if (targetIds.length === 0) {
      notifyAlert(
        "Nenhum aluno selecionado para adicionar flashcards.",
        "orange",
      );
      return;
    }

    const newCards = sentences
      .map((s: any) => ({
        front: {
          text: (s?.english || "").trim(),
          language: s?.languages?.language1 || "en",
        },
        back: {
          text: (s?.portuguese || "").trim(),
          language: s?.languages?.language2 || "pt",
        },
        tags: [mainTag ? mainTag : ""],
      }))
      .filter((c: any) => c.front.text && c.back.text);

    if (newCards.length === 0) {
      notifyAlert("Não há cards válidos para adicionar.", "orange");
      return;
    }

    setLoading(true);
    try {
      const messages: string[] = [];

      for (const sid of targetIds) {
        const response = await axios.post(
          `${backDomain}/api/v1/flashcard/${sid}`,
          { newCards },
          { headers: actualHeaders },
        );

        const showThis =
          `${response.data.addedNewFlashcards ? response.data.addedNewFlashcards : ""}` +
          `${response.data.invalidNewCards ? response.data.invalidNewCards : ""}`;

        if (showThis) messages.push(showThis);
      }

      notifyAlert(
        truncateString(messages.join(" | ") || "Flashcards adicionados.", 25),
        partnerColor(),
      );
      setClickedButtons(new Set(sentences.map((_: any, idx: number) => idx)));
      setDone(true);
    } catch (error) {
      alert("Erro ao enviar cards");
      onLoggOut();
    } finally {
      setLoading(false);
    }
  };

  // ✅ normaliza o pool pro formato esperado pelos exercícios
  const exercisePool = useMemo(() => {
    return (Array.isArray(sentences) ? sentences : [])
      .map((s: any) => ({
        portuguese: s?.portuguese || "",
        english: s?.english || "",
      }))
      .filter((s: any) => s.portuguese?.trim() && s.english?.trim());
  }, [sentences]);

  const effectiveCourseId = courseId || element?.courseId;
  const effectiveLanguage = (language || element?.language || "en") as string;

  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: "8px 12px",
    borderRadius: 6,
    border: `1px solid ${active ? partnerColor() : "#E5E7EB"}`,
    background: active ? partnerColor() : "#FFFFFF",
    color: active ? "#fff" : "#111827",
    cursor: "pointer",
    fontSize: "1em",
    fontWeight: 700,
  });

  return (
    <div
      style={{
        padding: "0px",
        minHeight: "100px",
        borderRadius: "6px",
        width: "100%",
        margin: "auto",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 10,
          gap: 8,
        }}
      >
        {!done && (
          <button
            onClick={addAllCards}
            disabled={loading}
            style={{
              border: `1px solid ${partnerColor()}`,
              background: "#fff",
              color: loading ? "#ccc" : partnerColor(),
              fontWeight: "700",
              padding: "6px 10px",
              borderRadius: 6,
              fontSize: "1em",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all .2s",
            }}
          >
            {loading ? "Adicionando..." : "+ Todos"}
          </button>
        )}

        {/* ✅ NOVO: abre modal com os 2 exercícios */}
        <button
          onClick={() => setShowExercisesModal(true)}
          style={{
            border: `1px solid ${partnerColor()}`,
            background: partnerColor(),
            color: "#fff",
            fontWeight: "700",
            padding: "6px 10px",
            borderRadius: 6,
            fontSize: "1em",
            cursor: "pointer",
            transition: "all .2s",
          }}
        >
          Exercícios
        </button>
      </div>

      <div style={{ display: "grid", gap: "10px", opacity: loading ? 0.9 : 1 }}>
        {sentences.map((sentence: any, i: number) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderLeft: `3px solid ${partnerColor()}`,
              paddingLeft: "12px",
              position: "relative",
              minHeight: "40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#f3f3f38a")
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                <Tooltip title="Ouvir" placement="top" arrow>
                  <button
                    style={{
                      all: "unset",
                      color: partnerColor(),
                      cursor: loading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      background: "none",
                      transition: "all 0.2s",
                      opacity: 0.6,
                    }}
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (loading) return;
                      readText(sentence.english, true, "en", selectedVoice);
                    }}
                  >
                    <i className="fa fa-volume-up" aria-hidden="true" />
                  </button>
                </Tooltip>

                <div>
                  <div
                    style={{
                      fontWeight: 500,
                      color: "#222",
                      fontSize: "1.125em",
                      marginBottom: 2,
                      wordBreak: "break-word",
                    }}
                  >
                    {sentence.english}
                  </div>
                  <div
                    style={{
                      color: "#6c757d",
                      fontStyle: "italic",
                      fontSize: "0.875em",
                      wordBreak: "break-word",
                    }}
                  >
                    {sentence.portuguese}
                  </div>
                </div>
              </div>

              <span>
                {!clickedButtons.has(i) && (
                  <Tooltip title="Adicionar ao flashcard" placement="top" arrow>
                    <button
                      disabled={loading}
                      style={{
                        all: "unset",
                        cursor: loading ? "not-allowed" : "pointer",
                        padding: "6px 10px",
                        backgroundColor: textpartnerColorContrast(),
                        color: loading ? "#ccc" : partnerColor(),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1em",
                        transition: "all 0.2s",
                        opacity: 0.7,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (loading) return;
                        addNewCards(
                          sentence.english,
                          sentence.portuguese,
                          i,
                          sentence.languages ? sentence.languages : null,
                        );
                      }}
                    >
                      +
                    </button>
                  </Tooltip>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ MODAL DOS EXERCÍCIOS (tabs) */}
      {showExercisesModal &&
        ReactDOM.createPortal(
          <>
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(15, 23, 42, 0.90)",
                zIndex: 999,
              }}
              onClick={() => setShowExercisesModal(false)}
            />

            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                boxShadow: "0 20px 40px rgba(15, 23, 42, 0.25)",
                width: "92vw",
                maxWidth: 980,
                maxHeight: "88vh",
                padding: 12,
                zIndex: 1000,
                overflow: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* header do modal */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                  gap: 10,
                }}
              >
                <div
                  style={{ fontWeight: 800, fontSize: "1em", color: "#111827" }}
                >
                  <HelpInfo
                    title="Como funciona o ditado"
                    text="Você vai ouvir uma frase em inglês e precisa escrever exatamente o que escutou.

Depois de responder, o sistema analisa sua frase palavra por palavra e mostra o resultado com cores:

🎯 Como as palavras são avaliadas

🟢 Verde (na posição correta)
A palavra está correta e no lugar certo na frase.
→ Esse é o melhor resultado.

🟡 Amarelo (fora da posição)
A palavra está correta, mas no lugar errado.
→ Você ouviu certo, mas organizou errado.

🔴 Vermelho (errada)
A palavra está incorreta ou não existe na frase original.
→ Aqui houve erro de escuta ou escrita.

🧮 Como sua pontuação é calculada

Sua nota é baseada principalmente nas palavras:

🟢 Palavra correta na posição → vale mais pontos

🟡 Palavra fora da posição → vale menos pontos

🔴 Palavra errada → não pontua

Além disso:

📊 Se sua frase estiver muito parecida com a original, você ganha um bônus de similaridade

💡 Dicas importantes

Preste atenção na ordem das palavras

Escute mais de uma vez se precisar

Pequenos erros (como plural ou artigo) já fazem diferença

Tente pensar na frase completa, não palavra por palavra

🏁 Objetivo

Conseguir escrever a frase exatamente como foi dita, com todas as palavras corretas e na ordem certa."
                    youtubeUrl=""
                    glow={true}
                    thePermissions="student"
                    anchor="inline"
                    initialPosition={{ x: 80, y: 120 }}
                    zIndex={2147484563647} // mais alto que quase tudo
                  />
                  <span
                    style={{
                      marginLeft: 8,
                    }}
                  >
                    Exercícios de Sentença
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button
                    onClick={() => setShowExercisesModal(false)}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "1.125em",
                      lineHeight: 1,
                      marginLeft: 4,
                    }}
                    aria-label="Fechar"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* conteúdo do modal */}
              {activeTab === "dictation" && (
                <DictationExercise
                  sentences={exercisePool}
                  studentId={studentId}
                  labels={defaultLabels}
                  selectedVoice={selectedVoice}
                  language={effectiveLanguage}
                  courseId={effectiveCourseId}
                  exerciseScore={(points, desc) => {
                    exerciseScore?.(points, desc || "Dictation", element?._id);
                  }}
                />
              )}
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
