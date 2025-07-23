import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import {
  backDomain,
  colorOfTheTShirt,
  mascotStrong,
  mascotSkinny,
  mascotCelebrate,
  mascotThinking,
  onLoggOut,
  updateInfo,
  mascotWeak,
  formatDateBr,
} from "../../../Resources/UniversalComponents";

import {
  notifyAlert,
  readText,
} from "../../EnglishLessons/Assets/Functions/FunctionLessons";

import { ArvinButton } from "../../../Resources/Components/ItemsLibrary";
import {
  partnerColor,
  textPrimaryColorContrast,
  textTitleFont,
} from "../../../Styles/Styles";
import { ProgressCounter } from "../../FlashCardsToday/FlashCardsToday";
import Voice from "../../../Resources/Voice";
import { HOne } from "../../../Resources/Components/RouteBox";
import WordOfTheDay from "../../WordOfTheDay/WordOfTheDay";
import { Streak } from "../../FlashCardsToday/Streak";
import { isArthurVincent } from "../../../App";

interface FlashCardsPropsRv {
  headers: MyHeadersType | null;
  onChange: any;
  change: boolean;
}

const ReviewFlashCards = ({ headers, onChange, change }: FlashCardsPropsRv) => {
  const [myId, setId] = useState<string>("");
  const [myPermissions, setPermissions] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [theName, setName] = useState<string>("");
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
  const [isArthurStudentBoolean, setIsArthurStudent] = useState<boolean>(false);
  const [timerCardCount, setTimerCardCount] = useState(19);
  const [flashcardsToday, setFlashcardsToday] = useState<number>(0);
  const [lastReviewDay, setLastReviewDay] = useState<Date>(new Date());
  const [streak, setStreak] = useState<any>(0);
  const [daysSinceLastReview, setDaysSinceLReview] = useState<any>(0);
  const [selectedVoice, setSelectedVoice] = useState<any>("");
  const [changeNumber, setChangeNumber] = useState<boolean>(true);
  const [MESSAGE, setMESSAGE] = useState<string>("How are you?");
  const [mascot, setMascot] = useState<any>(null);
  const [size, setSize] = useState<number>(window.innerWidth <= 600 ? 2 : 4);
  const [longest, setLongest] = useState<number>(0);
  const [yourLongest, setYourLongest] = useState<number>(0);
  const [studentLongest, setStudentLongest] = useState<string>("");

  const actualHeaders = headers || {};

  useEffect(() => {
    const user = localStorage.getItem("loggedIn");
    if (user) {
      const { permissions, id, name, isArthurStudent } = JSON.parse(user);
      setIsArthurStudent(isArthurStudent);
      setId(id);
      setPermissions(permissions);
      setName(name);
    }
    setAnswer(false);
    updateInfo(myId, actualHeaders);
  }, [change]);

  useEffect(() => {
    setTimeout(() => {
      const flashcardsTodayLocalStorage =
        localStorage.getItem("flashcardsToday");
      if (flashcardsTodayLocalStorage) {
        const flashcardsTodayNumber: number = parseFloat(
          flashcardsTodayLocalStorage
        );
        setFlashcardsToday(flashcardsTodayNumber);
      }
      setSeeConf(seeConf);
    }, 1000);
  }, [change]);

  // Category colors effect
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

  const seeCardsToReview = async () => {
    updateInfo(myId, actualHeaders);
    timerCard();
    setLoading(true);
    setAnswer(false);
    setBackCardVisible(false);
    setSee(true);

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/flashcards/${myId}`,
        {
          headers: actualHeaders,
          params: { category },
        }
      );

      const thereAreCards = response.data.dueFlashcards.length === 0;

      if (
        response.data.dueFlashcards.length > 0 &&
        response.data.dueFlashcards[0].front.language &&
        response.data.dueFlashcards[0].front &&
        response.data.dueFlashcards[0].front.language !== "pt"
      ) {
        readText(
          response.data.dueFlashcards[0].front?.text,
          false,
          response.data.dueFlashcards[0].front.language,
          selectedVoice
        );
      }

      setCards(response.data.dueFlashcards);
      setCardsLength(thereAreCards);
      setFlashcardsToday(response.data.flashcardsToday);

      localStorage.setItem(
        "flashcardsToday",
        JSON.stringify(response.data.flashcardsToday)
      );

      setBackCardVisible(true);
      timerDisabled();
      timerCard();
      setLoading(false);
    } catch (error) {
      console.log(error);
      notifyAlert("Erro ao enviar cards");
      onLoggOut();
    }
  };

  const reviewCard = async (id: string, difficulty: string) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/reviewflashcard/${myId}`,
        {
          flashcardId: id,
          difficulty,
          timerCardCount,
          dayToday: new Date().toISOString(),
        },
        { headers: actualHeaders }
      );
      setLastReviewDay(response.data.flashcardsStreakLastDay);
      setAnswer(false);
      onChange(!change);
      seeCardsToReview();
      timerDisabled();
    } catch (error) {
      onLoggOut();
      console.log(error, "ReviewFC");
    }
  };

  const getHistory = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${backDomain}/api/v1/flashcardhistory/${id}`,
        { dateToday: new Date().toISOString() },
        { headers: actualHeaders }
      );

      const {
        streak: st,
        daysSinceLastReview: lr,
        lastDayFlashcardReview: mvlr,
        longestStreakAtAll: lgst,
        theStudentWithLongestStreak: studentLongest,
        longestStreakME,
      } = response.data;

      setYourLongest(longestStreakME);
      setStudentLongest(studentLongest);
      setLongest(lgst);
      setStreak(st);
      setDaysSinceLReview(lr);
      setLastReviewDay(new Date(mvlr));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (myId !== "" && myId !== null) {
      getHistory(myId);
    }
  }, [myId]);

  useEffect(() => {
    const storedVoice = localStorage.getItem("chosenVoice");
    setSelectedVoice(storedVoice);
  }, [selectedVoice, changeNumber]);

  useEffect(() => {
    const handleResize = () => {
      setSize(window.innerWidth <= 600 ? 2 : 4);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setMascot(mascotCelebrate(colorOfTheTShirt, size));
  }, [size, colorOfTheTShirt]);

  useEffect(() => {
    if (flashcardsToday >= 25 && streak < 50) {
      setMascot(mascotCelebrate(colorOfTheTShirt, size));
      setMESSAGE(
        `Keep on moving! You've been reviewing your flashcards for ${streak} days straight.`
      );
    } else if (flashcardsToday >= 25 && streak >= 50) {
      setMascot(mascotCelebrate(colorOfTheTShirt, size));
      setMESSAGE(
        `I'm so proud of you! You've been reviewing your flashcards for ${streak} days straight.`
      );
    } else if (daysSinceLastReview !== null && daysSinceLastReview <= 3) {
      setMascot(mascotThinking(colorOfTheTShirt, size));
      setMESSAGE(
        `Don't give up! Last time you studied was ${
          daysSinceLastReview === 1
            ? `yesterday`
            : `${daysSinceLastReview} days ago`
        }!`
      );
    } else if (daysSinceLastReview !== null && daysSinceLastReview > 3) {
      setMascot(mascotWeak(colorOfTheTShirt, size));
      setMESSAGE(
        `I'm dying, you haven't studied in ${daysSinceLastReview} days`
      );
    } else if (streak >= 50) {
      setMascot(mascotStrong(colorOfTheTShirt, size));
      setMESSAGE(
        `I'm so proud of you! You've been reviewing your flashcards for ${streak} days straight.`
      );
    } else if (streak < 50 && streak > daysSinceLastReview) {
      setMascot(mascotSkinny(colorOfTheTShirt, size));
      setMESSAGE(
        `Keep on moving! You've been reviewing your flashcards for ${streak} days straight.`
      );
    }
  }, [flashcardsToday, daysSinceLastReview, streak]);

  const cardRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState<number>(0);

  useEffect(() => {
    if (cardRef.current) {
      setCardHeight(cardRef.current.offsetHeight);
    }
  }, [cards, answer, backCardVisible, loading, see]);

  return (
    <section id="review">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            marginTop: "10px",
            marginRight: "auto",
            fontSize: "10px",
            color: "#999",
            textDecoration: "none",
          }}
        >
          Last Review: {formatDateBr(lastReviewDay)}
        </div>

        <HOne
          style={{
            fontFamily: textTitleFont(),
            color: partnerColor(),
          }}
        >
          Review Flashcards
        </HOne>

        <a
          style={{
            fontSize: "13px",
            color: "#999",
            textDecoration: "none",
          }}
          href="/sentence-mining"
        >
          Adicione palavras em seus flashcards!
        </a>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <CircularProgress style={{ color: partnerColor() }} />
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              marginTop: "20px",
            }}
          >
            {/* Mascot */}
            <div
              style={{
                position: "relative",
                left: -15,
                cursor: isArthurStudentBoolean ? "pointer" : "default",
                display: "flex",
                alignItems: "flex-end",
                visibility: isArthurStudentBoolean ? "visible" : "hidden",
                minWidth: "100px",
                justifyContent: "center",
              }}
              onClick={() => {
                readText(
                  `Hi ${theName}, I'm Arvin! ${MESSAGE}`,
                  false,
                  "en",
                  selectedVoice,
                  1.2
                );
              }}
            >
              {!loading && mascot}
            </div>

            {/* Main content area */}
            <div
              style={{
                flex: 1,
                position: "relative",
                left: -50,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
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
                <div ref={cardRef}>
                  {loading ? (
                    <CircularProgress style={{ color: partnerColor() }} />
                  ) : (
                    <div
                      style={{
                        margin: "auto",
                        textAlign: "center",
                        color: "black",
                        marginBottom: "1rem",
                      }}
                    >
                      {!cardsLength ? (
                        <>
                          <ArvinButton
                            disabled={isDisabled}
                            cursor={isDisabled ? "not-allowed" : "pointer"}
                            color={isDisabled ? "grey" : partnerColor()}
                            style={{
                              color: textPrimaryColorContrast(),
                            }}
                            onClick={() => {
                              setBackCardVisible(!backCardVisible);
                              setAnswer(!answer);
                            }}
                          >
                            {isDisabled ? (
                              <span>{count}</span>
                            ) : (
                              <span>{answer ? "Back" : "Answer"}</span>
                            )}
                          </ArvinButton>

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
                                <ArvinButton
                                  onClick={() =>
                                    reviewCard(cards[0]._id, "hard")
                                  }
                                  color="red"
                                >
                                  I missed (Errei)
                                </ArvinButton>

                                <ArvinButton
                                  onClick={() =>
                                    reviewCard(cards[0]._id, "easy")
                                  }
                                  style={{
                                    color: textPrimaryColorContrast(),
                                  }}
                                  color={partnerColor()}
                                >
                                  I got it! (Acertei)
                                </ArvinButton>
                              </div>
                            </div>
                          )}

                          {/* Flashcard */}
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
                                  {Math.round(cards[0]?.numberOfReviews) ||
                                    "no"}{" "}
                                  {Math.round(cards[0]?.numberOfReviews) === 1
                                    ? "review"
                                    : "reviews"}
                                </span>
                                <br />
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
                            padding: "2rem",
                            textAlign: "center",
                            color: "#666",
                            fontSize: "16px",
                          }}
                        >
                          <p>
                            🎉 No flashcards to review!
                            <br />
                            <small style={{ fontSize: "14px" }}>
                              Nenhum flashcard para revisar
                            </small>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Start/Refresh button */}
              <div
                style={{
                  display: !isDisabled ? "none" : "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <ArvinButton
                  style={{
                    margin: "auto",
                    display: "block",
                  }}
                  onClick={seeCardsToReview}
                >
                  {!see ? (
                    "Start"
                  ) : (
                    <i className="fa fa-refresh" aria-hidden="true" />
                  )}
                </ArvinButton>
              </div>

              {/* Controls */}
              <div
                style={{
                  marginTop: cardHeight ? cardHeight / 3 : "1rem",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  maxWidth: "fit-content",
                  margin: "auto",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <Voice
                  maxW="6rem"
                  changeB={changeNumber}
                  setChangeB={setChangeNumber}
                />
                <select
                  id="category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    maxWidth: "6rem",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    margin: "auto",
                    backgroundColor: "#f9f9f9",
                    fontSize: "0.9rem",
                    color: "#333",
                    outline: "none",
                    transition: "border-color 0.3s",
                  }}
                >
                  <option value="nofilter">All cards</option>
                  <option value="vocabulary">Vocabulary</option>
                  <option value="be">To be</option>
                  <option value="possessive">Possessivos</option>
                  <option value="modal">Modal verbs</option>
                  <option value="question">Question words</option>
                  <option value="do">Do & Does</option>
                  <option value="dont">Don't & Doesn't</option>
                  <option value="did">Did & Didn't</option>
                  <option value="irregularpast">Irregular Past</option>
                  <option value="presentperfect">Present Perfect</option>
                  <option value="pastperfect">Past Perfect</option>
                  <option value="travel">Viagem</option>
                  <option value="bodyparts">Partes do corpo</option>
                  <option value="businessenglish">Inglês para negócios</option>
                  <option value="family">Família</option>
                  <option value="animals">Animais</option>
                  <option value="fruits">Frutas</option>
                  <option value="food">Comida</option>
                  <option value="colors">Cores</option>
                  <option value="house">Casa</option>
                  <option value="supermarket">Supermercado</option>
                  <option value="weather">Clima</option>
                  <option value="clothes">Roupas</option>
                  <option value="time">Horários</option>
                  <option value="daysanddates">Dias e Datas</option>
                  <option value="car">Carro</option>
                  <option value="road">Estrada</option>
                  <option value="personality">Personalidade</option>
                  <option value="nature">Natureza</option>
                  <option value="numbers">Números</option>
                  <option value="transportation">Transporte</option>
                  <option value="office">Escritório</option>
                  <option value="professions">Profissões</option>
                </select>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Progress Counter with improved layout */}
      <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
        <ProgressCounter see={seeConf} flashcardsToday={flashcardsToday} />
      </div>

      {/* Streak component with modal */}
      <div style={{ marginBottom: "2rem" }}>
        <Streak
          longest={longest}
          yourLongest={yourLongest}
          studentLongest={studentLongest}
          message={MESSAGE}
          streak={streak}
        />
      </div>

      {isArthurVincent && (
        <a
          href="/words-of-the-day"
          style={{
            marginTop: "10px",
            fontSize: "10px",
            color: "#999",
            textDecoration: "none",
            display: "block",
            textAlign: "center",
          }}
        >
          Previous Words of the Day
        </a>
      )}
    </section>
  );
};

export default ReviewFlashCards;
