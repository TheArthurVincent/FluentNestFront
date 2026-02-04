import React, { useEffect, useMemo, useState } from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { notifyAlert, readText } from "../Functions/FunctionLessons";
import {
  backDomain,
  onLoggOut,
} from "../../../../Resources/UniversalComponents";
import axios from "axios";
import { Tooltip } from "@mui/material";
import { partnerColor } from "../../../../Styles/Styles";

interface VocabularyLessonProps {
  headers: MyHeadersType | null;
  element: any;
  studentId?: string;
  mainTag: string;
  selectedVoice: any;
  exerciseScore: (points: number, description: string, id?: string) => void;
  studentsIds?: string[];
}

type MatchState = {
  isMatchMode: boolean;
  selectedFront: number | null;
  matched: Set<number>;
  frontIdx: number[];
  backIdx: number[];
};

const pairColors = [
  "#4dabf7",
  "#51cf66",
  "#ffa94d",
  "#000000",
  "#845ef7",
  "#008cffff",
  "#753951",
  "#ff00aaff",
  "#7c542cff",
  "#926060ff",
  "#71b0d8ff",
  "#228be6",
  "#495057",
  "#5c7cfa",
  "#37b24d",
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
  exerciseScore,
  selectedVoice,
  studentsIds,
}: VocabularyLessonProps) {
  const actualHeaders = headers || {};
  const { permissions } = JSON.parse(localStorage.getItem("loggedIn") || "{}");

  const [clickedButtons, setClickedButtons] = useState<Set<number>>(new Set());
  const [seeFront, setSeeFront] = useState(false);

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [match, setMatch] = useState<MatchState>({
    isMatchMode: false,
    selectedFront: null,
    matched: new Set(),
    frontIdx: [],
    backIdx: [],
  });

  const sentences: any[] = useMemo(() => {
    return Array.isArray(element?.sentences) ? element.sentences : [];
  }, [element?.sentences]);

  // Sempre que mudar o conteúdo, libera o "Add all" de novo
  useEffect(() => {
    setDone(false);
    setLoading(false);
    setClickedButtons(new Set());
  }, [element?.sentences]);

  const getLanguages = (sentence: any) => {
    const languages = sentence?.languages || {};
    return {
      frontLang: languages.language1 || "en",
      backLang: languages.language2 || "pt",
    };
  };

  const getTargetIds = (): string[] => {
    if (
      permissions !== "student" &&
      Array.isArray(studentsIds) &&
      studentsIds.length > 0
    ) {
      return studentsIds;
    }
    if (studentId) return [studentId];
    return [];
  };

  const toggleMatchMode = () => {
    if (!match.isMatchMode) {
      const base = sentences.map((_, i) => i);
      setMatch({
        isMatchMode: true,
        selectedFront: null,
        matched: new Set(),
        frontIdx: shuffleArray(base),
        backIdx: shuffleArray(base),
      });
    } else {
      setMatch({
        isMatchMode: false,
        selectedFront: null,
        matched: new Set(),
        frontIdx: [],
        backIdx: [],
      });
    }
  };

  const onPickFront = (realIndex: number) => {
    if (match.matched.has(realIndex)) return;
    setMatch((prev) => ({ ...prev, selectedFront: realIndex }));
  };

  const onPickBack = (backSlotPosition: number) => {
    const realBackIndex = match.backIdx[backSlotPosition];
    const { selectedFront } = match;

    if (selectedFront === null) {
      notifyAlert(
        "Selecione primeiro um item da coluna da esquerda.",
        "orange",
      );
      return;
    }

    if (selectedFront === realBackIndex) {
      const newMatched = new Set(match.matched);
      newMatched.add(selectedFront);

      setMatch((prev) => ({
        ...prev,
        selectedFront: null,
        matched: newMatched,
      }));
      notifyAlert("✔ Par correto!", partnerColor());
    } else {
      notifyAlert("❌ Não é o par correspondente.", "red");
      setMatch((prev) => ({ ...prev, selectedFront: null }));
    }
  };

  const addNewCards = async (
    frontText: string,
    backText: string,
    index: number,
    languages: any | null,
  ) => {
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
        messages.join(" | ") || "Flashcards adicionados.",
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

    setLoading(true);
    try {
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
        messages.join(" | ") || "Flashcards adicionados.",
        partnerColor(),
      );
      setClickedButtons(new Set(sentences.map((_, idx) => idx)));
      setDone(true);
    } catch (error) {
      alert("Erro ao enviar cards");
      onLoggOut();
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div style={{ padding: "0px", minHeight: "100px" }}>
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

        {!match.isMatchMode && !done && (
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
              fontSize: 12,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all .2s",
            }}
          >
            {loading ? "Adding..." : "Add all"}
          </button>
        )}

        <button
          onClick={toggleMatchMode}
          style={{
            border: `1px solid ${partnerColor()}`,
            background: partnerColor(),
            color: "#fff",
            fontWeight: "700",
            padding: "6px 10px",
            borderRadius: 6,
            fontSize: 12,
            cursor: "pointer",
            transition: "all .2s",
          }}
        >
          {match.isMatchMode ? "Close Match Mode" : "Match Mode"}
        </button>
      </div>

      {!match.isMatchMode && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "10px",
          }}
        >
          {sentences.map((sentence: any, i: number) => {
            const { frontLang, backLang } = getLanguages(sentence);

            return (
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
                    <Tooltip title="Ouvir frente" placement="top" arrow>
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
                          readText(
                            sentence.english,
                            true,
                            frontLang,
                            selectedVoice,
                          );
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
                          disabled={loading}
                          style={{
                            background: "none",
                            color: loading ? "#ccc" : partnerColor(),
                            width: "18px",
                            height: "18px",
                            border: "none",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            fontSize: "15px",
                            cursor: loading ? "not-allowed" : "pointer",
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
            );
          })}
        </div>
      )}

      {match.isMatchMode && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.3fr 1fr",
            gap: 12,
          }}
        >
          <div style={{ display: "grid", gap: 10 }}>
            {match.frontIdx.map((realIndex, slot) => {
              const s = sentences[realIndex];
              const isSelected = match.selectedFront === realIndex;
              const isDone = match.matched.has(realIndex);
              const color = pairColors[realIndex % pairColors.length];
              const { frontLang } = getLanguages(s);

              return (
                <div
                  key={`front-${slot}`}
                  style={{
                    ...cardStyle,
                    border: `3px solid ${isDone ? color : "transparent"}`,
                    position: "relative",
                    ...(isSelected
                      ? selectedStyle
                      : { border: "#eee 1px solid" }),
                    ...(isDone ? { backgroundColor: `${color}20` } : {}),
                  }}
                  onClick={() => {
                    onPickFront(realIndex);
                    readText(s.english, true, frontLang, selectedVoice);
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
                      <Tooltip title="Ouvir" placement="top" arrow>
                        <div
                          style={{ color: partnerColor(), fontSize: "13px" }}
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

          <div style={{ display: "grid", gap: 10 }}>
            {match.backIdx.map((realIndex, slot) => {
              const sentence = sentences[realIndex];
              const isDone = match.matched.has(realIndex);
              const color = pairColors[realIndex % pairColors.length];
              const { backLang } = getLanguages(sentence);

              return (
                <div
                  key={`back-${slot}`}
                  style={{
                    ...cardStyle,
                    border: `3px solid ${isDone ? color : "transparent"}`,
                    position: "relative",
                    ...(isDone ? { backgroundColor: `${color}20` } : {}),
                  }}
                  onClick={() => {
                    if (!isDone) onPickBack(slot);
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
                      {backLang !== "pt" && sentence?.portuguese && (
                        <Tooltip title="Ouvir definição" placement="top" arrow>
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
                              readText(
                                sentence.portuguese,
                                true,
                                backLang,
                                selectedVoice,
                              );
                            }}
                          >
                            <i className="fa fa-volume-up" aria-hidden="true" />
                          </button>
                        </Tooltip>
                      )}

                      <div style={{ marginLeft: 10 }}>
                        <div
                          style={{
                            color: "#6c757d",
                            fontStyle: "italic",
                            fontSize: "13px",
                            wordBreak: "break-word",
                          }}
                        >
                          {sentence?.portuguese}
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
