import { partnerColor } from "../../../../Styles/Styles";
import { notifyAlert, readText } from "../../Assets/Functions/FunctionLessons";
import { Card, defaultLabels, HeaderBar, shuffle } from "../Exercises";
import React, { useEffect, useMemo, useState } from "react";

function wordCount(str: string): number {
  return normalizeText(str).split(" ").filter(Boolean).length;
}

// mantém NÚMEROS; trata hífens, vírgula decimal e milhar;
const normalizeText = (text: string): string => {
  let t = (text || "").toLowerCase().normalize("NFKC");
  t = t
    .replace(/(?<=\d),(?=\d)/g, ".")
    .replace(/(?<=\d)[.\u202F\u00A0 ](?=\d{3}\b)/g, "")
    .replace(/(?<=\d)[\-–—](?=\d)/g, " ");
  // mantém letras ASCII + acentuadas comuns e dígitos
  t = t.replace(/[^0-9a-záàâãäéèêíïîóôõöúüûçñ\s]/gi, " ");
  return t.replace(/\s+/g, " ").trim();
};

function levenshteinDistance(str1: string, str2: string): number {
  const s1 = str1 || "";
  const s2 = str2 || "";
  const len1 = s1.length;
  const len2 = s2.length;
  const dp = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) dp[i][0] = i;
  for (let j = 0; j <= len2; j++) dp[0][j] = j;

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
      }
    }
  }
  return dp[len1][len2];
}

function similarityPercentage(str1: string, str2: string): number {
  const clean1 = normalizeText(str1 || "");
  const clean2 = normalizeText(str2 || "");
  const maxLen = Math.max(clean1.length, clean2.length);
  if (maxLen === 0) return 100;
  const distance = levenshteinDistance(clean1, clean2);
  return Math.round(((maxLen - distance) / maxLen) * 100);
}

function tokenize(t: string) {
  const norm = normalizeText(t);
  return norm ? norm.split(" ") : [];
}

function countPositionMatches(target: string, attempt: string) {
  const gt = tokenize(target);
  const at = tokenize(attempt);
  const len = Math.max(gt.length, at.length);
  let matches = 0;
  const perWordCorrect: boolean[] = [];
  for (let i = 0; i < len; i++) {
    const ok = !!gt[i] && !!at[i] && gt[i] === at[i];
    perWordCorrect.push(ok);
    if (ok) matches++;
  }
  return {
    matches,
    total: gt.length,
    perWordCorrect,
    gtTokens: gt,
    atTokens: at,
  };
}

type SentenceItem = { portuguese: string; english?: string };

function hasTTS(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    !!window.speechSynthesis
  );
}

