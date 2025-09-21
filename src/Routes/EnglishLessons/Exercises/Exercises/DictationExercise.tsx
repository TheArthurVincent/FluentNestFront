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

function cleanString(str: string): string {
  return (str || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();
}

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

/* ====== COMPONENTE ====== */
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
  const [rate, setRate] = useState<0.8 | 1 | 1.1>(0.95 as any); // suavemente lento/normal/rápido (usando 0.95 como “normalzinho”)

  const current = pool[index];
  const target = current?.english || ""; // ditado em INGLÊS

  useEffect(() => {
    return () => {
      if (hasTTS()) window.speechSynthesis.cancel();
    };
  }, []);

  function speak(text: string) {
    if (!hasTTS() || !text) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = rate; // usa o seletor
      u.pitch = 1;
      u.lang = "en-US";
      window.speechSynthesis.speak(u);
    } catch {
      /* noop */
    }
  }

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
    <Card className="relative overflow-hidden">
      {/* Top gradient decorativo */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-black/5 to-black/0 blur-2xl" />
      <HeaderBar
        title={labels.dictationTitle}
        right={
          <Pill>
            {index + 1} {labels.of} {pool.length}
          </Pill>
        }
      />

      {/* Progresso linear */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-2 bg-black transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Controles de áudio + seed */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={() => {
            readText(target, true, "en", selectedVoice);
          }}
          disabled={!target}
          className={`px-4 py-2 rounded-xl ${
            target
              ? "bg-black text-white hover:opacity-90"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          aria-label={labels.play}
          title={target ? "Ouvir" : "Sem texto em inglês para ouvir"}
        >
          🔊 {labels.play}
        </button>
      </div>
      <label className="block text-sm font-medium mb-2">
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
        className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-black/15"
        placeholder="Digite exatamente o que ouviu…"
      />
      <div className="mt-1 text-xs text-gray-500">
        Dica: pressione{" "}
        <kbd className="px-1 py-0.5 rounded border bg-gray-50">Ctrl</kbd> +{" "}
        <kbd className="px-1 py-0.5 rounded border bg-gray-50">Enter</kbd> para
        conferir.
      </div>

      {/* Ações */}
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <button
          onClick={() => setChecked(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:opacity-95"
        >
          ✅ {labels.check}
        </button>

        {/* Mostrar gabarito SÓ depois do check */}
        {checked && (
          <button
            onClick={() => setShowKey((s) => !s)}
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
          >
            {showKey ? "🙈 Ocultar gabarito" : "👀 Mostrar gabarito"}
          </button>
        )}
      </div>

      {/* Resultados */}
      {checked && (
        <div className="mt-5 rounded-2xl border border-gray-200 p-4 bg-gray-50">
          <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border">
              🧮 Palavras:{" "}
              <strong>
                {wordsTyped}/{wordsExpected}
              </strong>
            </span>
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border">
              🎯 Corretas por posição:{" "}
              <strong>
                {matches}/{total}
              </strong>
            </span>
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border">
              📊 Similaridade (Levenshtein): <strong>{similarity}%</strong>
            </span>
          </div>

          {/* Barras de progresso */}
          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <div>
              <div className="mb-1 text-gray-600">Palavras Digitadas</div>
              <div className="h-2 rounded-full bg-white border overflow-hidden">
                <div
                  className="h-2 bg-black"
                  style={{
                    width: `${Math.min(
                      100,
                      (wordsTyped / Math.max(1, wordsExpected)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 text-gray-600">Corretas por Posição</div>
              <div className="h-2 rounded-full bg-white border overflow-hidden">
                <div
                  className="h-2 bg-emerald-600"
                  style={{ width: `${total ? (matches / total) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 text-gray-600">Similaridade</div>
              <div className="h-2 rounded-full bg-white border overflow-hidden">
                <div
                  className="h-2 bg-indigo-600"
                  style={{ width: `${similarity}%` }}
                />
              </div>
            </div>
          </div>

          {/* Destaque por posição */}
          <div className="mt-4 grid gap-2">
            <div className="text-xs text-gray-500">
              Sua resposta (por posição):
            </div>
            <div className="flex flex-wrap gap-2">
              {atTokens.map((w, i) => (
                <span
                  key={`at-${i}-${w}-${index}`}
                  className={`px-2 py-1 rounded-lg border ${
                    perWordCorrect[i]
                      ? "bg-emerald-100 border-emerald-300"
                      : "bg-rose-100 border-rose-300"
                  }`}
                >
                  {w}
                </span>
              ))}
            </div>

            <div className="text-xs text-gray-500 mt-3">
              Gabarito (por posição):
            </div>
            <div className="flex flex-wrap gap-2">
              {gtTokens.map((w, i) => (
                <span
                  key={`gt-${i}-${w}-${index}`}
                  className={`px-2 py-1 rounded-lg border ${
                    perWordCorrect[i]
                      ? "bg-emerald-100 border-emerald-300"
                      : "bg-gray-100 border-gray-300"
                  }`}
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
        <div className="mt-4 p-3 rounded-xl bg-yellow-50 border border-yellow-200 text-sm">
          <strong>Gabarito:</strong> {target}
          {current.portuguese && (
            <div className="text-gray-600 mt-1">{current.portuguese}</div>
          )}
        </div>
      )}

      {/* Navegação básica */}
      <div className="mt-6 flex justify-end items-center">
        {index < pool.length - 1 ? (
          <button
            onClick={() => {
              setIndex((i) => i + 1);
              setAnswer("");
              setChecked(false);
              setShowKey(false);
              if (hasTTS()) window.speechSynthesis.cancel();
            }}
            className="px-4 py-2 rounded-xl bg-black text-white"
          >
            {defaultLabels.next} ▶︎
          </button>
        ) : (
          <span className="text-sm text-emerald-700">
            {defaultLabels.continue}
          </span>
        )}
      </div>
    </Card>
  );
}
