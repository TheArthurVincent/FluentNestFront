import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  backDomain,
  abreviateName,
  updateScore,
} from "../../../Resources/UniversalComponents";
import { HeadersProps } from "../../../Resources/types.universalInterfaces";
import { notifyAlert } from "../../EnglishLessons/Assets/Functions/FunctionLessons";
import { levels } from "./RankingLevelsList";

const FONT =
  "Plus Jakarta Sans, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

function getMonthsSince(
  startYear: number,
  startMonth: number,
): { label: string; value: string }[] {
  const months = [];
  const now = new Date();
  const endYear = now.getFullYear();
  const endMonth = now.getMonth() + 1;
  for (let y = endYear; y >= startYear; y--) {
    const mStart = y === startYear ? startMonth : 1;
    const mEnd = y === endYear ? endMonth : 12;
    for (let m = mEnd; m >= mStart; m--) {
      const value = `${y}-${String(m).padStart(2, "0")}`;
      const d = new Date(y, m - 1, 1);
      const label = d.toLocaleString("pt-BR", {
        month: "long",
        year: "numeric",
      });
      months.push({
        value,
        label: label.charAt(0).toUpperCase() + label.slice(1),
      });
    }
  }
  return months;
}

interface StudentLive {
  _id: string;
  name: string;
  lastname: string;
  picture: string;
  monthlyScore: number;
  totalScore: number;
  flashcards25Reviews: number;
  homeworkAssignmentsDone: number;
}

