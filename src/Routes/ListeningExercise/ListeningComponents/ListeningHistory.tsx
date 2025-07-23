import React, { useEffect, useState } from "react";
import axios from "axios";
import { backDomain, onLoggOut } from "../../../Resources/UniversalComponents";
import { HeadersProps } from "../../../Resources/types.universalInterfaces";
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

const ListeningHistory = ({ headers }: HeadersProps) => {
  const [listeningFlashcardHistory, setListeningFlashcardHistory] = useState<
    FlashcardItem[]
  >([]);

  const [expandedListeningDays, setExpandedListeningDays] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState<boolean>(true);

  const toggleListeningDay = (date: string) => {
    setExpandedListeningDays((prevState) => ({
      ...prevState,
      [date]: !prevState[date],
    }));
  };

  const actualHeaders = headers || {};
  const getNewCards = async (id?: string) => {
    try {
      const response = await axios.post(
        `${backDomain}/api/v1/flashcardscore/${id}`,
        { dayToday: new Date() },
        {
          // @ts-ignore
          headers: actualHeaders,
        }
      );

      setListeningFlashcardHistory(
        Array.isArray(response.data.listeningReviewHistory)
          ? response.data.listeningReviewHistory
          : []
      );

      setLoading(false);
    } catch (error) {
      console.log("Erro ao obter cards", error);
      setLoading(false);
      // onLoggOut();
    }
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
    const user = localStorage.getItem("loggedIn");
    const parsedUser = user ? JSON.parse(user) : null;
    const id = parsedUser?.id;
    if (id) {
      getNewCards(id);
    }
  }, []);

  if (loading) {
    return <CircularProgress style={{ color: partnerColor() }} />;
  }

  const groupedListeningHistory = groupByDay2(listeningFlashcardHistory);

  return (
    <div className="flashcard-history-upper">
      <div>
        <HOne
          style={{
            fontFamily: textTitleFont(),
            color: partnerColor(),
          }}
        >
          Listening Exercises
        </HOne>
        {listeningFlashcardHistory.length > 0 ? (
          <div className="flashcard-history-list">
            {Object.entries(groupedListeningHistory).map(([date, group]) => (
              <div key={date} className="flashcard-day">
                <h2
                  className="flashcard-date"
                  onClick={() => toggleListeningDay(date)}
                >
                  {date} - Total Points: {group.totalScore.toFixed()}
                </h2>
                {expandedListeningDays[date] && (
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
          <p>No listening flashcard history found.</p>
        )}
      </div>
    </div>
  );
};

export default ListeningHistory;
