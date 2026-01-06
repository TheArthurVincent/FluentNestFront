import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import {
  backDomain,
  onLoggOut,
  updateInfo,
} from "../../../Resources/UniversalComponents";
import {
  notifyAlert,
  readText,
} from "../../EnglishLessons/Assets/Functions/FunctionLessons";
import { alwaysWhite, partnerColor } from "../../../Styles/Styles";
import { ProgressCounter } from "../../FlashCardsToday/FlashCardsToday";
import Voice from "../../../Resources/Voice";
import { useUserContext } from "../../../Application/SelectLanguage/SelectLanguage";

// ---------------------- Helpers de texto ----------------------

const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[?.,/’'#!$%-^&*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

function escapeHTML(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

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
      output.push(
        `<span style="color: green;">${escapeHTML(userWord || "")}</span>`
      );
    } else {
      output.push(
        `<span style="color: red; font-weight: 400;">${
          userWord ? escapeHTML(userWord) : "(extra)"
        }</span>`
      );
    }
  }

  return output.join(" ");
}

function wordCount(str: string): number {
  return normalizeText(str).split(" ").filter(Boolean).length;
}

function cleanString(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();
}

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

// ---------------------- Types ----------------------

interface FlashCardsPropsRv {
  headers: MyHeadersType | null;
  onChange: (value: boolean) => void;
  change: boolean;
}

// ---------------------- Estilos reutilizáveis ----------------------

const baseCardStyle: React.CSSProperties = {
  borderRadius: "4px",
  backgroundColor: alwaysWhite(),
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "10px 18px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: 500,
  backgroundColor: partnerColor(),
  color: "#ffffff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  minWidth: "110px",
  transition: "box-shadow 0.15s ease, transform 0.1s ease, opacity 0.15s",
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "9px 16px",
  borderRadius: "6px",
  border: "1px solid #cbd5f1",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: 500,
  backgroundColor: "#ffffff",
  color: "#334155",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "42px",
  transition: "background-color 0.15s ease, border-color 0.15s ease",
};

const selectStyleBase: React.CSSProperties = {
  borderRadius: "6px",
  border: "1px solid #e2e8f0",
  backgroundColor: "#f8fafc",
  fontSize: "13px",
  fontWeight: 400,
  color: "#475569",
  padding: "7px 12px",
  minWidth: "200px",
  outline: "none",
  cursor: "pointer",
};

const pillSimilarityBase: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "0.9rem",
  fontWeight: 500,
  textAlign: "center" as const,
};

