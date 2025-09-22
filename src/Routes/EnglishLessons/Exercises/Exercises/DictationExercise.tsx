import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { readText } from "../../Assets/Functions/FunctionLessons";
import { Card, defaultLabels, HeaderBar, Pill, shuffle } from "../Exercises";
import React, { useEffect, useMemo, useState } from "react";

/* ===== Utils do seu app (mantidos aqui para isolamento) ===== */
function wordCount(str: string): number {
  return normalizeText(str).split(" ").filter(Boolean).length;
}

const normalizeText = (text: string): string => {
  return (text || "")
    .toLowerCase()
    .replace(/[?.,/’'#!$%-^&*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
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

/* ===== Helpers locais (tokenização baseada no seu normalizeText) ===== */
function tokenize(t: string) {
  const norm = normalizeText(t);
  return norm ? norm.split(" ") : [];
}

/** conta “palavras corretas por posição” usando sua normalização */
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
  labels,
  studentId,
  headers,
  selectedVoice,
}: {
  sentences: SentenceItem[];
  itemsCount: number;
  labels: typeof defaultLabels;
  studentId?: string;
  headers?: MyHeadersType | null;
  selectedVoice?: string;
}) {
  const [seed, setSeed] = useState(0);

  const pool = useMemo(
    () => shuffle(sentences).slice(0, Math.min(itemsCount, sentences.length)),
    [sentences, itemsCount, seed]
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
  const { matches, total, perWordCorrect, gtTokens, atTokens } =
    countPositionMatches(target, answer);

  const progressPct = Math.round(((index + 1) / pool.length) * 100);

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 20,
        background: "#ffffff",
        boxShadow: "0 8px 28px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
        padding: 20,
      }}
    >
      {/* Top gradient decorativo */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(24px)",
        }}
      />

      <HeaderBar
        title={labels.dictationTitle}
        right={
          <Pill>
            {index + 1} {labels.of} {pool.length}
          </Pill>
        }
      />

      {/* Progresso linear */}
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

      {/* Controles de áudio + seed */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <button
          onClick={() => {
            readText(target, true, "en", selectedVoice);
          }}
          disabled={!target}
          aria-label={labels.play}
          title={target ? "Ouvir" : "Sem texto em inglês para ouvir"}
          style={{
            padding: "10px 16px",
            borderRadius: 12,
            border: "1px solid transparent",
            cursor: target ? "pointer" : "not-allowed",
            opacity: target ? 1 : 0.6,
            color: target ? "#FFFFFF" : "#9CA3AF",
            background: target
              ? "linear-gradient(180deg, #111827 0%, #0B1220 100%)"
              : "#E5E7EB",
            boxShadow: target ? "0 4px 12px rgba(17,24,39,0.18)" : "none",
            fontWeight: 600,
          }}
        >
          🔊 {labels.play}
        </button>
      </div>

      <label
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 600,
          color: "#111827",
          marginBottom: 8,
        }}
      >
        {labels.yourAnswer}
      </label>

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
          }
        }}
        rows={4}
        placeholder="Digite exatamente o que ouviu…"
        style={{
          width: "100%",
          borderRadius: 14,
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
          marginTop: 6,
          fontSize: 12,
          color: "#6B7280",
        }}
      >
        Dica: pressione{" "}
        <kbd
          style={{
            padding: "2px 6px",
            borderRadius: 6,
            border: "1px solid #E5E7EB",
            background: "#F9FAFB",
          }}
        >
          Ctrl
        </kbd>{" "}
        +{" "}
        <kbd
          style={{
            padding: "2px 6px",
            borderRadius: 6,
            border: "1px solid #E5E7EB",
            background: "#F9FAFB",
          }}
        >
          Enter
        </kbd>{" "}
        para conferir.
      </div>

      {/* Ações */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 12,
          marginTop: 16,
        }}
      >
        <button
          onClick={() => setChecked(true)}
          style={{
            padding: "10px 16px",
            borderRadius: 12,
            color: "#FFFFFF",
            background: "linear-gradient(180deg, #059669 0%, #047857 100%)",
            border: "1px solid #047857",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(4,120,87,0.25)",
          }}
        >
          ✅ {labels.check}
        </button>
      </div>

      {/* Resultados */}
      {checked && (
        <div
          style={{
            marginTop: 20,
            borderRadius: 16,
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
              📊 Similaridade (Levenshtein): <strong>{similarity}%</strong>
            </span>
          </div>

          {/* Barras de progresso */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 12,
              fontSize: 12,
            }}
          >
            <div>
              <div style={{ marginBottom: 6, color: "#6B7280" }}>
                Palavras Digitadas
              </div>
              <div
                style={{
                  height: 8,
                  borderRadius: 999,
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: 8,
                    width: `${Math.min(
                      100,
                      (wordsTyped / Math.max(1, wordsExpected)) * 100
                    )}%`,
                    background: "#111827",
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ marginBottom: 6, color: "#6B7280" }}>
                Corretas por Posição
              </div>
              <div
                style={{
                  height: 8,
                  borderRadius: 999,
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: 8,
                    width: `${total ? (matches / total) * 100 : 0}%`,
                    background: "#059669",
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ marginBottom: 6, color: "#6B7280" }}>
                Similaridade
              </div>
              <div
                style={{
                  height: 8,
                  borderRadius: 999,
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: 8,
                    width: `${similarity}%`,
                    background: "#4F46E5",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Destaque por posição */}
          <div style={{ marginTop: 16, display: "grid", gap: 8 }}>
            <div style={{ fontSize: 12, color: "#6B7280" }}>
              Sua resposta (por posição):
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {atTokens.map((w, i) => (
                <span
                  key={`at-${i}-${w}-${index}`}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 10,
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

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {gtTokens.map((w, i) => (
                <span
                  key={`gt-${i}-${w}-${index}`}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 10,
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
            borderRadius: 12,
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

      {/* Navegação básica */}
      <div
        style={{
          marginTop: 24,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {index < pool.length - 1 ? (
          <button
            onClick={() => {
              setIndex((i) => i + 1);
              setAnswer("");
              setChecked(false);
              setShowKey(false);
              if (hasTTS()) window.speechSynthesis.cancel();
            }}
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              color: "#FFFFFF",
              background: "linear-gradient(180deg, #111827 0%, #0B1220 100%)",
              border: "1px solid #0B1220",
              cursor: "pointer",
              boxShadow: "0 6px 16px rgba(17,24,39,0.25)",
              fontWeight: 700,
            }}
          >
            {defaultLabels.next} ▶︎
          </button>
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
