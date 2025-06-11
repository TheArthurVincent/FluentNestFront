import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import {
  backDomain,
  onLoggOut,
  updateInfo,
} from "../../../Resources/UniversalComponents";
import { readText } from "../../EnglishLessons/Assets/Functions/FunctionLessons";
import { ArvinButton } from "../../../Resources/Components/ItemsLibrary";

import { secondaryColor, textTitleFont } from "../../../Styles/Styles";
import { ProgressCounter } from "../../FlashCardsToday/FlashCardsToday";
import Voice from "../../../Resources/Voice";

function highlightDifferences(original: string, userInput: string): string {
  const originalWords = original.split(" ");
  const userWords = userInput.split(" ");
  const highlightedWords = userWords.map((word, index) => {
    if (originalWords[index] && originalWords[index] !== word) {
      return `<span style="color: red; font-weight: 400;">${word}</span>`;
    }
    return `<span style="color: green">${word}</span>`;
  });

  return highlightedWords.join(" ");
}
// Função para contar o número de palavras
function wordCount(str: string): number {
  return str.trim().split(/\s+/).length;
}

// Função para normalizar o texto
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[?.,/’'#!$%-^&*;:{}=\-_`~()]/g, "") // Remove pontuação
    .replace(/\s+/g, " ") // Substitui múltiplos espaços por um espaço
    .trim();
};

// Função para limpar a string
function cleanString(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\x20-\x7E]/g, "") // Remove caracteres não imprimíveis
    .trim();
}

// Função de distância de Levenshtein
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const dp = Array.from(Array(len1 + 1), () => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) dp[i][0] = i;
  for (let j = 0; j <= len2; j++) dp[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
      }
    }
  }

  return dp[len1][len2];
}

// Função para calcular a porcentagem de similaridade
function similarityPercentage(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 100; // Se ambas as strings estiverem vazias

  const distance = levenshteinDistance(cleanString(str1), cleanString(str2));
  const similarity = ((maxLen - distance) / maxLen) * 100;

  return Math.round(similarity); // Retorna a similaridade como um número inteiro
}

interface FlashCardsPropsRv {
  headers: MyHeadersType | null;
  onChange: any;
  change: boolean;
}

