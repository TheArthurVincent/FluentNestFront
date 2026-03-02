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
  Switch,
  FormControlLabel,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  alwaysWhite,
  partnerColor,
  textPrimaryColorContrast,
} from "../../../../Styles/Styles";
import { HOne } from "../../../../Resources/Components/RouteBox";
import { HThree } from "../../../MyClasses/MyClasses.Styled";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { listOfButtons } from "../../../Ranking/RankingComponents/ListOfCriteria";
import { isArthurVincent } from "../../../../App";
import {
  formatCPF,
  formatPhoneNumber,
} from "../../../../Resources/Components/ItemsLibrary";
import AllStudents from "../FindStudentAssets/NewStudent";

export function FindTeacher({ headers, id, plan }) {
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
  const [fee, setFee] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [goldVisible, setGoldVisible] = useState(false);
  const [seeConfirmDelete, setSeeConfirmDelete] = useState(false);
  const [seePermissionsOrNot, setSeePermissionsOrNot] = useState(false);
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
  const [tutoree, setTutoree] = useState(false);
  const [isAdm, setIsAdm] = useState(false);
  const [onHold, setOnHold] = useState(false);
  const [replenish, setReplenish] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [seeFinanceHistory, setSeeFinanceHistory] = useState(false);
  const [seeClassesHistory, setSeeClassesHistory] = useState(false);
  const [seeGroupClassesHistory, setSeeGroupClassesHistory] = useState(false);
  const [eventsList, setEventsList] = useState([]);
  const [loadingEventsList, setLoadingEventsList] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [descSpecial, setDescSpecial] = useState("");
  const [plusScore, setPlusScore] = useState(0);

  const isMobile = window.innerWidth <= 700;

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

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${backDomain}/api/v1/teachers/${id}`, {
        headers,
      });
      setStudents(response.data.listOfTeachers || []);
      setLoading(false);
    } catch (error) {
      notifyAlert("Erro ao encontrar professores");
      setLoading(false);
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
      weeklyClasses: Number(weeklyClasses),
      permissions: permissions,
      googleDriveLink: googleDriveLink,
      address: newAddress,
      fee: Number(fee),
      picture: picture,
      doc: newCpf.replace(/\D/g, ""),
    };

    try {
      await axios.put(`${backDomain}/api/v1/students/${id}`, editedStudent, {
        headers,
      });
      notifyAlert("Usuário editado com sucesso!", partnerColor());
      setSelectedStudent(null);
      handleSeeModal();
      fetchStudents();
    } catch (error) {
      notifyAlert("Erro ao editar usuário", "red");
      handleSeeModal();
    }
  };

  const editStudentPermissions = async (id) => {
    let editedStudent = {
      permissions: permissions,
    };
    try {
      await axios.put(
        `${backDomain}/api/v1/studentpermissions/${id}`,
        editedStudent,
        { headers }
      );

      if (selectedStudent && selectedStudent.id === id) {
        setSelectedStudent({
          ...selectedStudent,
          permissions: permissions,
        });
      }

      handleSeeModal();
      fetchStudents();
      notifyAlert("Permissões editadas com sucesso!", partnerColor());
    } catch (error) {
      notifyAlert("Erro ao editar permissões", "red");
      handleSeeModal();
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`${backDomain}/api/v1/students/${id}`, { headers });
      notifyAlert("Aluno excluído");
      fetchStudents();
      handleSeeModal();
      window.location.reload();
    } catch (error) {
      notifyAlert(error);
      handleSeeModal();
      console.error(error);
    }
  };

  const handleSeeClassesHistory = async (id) => {
    setLoadingEventsList(true);
    setEventsList([]);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/event-one-student/${id}`,
        {
          headers,
        }
      );

      setEventsList(response.data.events);
      setTimeout(() => {
        setLoadingEventsList(false);
      }, 100);
    } catch (error) {
      notifyAlert("Erro ao buscar histórico de aulas Individuais");
      setSeeClassesHistory(!seeClassesHistory);
      setLoadingEventsList(false);
    }
  };

  const handleSeeGroupClassesHistory = async (id) => {
    setLoadingEventsList(true);
    setEventsList([]);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/event-one-student-group/${id}`,
        {
          headers,
        }
      );

      setEventsList(response.data.events);
      setTimeout(() => {
        setLoadingEventsList(false);
      }, 100);
    } catch (error) {
      notifyAlert("Erro ao buscar histórico de aulas da turma");
      setSeeGroupClassesHistory(!seeGroupClassesHistory);
      setLoadingEventsList(false);
    }
  };

  const cellTable = {
    whiteSpace: "nowrap",
    padding: "10px 16px",
    fontSize: "11px",
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

  const updateTutoree = async (id) => {
    setLoadingPermissions(true);
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/tutoree/${id}`,
        {},
        { headers }
      );

      setTutoree(response.data.tutoree);
      fetchStudents();
      setLoadingPermissions(false);
    } catch (error) {
      notifyAlert("Erro ao atualizar tutoria");
      setLoadingPermissions(false);
    }
  };

  const updateFeeStatus = async (id) => {
    setLoadingPermissions(true);

    try {
      const response = await axios.put(
        `${backDomain}/api/v1/feeuptodate/${id}`,
        {},
        {
          headers,
        }
      );

      setFeeUpToDate(response.data.feeUpToDate);
      fetchStudents();
      setLoadingPermissions(false);
    } catch (error) {
      setLoadingPermissions(false);
      console.error("error", error);
    }
  };

  const updateReplenish = async (id) => {
    setLoadingPermissions(true);
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/replenish/${id}`,
        {},
        {
          headers,
        }
      );

      setReplenish(response.data.replenishTarget);
      fetchStudents();
      setLoadingPermissions(false);
    } catch (error) {
      setLoadingPermissions(false);
      console.log("error", error);
    }
  };

  const updateOnHold = async (id) => {
    setLoadingPermissions(true);
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/onhold/${id}`,
        {},
        {
          headers,
        }
      );

      setOnHold(response.data.onHold);
      fetchStudents();
      setLoadingPermissions(false);
    } catch (error) {
      setLoadingPermissions(false);
      console.log("error", error);
    }
  };

  const handleSaveAll = () => {
    if (!ID) return;
    editStudent(ID);
    editStudentPermissions(ID);
  };

  const handleDelete = () => {
    if (!ID) return;
    deleteStudent(ID);
  };

  const formatCpf = (value) => {
    const onlyNumbers = value.replace(/\D/g, "");
    const limitedNumbers = onlyNumbers.slice(0, 11);

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

  const validateCpf = (cpf) => {
    const onlyNumbers = cpf.replace(/\D/g, "");
    if (onlyNumbers.length !== 11) return false;
    if (/^(\d)\1+$/.test(onlyNumbers)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(onlyNumbers[i]) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 > 9) digit1 = 0;
    if (parseInt(onlyNumbers[9]) !== digit1) return false;

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
      notifyAlert("Pontuação atualizada com sucesso!", partnerColor());
      await updateScoreNow(id);
      setDisabled(false);
    } catch (error) {
      notifyAlert("Erro ao atualizar pontuação", "red");
      setDisabled(false);
    }
  };

  const editStudentPassword = async (id) => {
    if (newPassword === confirmPassword) {
      try {
        await axios.put(
          `${backDomain}/api/v1/studentpassword/${id}`,
          { newPassword },
          { headers }
        );
        notifyAlert("Senha editada com sucesso!", partnerColor());
        fetchStudents();
        handleSeeModal();
      } catch (error) {
        notifyAlert("Erro ao editar senha", "red");
        handleSeeModal();
      }
    } else {
      notifyAlert("As senhas são diferentes");
    }
  };

  const getMaskedCardNumber = (number) => {
    if (!number) return "N/A";
    const digits = number.replace(/\s/g, "");
    if (digits.length < 4) return "****";
    return `**** **** **** ${digits.slice(-4)}`;
  };

  const formatBirthForDetails = (dob) => {
    if (!dob) return "N/A";
    // se vier ISO
    if (typeof dob === "string" && dob.includes("T")) {
      const d = new Date(dob);
      if (isNaN(d.getTime())) return dob;
      return formatDateBr(d);
    }
    // se vier já como dd/MM/yyyy
    if (typeof dob === "string") return dob;
    try {
      const d = new Date(dob);
      if (isNaN(d.getTime())) return "N/A";
      return formatDateBr(d);
    } catch {
      return "N/A";
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <>
      {/* CARD DE DETALHES DO PROFESSOR SELECIONADO */}
      {selectedStudent && (
        <div
          style={{
            backgroundColor: "#ffffff",
            margin: "auto",
            marginBottom: "24px",
            borderRadius: "4px",
            boxShadow:
              "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
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
                <div
                  style={{
                    fontWeight: "600",
                    color: "#2c3e50",
                    fontSize: "18px",
                    marginBottom: "4px",
                  }}
                >
                  {selectedStudent.name} {selectedStudent.lastname}
                </div>
                <div
                  style={{
                    color: "#6c757d",
                    fontSize: "11px",
                  }}
                >
                  {selectedStudent.email}
                </div>
                {selectedStudent.fullname && (
                  <div
                    style={{
                      color: "#6c757d",
                      fontSize: "10px",
                    }}
                  >
                    {selectedStudent.fullname}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {selectedStudent.creditCardPayment && (
                <div
                  style={{
                    padding: "4px 8px",
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 500,
                    backgroundColor: "#e3f2fd",
                    color: "#1976d2",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <i className="fa fa-credit-card" />
                  Cartão Ativo
                </div>
              )}
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setID(selectedStudent.id);
                  setTutoree(selectedStudent.tutoree);
                  setFeeUpToDate(selectedStudent.feeUpToDate);
                  setNewName(selectedStudent.name);
                  setNewLastName(selectedStudent.lastname);
                  setNewCpf(selectedStudent.doc || "");
                  setNewEmail(selectedStudent.email);
                  setNewPhone(selectedStudent.phoneNumber);
                  setNewAddress(selectedStudent.address);
                  setWeeklyClasses(selectedStudent.weeklyClasses || 1);
                  setNewDateOfBirth(
                    selectedStudent.dateOfBirth &&
                      selectedStudent.dateOfBirth.includes("T")
                      ? selectedStudent.dateOfBirth.split("T")[0]
                      : ""
                  );
                  setGoogleDriveLink(selectedStudent.googleDriveLink || "");
                  setPermissions(selectedStudent.permissions);
                  setOnHold(selectedStudent.onHold);
                  setReplenish(selectedStudent.replenishTarget || false);
                  setTutoree(selectedStudent.tutoree);
                  setFee(selectedStudent.fee || 0);
                  setTotalScore(selectedStudent.totalScore || 0);
                  setMonthlyScore(selectedStudent.monthlyScore || 0);
                  handleSeeModal();
                }}
                style={{
                  minWidth: "auto",
                  padding: "8px 10px",
                  borderRadius: "4px",
                  color: partnerColor(),
                  borderColor: partnerColor(),
                  fontSize: "8px",
                  fontWeight: "500",
                }}
              >
                ✏️ Editar
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setSelectedStudent(null)}
                style={{
                  minWidth: "auto",
                  padding: "8px",
                  borderRadius: "4px",
                  color: "#6c757d",
                  borderColor: "#e8eaed",
                }}
              >
                ✕
              </Button>
            </div>
          </div>

          <Grid container spacing={3}>
            {/* Username */}
            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    color: "#6c757d",
                    fontSize: "8px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Username
                </div>
                <div
                  style={{
                    fontWeight: "500",
                    color: "#2c3e50",
                    fontSize: "11px",
                  }}
                >
                  {selectedStudent.username || "N/A"}
                </div>
              </div>
            </Grid>

            {/* CPF */}
            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    color: "#6c757d",
                    fontSize: "8px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  CPF/Documento
                </div>
                <div
                  style={{
                    fontWeight: "500",
                    color: "#2c3e50",
                    fontSize: "11px",
                  }}
                >
                  {selectedStudent.doc ? formatCPF(selectedStudent.doc) : "N/A"}
                </div>
              </div>
            </Grid>

            {/* Telefone */}
            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    color: "#6c757d",
                    fontSize: "8px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Telefone
                </div>
                <div
                  style={{
                    fontWeight: "500",
                    color: "#2c3e50",
                    fontSize: "11px",
                  }}
                >
                  {selectedStudent.phoneNumber
                    ? formatPhoneNumber(selectedStudent.phoneNumber)
                    : "N/A"}
                </div>
              </div>
            </Grid>

            {/* Data de nascimento */}
            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    color: "#6c757d",
                    fontSize: "8px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Data Nascimento
                </div>
                <div
                  style={{
                    fontWeight: "500",
                    color: "#2c3e50",
                    fontSize: "11px",
                  }}
                >
                  {formatBirthForDetails(selectedStudent.dateOfBirth)}
                </div>
              </div>
            </Grid>

            {/* Status Mensalidade */}
            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    color: "#6c757d",
                    fontSize: "8px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Status Mensalidade
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "8px",
                    fontWeight: "500",
                    backgroundColor: selectedStudent.feeUpToDate
                      ? "#d4f6d4"
                      : "#ffe6e6",
                    color: selectedStudent.feeUpToDate ? "#2d7d32" : "#d32f2f",
                  }}
                >
                  {selectedStudent.feeUpToDate ? (
                    <>
                      <i
                        className="fa fa-check-circle"
                        style={{ marginRight: "4px" }}
                      />
                      Em dia
                    </>
                  ) : (
                    <>
                      <i
                        className="fa fa-exclamation-circle"
                        style={{ marginRight: "4px" }}
                      />
                      Atrasada
                    </>
                  )}
                </div>
              </div>
            </Grid>

            {/* Status Matrícula */}
            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    color: "#6c757d",
                    fontSize: "8px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Status Matrícula
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "8px",
                    fontWeight: "500",
                    backgroundColor: selectedStudent.onHold
                      ? "#fff3cd"
                      : "#d4f6d4",
                    color: selectedStudent.onHold ? "#856404" : "#2d7d32",
                  }}
                >
                  {selectedStudent.onHold ? (
                    <>
                      <i
                        className="fa fa-pause-circle"
                        style={{ marginRight: "4px" }}
                      />
                      Trancada
                    </>
                  ) : (
                    <>
                      <i
                        className="fa fa-play-circle"
                        style={{ marginRight: "4px" }}
                      />
                      Ativa
                    </>
                  )}
                </div>
              </div>
            </Grid>

            {/* Permissões */}
            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    color: "#6c757d",
                    fontSize: "8px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Permissões
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "8px",
                    fontWeight: "500",
                    backgroundColor:
                      selectedStudent.permissions === "superadmin"
                        ? "#e3f2fd"
                        : selectedStudent.permissions === "teacher"
                        ? "#f3e5f5"
                        : "#e8f5e8",
                    color:
                      selectedStudent.permissions === "superadmin"
                        ? "#1976d2"
                        : selectedStudent.permissions === "teacher"
                        ? "#7b1fa2"
                        : "#388e3c",
                  }}
                >
                  {selectedStudent.permissions === "superadmin" && (
                    <i
                      className="fa fa-shield"
                      style={{ marginRight: "4px" }}
                    />
                  )}
                  {selectedStudent.permissions === "teacher" && (
                    <i
                      className="fa fa-graduation-cap"
                      style={{ marginRight: "4px" }}
                    />
                  )}
                  {selectedStudent.permissions === "student" && (
                    <i className="fa fa-user" style={{ marginRight: "4px" }} />
                  )}
                  {selectedStudent.permissions === "superadmin"
                    ? "Admin"
                    : selectedStudent.permissions === "teacher"
                    ? "Professor"
                    : "Aluno"}
                </div>
              </div>
            </Grid>

            {/* Weekly Classes */}
            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    color: "#6c757d",
                    fontSize: "8px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Aulas por semana
                </div>
                <div
                  style={{
                    fontWeight: "500",
                    color: "#2c3e50",
                    fontSize: "11px",
                  }}
                >
                  {selectedStudent.weeklyClasses || 0}
                </div>
              </div>
            </Grid>

            {/* Fee */}
            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    color: "#6c757d",
                    fontSize: "8px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Valor Mensalidade
                </div>
                <div
                  style={{
                    fontWeight: "500",
                    color: "#2c3e50",
                    fontSize: "11px",
                  }}
                >
                  {selectedStudent.fee
                    ? `R$ ${formatNumber(selectedStudent.fee)}`
                    : "N/A"}
                </div>
              </div>
            </Grid>

            {/* Score */}
            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    color: "#6c757d",
                    fontSize: "8px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Pontuação (Total / Mês)
                </div>
                <div
                  style={{
                    fontWeight: "500",
                    color: "#2c3e50",
                    fontSize: "11px",
                  }}
                >
                  {selectedStudent.totalScore || 0} /{" "}
                  {selectedStudent.monthlyScore || 0}
                </div>
              </div>
            </Grid>

            {/* Payment Method */}
            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    color: "#6c757d",
                    fontSize: "8px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Método Pagamento
                </div>
                <div
                  style={{
                    fontWeight: "500",
                    color: "#2c3e50",
                    fontSize: "11px",
                  }}
                >
                  {selectedStudent.paymentMethod || "N/A"}
                </div>
              </div>
            </Grid>

            {/* Limit Date */}
            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    color: "#6c757d",
                    fontSize: "8px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Acesso até
                </div>
                <div
                  style={{
                    fontWeight: "500",
                    color: "#2c3e50",
                    fontSize: "11px",
                  }}
                >
                  {selectedStudent.limitDate
                    ? formatDateBr(new Date(selectedStudent.limitDate))
                    : "N/A"}
                </div>
              </div>
            </Grid>

            {/* Limit Cancel Date */}
            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    color: "#6c757d",
                    fontSize: "8px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Limite Cancelamento
                </div>
                <div
                  style={{
                    fontWeight: "500",
                    color: "#2c3e50",
                    fontSize: "11px",
                  }}
                >
                  {selectedStudent.limitCancelDate
                    ? formatDateBr(new Date(selectedStudent.limitCancelDate))
                    : "N/A"}
                </div>
              </div>
            </Grid>

            {/* Asaas IDs */}
            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    color: "#6c757d",
                    fontSize: "8px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Asaas Customer ID
                </div>
                <div
                  style={{
                    fontWeight: "500",
                    color: "#2c3e50",
                    fontSize: "11px",
                  }}
                >
                  {selectedStudent.asaasCustomerId || "N/A"}
                </div>
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    color: "#6c757d",
                    fontSize: "8px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Assinatura Asaas
                </div>
                <div
                  style={{
                    fontWeight: "500",
                    color: "#2c3e50",
                    fontSize: "11px",
                  }}
                >
                  {selectedStudent.subscriptionAsaas || "N/A"}
                </div>
              </div>
              <div
                style={{
                  fontWeight: "500",
                  color: "#2c3e50",
                  fontSize: "11px",
                }}
              >
                Cadastro: {formatDateBr(new Date(selectedStudent.createdAt))}
              </div>
            </Grid>
            {/* Installment ID */}
            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    color: "#6c757d",
                    fontSize: "8px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  ID Parcela
                </div>
                <div
                  style={{
                    fontWeight: "500",
                    color: "#2c3e50",
                    fontSize: "11px",
                  }}
                >
                  {selectedStudent.installmentId || "N/A"}
                </div>
              </div>
            </Grid>

            {/* Tutoria e Reposição */}
            <Grid item xs={12} sm={6} md={3}>
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    color: "#6c757d",
                    fontSize: "8px",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Tutoria / Reposição
                </div>
                <div
                  style={{
                    fontWeight: "500",
                    color: "#2c3e50",
                    fontSize: "11px",
                  }}
                >
                  Tutoria: {selectedStudent.tutoree ? "Sim" : "Não"} |
                  Reposição:
                  {selectedStudent.replenishTarget ? " Sim" : " Não"}
                </div>
              </div>
            </Grid>

            {/* Cartão de crédito */}
            {selectedStudent.creditCard && (
              <Grid item xs={12} sm={6} md={3}>
                <div style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      color: "#6c757d",
                      fontSize: "8px",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Cartão de Crédito
                  </div>
                  <div
                    style={{
                      fontWeight: "500",
                      color: "#2c3e50",
                      fontSize: "11px",
                    }}
                  >
                    {selectedStudent.creditCard.holderName || "N/A"}
                    <br />
                    {getMaskedCardNumber(selectedStudent.creditCard.number)}
                    <br />
                    {selectedStudent.creditCard.expiryMonth}/
                    {selectedStudent.creditCard.expiryYear}
                  </div>
                </div>
              </Grid>
            )}

            {/* Endereço */}
            {selectedStudent.address && (
              <Grid item xs={12}>
                <div style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      color: "#6c757d",
                      fontSize: "8px",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Endereço
                  </div>
                  <div
                    style={{
                      fontWeight: "500",
                      color: "#2c3e50",
                      fontSize: "11px",
                    }}
                  >
                    {selectedStudent.address}
                  </div>{" "}
                </div>
              </Grid>
            )}

            {/* Google Drive */}
            {selectedStudent.googleDriveLink && (
              <Grid item xs={12}>
                <div style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      color: "#6c757d",
                      fontSize: "8px",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Google Drive
                  </div>
                  <a
                    href={selectedStudent.googleDriveLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontWeight: "500",
                      color: partnerColor(),
                      fontSize: "11px",
                      textDecoration: "underline",
                    }}
                  >
                    Abrir pasta do professor
                  </a>
                </div>
              </Grid>
            )}
          </Grid>
        </div>
      )}
      {/* TÍTULO E PESQUISA */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "50%",
          margin: "auto",
          marginTop: "18px",
        }}
      >
        <HOne>Teachers</HOne>
        <input
          style={{
            width: "100%",
            padding: "10px 16px",
            margin: "10px",
            border: "1px solid #e8eaed",
            borderRadius: "4px",
            fontSize: "11px",
            outline: "none",
            transition: "all 0.2s ease",
            backgroundColor: "#ffffff",
            boxShadow:
              "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
          }}
          type="text"
          placeholder="Pesquisar professor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={(e) => {
            e.target.style.borderColor = partnerColor();
            e.target.style.boxShadow = `0 0 0 3px ${partnerColor()}20`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#e8eaed";
            e.target.style.boxShadow =
              "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)";
          }}
        />
      </div>
      {/* TABELA */}
      {!loading ? (
        <div
          style={{
            backgroundColor: "#ffffff",
            margin: "auto",
            marginTop: "1rem",
            borderRadius: "4px",
            boxShadow:
              "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
            border: "1px solid #e8eaed",
            maxWidth: "70rem",
            maxHeight: "30rem",
            overflow: "hidden",
          }}
        >
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
                    <span style={cellTable}>Cadastro</span>
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
                  <TableCell style={stickyHeaderStyle}>
                    <span style={cellTable}>Método Pagamento</span>
                  </TableCell>
                  <TableCell style={stickyHeaderStyle}>
                    <span style={cellTable}>Mensalidade</span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students
                  .filter((student) =>
                    (student.fullname || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((student, index) => (
                    <TableRow
                      key={student.id || index}
                      onClick={() => {
                        setSelectedStudent(student);
                        setReplenish(student.replenishTarget || false);
                        setFeeUpToDate(student.feeUpToDate);
                        setTutoree(student.tutoree);
                        setOnHold(student.onHold);
                        setSeeClassesHistory(false);
                        setSeePermissionsOrNot(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        document.documentElement.scrollTop = 0;
                        document.body.scrollTop = 0;
                      }}
                      style={{
                        cursor: "pointer",
                        transition: "all 0.2s ease",
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
                          {formatDate(student.createdAt)}
                        </span>
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
                            borderRadius: "4px",
                            fontSize: "8px",
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
                      <TableCell style={cellTable}>
                        {student.paymentMethod || "N/A"}
                      </TableCell>
                      <TableCell style={cellTable}>
                        {student.fee
                          ? `R$ ${formatNumber(student.fee)}`
                          : "N/A"}
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
      {/* MODAL DE EDIÇÃO */}
      <Dialog
        open={isVisible}
        onClose={handleSeeModal}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          style: {
            borderRadius: "4px",
            boxShadow:
              "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
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
              <div
                style={{
                  fontWeight: "600",
                  color: "#2c3e50",
                  marginBottom: "4px",
                }}
              >
                {newName} {newLastName}
              </div>
              <div
                style={{
                  color: "#6c757d",
                  fontWeight: "400",
                  fontSize: "11px",
                }}
              >
                Gerenciar informações do professor
              </div>
            </div>
            <Button
              onClick={handleSeeModal}
              style={{
                minWidth: "auto",
                padding: "8px",
                borderRadius: "4px",
                color: "#6c757d",
              }}
            >
              <CloseIcon />
            </Button>
          </div>
        </DialogTitle>

        <DialogContent style={{ padding: "32px", backgroundColor: "#ffffff" }}>
          {/* INFORMAÇÕES BÁSICAS */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "24px",
              borderRadius: "4px",
              marginBottom: "24px",
              border: "1px solid #e8eaed",
              boxShadow:
                "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div
              style={{
                marginBottom: "20px",
                fontWeight: "600",
                color: "#2c3e50",
                fontSize: "12px",
              }}
            >
              Informações Básicas
            </div>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  variant="outlined"
                  size="small"
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
                />
              </Grid>

              <Grid item xs={12} md={4}>
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

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Aulas por semana"
                  type="number"
                  value={weeklyClasses}
                  onChange={(e) => setWeeklyClasses(e.target.value)}
                  size="small"
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Mensalidade (R$)"
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Link Google Drive"
                  value={googleDriveLink}
                  onChange={(e) => setGoogleDriveLink(e.target.value)}
                  variant="outlined"
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
                  borderRadius: "4px",
                  textTransform: "none",
                  fontSize: "11px",
                }}
              >
                Salvar Informações
              </Button>
            </div>
          </div>

          {/* PERMISSÕES E FLAGS */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "24px",
              borderRadius: "4px",
              marginBottom: "24px",
              border: "1px solid #e8eaed",
              boxShadow:
                "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div
              style={{
                marginBottom: "20px",
                fontWeight: "600",
                color: "#2c3e50",
                fontSize: "12px",
              }}
            >
              Permissões e Status
            </div>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Permissões</InputLabel>
                  <Select
                    value={permissions}
                    label="Permissões"
                    onChange={(e) => setPermissions(e.target.value)}
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
                    borderRadius: "4px",
                    textTransform: "none",
                    fontSize: "11px",
                  }}
                >
                  Salvar Permissões
                </Button>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={feeUpToDate}
                      onChange={() => updateFeeStatus(ID)}
                      size="small"
                    />
                  }
                  label="Mensalidade em dia"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={onHold}
                      onChange={() => updateOnHold(ID)}
                      size="small"
                    />
                  }
                  label="Matrícula trancada"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={tutoree}
                      onChange={() => updateTutoree(ID)}
                      size="small"
                    />
                  }
                  label="Aluno de tutoria"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={replenish}
                      onChange={() => updateReplenish(ID)}
                      size="small"
                    />
                  }
                  label="Alvo de reposição"
                />
              </Grid>
            </Grid>
          </div>

          {/* ALTERAR SENHA */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "24px",
              borderRadius: "4px",
              marginBottom: "24px",
              border: "1px solid #e8eaed",
              boxShadow:
                "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div
              style={{
                marginBottom: "20px",
                fontWeight: "600",
                color: "#2c3e50",
                fontSize: "12px",
              }}
            >
              Alterar Senha
            </div>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="password"
                  label="Nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  size="small"
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
                  borderRadius: "4px",
                  textTransform: "none",
                  fontSize: "11px",
                }}
              >
                Alterar Senha
              </Button>
            </div>
          </div>

          {/* SEÇÃO EXCLUIR */}
          <div
            style={{
              backgroundColor: "#ffeaeaff",
              padding: "1rem",
              display: "grid",
              justifyItems: "center",
              alignItems: "center",
              borderRadius: "4px",
              border: "1px solid #ffcccc",
            }}
          >
            {!seeConfirmDelete ? (
              <Button
                color="error"
                variant="outlined"
                onClick={() => setSeeConfirmDelete(true)}
                style={{
                  fontWeight: "500",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  textTransform: "none",
                  fontSize: "11px",
                  borderColor: "#dc3545",
                  color: "#dc3545",
                }}
              >
                Excluir Professor
              </Button>
            ) : (
              <div style={{ width: "100%", textAlign: "center" }}>
                <div
                  style={{
                    color: "#dc3545",
                    fontWeight: "600",
                    fontSize: "12px",
                    marginBottom: "10px",
                  }}
                >
                  Confirmar Exclusão
                </div>
                <div
                  style={{
                    color: "#6c757d",
                    fontSize: "11px",
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
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    onClick={() => setSeeConfirmDelete(false)}
                    style={{
                      fontWeight: "500",
                      padding: "10px 20px",
                      borderRadius: "4px",
                      textTransform: "none",
                      fontSize: "11px",
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
                      borderRadius: "4px",
                      textTransform: "none",
                      fontSize: "11px",
                      backgroundColor: "#dc3545",
                      color: "#fff",
                    }}
                  >
                    Confirmar Exclusão
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <AllStudents id={id} headers={headers} plan={plan} />,
    </>
  );
}

export default FindTeacher;
