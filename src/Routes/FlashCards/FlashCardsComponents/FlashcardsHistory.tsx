import React, { useEffect, useState } from "react";
import axios from "axios";
import { backDomain } from "../../../Resources/UniversalComponents";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import { CircularProgress } from "@mui/material";
import { HOne } from "../../../Resources/Components/RouteBox";
import { partnerColor, textTitleFont } from "../../../Styles/Styles";

interface FlashcardItem {
  _id: string;
  description: string;
  score: number;
  date: string;
}

interface GroupedHistory {
  items: FlashcardItem[];
  totalScore: number;
}

const FlashcardsHistory = ({
  headers,
  selectedStudentId,
}: {
  headers: MyHeadersType | null;
  selectedStudentId: string;
}) => {
  const [flashcardHistory, setFlashcardHistory] = useState<FlashcardItem[]>([]);
  const [expandedFlashcardsDays, setExpandedFlashcardsDays] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState<boolean>(false);
  const [days, setDays] = useState<number>(3);
  const actualHeaders = headers || {};

  const getNewCards = async (id?: string, days?: number) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${backDomain}/api/v1/flashcardscore/${id}`,
        { dayToday: new Date() },
        {
          params: { days },
          headers: actualHeaders,
        }
      );
      setFlashcardHistory(
        Array.isArray(response.data.flashcardReviewHistory)
          ? response.data.flashcardReviewHistory
          : []
      );
      setLoading(false);
    } catch (error) {
      console.log("Erro ao obter cards", error);
      setFlashcardHistory([]);
      setLoading(false);
    }
    setLoading(false);
  };

  const toggleFlashcardDay = (date: string) => {
    setExpandedFlashcardsDays((prevState) => ({
      ...prevState,
      [date]: !prevState[date],
    }));
  };

  const groupByDay2 = (data: FlashcardItem[]) => {
    if (!Array.isArray(data)) return {};
    return data.reduce((acc, curr) => {
      const date = new Date(curr.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { items: [], totalScore: 0 };
      }
      acc[date].items.push(curr);
      acc[date].totalScore += curr.score;
      return acc;
    }, {} as Record<string, GroupedHistory>);
  };

  useEffect(() => {
    if (selectedStudentId) {
      getNewCards(selectedStudentId, days);
    }
  }, [selectedStudentId, days]);

  const groupedHistory = groupByDay2(flashcardHistory);

  return (
    <div
      className="flashcard-history-upper"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "1rem 0.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "1rem",
          gap: "0.5rem",
        }}
      >
        <select
          value={days}
          onChange={(e) => {
            setDays(parseInt(e.target.value));
            getNewCards(selectedStudentId, parseInt(e.target.value));
          }}
          style={{
            borderRadius: "4px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            fontSize: "11px",
            fontWeight: "400",
            color: "#64748b",
            padding: "4px 6px",
            height: "28px",
            minWidth: "120px",
            maxWidth: "200px",
            outline: "none",
            cursor: "pointer",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = partnerColor())}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
        >
          <option value={3}>Últimos 3 dias</option>
          <option value={10}>Últimos 10 dias</option>
          <option value={15}>Últimos 15 dias</option>
          <option value={30}>Últimos 30 dias</option>
          <option value={2000}>Tudo</option>
        </select>
      </div>

      <HOne>Flashcard Reviews</HOne>
      {flashcardHistory.length > 0 ? (
        <div
          className="flashcard-history-list"
          style={{
            width: "100%",
            maxWidth: "500px",
          }}
        >
          {loading ? (
            <CircularProgress style={{ color: partnerColor() }} />
          ) : (
            <>
              {Object.entries(groupedHistory).map(([date, group]) => (
                <div
                  key={date}
                  className="flashcard-day"
                  style={{
                    marginBottom: "0.75rem",
                    borderRadius: "6px",
                    overflow: "hidden",
                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.06)",
                    border: "1px solid #f1f5f9",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <h2
                    className="flashcard-date"
                    onClick={() => toggleFlashcardDay(date)}
                    style={{
                      margin: 0,
                      padding: "0.75rem 1rem",
                      backgroundColor: expandedFlashcardsDays[date]
                        ? partnerColor()
                        : "#f8fafc",
                      color: expandedFlashcardsDays[date]
                        ? "#ffffff"
                        : "#374151",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                      borderBottom: expandedFlashcardsDays[date]
                        ? "none"
                        : "1px solid #e2e8f0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) => {
                      if (!expandedFlashcardsDays[date]) {
                        e.currentTarget.style.backgroundColor = "#f1f5f9";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!expandedFlashcardsDays[date]) {
                        e.currentTarget.style.backgroundColor = "#f8fafc";
                      }
                    }}
                  >
                    <span>📅 {date}</span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "500",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        backgroundColor: expandedFlashcardsDays[date]
                          ? "rgba(255,255,255,0.2)"
                          : partnerColor(),
                        color: expandedFlashcardsDays[date]
                          ? "#ffffff"
                          : "#ffffff",
                      }}
                    >
                      {group.totalScore} pts
                    </span>
                  </h2>
                  {expandedFlashcardsDays[date] && (
                    <div
                      className="flashcard-items"
                      style={{
                        padding: "0.5rem 1rem 1rem",
                        backgroundColor: "#fafbfc",
                      }}
                    >
                      {group.items.map((item) => (
                        <div
                          key={item._id}
                          className="flashcard-item"
                          style={{
                            padding: "0.5rem",
                            marginBottom: "0.5rem",
                            backgroundColor: "#ffffff",
                            borderRadius: "6px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
                            transition:
                              "transform 0.2s ease, box-shadow 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-1px)";
                            e.currentTarget.style.boxShadow =
                              "0 2px 6px rgba(0, 0, 0, 0.08)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                              "0 1px 2px rgba(0, 0, 0, 0.04)";
                          }}
                        >
                          <p
                            style={{
                              margin: "0 0 0.25rem 0",
                              fontSize: "13px",
                              lineHeight: "1.4",
                            }}
                          >
                            <strong style={{ color: "#374151" }}>
                              📝 Description:
                            </strong>{" "}
                            <span style={{ color: "#6b7280" }}>
                              {item.description}
                            </span>
                          </p>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontSize: "12px",
                              color: "#9ca3af",
                            }}
                          >
                            <span>
                              <strong style={{ color: partnerColor() }}>
                                ⭐ Score:
                              </strong>{" "}
                              {item.score}
                            </span>
                            <span>
                              🕐{" "}
                              {new Date(item.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#666", fontSize: "14px" }}>
          No flashcard history found.
        </p>
      )}
    </div>
  );
};

export default FlashcardsHistory;
