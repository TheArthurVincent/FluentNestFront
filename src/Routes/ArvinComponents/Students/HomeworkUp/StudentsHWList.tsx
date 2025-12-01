import React, { useEffect, useMemo, useState } from "react";
import { HeadersProps } from "../../../../Resources/types.universalInterfaces";
import axios from "axios";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { Link } from "react-router-dom";
import NewStudentModal from "../NewStudent/NewStudent";

type ListOfStudentsHWToClickProps = HeadersProps & {
  change?: boolean;
  setChange?: (value: boolean) => void;
  isDesktop: boolean;
  actualHeaders?: Record<string, string>;
  myId?: string;
};

export const newArvinTitleStyle = {
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontStyle: "SemiBold",
  fontSize: 24,
  letterSpacing: "0%",
};

type StudentItem = {
  id: string;
  name: string;
  lastname: string;
  email: string;
  picture: string;
  username: string;
};

type EventToday = {
  event: {
    _id: string;
    studentID: string;
    tutoringID?: string;
    edited?: boolean;
    duration?: number;
    student?: string;
    status?: string;
    link?: string;
    description?: string | null;
    category?: string;
    date: string; // "2025-11-20"
    time: string; // "08:00"
  };
  student?: {
    _id: string;
    name: string;
    lastname: string;
    picture?: string;
    email?: string;
  };
};

type EventMap = {
  [studentId: string]: {
    time: string;
    link: string;
  };
};

export function ListOfStudentsHWToClick({
  actualHeaders,
  isDesktop,
}: ListOfStudentsHWToClickProps) {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [ID, setID] = useState("");
  const [eventsForToday, setEventsForToday] = useState<EventToday[]>([]);

  // ====== BUSCAR EVENTOS DO DIA ======
  const getDayEvents = async (userid: string, date: Date) => {
    const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/students-events-today/${userid}`,
        {
          headers: actualHeaders ? { ...actualHeaders } : {},
          params: { today: dateStr },
        }
      );

      const events: EventToday[] = response.data.events || response.data || [];
      setEventsForToday(events || []);
    } catch (error) {
      console.log("Erro ao buscar eventos do dia:", error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("loggedIn") || "{}");
      const userId = user.id || user._id;
      setID(userId || "");

      const response = await axios.get(
        `${backDomain}/api/v1/students-ids/${userId}`,
        {
          headers: actualHeaders ? { ...actualHeaders } : {},
        }
      );

      setStudents(response.data.listOfStudents || response.data || []);
      if (userId) {
        getDayEvents(userId, new Date());
      }
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao encontrar alunos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ====== FILTRO DE BUSCA ======
  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return students;

    return students.filter((s) => {
      const fullName = `${s.name || ""} ${s.lastname || ""}`.toLowerCase();
      const email = (s.email || "").toLowerCase();
      const username = (s.username || "").toLowerCase();

      return (
        fullName.includes(query) ||
        email.includes(query) ||
        username.includes(query)
      );
    });
  }, [students, search]);

  // ====== MAPA DE EVENTOS (studentId -> menor horário) ======
  const eventsMap: EventMap = useMemo(() => {
    const map: EventMap = {};

    (eventsForToday || []).forEach((item) => {
      const studentId = item.student?._id || item.event.studentID || "";
      if (!studentId) return;

      const time = item.event.time || "23:59";
      const link = item.event.link || "";

      if (!map[studentId] || time < map[studentId].time) {
        map[studentId] = { time, link };
      }
    });

    return map;
  }, [eventsForToday]);

  const hasEventsToday = useMemo(
    () => Object.keys(eventsMap).length > 0,
    [eventsMap]
  );

  const studentsWithoutEventToday = useMemo(() => {
    if (!hasEventsToday) return filteredStudents;
    return filteredStudents.filter((s) => !eventsMap[s.id]);
  }, [filteredStudents, eventsMap, hasEventsToday]);

  const listToRender = hasEventsToday
    ? studentsWithoutEventToday
    : filteredStudents;

    const myId = JSON.parse(localStorage.getItem("loggedIn") || "null")?.id;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isDesktop
          ? "repeat(auto-fill, minmax(260px, 1fr))"
          : "1fr",
        gap: 16,
      }}
    >
      {/* BARRA DE BUSCA + NOVO ALUNO */}
      <div
        style={{
          gridColumn: "1 / -1",
          display: "flex",
          alignItems: !isDesktop ? "flex-end" : "center",
          padding: "8px 0",
          flexDirection: isDesktop ? "row" : "column",
          fontSize: 12,
          color: "#555",
          gap: 8,
          marginBottom: isDesktop ? 4 : 12,
        }}
      >
        <input
          type="text"
          placeholder="🔍 Qual é o aluno cujas lições de casa você gostaria de ver?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: isDesktop ? 260 : "100%",
            borderRadius: 999,
            border: "1px solid #E2E8F0",
            padding: "8px 14px",
            fontSize: 13,
            outline: "none",
            background: "#fafafa",
          }}
        />
        <NewStudentModal id={ID} headers={actualHeaders} />
      </div>

      {/* GRID DE CARDS */}
      {listToRender.map((st) => (
        <Link
          key={st.id}
          to={`/my-homework-and-lessons/${st.id}`}
          style={{
            textDecoration: "none",
            color: "#222",
            background: "white",
            padding: "16px",
            borderRadius: 16,
            border: "1px solid #e4e6ea",
            display: myId !== st.id ? "flex" : "none",
            flexDirection: "column",
            gap: 12,
            transition: "0.25s",
            fontFamily: "Plus Jakarta Sans",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src={
                st.picture ||
                "https://ik.imagekit.io/vjz75qw96/logos/myp?updatedAt=1752031657485"
              }
              alt={st.name}
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 16, fontWeight: 600 }}>
                {st.name} {st.lastname}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ListOfStudentsHWToClick;