export default function AllHistory({ headers }: HeadersProps) {
  const monthOptions = getMonthsSince(2026, 3);
  const actualHeaders = headers || {};
  const theItems = levels();

  const getCurrentMonthValue = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };

  const getInitialMonth = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("month") || monthOptions[0].value;
  };

  const [selectedMonth, setSelectedMonth] = useState<string>(getInitialMonth);
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Paginação (apenas modo ao vivo)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const isLiveMode = selectedMonth === getCurrentMonthValue();

  // ─── Busca ao vivo (paginada) ───────────────────────────────────────────────
  const fetchLive = async (currentPage: number, replace = false) => {
    if (!hasMore && !replace) return;
    currentPage === 1 ? setLoading(true) : setLoadingMore(true);
    const { teacherID } = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/scoresranking/${teacherID}?page=${currentPage}`,
        { headers: actualHeaders },
      );
      const incoming = response.data.listOfStudents || [];
      setRanking((prev) => (replace ? incoming : [...prev, ...incoming]));
      setHasMore(response.data.hasMore);
      setPage(currentPage + 1);
    } catch {
      notifyAlert("Erro ao buscar ranking ao vivo");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setIsFirst(false);
    }
  };

  // ─── Busca histórico ────────────────────────────────────────────────────────
  const fetchHistory = async (month: string) => {
    setLoading(true);
    const { teacherID } = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    try {
      const response = await axios.get(`${backDomain}/api/v1/history-ranking`, {
        headers: actualHeaders,
        params: { teacherID, month },
      });
      setRanking(response.data.history?.ranking || []);
    } catch {
      notifyAlert("Erro ao buscar ranking");
      setRanking([]);
    } finally {
      setLoading(false);
    }
  };

  // ─── Infinite scroll ref ────────────────────────────────────────────────────
  const lastRef = useCallback(
    (node: any) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && isLiveMode) {
          fetchLive(page);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore, page, isLiveMode],
  );

  // ─── Troca de mês ───────────────────────────────────────────────────────────
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = e.target.value;
    setSelectedMonth(month);
    const params = new URLSearchParams(window.location.search);
    params.set("month", month);
    window.history.pushState({}, "", `?${params.toString()}`);

    setRanking([]);
    setPage(1);
    setHasMore(true);

    if (month === getCurrentMonthValue()) {
      fetchLive(1, true);
    } else {
      fetchHistory(month);
    }
  };

  useEffect(() => {
    if (isLiveMode) {
      fetchLive(1, true);
    } else {
      fetchHistory(selectedMonth);
    }
  }, []);

  const selectedLabel =
    monthOptions.find((m) => m.value === selectedMonth)?.label || "";
  const medalEmoji = (i: number) =>
    i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;

  return (
    <div style={{ fontFamily: FONT, padding: "6px", boxSizing: "border-box" }}>
      {/* Header */}
      <div style={s.headerCard}>
        <div>
          <div style={s.headerLabel}>
            {isLiveMode ? "Ao vivo" : "Histórico"}
          </div>
          <div style={s.headerTitle}>Ranking Mensal</div>
        </div>
        <select
          style={s.select}
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {monthOptions.map((m, i) => (
            <option key={m.value} value={m.value}>
              {i === 0 ? `${m.label} (atual)` : m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Card */}
      <div style={s.card}>
        <div style={s.cardTitleRow}>
          <span style={s.cardTitle}>Alunos</span>
          {!loading && ranking.length > 0 && (
            <span style={s.badge}>{ranking.length}</span>
          )}
          {isLiveMode && (
            <span style={s.livePill}>
              <span style={s.liveDot} />
              ao vivo
            </span>
          )}
        </div>

        {loading && isFirst ? (
          <div style={s.center}>
            <div style={s.spinner} />
          </div>
        ) : ranking.length === 0 && !loading ? (
          <div style={s.empty}>
            <span style={{ fontSize: 32 }}>📭</span>
            <span style={s.emptyText}>Nenhum dado para {selectedLabel}</span>
          </div>
        ) : (
          <ul style={s.list}>
            {ranking.map((student: any, index: number) => {
              const isLast = index === ranking.length - 1;

              // nível apenas no modo ao vivo
              const levelIndex = isLiveMode
                ? updateScore(
                    student.totalScore,
                    student.flashcards25Reviews,
                    student.homeworkAssignmentsDone,
                  ).level - 1
                : null;
              const levelData =
                levelIndex !== null ? theItems[levelIndex] : null;

              return (
                <li
                  key={student._id || index}
                  ref={isLiveMode && isLast ? lastRef : null}
                  style={{
                    ...s.row,
                    background: levelData ? levelData.color : "#fff",
                    border: levelData
                      ? `1px solid ${levelData.backgroundcolor}22`
                      : "1px solid #f4f4f5",
                  }}
                >
                  {/* Ícone de nível (só ao vivo) */}
                  {levelData && (
                    <img
                      src={levelData.image2}
                      alt="level"
                      style={{
                        width: 28,
                        height: 28,
                        objectFit: "contain",
                        flexShrink: 0,
                      }}
                    />
                  )}

                  {/* Posição */}
                  <span style={s.position}>
                    {medalEmoji(index) || (
                      <span
                        style={{
                          fontSize: 13,
                          color: levelData ? levelData.textcolor : "#18181b",
                          // backgroundColor: "#fff",
                          padding: "4px 3px",
                          borderRadius: "50%",
                          fontWeight: 700,
                        }}
                      >
                        #{index + 1}
                      </span>
                    )}
                  </span>

                  {/* Avatar */}
                  <div style={s.avatarWrap}>
                    {student.picture ? (
                      <img
                        src={student.picture}
                        alt={student.name}
                        style={s.avatar}
                      />
                    ) : (
                      <div
                        style={{
                          ...s.avatarFallback,
                          background: levelData
                            ? levelData.backgroundcolor
                            : "#18181b",
                        }}
                      >
                        {student.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Nome */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        ...s.studentName,
                        color: levelData ? levelData.textcolor : "#18181b",
                      }}
                    >
                      {student.name} {abreviateName(student.lastname)}
                    </div>
                  </div>

                  {/* Score */}
                  <div style={s.scoreWrap}>
                    <span
                      style={{
                        ...s.scoreValue,
                        color: levelData ? levelData.textcolor : "#18181b",
                      }}
                    >
                      {student.monthlyScore}
                    </span>
                    <span style={s.scoreLabel}>pts</span>
                  </div>
                </li>
              );
            })}

            {/* Spinner de paginação */}
            {loadingMore && (
              <li style={s.center}>
                <div style={s.spinner} />
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  headerCard: {
    background: "#18181b",
    borderRadius: 8,
    padding: "10px",
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#71717a",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.3px",
  },
  select: {
    padding: "8px 12px",
    fontSize: 13,
    fontWeight: 500,
    borderRadius: 10,
    border: "1px solid #3f3f46",
    background: "#27272a",
    color: "#e4e4e7",
    cursor: "pointer",
    outline: "none",
    fontFamily: "inherit",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #f0f0f0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    padding: "18px 16px",
  },
  cardTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#18181b",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },
  badge: {
    background: "#f4f4f5",
    color: "#52525b",
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 20,
    padding: "1px 8px",
  },
  livePill: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    background: "#dcfce7",
    color: "#16a34a",
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 20,
    padding: "2px 8px",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    marginLeft: "auto",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#16a34a",
    animation: "pulse 1.5s infinite",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    padding: "32px 0",
  },
  spinner: {
    width: 28,
    height: 28,
    border: "2.5px solid #e4e4e7",
    borderTop: "2.5px solid #18181b",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    padding: "32px 0",
  },
  emptyText: { color: "#a1a1aa", fontSize: 14 },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 10px",
    borderRadius: 10,
  },
  position: {
    fontSize: 18,
    minWidth: 24,
    textAlign: "center",
    flexShrink: 0,
  },
  avatarWrap: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    overflow: "hidden",
    flexShrink: 0,
    border: "1.5px solid rgba(255,255,255,0.3)",
  },
  avatar: { width: "100%", height: "100%", objectFit: "cover" },
  avatarFallback: {
    width: "100%",
    height: "100%",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    fontWeight: 700,
  },
  studentName: {
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  scoreWrap: {
    display: "flex",
    alignItems: "baseline",
    gap: 3,
    flexShrink: 0,
  },
  scoreValue: { fontSize: 15, fontWeight: 700 },
  scoreLabel: { fontSize: 11, fontWeight: 500, color: "#a1a1aa" },
};
