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

export function FindStudent({ uploadStatus, headers, id }) {
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
      setNewName(
        response.data.formattedStudentData.name
          ? response.data.formattedStudentData.name
          : ""
      );
      setNewLastName(
        response.data.formattedStudentData.lastname
          ? response.data.formattedStudentData.lastname
          : ""
      );
      setNewUsername(
        response.data.formattedStudentData.username
          ? response.data.formattedStudentData.username
          : ""
      );
      setNewPhone(
        response.data.formattedStudentData.phoneNumber
          ? response.data.formattedStudentData.phoneNumber
          : ""
      );
      setNewEmail(
        response.data.formattedStudentData.email
          ? response.data.formattedStudentData.email
          : ""
      );
      setFeeUpToDate(response.data.formattedStudentData.feeUpToDate || false);
      setReplenishTarget(
        response.data.formattedStudentData.replenishTarget || false
      );
      setTutoree(response.data.formattedStudentData.tutoree || false);

      setPermissions(
        response.data.formattedStudentData.permissions
          ? response.data.formattedStudentData.permissions
          : ""
      );
      setWeeklyClasses(
        response.data.formattedStudentData.weeklyClasses
          ? response.data.formattedStudentData.weeklyClasses
          : ""
      );
      setID(
        response.data.formattedStudentData.id
          ? response.data.formattedStudentData.id
          : ""
      );

      setGoogleDriveLink(
        response.data.formattedStudentData.googleDriveLink
          ? response.data.formattedStudentData.googleDriveLink
          : ""
      );
      setTotalScore(
        response.data.formattedStudentData.totalScore
          ? response.data.formattedStudentData.totalScore
          : ""
      );
      setMonthlyScore(
        response.data.formattedStudentData.monthlyScore
          ? response.data.formattedStudentData.monthlyScore
          : ""
      );
      setPicture(
        response.data.formattedStudentData.picture
          ? response.data.formattedStudentData.picture
          : ""
      );
      setFee(
        response.data.formattedStudentData.fee
          ? response.data.formattedStudentData.fee
          : ""
      );
      setNewAddress(
        response.data.formattedStudentData.address
          ? response.data.formattedStudentData.address
          : ""
      );
      setHomeworkAssignmentsDone(
        response.data.formattedStudentData.homeworkAssignmentsDone
          ? response.data.formattedStudentData.homeworkAssignmentsDone
          : ""
      );
      setFlashcards25Reviews(
        response.data.formattedStudentData.flashcards25Reviews
          ? response.data.formattedStudentData.flashcards25Reviews
          : ""
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
          ? response.data.formattedStudentData.homeworkAssignmentsDone
          : ""
      );
      setFlashcards25Reviews(
        response.data.formattedStudentData.flashcards25Reviews
          ? response.data.formattedStudentData.flashcards25Reviews
          : ""
      );
      console.log(response.data.formattedStudentData);
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
      const response = await axios.get(`${backDomain}/api/v1/students/${id}`, {
        headers,
      });
      setStudents(response.data.listOfStudents);
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
      }, 2000);
    } catch (error) {
      notifyAlert("Erro ao resetar");
    }
  };

  const handleShowResetMonth = () => {
    setIsConfirmVisible(!isConfirmVisible);
  };
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: hasReset ? "none" : "block" }}>
          {" "}
          <MyButton
            style={{ display: isConfirmVisible ? "none" : "block" }}
            onDoubleClick={() => handleShowResetMonth()}
          >
            {" "}
            Resetar pontuações do mês
          </MyButton>
          <div style={{ display: isConfirmVisible ? "block" : "none" }}>
            <p> Tem certeza que deseja resetar pontuações do mês?</p>
            <MyButton
              firstcolor="red"
              secondcolor="#FA7A71"
              textcolor="white"
              onDoubleClick={() => handleResetMonth()}
            >
              Sim
            </MyButton>
            <MyButton
              style={{ marginLeft: "1rem" }}
              onMouseOver={() => handleShowResetMonth()}
              onClick={() => handleShowResetMonth()}
            >
              Não
            </MyButton>
            <p
              style={{
                display: resetVisible ? "block" : "none",
              }}
            >
              Pontuações do mês resetadas
            </p>
          </div>
        </div>
        <input
          className="inputs-style"
          type="text"
          placeholder="Pesquisar aluno"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {!loading ? (
        <div
          style={{
            backgroundColor: "rgb(246, 246, 246)",
            margin: "auto",
            boxShadow: "inset 0px 10px 10px rgb(197, 197, 197)",
            maxWidth: "70rem",
            maxHeight: "30rem",
            overflow: "auto",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={stickyHeaderStyle}>
                    <span style={cellTable}>Picture</span>
                  </TableCell>
                  <TableCell style={stickyHeaderStyle}>
                    <span style={cellTable}>{UniversalTexts.name}</span>
                  </TableCell>
                  <TableCell style={stickyHeaderStyle}>
                    <span style={cellTable}>{UniversalTexts.username}</span>
                  </TableCell>
                  <TableCell style={stickyHeaderStyle}>
                    <span style={cellTable}>{UniversalTexts.document}</span>
                  </TableCell>
                  <TableCell style={stickyHeaderStyle}>
                    <span style={cellTable}>{UniversalTexts.dateOfBirth}</span>
                  </TableCell>
                  <TableCell style={stickyHeaderStyle}>
                    <span style={cellTable}>{UniversalTexts.email}</span>
                  </TableCell>
                  <TableCell style={stickyHeaderStyle}>
                    <span style={cellTable}>{UniversalTexts.phoneNumber}</span>
                  </TableCell>
                  <TableCell style={stickyHeaderStyle}>
                    <span style={cellTable}>{UniversalTexts.permissions}</span>
                  </TableCell>
                  {/* <TableCell style={stickyHeaderStyle}>
                    <span style={cellTable}>{UniversalTexts.fee}</span>
                  </TableCell> */}
                  <TableCell style={stickyHeaderStyle}>
                    <span style={cellTable}>{UniversalTexts.totalScore}</span>
                  </TableCell>
                  <TableCell style={stickyHeaderStyle}>
                    <span style={cellTable}>{UniversalTexts.monthlyScore}</span>
                  </TableCell>
                  <TableCell style={stickyHeaderStyle}>
                    <span style={cellTable}>{UniversalTexts.address}</span>
                  </TableCell>
                  <TableCell style={stickyHeaderStyle}>
                    <span style={cellTable}>
                      {UniversalTexts.weeklyClasses}
                    </span>
                  </TableCell>
                  <TableCell style={stickyHeaderStyle}>
                    <span style={cellTable}>
                      {UniversalTexts.googleDriveLink}
                    </span>
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
                      className="the-hover"
                      key={index}
                      onClick={() => seeEdition(student.id)}
                    >
                      <TableCell>
                        <img
                          style={{
                            width: "2.5rem",
                            height: "2.5rem",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                          src={
                            student.picture ||
                            "https://ik.imagekit.io/vjz75qw96/logos/myp?updatedAt=1752031657485"
                          }
                          alt=""
                        />
                      </TableCell>
                      <TableCell>
                        <span style={cellTable}>{student.fullname}</span>
                      </TableCell>
                      <TableCell>
                        <span style={cellTable}>{student.username}</span>
                      </TableCell>
                      <TableCell>
                        <span style={cellTable}>{student.doc}</span>
                      </TableCell>
                      <TableCell>
                        <span style={cellTable}>
                          {formatDateBr(student.dateOfBirth)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={cellTable}>{student.email}</span>
                      </TableCell>
                      <TableCell>
                        <span style={cellTable}>{student.phoneNumber}</span>
                      </TableCell>
                      <TableCell>
                        <span style={cellTable}>{student.permissions}</span>
                      </TableCell>
                      {/* <TableCell>
                        <span style={cellTable}>R$ {student.fee}</span>
                      </TableCell> */}
                      <TableCell>
                        <span style={cellTable}>{student.totalScore}</span>
                      </TableCell>
                      <TableCell>
                        <span style={cellTable}>{student.monthlyScore}</span>
                      </TableCell>
                      <TableCell>
                        <span style={cellTable}>{student.address}</span>
                      </TableCell>
                      <TableCell>
                        <span style={cellTable}>{student.weeklyClasses}</span>
                      </TableCell>
                      <TableCell>
                        <a
                          style={{ color: "#000" }}
                          href={
                            student.googleDriveLink || "http://www.google.com/"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {UniversalTexts.clickHere}
                        </a>
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
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Sobrenome"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="E-mail"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Endereço"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  size="small"
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
                  label="Link Google Drive"
                  value={googleDriveLink}
                  onChange={(e) => setGoogleDriveLink(e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
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

          {/* SEÇÃO 2: PONTUAÇÃO */}
          <div
            style={{
              backgroundColor: "#fff3cd",
              padding: "1.5rem",
              borderRadius: "8px",
              marginBottom: "2rem",
              border: "1px solid #ffeaa7",
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="600" color="#333">
              🏆 Pontuação
            </Typography>

            <Grid container spacing={2} style={{ marginBottom: "1rem" }}>
              <Grid item xs={6} md={3}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "1rem",
                    backgroundColor: "#fff",
                    borderRadius: "6px",
                  }}
                >
                  <Typography variant="body2" color="#666">
                    Total
                  </Typography>
                  <Typography variant="h6" fontWeight="600">
                    {formatNumber(totalScore)}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={6} md={3}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "1rem",
                    backgroundColor: "#fff",
                    borderRadius: "6px",
                  }}
                >
                  <Typography variant="body2" color="#666">
                    Mensal
                  </Typography>
                  <Typography variant="h6" fontWeight="600">
                    {formatNumber(monthlyScore)}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={6} md={3}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "1rem",
                    backgroundColor: "#fff",
                    borderRadius: "6px",
                  }}
                >
                  <Typography variant="body2" color="#666">
                    Homework
                  </Typography>
                  <Typography variant="h6" fontWeight="600">
                    {formatNumber(homeworkAssignmentsDone)}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={6} md={3}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "1rem",
                    backgroundColor: "#fff",
                    borderRadius: "6px",
                  }}
                >
                  <Typography variant="body2" color="#666">
                    Flashcards
                  </Typography>
                  <Typography variant="h6" fontWeight="600">
                    {formatNumber(flashcards25Reviews)}
                  </Typography>
                </div>
              </Grid>
            </Grid>

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginBottom: "1rem",
              }}
            >
              {listOfButtons.map((item, index) => (
                <ArvinButton
                  key={index}
                  disabled={disabled}
                  style={{
                    fontSize: "0.75rem",
                    padding: "6px 12px",
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

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Pontuação extra"
                  placeholder="Score"
                  onChange={(e) => setPlusScore(Number(e.target.value))}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Descrição da pontuação"
                  placeholder="Ex: Participação extra"
                  onChange={(e) => setDescSpecial(e.target.value)}
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
                variant="outlined"
                onClick={() =>
                  submitPlusScore(ID, plusScore, descSpecial, "Others")
                }
                disabled={disabled}
                style={{ fontWeight: "600" }}
              >
                ➕ Adicionar Pontuação
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
            </Grid>
          </div>

          {/* SEÇÃO 4: ALTERAR SENHA */}
          <div
            style={{
              backgroundColor: "#fce4ec",
              padding: "1.5rem",
              borderRadius: "8px",
              marginBottom: "2rem",
              border: "1px solid #f8bbd9",
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="600" color="#333">
              🔒 Alterar Senha
            </Typography>

            <Grid container spacing={2}>
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
                marginTop: "1rem",
              }}
            >
              <Button
                variant="contained"
                onClick={() => editStudentPassword(ID)}
                disabled={!newPassword || newPassword !== confirmPassword}
                style={{
                  backgroundColor: "#e91e63",
                  color: "#fff",
                  fontWeight: "600",
                }}
              >
                🔑 Alterar Senha
              </Button>
            </div>
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

export default FindStudent;
