import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DivModal,
  Xp,
  backDomain,
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
  Tooltip,
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

export function FinancialResources({ headers, id }) {
  const { UniversalTexts } = useUserContext();
  const [newName, setNewName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
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
  const [homeworkAssignmentsDone, setHomeworkAssignmentsDone] = useState("1");
  const [flashcards25Reviews, setFlashcards25Reviews] = useState("1");
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
      console.log(response.data.formattedStudentData);
      setNewName(response.data.formattedStudentData.name);
      setNewLastName(response.data.formattedStudentData.lastname);
      setOnHold(response.data.formattedStudentData.onHold);
      setNewUsername(response.data.formattedStudentData.username);
      setNewPhone(response.data.formattedStudentData.phoneNumber);
      setNewEmail(response.data.formattedStudentData.email);
      setFeeUpToDate(response.data.formattedStudentData.feeUpToDate);
      setReplenishTarget(response.data.formattedStudentData.replenishTarget);
      setTutoree(response.data.formattedStudentData.tutoree);
      setPermissions(response.data.formattedStudentData.permissions);
      setWeeklyClasses(response.data.formattedStudentData.weeklyClasses);
      setID(response.data.formattedStudentData.id);
      setGoogleDriveLink(response.data.formattedStudentData.googleDriveLink);
      setTotalScore(response.data.formattedStudentData.totalScore);
      setMonthlyScore(response.data.formattedStudentData.monthlyScore);
      setPicture(response.data.formattedStudentData.picture);
      setFee(response.data.formattedStudentData.fee);
      setNewAddress(response.data.formattedStudentData.address);
      setHomeworkAssignmentsDone(
        response.data.formattedStudentData.homeworkAssignmentsDone
      );
      setFlashcards25Reviews(
        response.data.formattedStudentData.flashcards25Reviews
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
      setTotalScore(response.data.formattedStudentData.totalScore);
      setMonthlyScore(response.data.formattedStudentData.monthlyScore);
      setHomeworkAssignmentsDone(
        response.data.formattedStudentData.homeworkAssignmentsDone
      );
      setFlashcards25Reviews(
        response.data.formattedStudentData.flashcards25Reviews
      );
    } catch (error) {
      notifyAlert(error);
      console.error(error);
    }
  };

  const editStudent = async (id) => {
    let editedStudent = {
      username: newUsername,
      password: newPassword,
      email: newEmail,
      name: newName,
      lastname: newLastName,
      phoneNumber: newPhone,
      weeklyClasses,
      permissions: permissions,
      googleDriveLink: googleDriveLink,
      address: newAddress,
      fee,
      picture: picture,
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
      const response = await axios.get(
        `${backDomain}/api/v1/studentsfinancialreports/${id}`,
        {
          headers,
        }
      );
      setStudents(response.data.listOfStudentsFees);
      setLoading(false);
    } catch (error) {
      notifyAlert("Erro ao encontrar alunos");
      // onLoggOut();
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);

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

  const cellTable = {
    whiteSpace: "nowrap",
  };
  const stickyHeaderStyle = {
    position: "sticky",
    top: 0,
    backgroundColor: "#f6f6f6",
    zIndex: 1,
    whiteSpace: "nowrap",
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
      console.log("response", response);
      setOnHold(response.data.newValue);

      fetchStudents();
    } catch (error) {
      console.log("error", error);
    }
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
  const isMobile = window.innerWidth <= 700;

  const [descSpecial, setDescSpecial] = useState("");
  const [plusScore, setPlusScore] = useState(0);

  const updateTutoree = async (id) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/tutoree/${id}`,
        {},
        { headers }
      );
      fetchStudents();
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDelete = () => {
    deleteStudent(ID);
  };

  // Calculate monthly revenue prediction (only active students)
  const calculateMonthlyRevenue = () => {
    return students.reduce((total, student) => {
      const fee = parseFloat(student.fee) || 0;
      // Only count if student is not on hold
      if (!student.onHold && fee > 0) {
        return total + fee;
      }
      return total;
    }, 0);
  };

  // Get students with fees for the financial table
  const getStudentsWithFees = () => {
    return students;
    // .filter(
    //   (student) => student.fee && parseFloat(student.fee) > 0
    // );
  };

  // Get only active students (not on hold) with fees
  const getActiveStudentsWithFees = () => {
    return students.filter(
      (student) => student.fee && parseFloat(student.fee) > 0 && !student.onHold
    );
  };

  return (
    <>
      <HOne
        style={{
          fontFamily: textTitleFont(),
          color: partnerColor(),
          textAlign: "center",
          margin: "0.5rem",
        }}
      >
        Gestão Financeira
      </HOne>

      {/* SEÇÃO DE RECEITA MENSAL - Estilo técnico */}
      {!loading && (
        <section
          style={{
            padding: "20px",
            maxWidth: "800px",
            margin: "auto",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: "16px 20px",
              margin: "auto",
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          >
            <Typography
              variant="h6"
              style={{
                fontFamily: textTitleFont(),
                color: partnerColor(),
                fontSize: "16px",
                fontWeight: "600",
                margin: "0",
              }}
            >
              💰 Receita Mensal Projetada
            </Typography>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
              }}
            >
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: partnerColor(),
                  }}
                >
                  R$ {formatNumber(calculateMonthlyRevenue())}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Receita Ativa Total
                </div>
              </div>

              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  {getActiveStudentsWithFees().length}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Alunos Ativos
                </div>
              </div>
              {/* 
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "#666",
                  }}
                >
                  R${" "}
                  {getActiveStudentsWithFees().length > 0
                    ? formatNumber(
                        calculateMonthlyRevenue() /
                          getActiveStudentsWithFees().length
                      )
                    : "0"}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Valor Médio
                </div>
              </div> */}
            </div>

            {/* Lista técnica de estudantes */}
            <div style={{ marginTop: "16px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#333",
                  marginBottom: "8px",
                  padding: "8px 0",
                  borderBottom: "1px solid #ddd",
                }}
              >
                📋 Mensalidades ({getStudentsWithFees().length} total •{" "}
                {getActiveStudentsWithFees().length} ativos)
              </div>

              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                }}
              >
                {getStudentsWithFees().map((student, index) => (
                  <div
                    key={student.id}
                    onClick={() => seeEdition(student.id)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "40px 2fr 1fr 80px 120px",
                      gap: "12px",
                      padding: "12px",
                      borderBottom: "1px solid #eee",
                      alignItems: "center",
                      cursor: "pointer",
                      backgroundColor: student.onHold ? "#f8f8f8" : "#fff",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (!student.onHold) {
                        e.currentTarget.style.backgroundColor = "#f5f5f5";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = student.onHold
                        ? "#f8f8f8"
                        : "#fff";
                    }}
                  >
                    <img
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        opacity: student.onHold ? 0.5 : 1,
                      }}
                      src={
                        student.picture ||
                        "https://ik.imagekit.io/vjz75qw96/logos/myp?updatedAt=1752031657485"
                      }
                      alt=""
                    />
                    <div>
                      <div
                        style={{
                          fontWeight: "600",
                          fontSize: "14px",
                          opacity: student.onHold ? 0.6 : 1,
                        }}
                      >
                        {student.name} {student.lastname}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#666",
                          opacity: student.onHold ? 0.6 : 1,
                        }}
                      >
                        {student.email}
                      </div>
                    </div>

                    <Tooltip
                      title={student.onHold ? "Matrícula trancada" : ""}
                      arrow
                    >
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: student.onHold ? "#999" : partnerColor(),
                          textDecoration: student.onHold
                            ? "line-through"
                            : "none",
                        }}
                      >
                        R$ {formatNumber(student.fee)}
                      </div>
                    </Tooltip>

                    <div
                      style={{
                        fontSize: "12px",
                        textAlign: "center",
                        opacity: student.onHold ? 0.6 : 1,
                      }}
                    >
                      {student.weeklyClasses || 1}x/sem
                    </div>

                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        textAlign: "center",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: student.onHold
                          ? "#f0f0f0"
                          : student.feeUpToDate
                          ? "#e8f5e8"
                          : "#ffebee",
                        color: student.onHold
                          ? "#999"
                          : student.feeUpToDate
                          ? "#2e7d32"
                          : "#c62828",
                      }}
                    >
                      {student.onHold
                        ? "⏸️ Trancado"
                        : student.feeUpToDate
                        ? "✅ OK"
                        : "⚠️ Pendente"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Dialog
        open={isVisible}
        onClose={handleSeeModal}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: { borderRadius: "12px" },
        }}
      >
        <DialogTitle>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #eee",
              paddingBottom: "1rem",
            }}
          >
            <Typography variant="h5" fontWeight="600" color="#333">
              {newName} {newLastName}
            </Typography>
            <Button
              onClick={handleSeeModal}
              style={{ minWidth: "auto", padding: "8px" }}
            >
              <CloseIcon />
            </Button>
          </div>
        </DialogTitle>

        <DialogContent style={{ padding: "2rem" }}>
          {/* SEÇÃO 1: INFORMAÇÕES BÁSICAS */}
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "1.5rem",
              borderRadius: "8px",
              marginBottom: "2rem",
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="600" color="#333">
              📝 Informações Básicas
            </Typography>
            <Grid container spacing={2}>
              {newName && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nome"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    size="small"
                  />
                </Grid>
              )}
              {newLastName && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Sobrenome"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    size="small"
                  />
                </Grid>
              )}
              {newPhone && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Telefone"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    size="small"
                  />
                </Grid>
              )}
              {newAddress && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Endereço"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    size="small"
                  />
                </Grid>
              )}
              {weeklyClasses && (
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
              )}{" "}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="string"
                  label="Mensalidade"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  size="small"
                />
              </Grid>
            </Grid>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1rem",
              }}
            >
              <Button
                variant="contained"
                onClick={() => editStudent(ID)}
                style={{
                  backgroundColor: partnerColor(),
                  color: "#fff",
                  fontWeight: "600",
                }}
              >
                💾 Salvar Informações
              </Button>
            </div>
          </div>
          {/* SEÇÃO 3: CONFIGURAÇÕES */}
          <div
            style={{
              backgroundColor: "#e3f2fd",
              padding: "1.5rem",
              borderRadius: "8px",
              marginBottom: "2rem",
              border: "1px solid #bbdefb",
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="600" color="#333">
              ⚙️ Configurações
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={feeUpToDate}
                      onChange={() => {
                        updateFeeStatus(ID);
                        setFeeUpToDate(!feeUpToDate);
                      }}
                      color="primary"
                    />
                  }
                  label={
                    feeUpToDate
                      ? "💰 Mensalidade em dia"
                      : "⚠️ Mensalidade atrasada"
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
                      color="primary"
                    />
                  }
                  label={onHold ? "Ativar Matrícula" : "Trancar Matrícula"}
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
                      color="primary"
                    />
                  }
                  label={tutoree ? "📚 Aluno de monitoria" : "📖 Sem monitoria"}
                />
              </Grid>
              <div>
                <span
                  style={{
                    color: !feeUpToDate ? "red" : "green",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    marginLeft: "1rem",
                  }}
                >
                  {feeUpToDate ? "Mensalidade em Dia" : "Mensalidade Atrasada"}
                </span>
                <span
                  style={{
                    color: onHold ? "red" : "green",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    marginLeft: "1rem",
                  }}
                >
                  {onHold ? "Matrícula Trancada" : "Matrícula Ativa"}
                </span>
                <span
                  style={{
                    color: !tutoree ? "red" : "green",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    marginLeft: "1rem",
                  }}
                >
                  {tutoree ? "Aluno particular" : "Não é aluno particular"}
                </span>
              </div>
            </Grid>
          </div>
        </DialogContent>

        <DialogActions
          style={{
            padding: "1.5rem",
            borderTop: "1px solid #eee",
            justifyContent: "space-between",
          }}
        >
          {!seeConfirmDelete ? (
            <>
              <Button
                color="error"
                variant="outlined"
                onClick={() => setSeeConfirmDelete(true)}
                style={{ fontWeight: "600" }}
              >
                🗑️ Excluir Aluno
              </Button>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Button onClick={handleSeeModal} style={{ fontWeight: "600" }}>
                  Cancelar
                </Button>
              </div>
            </>
          ) : (
            <div style={{ width: "100%", textAlign: "center" }}>
              <Typography color="error" variant="h6" gutterBottom>
                ⚠️ Confirmar Exclusão
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Tem certeza que deseja excluir{" "}
                <strong>
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
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <Button
                  onClick={() => setSeeConfirmDelete(false)}
                  style={{ fontWeight: "600" }}
                >
                  Cancelar
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  onClick={handleDelete}
                  style={{ fontWeight: "600" }}
                >
                  Confirmar Exclusão
                </Button>
              </div>
            </div>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default FinancialResources;
