import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { newArvinTitleStyle } from "../Students";
import { StudentHeader } from "./sections/StudentHeader";
import { StudentTodayClassesCard } from "./sections/StudentTodayClassesCard";
import { StudentLessonsCard } from "./sections/StudentLessons";
import { StudentScoresCard } from "./sections/StudentScoresCard";
import { StudentFinancialReportsCard } from "./sections/StudentFinancialReportsCard";
import { StudentItem, TodayClass } from "./types/studentsTypes";
import { StudentMainCard } from "./sections/StudentMainCard.tsx";
import { StudentHWCard } from "./sections/StudentHomework";

type StudentPageProps = {
  headers: MyHeadersType;
  isDesktop?: boolean;
};

const StudentPage: FC<StudentPageProps> = ({ headers, isDesktop }) => {
  const { studentId } = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<StudentItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `${backDomain}/api/v1/student/${studentId}`,
          { headers: headers as any },
        );
        setStudent(res.data.formattedStudentData as StudentItem);
      } catch (err) {
        console.error("Erro ao carregar aluno", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId, headers]);

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div
        style={{
          padding: 16,
          fontFamily: "Plus Jakarta Sans",
        }}
      >
        Carregando aluno...
      </div>
    );
  }

  if (!student) {
    return (
      <div
        style={{
          padding: 16,
          fontFamily: "Plus Jakarta Sans",
        }}
      >
        Aluno não encontrado.
      </div>
    );
  }

  return (
    <div
      style={{
        margin: isDesktop ? "0px 16px 0px 0px" : "0px",
        padding: isDesktop ? 0 : 8,
        boxSizing: "border-box",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      {isDesktop && (
        <StudentHeader
          title={student.name + " " + student.lastname}
          style={newArvinTitleStyle}
        />
      )}

      <div
        style={{
          fontFamily:
            "Plus Jakarta Sans, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          display: "grid",
          gridTemplateColumns: isDesktop
            ? "repeat(3, minmax(0, 1fr))"
            : "minmax(0, 1fr)",
          gap: isDesktop ? 24 : 16,
          alignItems: "flex-start",
          margin: !isDesktop ? "12px" : "0px",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* COLUNA ESQUERDA */}
        <div style={{ display: "grid", gap: 16, minWidth: 0 }}>
          <StudentMainCard student={student} />
          <StudentLessonsCard student={student.id} />
          <StudentHWCard student={student.id} />
        </div>

        {/* COLUNA CENTRAL */}
        <div style={{ display: "grid", gap: 16, minWidth: 0 }}>
          <StudentTodayClassesCard actualHeaders={headers} student={student} />
          <StudentScoresCard student={student} />
        </div>

        {/* COLUNA DIREITA */}
        <div style={{ display: "grid", gap: 16, minWidth: 0 }}>
          <StudentFinancialReportsCard
            financialReports={student.financialReports || []}
            formatDate={formatDate}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
