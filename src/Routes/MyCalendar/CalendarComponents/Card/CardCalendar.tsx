import React from 'react';
import { StyledDiv } from '../MyCalendarFunctions/MyCalendar.Styled';
import CardOneEvent from '../OneEventCard/CardOneEvent';
import {
  partnerColor,
  textGeneralFont,
  alwaysWhite
} from '../../../../Styles/Styles';

interface TodoItem {
  _id: string;
  description: string;
  date: Date;
  category: string;
  [key: string]: any; // Para checkList1, checkList2, etc.
}

interface Event {
  _id: string;
  date: Date;
  time: string;
  category?: string;
  status?: string;
  duration?: number;
  groupName?: string;
  student?: string;
  description?: string;
  [key: string]: any;
}

interface CardCalendarProps {
  date: Date;
  index: number;
  isToday: boolean;
  todayRef?: React.RefObject<HTMLDivElement>;
  todoList: TodoItem[];
  events: Event[];
  onTodoClick: (todoId: string) => void;
  onEventClick: (event: Event) => void;
  headers: any;
  thePermissions: string[] | any;
  myId: string | number;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
  change: boolean;
  alternateBoolean: boolean;
  setAlternateBoolean: React.Dispatch<React.SetStateAction<boolean>>;
}

// Função utilitária para truncar strings
const truncateString = (str: string, wordLimit: number): string => {
  const words = str.split(' ');
  if (words.length <= wordLimit) return str;
  return words.slice(0, wordLimit).join(' ') + '...';
};

export function CardCalendar({
  date,
  index,
  isToday,
  todayRef,
  todoList,
  events,
  onTodoClick,
  onEventClick,
  headers,
  thePermissions,
  myId,
  setChange,
  change,
  alternateBoolean,
  setAlternateBoolean,
}: CardCalendarProps) {
  
  return (
    <StyledDiv
      className={isToday ? "glowing" : "none"}
      ref={isToday ? todayRef : null}
      style={{
        fontSize: "10px",
        border: isToday
          ? `3px solid ${partnerColor()}`
          : "1px solid #e0e0e0",
        borderRadius: "4px",
        backgroundColor: isToday ? "rgba(0,0,0,0.02)" : "white",
        boxShadow: isToday
          ? `0 8px 25px rgba(0,0,0,0.15), 0 0 0 1px ${partnerColor()}20`
          : "0 2px 8px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        minWidth: "200px",
      }}
      key={index}
    >
      {/* Header do Card com Data */}
      <div
        style={{
          padding: "6px",
          position: "sticky",
          zIndex: 1,
          top: 0,
          fontWeight: 700,
          textAlign: "center",
          fontFamily: textGeneralFont(),
          background: isToday
            ? partnerColor()
            : "linear-gradient(135deg, #111, #555)",
          color: alwaysWhite(),
          marginBottom: "5px",
          letterSpacing: "0.5px",
          textShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ marginBottom: "2px" }}>
          {date.toLocaleDateString("en-US", {
            weekday: "long",
          })}
        </div>
        <div>
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Seção de TODOs */}
      <div>
        {todoList && todoList.length > 0 && (
          <div style={{ margin: "8px 4px" }}>
            {todoList
              .filter(
                (todo: TodoItem) =>
                  todo.date.toDateString() === date.toDateString()
              )
              .map((todo: TodoItem, idx: number) => (
                <div
                  key={todo._id || idx}
                  onClick={() => onTodoClick(todo._id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "2px",
                    cursor: "pointer",
                    backgroundColor:
                      todo.category === "personal"
                        ? "rgba(215, 192, 192, 0.7)"
                        : todo.category === "finance"
                        ? "rgba(234, 215, 191, 0.7)"
                        : todo.category === "work"
                        ? "rgba(234, 234, 191, 0.7)"
                        : todo.category === "study"
                        ? "rgba(215, 234, 191, 0.7)"
                        : todo.category === "health"
                        ? "rgba(191, 234, 212, 0.7)"
                        : todo.category === "family"
                        ? "rgba(191, 201, 234, 0.7)"
                        : todo.category === "other"
                        ? "rgba(216, 191, 234, 0.7)"
                        : "rgba(234, 191, 215, 0.7)",
                    borderRadius: "4px",
                    padding: "5px",
                    boxShadow: "0 1px 2px #b8b8b8ff",
                  }}
                >
                  <span style={{ fontSize: "10px" }}>
                    {todo.description &&
                      truncateString(todo.description, 5)}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      gap: "4px",
                      marginLeft: "8px",
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
                      const check = todo[`checkList${i}`];
                      if (!check || !check.description) return null;
                      return (
                        <span
                          key={i}
                          title={check.description}
                          style={{
                            display: "inline-block",
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: check.checked ? "#22c55e" : "#ddd",
                            border: "1px solid #bbb",
                          }}
                        />
                      );
                    })}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Seção de Eventos */}
      <div style={{ padding: "0 5px 1rem" }}>
        {events
          .filter(
            (event: Event) =>
              event.date.toDateString() === date.toDateString()
          )
          .sort((a: Event, b: Event) => {
            const timeA =
              parseInt(a.time.split(":")[0]) * 60 +
              parseInt(a.time.split(":")[1]);
            const timeB =
              parseInt(b.time.split(":")[0]) * 60 +
              parseInt(b.time.split(":")[1]);
            return timeA - timeB;
          })
          .map((event: Event, eventIndex: number) => {
            return (
              <div
                key={`${event._id}-${eventIndex}`}
                onClick={() => onEventClick(event)}
              >
                <CardOneEvent
                  headers={headers}
                  thePermissions={thePermissions}
                  myId={myId}
                  setChange={setChange}
                  change={change}
                  alternateBoolean={alternateBoolean}
                  event={event as any}
                  eventIndex={eventIndex}
                  setAlternateBoolean={setAlternateBoolean}
                />
              </div>
            );
          })}

        {/* Mensagem quando não há eventos */}
        {events.filter(
          (event: Event) =>
            event.date.toDateString() === date.toDateString()
        ).length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "2rem 1rem",
              color: "#94a3b8",
            }}
          >
            <i
              className="fa fa-calendar-o"
              style={{
                marginBottom: "5px",
                display: "block",
              }}
            />
            No events scheduled
          </div>
        )}
      </div>
    </StyledDiv>
  );
}