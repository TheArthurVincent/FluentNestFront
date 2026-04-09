import React, { FC, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import { categoryList } from "../../../MyCalendar/CalendarComponents/MyCalendarFunctions/MyCalendarFunctions";
import {
  cardBase,
  cardTitle,
} from "../../Students/TheStudent/types/studentPage.styles";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { partnerColor } from "../../../../Styles/Styles";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import EventVideo from "./VideoClass";
import StudentClassesHistory from "../../Students/TheStudent/StudentsClasses/StudentClassesHistory";
import GroupClassesHistory from "../../Groups/theGroup/GroupClassesHistory/GroupClassesHistory";
import { CircularProgress } from "@mui/material";

type FreeEventItem = {
  _id: string;
  date: string;
  time: string;
};

type LessonShape = {
  id: string;
  title: string;
  module: string;
  course: string;
};

type MainInfoClassProps = {
  headers: MyHeadersType;
  evendId: string;
  fetchEventData: () => void;
  isDesktop?: boolean;
  event?: any;
  permissionsUser?: string;
  allowedToEdit?: boolean;

  theDescription?: string;
  theTeacherDescription?: string;
  lesson?: LessonShape | null;
  status: string;
  title: string;
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 99999,
};

const modalStyle: React.CSSProperties = {
  width: "min(92vw, 520px)",
  background: "#fff",
  borderRadius: 6,
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  overflow: "hidden",
  border: "1px solid #e2e8f0",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #e2e8f0",
  borderRadius: 6,
  padding: "8px 10px",
  fontSize: 13,
};

const ghostBtnStyle: React.CSSProperties = {
  borderRadius: 6,
  border: "1px solid #e2e8f0",
  backgroundColor: "white",
  color: "#0f172a",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 13,
};

const primaryBtnStyle: React.CSSProperties = {
  borderRadius: 6,
  border: "1px solid #0891b2",
  backgroundColor: partnerColor(),
  color: "white",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
};

const MainInfoClass: FC<MainInfoClassProps> = ({
  headers,
  evendId,
  isDesktop,
  event,
  fetchEventData,
  allowedToEdit,
  permissionsUser,
  theDescription,
  theTeacherDescription,
  lesson,
  status,
  title,
}) => {
  type AttendanceItem = {
    studentID: string;
    firstName: string;
    lastName: string;
    picture: string | null;
    attended: boolean;
    description: string; // visível para aluno
    teacherDescription: string; // interno
  };

  const presetOptions = [30, 45, 60, 90];

  const logged = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("loggedIn") || "null");
    } catch {
      return null;
    }
  }, []);

  const myId = String(logged?.id || "");
  const isStudent =
    permissionsUser === "student" || logged?.permissions === "student";
  const canEditAttendance = Boolean(allowedToEdit) && !isStudent;

  // Para aluno: o padrão é event.studentID ser o ID dele.
  // Se por algum motivo estiver vazio, cai no myId.
  const myStudentId = useMemo(() => {
    if (event?.studentID) return String(event.studentID);
    return myId;
  }, [event?.studentID, myId]);

  const [isStudentCommentModalOpen, setIsStudentCommentModalOpen] =
    useState(false);
  const [editingStudentComment, setEditingStudentComment] = useState("");
  const [savingStudentComment, setSavingStudentComment] = useState(false);

  const saveStudentComment = async () => {
    try {
      setSavingStudentComment(true);

      const response = await axios.put(
        `${backDomain}/api/v1/student-comment/${myStudentId}`,
        { newComment: editingStudentComment },
        { headers: headers as any },
      );

      const updatedComment = response.data?.studentComment || "";
      setStudentComment(updatedComment);
      setEditingStudentComment(updatedComment);
      setIsStudentCommentModalOpen(false);

      notifyAlert("Comentário do aluno salvo com sucesso.", partnerColor());
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao salvar comentário do aluno.", partnerColor());
    } finally {
      setSavingStudentComment(false);
    }
  };

  const renderStudentCommentModal = () => {
    if (!isStudentCommentModalOpen) return null;
    if (typeof document === "undefined") return null;

    const close = () => {
      if (!savingStudentComment) {
        setIsStudentCommentModalOpen(false);
      }
    };

    return createPortal(
      <div style={overlayStyle} onClick={close}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <div
            style={{
              padding: "16px 16px",
              borderBottom: "1px solid #e2e8f0",
              fontSize: 15,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Editar comentário sobre o aluno.
          </div>
          <i
            style={{
              padding: "12px 16px",
              display: "block",
              fontSize: 12,
              color: "#64748b",
            }}
          >
            Esta sessão serve para te ajudar a lembrar dos combinados que você
            fez com o aluno — como conteúdos que se comprometeu a ensinar,
            estratégias para apoiá-lo melhor e formas de acompanhar o progresso
            dele ao longo das aulas.
          </i>
          <div style={{ padding: "12px", display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>
                Sobre o aluno
              </label>

              <textarea
                value={editingStudentComment}
                onChange={(e) => setEditingStudentComment(e.target.value)}
                disabled={savingStudentComment}
                placeholder="Escreva aqui um comentário sobre o aluno..."
                style={{
                  ...inputStyle,
                  minHeight: 140,
                  resize: "vertical",
                  fontFamily: "Plus Jakarta Sans",
                }}
              />
            </div>
          </div>

          <div
            style={{
              padding: 12,
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <button
              style={ghostBtnStyle}
              onClick={close}
              disabled={savingStudentComment}
            >
              Cancelar
            </button>

            <button
              onClick={saveStudentComment}
              style={{
                ...primaryBtnStyle,
                opacity: savingStudentComment ? 0.7 : 1,
              }}
              disabled={savingStudentComment}
            >
              {savingStudentComment ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>,
      document.body,
    );
  };

  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceSaving, setAttendanceSaving] = useState(false);
  const [theNameOfTheStudents, setTheNameOfTheStudents] = useState("");
  const [thePermissionsOfTheStudents, setThePermissionsOfTheStudents] =
    useState("");
  const [attendanceSearch, setAttendanceSearch] = useState("");
  const [attendanceList, setAttendanceList] = useState<AttendanceItem[]>([]);
  const [attendanceOriginal, setAttendanceOriginal] = useState<
    AttendanceItem[]
  >([]);
  const [isAttendanceListOpen, setIsAttendanceListOpen] = useState(false);
  const [studentComment, setStudentComment] = useState("");

  const fetchStudentComment = async () => {
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/student-comment/${myStudentId}`,
        { headers: headers as any },
      );
      setStudentComment(response.data?.studentComment || "");
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao salvar lista de presença.", partnerColor());
    } finally {
      setAttendanceSaving(false);
    }
  };

  const isEstablishedGroupClass = event?.category === "Established Group Class";
  async function fetchAttendanceList() {
    if (!isEstablishedGroupClass) return;

    try {
      setAttendanceLoading(true);

      const response = await axios.get(
        `${backDomain}/api/v1/attendance-list/${evendId}`,
        { headers: headers as any },
      );

      const list = (response.data?.attendanceList || []) as AttendanceItem[];
      setAttendanceList(list);
      setAttendanceOriginal(list);
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao carregar lista de presença.", partnerColor());
    } finally {
      setAttendanceLoading(false);
    }
  }
  const myAttendanceItem = useMemo(() => {
    const list = attendanceList || [];
    return (
      list.find((x) => String(x.studentID) === String(myStudentId)) || null
    );
  }, [attendanceList, myStudentId]);

  // Modal: teacher/admin vê tudo; aluno (se um dia abrir) vê só o próprio
  const attendanceListForView = useMemo(() => {
    if (canEditAttendance) return attendanceList;
    return myAttendanceItem ? [myAttendanceItem] : [];
  }, [attendanceList, canEditAttendance, myAttendanceItem]);

  const saveAttendanceList = async () => {
    try {
      setAttendanceSaving(true);

      const payload = {
        attendanceList: attendanceList.map((it) => ({
          studentID: it.studentID,
          attended: Boolean(it.attended),
          description: it.description || "",
          teacherDescription: it.teacherDescription || "",
        })),
      };

      const response = await axios.put(
        `${backDomain}/api/v1/attendance-list/${evendId}`,
        payload,
        { headers: headers as any },
      );

      const updated = (response.data?.attendanceList || []) as AttendanceItem[];
      setAttendanceList(updated);
      setAttendanceOriginal(updated);

      notifyAlert("Lista de presença salva.", partnerColor());
      setIsAttendanceListOpen(false);
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao salvar lista de presença.", partnerColor());
    } finally {
      setAttendanceSaving(false);
    }
  };

  // Sempre busca para mostrar a linha no card (presença/comentários)
  useEffect(() => {
    if (!evendId) return;
    fetchAttendanceList();
    fetchStudentComment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evendId, myStudentId]);

  useEffect(() => {
    if (isAttendanceListOpen) {
      setAttendanceSearch("");
      fetchAttendanceList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAttendanceListOpen]);

  const markAllAttendance = (value: boolean) => {
    if (!canEditAttendance) return;
    setAttendanceList((prev) => prev.map((it) => ({ ...it, attended: value })));
  };

  const resetAttendanceChanges = () => {
    if (!canEditAttendance) return;
    setAttendanceList(attendanceOriginal);
  };

  const toggleAttendance = (studentID: string) => {
    if (!canEditAttendance) return;
    setAttendanceList((prev) =>
      prev.map((it) =>
        it.studentID === studentID ? { ...it, attended: !it.attended } : it,
      ),
    );
  };

  const filteredAttendance = useMemo(() => {
    const base = attendanceListForView;
    const q = attendanceSearch.trim().toLowerCase();
    if (!q) return base;

    return base.filter((it) => {
      const full = `${it.firstName} ${it.lastName}`.trim().toLowerCase();
      return full.includes(q) || String(it.studentID).toLowerCase().includes(q);
    });
  }, [attendanceListForView, attendanceSearch]);

  const renderAttendanceListModal = () => {
    if (!isAttendanceListOpen) return null;
    if (typeof document === "undefined") return null;

    const close = () => {
      if (!attendanceSaving) setIsAttendanceListOpen(false);
    };

    return createPortal(
      <div style={overlayStyle} onClick={close}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            ...modalStyle,
            width: "min(96vw, 720px)",
            maxHeight: "86vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ display: "grid" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
                Lista de Presença
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                {canEditAttendance
                  ? "Marque quem compareceu e salve."
                  : "Você vê apenas sua presença e comentário."}
              </div>
            </div>

            <button
              onClick={close}
              style={ghostBtnStyle}
              disabled={attendanceSaving}
            >
              Fechar
            </button>
          </div>

          <div style={{ padding: 12, display: "grid", gap: 10 }}>
            <div
              style={{
                display: "grid",
                gap: 8,
                gridTemplateColumns: "1fr auto auto auto",
                alignItems: "center",
              }}
            >
              <input
                value={attendanceSearch}
                onChange={(e) => setAttendanceSearch(e.target.value)}
                placeholder="Buscar aluno..."
                style={inputStyle}
                disabled={
                  attendanceLoading || attendanceSaving || !canEditAttendance
                }
              />

              <button
                type="button"
                onClick={() => markAllAttendance(true)}
                style={ghostBtnStyle}
                disabled={
                  attendanceLoading ||
                  attendanceSaving ||
                  !canEditAttendance ||
                  attendanceList.length === 0
                }
              >
                Marcar todos
              </button>

              <button
                type="button"
                onClick={() => markAllAttendance(false)}
                style={ghostBtnStyle}
                disabled={
                  attendanceLoading ||
                  attendanceSaving ||
                  !canEditAttendance ||
                  attendanceList.length === 0
                }
              >
                Desmarcar todos
              </button>

              <button
                type="button"
                onClick={resetAttendanceChanges}
                style={ghostBtnStyle}
                disabled={
                  attendanceLoading || attendanceSaving || !canEditAttendance
                }
                title="Voltar para o estado carregado do servidor"
              >
                Reset
              </button>
            </div>

            {attendanceLoading ? (
              <div
                style={{
                  border: "1px dashed #e2e8f0",
                  borderRadius: 10,
                  padding: 14,
                  color: "#64748b",
                  fontSize: 13,
                }}
              >
                Carregando lista...
              </div>
            ) : filteredAttendance.length === 0 ? (
              <div
                style={{
                  border: "1px dashed #e2e8f0",
                  borderRadius: 10,
                  padding: 14,
                  color: "#64748b",
                  fontSize: 13,
                }}
              >
                Nenhum aluno encontrado.
              </div>
            ) : (
              <div
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 140px",
                    padding: "10px 12px",
                    background: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                    fontSize: 12,
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  <div>Aluno</div>
                  <div style={{ textAlign: "right" }}>Compareceu</div>
                </div>

                <div style={{ maxHeight: 300, overflowY: "auto" }}>
                  {filteredAttendance.map((it) => {
                    const fullName = `${it.firstName} ${it.lastName}`.trim();

                    return (
                      <div
                        key={it.studentID}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 140px",
                          alignItems: "start",
                          padding: "10px 12px",
                          borderBottom: "1px solid #f1f5f9",
                          gap: 10,
                        }}
                      >
                        <div style={{ display: "grid", gap: 10 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            {isDesktop && (
                              <div
                                style={{
                                  width: 34,
                                  height: 34,
                                  borderRadius: 6,
                                  overflow: "hidden",
                                  border: "1px solid #e2e8f0",
                                  background: "#fff",
                                  flex: "0 0 34px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#64748b",
                                  fontSize: 12,
                                  fontWeight: 800,
                                }}
                              >
                                {it.picture ? (
                                  <img
                                    src={it.picture}
                                    alt={fullName || "Aluno"}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                ) : (
                                  (it.firstName?.[0] || "?").toUpperCase()
                                )}
                              </div>
                            )}

                            <div style={{ display: "grid", lineHeight: 1.15 }}>
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: 800,
                                  color: "#0f172a",
                                }}
                              >
                                {fullName || "Aluno sem nome"}
                              </div>
                              <div style={{ fontSize: 11, color: "#64748b" }}>
                                ID: {it.studentID}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: "grid", gap: 10 }}>
                            <div style={{ display: "grid", gap: 6 }}>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#64748b",
                                  fontWeight: 700,
                                }}
                              >
                                Descrição para o aluno
                              </div>
                              <input
                                value={it.description || ""}
                                onChange={(e) => {
                                  if (!canEditAttendance) return;
                                  const v = e.target.value;
                                  setAttendanceList((prev) =>
                                    prev.map((x) =>
                                      x.studentID === it.studentID
                                        ? { ...x, description: v }
                                        : x,
                                    ),
                                  );
                                }}
                                style={inputStyle}
                                placeholder="Escreva uma observação para o aluno..."
                                disabled={
                                  attendanceSaving || !canEditAttendance
                                }
                              />
                            </div>

                            {canEditAttendance && (
                              <div style={{ display: "grid", gap: 6 }}>
                                <div
                                  style={{
                                    fontSize: 11,
                                    color: "#64748b",
                                    fontWeight: 700,
                                  }}
                                >
                                  Descrição do professor (interno)
                                </div>
                                <input
                                  value={it.teacherDescription || ""}
                                  onChange={(e) => {
                                    const v = e.target.value;
                                    setAttendanceList((prev) =>
                                      prev.map((x) =>
                                        x.studentID === it.studentID
                                          ? { ...x, teacherDescription: v }
                                          : x,
                                      ),
                                    );
                                  }}
                                  style={inputStyle}
                                  placeholder="Nota interna (não aparece para o aluno)..."
                                  disabled={attendanceSaving}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            paddingTop: 6,
                          }}
                        >
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              cursor:
                                attendanceSaving || !canEditAttendance
                                  ? "not-allowed"
                                  : "pointer",
                              userSelect: "none",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={Boolean(it.attended)}
                              disabled={attendanceSaving || !canEditAttendance}
                              onChange={() => toggleAttendance(it.studentID)}
                              style={{
                                width: 18,
                                height: 18,
                                accentColor: partnerColor(),
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              padding: 12,
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <button
              style={ghostBtnStyle}
              onClick={close}
              disabled={attendanceSaving}
            >
              Cancelar
            </button>

            {canEditAttendance && (
              <button
                onClick={saveAttendanceList}
                style={{
                  ...primaryBtnStyle,
                  opacity: attendanceSaving ? 0.7 : 1,
                }}
                disabled={attendanceSaving || attendanceLoading}
              >
                {attendanceSaving ? "Salvando..." : "Salvar"}
              </button>
            )}
          </div>
        </div>
      </div>,
      document.body,
    );
  };

  const [isPreviousClassesOpen, setIsPreviousClassesOpen] = useState(false);
  const [isMainInfoModalOpen, setIsMainInfoModalOpen] = useState(false);
  const [savingMainInfo, setSavingMainInfo] = useState(false);

  const [date, setDate] = useState<string>(event?.date || "");
  const [time, setTime] = useState<string>(event?.time || "");
  const [link, setLink] = useState<string>(event?.link || "");
  const [importantLink, setExternallink] = useState<string>(
    event?.importantLink || "",
  );
  const [category, setCategory] = useState<string>(event?.category || "");
  const [duration, setDuration] = useState<number | "">(event?.duration ?? "");
  const [preset, setPreset] = useState<string>("");

  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleTab, setRescheduleTab] = useState<"fixed" | "free">("fixed");
  const [rescheduling, setRescheduling] = useState(false);

  const [newDate, setNewDate] = useState<string>(event?.date || "");
  const [newTime, setNewTime] = useState<string>(event?.time || "");

  const [loadingEventsFree, setLoadingEventsFree] = useState(false);
  const [eventsFreeArray, setEventsFreeArray] = useState<FreeEventItem[]>([]);
  const [selectedFreeEvent, setSelectedFreeEvent] =
    useState<FreeEventItem | null>(null);

  const [allowedToReschedule, setAllowedToReschedule] = useState(false);

  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [savingDescription, setSavingDescription] = useState(false);

  const [description, setDescription] = useState<string>(theDescription || "");
  const [teacherDescription, setTeacherDescription] = useState<string>(
    theTeacherDescription || "",
  );

  const [theLesson, setTheLesson] = useState<LessonShape | null>(
    lesson || null,
  );
  const [loadingDescriptionAI, setLoadingDescriptionAI] = useState(false);
  const [change, setChange] = useState(false);

  useEffect(() => {
    setDate(event?.date || "");
    setTime(event?.time || "");
    setLink(event?.link || "");

    const d = event?.duration ?? "";
    setDuration(d);

    if (typeof d === "number" && presetOptions.includes(d))
      setPreset(String(d));
    else setPreset("custom");

    setCategory(event?.category || "");

    setNewDate(event?.date || "");
    setNewTime(event?.time || "");
    setSelectedFreeEvent(null);
  }, [event]);

  useEffect(() => {
    setDescription(theDescription || "");
  }, [theDescription]);

  useEffect(() => {
    setTeacherDescription(theTeacherDescription || "");
  }, [theTeacherDescription]);

  useEffect(() => {
    setTheLesson(lesson || null);
    fetchStudentComment();
  }, [lesson]);

  const updateMainInfo = async (id: string) => {
    try {
      setSavingMainInfo(true);

      const payload: any = {
        date,
        time,
        link,
        category,
        importantLink,
        duration: typeof duration === "number" ? duration : undefined,
      };

      const response = await axios.put(
        `${backDomain}/api/v1/eventmaininfo/${id}`,
        payload,
        { headers: headers as any },
      );

      if (response) fetchEventData();
    } catch (error) {
      console.error("Erro ao atualizar informações do evento", error);
      notifyAlert("Erro ao salvar informações do evento.", partnerColor());
    } finally {
      setSavingMainInfo(false);
    }
  };

  const handleSaveMainInfo = async () => {
    await updateMainInfo(evendId);
    setIsMainInfoModalOpen(false);
  };

  const fetchEventsFree = async () => {
    const loggedIn = JSON.parse(localStorage.getItem("loggedIn") || "false");

    if (!loggedIn) return;

    try {
      setLoadingEventsFree(true);

      const response = await axios.get(
        `${backDomain}/api/v1/free-events/${event.studentID}?loggedInId=${loggedIn._id || loggedIn.id}&foo=bar`,
        { headers: headers as any },
      );
      const permissions = response.data?.permissions || "";
      const theName = response.data?.name || "";
      setThePermissionsOfTheStudents(permissions);
      setTheNameOfTheStudents(theName);
      const arr = (response.data?.events || []) as FreeEventItem[];
      setAllowedToReschedule(response.data?.allowedToReschedule || false);
      setEventsFreeArray(arr);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingEventsFree(false);
    }
  };

  const rescheduleEvent = async (
    id: string,
    forced?: { date: string; time: string; idNew?: string },
  ) => {
    try {
      setRescheduling(true);
      await axios.put(
        `${backDomain}/api/v1/event-reschedule/${id}`,
        { forced },
        { headers: headers as any },
      );

      window.location.reload();
    } catch (error) {
      console.error("Erro ao reagendar o evento", error);
      notifyAlert("Erro ao reagendar a aula.", partnerColor());
    } finally {
      setRescheduling(false);
    }
  };

  const openRescheduleModal = () => {
    fetchEventsFree();
    setRescheduleTab("fixed");
    setSelectedFreeEvent(null);
    setIsRescheduleOpen(true);
  };

  const updateDescription = async (id: string) => {
    try {
      setSavingDescription(true);
      const response = await axios.put(
        `${backDomain}/api/v1/eventdescription/${id}`,
        { description, theLesson, teacherDescription },
        { headers: headers as any },
      );
      if (response) fetchEventData();
    } catch (error) {
      console.log(error, "Erro ao atualizar descrição do evento");
      notifyAlert("Erro ao salvar descrição da aula.", partnerColor());
    } finally {
      setSavingDescription(false);
    }
  };

  const handleSaveDescription = async () => {
    await updateDescription(evendId);
    setIsDescriptionModalOpen(false);
  };

  const handleClassSummary = async () => {
    setLoadingDescriptionAI(true);

    const loggedNow = JSON.parse(localStorage.getItem("loggedIn") || "null");
    const thePermissions = loggedNow?.permissions;
    const myIdNow = loggedNow?.id;

    if (thePermissions === "superadmin" || thePermissions === "teacher") {
      try {
        const response = await axios.put(
          `${backDomain}/api/v1/ai-description/${myIdNow}`,
          {
            status,
            description: description
              ? description
              : `Aula particular de ${title}`,
            classTitle: theLesson?.title,
            evendId: evendId || "",
          },
          { headers: headers as any },
        );

        const adapted = response.data.adapted;
        setDescription(adapted);
        setTeacherDescription(response.data.teacherDescription);
        setChange(!change);
      } catch (error) {
        notifyAlert("Erro", partnerColor());
        console.log(error, "Erro");
      } finally {
        setLoadingDescriptionAI(false);
      }
    } else {
      setLoadingDescriptionAI(false);
    }
  };

  const futureEventsFree = useMemo(() => {
    const now = new Date();
    return (eventsFreeArray || []).filter((it) => {
      const [y, m, d] = it.date.slice(0, 10).split("-").map(Number);
      const [hh, mm] = (it.time || "00:00").split(":").map(Number);
      const dt = new Date(y, m - 1, d, hh || 0, mm || 0, 0, 0);
      return dt >= now;
    });
  }, [eventsFreeArray]);

  const FreeEventItemButton = ({
    item,
    selected,
    onClick,
  }: {
    item: FreeEventItem;
    selected: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={rescheduling}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "10px 12px",
        borderRadius: 6,
        color: "#0f172a",
        border: `1px solid ${selected ? partnerColor() : "#e2e8f0"}`,
        background: selected ? "rgba(84,191,8,0.12)" : "#fff",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: selected ? 700 : 500,
      }}
    >
      {(() => {
        const [y, m, d] = item.date.slice(0, 10).split("-").map(Number);
        const [hh, mm] = (item.time || "00:00").split(":").map(Number);
        const dt = new Date(y, m - 1, d, hh || 0, mm || 0, 0, 0);

        const dateWithWeekday = dt.toLocaleDateString("pt-BR", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        const timeBR = dt.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return `${dateWithWeekday} • ${timeBR}`;
      })()}
    </button>
  );

  const renderPreviousClassesModal = () => {
    if (!isPreviousClassesOpen) return null;
    if (typeof document === "undefined") return null;

    const close = () => setIsPreviousClassesOpen(false);

    return createPortal(
      <div style={overlayStyle} onClick={close}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            ...modalStyle,
            width: "min(96vw, 980px)",
            maxHeight: "86vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
              Aulas anteriores
            </div>

            <button onClick={close} style={ghostBtnStyle}>
              Fechar
            </button>
          </div>

          <div style={{ padding: 12, overflow: "auto" }}>
            {event.category !== "Established Group Class" ? (
              <StudentClassesHistory
                idFromOtherPlace={event.studentID}
                headers={headers as any}
                isDesktop={true}
              />
            ) : (
              <GroupClassesHistory
                idFromOtherPlace={event.group}
                headers={headers as any}
                isDesktop={true}
              />
            )}
          </div>
        </div>
      </div>,
      document.body,
    );
  };

  const renderMainInfoModal = () => {
    if (!isMainInfoModalOpen) return null;
    if (typeof document === "undefined") return null;

    const close = () => {
      if (!savingMainInfo) setIsMainInfoModalOpen(false);
    };

    return createPortal(
      <div style={overlayStyle} onClick={close}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <div
            style={{
              padding: "16px 16px",
              borderBottom: "1px solid #e2e8f0",
              fontSize: 15,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Editar informações do evento
          </div>

          <div style={{ padding: 12, display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>Data</label>
              <span
                style={{
                  fontSize: 8,
                  fontStyle: "italic",
                }}
              >
                (a alteração da data por aqui não desconta créditos de
                reagendamento do aluno, apenas altera a data do evento)
              </span>{" "}
              <input
                type="date"
                disabled={savingMainInfo}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>Horário</label>
              <input
                type="time"
                disabled={savingMainInfo}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>
                Link da aula
              </label>
              <input
                type="text"
                disabled={savingMainInfo}
                value={link}
                onChange={(e) => setLink(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>
                Link Externo (Para o aluno acessar, caso use outro local de
                armazenamento de materiais)
              </label>
              <input
                type="text"
                disabled={savingMainInfo}
                value={importantLink}
                onChange={(e) => setExternallink(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>
                Categoria
              </label>
              <select
                disabled={savingMainInfo}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ ...inputStyle, paddingRight: 24 }}
              >
                <option value="">Selecione uma categoria...</option>
                {categoryList.map((cat) => {
                  if (cat.forStudent === true) {
                    return (
                      <option key={cat.value} value={cat.value}>
                        {cat.text}
                      </option>
                    );
                  }
                  return null;
                })}
              </select>
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>
                Duração (minutos)
              </label>

              <select
                disabled={savingMainInfo}
                value={preset}
                onChange={(e) => {
                  const v = e.target.value;
                  setPreset(v);
                  if (v !== "custom" && v !== "") {
                    const num = Number(v);
                    if (!Number.isNaN(num)) setDuration(num);
                  }
                }}
                style={{ ...inputStyle, paddingRight: 24 }}
              >
                <option value="">Selecione uma opção...</option>
                {presetOptions.map((p) => (
                  <option key={p} value={p}>
                    {p} min
                  </option>
                ))}
                <option value="custom">Outro (digitar)</option>
              </select>

              <input
                type="number"
                min={1}
                disabled={savingMainInfo || preset !== "custom"}
                value={duration === "" ? "" : duration}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") setDuration("");
                  else {
                    const num = Number(val);
                    if (!Number.isNaN(num)) setDuration(num);
                  }
                  setPreset("custom");
                }}
                placeholder="Digite a duração em minutos"
                style={inputStyle}
              />
            </div>
          </div>

          {allowedToEdit && (
            <div
              style={{
                padding: 12,
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <button
                style={ghostBtnStyle}
                onClick={close}
                disabled={savingMainInfo}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveMainInfo}
                style={{
                  ...primaryBtnStyle,
                  opacity: savingMainInfo ? 0.7 : 1,
                }}
                disabled={savingMainInfo}
              >
                {savingMainInfo ? "Salvando..." : "Salvar"}
              </button>
            </div>
          )}
        </div>
      </div>,
      document.body,
    );
  };

  const renderRescheduleModal = () => {
    if (!isRescheduleOpen) return null;
    if (typeof document === "undefined") return null;

    const close = () => {
      if (!rescheduling) setIsRescheduleOpen(false);
    };

    return createPortal(
      <div style={overlayStyle} onClick={close}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          {loadingEventsFree ? (
            <CircularProgress
              style={{
                color: partnerColor(),
                margin: "auto",
                display: "block",
              }}
            />
          ) : (
            <>
              <div
                style={{
                  padding: "16px 16px",
                  borderBottom: "1px solid #e2e8f0",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                Reagendar aula
              </div>
              {!allowedToReschedule ? (
                <div style={{ padding: 12 }}>
                  {thePermissionsOfTheStudents == "student"
                    ? `${theNameOfTheStudents}, você excedeu o limite de reagendamentos.`
                    : `${theNameOfTheStudents} excedeu o limite de 
                reagendamentos. Se quiser permitir que este (a) aluno (a)
                 reagende novamente, dê créditos a este (a) aluno(a),
                 ou simplesmente mude a data da aula no botão Editar`}
                  {thePermissionsOfTheStudents !== "student" && (
                    <a
                      style={{
                        marginLeft: 10,
                      }}
                      href="/students"
                    >
                      Clique aqui para dar mais créditos a este aluno.
                    </a>
                  )}
                  <br />
                  <br />
                  {thePermissionsOfTheStudents !== "student" && (
                    <button
                      onClick={() => {
                        setSelectedFreeEvent(null);
                        setIsMainInfoModalOpen(true);
                      }}
                      style={{
                        padding: "8px 12px",
                        backgroundColor: partnerColor(),
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 700,
                        width: isDesktop ? "auto" : "100%",
                        minWidth: 0,
                      }}
                    >
                      Clique aqui para editar as informações do evento
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ padding: 12, display: "grid", gap: 12 }}>
                  {rescheduleTab === "fixed" ? (
                    <>
                      <div style={{ fontSize: 13, color: "#334155" }}>
                        Selecione um horário disponível abaixo.
                      </div>

                      {loadingEventsFree ? (
                        <div
                          style={{
                            border: "1px dashed #e2e8f0",
                            borderRadius: 10,
                            padding: 14,
                            color: "#64748b",
                            fontSize: 13,
                          }}
                        >
                          Carregando horários...
                        </div>
                      ) : futureEventsFree.length === 0 ? (
                        <div
                          style={{
                            border: "1px dashed #e2e8f0",
                            borderRadius: 10,
                            padding: 14,
                            color: "#64748b",
                            fontSize: 13,
                          }}
                        >
                          Nenhum horário disponível encontrado.
                          {thePermissionsOfTheStudents !== "student" &&
                            `${" "} Agende aulas de reposição no calendário. Escolha a opção: 'Horário Vazio Para Reposição (Para que seus alunos marquem)'`}
                          {thePermissionsOfTheStudents !== "student" && (
                            <a
                              style={{
                                marginLeft: "10px",
                              }}
                              href="/my-calendar"
                            >
                              Acesse o Calendário
                            </a>
                          )}
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "grid",
                            gap: 10,
                            maxHeight: 300,
                            overflowY: "auto",
                            paddingRight: 4,
                          }}
                        >
                          {futureEventsFree.map((it) => (
                            <FreeEventItemButton
                              key={it._id}
                              item={it}
                              selected={selectedFreeEvent?._id === it._id}
                              onClick={() => setSelectedFreeEvent(it)}
                            />
                          ))}
                        </div>
                      )}

                      {selectedFreeEvent && (
                        <div
                          style={{
                            marginTop: 6,
                            border: "1px solid rgba(239,68,68,0.25)",
                            background: "rgba(239,68,68,0.06)",
                            borderRadius: 10,
                            padding: 12,
                            display: "grid",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 800,
                              color: "#7f1d1d",
                            }}
                          >
                            Reagendar para esse horário (esta ação não pode ser
                            desfeita)
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              marginLeft: "auto",
                            }}
                          >
                            <button
                              type="button"
                              disabled={rescheduling}
                              onClick={() => setSelectedFreeEvent(null)}
                              style={{
                                ...primaryBtnStyle,
                                border: "1px solid #eee",
                                color: "#555",
                                background: "#fff",
                                opacity: rescheduling ? 0.7 : 1,
                              }}
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              disabled={rescheduling}
                              onClick={async () => {
                                await rescheduleEvent(evendId, {
                                  date: selectedFreeEvent.date,
                                  time: selectedFreeEvent.time,
                                  idNew: selectedFreeEvent._id,
                                });
                                setIsRescheduleOpen(false);
                              }}
                              style={{
                                ...primaryBtnStyle,
                                background: partnerColor(),
                                opacity: rescheduling ? 0.7 : 1,
                              }}
                            >
                              {rescheduling
                                ? "Reagendando..."
                                : "REAGENDAR AGORA"}
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div style={{ display: "grid", gap: 6 }}>
                        <label style={{ fontSize: 12, color: "#334155" }}>
                          Data
                        </label>
                        <input
                          type="date"
                          disabled={rescheduling}
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          style={inputStyle}
                        />
                      </div>

                      <div style={{ display: "grid", gap: 6 }}>
                        <label style={{ fontSize: 12, color: "#334155" }}>
                          Horário
                        </label>
                        <input
                          type="time"
                          disabled={rescheduling}
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              <div
                style={{
                  padding: 12,
                  borderTop: "1px solid #e2e8f0",
                  display:
                    thePermissionsOfTheStudents !== "student" ? "flex" : "none",
                  justifyContent: "flex-end",
                  gap: 8,
                }}
              >
                <button
                  style={ghostBtnStyle}
                  onClick={close}
                  disabled={rescheduling}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() => {}}
                  style={{
                    ...primaryBtnStyle,
                    opacity: 0.7,
                    cursor: "not-allowed",
                  }}
                  disabled
                  title="Por enquanto este botão não faz nada"
                >
                  Salvar
                </button>
              </div>
            </>
          )}
        </div>
      </div>,
      document.body,
    );
  };

  const renderDescriptionModal = () => {
    if (!isDescriptionModalOpen) return null;
    if (typeof document === "undefined") return null;

    const close = () => {
      if (!savingDescription) setIsDescriptionModalOpen(false);
    };

    return createPortal(
      <div style={overlayStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyle}>
          <div
            style={{
              padding: "16px 16px",
              borderBottom: "1px solid #e2e8f0",
              fontSize: 15,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Editar descrições
          </div>

          <div style={{ padding: 12, display: "grid", gap: 12 }}>
            <div
              style={{
                display: "grid",
                gap: 6,
                fontSize: 13,
                color: "#0f172a",
              }}
            >
              <div>Descrição geral (visível para aluno):</div>

              <div
                style={{
                  display: "grid",
                  gap: 8,
                  gridTemplateColumns: "1fr auto",
                  alignItems: "flex-end",
                }}
              >
                <textarea
                  disabled={savingDescription || loadingDescriptionAI}
                  value={loadingDescriptionAI ? "Carregando..." : description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Escreva aqui a descrição da aula (o que foi feito, combinados, observações importantes...)"
                  style={{
                    ...inputStyle,
                    minHeight: 120,
                    resize: "vertical",
                    fontFamily: "Plus Jakarta Sans",
                  }}
                />

                <button
                  onClick={handleClassSummary}
                  disabled={
                    savingDescription ||
                    loadingDescriptionAI ||
                    !description.trim()
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "fit-content",
                    height: 32,
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    backgroundColor:
                      savingDescription ||
                      loadingDescriptionAI ||
                      !description.trim()
                        ? "grey"
                        : "white",
                    cursor:
                      savingDescription ||
                      loadingDescriptionAI ||
                      !description.trim()
                        ? "not-allowed"
                        : "pointer",
                  }}
                  title="Resumo com IA"
                >
                  IA (-10)
                </button>
              </div>

              <div style={{ marginTop: 8 }}>
                Descrição do professor (invisível para aluno):
              </div>

              <textarea
                disabled={savingDescription}
                value={teacherDescription}
                onChange={(e) => setTeacherDescription(e.target.value)}
                placeholder="Tome notas particulares sobre a aula aqui (invisível para o aluno)."
                style={{
                  ...inputStyle,
                  minHeight: 120,
                  resize: "vertical",
                  fontFamily: "Plus Jakarta Sans",
                }}
              />
            </div>
          </div>

          <div
            style={{
              padding: 12,
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <button
              style={ghostBtnStyle}
              onClick={close}
              disabled={savingDescription}
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveDescription}
              style={{
                ...primaryBtnStyle,
                opacity: savingDescription ? 0.7 : 1,
              }}
              disabled={savingDescription || !description.trim()}
            >
              {savingDescription ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>,
      document.body,
    );
  };

  if (!event) return null;

  return (
    <>
      <div
        style={{
          maxHeight: "fit-content",
          ...cardBase,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          position: "relative",
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            ...cardTitle,
            justifyContent: "space-between",
          }}
        >
          <span>Informações Gerais</span>{" "}
          <i
            className={
              event.status === "Realized" || event.status === "realizada"
                ? "fa fa-check-circle"
                : event.status === "Cancelled" || event.status === "desmarcado"
                  ? "fa fa-times-circle-o"
                  : "fa fa-clock-o"
            }
            style={{
              color:
                event.status === "Realized" || event.status === "realizada"
                  ? "#28a745"
                  : event.status === "Canceled" || event.status === "desmarcado"
                    ? "#dc3545"
                    : "#007bff",
              transition: "all 0.2s",
            }}
            title={`Status da aula: ${
              event.status === "Realized" || event.status === "realizada"
                ? "Realizada"
                : event.status === "Cancelled" || event.status === "desmarcado"
                  ? "Desmarcada"
                  : "Marcada"
            }`}
          />
        </div>

        <article
          style={{
            display: "grid",
            gridTemplateColumns: isDesktop && event.video ? "1fr 1fr" : "1fr",
            gap: 10,
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              ...cardTitle,
              marginBottom: 6,
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              minWidth: 0,
            }}
          >
            {(event.video || permissionsUser !== "student") && (
              <EventVideo
                allowedToEdit={permissionsUser !== "student"}
                fetchEventData={fetchEventData}
                headers={headers}
                videoUrl={event.video}
                evendId={event._id}
              />
            )}
          </div>

          {event.rescheduledDescription && event.rescheduled && (
            <div
              style={{
                display: "grid",
                background: `linear-gradient(to right, ${partnerColor()}bb, ${partnerColor()}ff)`,
                color: "#fff",
                textAlign: "center",
                padding: 8,
                borderRadius: 6,
                minWidth: 0,
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 13 }}>
                {event.rescheduledDescription}
              </span>
            </div>
          )}

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                gap: 12,
                flexWrap: "wrap",
                padding: "4px 8px",
                maxWidth: isDesktop ? "fit-content" : "100%",
                width: isDesktop ? "fit-content" : "100%",
                boxSizing: "border-box",
              }}
            >
              {event.link && (
                <a
                  href={event.link}
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    maxWidth: isDesktop ? "fit-content" : "100%",
                    width: isDesktop ? "fit-content" : "100%",
                    justifyContent: "center",
                    fontWeight: 700,
                    backgroundColor: `${partnerColor()}22`,
                    color: partnerColor(),
                    padding: "4px 8px",
                    textDecoration: "none",
                    fontSize: 14,
                    textTransform: "uppercase",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 2,
                    boxSizing: "border-box",
                  }}
                  target="_blank"
                >
                  <i className="fa fa-external-link" />
                  Link da Sala
                </a>
              )}

              {event.importantLink && (
                <a
                  href={event.importantLink}
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    maxWidth: isDesktop ? "fit-content" : "100%",
                    width: isDesktop ? "fit-content" : "100%",
                    justifyContent: "center",
                    fontWeight: 700,
                    backgroundColor: `${partnerColor()}22`,
                    color: partnerColor(),
                    padding: "4px 8px",
                    textDecoration: "none",
                    fontSize: 14,
                    textTransform: "uppercase",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 2,
                    boxSizing: "border-box",
                  }}
                >
                  <i className="fa fa-external-link" />
                  Link Externo
                </a>
              )}
            </div>

            <div
              style={{
                marginTop: 6,
                borderLeft: `4px solid ${partnerColor()}`,
                paddingLeft: 12,
                display: "grid",
                gap: 8,
                minWidth: 0,
              }}
            >
              {!isDesktop && event.student && (
                <div style={{ display: "grid" }}>
                  <span style={{ fontSize: 11, color: "#606060" }}>
                    {event.category == "Established Group Class"
                      ? "Turma"
                      : "Aluno"}
                  </span>
                  <span
                    style={{ fontWeight: 600, color: "#030303", fontSize: 13 }}
                  >
                    {event.student}
                  </span>
                </div>
              )}

              <div style={{ display: "grid" }}>
                <span style={{ fontSize: 11, color: "#606060" }}>
                  Data e horário
                </span>
                <span
                  style={{ fontWeight: 700, color: "#030303", fontSize: 13 }}
                >
                  {event.date} ({event.time})
                </span>
              </div>

              {(theDescription || allowedToEdit) && (
                <div style={{ display: "grid", gap: 4 }}>
                  <span style={{ fontSize: 11, color: "#606060" }}>
                    {`Descrição ${allowedToEdit ? "(visível para aluno)" : ""}`}
                  </span>
                  <span
                    style={{ fontWeight: 700, color: "#030303", fontSize: 13 }}
                  >
                    {theDescription && theDescription.trim()
                      ? theDescription
                      : "Nenhuma descrição cadastrada para esta aula."}
                  </span>
                </div>
              )}

              {allowedToEdit && (
                <div style={{ display: "grid", gap: 4 }}>
                  <span style={{ fontSize: 11, color: "#606060" }}>
                    Descrição do professor (invisível para aluno)
                  </span>
                  <span
                    style={{ fontWeight: 700, color: "#030303", fontSize: 13 }}
                  >
                    {theTeacherDescription && theTeacherDescription.trim()
                      ? theTeacherDescription
                      : ""}
                  </span>
                </div>
              )}

              {event.status == "realizada" &&
                event.category == "Established Group Class" && (
                  <div style={{ display: "grid", gap: 4 }}>
                    <span style={{ fontSize: 11, color: "#606060" }}>
                      Presença e comentários
                    </span>

                    {attendanceLoading ? (
                      <span
                        style={{
                          fontWeight: 700,
                          color: "#030303",
                          fontSize: 13,
                        }}
                      >
                        Carregando...
                      </span>
                    ) : canEditAttendance ? (
                      <span
                        style={{
                          fontWeight: 700,
                          color: "#030303",
                          fontSize: 13,
                        }}
                      >
                        {`Presentes: ${attendanceList.filter((x) => x.attended).length} / ${attendanceList.length}`}
                      </span>
                    ) : (
                      <div style={{ display: "grid", gap: 6 }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: "#030303",
                            fontSize: 13,
                          }}
                        >
                          {myAttendanceItem
                            ? myAttendanceItem.attended
                              ? "Você esteve presente nesta aula."
                              : "Você não esteve presente nesta aula."
                            : "Presença não encontrada."}
                        </span>

                        <span
                          style={{
                            fontWeight: 700,
                            color: "#030303",
                            fontSize: 12,
                          }}
                        >
                          {myAttendanceItem?.description?.trim()
                            ? myAttendanceItem.description
                            : "Nenhum comentário para você nesta aula."}
                        </span>
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* ✅ BOTÕES RESPONSIVOS */}
            <div
              style={{
                marginTop: 10,
                display: "grid",
                gap: 8,
                width: "100%",
                minWidth: 0,
                gridTemplateColumns: isDesktop
                  ? "repeat(4, minmax(0, 1fr))"
                  : "repeat(2, minmax(0, 1fr))",
                justifyContent: "flex-end",
                alignItems: "stretch",
              }}
            >
              {event.status === "marcado" &&
                event.category !== "Established Group Class" && (
                  <button
                    onClick={openRescheduleModal}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: partnerColor(),
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 700,
                      width: isDesktop ? "auto" : "100%",
                      minWidth: 0,
                    }}
                  >
                    Reagendar
                  </button>
                )}

              {allowedToEdit && (
                <>
                  <button
                    onClick={() => setIsMainInfoModalOpen(true)}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: partnerColor(),
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 700,
                      width: isDesktop ? "auto" : "100%",
                      minWidth: 0,
                    }}
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => setIsPreviousClassesOpen(true)}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: partnerColor(),
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 700,
                      width: isDesktop ? "auto" : "100%",
                      minWidth: 0,
                    }}
                  >
                    Aulas anteriores
                  </button>

                  {event.status == "realizada" &&
                    event.category == "Established Group Class" &&
                    canEditAttendance && (
                      <button
                        onClick={() => setIsAttendanceListOpen(true)}
                        style={{
                          padding: "8px 12px",
                          backgroundColor: partnerColor(),
                          color: "#fff",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: 13,
                          fontWeight: 700,
                          width: isDesktop ? "auto" : "100%",
                          minWidth: 0,
                        }}
                      >
                        Lista de Presença
                      </button>
                    )}

                  <button
                    onClick={() => {
                      setDescription(theDescription || "");
                      setTeacherDescription(theTeacherDescription || "");
                      setIsDescriptionModalOpen(true);
                    }}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: partnerColor(),
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 700,
                      width: isDesktop ? "auto" : "100%",
                      minWidth: 0,
                    }}
                  >
                    Descrição
                  </button>
                </>
              )}
            </div>
          </div>
        </article>
        {canEditAttendance &&
          event?.category !== "Established Group Class" &&
          event?.category !== "Group Class" && (
            <button
              type="button"
              onClick={() => {
                setEditingStudentComment(studentComment || "");
                setIsStudentCommentModalOpen(true);
              }}
              style={{
                textAlign: "left",
                background: "transparent",
                border: "none",
                display: "grid",
                margin: "8px auto",
                padding: "8px 20px",
                fontSize: 12,
                color: "#030303",
                maxWidth: "800px",
                cursor: "pointer",
              }}
              title="Clique para editar"
            >
              <b>Sobre o aluno:</b>
              <i>
                {studentComment && studentComment.trim()
                  ? studentComment
                  : "Clique para adicionar um comentário"}
              </i>
            </button>
          )}
      </div>

      {renderMainInfoModal()}
      {renderAttendanceListModal()}
      {renderRescheduleModal()}
      {renderPreviousClassesModal()}
      {renderStudentCommentModal()}
      {renderDescriptionModal()}
    </>
  );
};

export default MainInfoClass;
