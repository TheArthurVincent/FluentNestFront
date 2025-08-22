import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DivModal,
  Xp,
  backDomain,
  formatDate,
  formatDateBr,
  formatNumber,
  onLoggOut,
  transformMonth,
} from "../../../../Resources/UniversalComponents";
import { useUserContext } from "../../../../Application/SelectLanguage/SelectLanguage";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Switch,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Tab,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  alwaysWhite,
  partnerColor,
  textpartnerColorContrast,
  textPrimaryColorContrast,
  textTitleFont,
} from "../../../../Styles/Styles";
import { HOne, HTwo } from "../../../../Resources/Components/RouteBox";
import { HThree } from "../../../MyClasses/MyClasses.Styled";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { listOfButtons } from "../../../Ranking/RankingComponents/ListOfCriteria";
import { isArthurVincent } from "../../../../App";

export function Groups({ headers, id }) {
  const statusTokens = (status) => {
    switch (status) {
      case "realizada":
        return {
          leftBorder: "#28a745",
          pillBg: "#d4edda",
          pillFg: "#155724",
          neutralFg: "#495057",
          neutralBg: "#e9ecef",
        };
      case "desmarcado":
        return {
          leftBorder: "#dc3545",
          pillBg: "#f8d7da",
          pillFg: "#721c24",
          neutralFg: "#495057",
          neutralBg: "#e9ecef",
        };
      case "reagendado":
        return {
          leftBorder: "#ffc107",
          pillBg: "#fff3cd",
          pillFg: "#856404",
          neutralFg: "#495057",
          neutralBg: "#e9ecef",
        };
      default:
        return {
          leftBorder: "#6c757d",
          pillBg: "#e9ecef",
          pillFg: "#495057",
          neutralFg: "#495057",
          neutralBg: "#e9ecef",
        };
    }
  };

  const styles = {
    card: {
      backgroundColor: "#ffffff",
      margin: "auto",
      marginTop: "16px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
      border: "1px solid #e8eaed",
      padding: "20px",
      gap: "10px",
    },
    h3: {
      color: "#2c3e50",
      fontSize: "18px",
      fontWeight: 600,
      marginBottom: "20px",
      borderBottom: "2px solid #e8eaed",
      paddingBottom: "8px",
    },
    item: (borderColor) => ({
      backgroundColor: "#fff",
      border: "1px solid #e9ecef",
      borderRadius: "10px",
      padding: "20px",
      transition: "all 0.3s ease",
      borderLeft: `4px solid ${borderColor}`,
    }),
    listHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
      flexWrap: "wrap",
      gap: "8px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "12px",
    },
    label: { fontSize: "11px", color: "#6c757d", marginBottom: "4px" },
    link: { color: "#007bff", textDecoration: "none", fontSize: "13px" },
  };

  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [groupNameToEdit, setGroupNameToEdit] = useState("");
  const [groupDescriptionToEdit, setGroupDescriptionToEdit] = useState("");
  const [classesGroup, setClassesGroup] = useState([]);
  const [loadingGroupClasses, setLoadingGroupClasses] = useState(false);
  // 3) Ao selecionar um grupo para editar, normalize também:

  // Para sair do modo edição
  const handleCancelEdit = () => {
    setSelectedGroupId(null);
    setGroupDescriptionToEdit("");
    setGroupNameToEdit("");
    setArrayOfIds([]);
  };
  const { UniversalTexts } = useUserContext();
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [arrayOfIds, setArrayOfIds] = useState([]);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  // Removido campo de nome do grupo
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 2) handleCheckboxChange agora já recebe o id normalizado (string)
  const handleCheckboxChange = (studentId) => {
    if (selectedGroupId) {
      editGroup(selectedGroupId, studentId); // PUT
    } else {
      setArrayOfIds((prev) =>
        prev.includes(studentId)
          ? prev.filter((id) => id !== studentId)
          : [...prev, studentId]
      );
    }
    console.log("arrayOfIds", arrayOfIds);
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${backDomain}/api/v1/students/${id}`, {
        headers,
      });
      setStudents(response.data.listOfStudents);
      setLoading(false);
    } catch (error) {
      notifyAlert("Erro ao encontrar alunos");
    }
  };
  // 4) No POST, envie o nome igual ao backend espera e os IDs como strings
  const postGroup = async () => {
    try {
      await axios.post(
        `${backDomain}/api/v1/group/${id}`,
        {
          arrayOfIds: arrayOfIds.map(String),
          name: newName.trim(),
          description: newDescription.trim(),
        },
        { headers }
      );
      notifyAlert("Grupo criado com sucesso!", partnerColor());
      setArrayOfIds([]);
      setNewName("");
      setNewDescription("");
      setGroupNameToEdit("");
      setGroupDescriptionToEdit("");
      setSelectedGroupId(null);
      getGroups();
    } catch (error) {
      console.error(error?.response?.data || error.message);
      notifyAlert("Erro ao criar grupo");
    }
  };

  const getGroups = async () => {
    try {
      const response = await axios.get(`${backDomain}/api/v1/groups/${id}`, {
        headers,
      });
      console.log(response.data.groups);
      setGroups(response.data.groups);
    } catch (error) {
      notifyAlert("Erro ao encontrar alunos");
    }
  };
  const getOneGroup = async (groupId) => {
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/group/${groupId}`,
        {
          headers,
        }
      );
      console.log(response);
    } catch (error) {
      notifyAlert("Erro ao encontrar alunos");
    }
  };
  // Função para editar grupo, recebe id do grupo e id do aluno clicado
  const editGroup = async (groupId, studentId) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/group/${groupId}`,
        {
          idToAddOrRemove: studentId,
        },
        {
          headers,
        }
      );
      console.log(response);
      // Atualiza visual local
      setArrayOfIds((prev) =>
        prev.includes(studentId)
          ? prev.filter((id) => id !== studentId)
          : [...prev, studentId]
      );
      getGroups();
    } catch (error) {
      notifyAlert("Erro ao encontrar alunos");
    }
  };

  const handleChangeName = async (groupId, groupName) => {
    setGroupNameToEdit(groupName);
    console.log("no", groupName, groupNameToEdit);
    if (groupId) {
      try {
        const response = await axios.put(
          `${backDomain}/api/v1/group-name/${groupId}`,
          {
            name: groupName,
          },
          {
            headers,
          }
        );
      } catch (error) {
        notifyAlert("Erro ao encontrar alunos");
      }
      getGroups();
    } else {
      console.log("no", groupName);
    }
  };

  const handleChangeDescription = async (groupId, groupDescription) => {
    setGroupDescriptionToEdit(groupDescription);
    console.log(groupDescription);

    if (groupId) {
      try {
        const response = await axios.put(
          `${backDomain}/api/v1/group-description/${groupId}`,
          {
            description: groupDescription,
          },
          {
            headers,
          }
        );
      } catch (error) {
        notifyAlert("Erro ao encontrar alunos");
      }
      getGroups();
    } else {
      console.log("no", groupDescription);
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      const response = await axios.delete(
        `${backDomain}/api/v1/group/${groupId}`,
        {
          headers,
        }
      );
      fetchStudents();
      getGroups();
      setArrayOfIds([]);
      setSelectedGroupId(null);
      console.log(response);
    } catch (error) {
      notifyAlert("Erro ao encontrar alunos");
    }
  };

  useEffect(() => {
    fetchStudents();
    getGroups();
  }, []);

  const handleSelectGroup = async (group) => {
    setSelectedGroupId(group._id);
    // Se vierem objetos em vez de strings, mapeie; se já vierem strings, mantém:
    const ids = Array.isArray(group.studentIds)
      ? group.studentIds.map((x) => String(x?._id ?? x))
      : [];
    setArrayOfIds(ids);
    setGroupDescriptionToEdit(group.description ?? "");
    setGroupNameToEdit(group.name ?? "");

    try {
      setLoadingGroupClasses(true);

      const response = await axios.get(
        `${backDomain}/api/v1/grouphistory/${group._id}`,
        {
          headers,
        }
      );

      setClassesGroup(response.data.classesGroup);
      console.log(response.data.classesGroup);
      setLoadingGroupClasses(false);
    } catch (error) {
      notifyAlert("Erro ao encontrar aulas dos grupos");
      setLoadingGroupClasses(false);
    }
  };

  return (
    <div
      style={{
        margin: "32px auto",
        background: "#fff",
        borderRadius: 8,
        padding: "24px 18px",
      }}
    >
      <section style={{ marginBottom: 32 }}>
        <HOne>Meus grupos</HOne>
        <ul
          style={{
            padding: 10,
            margin: 0,
            maxHeight: "300px",
            backgroundColor: "white",
            overflowY: "auto",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1) inset",
          }}
        >
          {groups.map((group, index) => {
            return (
              <li
                key={group.id}
                style={{
                  listStyle: "none",
                  marginBottom: 10,
                  padding: "10px",
                  borderRadius: "8px",
                  borderBottom: "1px solid #f2f2f2",
                  background:
                    group._id === selectedGroupId ? "#f6f6f6ff" : "#fcfcfcff",
                  cursor: "pointer",
                  display: selectedGroupId
                    ? group._id === selectedGroupId
                      ? "block"
                      : "none"
                    : "block",
                }}
                onClick={() => {
                  console.log(group._id);
                  console.log(selectedGroupId);
                  handleSelectGroup(group);
                }}
              >
                <span
                  style={{
                    fontWeight: 500,
                    color: partnerColor(),
                    fontSize: 15,
                  }}
                >
                  #{index + 1} | {group.name ? group.name : "Grupo sem nome"}
                </span>
                <br />
                <span
                  style={{
                    fontWeight: 300,
                    color: "grey",
                    fontSize: 11,
                    fontStyle: "italic",
                  }}
                >
                  {group.description
                    ? group.description
                    : "Grupo sem descrição"}
                </span>
                <div
                  style={{
                    display: "flex",
                    marginTop: "10px",
                    textWrap: "nowrap",
                    flexWrap: "wrap",
                    gap: "5px",
                  }}
                >
                  {group.studentIds.map((studentId) => {
                    const sid = String(studentId?._id ?? studentId);
                    const student = students.find(
                      (s) => String(s._id ?? s.id) === sid
                    );
                    return (
                      <span
                        key={sid}
                        style={{
                          color: textpartnerColorContrast(),
                          backgroundColor: partnerColor(),
                          fontSize: 12,
                          padding: "3px 6px",
                          borderRadius: "12px",
                          marginRight: 10,
                        }}
                      >
                        {student
                          ? `${student.name} ${student.lastname}`
                          : "Aluno não encontrado"}
                      </span>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
      <section
        style={{
          padding: "10px",
          backgroundColor: selectedGroupId ? "#f6f6f6ff" : "#fcfcfcff",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          {" "}
          <div
            style={{
              display: "block",
              marginBottom: "12px",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <HOne>
                {selectedGroupId ? "Editar grupo" : "Criar novo grupo"}
              </HOne>

              {/* Botão só aparece se não estiver editando */}

              {selectedGroupId && (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={handleCancelEdit}
                    style={{
                      backgroundColor: partnerColor(),
                      color: textpartnerColorContrast(),
                    }}
                  >
                    Voltar aos grupos
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                    }}
                  >
                    <i className="fa fa-trash-o" />
                  </button>
                </div>
              )}
            </div>
            <div
              style={{
                display: "grid",
                width: "100%",
              }}
            >
              <input
                /* REMOVER onMouseLeave={getGroups} */
                className="no-focus"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  fontFamily: textTitleFont(),
                  fontWeight: 600,
                  fontSize: 16,
                }}
                type="text"
                placeholder="Nome do grupo"
                value={selectedGroupId ? groupNameToEdit : newName}
                onChange={(e) => {
                  const v = e.target.value;
                  if (selectedGroupId) {
                    setGroupNameToEdit(v);
                    handleChangeName(selectedGroupId, v); // PUT durante edição
                  } else {
                    setNewName(v); // criação
                    setGroupNameToEdit(v); // mantém o campo visualmente preenchido
                  }
                }}
              />

              <input
                /* REMOVER onMouseLeave={getGroups} */
                className="no-focus"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  fontWeight: 600,
                  fontSize: 16,
                  fontFamily: textTitleFont(),
                }}
                type="text"
                placeholder="Descrição do grupo"
                value={
                  selectedGroupId ? groupDescriptionToEdit : newDescription
                }
                onChange={(e) => {
                  const v = e.target.value;
                  if (selectedGroupId) {
                    setGroupDescriptionToEdit(v);
                    handleChangeDescription(selectedGroupId, v); // PUT durante edição
                  } else {
                    setNewDescription(v); // criação
                    setGroupDescriptionToEdit(v); // mantém o campo visualmente preenchido
                  }
                }}
              />
            </div>
          </div>
        </div>
        {showDeleteConfirm && (
          <div
            style={{
              margin: "12px 0px",
              background: "#fff3f3",
              border: "1px solid #e53935",
              borderRadius: 6,
              padding: 12,
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#e53935",
                fontWeight: 500,
                marginBottom: 8,
              }}
            >
              Tem certeza que deseja excluir este grupo?
            </div>
            <button
              onClick={() => {
                deleteGroup(selectedGroupId);
                setShowDeleteConfirm(false);
                handleCancelEdit();
              }}
              style={{
                padding: "8px 16px",
                background: "#e53935",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                fontWeight: 500,
                fontSize: 15,
                marginRight: 8,
                cursor: "pointer",
              }}
            >
              Confirmar exclusão
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                padding: "8px 16px",
                background: "#eee",
                color: "#222",
                border: "none",
                borderRadius: 4,
                fontWeight: 500,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        )}
        <div style={{ marginBottom: 12 }}>
          <span
            style={{
              fontSize: 15,
              color: "#333",
              marginBottom: 6,
              display: "block",
            }}
          >
            Lista de alunos
            {selectedGroupId ? ": (Adicione ou exclua alunos)" : ""}
          </span>
          {loading ? (
            <div style={{ color: "#888", fontSize: 14 }}>Carregando...</div>
          ) : (
            <div
              style={{
                maxHeight: 160,
                overflowY: "auto",
                border: "1px solid #eee",
                borderRadius: 4,
                background: "#fafbfc",
                padding: "8px 6px",
              }}
            >
              {students.map((student) => (
                <label
                  key={student.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: 14,
                    color: "#444",
                    marginBottom: 6,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={arrayOfIds.includes(student.id)}
                    onChange={() => handleCheckboxChange(student.id)}
                    style={{ marginRight: 8 }}
                  />
                  {student.name} {student.lastname}
                </label>
              ))}
            </div>
          )}
        </div>
        {selectedGroupId && (
          <div style={styles.card}>
            <h3 style={styles.h3}>
              📚 Histórico de Aulas em Grupo: {groupNameToEdit}
            </h3>

            <div style={{ marginBottom: 12 }}>
              Número de aulas: {classesGroup?.length ?? 0}
            </div>

            {(classesGroup && classesGroup.length > 0
              ? [...classesGroup].sort(
                  (a, b) => new Date(b.date) - new Date(a.date)
                )
              : []
            ).map((event, idx) => {
              const t = statusTokens(event?.status);
              const key = event?._id || `${event?.date}-${idx}`;
              const time = event?.time ? ` às ${event.time}` : "";

              return (
                <div
                  key={key}
                  style={{ marginBottom: "1rem", ...styles.item(t.leftBorder) }}
                >
                  {/* Cabeçalho */}
                  <div style={styles.listHeader}>
                    <div style={{ fontWeight: 600, color: "#2c3e50" }}>
                      # {idx + 1}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: t.pillBg,
                          color: t.pillFg,
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          textTransform: "uppercase",
                          fontWeight: 600,
                        }}
                      >
                        {event?.status || "—"}
                      </span>

                      <span
                        style={{
                          backgroundColor: "#f1f3f5",
                          color: "#495057",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "11px",
                        }}
                      >
                        {event?.category || "—"}
                      </span>
                    </div>

                    <div style={{ fontSize: "13px", color: "#6c757d" }}>
                      🕒 {event?.duration ?? "—"} min
                    </div>
                  </div>

                  {/* Informações principais */}
                  <div style={styles.grid}>
                    <div>
                      <div style={styles.label}>📅 Data & Horário</div>
                      <div style={{ color: "#333" }}>
                        {event?.date
                          ? new Date(event.date).toLocaleDateString("pt-BR")
                          : "—"}
                        {time}
                      </div>
                    </div>

                    {event?.description && event.description.trim() !== "" && (
                      <div style={{ gridColumn: "1 / -1" }}>
                        <div style={styles.label}>📝 Descrição</div>
                        <div style={{ color: "#333", lineHeight: 1.5 }}>
                          {event.description}
                        </div>
                      </div>
                    )}

                    {event?.video && (
                      <div>
                        <div style={styles.label}>🎥 Vídeo</div>
                        <a
                          href={event.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.link}
                        >
                          Assista no YouTube
                        </a>
                      </div>
                    )}

                    {event?.importantLink && (
                      <div>
                        <div style={styles.label}>🔗 Link Importante</div>
                        <a
                          href={event.importantLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.link}
                        >
                          Abrir Material
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {!selectedGroupId && (
          <button
            onClick={postGroup}
            disabled={
              arrayOfIds.length === 0 ||
              groupNameToEdit === "" ||
              groupDescriptionToEdit === ""
            }
            style={{
              width: "100%",
              padding: "10px 0",
              background: partnerColor(),
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontWeight: 500,
              fontSize: 16,
              cursor:
                arrayOfIds.length === 0 ||
                groupNameToEdit === "" ||
                groupDescriptionToEdit === ""
                  ? "not-allowed"
                  : "pointer",
              opacity:
                arrayOfIds.length === 0 ||
                groupNameToEdit === "" ||
                groupDescriptionToEdit === ""
                  ? 0.6
                  : 1,
              transition: "opacity 0.2s",
            }}
          >
            Criar grupo
          </button>
        )}
      </section>
    </div>
  );
}

export default Groups;
