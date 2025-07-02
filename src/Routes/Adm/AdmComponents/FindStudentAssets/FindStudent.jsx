import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DivModal,
  Xp,
  backDomain,
  formatDateBr,
  onLoggOut,
} from "../../../../Resources/UniversalComponents";
import { useUserContext } from "../../../../Application/SelectLanguage/SelectLanguage";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
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
  primaryColor,
  secondaryColor,
  textPrimaryColorContrast,
  textTitleFont,
} from "../../../../Styles/Styles";
import { HOne } from "../../../../Resources/Components/RouteBox";
import { MyButton } from "../../../../Resources/Components/ItemsLibrary";
import { HThree } from "../../../MyClasses/MyClasses.Styled";

export function FindStudent({ uploadStatus, headers }) {
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
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weeklyClasses, setWeeklyClasses] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [monthlyScore, setMonthlyScore] = useState(0);

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
    } catch (error) {
      alert(error);
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
    } catch (error) {
      alert(error);
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
    if (newPassword === confirmPassword) {
      setNewPassword(newPassword);
    } else {
      alert("As senhas são diferentes");
      return;
    }
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/students/${id}`,
        editedStudent,
        { headers }
      );
      alert("Usuário editado com sucesso!");
      handleSeeModal();
      fetchStudents();
    } catch (error) {
      alert("Erro ao editar usuário");
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
      alert("Permissões editadas com sucesso!");
    } catch (error) {
      alert("Erro ao editar permissões");
      handleSeeModal();
    }
  };

  const editStudentPassword = async (id) => {
    if (newPassword === confirmPassword) {
      setNewPassword(newPassword);
    } else {
      alert("As senhas são diferentes");
      return;
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

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${backDomain}/api/v1/students/`, {
        headers,
      });
      setStudents(response.data.listOfStudents);
      setLoading(false);
    } catch (error) {
      alert("Erro ao encontrar alunos");
      onLoggOut();
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
      alert("Aluno excluído");
      fetchStudents();
      handleSeeModal();
    } catch (error) {
      alert(error);

      handleSeeModal();
      console.error(error);
    }
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [hasReset, setHasReset] = useState(false);
  const [resetVisible, setResetVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

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
      alert("Erro ao resetar");
    }
  };

  const handleShowResetMonth = () => {
    setIsConfirmVisible(!isConfirmVisible);
  };
  const cellTable = {
    whiteSpace: "nowrap",
  };
  return (
    <>
      <HOne>{UniversalTexts.myStudents}</HOne>
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
            backgroundColor: "#fff",
            margin: "auto",
            width: "95%",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <span style={cellTable}>{UniversalTexts.name}</span>
                  </TableCell>
                  <TableCell>
                    <span style={cellTable}>{UniversalTexts.username}</span>
                  </TableCell>
                  <TableCell>
                    <span style={cellTable}>{UniversalTexts.document}</span>
                  </TableCell>
                  <TableCell>
                    <span style={cellTable}>{UniversalTexts.dateOfBirth}</span>
                  </TableCell>
                  <TableCell>
                    <span style={cellTable}>{UniversalTexts.email}</span>
                  </TableCell>
                  <TableCell>
                    <span style={cellTable}>{UniversalTexts.phoneNumber}</span>
                  </TableCell>
                  <TableCell>
                    <span style={cellTable}>{UniversalTexts.permissions}</span>
                  </TableCell>
                  <TableCell>
                    <span style={cellTable}>{UniversalTexts.fee}</span>
                  </TableCell>
                  <TableCell>
                    <span style={cellTable}>{UniversalTexts.totalScore}</span>
                  </TableCell>{" "}
                  <TableCell>
                    <span style={cellTable}>{UniversalTexts.monthlyScore}</span>
                  </TableCell>
                  <TableCell>
                    <span style={cellTable}>{UniversalTexts.address}</span>
                  </TableCell>{" "}
                  <TableCell>
                    <span style={cellTable}>
                      {UniversalTexts.weeklyClasses}
                    </span>
                  </TableCell>
                  <TableCell>
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
                            borderRadius: "50%",
                            height: "2.5rem",
                            objectFit: "cover",
                          }}
                          src={student.picture}
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
                      <TableCell>
                        <span style={cellTable}>R$ {student.fee}</span>
                      </TableCell>{" "}
                      <TableCell>
                        <span style={cellTable}>{student.totalScore}</span>
                      </TableCell>{" "}
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
                          style={{ color: primaryColor() }}
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
          <CircularProgress style={{ color: secondaryColor() }} />
        </div>
      )}

      <div
        onClick={() => handleSeeModal()}
        className="modal"
        style={{
          display: isVisible ? "block" : "none",
          zIndex: 30,
          position: "fixed",
          backgroundColor: "rgba(0,0,0,0.5)",
          width: "10000px",
          height: "10000px",
          top: 0,
          left: 0,
        }}
      />
      <DivModal
        className="modal"
        style={{
          display: isVisible ? "block" : "none",
        }}
      >
        <Xp onClick={() => handleSeeModal()}>X</Xp>
        <HOne
          style={{
            fontSize: "1.5rem",
            marginBottom: 0,
            margin: "1rem 0",
            color: primaryColor(),
            padding: "0.3rem",
            backgroundColor: textPrimaryColorContrast(),
          }}
        >
          Editar aluno - {newName}
        </HOne>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
              sx={{
                fontFamily: textTitleFont(),
                color: secondaryColor(),
                "& .MuiTab-root": {
                  fontFamily: textTitleFont(),
                  color: secondaryColor(),
                },
                "& .Mui-selected": {
                  color: secondaryColor(),
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: secondaryColor(),
                },
              }}
            >
              <Tab label="Dados gerais" value="1" />
              <Tab label="Permissões" value="2" />
              <Tab label="Senha" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <form
              style={{
                display: !seeConfirmDelete ? "block" : "none",
                maxHeight: "18rem",
                padding: "5px",
                overflow: "auto",
                height: "22rem",
                backgroundColor: "#eee",
              }}
            >
              <input
                className="inputs-style"
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                id="name"
                placeholder="Nome"
                type="text"
              />
              <input
                className="inputs-style"
                value={newLastName}
                onChange={(event) => setNewLastName(event.target.value)}
                id="lastname"
                placeholder="Sobrenome"
                type="text"
              />
              <input
                className="inputs-style"
                value={newUsername}
                onChange={(event) => setNewUsername(event.target.value)}
                placeholder="Username"
                type="text"
                disabled={true}
              />{" "}
              <input
                className="inputs-style"
                value={newAddress}
                onChange={(event) => setNewAddress(event.target.value)}
                placeholder="Address"
                type="text"
                disabled={true}
              />
              <input
                className="inputs-style"
                value={newPhone}
                onChange={(event) => setNewPhone(event.target.value)}
                placeholder="Número de celular"
                type="number"
              />
              <input
                className="inputs-style"
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                placeholder="E-mail"
                type="email"
              />
              <input
                className="inputs-style"
                value={googleDriveLink}
                onChange={(event) => setGoogleDriveLink(event.target.value)}
                placeholder="Link do Google Drive"
                type="text"
              />
              <input
                className="inputs-style"
                value={picture}
                onChange={(event) => setPicture(event.target.value)}
                placeholder="Foto"
                type="text"
              />
              <input
                className="inputs-style"
                value={fee}
                onChange={(event) => setFee(event.target.value)}
                placeholder="Mensalidade"
                type="number"
              />
              <input
                className="inputs-style"
                value={weeklyClasses}
                onChange={(event) => setWeeklyClasses(event.target.value)}
                placeholder="Aulas semanais"
                type="text"
              />
            </form>
            <div
              style={{
                marginTop: "2rem",
                display: !seeConfirmDelete ? "flex" : "none",
                justifyContent: "space-evenly",
                gap: "0.5rem",
              }}
            >
              <MyButton
                firstcolor="#FF1400"
                secondcolor="#F01400"
                textcolor="white"
                onClick={() => handleConfirmDelete()}
              >
                Excluir
              </MyButton>
              <MyButton onClick={() => handleSeeModal()}>Cancelar</MyButton>
              <MyButton
                firstcolor="#138017"
                secondcolor="#139417"
                textcolor="white"
                onClick={() => editStudent(ID)}
              >
                Salvar
              </MyButton>
            </div>
            <div
              style={{
                marginTop: "1rem",
                display: seeConfirmDelete ? "grid" : "none",
                justifyContent: "space-evenly",
                padding: "1rem",
                backgroundColor: "#dd6e6e",
                textAlign: "center",
              }}
            >
              <HThree>
                Esta ação não pode ser desfeita! Tem certeza que deseja excluir
                o(a) aluno(a) <br />
                <br />
                <span
                  style={{
                    backgroundColor: "#111",
                    color: "#fff",
                    padding: "0.3rem",
                    margin: "0.5rem",
                  }}
                >
                  {newName} {newLastName}
                </span>
                <br />
                <br />?
              </HThree>
              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <MyButton onClick={() => handleConfirmDelete()}>Não!!</MyButton>
                <MyButton
                  firstcolor="#FF1400"
                  secondcolor="#F01400"
                  onClick={() => deleteStudent(ID)}
                >
                  Sim...
                </MyButton>
              </div>
            </div>
          </TabPanel>
          <TabPanel value="2">
            <div
              style={{
                display: "grid",
                alignContent: "center",
                justifyItems: "center",
              }}
            >
              <select
                id="permissions"
                value={permissions}
                onChange={handleChange}
                style={{
                  padding: "0.3rem",
                  marginBottom: "0.3rem",

                  color: "#111",
                  minWidth: "15rem",
                }}
              >
                <option value="permissions" hidden>
                  Permissions
                </option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="superadmin">Superadmin</option>
              </select>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  gap: "1rem",
                  marginTop: "2rem",
                }}
              >
                <MyButton
                  style={{
                    color: "#fff",
                    width: "8rem",
                    backgroundColor: "#194169",
                  }}
                  onClick={() => handleSeeModal()}
                >
                  Cancelar
                </MyButton>
                <MyButton
                  firstcolor="#138017"
                  secondcolor="#139417"
                  onClick={() => editStudentPermissions(ID)}
                >
                  Salvar
                </MyButton>
              </div>
            </div>
          </TabPanel>
          <TabPanel value="3">
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
                <MyButton onClick={() => handleSeeModal()}>Cancelar</MyButton>
                <MyButton
                  firstcolor="#138017"
                  secondcolor="#139417"
                  onClick={() => editStudentPassword(ID)}
                >
                  Salvar
                </MyButton>
              </div>
            </div>
          </TabPanel>
        </TabContext>
      </DivModal>
    </>
  );
}

export default FindStudent;
