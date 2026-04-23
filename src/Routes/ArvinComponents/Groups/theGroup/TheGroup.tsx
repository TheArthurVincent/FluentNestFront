import React, { FC, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { StudentItem } from "../../Students/TheStudent/types/studentsTypes";
import { GroupHeader, GroupItem } from "./ComponentsGroup/GroupHeader";
import {
  GroupClassEvent,
  GroupHistoryCard,
} from "./ComponentsGroup/GroupHistoryCard";
import { GroupStudentsCard } from "./ComponentsGroup/GroupStudentsCard";
import { GroupMainInfoCard } from "./ComponentsGroup/GroupMainInfoCard";
import { GroupDangerZoneCard } from "./ComponentsGroup/GroupDangerZoneCard";
import { GroupSummaryCard } from "./ComponentsGroup/GroupSummaryClass";
import { GroupTodayClassesCard } from "./ComponentsGroup/GroupTodayClassesCard";

type GroupPageProps = {
  headers: MyHeadersType | any;
  isDesktop?: boolean;
  id?: string | number; // id do teacher (opcional, cai no loggedIn se não vier)
};

const GroupPage: FC<GroupPageProps> = ({ headers, isDesktop, id }) => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const [group, setGroup] = useState<GroupItem | null>(null);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [arrayOfIds, setArrayOfIds] = useState<string[]>([]);
  const [classesGroup, setClassesGroup] = useState<GroupClassEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [TRIGGER, setTRIGGER] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    if (!groupId) return;

    const fetchAll = async () => {
      try {
        setLoading(true);
        const logged = JSON.parse(localStorage.getItem("loggedIn") || "{}");
        const teacherId = id || logged.id || logged._id;

        // Carrega alunos do teacher
        if (teacherId) {
          setLoadingStudents(true);
          const resStudents = await axios.get(
            `${backDomain}/api/v1/students/${teacherId}`,
            { headers: headers as any },
          );
          setStudents(resStudents.data.listOfStudents || []);
          setLoadingStudents(false);
        }

        // Carrega o turma
        const resGroup = await axios.get(
          `${backDomain}/api/v1/group/${groupId}`,
          { headers: headers as any },
        );
        const g: GroupItem = resGroup.data.group || resGroup.data;
        setGroup(g);

        const ids =
          Array.isArray(g.studentIds) && g.studentIds.length
            ? g.studentIds.map((x: any) => String(x?._id ?? x))
            : [];
        setArrayOfIds(ids);

        // Histórico da turma (só pra resumo)
        setLoadingHistory(true);
        const resHistory = await axios.get(
          `${backDomain}/api/v1/grouphistory/${groupId}`,
          { headers: headers as any },
        );
        setClassesGroup(resHistory.data.classesGroup || []);
        setLoadingHistory(false);
      } catch (err) {
        console.error("Erro ao carregar turma", err);
        notifyAlert("Erro ao carregar turma (turma).");
        setLoadingStudents(false);
        setLoadingHistory(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [groupId, headers, id, TRIGGER]);

  const handleCheckboxChange = async (studentId: string) => {
    if (!group || !group._id) return;

    try {
      await axios.put(
        `${backDomain}/api/v1/group/${group._id}`,
        { idToAddOrRemove: studentId },
        { headers: headers as any },
      );

      setArrayOfIds((prev) =>
        prev.includes(studentId)
          ? prev.filter((id) => id !== studentId)
          : [...prev, studentId],
      );
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao atualizar alunos da turma.");
    }
  };

  const handleChangeName = async (name: string) => {
    if (!group || !group._id) return;
    setGroup((prev) => (prev ? { ...prev, name } : prev));
    try {
      await axios.put(
        `${backDomain}/api/v1/group-name/${group._id}`,
        { name },
        { headers: headers as any },
      );
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao alterar nome da turma.");
    }
  };

  const handleChangeDescription = async (description: string) => {
    if (!group || !group._id) return;
    setGroup((prev) => (prev ? { ...prev, description } : prev));
    try {
      await axios.put(
        `${backDomain}/api/v1/group-description/${group._id}`,
        { description },
        { headers: headers as any },
      );
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao alterar descrição da turma.");
    }
  };

  const handleChangePersonalComment = async (comment: string) => {
    if (!group || !group._id) return;
    setGroup((prev) => (prev ? { ...prev, personalComment: comment } : prev));
    try {
      await axios.put(
        `${backDomain}/api/v1/group-altercomment/${group._id}`,
        { comment },
        { headers: headers as any },
      );
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao alterar comentário da turma.");
    }
  };

  const deleteGroup = async () => {
    if (!group || !group._id) return;
    try {
      await axios.delete(`${backDomain}/api/v1/group/${group._id}`, {
        headers: headers as any,
      });
      notifyAlert("Turma excluída com sucesso.");
      navigate("/groups");
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao excluir turma.");
    }
  };

  // if (loading) {
  //   return (
  //     <div
  //       style={{
  //         padding: 16,
  //         fontFamily: "Lato",
  //       }}
  //     >
  //       Carregando turma...
  //     </div>
  //   );
  // }

  if (!group) {
    return (
      <div
        style={{
          padding: 16,
          fontFamily: "Lato",
        }}
      >
        {/* Turma não encontrada. */}
      </div>
    );
  }

  const totalStudents = arrayOfIds.length;
  const totalClasses = classesGroup.length;

  const lastClass =
    classesGroup && classesGroup.length > 0
      ? [...classesGroup].sort(
          (a, b) =>
            new Date(b.date || "").getTime() - new Date(a.date || "").getTime(),
        )[0]
      : undefined;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleNavigateHistory = () => {
    if (!group?._id) return;
    navigate(`/groups/${group._id}/history`);
  };

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
      <GroupHeader group={group} isDesktop={isDesktop} />

      <div
        style={{
          fontFamily:
            "Lato, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          display: "grid",
          gridTemplateColumns: isDesktop
            ? "minmax(0, 1.2fr) minmax(0, 1.4fr) minmax(0, 1fr)"
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
          <GroupMainInfoCard
            group={group}
            onChangeName={handleChangeName}
            onChangeDescription={handleChangeDescription}
            onChangePersonalComment={handleChangePersonalComment}
          />
          <GroupStudentsCard
            setTRIGGER={setTRIGGER}
            students={students}
            selectedIds={arrayOfIds}
            loading={loadingStudents}
            onToggleStudent={handleCheckboxChange}
          />
        </div>

        {/* COLUNA CENTRAL */}
        <div style={{ display: "grid", gap: 16, minWidth: 0 }}>
          <GroupSummaryCard
            TRIGGER={TRIGGER}
            group={group?._id || ""}
            totalStudents={totalStudents}
            totalClasses={totalClasses}
            actualHeaders={headers}
          />
          <GroupTodayClassesCard group={group || ""} actualHeaders={headers} />
        </div>

        {/* COLUNA DIREITA */}
        <div style={{ display: "grid", gap: 16, minWidth: 0 }}>
          <GroupHistoryCard
            totalClasses={totalClasses}
            lastClass={lastClass}
            loadingHistory={loadingHistory}
            onNavigateHistory={handleNavigateHistory}
            formatDate={formatDate}
          />
          <GroupDangerZoneCard onDeleteGroup={deleteGroup} />
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
