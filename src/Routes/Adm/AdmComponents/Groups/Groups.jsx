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
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [groupNameToEdit, setGroupNameToEdit] = useState("");
  const [groupDescriptionToEdit, setGroupDescriptionToEdit] = useState("");

  // 3) Ao selecionar um grupo para editar, normalize também:
  const handleSelectGroup = (group) => {
    setSelectedGroupId(group._id);
    // Se vierem objetos em vez de strings, mapeie; se já vierem strings, mantém:
    const ids = Array.isArray(group.studentIds)
      ? group.studentIds.map((x) => String(x?._id ?? x))
      : [];
    setArrayOfIds(ids);
    setGroupDescriptionToEdit(group.description ?? "");
    setGroupNameToEdit(group.name ?? "");
  };

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

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "32px auto",
        fontFamily: "Segoe UI, Arial, sans-serif",
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #eee",
        border: "1px solid #eee",
        padding: "24px 18px",
      }}
    >
      <section style={{ marginBottom: 32 }}>
        <h2
          style={{
            fontWeight: 500,
            fontSize: 20,
            marginBottom: 12,
            color: "#222",
          }}
        >
          Meus grupos
        </h2>
        <ul style={{ padding: 0, margin: 0 }}>
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
                    group._id === selectedGroupId ? "#e7f8d6ff" : "transparent",
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
                  #{index + 1} |{" "}
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
          backgroundColor: selectedGroupId ? "#e7f8d6ff" : "transparent",
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
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  fontWeight: 500,
                  fontSize: 20,
                  marginBottom: 12,
                  color: "#222",
                }}
              >
                {selectedGroupId ? "Editar grupo" : "Criar novo grupo"}
              </h2>

              {/* Botão só aparece se não estiver editando */}

              {selectedGroupId && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                  }}
                >
                  <i className="fas fa-trash" />
                </button>
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
        {!selectedGroupId ? (
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
        ) : (
          <>
            <button
              onClick={handleCancelEdit}
              style={{
                width: "100%",
                padding: "10px 0",
                background: "#eee",
                color: "#222",
                border: "none",
                borderRadius: 4,
                fontWeight: 500,
                fontSize: 16,
                marginTop: 8,
                cursor: "pointer",
              }}
            >
              Ver todos os grupos
            </button>
          </>
        )}
      </section>
    </div>
  );
}

export default Groups;
