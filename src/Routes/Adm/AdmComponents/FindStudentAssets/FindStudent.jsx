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
      alert("Senha editada com sucesso!");
      fetchStudents();
      handleSeeModal();
    } catch (error) {
      alert("Erro ao editar senha");
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
          style: { padding: "2rem", borderRadius: "1rem" },
        }}
      >
        <DialogTitle>
          <div
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold">
              Editar Aluno - {newName}
            </Typography>
            <Button onClick={handleSeeModal}>
              <CloseIcon />
            </Button>
          </div>
        </DialogTitle>
        <Grid item xs={12} md={6}>
          <Typography>
            Total Score: <strong>{formatNumber(totalScore)}</strong>
          </Typography>
          <Typography>
            Monthly Score: <strong>{formatNumber(monthlyScore)}</strong>
          </Typography>
          <Typography>
            Homework Assignment:{" "}
            <strong>{formatNumber(homeworkAssignmentsDone)}</strong>
          </Typography>
          <Typography>
            Flashcards Reviews:{" "}
            <strong>{formatNumber(flashcards25Reviews)}</strong>
          </Typography>
        </Grid>
        <div style={{ display: "flex", gap: "1rem", margin: "1rem" }}>
          {listOfButtons.map((item, index) => {
            return (
              <ArvinButton
                key={index}
                disabled={disabled}
                style={{
                  color: alwaysWhite(),
                  fontSize: "0.8rem",
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
            );
          })}
        </div>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Pontuação extra"
            placeholder="Score"
            onChange={(e) => setPlusScore(Number(e.target.value))}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Descrição da pontuação"
            placeholder="Ex: Participação extra"
            onChange={(e) => setDescSpecial(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={12}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() =>
              submitPlusScore(ID, plusScore, descSpecial, "Others")
            }
          >
            Enviar Pontuação Manual
          </Button>
        </Grid>

        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sobrenome"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Usuário"
                value={newUsername}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Endereço"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefone"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="E-mail"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Link Google Drive"
                value={googleDriveLink}
                onChange={(e) => setGoogleDriveLink(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="URL da Foto"
                value={picture}
                onChange={(e) => setPicture(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Aulas por semana"
                value={weeklyClasses}
                onChange={(e) => setWeeklyClasses(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
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

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={feeUpToDate}
                    onChange={() => {
                      updateFeeStatus(ID);
                      setFeeUpToDate(!feeUpToDate);
                    }}
                  />
                }
                label={
                  feeUpToDate ? "Mensalidade em dia" : "Mensalidade atrasada"
                }
              />
              {/* <FormControlLabel
                control={
                  <Switch
                    checked={replenishTarget}
                    onChange={() => {
                      updateReplenishTargetStatus(ID);
                      setReplenishTarget(!replenishTarget);
                    }}
                  />
                }
                label={replenishTarget ? "Com Reposição" : "Sem Reposição"}
              /> */}
              <FormControlLabel
                control={
                  <Switch
                    checked={tutoree}
                    onChange={() => {
                      updateTutoree(ID);
                      setTutoree(!tutoree);
                    }}
                  />
                }
                label={tutoree ? "Aluno de monitoria" : "Sem monitoria"}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <div
                style={{
                  display: "grid",
                  alignContent: "center",
                  justifyItems: "center",
                }}
              >
                <input
                  className="inputs-style"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Escolha uma nova senha"
                  type="password"
                />
                <input
                  className="inputs-style"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirme a Senha"
                  type="password"
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    gap: "1rem",
                    marginTop: "2rem",
                  }}
                >
                  <MyButton
                    firstcolor="#138017"
                    secondcolor="#139417"
                    onClick={() => editStudentPassword(ID)}
                  >
                    Salvar
                  </MyButton>
                </div>
              </div>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <div width="100%" display="flex" justifyContent="space-between">
            {!seeConfirmDelete ? (
              <>
                <Button color="error" onClick={() => setSeeConfirmDelete(true)}>
                  Excluir
                </Button>
                <Button onClick={handleSeeModal}>Cancelar</Button>
                <Button variant="contained" onClick={handleSaveAll}>
                  Salvar Tudo
                </Button>
              </>
            ) : (
              <div
                display="flex"
                flexDirection="column"
                alignItems="center"
                width="100%"
              >
                <Typography color="error">
                  Tem certeza que deseja excluir{" "}
                  <strong>
                    {newName} {newLastName}
                  </strong>
                  ?
                </Typography>
                <div mt={2} display="flex" gap={2}>
                  <Button onClick={() => setSeeConfirmDelete(false)}>
                    Cancelar
                  </Button>
                  <Button
                    color="error"
                    variant="contained"
                    onClick={handleDelete}
                  >
                    Confirmar Exclusão
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default FindStudent;

// <div
//   onClick={() => handleSeeModal()}
//   className="modal"
//   style={{
//     display: isVisible ? "block" : "none",
//     zIndex: 30,
//     position: "fixed",
//     backgroundColor: "rgba(0,0,0,0.5)",
//     width: "10000px",
//     height: "10000px",
//     top: 0,
//     left: 0,
//   }}
// />
// <div
//   className="modal"
//   style={{
//     position: "fixed",
//     zIndex: 100,
//     backgroundColor: "#fff",
//     padding: "1rem",
//     width: isMobile ? "20rem" : "25rem",
//     height: "32rem",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     display: isVisible ? "block" : "none",
//   }}
// >
//   <Xp onClick={() => handleSeeModal()}>X</Xp>

//   <HOne style={{ fontFamily: textTitleFont(), color: partnerColor() }}>
//     Editar aluno - {newName}
//   </HOne>
//   <div
//     className="nice"
//     style={{
//       display: "grid",
//       alignItems: "center",
//       fontSize: "0.5rem",
//       marginBottom: "1rem",
//     }}
//   >
//     <div
//       className="pointer-text"
//       style={{
//         padding: "5px",
//         display: "grid",
//         marginBottom: "5px",
//         borderRadius: "6px",
//         alignItems: "center",
//         textAlign: "center",
//         width: "fit-content",
//         color: "white",
//         backgroundColor: feeUpToDate ? "green" : "red",
//       }}
//       onClick={() => {
//         updateFeeStatus(ID);
//         setFeeUpToDate(!feeUpToDate);
//       }}
//     >
//       {feeUpToDate ? "Fee Ok" : "Late Fee"}
//     </div>

//     <div
//       className="pointer-text"
//       style={{
//         padding: "5px",
//         display: "grid",
//         alignItems: "center",
//         marginBottom: "5px",
//         borderRadius: "6px",
//         textAlign: "center",
//         width: "fit-content",
//         color: "white",
//         backgroundColor: replenishTarget ? "green" : "red",
//       }}
//       onClick={() => {
//         updateReplenishTargetStatus(ID);
//         setReplenishTarget(!replenishTarget);
//       }}
//     >
//       {replenishTarget ? "Replenish" : "Non-Replenish"}
//     </div>

//     <div
//       className="pointer-text"
//       style={{
//         padding: "5px",
//         display: "grid",
//         alignItems: "center",
//         marginBottom: "5px",
//         borderRadius: "6px",
//         textAlign: "center",
//         width: "fit-content",
//         color: "white",
//         backgroundColor: tutoree ? "blue" : "orange",
//       }}
//       onClick={() => {
//         updateTutoree(ID);
//         setTutoree(!tutoree);
//       }}
//     >
//       {tutoree ? "Tutoree" : "Not a tutoreee"}
//     </div>

//     <div
//       className="pointer-text"
//       style={{
//         padding: "5px",
//         display: "grid",
//         alignItems: "center",
//         marginBottom: "5px",
//         borderRadius: "6px",
//         textAlign: "center",
//         width: "fit-content",
//         color: "white",
//         backgroundColor: "#456",
//       }}
//     >
//       {formatNumber(totalScore)} +
//     </div>
//   </div>
//   {/* Formulário principal */}
//   <form
//     style={{
//       display: !seeConfirmDelete ? "grid" : "none",
//       gridTemplateColumns: "1fr 1fr",
//       gap: "1rem",
//       padding: "1rem",
//       backgroundColor: "#eee",
//     }}
//   >
//     <input
//       className="inputs-style"
//       value={newName}
//       onChange={(e) => setNewName(e.target.value)}
//       placeholder="Nome"
//     />
//     <input
//       className="inputs-style"
//       value={newLastName}
//       onChange={(e) => setNewLastName(e.target.value)}
//       placeholder="Sobrenome"
//     />
//     <input
//       className="inputs-style"
//       value={newUsername}
//       disabled
//       placeholder="Username"
//     />
//     <input
//       className="inputs-style"
//       value={newAddress}
//       disabled
//       onChange={(e) => setNewAddress(e.target.value)}
//       placeholder="Endereço"
//     />
//     <input
//       className="inputs-style"
//       value={newPhone}
//       onChange={(e) => setNewPhone(e.target.value)}
//       placeholder="Celular"
//     />
//     <input
//       className="inputs-style"
//       value={newEmail}
//       onChange={(e) => setNewEmail(e.target.value)}
//       placeholder="E-mail"
//     />
//     <input
//       className="inputs-style"
//       value={googleDriveLink}
//       onChange={(e) => setGoogleDriveLink(e.target.value)}
//       placeholder="Link Google Drive"
//     />
//     <input
//       className="inputs-style"
//       value={picture}
//       onChange={(e) => setPicture(e.target.value)}
//       placeholder="Foto"
//     />
//     <input
//       className="inputs-style"
//       value={fee}
//       onChange={(e) => setFee(e.target.value)}
//       placeholder="Mensalidade"
//       type="number"
//     />
//     <input
//       className="inputs-style"
//       value={weeklyClasses}
//       onChange={(e) => setWeeklyClasses(e.target.value)}
//       placeholder="Aulas semanais"
//     />
//   </form>

//   {/* Permissões e senha */}
//   {!seeConfirmDelete && (
//     <div style={{ padding: "1rem", display: "grid", gap: "1rem" }}>
//       <select
//         className="inputs-style"
//         value={permissions}
//         onChange={(e) => setPermissions(e.target.value)}
//       >
//         <option value="permissions" hidden>
//           Permissões
//         </option>
//         <option value="student">Student</option>
//         <option value="teacher">Teacher</option>
//         <option value="superadmin">Superadmin</option>
//       </select>

//       <input
//         className="inputs-style"
//         value={newPassword}
//         onChange={(e) => setNewPassword(e.target.value)}
//         placeholder="Nova senha"
//         type="password"
//       />
//       <input
//         className="inputs-style"
//         value={confirmPassword}
//         onChange={(e) => setConfirmPassword(e.target.value)}
//         placeholder="Confirmar senha"
//         type="password"
//       />
//     </div>
//   )}

//   {/* Botões principais */}
//   {!seeConfirmDelete ? (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-evenly",
//         marginTop: "1rem",
//       }}
//     >
//       <MyButton
//         firstcolor="#FF1400"
//         secondcolor="#F01400"
//         textcolor="white"
//         onClick={handleConfirmDelete}
//       >
//         Excluir
//       </MyButton>
//       <MyButton onClick={handleSeeModal}>Cancelar</MyButton>
//       <MyButton
//         firstcolor="#138017"
//         secondcolor="#139417"
//         textcolor="white"
//         onClick={() => {
//           editStudent(ID);
//           editStudentPermissions(ID);
//           editStudentPassword(ID);
//         }}
//       >
//         Salvar tudo
//       </MyButton>
//     </div>
//   ) : (
//     <div
//       style={{
//         backgroundColor: "#dd6e6e",
//         padding: "1rem",
//         textAlign: "center",
//         marginTop: "1rem",
//       }}
//     >
//       <HThree>
//         Esta ação não pode ser desfeita! Tem certeza que deseja excluir
//         o(a) aluno(a):
//         <br />
//         <br />
//         <span
//           style={{
//             backgroundColor: "#111",
//             color: "#fff",
//             padding: "0.3rem",
//           }}
//         >
//           {newName} {newLastName}
//         </span>
//         <br />
//         <br />?
//       </HThree>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-evenly",
//           marginTop: "1rem",
//         }}
//       >
//         <MyButton onClick={handleConfirmDelete}>Não!!</MyButton>
//         <MyButton
//           firstcolor="#FF1400"
//           secondcolor="#F01400"
//           onClick={() => deleteStudent(ID)}
//         >
//           Sim...
//         </MyButton>
//       </div>
//     </div>
//   )}
// </div>
