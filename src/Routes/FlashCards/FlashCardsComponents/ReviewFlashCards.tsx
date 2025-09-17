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
import { HOne } from "../../../Resources/Components/RouteBox";
import WordOfTheDay from "../../WordOfTheDay/WordOfTheDay";
import { isArthurVincent } from "../../../App";

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
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [answer, setAnswer] = useState<boolean>(false);
  const [cardsLength, setCardsLength] = useState<boolean>(true);
  const [see, setSee] = useState<boolean>(false);
  const [seeConf, setSeeConf] = useState<boolean>(false);
  const [count, setCount] = useState<number>(4);
  const [backCardVisible, setBackCardVisible] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("nofilter");
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
          params: { category },
        }
      );

      const thereAreCards = response.data.dueFlashcards.length > 0;
      setCardsLength(thereAreCards);

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
    //@ts-ignore
    const timers = [];
    for (let i = 20; i >= 1; i--) {
      const delay = i === 10 ? 11000 : i === 9 ? 10000 : (21 - i) * 1000;
      timers.push(setTimeout(() => setTimerCardCount(i), delay));
    }
    //@ts-ignore
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

  return (
    <section
      id="review"
      style={{
        width: "80%",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 1rem",
        }}
      >
        <HOne>{UniversalTexts?.reviewFlashcards || "Review Flashcards"}</HOne>
        <a
          style={{
            fontSize: "12px",
            color: "#666",
            textDecoration: "none",
            marginBottom: "1rem",
          }}
          href="/sentence-mining"
        >
          {UniversalTexts?.addWordsToFlashcards ||
            "Adicione palavras em seus flashcards"}
        </a>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "150px",
          }}
        >
          <CircularProgress size={24} style={{ color: partnerColor() }} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "0 1rem",
            width: "90%",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              width: "100%",
            }}
          >
            {isArthurVincent && (
              <WordOfTheDay
                change={change}
                onChange={onChange}
                headers={headers}
              />
            )}

            {/* Flashcard area */}
            {see && (
              <div ref={cardRef} style={{ width: "100%", maxWidth: "400px" }}>
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
                      color: "black",
                    }}
                  >
                    {cardsLength ? (
                      <>
                        <button
                          disabled={isDisabled}
                          style={{
                            cursor: isDisabled ? "not-allowed" : "pointer",
                            color: isDisabled
                              ? "grey"
                              : textPrimaryColorContrast(),
                            backgroundColor: isDisabled
                              ? "#ccc"
                              : partnerColor(),
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

                        {answer && (
                          <div style={{ marginTop: "1rem" }}>
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
                                  backgroundColor: "red",
                                  color: "white",
                                }}
                              >
                                {UniversalTexts?.iMissed || "I missed (Errei)"}
                              </button>

                              <button
                                onClick={() => reviewCard(cards[0]._id, "easy")}
                                style={{
                                  backgroundColor: partnerColor(),
                                  color: textPrimaryColorContrast(),
                                }}
                              >
                                {UniversalTexts?.iGotIt ||
                                  "I got it! (Acertei)"}
                              </button>
                            </div>
                          </div>
                        )}
                        <div
                          style={{ margin: "auto" }}
                          className={`flashcard ${answer ? "flip" : ""}`}
                        >
                          <div
                            style={{
                              backgroundColor: textColor,
                              display: !backCardVisible ? "none" : "block",
                            }}
                            className="flashcard-front"
                          >
                            <div>
                              <span style={{ fontSize: "12px" }}>
                                {Math.round(cards[0]?.numberOfReviews) || 0}{" "}
                                {Math.round(cards[0]?.numberOfReviews) === 1
                                  ? UniversalTexts?.review || "review"
                                  : UniversalTexts?.reviews || "reviews"}
                              </span>
                              <br />
                              <div
                                style={{
                                  fontSize: "20px",
                                  marginBottom: "15px",
                                  fontStyle: "italic",
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
                                      margin: "1rem auto",
                                      objectPosition: "center",
                                      borderRadius: "6px",
                                      boxShadow: "1px 1px 12px 3px #bbb",
                                    }}
                                    src={cards[0]?.img}
                                    alt={cards[0]?.front?.text}
                                  />
                                )}
                            </div>
                          </div>

                          <div
                            style={{
                              display: backCardVisible ? "none" : "block",
                            }}
                            className="flashcard-back"
                          >
                            <div>
                              <div
                                style={{
                                  fontSize: "11px",
                                  marginBottom: "15px",
                                }}
                              >
                                {cards[0]?.front?.text}
                              </div>
                              <div
                                style={{
                                  fontSize: "20px",
                                  marginBottom: "15px",
                                  fontStyle: "italic",
                                }}
                              >
                                {cards[0]?.back?.text}
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  fontStyle: "italic",
                                  marginBottom: "15px",
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
                                      margin: "1rem auto",
                                      objectPosition: "center",
                                      borderRadius: "6px",
                                      boxShadow: "1px 1px 12px 3px #bbb",
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
                          padding: "1.5rem",
                          textAlign: "center",
                          color: "#666",
                          fontSize: "14px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "8px",
                          margin: "1rem 0",
                        }}
                      >
                        <div
                          style={{ fontSize: "24px", marginBottom: "0.5rem" }}
                        >
                          🎉
                        </div>
                        <div
                          style={{
                            fontWeight: "500",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {UniversalTexts?.noFlashcardsToReview ||
                            "No flashcards to review!"}
                        </div>
                        <a
                          style={{
                            fontSize: "12px",
                            color: "#666",
                            textDecoration: "none",
                            marginBottom: "1rem",
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
            <div
              style={{
                display: !isDisabled ? "none" : "flex",
                justifyContent: "center",
                margin: "1rem 0",
              }}
            >
              <button
                style={{
                  backgroundColor: partnerColor(),
                  color: textPrimaryColorContrast(),
                }}
                onClick={seeCardsToReview}
              >
                {!see ? (
                  UniversalTexts?.start || "Start"
                ) : (
                  <i className="fa fa-refresh" aria-hidden="true" />
                )}
              </button>
            </div>
            {/* Controls */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
                alignItems: "center",
                margin: "1rem 0",
                width: "100%",
                maxWidth: "320px",
              }}
            >
              <Voice
                maxW="auto"
                changeB={changeNumber}
                setChangeB={setChangeNumber}
                chosenLanguage={languageToUse}
              />
              <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  borderRadius: "4px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#f8fafc",
                  fontSize: "11px",
                  fontWeight: "400",
                  color: "#64748b",
                  padding: "4px 6px",
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
                <option value="nofilter">
                  {UniversalTexts?.allCards || "All cards"}
                </option>
                <option value="vocabulary">
                  {UniversalTexts?.vocabularyCategory || "Vocabulary"}
                </option>
                <option value="be">{UniversalTexts?.toBe || "To be"}</option>
                <option value="possessive">
                  {UniversalTexts?.possessives || "Possessivos"}
                </option>
                <option value="modal">
                  {UniversalTexts?.modalVerbs || "Modal verbs"}
                </option>
                <option value="question">
                  {UniversalTexts?.questionWords || "Question words"}
                </option>
                <option value="do">
                  {UniversalTexts?.doAndDoes || "Do & Does"}
                </option>
                <option value="dont">
                  {UniversalTexts?.dontAndDoesnt || "Don't & Doesn't"}
                </option>
                <option value="did">
                  {UniversalTexts?.didAndDidnt || "Did & Didn't"}
                </option>
                <option value="irregularpast">
                  {UniversalTexts?.irregularPast || "Irregular Past"}
                </option>
                <option value="presentperfect">
                  {UniversalTexts?.presentPerfect || "Present Perfect"}
                </option>
                <option value="pastperfect">
                  {UniversalTexts?.pastPerfect || "Past Perfect"}
                </option>
                <option value="travel">
                  {UniversalTexts?.travel || "Viagem"}
                </option>
                <option value="bodyparts">
                  {UniversalTexts?.bodyParts || "Partes do corpo"}
                </option>
                <option value="businessenglish">
                  {UniversalTexts?.businessEnglish || "Inglês para negócios"}
                </option>
                <option value="family">
                  {UniversalTexts?.family || "Família"}
                </option>
                <option value="animals">
                  {UniversalTexts?.animals || "Animais"}
                </option>
                <option value="fruits">
                  {UniversalTexts?.fruits || "Frutas"}
                </option>
                <option value="food">{UniversalTexts?.food || "Comida"}</option>
                <option value="colors">
                  {UniversalTexts?.colors || "Cores"}
                </option>
                <option value="house">{UniversalTexts?.house || "Casa"}</option>
                <option value="supermarket">
                  {UniversalTexts?.supermarket || "Supermercado"}
                </option>
                <option value="weather">
                  {UniversalTexts?.weather || "Clima"}
                </option>
                <option value="clothes">
                  {UniversalTexts?.clothes || "Roupas"}
                </option>
                <option value="time">
                  {UniversalTexts?.timeCategory || "Horários"}
                </option>
                <option value="daysanddates">
                  {UniversalTexts?.daysAndDates || "Dias e Datas"}
                </option>
                <option value="car">{UniversalTexts?.car || "Carro"}</option>
                <option value="road">
                  {UniversalTexts?.road || "Estrada"}
                </option>
                <option value="personality">
                  {UniversalTexts?.personality || "Personalidade"}
                </option>
                <option value="nature">
                  {UniversalTexts?.nature || "Natureza"}
                </option>
                <option value="numbers">
                  {UniversalTexts?.numbers || "Números"}
                </option>
                <option value="transportation">
                  {UniversalTexts?.transportation || "Transporte"}
                </option>
                <option value="office">
                  {UniversalTexts?.office || "Escritório"}
                </option>
                <option value="professions">
                  {UniversalTexts?.professions || "Profissões"}
                </option>
              </select>
            </div>
            <button
              onClick={() => setPlayCardAutomatically(!playCardAutomatically)}
              style={{
                fontSize: "10px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                padding: "2px 8px",
                cursor: "pointer",
                backgroundColor: playCardAutomatically
                  ? partnerColor()
                  : "#f9fafb",
                color: playCardAutomatically ? "#fff" : "#555",
                transition: "all 0.2s ease",
              }}
            >
              {playCardAutomatically ? "🔊 Auto ON" : "🔇 Auto OFF"}
            </button>
          </div>
        </div>
      )}
      <div style={{ margin: "1.5rem 0 1rem 0", padding: "0 1rem" }}>
        <ProgressCounter see={seeConf} flashcardsToday={flashcardsToday} />
      </div>
      {isArthurVincent && (
        <a
          href="/words-of-the-day"
          style={{
            fontSize: "11px",
            color: "#999",
            textDecoration: "none",
            display: "block",
            textAlign: "center",
            padding: "0.5rem",
          }}
        >
          {UniversalTexts?.previousWordsOfTheDay || "Previous Words of the Day"}
        </a>
      )}
    </section>
  );
};

export default ReviewFlashCards;
