import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { backDomain, formatDateBr } from "../../Resources/UniversalComponents";
import { readText } from "../EnglishLessons/Assets/Functions/FunctionLessons";
import { HOne, RouteDiv } from "../../Resources/Components/RouteBox";
import { partnerColor } from "../../Styles/Styles";

type WordItem = {
  _id: string;
  word: string;
  translatedWord: string;
  date: string;
  sentence: string;
  translatedSentence: string;
  studentsWhoDidIt?: { fullName: string; photo: string }[];
};

const WordOfTheDayList = () => {
  const [words, setWords] = useState<WordItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchWords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backDomain}/api/v1/wordoftheday`);
      setWords(response.data.words || []);
      console.log(response.data.words || []);
    } catch (error: any) {
      console.log(error?.response?.data?.error || "Error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "2rem" }}
      >
        <CircularProgress style={{ color: partnerColor() }} />
      </div>
    );
  }

  return (
    <RouteDiv style={{ maxWidth: "70vw", overflowX: "auto" }}>
      <HOne>Word of the Day</HOne>
      {words.map((w) => (
        <div key={w._id}>
          <div
            style={{
              width: "60vw",
              height: "60vw",
              maxWidth: 300,
              maxHeight: 300,
              margin: "auto",
              marginBottom: 24,
              aspectRatio: "1 / 1",
              border: "1px solid #ddd",
              borderRadius: 6,
              padding: "10px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#fff",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              overflow: "hidden",
              textAlign: "center",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                borderRadius: 6,
                padding: "10px 12px",
                boxSizing: "border-box",
                background: `linear-gradient(135deg, ${partnerColor()}20 0%, ${partnerColor()}08 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <div style={{ minWidth: 0, textAlign: "center" }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 14,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <span style={{ color: "#222", fontWeight: 800 }}>
                    {w.word}
                  </span>{" "}
                  <span style={{ color: "#666", fontWeight: 600 }}>
                    | {w.translatedWord}
                  </span>
                </h3>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: 4,
                    fontSize: 10,
                    color: "#555",
                    background: "#f5f5f7",
                    border: "1px solid #eaeaea",
                    padding: "2px 6px",
                    borderRadius: 6,
                  }}
                >
                  {formatDateBr(w.date)}
                </span>
              </div>
            </div>

            {/* FRASE */}
            <div
              style={{
                width: "100%",
                alignItems: "center",
                boxSizing: "border-box",
                padding: "10px 10px 10px 12px",
                marginTop: 8,
                borderRadius: 6,
                background: "#fcfcfd",
                border: "1px solid #eee",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  background: partnerColor(),
                  opacity: 0.9,
                }}
              />
              <div style={{ lineHeight: 1.35 }}>
                <p
                  style={{
                    fontSize: 12,
                    margin: 0,
                    fontWeight: 800,
                    color: "#1d1d1f",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={w.sentence}
                >
                  {w.sentence}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    margin: "6px 0 0 0",
                    color: "#5f6368",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                  title={w.translatedSentence}
                >
                  {w.translatedSentence}
                </p>
              </div>
            </div>

            {/* BOTÃO AUDIO */}
            <button
              aria-label="Ouvir frase"
              title="Ouvir frase"
              style={{
                border: "none",
                background: "#f5f5f5",
                borderRadius: 6,
                marginTop: 8,
                width: 36,
                height: 36,
                cursor: "pointer",
              }}
              onClick={() => readText(w.sentence, false, "en")}
            >
              <i className="fa fa-volume-up" aria-hidden="true" />
            </button>

            {/* ALUNOS */}
            {(w.studentsWhoDidIt?.length ?? 0) > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginTop: 8,
                }}
              >
                {w.studentsWhoDidIt!.map((s, idx) => (
                  <div key={`${w._id}-${idx}`} title={s.fullName}>
                    <img
                      style={{
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        objectFit: "cover",
                        marginRight: 4,
                      }}
                      src={s.photo}
                      alt={s.fullName}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </RouteDiv>
  );
};

export default WordOfTheDayList;