// ---------------------- Componente principal ----------------------

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
  const [language, setLanguage] = useState<string>("en");
  const [words, setWords] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [transcript, setTranscript] = useState<string>("");
  const [transcriptHighLighted, setTranscriptHighLighted] =
    useState<string>("");
  const [myPermissions, setMyPermissions] = useState<string>("");
  const [isShow, setIsShow] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [loadingStudents, setLoadingStudents] = useState<boolean>(false);
  const [students, setStudents] = useState<any[]>([]);
  const [listening, setListening] = useState<boolean>(false);

  const cardTextRef = useRef<string>("");

  const { UniversalTexts } = useUserContext();
  const actualHeaders = headers || {};

  const languageMap: { [key: string]: string } = {
    en: "en-US",
    pt: "pt-BR",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    it: "it-IT",
  };

  // Apple / Safari (sem suporte)
  const [isAPPLE, setISAPPLE] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;

    const isIOS = /iPad|iPhone|iPod/.test(ua) && !("MSStream" in window);
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

    if (isIOS || isSafari) {
      setISAPPLE(true);
    } else {
      setISAPPLE(false);
    }

    const mobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    setIsMobile(mobile);
  }, []);

  // ---------------------- Info do usuário ----------------------

  useEffect(() => {
    const user = localStorage.getItem("loggedIn");
    const flashcardsTodayStored =
      localStorage.getItem("flashcardsToday") || "0";
    const flashcardsTodayNumber = parseFloat(flashcardsTodayStored);

    if (!user) {
      console.log("No user found in localStorage, logging out");
      onLoggOut();
      return;
    }

    const parsed = JSON.parse(user);
    const userId = parsed.id || "";
    const permissions = parsed.permissions || "";

    setId(userId);
    setSelectedStudentId(userId);
    setMyPermissions(permissions);
    setFlashcardsToday(flashcardsTodayNumber);

    setTimeout(() => {
      updateInfo(userId, actualHeaders);
    }, 100);
  }, [change, actualHeaders]);

  // ---------------------- Carregar alunos ----------------------

  const fetchStudents = async () => {
    if (!myId) return;

    if (myPermissions === "superadmin" || myPermissions === "teacher") {
      setLoadingStudents(true);
      try {
        const response = await axios.get(
          `${backDomain}/api/v1/students/${myId}`,
          {
            headers: actualHeaders,
          }
        );
        const allUsers = response.data.listOfStudents || response.data;
        setStudents(allUsers);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoadingStudents(false);
      }
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [myId, myPermissions, actualHeaders]);

  const handleStudentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = event.target.value;
    setSee(false);
    setSelectedStudentId(studentId);
  };

  // ---------------------- Review no backend ----------------------

  const reviewListeningExercise = async (
    finalScore: number,
    percentage: number
  ) => {
    setNext(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/reviewflashcardlistening/${
          selectedStudentId || myId
        }`,
        {
          flashcardId: cards[0]?._id,
          score: finalScore,
          percentage,
          transcript,
          dayToday: new Date(),
        },
        { headers: actualHeaders || {} }
      );

      onChange(!change);
      setNext(false);
      setTranscript("");
      setTranscriptHighLighted("");
      setLoading(false);

      const user = localStorage.getItem("loggedIn");
      const flashcardsTodayStored =
        localStorage.getItem("flashcardsToday") || "0";
      const flashcardsTodayNumber = parseFloat(flashcardsTodayStored);

      if (user) {
        const { id } = JSON.parse(user);
        setId(id);
        setFlashcardsToday(flashcardsTodayNumber);

        setTimeout(() => {
          updateInfo(id, actualHeaders);
        }, 100);
      }

      seeCardsToReview();
    } catch (error) {
      notifyAlert("Erro ao enviar cards");
    }
  };

  // ---------------------- Correção / Similaridade ----------------------

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

    setTranscriptHighLighted(highlightDifferences(cardTextRaw, user, sim));
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
      setLoading(false);
      return;
    }

    const cardText = normalizeText(cleanString(raw.replace(/\s+/g, " ")));
    const userTranscript = normalizeText(cleanString(transcription || ""));

    const wordCountInCard = wordCount(
      cards[0]?.front?.text.replace(/\s+/g, " ") || ""
    );

    if (!userTranscript) {
      setSimilarity(0);
      setScore(0);
      setWords(wordCountInCard);
      reviewListeningExercise(0, 0);
      return;
    }

    if (cleanString(cardText) === cleanString(userTranscript)) {
      setSimilarity(100);
      const finalScore = wordCountInCard * 3;
      setScore(finalScore);
      setWords(wordCountInCard);
      reviewListeningExercise(finalScore, 100);
      return;
    }

    const simC = similarityPercentage(
      userTranscript,
      cards[0]?.front?.text.replace(/\s+/g, " ") || ""
    );

    setSimilarity(simC);
    setWords(wordCountInCard);

    let points = 0;
    if (simC >= 98) {
      points = wordCountInCard * 3;
      setScore(points);
      reviewListeningExercise(points, 100);
    } else if (simC >= 40) {
      points = wordCountInCard * 2;
      setScore(points);
      reviewListeningExercise(points, simC);
    } else {
      points = 0;
      setScore(points);
      reviewListeningExercise(points, simC);
    }
  };

  // ---------------------- Buscar cards ----------------------

  const [filterLanguage, setFilterLanguage] = useState<string>("en");

  const seeCardsToReview = async () => {
    setReadyToListen(false);
    setLoading(true);
    setTranscript("");
    setTranscriptHighLighted("");
    setIsDisabled(true);
    setSee(true);
    setSimilarity(0);
    setScore(0);
    setWords(0);

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/flashcardslistening/${selectedStudentId || myId}`,
        {
          headers: actualHeaders || {},
          params: {
            lang: filterLanguage,
          },
        }
      );

      const lp = response.data.dueFlashcards[0]?.front?.language || "en";
      setLanguage(lp);

      const theFlashcardsTodayNumber = response.data.flashCardsReviewsToday;
      localStorage.setItem(
        "flashcardsToday",
        JSON.stringify(response.data.flashCardsReviewsToday)
      );
      setFlashcardsToday(theFlashcardsTodayNumber);

      setCards(response.data.dueFlashcards || []);
      cardTextRef.current = response.data.dueFlashcards[0]?.front?.text || "";

      const thereAreCards = !!response.data.dueFlashcards[0];
      setCardsLength(thereAreCards);
      setIsShow(true);

      setTimeout(() => {
        setReadyToListen(true);
        setEnableVoice(true);
      }, 300);
    } catch (error) {
      notifyAlert("Erro ao carregar cards");
    } finally {
      setLoading(false);
      setIsShow(true);
    }
  };

  // ---------------------- Gravação Google (inglês) ----------------------

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks: BlobPart[] = [];

  const startRecording = async () => {
    try {
      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia ||
        typeof MediaRecorder === "undefined"
      ) {
        notifyAlert("Gravação de áudio não suportada neste navegador.");
        return;
      }

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
        formData.append("language", languageMap[language] || "en-US");

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
      notifyAlert("Erro ao acessar microfone");
      console.log("Erro ao acessar microfone", error);
      setListening(false);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setListening(false);
  };

  // ---------------------- Browser SpeechRecognition (não-inglês) ----------------------

  const recognitionRef = useRef<any>(null);

  const startBrowserSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      notifyAlert("Reconhecimento de voz não suportado neste navegador.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = languageMap[language] || "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript.trim();
      setTranscript(speechToText);
      setSeeProgress(true);
      isCorrectAnswer(speechToText);
      setIsDisabled(false);
      setSeeProgress(false);
      setEnableVoice(false);
      setListening(false);
    };

    recognition.onerror = () => {
      notifyAlert("Erro no reconhecimento de voz");
      setEnableVoice(false);
      setListening(false);
    };

    recognition.onspeechend = () => {
      recognition.stop();
    };

    recognition.start();
    setListening(true);
  };

  const stopBrowserSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  };

  // ---------------------- Voz selecionada ----------------------

  const [selectedVoice, setSelectedVoice] = useState<any>("");
  const [changeNumber, setChangeNumber] = useState<boolean>(true);

  useEffect(() => {
    const storedVoice = localStorage.getItem("chosenVoice");
    setSelectedVoice(storedVoice);
  }, [changeNumber]);

  // ---------------------- Render Apple fallback ----------------------

  if (isAPPLE) {
    return (
      <section>
        <div>
          <div
            style={{
              padding: "24px 24px 20px",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#1f2933",
                marginBottom: "4px",
              }}
            >
              Audio Recording Not Supported
            </h2>

            <h3
              style={{
                fontSize: "1.05rem",
                fontWeight: 500,
                color: "#4b5563",
                marginBottom: "16px",
              }}
            >
              Gravação de áudio não suportada
            </h3>

            <p
              style={{
                fontSize: "0.95rem",
                color: "#4b5563",
                lineHeight: 1.6,
                marginBottom: "8px",
              }}
            >
              Your Apple device or Safari browser does not provide the audio
              recording features required for this exercise.
            </p>

            <p
              style={{
                fontSize: "0.9rem",
                color: "#6b7280",
                lineHeight: 1.6,
                marginBottom: "20px",
              }}
            >
              Seu dispositivo Apple ou navegador Safari não oferece os recursos
              de gravação de áudio necessários para este exercício.
            </p>

            <div
              style={{
                borderRadius: "4px",
                backgroundColor: "#f1f5f9",
                border: "1px solid #e2e8f0",
                padding: "16px",
                marginBottom: "18px",
              }}
            >
              <h4
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "#1e293b",
                  marginBottom: "10px",
                }}
              >
                Recommended alternatives
              </h4>

              <ul
                style={{
                  margin: 0,
                  paddingLeft: "18px",
                  fontSize: "0.9rem",
                  color: "#475569",
                  lineHeight: 1.5,
                }}
              >
                <li style={{ marginBottom: "6px" }}>
                  Use Google Chrome or Firefox on a desktop or laptop.
                </li>
                <li>
                  Em alguns dispositivos Android, você pode tentar o navegador
                  Google Chrome para ter suporte completo.
                </li>
              </ul>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <a
                href="/flash-cards"
                style={{
                  ...primaryButtonStyle,
                  textDecoration: "none",
                }}
              >
                Try regular flashcards
              </a>

              <a
                href="/"
                style={{
                  ...secondaryButtonStyle,
                  textDecoration: "none",
                  borderRadius: "6px",
                }}
              >
                Back to home
              </a>
            </div>

            <div
              style={{
                marginTop: "8px",
                paddingTop: "10px",
                borderTop: "1px solid #e5e7eb",
                fontSize: "0.75rem",
                color: "#9ca3af",
                fontStyle: "italic",
              }}
            >
              This limitation is caused by security and privacy policies in
              iOS/Safari regarding microphone access.
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ---------------------- Render normal ----------------------

  const similarityColor =
    similarity === 100
      ? "#16a34a"
      : similarity > 98
      ? "#2563eb"
      : similarity > 40
      ? "#eab308"
      : "#dc2626";

  const similarityBorderColor =
    similarity > 40 ? "transparent" : "rgba(255,255,255,0.7)";

  return (
    <section>
      <div>
        {/* Header / controles superiores */}
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              padding: "16px 18px 10px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {/* Filtro de língua */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  marginTop: "4px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "#64748b",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Language:
                  </span>
                  <select
                    value={filterLanguage}
                    onChange={(e) => {
                      setFilterLanguage(e.target.value);
                    }}
                    style={selectStyleBase}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                  </select>
                </div>

                {(myPermissions === "superadmin" ||
                  myPermissions === "teacher") && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#64748b",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Student:
                    </span>
                    {loadingStudents ? (
                      <CircularProgress
                        size={18}
                        style={{ color: partnerColor() }}
                      />
                    ) : (
                      <select
                        onChange={handleStudentChange}
                        value={selectedStudentId}
                        style={{
                          ...selectStyleBase,
                          minWidth: "220px",
                          maxWidth: "260px",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = partnerColor();
                          e.target.style.backgroundColor = "#ffffff";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "#e2e8f0";
                          e.target.style.backgroundColor = "#f8fafc";
                        }}
                      >
                        <option value="">
                          {UniversalTexts?.selectAStudent ||
                            "Selecione um aluno..."}
                        </option>
                        {students.map((student) => (
                          <option
                            key={student.id || student.theId}
                            value={student.id || student.theId}
                          >
                            {student.name} {student.lastname}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card principal de listening */}
        <div
          style={{
            ...baseCardStyle,
            padding: "22px 20px 18px",
            marginBottom: "20px",
          }}
        >
          {see ? (
            loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "24px 0",
                }}
              >
                <CircularProgress style={{ color: partnerColor() }} />
              </div>
            ) : (
              <div
                style={{
                  maxWidth: "460px",
                  margin: "0 auto",
                  textAlign: "left",
                }}
              >
                {cardsLength ? (
                  <>
                    {/* Resultado / correção */}
                    <div
                      style={{
                        display: isDisabled ? "none" : "grid",
                        gap: "14px",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          ...pillSimilarityBase,
                          backgroundColor: similarityColor,
                          border: `1px solid ${similarityBorderColor}`,
                        }}
                      >
                        <span>{similarity}% correct</span>
                        {similarity < 40 && (
                          <span
                            style={{ marginLeft: "4px", fontSize: "0.8rem" }}
                          >
                            (minimum 40% to score)
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gap: "6px",
                          border: "1px solid #e2e8f0",
                          borderRadius: "4px",
                          padding: "14px 12px",
                          backgroundColor: "#fdfeff",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "0.95rem",
                            fontWeight: 500,
                            color: "#0f172a",
                          }}
                        >
                          Original sentence
                        </p>
                        <p
                          style={{
                            fontSize: "0.95rem",
                            fontWeight: 400,
                            color: "#111827",
                          }}
                        >
                          {cards[0]?.front?.text.replace(/\s+/g, " ")}
                        </p>
                        <p
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: 400,
                            color: "#6b7280",
                          }}
                        >
                          {cards[0]?.back?.text}
                        </p>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gap: "6px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "4px",
                          padding: "14px 12px",
                          backgroundColor: "#ffffff",
                        }}
                      >
                        <p
                          style={{
                            color: "#6b7280",
                            marginBottom: "2px",
                            fontSize: "0.8rem",
                            fontStyle: "italic",
                          }}
                        >
                          Your answer
                        </p>
                        <div
                          style={{
                            fontSize: "0.94rem",
                            lineHeight: 1.6,
                          }}
                          dangerouslySetInnerHTML={{
                            __html: transcriptHighLighted,
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "10px",
                          fontSize: "0.9rem",
                          color: "#111827",
                        }}
                      >
                        <p>
                          Sentence length: <b>{words}</b> words
                        </p>
                        <p>
                          Your score:{" "}
                          <b>{Number.isFinite(score) ? score.toFixed(0) : 0}</b>{" "}
                          points
                        </p>
                      </div>
                    </div>

                    {/* Área de escuta + gravação */}
                    {seeProgress ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          padding: "10px 0",
                        }}
                      >
                        <CircularProgress style={{ color: partnerColor() }} />
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "10px",
                          marginTop: isDisabled ? 0 : "4px",
                        }}
                      >
                        {/* Botão ouvir frase (TTS) */}
                        <div>
                          <Voice
                            changeB={changeNumber}
                            setChangeB={setChangeNumber}
                            maxW="280px"
                            chosenLanguage={language}
                          />
                        </div>
                        <button
                          onClick={() => {
                            const text = cards[0]?.front?.text;
                            if (!text) return;

                            if (
                              typeof window !== "undefined" &&
                              "speechSynthesis" in window
                            ) {
                              window.speechSynthesis.cancel();
                            }

                            readText(
                              text,
                              false,
                              cards[0]?.front?.language,
                              selectedVoice
                            );

                            const wordsInSentence = text.split(" ").length || 0;
                            const estimatedTime = Math.min(
                              8000,
                              wordsInSentence * 400
                            );

                            setTimeout(() => {
                              setEnableVoice(true);
                            }, estimatedTime);
                          }}
                          style={secondaryButtonStyle}
                          aria-label="Play sentence"
                          title="Play sentence"
                        >
                          <i className="fa fa-volume-up" aria-hidden="true" />
                        </button>

                        {/* Botão gravação / reconhecimento */}
                        <button
                          style={{
                            ...secondaryButtonStyle,
                            display: !isDisabled ? "none" : "inline-flex",
                            cursor: enableVoice ? "pointer" : "not-allowed",
                            opacity: enableVoice ? 1 : 0.55,
                          }}
                          disabled={!enableVoice}
                          onClick={() => {
                            if (!enableVoice || !readyToListen) return;
                            if (!cards[0]?.front?.text) return;

                            if (isMobile && language !== "en") {
                              notifyAlert(
                                "No celular, o listening só está disponível para frases em inglês. Use um computador para outras línguas."
                              );
                              return;
                            }

                            cardTextRef.current = cards[0]?.front?.text || "";

                            if (language === "en") {
                              if (!listening) {
                                startRecording();
                              } else {
                                stopRecording();
                              }
                            } else {
                              if (!listening) {
                                startBrowserSpeechRecognition();
                              } else {
                                stopBrowserSpeechRecognition();
                              }
                            }
                          }}
                          aria-label={
                            !listening ? "Start recording" : "Stop recording"
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

                    {/* Botão Next */}
                    <div
                      style={{
                        marginTop: "16px",
                        display: isDisabled ? "none" : "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        style={{
                          ...primaryButtonStyle,
                          opacity: next ? 0.7 : 1,
                          cursor: next ? "wait" : "pointer",
                        }}
                        disabled={next}
                        onClick={() => ponctuate(transcript)}
                      >
                        {next ? "Saving..." : "Next card"}
                      </button>
                    </div>

                    {/* Área de anotação opcional */}
                    <textarea
                      style={{
                        display: !isDisabled ? "none" : "block",
                        marginTop: "18px",
                        width: "100%",
                        minHeight: "72px",
                        padding: "10px 12px",
                        borderRadius: "4px",
                        border: "1px solid #e5e7eb",
                        fontSize: "0.9rem",
                        resize: "vertical",
                        color: "#111827",
                      }}
                      placeholder="Use this area to write what you hear before speaking, if it helps your listening."
                    />
                  </>
                ) : (
                  <p
                    style={{
                      textAlign: "center",
                      padding: "20px 0",
                      fontSize: "0.95rem",
                      color: "#6b7280",
                    }}
                  >
                    No flashcards available for listening review right now.
                  </p>
                )}
              </div>
            )
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "16px 4px 8px",
              }}
            >
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "#4b5563",
                  marginBottom: "12px",
                }}
              >
                When you are ready, start the listening session. You can use
                your voice or type to match the sentence.
              </p>
            </div>
          )}

          {/* Start / Refresh */}
          <div
            style={{
              display: !isDisabled && !see ? "none" : "flex",
              justifyContent: "center",
              marginTop: see ? "18px" : "8px",
            }}
          >
            <button onClick={seeCardsToReview} style={primaryButtonStyle}>
              {!see ? "Start" : "Refresh"}
            </button>
          </div>
        </div>

        {/* Progressão diária */}
        <div
          style={{
            ...baseCardStyle,
            padding: "12px 16px 10px",
          }}
        >
          <ProgressCounter flashcardsToday={flashcardsToday} />
        </div>
      </div>
    </section>
  );
};

export default ListeningExercise;
