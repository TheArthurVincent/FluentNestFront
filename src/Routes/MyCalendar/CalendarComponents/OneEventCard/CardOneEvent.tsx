import React from "react";
import { truncateString } from "../../../../Resources/UniversalComponents";
import {
  categoryList,
  formatTimeRange,
  isEventTimeNowConsideringDuration,
} from "../MyCalendarFunctions/MyCalendarFunctions";

interface CalendarEvent {
  date(
    event: CalendarEvent,
    hj: Date,
    date: any,
    duration: number | undefined,
  ): unknown;
  _id?: string;
  category?: string;
  status?: string;
  duration?: number;
  time?: string;
  groupName?: string;
  student?: string;
  description?: string;
}

interface CardOneEventProps {
  headers: any;
  thePermissions: string[] | any;
  myId: string | number;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
  change: boolean;
  alternateBoolean?: boolean;
  setAlternateBoolean?: any;
  event: CalendarEvent | null | undefined;
  eventIndex: number;
}

const CardOneEvent: React.FC<CardOneEventProps> = ({
  headers,
  thePermissions,
  myId,
  setChange,
  change,
  alternateBoolean,
  event,
  eventIndex,
  setAlternateBoolean,
}) => {
  const hj = new Date();

  if (!event) return null;

  const categoryColors: Record<string, { bg: string; text: string }> = {
    "Group Class": { bg: "#614338ff", text: "#fff" },
    "Established Group Class": { bg: "#003f7eff", text: "#fff" },
    Rep: { bg: "grey", text: "#fff" },
    Tutoring: { bg: "#1e007eff", text: "#fff" },
    "Prize Class": { bg: "#27ae60", text: "#fff" },
    Standalone: { bg: "#48145fff", text: "#fff" },
    Test: { bg: "#34495e", text: "#fff" },
    "Marcar Reposição": { bg: "#2a7db4ff", text: "#fff" },
  };

  const statusColors: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    desmarcado: { bg: "#ffebee", text: "#c62828", border: "#ef5350" },
    marcado: { bg: "#e3f2fd", text: "#1565c0", border: "#42a5f5" },
    realizada: { bg: "#e8f5e8", text: "#2e7d32", border: "#66bb6a" },
    Canceled: { bg: "#ffebee", text: "#c62828", border: "#ef5350" },
    Scheduled: { bg: "#e3f2fd", text: "#1565c0", border: "#42a5f5" },
    Completed: { bg: "#e8f5e8", text: "#2e7d32", border: "#66bb6a" },
  };

  const safeCategoryText = (cat?: string) =>
    (cat &&
      Array.isArray(categoryList) &&
      categoryList.find((c: any) => c?.value === cat)?.text) ||
    cat ||
    "—";

  const safeFormatTimeRange =
    typeof formatTimeRange === "function"
      ? formatTimeRange
      : (_t: any, _d: any) => "";

  const categoryColor = (event.category && categoryColors[event.category]) || {
    bg: "#000",
    text: "#fff",
  };

  const statusColor = (event.status && statusColors[event.status]) || {
    bg: "#f5f5f5",
    text: "#333",
    border: "#ddd",
  };

  const durationPad =
    Number.isFinite(event.duration as number) &&
    typeof event.duration === "number"
      ? `${event.duration / 5}px`
      : "0px";

  return (
    <div
      key={`${event._id ?? "noid"}-${eventIndex}`}
      style={{
        marginBottom: "5px",
        borderRadius: 6,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease",
        cursor: "pointer",
        border: `1px solid ${statusColor.border}`,
      }}
      onMouseEnter={(e: any) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e: any) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
      }}
    >
      {event.status !== "desmarcado" &&
        isEventTimeNowConsideringDuration(
          event,
          hj,
          event.date,
          event.duration,
        ) && (
          <div
            style={{
              background: "green",
              padding: "2px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor: "white",
                  borderRadius: 3,
                  marginRight: 5,
                }}
              />
              Live Now
            </div>
          </div>
        )}

      <div
        style={{
          background: categoryColor.bg,
          color: categoryColor.text,
          padding: "5px",
          position: "relative",
          paddingBottom: durationPad,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            backgroundColor: "rgba(255,255,255,0.2)",
            color: categoryColor.text,
            padding: "2px 5px",
            borderRadius: 6,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.3px",
          }}
        >
          <i className="fa fa-clock-o" />{" "}
          {safeFormatTimeRange(event.time, event.duration)}
        </div>

        <div
          style={{
            fontWeight: 600,
            marginBottom: 5,
            lineHeight: 1.3,
          }}
        >
          {event.groupName
            ? truncateString(event.groupName, 11)
            : event.student
              ? truncateString(event.student, 11)
              : event.description
                ? truncateString(event.description, 10)
                : event.groupName
                  ? truncateString(event.groupName, 11)
                  : event.student
                    ? truncateString(event.student, 11)
                    : event.description
                      ? truncateString(event.description, 10)
                      : event.category === "Marcar Reposição"
                        ? "Disponível"
                        : event.category == "Rep"
                          ? "Reposição"
                          : event.category == "Standalone"
                            ? "Aula Única"
                            : event.category}
        </div>
      </div>

      <div
        style={{
          backgroundColor: statusColor.bg,
          color: statusColor.text,
          padding: "5px 5px",
          fontWeight: 600,
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          borderTop: `1px solid ${statusColor.border}`,
        }}
      >
        {(event.status === "desmarcado" || event.status === "Canceled") && (
          <>
            <i className="fa fa-times-circle" style={{ marginRight: 2 }} />
            {safeCategoryText(event.category)}
          </>
        )}
        {(event.status === "marcado" || event.status === "Scheduled") && (
          <>
            <i className="fa fa-calendar-check-o" style={{ marginRight: 2 }} />
            {safeCategoryText(event.category)}
          </>
        )}
        {(event.status === "realizada" || event.status === "Completed") && (
          <>
            <i className="fa fa-check-circle" style={{ marginRight: 2 }} />
            {safeCategoryText(event.category)}
          </>
        )}
      </div>
    </div>
  );
};

export default CardOneEvent;
