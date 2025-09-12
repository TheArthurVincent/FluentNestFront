import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import { backDomain, updateInfo } from "../../../Resources/UniversalComponents";
import {
  notifyAlert,
  readText,
} from "../../EnglishLessons/Assets/Functions/FunctionLessons";
import { partnerColor, textGeneralFont } from "../../../Styles/Styles";
import { ProgressCounter } from "../../FlashCardsToday/FlashCardsToday";
import Voice from "../../../Resources/Voice";

function highlightDifferences(
  original: string,
  userInput: string,
  similarity: number
): string {
  const originalWords = normalizeText(original).split(" ");
  const userWords = normalizeText(userInput).split(" ");

  const output: string[] = [];
  const len = Math.max(originalWords.length, userWords.length);

  for (let i = 0; i < len; i++) {
    const userWord = userWords[i];
    const originalWord = originalWords[i];
    if (!userWord && originalWord) {
      if (similarity >= 40) {
        output.push(`<span style="color: red;">-</span>`);
      } else {
        output.push("");
      }
    } else if (userWord === originalWord) {
      output.push(`<span style="color: green;">${userWord}</span>`);
    } else {
      output.push(
        `<span style="color: red; font-weight: 400;">${
          userWord || "(extra)"
        }</span>`
      );
      console.log(
        `<span style="color: red; font-weight: 400;">${
          userWord || "(extra)"
        }</span>`
      );
    }
  }

  return output.join(" ");
}

