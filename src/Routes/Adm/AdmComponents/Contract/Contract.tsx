import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, CircularProgress, TextField } from "@mui/material";
import { HeadersProps } from "../../../../Resources/types.universalInterfaces";
import {
  backDomain,
  formatDateBrContract,
} from "../../../../Resources/UniversalComponents";
import {
  formatCPF,
  formatPhoneNumber,
} from "../../../../Resources/Components/ItemsLibrary";
import Helmets from "../../../../Resources/Helmets";
import { HOne, HTwo } from "../../../../Resources/Components/RouteBox";
import { partnerColor, textTitleFont } from "../../../../Styles/Styles";
import { isArthurVincent, localStorageLoggedIn } from "../../../../App";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";

export function Contract({ headers }: HeadersProps) {
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [newID, setNewID] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [doc, setDoc] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [fee, setFee] = useState<number>(0);
  const [weeklyClasses, setWeeklyClasses] = useState<number>(0);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [customTerms, setCustomTerms] = useState<string[]>([]);
  const [editing, setEditing] = useState<boolean>(false);
  const [signed, setSigned] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [seeContract, setSeeContract] = useState<boolean>(false);

  const actualHeaders = headers || {};

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/students/${localStorageLoggedIn.id}`,
        { headers: actualHeaders }
      );
      setStudentsList(response.data.listOfStudents);
    } catch (error) {
      notifyAlert("Erro ao encontrar alunos");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleStudentChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSeeContract(true);
    const studentID = event.target.value;
    setNewID(studentID);

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/contract/${event.target.value}`,
        { headers: actualHeaders }
      );

      const data = response.data.contract;
      setName(data.fullname);
      setFee(data.fee);
      setWeeklyClasses(data.weeklyClasses);
      setEmail(data.email);
      setPhoneNumber(data.phoneNumber);
      setDoc(data.doc);
      setDateOfBirth(data.dateOfBirth);
      setCustomTerms(data.contractTerms || []);
      setSigned(data.signed || false);
    } catch (error) {
      notifyAlert("Erro ao carregar contrato do aluno.");
    }
  };

  const handleSaveContractTerms = async () => {
    try {
      await axios.put(
        `${backDomain}/api/v1/contract/${newID}`,
        {
          contractTerms: customTerms,
          fullname: name,
          fee,
          weeklyClasses,
          dateOfBirth,
          phoneNumber,
          email,
        },
        { headers: actualHeaders }
      );
      notifyAlert("Contrato atualizado com sucesso!", partnerColor());
      setEditing(false);
    } catch (err) {
      notifyAlert("Erro ao salvar contrato.", "red");
    }
  };

  const handleSignContract = async () => {
    try {
      await axios.put(`${backDomain}/api/v1/signcontract/${newID}`, null, {
        headers: actualHeaders,
      });
      notifyAlert("Contrato assinado com sucesso!", partnerColor());
      setSigned(true);
    } catch (err) {
      notifyAlert("Erro ao assinar contrato.", "red");
    }
  };

  const generatePDF = () => {
    window.print();
  };

  const liStyle = { listStyle: "upper-roman", marginBottom: "8px" };
  const topSignature = {
    width: "25rem",
    borderTop: "2px solid",
    paddingTop: "5px",
  };

  return (
    <div>
      {loading ? (
        <CircularProgress style={{ color: partnerColor() }} />
      ) : (
        <div
          className="no-print"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 5rem",
          }}
        >
          <select onChange={handleStudentChange} value={newID}>
            <option value="" hidden>
              Selecione um aluno
            </option>
            {studentsList.map((student, index) => (
              <option key={index} value={student.id}>
                {student.name + " " + student.lastname}
              </option>
            ))}
          </select>

          <div className="no-print" style={{ display: "flex", gap: "1rem" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: editing ? "red" : partnerColor(),
                color: "#fff",
                "&:hover": {
                  backgroundColor: editing
                    ? "rgba(251, 85, 85, 0)"
                    : partnerColor(),
                },
              }}
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Cancelar Edição" : "Editar Termos"}
            </Button>

            {editing && (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: partnerColor(),
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: partnerColor(),
                  },
                }}
                onClick={handleSaveContractTerms}
              >
                Salvar
              </Button>
            )}

            <Button
              variant="contained"
              sx={{
                backgroundColor: partnerColor(),
                color: "#fff",
                "&:hover": {
                  backgroundColor: partnerColor(),
                },
              }}
              onClick={generatePDF}
            >
              Gerar PDF
            </Button>
          </div>
        </div>
      )}
      {seeContract && (
        <>
          <div
            style={{ padding: "1rem", fontSize: "11px" }}
            id="contract-content"
          >
            <HOne>Contrato de Aulas Particulares</HOne>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              {signed ? (
                <>
                  {/* <CheckCircleIcon style={{ color: "green" }} /> */}
                  <span style={{ color: "green" }}>Assinado</span>
                </>
              ) : (
                <>
                  {/* <CancelIcon style={{ color: "red" }} /> */}
                  <span style={{ color: "red" }}>Não assinado</span>
                  <button
                    className="no-print"
                    onClick={handleSignContract}
                    style={{
                      backgroundColor: partnerColor(),
                      color: "#fff",
                      padding: "4px 10px",
                      border: "none",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {/* <BorderColorIcon fontSize="small" /> */}
                    Assinado?
                  </button>
                </>
              )}
            </div>

            <HTwo style={{ paddingBottom: "2rem", textAlign: "center" }}>
              Dados do Aluno
            </HTwo>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                textAlign: "center",
              }}
            >
              {editing ? (
                <>
                  <TextField
                    label="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    label="Nascimento"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={dateOfBirth?.substring(0, 10)}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                  <TextField
                    label="Telefone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    label="CPF"
                    onChange={(e) => setDoc(e.target.value)}
                    value={doc}
                  />
                </>
              ) : (
                <>
                  <p>
                    <strong>Nome:</strong> {name}
                  </p>
                  <p>
                    <strong>Nascimento:</strong>{" "}
                    {formatDateBrContract(dateOfBirth)}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {formatPhoneNumber(phoneNumber)}
                  </p>
                  <p>
                    <strong>Email:</strong> {email}
                  </p>
                  <p>
                    <strong>CPF:</strong> {formatCPF(doc)}
                  </p>
                </>
              )}
            </div>
            <HTwo style={{ marginTop: "1rem", textAlign: "center" }}>
              Detalhes do Contrato
            </HTwo>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                textAlign: "center",
              }}
            >
              {editing ? (
                <>
                  <TextField
                    label="Nº de aulas por semana"
                    type="number"
                    value={weeklyClasses}
                    onChange={(e) => setWeeklyClasses(parseInt(e.target.value))}
                  />
                  <TextField
                    label="Mensalidade (R$)"
                    type="number"
                    value={fee}
                    onChange={(e) => setFee(parseFloat(e.target.value))}
                  />
                </>
              ) : (
                <>
                  <p>
                    <strong>Nº de aulas por semana:</strong> {weeklyClasses}
                  </p>
                  <p>
                    <strong>Valor acordado:</strong> R$ {fee}
                  </p>
                </>
              )}
            </div>
            <HTwo style={{ marginTop: "1rem", textAlign: "center" }}>
              Termos do Contrato
            </HTwo>
            {editing ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.8rem",
                }}
              >
                {customTerms.map((term, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ fontWeight: "bold", minWidth: "2rem" }}>
                      {String.fromCharCode(73 + index)}
                    </span>
                    <textarea
                      value={term}
                      onChange={(e) => {
                        const updated = [...customTerms];
                        updated[index] = e.target.value;
                        setCustomTerms(updated);
                      }}
                      style={{ flex: 1, padding: "6px" }}
                    />
                    <button
                      className="no-print"
                      onClick={() => {
                        const updated = [...customTerms];
                        updated.splice(index, 1);
                        setCustomTerms(updated);
                      }}
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "2px 6px",
                        cursor: "pointer",
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setCustomTerms([...customTerms, ""])}
                  style={{
                    backgroundColor: partnerColor(),
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                    marginTop: "1rem",
                  }}
                >
                  + Adicionar cláusula
                </button>
              </div>
            ) : (
              <ol style={{ padding: "0 2rem", marginTop: "1rem" }}>
                {customTerms.map((term, index) => (
                  <li key={index} style={liStyle}>
                    {term}
                  </li>
                ))}
              </ol>
            )}
            <HTwo style={{ textAlign: "center" }}>Assinaturas</HTwo>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                textAlign: "center",
                justifyContent: "center",
                gap: "5rem",
              }}
            >
              <p style={topSignature}> {name} (ou RESPONSÁVEL) ___/___/___</p>
              <div>
                {isArthurVincent && (
                  <img
                    style={{ maxWidth: "6rem", borderBottom: "solid 2px" }}
                    src="https://ik.imagekit.io/vjz75qw96/assets/signature.png?updatedAt=1717680390615"
                    alt="signatureArth"
                  />
                )}
                <p>ASSINATURA DO PROFESSOR</p>
              </div>
            </div>
          </div>

          <div className="no-print" style={{ display: "flex", gap: "1rem" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: editing ? "red" : partnerColor(),
                color: "#fff",
                "&:hover": {
                  backgroundColor: editing
                    ? "rgba(251, 85, 85, 0)"
                    : partnerColor(),
                },
              }}
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Cancelar Edição" : "Editar Termos"}
            </Button>

            {editing && (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: partnerColor(),
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: partnerColor(),
                  },
                }}
                onClick={handleSaveContractTerms}
              >
                Salvar
              </Button>
            )}

            <Button
              variant="contained"
              sx={{
                backgroundColor: partnerColor(),
                color: "#fff",
                "&:hover": {
                  backgroundColor: partnerColor(),
                },
              }}
              onClick={generatePDF}
            >
              Gerar PDF
            </Button>
          </div>
        </>
      )}

      <Helmets text={`Contrato de Aulas Particulares | ${name}`} />
    </div>
  );
}

export default Contract;
