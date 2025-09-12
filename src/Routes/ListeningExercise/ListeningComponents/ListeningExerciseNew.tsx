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
    }
  }

  return output.join(" ");
}

function wordCount(str: string): number {
  return normalizeText(str).split(" ").filter(Boolean).length;
}

// Normaliza texto
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[?.,/’'#!$%-^&*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

// Limpa string
function cleanString(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();
}

// Levenshtein
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
  const [isAPPLE, setISAPPLE] = useState<boolean>(false);

  const [selectedVoice, setSelectedVoice] = useState<any>("");
  const [changeNumber, setChangeNumber] = useState<boolean>(true);

  // Idioma da fala (derivado do card)
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  // Refs & infra de SR
  const recognitionRef = useRef<any>(null);
  const finalBufferRef = useRef<string>("");
  const shouldRestartRef = useRef<boolean>(false);
  const useSRFallbackRef = useRef<boolean>(false);

  // Fallback via MediaRecorder
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks: BlobPart[] = [];

  // Texto correto do card
  const cardTextRef = useRef<string>("");

  const actualHeaders = headers || {};

  const languageToLocale = (lang: string) => {
    switch ((lang || "").toLowerCase()) {
      case "en":
        return "en-US";
      case "es":
        return "es-419"; // LatAm
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

  // Bootstrap usuário e contagem
  useEffect(() => {
    const userStr = localStorage.getItem("loggedIn");
    const flashcardsTodayLS = localStorage.getItem("flashcardsToday") || "0";
    const flashcardsTodayNumber = parseFloat(flashcardsTodayLS as any);

    setTimeout(() => {
      updateInfo(myId, actualHeaders);
    }, 100);

    setTimeout(() => {
      if (userStr) {
        const { id } = JSON.parse(userStr);
        setId(id);
        setFlashcardsToday(flashcardsTodayNumber);
      }
    }, 250);
  }, [change]); // mantém esqueleto

  const reviewListeningExercise = async (scoreVal: number, percentage: number) => {
    setNext(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/reviewflashcardlistening/${myId}`,
        {
          flashcardId: cards[0]?._id,
          score: scoreVal,
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

      const userStr = localStorage.getItem("loggedIn");
      const flashcardsTodayLS = localStorage.getItem("flashcardsToday") || "0";
      const flashcardsTodayNumber = parseFloat(flashcardsTodayLS as any);

      setTimeout(() => {
        updateInfo(myId, actualHeaders);
      }, 100);
      setTimeout(() => {
        if (userStr) {
          const { id } = JSON.parse(userStr);
          setId(id);
          setFlashcardsToday(flashcardsTodayNumber);
        }
      }, 250);
      seeCardsToReview();
    } catch (error) {
      notifyAlert("Erro ao enviar cards");
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

  // Pontuação estável (sem depender do estado antigo)
  const ponctuate = (transcription: string | null) => {
    setLoading(true);
    const raw = cards[0]?.front?.text;
    if (!raw) {
      notifyAlert("Erro: Card text está vazio.");
      return;
    }

    const cardRaw = raw.replace(/\s+/g, " ");
    const wc = wordCount(cardRaw);
    const userTranscript = normalizeText(cleanString(transcription || ""));
    const cardText = normalizeText(cleanString(cardRaw));

    if (userTranscript === "") {
      setSimilarity(0);
      setScore(0);
      setWords(wc);
      reviewListeningExercise(0, 0);
      return;
    }

    let simC = similarityPercentage(userTranscript, cardRaw);
    let pointsLocal = 0;

    if (cleanString(cardText) === cleanString(userTranscript) || simC >= 98) {
      simC = 100;
      pointsLocal = wc * 3;
    } else if (simC >= 40) {
      pointsLocal = wc * 2;
    }

    setSimilarity(simC);
    setWords(wc);
    setScore(pointsLocal);
    reviewListeningExercise(pointsLocal, simC);

    onChange(!change);
  };

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
      const first = response.data.dueFlashcards[0];
      cardTextRef.current = first?.front?.text || "";
      setSelectedLanguage(first?.front?.language || "en");

      setCardsLength(thereAreCards);
      setLoading(false);
      setIsShow(true);
      setTimeout(() => {
        setReadyToListen(true);
        setEnableVoice(true);
      }, 300);
    } catch (error) {
      notifyAlert("Erro ao carregar cards");
    }
    setIsShow(true);
  };

  // Detecta suporte e decide quando bloquear UI (apenas se nem SR nem MediaRecorder estiverem disponíveis)
  useEffect(() => {
    const isIOSUA =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
    const isSafariUA = /^((?!chrome|android).)*safari/i.test(
      navigator.userAgent
    );

    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const MR: any = (window as any).MediaRecorder;

    const supportsAnyAudioInput =
      !!SR || (MR && MR.isTypeSupported && (MR.isTypeSupported("audio/webm;codecs=opus") || MR.isTypeSupported("audio/webm")));

    // Só mostra tela de "não suportado" se for Apple/Safari e NÃO tiver SR
    if ((isIOSUA || isSafariUA) && !SR) {
      setISAPPLE(true);
    } else {
      setISAPPLE(!supportsAnyAudioInput); // bloqueia se nada for suportado
    }
  }, []);

  // ÚNICO setup do SpeechRecognition (centralizado) + auto-restart + window.start/stop
  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      recognitionRef.current = null;
      return;
    }

    // encerra instância anterior
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    const rec = new SR();
    recognitionRef.current = rec;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.continuous = true;
    rec.lang = languageToLocale(selectedLanguage);

    rec.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalBufferRef.current = (finalBufferRef.current + " " + t).trim();
        } else {
          interim += t;
        }
      }

      const combined = (finalBufferRef.current + " " + interim).trim();
      setTranscript(combined);

      // Não pontua em tempo real; libera o "Next" após captar algo
      if (combined.length > 0) {
        isCorrectAnswer(combined);
        setIsDisabled(false);
      }
    };

    rec.onerror = (e: any) => {
      // no-speech e aborted são comuns; reabra se estamos gravando
      if (shouldRestartRef.current && (e?.error === "no-speech" || e?.error === "aborted")) {
        try { rec.start(); } catch {}
        return;
      }
      notifyAlert(`Erro no reconhecimento de voz: ${e?.error || "desconhecido"}`);
      setEnableVoice(false);
      setListening(false);
    };

    rec.onend = () => {
      if (shouldRestartRef.current) {
        try { rec.start(); } catch {}
      }
    };

    // Exponho funções globais porque seu UI chama window.*
    (window as any).startSpeechRecognition = () => {
      if (!readyToListen) {
        notifyAlert("Aguarde carregar o card antes de gravar.");
        return;
      }
      if (!recognitionRef.current) return;
      shouldRestartRef.current = true;
      setListening(true);
      finalBufferRef.current = "";
      setTranscript("");
      recognitionRef.current.lang = languageToLocale(selectedLanguage);
      try { recognitionRef.current.start(); } catch {}
    };

    (window as any).stopSpeechRecognition = () => {
      shouldRestartRef.current = false;
      setListening(false);
      try {
        if (recognitionRef.current) {
          recognitionRef.current.onend = null; // evita auto-restart
          recognitionRef.current.stop();
        }
      } catch {}
    };

    return () => {
      try {
        rec.onend = null;
        rec.stop();
      } catch {}
    };
  }, [selectedLanguage, readyToListen]);

  // Gravação fallback (não real-time) via MediaRecorder + backend
  const startRecording = async () => {
    // Se SR existir, usa SR (mesmo fora do iOS) — mantém compatibilidade com seu botão
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR && recognitionRef.current) {
      (window as any).startSpeechRecognition?.();
      useSRFallbackRef.current = true;
      return;
    }

    // Fallback MediaRecorder
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const MR: any = (window as any).MediaRecorder;
      let mime = "audio/webm;codecs=opus";
      if (!(MR?.isTypeSupported?.(mime))) {
        mime = MR?.isTypeSupported?.("audio/webm") ? "audio/webm" : "";
      }
      if (!mime) {
        notifyAlert("Formato de áudio não suportado pelo navegador.");
        return;
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType: mime });
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.length = 0;

      mediaRecorder.onstart = () => {
        setListening(true);
        setSeeProgress(true);
      };

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size) audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunks, { type: mime });
          const formData = new FormData();
          formData.append("audio", audioBlob, "audio.webm");
          // Se seu backend aceitar idioma, envie:
          // formData.append("language", languageToLocale(selectedLanguage));
          // formData.append("contentType", mime);

          const response = await axios.post(
            `${backDomain}/api/v1/speech-listening`,
            formData
          );

          const speechToText = (response.data?.transcript || "").trim();
          setTranscript(speechToText);
          isCorrectAnswer(speechToText);
          setIsDisabled(false);
        } catch (error) {
          notifyAlert("Erro ao transcrever áudio");
          console.error("Erro ao transcrever áudio", error);
        } finally {
          setSeeProgress(false);
          setEnableVoice(false);
          setListening(false);
        }
      };

      mediaRecorder.start();
    } catch (error: any) {
      notifyAlert("Erro ao acessar microfone");
      console.error("Erro ao acessar microfone", error);
    }
  };

  const stopRecording = () => {
    // encerra fallback
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try { mediaRecorderRef.current.stop(); } catch {}
    }
    // encerra SR
    (window as any).stopSpeechRecognition?.();
    setListening(false);
  };

  // Voice escolhida (sem loop)
  useEffect(() => {
    const storedVoice = localStorage.getItem("chosenVoice");
    if (storedVoice) setSelectedVoice(storedVoice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeNumber]);

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
        <div style={{ fontSize: "3rem", marginBottom: "1.5rem", color: "#ff6b6b" }}>
          🚫
        </div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#333", marginBottom: "1rem" }}>
          Audio Recording Not Supported
        </h2>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 500, color: "#666", marginBottom: "1.5rem" }}>
          Gravação de áudio não suportada
        </h3>
        <p style={{ fontSize: "1rem", color: "#555", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          Your device or browser doesn't support the audio features required for this exercise.
        </p>
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "1.5rem",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            border: "1px solid #e9ecef",
            textAlign: "left",
            fontSize: "0.9rem",
            color: "#555",
            lineHeight: 1.5,
          }}
        >
          <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "#495057", marginBottom: "1rem", textAlign: "center" }}>
            💡 Recommended Solutions
          </h4>
          <div style={{ marginBottom: "0.8rem" }}>
            <strong>🖥️ Desktop/Laptop:</strong>
            <br />
            Use Google Chrome or Firefox on your computer
          </div>
          <div style={{ marginBottom: "0.8rem" }}>
            <strong>📱 Mobile Alternative:</strong>
            <br />
            Try Google Chrome mobile browser (on Android devices)
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", alignItems: "center" }}>
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
              fontWeight: 500,
              minWidth: "200px",
            }}
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
              minWidth: "200px",
            }}
          >
            🏠 Back to Home
          </a>
        </div>
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
          This limitation is due to browser capabilities.
        </div>
      </div>
    </section>
  ) : (
    <section id="review">
      <Voice changeB={changeNumber} setChangeB={setChangeNumber} />
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
                                ? `${cards[0]?.front?.text.replace(/\s+/g, " ")}`
                                : `${cards[0]?.front?.text}`,
                              false,
                              cards[0]?.front?.language,
                              selectedVoice
                            );
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
                            if (!enableVoice || !readyToListen || !cards[0]?.front?.text) return;
                            // Mantém esqueleto: iOS/Safari usa window.startSpeechRecognition; demais, toggle
                            const isIOS =
                              /iPad|iPhone|iPod/.test(navigator.userAgent) &&
                              !("MSStream" in window);
                            const isSafari = /^((?!chrome|android).)*safari/i.test(
                              navigator.userAgent.toLowerCase()
                            );

                            if (isIOS || isSafari) {
                              if (!listening) {
                                cardTextRef.current = cards[0]?.front?.text || "";
                                (window as any).startSpeechRecognition?.();
                              } else {
                                (window as any).stopSpeechRecognition?.();
                              }
                              setListening((prev) => !prev);
                            } else {
                              !listening ? startRecording() : stopRecording();
                            }
                          }}
                          color={
                            !enableVoice ? "lightgrey" : listening ? "red" : "green"
                          }
                        >
                          <i
                            className={
                              !listening ? "fa fa-microphone" : "fa fa-stop"
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
