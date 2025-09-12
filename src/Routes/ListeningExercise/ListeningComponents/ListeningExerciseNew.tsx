import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import { backDomain, onLoggOut, updateInfo } from "../../../Resources/UniversalComponents";
import { notifyAlert, readText } from "../../EnglishLessons/Assets/Functions/FunctionLessons";
import { partnerColor, textGeneralFont } from "../../../Styles/Styles";
import { ProgressCounter } from "../../FlashCardsToday/FlashCardsToday";
import Voice from "../../../Resources/Voice";
import { useUserContext } from "../../../Application/SelectLanguage/SelectLanguage";

/** ----------------------- Helpers de texto e pontuação ----------------------- */

const normalizeText = (text: string): string =>
  text.toLowerCase().replace(/[?.,/’'#!$%-^&*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ").trim();

const cleanString = (str: string): string =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacríticos, preserva letras
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

function wordCount(str: string): number {
  return normalizeText(str).split(" ").filter(Boolean).length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const dp = Array.from(Array(len1 + 1), () => Array(len2 + 1).fill(0));
  for (let i = 0; i <= len1; i++) dp[i][0] = i;
  for (let j = 0; j <= len2; j++) dp[0][j] = j;
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
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

function highlightDifferences(original: string, userInput: string, similarity: number): string {
  const originalWords = normalizeText(original).split(" ");
  const userWords = normalizeText(userInput).split(" ");
  const output: string[] = [];
  const len = Math.max(originalWords.length, userWords.length);

  for (let i = 0; i < len; i++) {
    const userWord = userWords[i];
    const originalWord = originalWords[i];
    if (!userWord && originalWord) {
      output.push(similarity >= 40 ? `<span style="color: red;">-</span>` : "");
    } else if (userWord === originalWord) {
      output.push(`<span style="color: green;">${userWord}</span>`);
    } else {
      output.push(`<span style="color: red; font-weight: 400;">${userWord || "(extra)"}</span>`);
    }
  }
  return output.join(" ");
}

/** ----------------------- Helpers de áudio / SR / Google ----------------------- */

const languageToLocale = (lang: string) => {
  switch ((lang || "").toLowerCase()) {
    case "en": return "en-US";
    case "es": return "es-419"; // LatAm (costuma funcionar melhor pra BR)
    case "pt": return "pt-BR";
    case "fr": return "fr-FR";
    case "de": return "de-DE";
    case "it": return "it-IT";
    default:   return "en-US";
  }
};

const canUseGoogleSTT = (): boolean => {
  const MR: any = (window as any).MediaRecorder;
  if (!MR) return false;
  if (MR.isTypeSupported?.("audio/webm;codecs=opus")) return true;
  if (MR.isTypeSupported?.("audio/webm")) return true;
  return false;
};

const pickMime = () => {
  const MR: any = (window as any).MediaRecorder;
  if (!MR) return "";
  if (MR.isTypeSupported?.("audio/webm;codecs=opus")) return "audio/webm;codecs=opus";
  if (MR.isTypeSupported?.("audio/webm")) return "audio/webm";
  return "";
};

/** ----------------------- Tipagem ----------------------- */

interface FlashCardsPropsRv {
  headers: MyHeadersType | null;
  onChange: any;
  change: boolean;
}

/** ----------------------- Componente ----------------------- */

const ListeningExerciseNew: React.FC<FlashCardsPropsRv> = ({ headers, onChange, change }) => {
  const { UniversalTexts } = useUserContext();
  const actualHeaders = headers || {};

  /** Estado geral */
  const [students, setStudents] = useState<any[]>([]);
  const [myPermissions, setPermissions] = useState<string>("");
  const [myId, setId] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  /** Estado do exercício */
  const [cards, setCards] = useState<any[]>([]);
  const [hasCard, setHasCard] = useState<boolean>(false);
  const [flashcardsToday, setFlashcardsToday] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStudents, setLoadingStudents] = useState<boolean>(false);
  const [readyToListen, setReadyToListen] = useState<boolean>(false);

  /** Estado de áudio/transcrição */
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [playingAudio, setPlayingAudio] = useState<boolean>(false);
  const [listening, setListening] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [finalTranscript, setFinalTranscript] = useState<string>("");
  const [seeProgress, setSeeProgress] = useState<boolean>(false);
  const [enableMic, setEnableMic] = useState<boolean>(false);

  /** Estado de avaliação */
  const [similarity, setSimilarity] = useState<number>(0);
  const [words, setWords] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [highlighted, setHighlighted] = useState<string>("");
  const [canAdvance, setCanAdvance] = useState<boolean>(false);
  const [next, setNext] = useState<boolean>(false);

  /** Refs */
  const cardTextRef = useRef<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const recognitionRef = useRef<any>(null);
  const useSRFallbackRef = useRef<boolean>(false);
  const selectedVoiceRef = useRef<string | null>(null);

  /** ----------------------- Boot / usuário / alunos ----------------------- */

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const { id, permissions } = user || {};
    setId(id);
    setSelectedStudentId(id);
    setPermissions(permissions);

    const flashcardsTodayStr = localStorage.getItem("flashcardsToday") || "0";
    setFlashcardsToday(parseFloat(flashcardsTodayStr as any));

    setTimeout(() => updateInfo(id, actualHeaders), 100);

    if (permissions === "superadmin" || permissions === "teacher") {
      fetchStudents(id);
    }
  }, [change]);

  const fetchStudents = async (userId: string) => {
    setLoadingStudents(true);
    try {
      const res = await axios.get(`${backDomain}/api/v1/students/${userId}`, { headers: actualHeaders });
      setStudents(res.data.listOfStudents || []);
    } catch (e) {
      console.error("Error fetching students:", e);
    } finally {
      setLoadingStudents(false);
    }
  };

  /** ----------------------- Buscar cards ----------------------- */

  const loadCards = async () => {
    setLoading(true);
    setLiveTranscript("");
    setFinalTranscript("");
    setSimilarity(0);
    setScore(0);
    setWords(0);
    setHighlighted("");
    setCanAdvance(false);

    try {
      const res = await axios.get(
        `${backDomain}/api/v1/flashcardslistening/${selectedStudentId || myId}`,
        { headers: actualHeaders }
      );

      const due = res.data?.dueFlashcards || [];
      setCards(due);
      const exists = !!due[0];
      setHasCard(exists);

      if (exists) {
        const lang = due[0]?.front?.language || "en";
        setSelectedLanguage(lang);
        cardTextRef.current = due[0]?.front?.text || "";
        setWords(wordCount(cardTextRef.current));

        // atualizar contagem do dia
        const todays = res.data?.flashCardsReviewsToday || 0;
        setFlashcardsToday(todays);
        localStorage.setItem("flashcardsToday", JSON.stringify(todays));
      }
      setReadyToListen(true);
      setEnableMic(true);
    } catch (e) {
      notifyAlert("Erro ao carregar cards");
    } finally {
      setLoading(false);
    }
  };

  /** ----------------------- TTS: ouvir frase ----------------------- */

  const handlePlay = () => {
    if (!hasCard) return;
    setPlayingAudio(true);
    const text = cards[0]?.front?.text || "";
    const lang = cards[0]?.front?.language || "en";
    const chosen = selectedVoiceRef.current || localStorage.getItem("chosenVoice") || "";

    // lê em voz alta; se inglês, mantém o replace original
    readText(lang === "en" ? text.replace(/\s+/g, " ") : text, false, lang, chosen);

    // habilita mic após tempo estimado
    const wordsInSentence = text.split(" ").length || 0;
    const estimated = Math.min(6000, wordsInSentence * 350);
    setTimeout(() => {
      setEnableMic(true);
      setPlayingAudio(false);
    }, estimated);
  };

  /** ----------------------- SR (fallback) ----------------------- */

  const ensureSR = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return false;
    if (!recognitionRef.current) {
      const rec = new SR();
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.continuous = true;
      rec.lang = languageToLocale(selectedLanguage);

      rec.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            // concatena no finalTranscript também, mas mantemos live
            setFinalTranscript((prev) => (prev + " " + t).trim());
          } else {
            interim += t;
          }
        }
        setLiveTranscript(((finalTranscript || "") + " " + interim).trim());
      };

      rec.onerror = (event: any) => {
        console.error("SpeechRecognition error:", event.error);
        notifyAlert(`Erro no reconhecimento de voz: ${event.error}`);
        setListening(false);
      };

      rec.onspeechend = null;
      recognitionRef.current = rec;
    } else {
      recognitionRef.current.lang = languageToLocale(selectedLanguage);
    }
    return true;
  };

  /** ----------------------- Gravação (Google-first) ----------------------- */

  const startRecording = async () => {
    if (!readyToListen || !hasCard) return;
    setCanAdvance(false);
    setSimilarity(0);
    setScore(0);
    setHighlighted("");
    setFinalTranscript("");
    setLiveTranscript("");

    // Tentamos SR para transcrição ao vivo (se disponível)
    const hasSR = ensureSR();
    useSRFallbackRef.current = !canUseGoogleSTT(); // se não tem MR com webm, dependeremos de SR

    // Google-first via MediaRecorder
    if (canUseGoogleSTT()) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mime = pickMime();
        if (!mime) {
          // sem MIME → usar somente SR
          if (hasSR) {
            useSRFallbackRef.current = true;
            recognitionRef.current?.start();
            setListening(true);
            return;
          }
          notifyAlert("Seu navegador não suporta gravação/transcrição compatível.");
          return;
        }

        const mr = new MediaRecorder(stream, { mimeType: mime });
        mediaRecorderRef.current = mr;
        audioChunksRef.current = [];

        mr.onstart = () => {
          setListening(true);
          // tenta SR em paralelo apenas se disponível; se falhar, seguimos só com MR
          if (hasSR) {
            try { recognitionRef.current?.start(); } catch {}
          }
        };

        mr.ondataavailable = (e) => {
          if (e.data?.size) audioChunksRef.current.push(e.data);
        };

        mr.onerror = (e) => {
          console.error("[MediaRecorder] error:", e);
          notifyAlert("Erro na gravação de áudio");
          setListening(false);
        };

        mr.onstop = async () => {
          // se já temos transcrição via SR, usamos ela; caso contrário, manda pro backend
          const srText = (finalTranscript || liveTranscript || "").trim();

          if (srText.length >= 1) {
            setFinalTranscript(srText);
            setListening(false);
            // nada a enviar — usuário apertará "Checar"
            return;
          }

          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const formData = new FormData();
          formData.append("audio", blob, "audio.webm");
          formData.append("language", languageToLocale(selectedLanguage));
          formData.append("contentType", mime);

          setSeeProgress(true);
          try {
            const { data } = await axios.post(`${backDomain}/api/v1/speech-listening`, formData);
            const t = (data?.transcript || "").trim();
            setFinalTranscript(t);
          } catch (err: any) {
            console.error("[Transcription] error:", err?.response?.data || err);
            notifyAlert(
              `Erro ao transcrever áudio: ${
                err?.response?.data?.message || err.message || "verifique o backend"
              }`
            );
          } finally {
            setSeeProgress(false);
            setListening(false);
          }
        };

        mr.start();
      } catch (err) {
        console.error("[getUserMedia] error:", err);
        notifyAlert("Permissão do microfone negada ou indisponível.");
      }
      return;
    }

    // Sem Google (MR) → usar somente SR
    if (hasSR) {
      recognitionRef.current?.start();
      setListening(true);
    } else {
      notifyAlert("Seu navegador não suporta gravação/transcrição compatível.");
    }
  };

  const stopRecording = () => {
    // para SR
    try { recognitionRef.current && recognitionRef.current.stop(); } catch {}
    // para MR
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setListening(false);
  };

  /** ----------------------- Checar (pontuação local) ----------------------- */

  const handleCheck = () => {
    const raw = cardTextRef.current || "";
    if (!raw) return;

    const candidate = (finalTranscript || liveTranscript || "").trim();
    if (!candidate) {
      notifyAlert("Nenhum áudio capturado. Grave e tente novamente.");
      return;
    }

    const wc = wordCount(raw);
    const sim = similarityPercentage(candidate, raw);
    const hl = highlightDifferences(raw, candidate, sim);

    setWords(wc);
    setSimilarity(sim);
    setHighlighted(hl);

    if (candidate === normalizeText(raw) || sim >= 98) {
      setScore(wc * 3);
    } else if (sim >= 40) {
      setScore(wc * 2);
    } else {
      setScore(0);
    }

    setCanAdvance(true);
  };

  /** ----------------------- Avançar (salvar no backend) ----------------------- */

  const handleAdvance = async () => {
    if (!canAdvance || !cards[0]?._id) return;

    setNext(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/reviewflashcardlistening/${selectedStudentId || myId}`,
        {
          flashcardId: cards[0]?._id,
          score,
          percentage: similarity,
          transcript: (finalTranscript || liveTranscript || "").trim(),
          dayToday: new Date(),
        },
        { headers: actualHeaders }
      );

      setNext(false);
      // reseta UI e carrega próximo card
      setFinalTranscript("");
      setLiveTranscript("");
      setSimilarity(0);
      setScore(0);
      setWords(0);
      setHighlighted("");
      setCanAdvance(false);

      // refresh contadores e próximo card
      onChange?.((prev: any) => !prev);
      setTimeout(() => updateInfo(myId, actualHeaders), 100);
      loadCards();
    } catch (error) {
      notifyAlert("Erro ao enviar resultados");
      onLoggOut();
      setNext(false);
    }
  };

  /** ----------------------- UI auxiliares ----------------------- */

  const [changeNumber, setChangeNumber] = useState<boolean>(true);
  useEffect(() => {
    selectedVoiceRef.current = localStorage.getItem("chosenVoice");
  }, [changeNumber]);

  /** ----------------------- Render ----------------------- */

  return (
    <section id="listening-exercise" style={{ maxWidth: 480, margin: "0 auto" }}>
      {/* Cabeçalho / Voz / Seleção de aluno */}
      <div style={{ display: "grid", justifyItems: "center", gap: 10, marginBottom: 10 }}>
        <Voice changeB={changeNumber} setChangeB={setChangeNumber} maxW="400px" chosenLanguage={selectedLanguage} />
        {(myPermissions === "superadmin" || myPermissions === "teacher") && (
          <div>
            {loadingStudents ? (
              <CircularProgress size={20} style={{ color: partnerColor() }} />
            ) : (
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                style={{
                  borderRadius: 6, border: "1px solid #e2e8f0",
                  backgroundColor: "#f8fafc", fontSize: 13, color: "#64748b",
                  padding: "6px 8px", minWidth: 220
                }}
              >
                <option value="">{UniversalTexts?.selectAStudent || "Selecione um aluno..."}</option>
                {students.map((s) => (
                  <option key={s.id || s.theId} value={s.id || s.theId}>
                    {s.name} {s.lastname}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Botão START / RECARREGAR */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <button onClick={loadCards} style={{ padding: "8px 14px" }}>
          {hasCard ? <i className="fa fa-refresh" /> : "Start"}
        </button>
      </div>

      {/* Corpo */}
      {loading ? (
        <div style={{ display: "grid", justifyItems: "center" }}>
          <CircularProgress style={{ color: partnerColor() }} />
        </div>
      ) : hasCard ? (
        <div
          style={{
            display: "grid",
            gap: 12,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: 16,
          }}
        >
          {/* Frase e back */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
            <p style={{ fontSize: "1rem", margin: 0 }}>{cards[0]?.front?.text}</p>
            <p style={{ fontFamily: textGeneralFont(), fontSize: 12, color: "#6b7280", marginTop: 6 }}>
              {cards[0]?.back?.text}
            </p>
          </div>

          {/* Controles principais */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button
              onClick={handlePlay}
              disabled={playingAudio}
              style={{ padding: "10px 12px" }}
              title="Ouvir frase"
            >
              {playingAudio ? "Tocando..." : "▶ Ouvir"}
            </button>

            <button
              onClick={() => (listening ? stopRecording() : startRecording())}
              disabled={!readyToListen}
              style={{ padding: "10px 12px" }}
              title="Gravar / Parar"
            >
              {listening ? "■ Parar" : "🎙️ Gravar"}
            </button>
          </div>

          {/* Live transcript / status */}
          <div
            style={{
              border: "1px dashed #d1d5db",
              borderRadius: 8,
              padding: 10,
              background: "#f9fafb",
              minHeight: 56,
            }}
          >
            <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
              {listening
                ? (useSRFallbackRef.current ? "Transcrição ao vivo:" : "Gravando… (sem transcrição ao vivo)")
                : (finalTranscript || liveTranscript ? "Transcrição:" : "Transcrição aparecerá aqui")}
            </p>
            <div style={{ marginTop: 6, fontSize: 14, color: "#111827", wordBreak: "break-word" }}>
              {(useSRFallbackRef.current ? liveTranscript : finalTranscript) ||
                (!useSRFallbackRef.current ? liveTranscript : "")}
            </div>
          </div>

          {/* Ações de avaliação */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button onClick={handleCheck} disabled={listening || seeProgress} style={{ padding: "10px 12px" }}>
              ✅ Checar
            </button>
            <button onClick={handleAdvance} disabled={!canAdvance || next} style={{ padding: "10px 12px" }}>
              ⏭ Avançar
            </button>
          </div>

          {/* Resultado */}
          {seeProgress ? (
            <div style={{ display: "grid", justifyItems: "center" }}>
              <CircularProgress style={{ color: partnerColor() }} />
            </div>
          ) : canAdvance ? (
            <div style={{ display: "grid", gap: 8 }}>
              <p
                style={{
                  padding: 10,
                  borderRadius: 8,
                  backgroundColor:
                    similarity === 100 ? "#16a34a" : similarity > 98 ? "#2563eb" : similarity > 40 ? "#fde047" : "#ef4444",
                  color: similarity > 40 ? (similarity > 98 ? "white" : "black") : "white",
                }}
              >
                {similarity}% correto {similarity < 40 && <span>(mínimo 40% para pontuar)</span>}
              </p>

              <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, background: "#fff" }}>
                <p style={{ color: "grey", fontSize: 12, fontStyle: "italic", marginTop: 0 }}>Sua resposta:</p>
                <div dangerouslySetInnerHTML={{ __html: highlighted }} />
              </div>

              <div style={{ display: "flex", gap: 16, fontSize: 14 }}>
                <span>Palavras: <b>{words}</b></span>
                <span>Pontos: <b>{score}</b></span>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>No flashcards</p>
      )}

      <div style={{ marginTop: 16 }}>
        <ProgressCounter flashcardsToday={flashcardsToday} />
      </div>
    </section>
  );
};

export default ListeningExerciseNew;
