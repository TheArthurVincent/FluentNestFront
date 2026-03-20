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
import { partnerColor } from "../../../../Styles/Styles";
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
        { headers: actualHeaders },
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
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSeeContract(true);
    const studentID = event.target.value;
    setNewID(studentID);

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/contract/${event.target.value}`,
        { headers: actualHeaders },
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
        { headers: actualHeaders },
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

  const printStyles = `
  @media print {
    html, body {
      width: 210mm;
      height: 297mm;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: white;
    }

    body * {
      visibility: hidden !important;
    }

    #contract-content,
    #contract-content * {
      visibility: visible !important;
    }
#contract-content {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);

  width: 186mm;
  height: 273mm;

  padding: 8mm 10mm;
  box-sizing: border-box;

  background: white;
}
    #contract-content h1 {
      font-size: 18px !important;
      margin: 0 0 8px 0 !important;
    }

    #contract-content h2 {
      font-size: 14px !important;
      margin: 10px 0 6px 0 !important;
      padding: 0 !important;
    }

    #contract-content p,
    #contract-content li,
    #contract-content span,
    #contract-content div {
      font-size: 10px !important;
      line-height: 1.2 !important;
    }

    #contract-content ol {
      margin: 6px 0 0 18px !important;
      padding: 0 !important;
    }

    #contract-content li {
      margin-bottom: 4px !important;
    }

    .no-print {
      display: none !important;
    }

    .contract-student-grid {
      display: grid !important;
      grid-template-columns: 1fr 1fr 1fr !important;
      gap: 4px !important;
      margin-bottom: 4px !important;
    }

    .contract-details-grid {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 4px !important;
      margin-bottom: 4px !important;
    }

    .contract-signatures {
      display: flex !important;
      justify-content: space-between !important;
      align-items: flex-end !important;
      gap: 16px !important;
      margin-top: 10px !important;
    }

    .contract-signature-line {
      width: 220px !important;
      border-top: 1px solid #000 !important;
      padding-top: 4px !important;
      font-size: 10px !important;
    }

    .contract-signature-image {
      max-width: 70px !important;
      max-height: 35px !important;
      object-fit: contain !important;
      display: block !important;
      margin: 0 auto 4px auto !important;
      border-bottom: 1px solid #000 !important;
    }
@page {
  margin: 0;
}
    @page {
      size: A4 portrait;
      margin: 8mm;
    }
  }
`;

  return (
    <div className="contract-page">
      <style>{printStyles}</style>
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
            <button
              style={{
                backgroundColor: editing ? "red" : partnerColor(),
                color: "#fff",
              }}
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Cancelar Edição" : "Editar Termos"}
            </button>

            {editing && (
              <button
                style={{
                  backgroundColor: partnerColor(),
                  color: "#fff",
                }}
                onClick={handleSaveContractTerms}
              >
                Salvar
              </button>
            )}

            <button
              style={{
                backgroundColor: partnerColor(),
                color: "#fff",
              }}
              onClick={generatePDF}
            >
              Gerar PDF
            </button>
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
                      borderRadius: "6px",
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
              className="contract-student-grid"
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
              className="contract-details-grid"
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
                        borderRadius: "6px",
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
                    borderRadius: "6px",
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
              className="contract-signatures"
              style={{
                display: "flex",
                alignItems: "flex-end",
                textAlign: "center",
                justifyContent: "center",
                gap: "5rem",
              }}
            >
              <p className="contract-signature-line" style={topSignature}>
                {" "}
                {name} (ou RESPONSÁVEL) ___/___/___
              </p>
              <div>
                {isArthurVincent && (
                  <img
                    className="contract-signature-image"
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
            <button
              style={{
                backgroundColor: editing ? "red" : partnerColor(),
                color: "#fff",
              }}
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Cancelar Edição" : "Editar Termos"}
            </button>

            {editing && (
              <button
                style={{
                  backgroundColor: partnerColor(),
                  color: "#fff",
                }}
                onClick={handleSaveContractTerms}
              >
                Salvar
              </button>
            )}

            <button
              style={{
                backgroundColor: partnerColor(),
                color: "#fff",
              }}
              onClick={generatePDF}
            >
              Gerar PDF
            </button>
          </div>
        </>
      )}

      <Helmets text={`Contrato de Aulas Particulares | ${name}`} />
    </div>
  );
}

export default Contract;