function wordCount(str: string): number {
  return normalizeText(str).split(" ").filter(Boolean).length;
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
function similarityPercentage(str1: string, str2: string): number {
  const clean1 = normalizeText(str1);
  const clean2 = normalizeText(str2);

  const maxLen = Math.max(clean1.length, clean2.length);
  if (maxLen === 0) return 100;

  const distance = levenshteinDistance(clean1, clean2);
  return Math.round(((maxLen - distance) / maxLen) * 100);
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
  const [readyToListen, setReadyToListen] = useState(false);
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
  var cardTextRef = useRef<string>("");

  const actualHeaders = headers || {};

  useEffect(() => {
    var user = localStorage.getItem("loggedIn");
    var flashcardsToday = localStorage.getItem("flashcardsToday") || 0;
    // @ts-ignore
    var flashcardsTodayNumber: number = parseFloat(flashcardsToday);
    setTimeout(() => {
      updateInfo(myId, actualHeaders);
    }, 100);
    setTimeout(() => {
      if (user) {
        const { id } = JSON.parse(user);
        setId(id);
        setFlashcardsToday(flashcardsTodayNumber);
      }
    }, 250);
  }, [change]);

  const reviewListeningExercise = async (score: number, percentage: number) => {
    setNext(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/reviewflashcardlistening/${myId}`,
        {
          flashcardId: cards[0]?._id,
          score,
          percentage,
          transcript,
          dayToday: new Date(),
        },
        { headers: actualHeaders || {} }
      );

      onChange(!change);
      setNext(false);
      setTranscript("");
      setLoading(false);

      var user = localStorage.getItem("loggedIn");
      var flashcardsToday = localStorage.getItem("flashcardsToday") || 0;
      // @ts-ignore
      var flashcardsTodayNumber: number = parseFloat(flashcardsToday);
      setTimeout(() => {
        updateInfo(myId, actualHeaders);
      }, 100);
      setTimeout(() => {
        if (user) {
          const { id } = JSON.parse(user);
          setId(id);
          setFlashcardsToday(flashcardsTodayNumber);
        }
      }, 250);
      seeCardsToReview();
    } catch (error) {
      notifyAlert("Erro ao enviar cards");
      // onLoggOut();
    }
  };
  const isCorrectAnswer = (transcription: string | null) => {
    const cardTextRaw = cardTextRef.current;

    if (!cardTextRaw) {
      notifyAlert("Erro: Card text está vazio ou indefinido.");
      return;
    }

    const correct = normalizeText(cardTextRaw);
    const user = normalizeText(transcription || "");

    const wc = wordCount(correct);
    const sim = similarityPercentage(user, correct);

    setTranscriptHighLighted(highlightDifferences(correct, user, sim));
    setSimilarity(sim);
    setWords(wc);

    if (!user) {
      setScore(0);
      return;
    }

    if (user === correct || sim >= 98) {
      setScore(wc * 3);
    } else if (sim >= 40) {
      setScore(wc * 2);
    } else {
      setScore(0);
    }
  };

  const ponctuate = (transcription: string | null) => {
    setLoading(true);
    const raw = cards[0]?.front?.text;
    if (!raw) {
      notifyAlert("Erro: Card text está vazio.");
      return;
    }

    const cardText = normalizeText(cleanString(raw.replace(/\s+/g, " ")));

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

  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  const seeCardsToReview = async () => {
    setReadyToListen(false);
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
      const theFlashcardsTodayNumber = response.data.flashCardsReviewsToday;
      localStorage.setItem(
        "flashcardsToday",
        JSON.stringify(response.data.flashCardsReviewsToday)
      );
      setFlashcardsToday(theFlashcardsTodayNumber);

      setCards(response.data.dueFlashcards);

      const sl = response.data.dueFlashcards[0]?.front?.language;

      setSelectedLanguage(sl);
      cardTextRef.current = response.data.dueFlashcards[0]?.front?.text || "";

      setCardsLength(thereAreCards);
      setLoading(false);
      setIsShow(true);
      setTimeout(() => {
        setReadyToListen(true);
        setEnableVoice(true); // Ativa só após cards estarem prontos
      }, 300);
    } catch (error) {
      notifyAlert("Erro ao carregar cards");
    }
    setIsShow(true);
  };

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
  const isSafari = /^((?!chrome|android).)*safari/i.test(
    navigator.userAgent.toLowerCase()
  );

  // helper perto do topo
  const languageToLocale = (lang: string) => {
    switch ((lang || "").toLowerCase()) {
      case "en":
        return "en-US";
      case "es":
        return "es-ES";
      case "pt":
        return "pt-BR";
      case "fr":
        return "fr-FR";
      case "de":
        return "de-DE";
      case "it":
        return "it-IT";
      default:
        return "en-US";
    }
  };

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isIOS || isSafari) {
      const SR =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SR) {
        notifyAlert("Reconhecimento de voz não suportado.");
        return;
      }

      recognitionRef.current = new SR();
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.lang = languageToLocale(selectedLanguage); // <- usa a língua atual

      recognitionRef.current.onresult = (event: any) => {
        if (!cardTextRef.current) {
          notifyAlert("Erro: Nenhuma frase carregada para comparar.");
          return;
        }
        const speechToText = event.results[0][0].transcript.trim();
        setTranscript(speechToText);
        setSeeProgress(true);
        setTimeout(() => {
          isCorrectAnswer(speechToText);
          setIsDisabled(false);
          setSeeProgress(false);
        }, 2000);
        setEnableVoice(false);
      };

      recognitionRef.current.onerror = () => {
        notifyAlert("Erro no reconhecimento de voz");
        setEnableVoice(false);
        setListening(false);
      };

      recognitionRef.current.onspeechend = () => recognitionRef.current?.stop();

      (window as any).startSpeechRecognition = () => {
        setListening(true);
        // garanta o lang correto no momento do start
        if (recognitionRef.current) {
          recognitionRef.current.lang = languageToLocale(selectedLanguage);
          recognitionRef.current.start();
        }
      };
      (window as any).stopSpeechRecognition = () => {
        setListening(false);
        recognitionRef.current?.stop();
      };
    }
  }, []);

  // sempre que a língua mudar, atualize o SR
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = languageToLocale(selectedLanguage);
    }
  }, [selectedLanguage]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks: BlobPart[] = [];

  const [isAPPLE, setISAPPLE] = useState<boolean>(false);

  useEffect(() => {
    const isIOSs =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
    const isSafaris = /^((?!chrome|android).)*safari/i.test(
      navigator.userAgent
    );

    if (isIOSs || isSafaris) {
      setISAPPLE(true);
    } else {
      setISAPPLE(false);
    }
  }, []);

  const startRecording = async () => {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIOS || isSafari) {
      notifyAlert(
        "Seu dispositivo Apple ou navegador não suporta gravação de áudio. Tente usar o Chrome no computador."
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunks.length = 0;
      mediaRecorder.start();
      setListening(true);

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "audio.webm");
        formData.append("language", selectedLanguage); // 👈 envia a língua escolhida

        setSeeProgress(true);
        try {
          const response = await axios.post(
            `${backDomain}/api/v1/speech-listening`,
            formData
          );

          const speechToText = response.data.transcript;
          setTranscript(speechToText);
          isCorrectAnswer(speechToText);
          setIsDisabled(false);
        } catch (error) {
          notifyAlert("Erro ao transcrever áudio");
          console.log("Erro ao transcrever áudio", error);
        } finally {
          setSeeProgress(false);
          setEnableVoice(false);
          setListening(false);
        }
      };
    } catch (error: any) {
      notifyAlert("Erro ao acessar microfone", error);
      console.log("Erro ao acessar microfone", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setListening(false);
  };

  const [selectedVoice, setSelectedVoice] = useState<any>("");
  const [changeNumber, setChangeNumber] = useState<boolean>(true);

  useEffect(() => {
    const storedVoice = localStorage.getItem("chosenVoice");
    setSelectedVoice(storedVoice);
  }, [selectedVoice, changeNumber]);

  return isAPPLE ? (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          padding: "2rem",
          borderRadius: "16px",
          backgroundColor: "#fff",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e0e0e0",
        }}
      >
        {/* Icon */}
        <div
          style={{
            fontSize: "3rem",
            marginBottom: "1.5rem",
            color: "#ff6b6b",
          }}
        >
          🚫
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "#333",
            marginBottom: "1rem",
            lineHeight: "1.4",
          }}
        >
          Audio Recording Not Supported
        </h2>

        {/* Subtitle */}
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: "500",
            color: "#666",
            marginBottom: "1.5rem",
            lineHeight: "1.4",
          }}
        >
          Gravação de áudio não suportada
        </h3>

        {/* Main message */}
        <p
          style={{
            fontSize: "1rem",
            color: "#555",
            lineHeight: "1.6",
            marginBottom: "1.5rem",
          }}
        >
          Your Apple device or Safari browser doesn't support audio recording
          features required for this exercise.
        </p>

        <p
          style={{
            fontSize: "0.95rem",
            color: "#666",
            lineHeight: "1.6",
            marginBottom: "2rem",
          }}
        >
          Seu dispositivo Apple ou navegador Safari não suporta os recursos de
          gravação de áudio necessários para este exercício.
        </p>

        {/* Recommendations */}
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "1.5rem",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            border: "1px solid #e9ecef",
          }}
        >
          <h4
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              color: "#495057",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            💡 Recommended Solutions
          </h4>

          <div
            style={{
              textAlign: "left",
              fontSize: "0.9rem",
              color: "#555",
              lineHeight: "1.5",
            }}
          >
            <div style={{ marginBottom: "0.8rem" }}>
              <strong>🖥️ Desktop/Laptop:</strong>
              <br />
              Use Google Chrome or Firefox on your computer
            </div>

            <div style={{ marginBottom: "0.8rem" }}>
              <strong>📱 Mobile Alternative:</strong>
              <br />
              Try Google Chrome mobile browser (on some Android devices)
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
            alignItems: "center",
          }}
        >
          <a
            href="/flash-cards"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: partnerColor(),
              color: "#fff",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "0.95rem",
              fontWeight: "500",
              transition: "all 0.2s",
              minWidth: "200px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            📚 Try Regular Flashcards
          </a>

          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "transparent",
              color: "#666",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "0.9rem",
              border: "1px solid #ddd",
              transition: "all 0.2s",
              minWidth: "200px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f8f9fa";
              e.currentTarget.style.borderColor = "#bbb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "#ddd";
            }}
          >
            🏠 Back to Home
          </a>
        </div>

        {/* Footer note */}
        <div
          style={{
            marginTop: "2rem",
            paddingTop: "1rem",
            borderTop: "1px solid #eee",
            fontSize: "0.8rem",
            color: "#999",
            fontStyle: "italic",
          }}
        >
          This limitation is due to browser security policies on iOS/Safari
          devices
        </div>
      </div>
    </section>
  ) : (
    <section id="review">
      <Voice
        changeB={changeNumber}
        setChangeB={setChangeNumber}
        maxW="400px"
        chosenLanguage={selectedLanguage}
      />{" "}
      {see && (
        <div>
          {loading ? (
            <CircularProgress style={{ color: partnerColor() }} />
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
                            fontSize: "1rem",
                            fontWeight: 400,
                          }}
                        >
                          {cards[0]?.front?.text.replace(/\s+/g, " ")}
                        </p>
                        <p
                          style={{
                            fontFamily: textGeneralFont(),
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
                      </p>
                      <p>
                        You scored <b>{score.toFixed()}</b> points
                      </p>
                    </div>
                    {seeProgress ? (
                      <CircularProgress style={{ color: partnerColor() }} />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <button
                          disabled={playingAudio}
                          onClick={() => {
                            setPlayingAudio(true);
                            setTimeout(() => {
                              setPlayingAudio(false);
                            }, 3000);
                            readText(
                              cards[0]?.front?.language == "en"
                                ? `${cards[0]?.front?.text.replace(
                                    /\s+/g,
                                    " "
                                  )}`
                                : `${cards[0]?.front?.text}`,
                              false,
                              cards[0]?.front?.language,
                              selectedVoice
                            );
                            setSelectedLanguage(cards[0]?.front?.language);
                            console.log(cards[0]?.front?.language);
                            const wordsInSentence =
                              cards[0]?.front?.text.split(" ").length || 0;
                            const estimatedTime = Math.min(
                              6000,
                              wordsInSentence * 350
                            );

                            setTimeout(() => {
                              setEnableVoice(true);
                            }, estimatedTime);
                          }}
                          color={!playingAudio ? "blue" : "grey"}
                          style={{
                            cursor: playingAudio ? "not-allowed" : "pointer",
                            margin: "0 5px",
                            marginTop: !isDisabled ? "1rem" : 0,
                          }}
                        >
                          <i className="fa fa-volume-up" aria-hidden="true" />
                        </button>
                        <button
                          style={{
                            display: !isDisabled ? "none" : "inline-block",
                            cursor: enableVoice ? "pointer" : "not-allowed",
                            margin: "0 5px",
                          }}
                          disabled={!enableVoice}
                          onClick={() => {
                            if (
                              !enableVoice ||
                              !readyToListen ||
                              !cards[0]?.front?.text
                            )
                              return;
                            if (isIOS || isSafari) {
                              if (!listening) {
                                cardTextRef.current =
                                  cards[0]?.front?.text || "";

                                (window as any).startSpeechRecognition();
                                setListening(true);
                                setTimeout(() => setListening(false), 4000);
                              }
                            } else {
                              !listening ? startRecording() : stopRecording();
                            }
                          }}
                          color={
                            !enableVoice
                              ? "lightgrey"
                              : listening
                              ? "red"
                              : "green"
                          }
                        >
                          <i
                            className={
                              isIOS || isSafari || !listening
                                ? "fa fa-microphone"
                                : "fa fa-stop"
                            }
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    style={{
                      marginTop: "1rem",
                      display: isDisabled ? "none" : "inline-block",
                    }}
                    disabled={next}
                    color="green"
                    onClick={() => ponctuate(transcript)}
                  >
                    Next
                  </button>
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
        <button onClick={seeCardsToReview} style={{ margin: "0 5px" }}>
          {!see ? "Start" : <i className="fa fa-refresh" />}
        </button>
      </div>
      <ProgressCounter flashcardsToday={flashcardsToday} />
    </section>
  );
};

export default ListeningExercise;
