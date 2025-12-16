// Routes/ArvinComponents/Groups/GroupStudentsCard.tsx
import React, { FC, useMemo, useState } from "react";
import { UsersThree, UsersThreeIcon } from "@phosphor-icons/react";
import {
  cardBase,
  cardTitle,
} from "../../../Students/TheStudent/types/studentPage.styles";

type StudentItem = {
  id: string;
  _id?: string;
  name: string;
  lastname: string;
};

interface GroupStudentsCardProps {
  students: StudentItem[];
  selectedIds: string[];
  loading: boolean;
  setTRIGGER: any;
  onToggleStudent: (id: string) => void;
}

export const GroupStudentsCard: FC<GroupStudentsCardProps> = ({
  students,
  selectedIds,
  setTRIGGER,
  loading,
  onToggleStudent,
}) => {
  const [searchStudent, setSearchStudent] = useState("");

  const filteredStudents = useMemo(() => {
    const q = searchStudent.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => {
      const fullName = `${s.name || ""} ${s.lastname || ""}`.toLowerCase();
      return fullName.includes(q);
    });
  }, [students, searchStudent]);

  const totalStudents = selectedIds.length;

  return (
    <div style={cardBase}>
      {/* Header padrão Arvin */}
      <div style={cardTitle}>
        <UsersThreeIcon size={18} weight="bold" color="#111827" />
        <span>Alunos da turma</span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            color: "#94a3b8",
          }}
        >
          {totalStudents} aluno{totalStudents === 1 ? "" : "s"} selecionado
          {totalStudents === 1 ? "" : "s"}
        </span>
      </div>

      {/* Busca */}
      <input
        type="text"
        placeholder="🔍 Buscar aluno..."
        value={searchStudent}
        onChange={(e) => setSearchStudent(e.target.value)}
        className="no-focus"
        style={{
          width: "100%",
          borderRadius: 999,
          border: "1px solid #E2E8F0",
          padding: "6px 12px",
          fontSize: 12,
          outline: "none",
          marginTop: 12,
          marginBottom: 8,
          backgroundColor: "#f8fafc",
          color: "#111827",
        }}
      />

      {loading ? (
        <div style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>
          Carregando alunos...
        </div>
      ) : (
        <div
          style={{
            maxHeight: 220,
            overflowY: "auto",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            background: "#f9fafb",
            padding: "8px 6px",
            marginTop: 4,
          }}
        >
          {filteredStudents.map((student, indexST) => {
            const sid = String(student._id ?? student.id);
            const checked = selectedIds.includes(sid);
            return (
              <label
                key={sid + indexST}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 13,
                  color: "#334155",
                  marginBottom: 4,
                  cursor: "pointer",
                  padding: "4px 6px",
                  borderRadius: 6,
                  backgroundColor: checked ? "#e0f2fe" : "transparent",
                  transition: "background-color 0.15s ease",
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    onToggleStudent(sid);
                    setTRIGGER((prev: boolean) => !prev);
                  }}
                  style={{ marginRight: 8 }}
                />
                <span>
                  {student.name} {student.lastname}
                </span>
              </label>
            );
          })}

          {filteredStudents.length === 0 && (
            <div
              style={{
                fontSize: 12,
                color: "#9ca3af",
                padding: "4px 2px",
              }}
            >
              Nenhum aluno encontrado.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
