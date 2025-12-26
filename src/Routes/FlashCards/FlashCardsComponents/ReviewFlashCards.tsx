import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import {
  backDomain,
  onLoggOut,
  updateInfo,
} from "../../../Resources/UniversalComponents";
import { useUserContext } from "../../../Application/SelectLanguage/SelectLanguage";
import {
  notifyAlert,
  readText,
} from "../../EnglishLessons/Assets/Functions/FunctionLessons";
import { partnerColor, textPrimaryColorContrast } from "../../../Styles/Styles";
import { ProgressCounter } from "../../FlashCardsToday/FlashCardsToday";
import Voice from "../../../Resources/Voice";

interface FlashCardsPropsRv {
  headers: MyHeadersType | null;
  onChange: any;
  change: boolean;
  selectedStudentId: string;
}

const ReviewFlashCards = ({
  headers,
  onChange,
  change,
  selectedStudentId,
}: FlashCardsPropsRv) => {
  const { UniversalTexts } = useUserContext();
  const [myId, setId] = useState<string>("");
  const [myPermissions, setPermissions] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [cards, setCards] = useState<any[]>([]);
  const [messageBack, setMessageBack] = useState<string>(
    "Nenhum flashcard para revisar! Adicione palavras em seus flashcards."
  );
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [answer, setAnswer] = useState<boolean>(false);
  const [cardsLength, setCardsLength] = useState<boolean>(true);
  const [see, setSee] = useState<boolean>(false);
  const [seeConf, setSeeConf] = useState<boolean>(false);
  const [count, setCount] = useState<number>(4);
  const [backCardVisible, setBackCardVisible] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("nofilter");
  const [lang, setLang] = useState<string>("en");
  const [textColor, setTextColor] = useState<string>("#000");
  const [timerCardCount, setTimerCardCount] = useState(19);
  const [flashcardsToday, setFlashcardsToday] = useState<number>(0);
  const [selectedVoice, setSelectedVoice] = useState<any>("");
  const [changeNumber, setChangeNumber] = useState<boolean>(true);
  const [playCardAutomatically, setPlayCardAutomatically] =
    useState<boolean>(true);
  const [languageToUse, setLanguageToUse] = useState<string>("en");

  const actualHeaders = headers || {};

  const seeCardsToReview = async () => {
    if (!selectedStudentId) return;

    updateInfo(myId, actualHeaders);
    timerCard();
    setLoading(true);
    setAnswer(false);
    setBackCardVisible(false);
    setSee(true);

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/flashcards/${selectedStudentId}`,
        {
          headers: actualHeaders,
          params: { category, lang },
        }
      );

      const thereAreCards = response.data.dueFlashcards.length > 0;
      setCardsLength(thereAreCards);
      setMessageBack(response.data.message || "");

      if (thereAreCards) {
        var lg = response.data.dueFlashcards?.[0].front?.language;
        setLanguageToUse(lg ? lg : "en");
      }
      if (
        response.data.dueFlashcards.length > 0 &&
        response.data.dueFlashcards[0].front.language &&
        response.data.dueFlashcards[0].front &&
        playCardAutomatically &&
        response.data.dueFlashcards[0].front.language !== "pt"
      ) {
        setTimeout(() => {
          readText(
            response.data.dueFlashcards[0].front?.text,
            false,
            lg,
            selectedVoice
          );
        }, 200);
      }
      console.log("response.data.dueFlashcards", response.data.dueFlashcards);
      if (response.data.dueFlashcards.length > 0) {
        localStorage.setItem(
          "lastFlashcardReviewed",
          JSON.stringify(response.data.dueFlashcards[0])
        );
        setCards(response.data.dueFlashcards);
        setFlashcardsToday(response.data.flashcardsToday);
        localStorage.setItem(
          "flashcardsToday",
          JSON.stringify(response.data.flashcardsToday)
        );

        setBackCardVisible(true);
        timerDisabled();
        timerCard();
      } else {
        setCards([]);
      }
      setLoading(false);
      setFlashcardsToday(response.data.flashcardsToday);
    } catch (error) {
      notifyAlert("Erro ao enviar cards");
      onLoggOut();
    }
  };

  const reviewCard = async (id: string, difficulty: string) => {
    if (!selectedStudentId) return;

    setLoading(true);
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/reviewflashcard/${selectedStudentId}`,
        {
          flashcardId: id,
          difficulty,
          timerCardCount,
          dayToday: new Date().toISOString(),
        },
        { headers: actualHeaders }
      );
      setCards(response.data.dueFlashcards);
      setAnswer(false);
      onChange(!change);
      seeCardsToReview();
      timerDisabled();
    } catch (error) {
      onLoggOut();
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("loggedIn");
    if (user) {
      const { permissions, id } = JSON.parse(user);
      setId(id);
      setPermissions(permissions);
    }
    setAnswer(false);
    updateInfo(myId, actualHeaders);
  }, [change]);

  useEffect(() => {
    setTimeout(() => {
      setSeeConf(seeConf);
    }, 1000);
  }, [change]);

  useEffect(() => {
    const categoryColors: { [key: string]: string } = {
      vocabulary: "#D0F5D0",
      possessive: "#D6EBF5",
      be: "#FAE9D3",
      modal: "#EEEEEE",
      question: "#D9F3F6",
      do: "#DDE3EF",
      dont: "#FFFFF5",
      did: "#FFFEEF",
      irregularpast: "#F7F4C2",
      presentperfect: "#F1FFFF",
      pastperfect: "#F5F5FA",
      travel: "#F0F8FF",
      bodyparts: "#FFF5F5",
      businessenglish: "#E8F6EF",
      family: "#FFEFD5",
      animals: "#F0FFF0",
      fruits: "#FFF8DC",
      food: "#FFF5EE",
      colors: "#F5F5F5",
      house: "#F0F5FF",
      supermarket: "#FAF0E6",
      weather: "#F0FFFF",
      clothes: "#FFF0F5",
      time: "#F5F5DC",
      daysanddates: "#FFFFE0",
      car: "#FFFAFA",
      road: "#F5F0E1",
      personality: "#FFE4E1",
      nature: "#F0FFF0",
      numbers: "#FAFAD2",
      transportation: "#F5FFFA",
      office: "#F8F8FF",
      diseases: "#FFFACD",
      professions: "#F8F8FF",
    };

    setTextColor(categoryColors[category] || "#fff");
  }, [category]);

  const timerDisabled = () => {
    if (myPermissions !== "superadmin") {
      setCount(3);
      setIsDisabled(true);

      const timers = [
        setTimeout(() => setCount(2), 1000),
        setTimeout(() => setCount(1), 2000),
        setTimeout(() => setIsDisabled(false), 3000),
      ];

      return () => timers.forEach(clearTimeout);
    } else {
      setIsDisabled(false);
    }
  };

  const timerCard = () => {
    // @ts-ignore
    const timers = [];
    for (let i = 20; i >= 1; i--) {
      const delay = i === 10 ? 11000 : i === 9 ? 10000 : (21 - i) * 1000;
      // @ts-ignore
      timers.push(setTimeout(() => setTimerCardCount(i), delay));
    }
    // @ts-ignore
    return () => timers.forEach(clearTimeout);
  };

  const getHistory = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${backDomain}/api/v1/flashcardhistory/${id}`,
        { dateToday: new Date().toISOString() },
        { headers: actualHeaders }
      );
      setFlashcardsToday(response.data.flashCardsReviewsToday);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStudentId) {
      getHistory(selectedStudentId);
    }
  }, [selectedStudentId]);

  useEffect(() => {
    setSee(false);
    setCards([]);
    setAnswer(false);
    setBackCardVisible(false);
    setIsDisabled(true);
  }, [selectedStudentId]);

  useEffect(() => {
    const storedVoice = localStorage.getItem("chosenVoice");
    setSelectedVoice(storedVoice);
  }, [selectedVoice, changeNumber]);

  const cardRef = useRef<HTMLDivElement>(null);

  // ---------------- RENDER ----------------
  return (
    <section style={{ padding: "0 1rem", marginTop: "1rem" }}>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "160px",
          }}
        >
          <CircularProgress size={24} style={{ color: partnerColor() }} />
        </div>
      ) : (
        <div
          style={{
            margin: "0 auto",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* CONTROLS SUPERIORES */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 4,
              flexWrap: "wrap",
            }}
          >
            <Voice
              maxW="auto"
              changeB={changeNumber}
              setChangeB={setChangeNumber}
              chosenLanguage={languageToUse}
            />

            <select
              id="language-select"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{
                borderRadius: 999,
                border: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc",
                fontSize: "11px",
                fontWeight: 400,
                color: "#64748b",
                padding: "4px 10px",
                height: "28px",
                minWidth: "120px",
                maxWidth: "150px",
                outline: "none",
                cursor: "pointer",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = partnerColor())
              }
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>

          {/* LINHA DIVISÓRIA */}
          <div
            style={{
              marginTop: 8,
              borderTop: "1px solid #e2e8f0",
            }}
          />

          {/* ÁREA DO FLASHCARD / LISTA */}
          <div
            style={{
              marginTop: 8,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {see && (
              <div ref={cardRef} style={{ width: "100%", maxWidth: 420 }}>
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "2rem",
                    }}
                  >
                    <CircularProgress
                      size={20}
                      style={{ color: partnerColor() }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      textAlign: "center",
                      color: "#0f172a",
                    }}
                  >
                    {cardsLength ? (
                      <>
                        {/* BOTÃO ANSWER/BACK */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: 10,
                          }}
                        >
                          <button
                            disabled={isDisabled}
                            style={{
                              cursor: isDisabled ? "not-allowed" : "pointer",
                              color: isDisabled
                                ? "#e5e7eb"
                                : textPrimaryColorContrast(),
                              backgroundColor: isDisabled
                                ? "#cbd5e1"
                                : partnerColor(),
                              border: "none",
                              borderRadius: 999,
                              padding: "6px 14px",
                              fontSize: 12,
                              fontWeight: 500,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              minWidth: 80,
                              boxShadow: isDisabled
                                ? "none"
                                : "0 4px 10px rgba(15,23,42,0.18)",
                              transition: "all 0.15s ease",
                            }}
                            onClick={() => {
                              setBackCardVisible(!backCardVisible);
                              setAnswer(!answer);
                            }}
                          >
                            {isDisabled ? (
                              <span>{count}</span>
                            ) : (
                              <span>
                                {answer
                                  ? UniversalTexts?.back || "Back"
                                  : UniversalTexts?.answer || "Answer"}
                              </span>
                            )}
                          </button>
                        </div>

                        {/* BOTÕES HARD/EASY */}
                        {answer && (
                          <div style={{ marginTop: "0.5rem" }}>
                            <div
                              style={{
                                justifyContent: "center",
                                display: "flex",
                                gap: "10px",
                                marginBottom: "1rem",
                              }}
                            >
                              <button
                                onClick={() => reviewCard(cards[0]._id, "hard")}
                                style={{
                                  backgroundColor: "#f97373",
                                  color: "#fff",
                                  border: "none",
                                  padding: "6px 14px",
                                  borderRadius: 999,
                                  fontSize: 11,
                                  fontWeight: 500,
                                  cursor: "pointer",
                                  boxShadow:
                                    "0 4px 10px rgba(248,113,113,0.35)",
                                }}
                              >
                                {UniversalTexts?.iMissed || "I missed (Errei)"}
                              </button>

                              <button
                                onClick={() => reviewCard(cards[0]._id, "easy")}
                                style={{
                                  backgroundColor: partnerColor(),
                                  color: textPrimaryColorContrast(),
                                  border: "none",
                                  padding: "6px 14px",
                                  borderRadius: 999,
                                  fontSize: 11,
                                  fontWeight: 500,
                                  cursor: "pointer",
                                  boxShadow: "0 4px 10px rgba(34,197,94,0.35)",
                                }}
                              >
                                {UniversalTexts?.iGotIt ||
                                  "I got it! (Acertei)"}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* CARTÃO EM SI */}
                        <div
                          style={{ margin: "0 auto" }}
                          className={`flashcard ${answer ? "flip" : ""}`}
                        >
                          {/* FRONT */}
                          <div
                            style={{
                              backgroundColor: textColor,
                              display: !backCardVisible ? "none" : "block",
                              borderRadius: 10,
                              padding: "12px 14px",
                              boxShadow: "0 8px 20px rgba(15,23,42,0.18)",
                              minHeight: 130,
                            }}
                            className="flashcard-front"
                          >
                            <div>
                              <span
                                style={{
                                  fontSize: 11,
                                  color: "#0f172a",
                                  backgroundColor: "#e5e7eb",
                                  borderRadius: 999,
                                  padding: "2px 8px",
                                  display: "inline-block",
                                  marginBottom: 6,
                                  fontWeight: 500,
                                }}
                              >
                                {Math.round(cards[0]?.numberOfReviews) || 0}{" "}
                                {Math.round(cards[0]?.numberOfReviews) === 1
                                  ? UniversalTexts?.review || "review"
                                  : UniversalTexts?.reviews || "reviews"}
                              </span>
                              <div
                                style={{
                                  fontSize: 16,
                                  margin: "10px",
                                  fontWeight: 600,
                                }}
                              >
                                {cards[0]?.front?.text}
                              </div>

                              {cards[0]?.front?.language &&
                                cards[0].front.language !== "pt" && (
                                  <button
                                    className="audio-button bgwhite"
                                    onClick={() =>
                                      readText(
                                        cards[0].front.text,
                                        true,
                                        cards[0].front.language,
                                        selectedVoice
                                      )
                                    }
                                    style={{
                                      borderRadius: 999,
                                      border: "1px solid #e5e7eb",
                                      padding: "4px 8px",
                                      fontSize: 11,
                                      cursor: "pointer",
                                      backgroundColor: "#ffffff",
                                      boxShadow:
                                        "0 4px 10px rgba(15,23,42,0.08)",
                                    }}
                                  >
                                    <i
                                      className="fa fa-volume-up"
                                      aria-hidden="true"
                                    />
                                  </button>
                                )}

                              {cards[0]?.img &&
                                cards[0]?.front?.language === "pt" && (
                                  <img
                                    style={{
                                      width: "50%",
                                      maxWidth: "8rem",
                                      aspectRatio: "1 / 1",
                                      objectFit: "cover",
                                      display: "block",
                                      margin: "1rem auto 0",
                                      objectPosition: "center",
                                      borderRadius: "8px",
                                      boxShadow:
                                        "0 8px 20px rgba(15,23,42,0.22)",
                                    }}
                                    src={cards[0]?.img}
                                    alt={cards[0]?.front?.text}
                                  />
                                )}
                            </div>
                          </div>

                          {/* BACK */}
                          <div
                            style={{
                              display: backCardVisible ? "none" : "block",
                              borderRadius: 10,
                              padding: "12px 14px",
                              boxShadow: "0 8px 20px rgba(15,23,42,0.18)",
                              backgroundColor: "#0f172a",
                              color: "#e5e7eb",
                              minHeight: 130,
                            }}
                            className="flashcard-back"
                          >
                            <div>
                              <div
                                style={{
                                  fontSize: 11,
                                  marginBottom: 10,
                                  opacity: 0.9,
                                }}
                              >
                                {cards[0]?.front?.text}
                              </div>
                              <div
                                style={{
                                  fontSize: 16,
                                  margin: "10px 0",
                                  fontStyle: "italic",
                                  color: "#f9fafb",
                                }}
                              >
                                {cards[0]?.back?.text}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  fontStyle: "italic",
                                  marginBottom: 10,
                                  opacity: 0.9,
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: cards[0]?.backComments,
                                }}
                              />

                              {cards[0]?.back?.language &&
                                cards[0].back.language !== "pt" && (
                                  <button
                                    className="audio-button bgwhite"
                                    onClick={() =>
                                      readText(
                                        cards[0].back.text,
                                        true,
                                        cards[0].back.language,
                                        selectedVoice
                                      )
                                    }
                                    style={{
                                      borderRadius: 999,
                                      border: "1px solid #e5e7eb",
                                      padding: "4px 8px",
                                      fontSize: 11,
                                      cursor: "pointer",
                                      backgroundColor: "#ffffff",
                                      boxShadow:
                                        "0 4px 10px rgba(15,23,42,0.08)",
                                    }}
                                  >
                                    <i
                                      className="fa fa-volume-up"
                                      aria-hidden="true"
                                    />
                                  </button>
                                )}

                              {cards[0]?.img &&
                                cards[0]?.back?.language === "pt" && (
                                  <img
                                    style={{
                                      width: "100%",
                                      maxWidth: "8rem",
                                      aspectRatio: "1 / 1",
                                      objectFit: "cover",
                                      display: "block",
                                      margin: "1rem auto 0",
                                      objectPosition: "center",
                                      borderRadius: "8px",
                                      boxShadow:
                                        "0 8px 20px rgba(15,23,42,0.22)",
                                    }}
                                    src={cards[0]?.img}
                                    alt={cards[0]?.front?.text}
                                  />
                                )}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div
                        style={{
                          padding: "1.2rem",
                          textAlign: "center",
                          color: "#64748b",
                          fontSize: 13,
                          backgroundColor: "#f8fafc",
                          borderRadius: 8,
                          margin: "0.75rem 0",
                          border: "1px dashed #cbd5e1",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 500,
                            marginBottom: "0.25rem",
                          }}
                        >
                          {messageBack}
                        </div>
                        <a
                          style={{
                            fontSize: 12,
                            color: partnerColor(),
                            textDecoration: "none",
                            marginTop: "0.25rem",
                            display: "inline-block",
                          }}
                          href="/sentence-mining"
                        >
                          {UniversalTexts?.addWordsToFlashcards ||
                            "Adicione palavras em seus flashcards"}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* BOTÃO START/REFRESH */}
          <div
            style={{
              display: !isDisabled ? "none" : "flex",
              justifyContent: "center",
              marginTop: see ? 4 : 8,
            }}
          >
            <button
              style={{
                backgroundColor: "#ecfdf3",
                color: partnerColor(),
                borderRadius: 999,
                border: `1px solid ${partnerColor()}`,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
              onClick={seeCardsToReview}
            >
              {!see ? (
                <>
                  <i className="fa fa-play" aria-hidden="true" />
                  {UniversalTexts?.start || "Start"}
                </>
              ) : (
                <>
                  <i className="fa fa-refresh" aria-hidden="true" />
                  {UniversalTexts?.refreshCards || "Atualizar lista"}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* PROGRESSO GERAL (FORA DO CARD) */}
      <div style={{ margin: "5.5rem 0 1rem 0", padding: "0 0.25rem" }}>
        <ProgressCounter see={seeConf} flashcardsToday={flashcardsToday} />
      </div>
    </section>
  );
};

export default ReviewFlashCards;
