import React, { useMemo, useState } from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { notifyAlert, readText } from "../Functions/FunctionLessons";
import {
  backDomain,
  onLoggOut,
} from "../../../../Resources/UniversalComponents";
import axios from "axios";
import { Tooltip } from "@mui/material";
import {
  partnerColor,
  textpartnerColorContrast,
} from "../../../../Styles/Styles";

interface VocabularyLessonProps {
  headers: MyHeadersType | null;
  element: any;
  studentId: string;
  mainTag: string;
  selectedVoice: any;
}

type MatchState = {
  isMatchMode: boolean;
  selectedFront: number | null; // índice do front selecionado
  matched: Set<number>; // índices já acertados
  shuffledIdx: number[]; // mapeia posição -> índice real do back
};

// Paleta de cores para os pares
const pairColors = [
  "#ff6b6b", // vermelho
  "#4dabf7", // azul
  "#51cf66", // verde
  "#ffa94d", // laranja
  "#845ef7", // roxo
  "#f06595", // rosa
  "#20c997", // turquesa
  "#fcc419", // amarelo
  "#339af0", // azul claro
  "#ff922b", // laranja escuro
  "#7950f2", // violeta
  "#e64980", // magenta
  "#12b886", // verde esmeralda
  "#f783ac", // salmão
  "#228be6", // azul royal
  "#000000", // preto
  "#495057", // cinza escuro
  "#f03e3e", // vermelho forte
  "#5c7cfa", // azul vibrante
  "#37b24d", // verde vibrante
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function VocabularyLesson({
  headers,
  element,
  mainTag,
  studentId,
  selectedVoice,
}: VocabularyLessonProps) {
  const actualHeaders = headers || {};
  const [clickedButtons, setClickedButtons] = useState<Set<number>>(new Set());
  const [seeFront, setSeeFront] = useState(true);

  // ======== ESTADO DO EXERCÍCIO DE MATCH ========
  const [match, setMatch] = useState<MatchState>({
    isMatchMode: false,
    selectedFront: null,
    matched: new Set(),
    shuffledIdx: [],
  });

  const sentences: any[] = Array.isArray(element?.sentences)
    ? element.sentences
    : [];

  // Embaralhamos apenas quando entramos no modo match ou quando a lista muda
  const shuffledBackIndices = useMemo(() => {
    const base = sentences.map((_, i) => i);
    return shuffleArray(base);
  }, [sentences]);

  // Ativar/desativar o modo match
  const toggleMatchMode = () => {
    if (!match.isMatchMode) {
      setMatch({
        isMatchMode: true,
        selectedFront: null,
        matched: new Set(),
        shuffledIdx: shuffledBackIndices,
      });
    } else {
      setMatch({
        isMatchMode: false,
        selectedFront: null,
        matched: new Set(),
        shuffledIdx: [],
      });
    }
  };

  const onPickFront = (frontIndex: number) => {
    if (match.matched.has(frontIndex)) return; // já acertado
    setMatch((prev) => ({ ...prev, selectedFront: frontIndex }));
  };

  const onPickBack = (backSlotPosition: number) => {
    const realBackIndex = match.shuffledIdx[backSlotPosition];
    const { selectedFront } = match;

    if (selectedFront === null) {
      notifyAlert(
        "Selecione primeiro um item da coluna da esquerda.",
        "orange"
      );
      return;
    }

    if (selectedFront === realBackIndex) {
      // ACERTOU
      const newMatched = new Set(match.matched);
      newMatched.add(selectedFront);
      setMatch((prev) => ({
        ...prev,
        selectedFront: null,
        matched: newMatched,
      }));
      notifyAlert("✔ Par correto!", "green");
    } else {
      // ERROU
      notifyAlert("❌ Não é o par correspondente.", "red");
      setMatch((prev) => ({ ...prev, selectedFront: null }));
    }
  };

  const addNewCards = async (
    frontText: string,
    backText: string,
    index: number,
    languages: any | null
  ) => {
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
      const response = await axios.post(
        `${backDomain}/api/v1/flashcard/${studentId}`,
        { newCards },
        { headers: actualHeaders }
      );
      const showThis =
        `${
          response.data.addedNewFlashcards
            ? response.data.addedNewFlashcards
            : ""
        }` +
        `${response.data.invalidNewCards ? response.data.invalidNewCards : ""}`;

      notifyAlert(showThis, "green");
      setClickedButtons((prev) => new Set(prev).add(index));
    } catch (error) {
      alert("Erro ao enviar cards");
      onLoggOut();
    }
  };

  // ======== ESTILOS UTILITÁRIOS LOCAIS ========
  const cardStyle: React.CSSProperties = {
    border: "1px solid #e3e6ea",
    borderRadius: "4px",
    padding: "8px",
    position: "relative",
    minHeight: "40px",
    display: "flex",
    background: "#fff",
    justifyContent: "flex-start",
    cursor: "pointer",
  };

  const selectedStyle: React.CSSProperties = {
    outline: `3px solid ${partnerColor()}`,
    outlineOffset: 2,
  };

  // não mexe na borda para não matar a cor do par
  const matchedStyle: React.CSSProperties = {
    background: "#f0fff4",
  };

  return (
    <div
      style={{
        padding: "0px",
        minHeight: "100px",
      }}
    >
      {/* ======== Toggle Lista/Match ======== */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 10,
          gap: 8,
        }}
      >
        {match.isMatchMode && (
          <button
            onClick={() => setSeeFront(!seeFront)}
            style={{
              border: `1px solid ${partnerColor()}`,
              padding: "6px 10px",
              borderRadius: 6,
              fontSize: 13,
              cursor: "pointer",
              transition: "all .2s",
            }}
          >
            <i
              className={`fa ${seeFront ? "fa-eye" : "fa-eye-slash"}`}
              aria-hidden="true"
            />
          </button>
        )}

        <button
          onClick={toggleMatchMode}
          style={{
            border: `1px solid ${partnerColor()}`,
            background: match.isMatchMode ? partnerColor() : "#ffffff",
            color: match.isMatchMode
              ? textpartnerColorContrast()
              : partnerColor(),
            padding: "6px 10px",
            borderRadius: 6,
            fontSize: 13,
            cursor: "pointer",
            transition: "all .2s",
          }}
        >
          {match.isMatchMode ? "Ver definições" : "Modo Match"}
        </button>
      </div>

      {/* ======== MODO LISTA (ORIGINAL) ======== */}
      {!match.isMatchMode && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "10px",
          }}
        >
          {element.sentences &&
            element.sentences.map((sentence: any, i: number) => (
              <div
                key={i}
                style={{
                  border: "1px solid #e3e6ea",
                  borderRadius: "4px",
                  padding: "8px 12px 8px 12px",
                  position: "relative",
                  minHeight: "40px",
                  display: "flex",
                  flexDirection: "column",
                  background: "#fff",
                  justifyContent: "flex-start",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f3f3f3ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "space-between",
                  }}
                >
                  {/* Botão + para adicionar aos flashcards */}
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    {/* Botão de áudio */}
                    <Tooltip title="Ouvir" placement="top" arrow>
                      <button
                        style={{
                          color: partnerColor(),
                          padding: 0,
                          border: "none",
                          cursor: "pointer",
                          fontSize: "13px",
                          background: "none",
                          transition: "all 0.2s",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          readText(sentence.english, true, "en", selectedVoice);
                        }}
                      >
                        <i className="fa fa-volume-up" aria-hidden="true" />
                      </button>
                    </Tooltip>
                    <div style={{ marginLeft: 10 }}>
                      <div
                        style={{
                          fontWeight: 500,
                          color: "#222",
                          fontSize: "14px",
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
                          fontSize: "13px",
                          wordBreak: "break-word",
                        }}
                      >
                        {sentence.portuguese}
                      </div>
                    </div>
                  </span>
                  <span>
                    {!clickedButtons.has(i) && (
                      <Tooltip
                        title="Adicionar ao flashcard"
                        placement="top"
                        arrow
                      >
                        <button
                          style={{
                            backgroundColor: "none",
                            color: partnerColor(),
                            width: "5px",
                            height: "5px",
                            border: "none",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            fontSize: "15px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            opacity: 0.7,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            addNewCards(
                              sentence.english,
                              sentence.portuguese,
                              i,
                              sentence.languages ? sentence.languages : null
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
      )}

      {/* ======== MODO MATCH ======== */}
      {match.isMatchMode && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {/* Coluna LEFT: FRONTS (inglês) */}
          <div style={{ display: "grid", gap: 10 }}>
            {sentences.map((s, idx) => {
              const isSelected = match.selectedFront === idx;
              const isDone = match.matched.has(idx);
              const color = pairColors[idx % pairColors.length];

              return (
                <div
                  key={`front-${idx}`}
                  style={{
                    ...cardStyle,
                    border: `3px solid ${isDone ? color : "transparent"}`, // borda colorida do par
                    position: "relative",
                    ...(isSelected ? selectedStyle : {}),
                    ...(isDone ? matchedStyle : {}),
                  }}
                  onClick={() => {
                    onPickFront(idx);
                    readText(s.english, true, "en", selectedVoice);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDone
                      ? "#f0fff4"
                      : "#f3f3f3ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDone
                      ? "#f0fff4"
                      : "#fff";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <Tooltip title="Ouvir" placement="top" arrow>
                        <div
                          style={{
                            color: partnerColor(),
                            padding: 0,
                            border: "none",
                            cursor: "pointer",
                            fontSize: "13px",
                            background: "none",
                            transition: "all 0.2s",
                          }}
                        >
                          <i className="fa fa-volume-up" aria-hidden="true" />
                        </div>
                      </Tooltip>
                      <div style={{ marginLeft: 5 }}>
                        {seeFront && (
                          <div
                            style={{
                              fontWeight: 600,
                              color: "#222",
                              fontSize: "14px",
                              wordBreak: "break-word",
                            }}
                          >
                            {s.english}
                          </div>
                        )}
                      </div>
                    </span>
                    {isDone && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "#16a34a",
                          fontWeight: 600,
                        }}
                      >
                        ✔
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Coluna RIGHT: BACKS (português) embaralhados */}
          <div style={{ display: "grid", gap: 10 }}>
            {match.shuffledIdx.map((realIndex, slot) => {
              const isDone = match.matched.has(realIndex);
              const color = pairColors[realIndex % pairColors.length];

              return (
                <div
                  key={`back-${slot}`}
                  style={{
                    ...cardStyle,
                    border: `3px solid ${isDone ? color : "transparent"}`, // borda colorida do par
                    position: "relative",
                    ...(isDone ? matchedStyle : {}),
                  }}
                  onClick={() => {
                    if (!isDone) onPickBack(slot);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDone
                      ? "#f0fff4"
                      : "#f3f3f3ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDone
                      ? "#f0fff4"
                      : "#fff";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div style={{ marginLeft: 10 }}>
                        <div
                          style={{
                            color: "#6c757d",
                            fontStyle: "italic",
                            fontSize: "13px",
                            wordBreak: "break-word",
                          }}
                        >
                          {sentences[realIndex]?.portuguese}
                        </div>
                      </div>
                    </span>
                    {isDone && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "#16a34a",
                          fontWeight: 600,
                        }}
                      >
                        ✔
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
