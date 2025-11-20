import React, { useEffect, useMemo, useState } from "react";
import { HeadersProps } from "../../../../Resources/types.universalInterfaces";
import axios from "axios";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { Link } from "react-router-dom";
import NewStudentModal from "../NewStudent/NewStudent";

type ListOfStudentsToClickProps = HeadersProps & {
  change?: boolean;
  setChange?: any;
  isDesktop: boolean;
  actualHeaders?: any;
  myId?: string;
};

export var newArvinTitleStyle = {
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

export function ListOfStudentsToClick({
  actualHeaders,
  isDesktop,
}: ListOfStudentsToClickProps) {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [ID, setID] = useState("");

  const fetchStudents = async () => {
    const user = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    setID(user.id || user._id);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/students-ids/${user.id || user._id}`,
        {
          headers: actualHeaders,
        }
      );

      setStudents(response.data.listOfStudents || response.data || []);
    } catch (error) {
      notifyAlert("Erro ao encontrar alunos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);
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

  return (
    <>
      {loading && <p>Loading...</p>}
      {!loading && students.length === 0 && <p>No students found.</p>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
        <div
          style={{
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
          {" "}
          <input
            type="text"
            placeholder="🔍 Buscar aluno por nome, usuário ou e-mail..."
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
            }}
          />
          <NewStudentModal id={ID} headers={actualHeaders} />
        </div>
        {filteredStudents.map((st) => (
          <Link
            key={st.id}
            to={`/students/${st.id}`}
            style={{
              textDecoration: "none",
              color: "#222",
              background: "white",
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid #e4e6ea",
              display: "flex",
              alignItems: "center",
              gap: 12,
              transition: "0.2s",
              fontFamily: "Plus Jakarta Sans",
            }}
          >
            {/* Foto */}
            <img
              src={
                st.picture ||
                "https://ik.imagekit.io/vjz75qw96/logos/myp?updatedAt=1752031657485"
              }
              alt={st.name}
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            {/* Informações */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>
                {st.name} {st.lastname}
              </span>
              <span style={{ fontSize: 12, opacity: 0.7 }}>{st.email}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default ListOfStudentsToClick;
