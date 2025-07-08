import React, { useState, useEffect } from "react";
import axios from "axios";
import { HeadersProps } from "../../../../Resources/types.universalInterfaces";
import {
  backDomain,
  formatDateBr,
} from "../../../../Resources/UniversalComponents";
import { MyButton } from "../../../../Resources/Components/ItemsLibrary";
import Helmets from "../../../../Resources/Helmets";
import { HOne } from "../../../../Resources/Components/RouteBox";
import { CircularProgress } from "@mui/material";
import { partnerColor } from "../../../../Styles/Styles";

export function Invoice({ headers }: HeadersProps) {
  const [studentsList, setStudentsList] = useState<any>([]);
  const [newID, setNewID] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [doc, setDoc] = useState<string>("");
  const [today, setDate] = useState<any>(new Date());
  const [thisMonth, setThisMonth] = useState<string>("Janeiro/1999");
  const [fee, setFee] = useState<number>(1000);
  const [loading, setLoading] = useState<Boolean>(false);

  const [comments, setComments] = useState<string>("");
  const handleStudentChange = async (event: any) => {
    setNewID(event.target.value);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/student/${event.target.value}`,
        {
          headers: actualHeaders,
        }
      );
      setName(response.data.formattedStudentData.fullname);
      setFee(response.data.formattedStudentData.fee);
      setDoc(response.data.formattedStudentData.doc);
    } catch (error) {
      alert("Erro ao encontrar alunos");
    }
  };

  const actualHeaders = headers || {};

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backDomain}/api/v1/students/`, {
        headers: actualHeaders,
      });
      setStudentsList(response.data.listOfStudents);
      setLoading(false);
    } catch (error) {
      alert("Erro ao encontrar alunos");
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);

  const generatePDF = () => {
    window.print();
  };

  return (
    <div>
      {loading ? (
        <CircularProgress style={{ color: partnerColor() }} />
      ) : (
        <div
          style={{
            display: "grid",
            gap: "5px",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 5rem",
          }}
        >
          <select
            onChange={handleStudentChange}
            name="students"
            className="no-print"
            id=""
            value={newID}
          >
            {studentsList.map((student: any, index: number) => {
              return (
                <option key={index} value={student.id}>
                  {student.name + " " + student.lastname}
                </option>
              );
            })}
          </select>
          <input
            className="no-print"
            type="date"
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
          <input
            className="no-print"
            value={thisMonth}
            type="text"
            onChange={(e) => {
              setThisMonth(e.target.value);
            }}
          />{" "}
          <input
            className="no-print"
            value={fee}
            type="number"
            onChange={(e) => {
              setFee(Number(e.target.value));
            }}
          />
          <input
            className="no-print"
            value={comments}
            placeholder="comments"
            type="text"
            onChange={(e) => {
              setComments(e.target.value);
            }}
          />
          <span className="no-print">
            <MyButton onClick={generatePDF}>Gerar PDF</MyButton>
          </span>
        </div>
      )}

      <div
        style={{
          fontSize: "25px",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <HOne style={{ fontSize: "40px", textAlign: "center" }}>
          Recibo de Pagamento
        </HOne>
        <div>
          <p>
            Recibo referente ao recebimento da importância de R$ {fee},00
            referente às aulas de inglês de {name}, (CPF: {doc}), no mês de{" "}
            {thisMonth}. Este valor compreende as aulas particulares + aulas em
            grupo.
          </p>
          {comments && (
            <div>
              <p>{comments}</p>
            </div>
          )}
          <img
            style={{
              margin: "auto",
              display: "block",
              maxWidth: "10rem",
              marginTop: "10rem",
              borderBottom: "solid 2px",
            }}
            src="https://ik.imagekit.io/vjz75qw96/assets/signature.png?updatedAt=1717680390615"
            alt="signatureArth"
          />{" "}
        
          <div style={{ fontSize: "16px" }}>
            <p>Arthur Rodrigues Cardoso | Professor Titular</p>
            <p>442.650.158-08</p>
            <br />
            <p
              style={{
                fontStyle: "italic",
              }}
            >
              {" "}
              Embu das Artes/SP, {formatDateBr(today)}
            </p>
          </div>
        </div>
      </div>
      <img
        style={{
          margin: "auto",
          marginTop: "3rem",
          display: "block",
          maxWidth: "12rem",
        }}
        src="https://ik.imagekit.io/vjz75qw96/assets/mylogotransp.png?updatedAt=1715968430436"
        alt="signatureArth"
      />
      <Helmets text={`Recibo de Pagamento de Aulas Particulares | ${name}`} />
    </div>
  );
}

export default Invoice;
