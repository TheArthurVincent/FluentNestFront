import React, { useEffect, useMemo, useState } from "react";
import { HeadersProps } from "../../../../Resources/types.universalInterfaces";
import axios from "axios";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { Link } from "react-router-dom";
import NewStudentModal from "../NewStudent/NewStudent";

type ListOfStudentsToClickProps = HeadersProps & {
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
  classesToReplenish: number;
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

      console.log(response.data.listOfStudents || response.data || []);
      setStudents(response.data.listOfStudents || response.data || []);
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao encontrar alunos");
    } finally {
      setLoading(false);
    }
  };
  const fetchStudentsNoLoading = async () => {
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
      setStudents(response.data.listOfStudents || []);
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao encontrar alunos");
    }
  };
  const [loadingButton, setLoadingButton] = useState(false);

  const handleReplenishPlus = async (id: string) => {
    setLoadingButton(true);
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/handle-replenish-plus/${id}`,
        {
          headers: actualHeaders ? { ...actualHeaders } : {},
        }
      );
      fetchStudentsNoLoading();
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao encontrar alunos");
    } finally {
      setLoadingButton(false);
    }
  };
  const handleReplenishMinus = async (id: string) => {
    setLoadingButton(true);
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/handle-replenish-minus/${id}`,
        {
          headers: actualHeaders ? { ...actualHeaders } : {},
        }
      );
      fetchStudentsNoLoading();
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao encontrar alunos");
    } finally {
      setLoadingButton(false);
    }
  };
  const RESETRESCHEDULE = async () => {
    const userId = JSON.parse(localStorage.getItem("loggedIn") || "{}").id;
    setLoadingButton(true);
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/handle-replenish-reset/${userId}`,
        {
          headers: actualHeaders ? { ...actualHeaders } : {},
        }
      );
      fetchStudentsNoLoading();
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao encontrar alunos");
    } finally {
      setLoadingButton(false);
    }
  };
  const handleReplenishALLPlus = async () => {
    setLoadingButton(true);
    const user = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const userId = user.id || user._id;
    setID(userId || "");
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/handle-replenish-all-plus/${userId}`,
        {
          headers: actualHeaders ? { ...actualHeaders } : {},
        }
      );
      fetchStudentsNoLoading();
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao encontrar alunos");
    } finally {
      setLoadingButton(false);
    }
  };
  const handleReplenishALLMinus = async () => {
    setLoadingButton(true);
    const user = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const userId = user.id || user._id;
    setID(userId || "");
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/handle-replenish-all-minus/${userId}`,
        {
          headers: actualHeaders ? { ...actualHeaders } : {},
        }
      );
      fetchStudentsNoLoading();
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao encontrar alunos");
    } finally {
      setLoadingButton(false);
    }
  };

  useEffect(() => {
    fetchStudents();
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

  // 🔴 REMOVIDO: eventsMap, hasEventsToday, studentsWithoutEventToday
  // Agora a lista a renderizar é SEMPRE filteredStudents
  const listToRender = filteredStudents;

  const myId = JSON.parse(localStorage.getItem("loggedIn") || "null")?.id;

  return (
    <>
      {loading && <p>Loading...</p>}
      {!loading && students.length === 0 && <p>No students found.</p>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
        {/* Barra de busca + novo aluno */}
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
          <div
            style={{
              justifySelf: "flex-end",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 8,
              marginLeft: "auto",
              fontSize: 12,
            }}
          >
            {" "}
            <button
              style={{
                fontSize: 12,
                borderRadius: 10,
                backgroundColor: "#f5f5f5",
                border: "none",
              }}
              disabled={loadingButton}
              onClick={RESETRESCHEDULE}
            >
              Zerar reagendamentos
            </button>
            <div
              style={{
                fontSize: 12,
                borderRadius: 10,
                backgroundColor: "#f5f5f5",
              }}
            >
              <button
                style={{
                  padding: "0 0.5rem",
                  backgroundColor: "transparent",
                  border: "none",
                  margin: "0 0.5rem",
                }}
                disabled={loadingButton}
                onClick={handleReplenishALLMinus}
              >
                -
              </button>
              Reagendamentos
              <button
                style={{
                  padding: "0 0.5rem",
                  backgroundColor: "transparent",
                  border: "none",
                  margin: "0 0.5rem",
                }}
                disabled={loadingButton}
                onClick={handleReplenishALLPlus}
              >
                +
              </button>
            </div>
            <NewStudentModal id={ID} headers={actualHeaders} />
          </div>
        </div>

        {/* Lista de alunos (sem filtro por aula de hoje) */}
        {listToRender.map((st) => (
          <div
            key={st.id}
            style={{
              color: "#222",
              background: "white",
              padding: "8px",
              borderRadius: 12,
              border: "1px solid #f5f5f5",
              display: myId !== st.id ? "grid" : "none",
              alignItems: "center",
              gridTemplateColumns: isDesktop ? "2fr 1fr" : "1fr",
              justifyContent: "space-between",
              gap: 12,
              transition: "0.2s",
              fontFamily: "Plus Jakarta Sans",
            }}
          >
            <Link
              to={`/students/${st.id}`}
              style={{
                display: "flex",
                background: "linear-gradient(to right, #f5f5f5, #ffffff)",
                padding: 8,
                borderRadius: 8,
                color: "inherit",
                textDecoration: "none",
                alignItems: "center",
                gap: 12,
              }}
            >
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
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>
                  {st.name} {st.lastname}
                </span>
                <span style={{ fontSize: 12, opacity: 0.7 }}>{st.email}</span>
              </div>
            </Link>
            <div
              style={{
                justifySelf: "flex-end",
                marginLeft: "auto",
                fontSize: 12,
              }}
            >
              {st.classesToReplenish !== 0 && (
                <button
                  style={{
                    padding: "0 0.5rem",
                    backgroundColor: "transparent",
                    border: "none",
                    margin: "0 0.5rem",
                  }}
                  disabled={loadingButton}
                  onClick={() => handleReplenishMinus(st.id)}
                >
                  -
                </button>
              )}
              Reagendamentos: {st.classesToReplenish}
              <button
                disabled={loadingButton}
                style={{
                  padding: "0 0.5rem",
                  backgroundColor: "transparent",
                  border: "none",
                  margin: "0 0.5rem",
                }}
                onClick={() => handleReplenishPlus(st.id)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ListOfStudentsToClick;
