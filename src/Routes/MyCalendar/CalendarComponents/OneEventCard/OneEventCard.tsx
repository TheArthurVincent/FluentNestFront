import React, { useEffect, useMemo, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import { partnerColor } from "../../../../Styles/Styles";
import { truncateString } from "../../../../Resources/UniversalComponents";
import {
  categoryList,
  formatTimeRange,
  isEventTimeNowConsideringDuration,
} from "../MyCalendarFunctions/MyCalendarFuncions";
interface OneEventProps {
  headers: any; // substitua pelo tipo real se souber a estrutura
  thePermissions: string[] | any;
  myId: string | number;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
  change: boolean;
  alternateBoolean?: boolean;
  setAlternateBoolean?: any;
  event: any; // substitua pelo tipo real se souber a estrutura
  eventIndex: number;
  students: any[]; // substitua pelo tipo real se souber a estrutura
}

function OneEvent({
  headers,
  thePermissions,
  myId,
  setChange,
  change,
  alternateBoolean,
  event,
  eventIndex,
  setAlternateBoolean,
  students,
}: OneEventProps) {
  const [loadingModalInfo, setLoadingModalInfo] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [postNew, setPostNew] = useState(false);
  const [eventId, setEventId] = useState("");
  const [link, setLink] = useState("");
  const [date, setDate] = useState("");
  const [theTime, setTheTime] = useState("");
  const [newStudentId, setNewStudentId] = useState("");
  const [newGroupId, setNewGroupId] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [isTutoring, setIsTutoring] = useState(false);
  const hj = new Date();

  const handleSeeModal = (e: any) => {
    const checkIfNew = e ? false : true;
    setIsVisible(true);
    setLoadingInfo(true);
    setPostNew(checkIfNew);
    setEventId(e ? e._id : "");
    if (checkIfNew) {
      setLink("");
      setDate("");
      setTheTime("");
      setNewStudentId("");
      setNewGroupId("");
      setDescription("");
      setCategory("");
      setStatus("");
      setLoadingInfo(false);
    } else {
      if (
        e.category == "Standalone" ||
        e.category == "Group Class" ||
        e.category == "Test"
      ) {
        setIsTutoring(false);
      } else if (
        e.category == "Tutoring" ||
        e.category == "Prize Class" ||
        e.category == "Rep"
      ) {
        setIsTutoring(true);
      }
      setLoadingInfo(false);
    }
  };

  const categoryColors = {
    "Group Class": { bg: "#614338ff", text: "#fff" },
    "Established Group Class": {
      bg: "#003f7eff",
      text: "#fff",
    },
    Rep: { bg: "grey", text: "#fff" },
    Tutoring: { bg: "#1e007eff", text: "#fff" },
    "Prize Class": { bg: "#27ae60", text: "#fff" },
    Standalone: { bg: "#48145fff", text: "#fff" },
    Test: { bg: "#34495e", text: "#fff" },
    "Marcar Reposição": {
      bg: "#2a7db4ff",
      text: "#fff",
    },
  };

  const statusColors = {
    desmarcado: {
      bg: "#ffebee",
      text: "#c62828",
      border: "#ef5350",
    },
    marcado: {
      bg: "#e3f2fd",
      text: "#1565c0",
      border: "#42a5f5",
    },
    realizada: {
      bg: "#e8f5e8",
      text: "#2e7d32",
      border: "#66bb6a",
    },
  };
  const categoryColor = categoryColors[
    event.category as keyof typeof categoryColors
  ] || { bg: "#000", text: "#fff" };
  const statusColor = statusColors[
    event.status as keyof typeof statusColors
  ] || {
    bg: "#f5f5f5",
    text: "#333",
    border: "#ddd",
  };
  return (
    <div
      key={`${event._id}-${eventIndex}`}
      style={{
        marginBottom: "5px",
        borderRadius: "6px",
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
      onClick={() => handleSeeModal(event)}
    >
      {/* Live Event Indicator */}
      {event.status !== "desmarcado" &&
        isEventTimeNowConsideringDuration(event, hj, date, event.duration) && (
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
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  backgroundColor: "white",
                  borderRadius: "6px",
                  marginRight: "5px",
                  animation: "pulse 2s infinite",
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
          paddingBottom: `${event.duration / 5}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            backgroundColor: "rgba(255,255,255,0.2)",
            color: categoryColor.text,
            padding: "2px 5px",
            borderRadius: "6px",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.3px",
          }}
        >
          <i className="fa fa-clock-o" style={{}} />

          {formatTimeRange(event.time, event.duration)}
        </div>

        {/* Event Title/Description */}
        <div
          style={{
            fontWeight: "600",
            marginBottom: "5px",
            lineHeight: "1.3",
            paddingRight: "4rem",
          }}
        >
          {event.groupName
            ? truncateString(event.groupName, 11)
            : event.student
            ? truncateString(event.student, 11)
            : event.description
            ? truncateString(event.description, 10)
            : "No description"}
        </div>
      </div>

      {/* Status Footer */}
      <div
        style={{
          backgroundColor: statusColor.bg,
          color: statusColor.text,
          padding: "5px 5px",
          fontWeight: "600",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          borderTop: `1px solid ${statusColor.border}`,
        }}
      >
        {(event.status === "desmarcado" || event.status === "Canceled") && (
          <>
            <i className="fa fa-times-circle" style={{ marginRight: "2px" }} />
            {categoryList.find((cat) => cat.value === event.category)?.text ||
              event.category}
          </>
        )}
        {(event.status === "marcado" || event.status === "Scheduled") && (
          <>
            <i
              className="fa fa-calendar-check-o"
              style={{ marginRight: "2px" }}
            />
            {categoryList.find((cat) => cat.value === event.category)?.text ||
              event.category}
          </>
        )}
        {(event.status === "realizada" || event.status === "Completed") && (
          <>
            <i className="fa fa-check-circle" style={{ marginRight: "2px" }} />

            {categoryList.find((cat) => cat.value === event.category)?.text ||
              event.category}
          </>
        )}
      </div>
    </div>
  );
}

export default OneEvent;