const ListeningExercise = ({
  headers,
  onChange,
  change,
}: FlashCardsPropsRv) => {
  const [myId, setId] = useState<string>("");
  const [cards, setCards] = useState<any[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [cardsLength, setCardsLength] = useState<boolean>(true);
  const [see, setSee] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [next, setNext] = useState<boolean>(false);
  const [seeProgress, setSeeProgress] = useState(false);
  const [enableVoice, setEnableVoice] = useState(false);
  const [similarity, setSimilarity] = useState<number>(0);
  const [playingAudio, setPlayingAudio] = useState<boolean>(false);
  const [flashcardsToday, setFlashcardsToday] = useState<number>(0);
  const [words, setWords] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [transcript, setTranscript] = useState<string>("");
  const [transcriptHighLighted, setTranscriptHighLighted] =
    useState<string>("");
  const [isShow, setIsShow] = useState<boolean>(false);

  const [listening, setListening] = useState<boolean>(false);

  const actualHeaders = headers || {};

  useEffect(() => {
    var user = localStorage.getItem("loggedIn");
    var flashcardsToday = localStorage.getItem("flashcardsToday") || 0;
    // @ts-ignore
    var flashcardsTodayNumber: number = parseFloat(flashcardsToday);
    if (user) {
      const { id } = JSON.parse(user);
      setId(id);
      setFlashcardsToday(flashcardsTodayNumber);
    }
    updateInfo(myId, actualHeaders);
  }, [change]);

  const reviewListeningExercise = async (score: number, percentage: number) => {
    setNext(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/reviewflashcardlistening/${myId}`,
        { flashcardId: cards[0]?._id, score, percentage, transcript },
        { headers: actualHeaders || {} }
      );

      onChange(!change);
      setNext(false);
      setTranscript("");
      setLoading(false);
      seeCardsToReview();
    } catch (error) {
      alert("Erro ao enviar cards");
      onLoggOut();
    }
  };

  const isCorrectAnswer = (transcription: string | null) => {
    readText(
      cards[0]?.front?.text.replace(/\s+/g, " "), // Substitui múltiplos espaços por um espaço
      false,
      cards[0]?.front?.language
    );
    const cardText = normalizeText(
      cleanString(
        cards[0]?.front?.text.replace(/\s+/g, " ") || // Substitui múltiplos espaços por um espaço
          ""
      )
    );
    const userTranscript = normalizeText(cleanString(transcription || ""));
    const wordCountInCard = wordCount(
      cards[0]?.front?.text.replace(/\s+/g, " ") // Substitui múltiplos espaços por um espaço
    );

    const highlightedText = highlightDifferences(cardText, userTranscript);
    setTranscriptHighLighted(highlightedText);
    setSimilarity(similarityPercentage(userTranscript, cardText));
    setWords(wordCount(cardText));

    if (userTranscript === "") {
      setSimilarity(0);
      setScore(0);
      setWords(0);
      return;
    }

    if (cleanString(cardText) === cleanString(userTranscript)) {
      setSimilarity(100);
      setWords(wordCountInCard);
      setScore(wordCountInCard * 3);
      return;
    }

    const simC = similarityPercentage(
      userTranscript,
      cards[0]?.front?.text.replace(/\s+/g, " ") // Substitui múltiplos espaços por um espaço
    );

    if (simC >= 98) {
      setSimilarity(simC);
      setWords(wordCountInCard);
      setScore(wordCountInCard * 3);
    } else if (simC >= 40 && simC < 98) {
      setSimilarity(98);
      setWords(wordCountInCard);
      setScore(wordCountInCard * 2);
      return;
    } else if (simC < 40) {
      setSimilarity(simC);
      setWords(wordCountInCard);
      setScore(0);
    }
  };

  const ponctuate = (transcription: string | null) => {
    setLoading(true);
    const cardText = normalizeText(
      cleanString(
        cards[0]?.front?.text.replace(/\s+/g, " ") || // Substitui múltiplos espaços por um espaço
          ""
      )
    );
    const userTranscript = normalizeText(cleanString(transcription || ""));
    const wordCountInCard = wordCount(
      cards[0]?.front?.text.replace(/\s+/g, " ") || // Substitui múltiplos espaços por um espaço
        ""
    );

    if (userTranscript === "") {
      setSimilarity(0);
      setScore(0);
      setWords(wordCountInCard);
      reviewListeningExercise(0, 0);
      return;
    }

    if (cleanString(cardText) === cleanString(userTranscript)) {
      setSimilarity(100);
      setScore(wordCountInCard * 3);
      setWords(wordCountInCard);
      reviewListeningExercise(wordCountInCard * 3, 100);
      return;
    }

    const simC = similarityPercentage(
      userTranscript,
      cards[0]?.front?.text.replace(/\s+/g, " ") // Substitui múltiplos espaços por um espaço
    );
    setSimilarity(simC);
    setWords(wordCountInCard);
    // const points = simC > 40 ? wordCountInCard : 0;
    const points = score;

    if (simC > 98) {
      setSimilarity(100);
      reviewListeningExercise(wordCountInCard * 3, 100);
    } else {
      setScore(points);
      reviewListeningExercise(points, simC);
    }

    onChange(!change);
  };

  const seeCardsToReview = async () => {
    setLoading(true);
    setTranscript("");
    setIsDisabled(true);
    setSee(true);
    setSimilarity(0);
    setScore(0);
    setWords(0);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/flashcardslistening/${myId}`,
        { headers: actualHeaders || {} }
      );
      const thereAreCards = response.data.dueFlashcards.length === 0;
      setCards(response.data.dueFlashcards);
      setCardsLength(thereAreCards);
      setLoading(false);
    } catch (error) {
      alert("Erro ao carregar cards");
    }
    setIsShow(true);
  };

  // Controle do reconhecimento de fala
  const SpeechRecognition =
    // @ts-ignore
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = cards[0]?.front?.language == "en" ? "en-US" : "fr-FR";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const startListening = () => {
    setListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setListening(false);
    recognition.stop();
  };
  recognition.onresult = (event: any) => {
    const speechToText = event.results[0][0].transcript;
    setTranscript(cleanString(speechToText));
    setSeeProgress(true);
    setTimeout(() => {
      isCorrectAnswer(speechToText);
      setIsDisabled(false);
      setSeeProgress(false);
    }, 2000);
    setEnableVoice(false);
  };

  recognition.onspeechend = () => {
    setTimeout(() => {
      stopListening();
    }, 4000);
  };
  recognition.onerror = () => {
    stopListening();
    alert("Erro no reconhecimento de voz");
    window.location.reload();
  };

  const [selectedVoice, setSelectedVoice] = useState<any>("");
  const [changeNumber, setChangeNumber] = useState<boolean>(true);

  useEffect(() => {
    const storedVoice = localStorage.getItem("chosenVoice");
    setSelectedVoice(storedVoice);
    console.log(storedVoice);
  }, [selectedVoice, changeNumber]);

  return (
    <section id="review">
      <Voice changeB={changeNumber} setChangeB={setChangeNumber} />
      {see && (
        <div>
          {loading ? (
            <CircularProgress style={{ color: secondaryColor() }} />
          ) : (
            <div
              style={{
                maxWidth: "400px",
                margin: "auto",
                textAlign: "center",
                padding: "20px",
                borderRadius: "6px",
              }}
            >
              {!cardsLength ? (
                <>
                  <div>
                    <div
                      style={{
                        display: isDisabled ? "none" : "grid",
                        alignItems: "center",
                        gap: "10px",
                        justifyContent: "center",
                      }}
                    >
                      <p
                        style={{
                          padding: "10px",
                          borderRadius: "6px",
                          backgroundColor:
                            similarity === 100
                              ? "#4caf40"
                              : similarity > 98
                              ? "#2196f3"
                              : similarity > 40
                              ? "#ffeb3b"
                              : "#f44336",
                          color:
                            similarity === 100
                              ? "white"
                              : similarity > 98
                              ? "white"
                              : similarity > 40
                              ? "black"
                              : "white",
                          border: `solid 1px ${
                            similarity === 100
                              ? "white"
                              : similarity > 98
                              ? "white"
                              : similarity > 40
                              ? "black"
                              : "white"
                          }`,
                          transition: "background-color 0.3s",
                        }}
                      >
                        {similarity}% correct{" "}
                        {similarity < 40 && (
                          <span>(You need at least 40% to score)</span>
                        )}
                      </p>
                      <div
                        style={{
                          display: "grid",
                          border: "solid 1px #ccc",
                          borderRadius: "6px",
                          padding: "15px",
                          backgroundColor: "#fff",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: textTitleFont(),
                            fontSize: "1rem",
                            fontWeight: 400,
                          }}
                        >
                          {cards[0]?.front?.text.replace(/\s+/g, " ")}
                        </p>
                        <p
                          style={{
                            fontFamily: "Lato",
                            fontSize: "12px",
                            fontWeight: 400,
                            color: "#555",
                          }}
                        >
                          {cards[0]?.back?.text}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          border: "solid 1px #ccc",
                          borderRadius: "6px",
                          padding: "15px",
                          backgroundColor: "#fff",
                        }}
                      >
                        <p
                          style={{
                            color: "grey",
                            marginBottom: "10px",
                            fontSize: "10px",
                            fontStyle: "italic",
                          }}
                        >
                          Your answer:
                        </p>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: transcriptHighLighted,
                          }}
                        />
                      </div>
                      <p>
                        This sentence has <b>{words}</b> words
                      </p>{" "}
                      <p>
                        You scored <b>{score.toFixed()}</b> points
                      </p>
                    </div>
                    {seeProgress ? (
                      <CircularProgress style={{ color: secondaryColor() }} />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <ArvinButton
                          disabled={playingAudio}
                          onClick={() => {
                            setPlayingAudio(true);
                            setTimeout(() => {
                              setPlayingAudio(false);
                            }, 3000);

                            readText(
                              cards[0]?.front?.language == "en"
                                ? `Listen: ${cards[0]?.front?.text.replace(
                                    /\s+/g,
                                    " "
                                  )}`
                                : `Listen: ${cards[0]?.front?.text}`,
                              false,
                              cards[0]?.front?.language,
                              selectedVoice
                            );
                            setEnableVoice(true);
                          }}
                          color={!playingAudio ? "blue" : "grey"}
                          style={{
                            cursor: playingAudio ? "not-allowed" : "pointer",
                            margin: "0 5px",
                            marginTop: !isDisabled ? "1rem" : 0,
                          }}
                        >
                          {!isDisabled ? (
                            `Listen again`
                          ) : (
                            <i className="fa fa-volume-up" aria-hidden="true" />
                          )}
                        </ArvinButton>
                        <ArvinButton
                          style={{
                            display: !isDisabled ? "none" : "inline-block",
                            cursor: enableVoice ? "pointer" : "not-allowed",
                            margin: "0 5px",
                          }}
                          disabled={!enableVoice}
                          onClick={!listening ? startListening : stopListening}
                          color={
                            !enableVoice
                              ? "grey"
                              : !listening && enableVoice
                              ? "green"
                              : "red"
                          }
                        >
                          <i
                            className={
                              !listening ? "fa fa-microphone" : "fa fa-stop"
                            }
                            aria-hidden="true"
                          />
                        </ArvinButton>
                      </div>
                    )}
                  </div>
                  <ArvinButton
                    style={{
                      marginTop: "1rem",
                      display: isDisabled ? "none" : "inline-block",
                    }}
                    disabled={next}
                    color="green"
                    onClick={() => ponctuate(transcript)}
                  >
                    Next
                  </ArvinButton>
                  <textarea
                    style={{
                      display: !isDisabled ? "none" : "inline-block",
                      marginTop: "1rem",
                      width: "85%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                    placeholder="Use this area for reference if you need to transcribe what you hear"
                    name=""
                    id=""
                  />
                </>
              ) : (
                <p>No flashcards</p>
              )}
            </div>
          )}
        </div>
      )}
      <div
        style={{
          display: !isDisabled ? "none" : "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <ArvinButton onClick={seeCardsToReview} style={{ margin: "0 5px" }}>
          {!see ? "Start" : <i className="fa fa-refresh" />}
        </ArvinButton>
      </div>
      <ProgressCounter flashcardsToday={flashcardsToday} />
    </section>
  );
};

export default ListeningExercise;
