// Routes/ArvinComponents/Students/StudentPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { partnerColor } from "../../../../Styles/Styles";

type StudentPageProps = {
  headers: MyHeadersType;
};

type StudentItem = {
  id: string;
  name: string;
  lastname: string;
  email: string;
  picture?: string;
  username?: string;
  // aqui depois você pode colocar mais campos do aluno
};

const StudentPage: React.FC<StudentPageProps> = ({ headers }) => {
  const { studentId } = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<StudentItem | null>(null);
  const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     if (!studentId) return;

  //     const fetchStudent = async () => {
  //       try {
  //         // AJUSTE ESSA ROTA CONFORME SEU BACKEND
  //         const res = await axios.get(
  //           `${backDomain}/api/v1/students/${studentId}`,
  //           { headers: headers as any }
  //         );
  //         setStudent(res.data);
  //       } catch (err) {
  //         console.error("Erro ao carregar aluno", err);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchStudent();
  //   }, [studentId, headers]);

//   if (loading) return <p>Carregando aluno...</p>;
//   if (!student) return <p>Aluno não encontrado.</p>;

  return (
    <div
      style={{
        padding: 16,
        maxWidth: 800,
        margin: "0 auto",
        fontFamily: "Plus Jakarta Sans",
      }}
    >
      {studentId}
    </div>
  );
};

export default StudentPage;
