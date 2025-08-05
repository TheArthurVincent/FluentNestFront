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
  textPrimaryColorContrast,
  textTitleFont,
} from "../../../../Styles/Styles";
import { HOne } from "../../../../Resources/Components/RouteBox";
import {
  ArvinButton,
  MyButton,
} from "../../../../Resources/Components/ItemsLibrary";
import { HThree } from "../../../MyClasses/MyClasses.Styled";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { listOfButtons } from "../../../Ranking/RankingComponents/ListOfCriteria";
import { isArthurVincent } from "../../../../App";

export function FindStudent({ uploadStatus, headers, id }) {
  const { UniversalTexts } = useUserContext();
  const [newName, setNewName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newCpf, setNewCpf] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newDateOfBirth, setNewDateOfBirth] = useState("");
  const [permissions, setPermissions] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [googleDriveLink, setGoogleDriveLink] = useState("");
  const [picture, setPicture] = useState("");
  const [fee, setFee] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [seeConfirmDelete, setSeeConfirmDelete] = useState(false);
  const [ID, setID] = useState("");
  const [value, setValue] = useState("1");
  const [homeworkAssignmentsDone, setHomeworkAssignmentsDone] = useState(0);
  const [flashcards25Reviews, setFlashcards25Reviews] = useState(0);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weeklyClasses, setWeeklyClasses] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [monthlyScore, setMonthlyScore] = useState(0);
  const [feeUpToDate, setFeeUpToDate] = useState(false);
  const [replenishTarget, setReplenishTarget] = useState(false);
  const [tutoree, setTutoree] = useState(false);
  const [isAdm, setIsAdm] = useState(false);

  const handleChangeEdit = (event, newValue) => {
    setValue(newValue);
  };

  const handleChange = (event) => {
    setPermissions(event.target.value);
  };
  const handleSeeModal = () => {
    setIsVisible(!isVisible);
    setValue("1");
    setSeeConfirmDelete(false);
  };

  const handleConfirmDelete = () => {
    setSeeConfirmDelete(!seeConfirmDelete);
  };

  const seeEdition = async (id) => {
    handleSeeModal();
    try {
      const response = await axios.get(`${backDomain}/api/v1/student/${id}`, {
        headers,
      });
      setNewName(response.data.formattedStudentData.name);
      setNewCpf(
        response.data.formattedStudentData.doc
          ? formatCpf(response.data.formattedStudentData.doc)
          : ""
      );
      setNewLastName(response.data.formattedStudentData.lastname);
      setNewUsername(response.data.formattedStudentData.username);
      setNewPhone(response.data.formattedStudentData.phoneNumber);
      setNewEmail(response.data.formattedStudentData.email);
      setNewDateOfBirth(
        response.data.formattedStudentData.dateOfBirth
          ? response.data.formattedStudentData.dateOfBirth.split("T")[0]
          : ""
      );
      setFeeUpToDate(response.data.formattedStudentData.feeUpToDate);
      setReplenishTarget(response.data.formattedStudentData.replenishTarget);
      setTutoree(response.data.formattedStudentData.tutoree);
      setPermissions(response.data.formattedStudentData.permissions);
      setWeeklyClasses(response.data.formattedStudentData.weeklyClasses);
      setID(response.data.formattedStudentData.id);
      setGoogleDriveLink(response.data.formattedStudentData.googleDriveLink);
      setTotalScore(response.data.formattedStudentData.totalScore || 0);
      setMonthlyScore(response.data.formattedStudentData.monthlyScore || 0);
      setPicture(response.data.formattedStudentData.picture);
      setFee(response.data.formattedStudentData.fee);
      setNewAddress(response.data.formattedStudentData.address);
      setHomeworkAssignmentsDone(
        response.data.formattedStudentData.homeworkAssignmentsDone || 0
      );
      setFlashcards25Reviews(
        response.data.formattedStudentData.flashcards25Reviews || 0
      );
    } catch (error) {
      notifyAlert(error);
      console.error(error);
    }
  };

  const updateScoreNow = async (id) => {
    try {
      const response = await axios.get(`${backDomain}/api/v1/student/${id}`, {
        headers,
      });
      setTotalScore(response.data.formattedStudentData.totalScore || 0);
      setMonthlyScore(response.data.formattedStudentData.monthlyScore || 0);
      setHomeworkAssignmentsDone(
        response.data.formattedStudentData.homeworkAssignmentsDone || 0
      );
      setFlashcards25Reviews(
        response.data.formattedStudentData.flashcards25Reviews || 0
      );
    } catch (error) {
      notifyAlert(error);
      console.error(error);
    }
  };

  const editStudent = async (id) => {
    // Validar CPF antes de salvar
    if (newCpf && !validateCpf(newCpf)) {
      notifyAlert(
        "CPF inválido. Verifique o formato e tente novamente.",
        "red"
      );
      return;
    }

    let editedStudent = {
      username: newUsername,
      password: newPassword,
      email: newEmail,
      dateOfBirth: newDateOfBirth,
      name: newName,
      lastname: newLastName,
      phoneNumber: newPhone,
      weeklyClasses,
      permissions: permissions,
      googleDriveLink: googleDriveLink,
      address: newAddress,
      fee,
      picture: picture,
      doc: newCpf.replace(/\D/g, ""), // Salva apenas números no banco
    };

    try {
      const response = await axios.put(
        `${backDomain}/api/v1/students/${id}`,
        editedStudent,
        { headers }
      );
      notifyAlert("Usuário editado com sucesso!", "green");
      handleSeeModal();
      fetchStudents();
    } catch (error) {
      notifyAlert("Erro ao editar usuário");
      handleSeeModal();
    }
  };

  const editStudentPermissions = async (id) => {
    let editedStudent = {
      permissions: permissions,
    };
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/studentpermissions/${id}`,
        editedStudent,
        { headers }
      );
      handleSeeModal();
      fetchStudents();
      notifyAlert("Permissões editadas com sucesso!", "green");
    } catch (error) {
      notifyAlert("Erro ao editar permissões");
      handleSeeModal();
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${backDomain}/api/v1/students/${id}`, {
        headers,
      });
      setStudents(response.data.listOfStudents);
      console.log(response.data.listOfStudents);
      setLoading(false);
    } catch (error) {
      notifyAlert("Erro ao encontrar alunos");
      // onLoggOut();
    }
  };
  useEffect(() => {
    fetchStudents();
  }, [uploadStatus]);

  const deleteStudent = async (id) => {
    try {
      const response = await axios.delete(
        `${backDomain}/api/v1/students/${id}`,
        { headers }
      );
      notifyAlert("Aluno excluído");
      fetchStudents();
      handleSeeModal();
    } catch (error) {
      notifyAlert(error);

      handleSeeModal();
      console.error(error);
    }
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [hasReset, setHasReset] = useState(false);
  const [resetVisible, setResetVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleResetMonth = async () => {
    const headersBack = {
      authorization: headers.Authorization,
    };
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/resetmonthscoresecurethepoints`,
        null,
        { headers: headersBack }
      );
      setResetVisible(true);
      setTimeout(() => {
        setHasReset(true);
      }, 800);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      notifyAlert("Erro ao resetar");
    }
  };

  const handleShowResetMonth = () => {
    setIsConfirmVisible(!isConfirmVisible);
  };
  const cellTable = {
    whiteSpace: "nowrap",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: "400",
    color: "#2c3e50",
    borderBottom: "1px solid #ecf0f1",
  };

  const stickyHeaderStyle = {
    position: "sticky",
    top: 0,
    backgroundColor: "#fafbfc",
    zIndex: 1,
    whiteSpace: "nowrap",
    padding: "16px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#34495e",
    borderBottom: "2px solid #e8eaed",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const updateFeeStatus = async (id) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/feeuptodate/${id}`,
        {},
        {
          headers,
        }
      );
      fetchStudents();
    } catch (error) {
      console.log("error", error);
    }
  };
  const [onHold, setOnHold] = useState(false);
  const updateOnHold = async (id) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/onhold/${id}`,
        {},
        {
          headers,
        }
      );
      fetchStudents();
    } catch (error) {
      console.log("error", error);
    }
  };
  const isMobile = window.innerWidth <= 700;
  const handleSaveAll = () => {
    if (!ID) return;
    editStudent(ID);
    editStudentPermissions(ID);
    // editStudentPassword(ID);
  };

  const updateReplenishTargetStatus = async (id) => {
    try {
      await axios.put(`${backDomain}/api/v1/replenish/${id}`, {}, { headers });
      setReplenishTarget(!replenishTarget);
    } catch (error) {
      notifyAlert("Erro ao atualizar reposição");
    }
  };

  const updateTutoree = async (id) => {
    try {
      await axios.put(`${backDomain}/api/v1/tutoree/${id}`, {}, { headers });
      setTutoree(!tutoree);
    } catch (error) {
      notifyAlert("Erro ao atualizar tutoria");
    }
  };

  const handleDelete = () => {
    if (!ID) return;
    deleteStudent(ID);
  };
  const [descSpecial, setDescSpecial] = useState("");
  const [plusScore, setPlusScore] = useState(0);

  // Função para validar e formatar CPF
  const formatCpf = (value) => {
    // Remove tudo que não é dígito
    const onlyNumbers = value.replace(/\D/g, "");

    // Limita a 11 dígitos
    const limitedNumbers = onlyNumbers.slice(0, 11);

    // Aplica a máscara progressivamente
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return limitedNumbers.replace(/(\d{3})(\d+)/, "$1.$2");
    } else if (limitedNumbers.length <= 9) {
      return limitedNumbers.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    } else {
      return limitedNumbers.replace(
        /(\d{3})(\d{3})(\d{3})(\d+)/,
        "$1.$2.$3-$4"
      );
    }
  };

  // Função para validar CPF
  const validateCpf = (cpf) => {
    const onlyNumbers = cpf.replace(/\D/g, "");

    if (onlyNumbers.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(onlyNumbers)) return false;

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(onlyNumbers[i]) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 > 9) digit1 = 0;

    if (parseInt(onlyNumbers[9]) !== digit1) return false;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(onlyNumbers[i]) * (11 - i);
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 > 9) digit2 = 0;

    return parseInt(onlyNumbers[10]) === digit2;
  };

  const handleCpfChange = (e) => {
    const formattedCpf = formatCpf(e.target.value);
    setNewCpf(formattedCpf);
  };

  const isCpfValid = newCpf ? validateCpf(newCpf) : true;

  const submitPlusScore = async (id, score, description, type) => {
    try {
      setDisabled(true);
      await axios.put(
        `${backDomain}/api/v1/score/${id}`,
        { score, description, type },
        { headers }
      );
      notifyAlert("Pontuação atualizada com sucesso!", "green");
      await updateScoreNow(id); // ESSENCIAL!
      setDisabled(false);
    } catch (error) {
      notifyAlert("Erro ao atualizar pontuação");
      setDisabled(false);
    }
  };

  const editStudentPassword = async (id) => {
    if (newPassword === confirmPassword) {
    } else {
      notifyAlert("As senhas são diferentes");
    }
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/studentpassword/${id}`,
        { newPassword },
        { headers }
      );
      notifyAlert("Senha editada com sucesso!", "green");
      fetchStudents();
      handleSeeModal();
    } catch (error) {
      notifyAlert("Erro ao editar senha");
      handleSeeModal();
    }
  };

  return (
    <>
      <HOne
        style={{
          fontFamily: textTitleFont(),
          color: partnerColor(),
        }}
      >
        {UniversalTexts.myStudents}
      </HOne>
      {/* SEÇÃO DE INFORMAÇÕES DETALHADAS DO ALUNO SELECIONADO */}
      {selectedStudent && (
        <div
          style={{
            backgroundColor: "#ffffff",
            margin: "auto",
            marginBottom: "24px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            border: "1px solid #e8eaed",
            maxWidth: "70rem",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <img
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #e8eaed",
                }}
                src={
                  selectedStudent.picture ||
                  "https://ik.imagekit.io/vjz75qw96/logos/myp?updatedAt=1752031657485"
                }
                alt=""
              />
              <div>
                <Typography
                  variant="h6"
                  style={{
                    fontWeight: "600",
                    color: "#2c3e50",
                    fontSize: "18px",
                    marginBottom: "4px",
                  }}
                >
                  {selectedStudent.fullname}
                </Typography>
                <Typography
                  style={{
                    color: "#6c757d",
                    fontSize: "14px",
                  }}
                >
                  {selectedStudent.email}
                </Typography>
              </div>
            </div>

            <Button
              variant="outlined"
              size="small"
              onClick={() => setSelectedStudent(null)}
              style={{
                minWidth: "auto",
                padding: "8px",
                borderRadius: "8px",
                color: "#6c757d",
                borderColor: "#e8eaed",
                marginRight: "8px",
              }}
            >
              ✕
            </Button>

            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setID(selectedStudent._id);
                setNewName(selectedStudent.name);
                setNewLastName(selectedStudent.lastName);
                setNewCpf(selectedStudent.doc);
                setNewEmail(selectedStudent.email);
                setNewPhone(selectedStudent.phoneNumber);
                setNewAddress(selectedStudent.address);
                setWeeklyClasses(selectedStudent.weeklyClasses);
                setNewDateOfBirth(
                  selectedStudent.dateOfBirth
                    ? selectedStudent.dateOfBirth.split("T")[0]
                    : ""
                );
                setGoogleDriveLink(selectedStudent.googleDriveLink);
                setPermissions(selectedStudent.permissions);
                setFeeUpToDate(selectedStudent.feeUpToDate);
                setOnHold(selectedStudent.onHold);
                setTutoree(selectedStudent.tutoree);
                setTotalScore(selectedStudent.totalScore || 0);
                setMonthlyScore(selectedStudent.monthlyScore || 0);
                setHomeworkAssignmentsDone(
                  selectedStudent.homeworkAssignmentsDone || 0
                );
                setFlashcards25Reviews(
                  selectedStudent.flashcards25Reviews || 0
                );
                handleSeeModal();
              }}
              style={{
                minWidth: "auto",
                padding: "8px 12px",
                borderRadius: "8px",
                color: partnerColor(),
                borderColor: partnerColor(),
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              ✏️ Editar
            </Button>
          </div>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <Typography
                  style={{
                    color: "#6c757d",
                    fontSize: "11px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Username
                </Typography>
                <Typography
                  style={{
                    fontWeight: "500",
                    color: "#2c3e50",
                    fontSize: "14px",
                  }}
                >
                  {selectedStudent.username || "N/A"}
                </Typography>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <Typography
                  style={{
                    color: "#6c757d",
                    fontSize: "11px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  CPF/Documento
                </Typography>
                <Typography
                  style={{
                    fontWeight: "500",
                    color: "#2c3e50",
                    fontSize: "14px",
                    fontFamily: "monospace",
                  }}
                >
                  {selectedStudent.doc || "N/A"}
                </Typography>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <Typography
                  style={{
                    color: "#6c757d",
                    fontSize: "11px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Telefone
                </Typography>
                <Typography
                  style={{
                    fontWeight: "500",
                    color: "#2c3e50",
                    fontSize: "14px",
                  }}
                >
                  {selectedStudent.phoneNumber || "N/A"}
                </Typography>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <Typography
                  style={{
                    color: "#6c757d",
                    fontSize: "11px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Data Nascimento
                </Typography>
                <Typography
                  style={{
                    fontWeight: "500",
                    color: "#2c3e50",
                    fontSize: "14px",
                  }}
                >
                  {selectedStudent.dateOfBirth
                    ? formatDateBr(
                        new Date(selectedStudent.dateOfBirth).setDate(
                          new Date(selectedStudent.dateOfBirth).getDate() + 1
                        )
                      )
                    : "N/A"}
                </Typography>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <Typography
                  style={{
                    color: "#6c757d",
                    fontSize: "11px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Pontuação Total
                </Typography>
                <Typography
                  style={{
                    fontWeight: "600",
                    color: "#2c3e50",
                    fontSize: "16px",
                  }}
                >
                  {selectedStudent.totalScore || "0"}
                </Typography>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <Typography
                  style={{
                    color: "#6c757d",
                    fontSize: "11px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Pontuação Mensal
                </Typography>
                <Typography
                  style={{
                    fontWeight: "600",
                    color: "#34495e",
                    fontSize: "16px",
                  }}
                >
                  {selectedStudent.monthlyScore || "0"}
                </Typography>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <Typography
                  style={{
                    color: "#6c757d",
                    fontSize: "11px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Aulas/Semana
                </Typography>
                <Typography
                  style={{
                    fontWeight: "500",
                    color: "#2c3e50",
                    fontSize: "14px",
                  }}
                >
                  {selectedStudent.weeklyClasses || "N/A"}
                </Typography>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <Typography
                  style={{
                    color: "#6c757d",
                    fontSize: "11px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Google Drive
                </Typography>
                {selectedStudent.googleDriveLink ? (
                  <a
                    href={selectedStudent.googleDriveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: partnerColor(),
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.textDecoration = "underline";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.textDecoration = "none";
                    }}
                  >
                    Acessar Drive
                  </a>
                ) : (
                  <Typography
                    style={{
                      fontWeight: "500",
                      color: "#6c757d",
                      fontSize: "14px",
                    }}
                  >
                    N/A
                  </Typography>
                )}
              </div>
            </Grid>

            {selectedStudent.address && (
              <Grid item xs={12}>
                <div style={{ marginBottom: "16px" }}>
                  <Typography
                    style={{
                      color: "#6c757d",
                      fontSize: "11px",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Endereço
                  </Typography>
                  <Typography
                    style={{
                      fontWeight: "500",
                      color: "#2c3e50",
                      fontSize: "14px",
                    }}
                  >
                    {selectedStudent.address}
                  </Typography>
                </div>
              </Grid>
            )}
          </Grid>
        </div>
      )}

      {!loading ? (
        <div
          style={{
            backgroundColor: "#ffffff",
            margin: "auto",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
            border: "1px solid #e8eaed",
            maxWidth: "70rem",
            maxHeight: "30rem",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              marginBottom: "1rem",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input
              style={{
                width: "100%",
                padding: "12px 16px",
                margin: "12px",
                border: "1px solid #e8eaed",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                transition: "all 0.2s ease",
                backgroundColor: "#ffffff",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
              type="text"
              placeholder="Pesquisar aluno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = partnerColor();
                e.target.style.boxShadow = `0 0 0 3px ${partnerColor()}20`;
                ("");
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e8eaed";
                e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
              }}
            />
          </div>
          <TableContainer
            style={{
              maxHeight: "30rem",
              overflowX: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "#ddd transparent",
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell style={stickyHeaderStyle}>
                    <span style={cellTable}>Foto</span>
                  </TableCell>
                  <TableCell style={stickyHeaderStyle}>
                    <span style={cellTable}>Nome Completo</span>
                  </TableCell>
                  <TableCell style={stickyHeaderStyle}>
                    <span style={cellTable}>Email</span>
                  </TableCell>
                  <TableCell style={stickyHeaderStyle}>
                    <span style={cellTable}>Permissões</span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students
                  .filter((student) =>
                    student.fullname
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((student, index) => (
                    <TableRow
                      key={index}
                      onClick={() => {
                        setSelectedStudent(student);
                      }}
                      style={{
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#f8f9fa",
                        },
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f8f9fa";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <TableCell style={cellTable}>
                        <img
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "2px solid #e8eaed",
                          }}
                          src={
                            student.picture ||
                            "https://ik.imagekit.io/vjz75qw96/logos/myp?updatedAt=1752031657485"
                          }
                          alt=""
                        />
                      </TableCell>
                      <TableCell style={cellTable}>
                        <span style={{ fontWeight: "500", color: "#2c3e50" }}>
                          {student.fullname}
                        </span>
                      </TableCell>
                      <TableCell style={cellTable}>
                        <span style={{ color: "#495057" }}>
                          {student.email}
                        </span>
                      </TableCell>
                      <TableCell style={cellTable}>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "500",
                            backgroundColor:
                              student.permissions === "superadmin"
                                ? "#e3f2fd"
                                : student.permissions === "teacher"
                                ? "#f3e5f5"
                                : "#e8f5e8",
                            color:
                              student.permissions === "superadmin"
                                ? "#1976d2"
                                : student.permissions === "teacher"
                                ? "#7b1fa2"
                                : "#388e3c",
                          }}
                        >
                          {student.permissions}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>Carregando dados</p>
          <CircularProgress style={{ color: partnerColor() }} />
        </div>
      )}

      {/* SEÇÃO DE ESTATÍSTICAS GERAIS */}
      {!loading && students.length > 0 && (
        <div
          style={{
            backgroundColor: "#fafbfc",
            margin: "auto",
            marginTop: "16px",
            borderRadius: "8px",
            border: "1px solid #e8eaed",
            maxWidth: "70rem",
            padding: "12px 16px",
          }}
        >
          <Typography
            variant="body2"
            style={{
              marginBottom: "8px",
              fontWeight: "500",
              color: "#6c757d",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Resumo
          </Typography>

          <Grid container spacing={1}>
            <Grid item xs={3}>
              <div
                style={{
                  textAlign: "center",
                  padding: "8px 4px",
                  backgroundColor: "#ffffff",
                  borderRadius: "6px",
                  border: "1px solid #e8eaed",
                }}
              >
                <Typography
                  style={{
                    color: "#6c757d",
                    fontSize: "10px",
                    marginBottom: "2px",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                  }}
                >
                  Total
                </Typography>
                <Typography
                  style={{
                    fontWeight: "600",
                    color: "#2c3e50",
                    fontSize: "14px",
                  }}
                >
                  {students.length}
                </Typography>
              </div>
            </Grid>

            <Grid item xs={3}>
              <div
                style={{
                  textAlign: "center",
                  padding: "8px 4px",
                  backgroundColor: "#ffffff",
                  borderRadius: "6px",
                  border: "1px solid #e8eaed",
                }}
              >
                <Typography
                  style={{
                    color: "#6c757d",
                    fontSize: "10px",
                    marginBottom: "2px",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                  }}
                >
                  Professores
                </Typography>
                <Typography
                  style={{
                    fontWeight: "600",
                    color: "#7b1fa2",
                    fontSize: "14px",
                  }}
                >
                  {students.filter((s) => s.permissions === "teacher").length}
                </Typography>
              </div>
            </Grid>

            <Grid item xs={3}>
              <div
                style={{
                  textAlign: "center",
                  padding: "8px 4px",
                  backgroundColor: "#ffffff",
                  borderRadius: "6px",
                  border: "1px solid #e8eaed",
                }}
              >
                <Typography
                  style={{
                    color: "#6c757d",
                    fontSize: "10px",
                    marginBottom: "2px",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                  }}
                >
                  Alunos
                </Typography>
                <Typography
                  style={{
                    fontWeight: "600",
                    color: "#388e3c",
                    fontSize: "14px",
                  }}
                >
                  {students.filter((s) => s.permissions === "student").length}
                </Typography>
              </div>
            </Grid>

            <Grid item xs={3}>
              <div
                style={{
                  textAlign: "center",
                  padding: "8px 4px",
                  backgroundColor: "#ffffff",
                  borderRadius: "6px",
                  border: "1px solid #e8eaed",
                }}
              >
                <Typography
                  style={{
                    color: "#6c757d",
                    fontSize: "10px",
                    marginBottom: "2px",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                  }}
                >
                  Admins
                </Typography>
                <Typography
                  style={{
                    fontWeight: "600",
                    color: "#1976d2",
                    fontSize: "14px",
                  }}
                >
                  {
                    students.filter((s) => s.permissions === "superadmin")
                      .length
                  }
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
      )}

      <Dialog
        open={isVisible}
        onClose={handleSeeModal}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          style: {
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            border: "1px solid #e8eaed",
          },
        }}
      >
        <DialogTitle style={{ padding: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "24px 32px",
              borderBottom: "1px solid #e8eaed",
              backgroundColor: "#fafbfc",
            }}
          >
            <div>
              <Typography
                variant="h5"
                style={{
                  fontWeight: "600",
                  color: "#2c3e50",
                  marginBottom: "4px",
                }}
              >
                {newName} {newLastName}
              </Typography>
              <Typography
                variant="body2"
                style={{
                  color: "#6c757d",
                  fontWeight: "400",
                }}
              >
                Gerenciar informações do aluno
              </Typography>
            </div>
            <Button
              onClick={handleSeeModal}
              style={{
                minWidth: "auto",
                padding: "8px",
                borderRadius: "8px",
                color: "#6c757d",
              }}
            >
              <CloseIcon />
            </Button>
          </div>
        </DialogTitle>

        <DialogContent style={{ padding: "32px", backgroundColor: "#ffffff" }}>
          {/* SEÇÃO 1: INFORMAÇÕES BÁSICAS */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "24px",
              borderRadius: "12px",
              marginBottom: "24px",
              border: "1px solid #e8eaed",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <Typography
              variant="h6"
              style={{
                marginBottom: "20px",
                fontWeight: "600",
                color: "#2c3e50",
                fontSize: "16px",
              }}
            >
              Informações Básicas
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "#fafbfc",
                      "& fieldset": {
                        borderColor: "#e8eaed",
                      },
                      "&:hover fieldset": {
                        borderColor: "#c3c4c7",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: partnerColor(),
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6c757d",
                      fontSize: "14px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Sobrenome"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "#fafbfc",
                      "& fieldset": {
                        borderColor: "#e8eaed",
                      },
                      "&:hover fieldset": {
                        borderColor: "#c3c4c7",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: partnerColor(),
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6c757d",
                      fontSize: "14px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CPF"
                  value={newCpf}
                  onChange={handleCpfChange}
                  variant="outlined"
                  size="small"
                  error={!isCpfValid}
                  helperText={
                    !isCpfValid && newCpf
                      ? "CPF inválido. Formato: 000.000.000-00"
                      : ""
                  }
                  placeholder="000.000.000-00"
                  inputProps={{
                    maxLength: 14,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "#fafbfc",
                      "& fieldset": {
                        borderColor: !isCpfValid ? "#e74c3c" : "#e8eaed",
                      },
                      "&:hover fieldset": {
                        borderColor: !isCpfValid ? "#e74c3c" : "#c3c4c7",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: !isCpfValid ? "#e74c3c" : partnerColor(),
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6c757d",
                      fontSize: "14px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="E-mail"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "#fafbfc",
                      "& fieldset": { borderColor: "#e8eaed" },
                      "&:hover fieldset": { borderColor: "#c3c4c7" },
                      "&.Mui-focused fieldset": { borderColor: partnerColor() },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6c757d",
                      fontSize: "14px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "#fafbfc",
                      "& fieldset": { borderColor: "#e8eaed" },
                      "&:hover fieldset": { borderColor: "#c3c4c7" },
                      "&.Mui-focused fieldset": { borderColor: partnerColor() },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6c757d",
                      fontSize: "14px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Endereço"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "#fafbfc",
                      "& fieldset": { borderColor: "#e8eaed" },
                      "&:hover fieldset": { borderColor: "#c3c4c7" },
                      "&.Mui-focused fieldset": { borderColor: partnerColor() },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6c757d",
                      fontSize: "14px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Aulas por semana"
                  value={weeklyClasses}
                  onChange={(e) => setWeeklyClasses(e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Data de Nascimento"
                  value={newDateOfBirth}
                  onChange={(e) => setNewDateOfBirth(e.target.value)}
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Link Google Drive"
                  value={googleDriveLink}
                  onChange={(e) => setGoogleDriveLink(e.target.value)}
                  size="small"
                />
              </Grid>
            </Grid>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "24px",
              }}
            >
              <Button
                variant="contained"
                onClick={() => editStudent(ID)}
                style={{
                  backgroundColor: partnerColor(),
                  color: "#fff",
                  fontWeight: "500",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "14px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Salvar Informações
              </Button>
            </div>
          </div>

          {/* SEÇÃO 2: PERMISSÕES */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "24px",
              borderRadius: "12px",
              marginBottom: "24px",
              border: "1px solid #e8eaed",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <Typography
              variant="h6"
              style={{
                marginBottom: "20px",
                fontWeight: "600",
                color: "#2c3e50",
                fontSize: "16px",
              }}
            >
              Permissões
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel style={{ color: "#6c757d", fontSize: "14px" }}>
                    Permissões
                  </InputLabel>
                  <Select
                    value={permissions}
                    label="Permissões"
                    onChange={(e) => setPermissions(e.target.value)}
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: "#fafbfc",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e8eaed",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#c3c4c7",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: partnerColor(),
                      },
                    }}
                  >
                    <MenuItem value="student">Aluno</MenuItem>
                    <MenuItem value="teacher">Professor</MenuItem>
                    <MenuItem value="superadmin">Admin</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={() => editStudentPermissions(ID)}
                  style={{
                    marginTop: "16px",
                    backgroundColor: partnerColor(),
                    color: "#fff",
                    fontWeight: "500",
                    padding: "10px 24px",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "14px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  Salvar Permissões
                </Button>
              </Grid>
            </Grid>
          </div>
          {/* SEÇÃO 3: PONTUAÇÃO */}
          {isArthurVincent && (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "24px",
                borderRadius: "12px",
                marginBottom: "24px",
                border: "1px solid #e8eaed",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <Typography
                variant="h6"
                style={{
                  marginBottom: "20px",
                  fontWeight: "600",
                  color: "#2c3e50",
                  fontSize: "16px",
                }}
              >
                Pontuação
              </Typography>

              <Grid container spacing={3} style={{ marginBottom: "24px" }}>
                <Grid item xs={6} md={3}>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      backgroundColor: "#fafbfc",
                      borderRadius: "8px",
                      border: "1px solid #e8eaed",
                    }}
                  >
                    <Typography
                      variant="body2"
                      style={{
                        color: "#6c757d",
                        fontSize: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      Total
                    </Typography>
                    <Typography
                      variant="h6"
                      style={{
                        fontWeight: "600",
                        color: "#2c3e50",
                        fontSize: "20px",
                      }}
                    >
                      {formatNumber(totalScore || 0)}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={6} md={3}>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      backgroundColor: "#fafbfc",
                      borderRadius: "8px",
                      border: "1px solid #e8eaed",
                    }}
                  >
                    <Typography
                      variant="body2"
                      style={{
                        color: "#6c757d",
                        fontSize: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      Mensal
                    </Typography>
                    <Typography
                      variant="h6"
                      style={{
                        fontWeight: "600",
                        color: "#2c3e50",
                        fontSize: "20px",
                      }}
                    >
                      {formatNumber(monthlyScore || 0)}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={6} md={3}>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      backgroundColor: "#fafbfc",
                      borderRadius: "8px",
                      border: "1px solid #e8eaed",
                    }}
                  >
                    <Typography
                      variant="body2"
                      style={{
                        color: "#6c757d",
                        fontSize: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      Homework
                    </Typography>
                    <Typography
                      variant="h6"
                      style={{
                        fontWeight: "600",
                        color: "#2c3e50",
                        fontSize: "20px",
                      }}
                    >
                      {formatNumber(homeworkAssignmentsDone || 0)}
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={6} md={3}>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      backgroundColor: "#fafbfc",
                      borderRadius: "8px",
                      border: "1px solid #e8eaed",
                    }}
                  >
                    <Typography
                      variant="body2"
                      style={{
                        color: "#6c757d",
                        fontSize: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      Flashcards
                    </Typography>
                    <Typography
                      variant="h6"
                      style={{
                        fontWeight: "600",
                        color: "#2c3e50",
                        fontSize: "20px",
                      }}
                    >
                      {formatNumber(flashcards25Reviews || 0)}
                    </Typography>
                  </div>
                </Grid>
              </Grid>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginBottom: "24px",
                }}
              >
                {listOfButtons.map((item, index) => (
                  <ArvinButton
                    key={index}
                    disabled={disabled}
                    style={{
                      fontSize: "14px",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      textTransform: "none",
                      fontWeight: "500",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                    color={item.color}
                    onClick={() =>
                      submitPlusScore(
                        ID,
                        item.score,
                        item.description,
                        item.category
                      )
                    }
                  >
                    {item.text}
                  </ArvinButton>
                ))}
              </div>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Pontuação extra"
                    placeholder="Score"
                    onChange={(e) => setPlusScore(Number(e.target.value))}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#fafbfc",
                        borderRadius: "8px",
                        "& fieldset": {
                          borderColor: "#e8eaed",
                        },
                        "&:hover fieldset": {
                          borderColor: "#c3c4c7",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: partnerColor(),
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#6c757d",
                        fontSize: "14px",
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "14px",
                        color: "#2c3e50",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Descrição da pontuação"
                    placeholder="Ex: Participação extra"
                    onChange={(e) => setDescSpecial(e.target.value)}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#fafbfc",
                        borderRadius: "8px",
                        "& fieldset": {
                          borderColor: "#e8eaed",
                        },
                        "&:hover fieldset": {
                          borderColor: "#c3c4c7",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: partnerColor(),
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#6c757d",
                        fontSize: "14px",
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "14px",
                        color: "#2c3e50",
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "20px",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() =>
                    submitPlusScore(ID, plusScore, descSpecial, "Others")
                  }
                  disabled={disabled}
                  style={{
                    fontWeight: "500",
                    padding: "10px 24px",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "14px",
                    borderColor: partnerColor(),
                    color: partnerColor(),
                  }}
                >
                  Adicionar Pontuação
                </Button>
              </div>
            </div>
          )}
          {/* SEÇÃO 4: CONFIGURAÇÕES */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "24px",
              borderRadius: "12px",
              marginBottom: "24px",
              border: "1px solid #e8eaed",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <Typography
              variant="h6"
              style={{
                marginBottom: "20px",
                fontWeight: "600",
                color: "#2c3e50",
                fontSize: "16px",
              }}
            >
              Configurações
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={feeUpToDate}
                      onChange={() => {
                        updateFeeStatus(ID);
                        setFeeUpToDate(!feeUpToDate);
                      }}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: partnerColor(),
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: partnerColor(),
                          },
                      }}
                    />
                  }
                  label={
                    <Typography style={{ fontSize: "14px", color: "#2c3e50" }}>
                      {feeUpToDate
                        ? "Mensalidade em dia"
                        : "Mensalidade atrasada"}
                    </Typography>
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!onHold}
                      onChange={() => {
                        updateOnHold(ID);
                        setOnHold(!onHold);
                      }}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: partnerColor(),
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: partnerColor(),
                          },
                      }}
                    />
                  }
                  label={
                    <Typography style={{ fontSize: "14px", color: "#2c3e50" }}>
                      {onHold ? "Matrícula Trancada" : "Matrícula Ativa"}
                    </Typography>
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={tutoree}
                      onChange={() => {
                        updateTutoree(ID);
                        setTutoree(!tutoree);
                      }}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: partnerColor(),
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: partnerColor(),
                          },
                      }}
                    />
                  }
                  label={
                    <Typography style={{ fontSize: "14px", color: "#2c3e50" }}>
                      {tutoree ? "Aluno de monitoria" : "Sem monitoria"}
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
          </div>

          {/* SEÇÃO 5: ALTERAR SENHA */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "24px",
              borderRadius: "12px",
              marginBottom: "24px",
              border: "1px solid #e8eaed",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <Typography
              variant="h6"
              style={{
                marginBottom: "20px",
                fontWeight: "600",
                color: "#2c3e50",
                fontSize: "16px",
              }}
            >
              Alterar Senha
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="password"
                  label="Nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fafbfc",
                      borderRadius: "8px",
                      "& fieldset": {
                        borderColor: "#e8eaed",
                      },
                      "&:hover fieldset": {
                        borderColor: "#c3c4c7",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: partnerColor(),
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6c757d",
                      fontSize: "14px",
                    },
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      color: "#2c3e50",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="password"
                  label="Confirmar senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fafbfc",
                      borderRadius: "8px",
                      "& fieldset": {
                        borderColor: "#e8eaed",
                      },
                      "&:hover fieldset": {
                        borderColor: "#c3c4c7",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: partnerColor(),
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6c757d",
                      fontSize: "14px",
                    },
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                      color: "#2c3e50",
                    },
                  }}
                />
              </Grid>
            </Grid>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <Button
                variant="contained"
                onClick={() => editStudentPassword(ID)}
                disabled={!newPassword || newPassword !== confirmPassword}
                style={{
                  backgroundColor: partnerColor(),
                  color: "#fff",
                  fontWeight: "500",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "14px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Alterar Senha
              </Button>
            </div>
          </div>
        </DialogContent>

        <DialogActions
          style={{
            padding: "24px",
            borderTop: "1px solid #e8eaed",
            justifyContent: "space-between",
            backgroundColor: "#fafbfc",
          }}
        >
          {!seeConfirmDelete ? (
            <>
              <Button
                color="error"
                variant="outlined"
                onClick={() => setSeeConfirmDelete(true)}
                style={{
                  fontWeight: "500",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "14px",
                  borderColor: "#dc3545",
                  color: "#dc3545",
                }}
              >
                Excluir Aluno
              </Button>
              <div style={{ display: "flex", gap: "12px" }}>
                <Button
                  onClick={handleSeeModal}
                  style={{
                    fontWeight: "500",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "14px",
                    color: "#6c757d",
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveAll}
                  style={{
                    backgroundColor: partnerColor(),
                    color: "#fff",
                    fontWeight: "500",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "14px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  Salvar Tudo
                </Button>
              </div>
            </>
          ) : (
            <div style={{ width: "100%", textAlign: "center" }}>
              <Typography
                style={{
                  color: "#dc3545",
                  fontWeight: "600",
                  fontSize: "16px",
                  marginBottom: "12px",
                }}
              >
                Confirmar Exclusão
              </Typography>
              <Typography
                style={{
                  color: "#6c757d",
                  fontSize: "14px",
                  marginBottom: "20px",
                }}
              >
                Tem certeza que deseja excluir{" "}
                <strong style={{ color: "#2c3e50" }}>
                  {newName} {newLastName}
                </strong>
                ?
                <br />
                <small>Esta ação não pode ser desfeita.</small>
              </Typography>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "12px",
                  marginTop: "20px",
                }}
              >
                <Button
                  onClick={() => setSeeConfirmDelete(false)}
                  style={{
                    fontWeight: "500",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "14px",
                    color: "#6c757d",
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  onClick={handleDelete}
                  style={{
                    fontWeight: "500",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "14px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                  }}
                >
                  Confirmar Exclusão
                </Button>
              </div>
            </div>
          )}
        </DialogActions>
      </Dialog>

      {isArthurVincent && (
        <Button
          variant="outlined"
          style={{
            display: isConfirmVisible ? "none" : "block",
            marginTop: "20px",
            backgroundColor: "#ffffff",
            borderColor: "#dc3545",
            color: "#dc3545",
            fontWeight: "500",
            padding: "12px 24px",
            borderRadius: "8px",
            textTransform: "none",
            fontSize: "14px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#dc3545",
              color: "#ffffff",
              transform: "translateY(-1px)",
              boxShadow: "0 2px 6px rgba(220,53,69,0.2)",
            },
          }}
          onDoubleClick={() => handleShowResetMonth()}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#dc3545";
            e.target.style.color = "#ffffff";
            e.target.style.transform = "translateY(-1px)";
            e.target.style.boxShadow = "0 2px 6px rgba(220,53,69,0.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#ffffff";
            e.target.style.color = "#dc3545";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
          }}
        >
          🔄 Resetar pontuações do mês
        </Button>
      )}
      <div style={{ display: hasReset ? "none" : "block" }}>
        <div style={{ display: isConfirmVisible ? "block" : "none" }}>
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "24px",
              borderRadius: "12px",
              marginTop: "20px",
              border: "1px solid #ffeaa7",
              boxShadow: "0 2px 8px rgba(255,193,7,0.1)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              style={{
                color: "#856404",
                fontWeight: "600",
                fontSize: "16px",
                marginBottom: "16px",
              }}
            >
              ⚠️ Confirmar Ação
            </Typography>
            <Typography
              style={{
                color: "#6c757d",
                fontSize: "14px",
                marginBottom: "24px",
                lineHeight: "1.5",
              }}
            >
              Tem certeza que deseja resetar pontuações do mês?
              <br />
              <small style={{ color: "#856404" }}>
                Esta ação irá zerar todas as pontuações mensais dos alunos.
              </small>
            </Typography>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                onDoubleClick={() => handleResetMonth()}
                style={{
                  backgroundColor: "#dc3545",
                  color: "#ffffff",
                  fontWeight: "500",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "14px",
                  boxShadow: "0 2px 4px rgba(220,53,69,0.2)",
                  minWidth: "100px",
                }}
              >
                Sim, Resetar
              </Button>
              <Button
                variant="outlined"
                onMouseOver={() => handleShowResetMonth()}
                onClick={() => handleShowResetMonth()}
                style={{
                  borderColor: "#6c757d",
                  color: "#6c757d",
                  fontWeight: "500",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "14px",
                  backgroundColor: "#ffffff",
                  minWidth: "100px",
                }}
              >
                Cancelar
              </Button>
            </div>

            <div
              style={{
                display: resetVisible ? "block" : "none",
                marginTop: "20px",
                padding: "12px",
                backgroundColor: "#d4edda",
                borderRadius: "8px",
                border: "1px solid #c3e6cb",
              }}
            >
              <Typography
                style={{
                  color: "#155724",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                ✅ Pontuações do mês resetadas com sucesso!
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FindStudent;