export function DictationExercise({
  sentences,
  itemsCount,
  exerciseScore,
  labels,
  studentId,
  selectedVoice,
  language,
}: {
  sentences: SentenceItem[];
  itemsCount: number;
  studentId?: string;
  labels: typeof defaultLabels;
  exerciseScore?: any;
  selectedVoice?: string;
  language?: string;
}) {
  const pool = useMemo(
    () => shuffle(sentences).slice(0, Math.min(itemsCount, sentences.length)),
    [sentences, itemsCount]
  );

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const current = pool[index];
  const target = current?.english || ""; // ditado em INGLÊS

  useEffect(() => {
    return () => {
      if (hasTTS()) window.speechSynthesis.cancel();
    };
  }, []);

  if (!pool.length || !target) {
    return (
      <Card>
        <HeaderBar title={labels.dictationTitle} />
        <div className="text-sm text-gray-500">{labels.loadingSentences}</div>
      </Card>
    );
  }

  // métricas
  const wordsExpected = wordCount(target);
  const wordsTyped = wordCount(answer);
  const similarity = similarityPercentage(target, answer);
  //arredondar para baixo para nota de 0 a 10 * numero de palavras
  const roundedSimilarity =
    similarity >= 50 ? Math.floor(similarity / 20) * wordsExpected : 0;
  const { matches, total, perWordCorrect, gtTokens, atTokens } =
    countPositionMatches(target, answer);

  const progressPct = Math.round((index / pool.length) * 100);

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          top: -40,
          right: -40,
          width: 160,
          height: 160,
        }}
      />
      <HeaderBar
        title={labels.dictationTitle}
        right={
          <span>
            {index + 1} {labels.of} {pool.length}
          </span>
        }
      />
      <div
        style={{
          width: "100%",
          height: 8,
          background: "#F2F4F7",
          borderRadius: 999,
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            height: 8,
            width: `${progressPct}%`,
            background: "#111827",
            transition: "width 240ms ease",
          }}
        />
      </div>
      {!checked && (
        <>
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              color: "#111827",
              marginBottom: 8,
            }}
          >
            {labels.yourAnswer}:
          </label>
          <button
            style={{ marginBottom: 8, marginRight: 8 }}
            onClick={() => {
              readText(target, true, language, selectedVoice);
            }}
            disabled={!target || !hasTTS()}
            aria-label={labels.play}
            title={target ? "Ouvir" : "Sem texto em inglês para ouvir"}
          >
            🔊 Ouvir
          </button>
          <textarea
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setChecked(false);
              setShowKey(false);
            }}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                setChecked(true);
                return;
              }
              const isPasteCombo =
                ((e.ctrlKey || e.metaKey) &&
                  (e.key === "v" || e.key === "V")) ||
                (e.shiftKey && e.key === "Insert");
              if (isPasteCombo) {
                e.preventDefault();
                notifyAlert(
                  "Colar texto não é permitido aqui.",
                  partnerColor()
                );
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
            }}
            onContextMenu={(e) => {
              e.preventDefault();
            }}
            rows={4}
            placeholder="Digite exatamente o que ouviu…"
            style={{
              width: "100%",
              borderRadius: 6,
              border: "1px solid #D1D5DB",
              padding: 12,
              outline: "none",
              boxSizing: "border-box",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 12,
              marginTop: 16,
            }}
          >
            <button onClick={() => setChecked(true)}>✅ Conferir</button>
          </div>
        </>
      )}
      {checked && (
        <div
          style={{
            marginTop: 20,
            borderRadius: 6,
            border: "1px solid #E5E7EB",
            padding: 16,
            background: "#F9FAFB",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 999,
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
              }}
            >
              🧮 Palavras:{" "}
              <strong>
                {wordsTyped}/{wordsExpected}
              </strong>
            </span>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 999,
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
              }}
            >
              🎯 Corretas por posição:{" "}
              <strong>
                {matches}/{total}
              </strong>
            </span>

            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 999,
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
              }}
            >
              📊 Similaridade: <strong>{similarity}%</strong>
            </span>
            <span>🏆 Sua nota:{roundedSimilarity}</span>
          </div>

          <div style={{ marginTop: 16, display: "grid", gap: 8 }}>
            <div style={{ fontSize: 12, color: "#6B7280" }}>Sua resposta</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {atTokens.map((w, i) => (
                <span
                  key={`at-${i}-${w}-${index}`}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: `1px solid ${
                      perWordCorrect[i] ? "#A7F3D0" : "#FCA5A5"
                    }`,
                    background: perWordCorrect[i] ? "#D1FAE5" : "#FEE2E2",
                  }}
                >
                  {w}
                </span>
              ))}
            </div>

            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 12 }}>
              Gabarito (por posição):
            </div>
            <button
              style={{ marginBottom: 8, marginRight: 8 }}
              onClick={() => {
                readText(target, true, language, selectedVoice);
              }}
              disabled={!target || !hasTTS()}
              aria-label={labels.play}
              title={target ? "Ouvir" : "Sem texto em inglês para ouvir"}
            >
              🔊 Ouvir
            </button>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {gtTokens.map((w, i) => (
                <span
                  key={`gt-${i}-${w}-${index}`}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: `1px solid ${
                      perWordCorrect[i] ? "#A7F3D0" : "#E5E7EB"
                    }`,
                    background: perWordCorrect[i] ? "#D1FAE5" : "#F3F4F6",
                  }}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gabarito literal (só após check) */}
      {checked && showKey && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 6,
            background: "#FFFBEB",
            border: "1px solid #FDE68A",
            fontSize: 14,
            color: "#1F2937",
          }}
        >
          <strong>Gabarito:</strong> {target}
          {current.portuguese && (
            <div style={{ color: "#6B7280", marginTop: 6 }}>
              {current.portuguese}
            </div>
          )}
        </div>
      )}
      <div
        style={{
          marginTop: 24,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {index < pool.length - 1 ? (
          <>
            {" "}
            {checked && (
              <button
                onClick={() => {
                  exerciseScore(
                    roundedSimilarity,
                    `Ditado: ${target} / Resposta: ${answer}`
                  );
                  setIndex((i) => i + 1);
                  setAnswer("");
                  setChecked(false);
                  setShowKey(false);
                  if (hasTTS()) window.speechSynthesis.cancel();
                }}
              >
                {defaultLabels.next} ▶︎
              </button>
            )}
          </>
        ) : (
          <span
            style={{
              fontSize: 14,
              color: "#065F46",
              fontWeight: 600,
            }}
          >
            {defaultLabels.continue}
          </span>
        )}
      </div>
    </div>
  );
}
