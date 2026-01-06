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
            lang: filterLanguage, // <<<<<<<<<< AQUI
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
  const [filterLanguage, setFilterLanguage] = useState<string>("all");

  useEffect(() => {
    const storedVoice = localStorage.getItem("chosenVoice");
    setSelectedVoice(storedVoice);
  }, [changeNumber]);

  // ---------------------- Render Apple fallback ----------------------

  if (isAPPLE) {
    return (
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
            borderRadius: "4px",
            backgroundColor: "#fff",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e0e0e0",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1.5rem",
              color: "#ff6b6b",
            }}
          >
            🚫
          </div>

          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#333",
              marginBottom: "1rem",
              lineHeight: "1.4",
            }}
          >
            Audio Recording Not Supported
          </h2>

          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: 500,
              color: "#666",
              marginBottom: "1.5rem",
              lineHeight: "1.4",
            }}
          >
            Gravação de áudio não suportada
          </h3>

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

          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "1.5rem",
              borderRadius: "4px",
              marginBottom: "1.5rem",
              border: "1px solid #e9ecef",
            }}
          >
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: 600,
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
                borderRadius: "4px",
                fontSize: "0.95rem",
                fontWeight: 500,
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
                borderRadius: "4px",
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
    );
  }

  // ---------------------- Render normal ----------------------

  return (
    <section id="review">
      <Voice
        changeB={changeNumber}
        setChangeB={setChangeNumber}
        maxW="400px"
        chosenLanguage={language}
      />

      {/* Select de língua para filtrar no backend */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "10px",
        }}
      >
        <select
          value={filterLanguage}
          onChange={(e) => {
            setFilterLanguage(e.target.value);
            // Se já estiver vendo, próxima vez que clicar em Start/refresh já vai buscar nessa língua
          }}
          style={{
            borderRadius: "4px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            fontSize: "13px",
            fontWeight: 400,
            color: "#64748b",
            padding: "6px 8px",
            minWidth: "200px",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="all">Todas as línguas</option>
          <option value="en">Inglês</option>
          <option value="es">Espanhol</option>
          <option value="fr">Francês</option>
          <option value="de">Alemão</option>
          <option value="it">Italiano</option>
        </select>
      </div>
      {(myPermissions === "superadmin" || myPermissions === "teacher") && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: alwaysWhite(),
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {loadingStudents ? (
            <CircularProgress size={20} style={{ color: partnerColor() }} />
          ) : (
            <select
              onChange={handleStudentChange}
              value={selectedStudentId}
              style={{
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc",
                fontSize: "13px",
                fontWeight: 400,
                color: "#64748b",
                padding: "6px 8px",
                minWidth: "200px",
                maxWidth: "300px",
                outline: "none",
                cursor: "pointer",
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
                {UniversalTexts?.selectAStudent || "Selecione um aluno..."}
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
                borderRadius: "4px",
              }}
            >
              {cardsLength ? (
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
                          borderRadius: "4px",
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
                          borderRadius: "4px",
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
                          borderRadius: "4px",
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
                        {/* Botão de áudio (TTS para ouvir a frase) */}
                        <button
                          onClick={() => {
                            const text = cards[0]?.front?.text;
                            if (!text) return;

                            // Cancela qualquer fala anterior do navegador (caso o readText use speechSynthesis)
                            if (
                              typeof window !== "undefined" &&
                              "speechSynthesis" in window
                            ) {
                              window.speechSynthesis.cancel();
                            }

                            // Lê o texto
                            readText(
                              text,
                              false,
                              cards[0]?.front?.language,
                              selectedVoice
                            );

                            // Reabilita o listening depois de um tempo razoável
                            const wordsInSentence = text.split(" ").length || 0;
                            const estimatedTime = Math.min(
                              8000,
                              wordsInSentence * 400
                            );

                            setTimeout(() => {
                              setEnableVoice(true);
                            }, estimatedTime);
                          }}
                          style={{
                            cursor: "pointer",
                            margin: "0 5px",
                            marginTop: !isDisabled ? "1rem" : 0,
                          }}
                        >
                          <i className="fa fa-volume-up" aria-hidden="true" />
                        </button>

                        {/* Botão de gravação / reconhecimento */}
                        <button
                          style={{
                            display: !isDisabled ? "none" : "inline-block",
                            cursor: enableVoice ? "pointer" : "not-allowed",
                            margin: "0 5px",
                          }}
                          disabled={!enableVoice}
                          onClick={() => {
                            if (!enableVoice || !readyToListen) return;
                            if (!cards[0]?.front?.text) return;

                            // Restrição: em celular, só funciona listening em inglês
                            if (isMobile && language !== "en") {
                              notifyAlert(
                                "No celular, o listening só está disponível para frases em inglês. Use um computador para outras línguas."
                              );
                              return;
                            }

                            cardTextRef.current = cards[0]?.front?.text || "";

                            if (language === "en") {
                              // Inglês -> Google (endpoint speech-listening)
                              if (!listening) {
                                startRecording();
                              } else {
                                stopRecording();
                              }
                            } else {
                              // Outras línguas -> SpeechRecognition do navegador
                              if (!listening) {
                                startBrowserSpeechRecognition();
                              } else {
                                stopBrowserSpeechRecognition();
                              }
                            }
                          }}
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
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                    placeholder="Use this area for reference if you need to transcribe what you hear"
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
