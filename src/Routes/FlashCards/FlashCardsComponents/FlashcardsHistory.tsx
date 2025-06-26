import React, { useEffect, useState } from "react";
import axios from "axios";
import { backDomain, onLoggOut } from "../../../Resources/UniversalComponents";
import { HeadersProps } from "../../../Resources/types.universalInterfaces";
import { CircularProgress } from "@mui/material";
import { HOne } from "../../../Resources/Components/RouteBox";
import { secondaryColor } from "../../../Styles/Styles";

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

const FlashcardsHistory = ({ headers }: HeadersProps) => {
  const [flashcardHistory, setFlashcardHistory] = useState<FlashcardItem[]>([]);
  const [expandedFlashcardsDays, setExpandedFlashcardsDays] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState<boolean>(false);

  const toggleFlashcardDay = (date: string) => {
    setExpandedFlashcardsDays((prevState) => ({
      ...prevState,
      [date]: !prevState[date],
    }));
  };

  const [days, setDays] = useState<number>(3);
  const actualHeaders = headers || {};
  const getNewCards = async (id?: string, days?: number) => {
    setLoading(true);
    console.log(days);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/flashcardscore/${id}`,
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
      // onLoggOut();
    }
    setLoading(false);
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

  const [studentId, setStudentId] = useState<string>("");
  useEffect(() => {
    const user = localStorage.getItem("loggedIn");
    const parsedUser = user ? JSON.parse(user) : null;
    const id = parsedUser?.id;
    setStudentId(id || "");
    if (id) {
      getNewCards(id, days);
    }
  }, []);

  if (loading) {
    return <CircularProgress style={{ color: secondaryColor() }} />;
  }

  const groupedHistory = groupByDay2(flashcardHistory);

  return (
    <div className="flashcard-history-upper">
      <select
        value={days}
        onChange={(e) => {
          setDays(parseInt(e.target.value));
          getNewCards(studentId, parseInt(e.target.value));
        }}
      >
        <option value={3}>Últimos 3 dias</option>
        <option value={10}>Últimos 10 dias</option>
        <option value={15}>Últimos 15 dias</option>
        <option value={30}>Últimos 30 dias</option>
      </select>
      <HOne>Flashcard Reviews</HOne>
      {flashcardHistory.length > 0 ? (
        <div className="flashcard-history-list">
          {Object.entries(groupedHistory).map(([date, group]) => (
            <div key={date} className="flashcard-day">
              <h2
                className="flashcard-date"
                onClick={() => toggleFlashcardDay(date)}
              >
                {date} - Total Points: {group.totalScore}
              </h2>
              {expandedFlashcardsDays[date] && (
                <div className="flashcard-items">
                  {group.items.map((item) => (
                    <div key={item._id} className="flashcard-item">
                      <p>
                        <strong>Description:</strong> {item.description}
                      </p>
                      <p>
                        <strong>Score:</strong> {item.score}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(item.date).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No flashcard history found.</p>
      )}
    </div>
  );
};

export default FlashcardsHistory;
