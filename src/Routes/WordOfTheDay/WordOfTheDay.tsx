import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Tooltip } from "@mui/material";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import { backDomain } from "../../Resources/UniversalComponents";
import {
  notifyError,
  readText,
} from "../EnglishLessons/Assets/Functions/FunctionLessons";
import { partnerColor } from "../../Styles/Styles";

interface WordOfTheDayRv {
  headers: MyHeadersType | null;
  onChange: any;
  change: boolean;
}

const WordOfTheDay = ({ headers, onChange, change }: WordOfTheDayRv) => {
  const [myId, setId] = useState<string>("");
  const [see, setSee] = useState<boolean>(true);
  const [heardSentences, setHeardSentences] = useState([false, false, false]);
  const [theWord, setTheWord] = useState<string>("");
  const [nowGo, setNowGo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showWord, setShowWord] = useState(false);
  const [sentences, setSentences] = useState([
    { text: "", translation: "", added: false },
    { text: "", translation: "", added: false },
  ]);

  const [obj, setObj] = useState({
    explanation: "",
    monthClosing: new Date(),
    order: 0,
    sentenceOfTheDay: "",
    studentsWhoDidTheSentenceOfTheDay: [""],
    translationSentenceOfTheDay: "",
    translationWordOfTheDay: "",
    wordOfTheDay: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("loggedIn");
    if (user) {
      const { id } = JSON.parse(user);
      setId(id);
    }
  }, []);

  const actualHeaders = headers || {};
  const fetchObjectUniv = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backDomain}/api/v1/getobject`);
      const studentsWho =
        response.data.ordered[0].studentsWhoDidTheSentenceOfTheDay;
      setObj(response.data.ordered[0]);
      if (studentsWho.includes(myId)) {
        setSee(false);
      }
      const wordOfTheDay = response.data.ordered[0].wordOfTheDay;
      const translationWordOfTheDay =
        response.data.ordered[0].translationWordOfTheDay;

      const sentenceOfTheDay = response.data.ordered[0].sentenceOfTheDay;
      const translationSentenceOfTheDay =
        response.data.ordered[0].translationSentenceOfTheDay;
      setTheWord(wordOfTheDay);
      setSentences([
        {
          text: wordOfTheDay,
          translation: translationWordOfTheDay,
          added: false,
        },
        {
          text: sentenceOfTheDay,
          translation: translationSentenceOfTheDay,
          added: false,
        },
      ]);

      setNowGo(nowGo);
      setLoading(false);
    } catch (error: any) {
      notifyError(error.response?.data?.error || "Error adding flashcard.");
    }
  };

  const addNewCards = async () => {
    const newCards = [
      {
        wordOfTheDay: true,
        front: { text: sentences[0].text, language: "en" },
        back: { text: sentences[0].translation, language: "pt" },
        tags: [""],
      },
      {
        wordOfTheDay: true,
        front: { text: sentences[1].text, language: "en" },
        back: { text: sentences[1].translation, language: "pt" },
        tags: [""],
      },
    ];

    try {
      const response = await axios.post(
        `${backDomain}/api/v1/flashcard/${myId}`,
        { newCards },
        { headers: actualHeaders }
      );

      notifyError(
        "Card adicionado: " + response.data.addedNewFlashcards,
        "green"
      );
      fetchObjectUniv();
      onChange(!change);
    } catch (error: any) {
      notifyError(error.response?.data?.error || "Error adding flashcard.");
    }
  };

  useEffect(() => {
    fetchObjectUniv();
    setNowGo(nowGo);
  }, []);

  useEffect(() => {
    const verifyIfAdded = obj.studentsWhoDidTheSentenceOfTheDay.includes(myId);
    setTimeout(() => {
      if (verifyIfAdded) {
        setSee(false);
      } else {
        setSee(true);
      }
    }, 200);
  }, [obj]);

  const handleReadText = (index: number, text: string, language: string) => {
    readText(text, true, "en");
    const newHeardSentences = [...heardSentences];
    newHeardSentences[index] = true;
    setHeardSentences(newHeardSentences);
  };

  return loading ? (
    <CircularProgress style={{ color: partnerColor() }} />
  ) : (
    <>
      {see && (
        <>
          <span>
            {!showWord ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  paddingBottom: "15px",
                }}
              >
                <button
                  onClick={() => setShowWord(!showWord)}
                  className="pulse-button"
                  style={{
                    boxShadow: `0 0 12px ${partnerColor()}`,
                  }}
                >
                  Word of the Day
                </button>
              </div>
            ) : (
              <section
                style={{
                  margin: "auto",
                  maxWidth: "600px",
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  padding: "1rem",
                  marginBottom: "1rem",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div>
                  {sentences.map((sentence, index) => (
                    <div
                      key={index}
                      style={{
                        display: index === 0 ? "none" : "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        padding: "10px 14px",
                        borderRadius: "12px",
                        maxWidth: "400px",
                        marginInline: "auto",
                      }}
                    >
                      <>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "6px",
                          }}
                        >
                          <Tooltip title={"Add to flashcards"}>
                            <button
                              className="pulse-button"
                              onClick={() => {
                                addNewCards();
                              }}
                            >
                              <i className="fa fa-files-o" />
                            </button>
                          </Tooltip>
                          <span style={{ fontSize: "14px", color: "#333" }}>
                            <strong>{theWord}</strong> (
                            {sentences[0].translation})
                          </span>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                          }}
                        >
                          <i
                            onClick={() =>
                              handleReadText(index, sentence.text, "en")
                            }
                            className="fa fa-volume-up"
                            aria-hidden="true"
                            style={{
                              cursor: "pointer",
                              color: "#666",
                              fontSize: "16px",
                            }}
                          />
                          <div>
                            <div
                              style={{
                                fontWeight: 500,
                                fontSize: "15px",
                                color: "#222",
                              }}
                              dangerouslySetInnerHTML={{
                                __html: sentence.text,
                              }}
                            />
                            <div
                              style={{
                                fontSize: "13px",
                                color: "#777",
                                marginTop: "2px",
                              }}
                              dangerouslySetInnerHTML={{
                                __html: sentence.translation,
                              }}
                            />
                          </div>
                        </div>
                      </>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </span>
        </>
      )}
    </>
  );
};

export default WordOfTheDay;
