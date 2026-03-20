// Routes/ArvinComponents/Students/sections/StudentsRecurringTutorings/StudentTutoringEditorModal.tsx
import React, { FC, useMemo, useState } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import { CircularProgress } from "@mui/material";
import moment from "moment";
import { backDomain } from "../../../../../../Resources/UniversalComponents";
import { alwaysWhite, partnerColor } from "../../../../../../Styles/Styles";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const times = [
  "6:00",
  "6:15",
  "6:30",
  "6:45",
  "7:00",
  "7:15",
  "7:30",
  "7:45",
  "8:00",
  "8:15",
  "8:30",
  "8:45",
  "9:00",
  "9:15",
  "9:30",
  "9:45",
  "10:00",
  "10:15",
  "10:30",
  "10:45",
  "11:00",
  "11:15",
  "11:30",
  "11:45",
  "12:00",
  "12:15",
  "12:30",
  "12:45",
  "13:00",
  "13:15",
  "13:30",
  "13:45",
  "14:00",
  "14:15",
  "14:30",
  "14:45",
  "15:00",
  "15:15",
  "15:30",
  "15:45",
  "16:00",
  "16:15",
  "16:30",
  "16:45",
  "17:00",
  "17:15",
  "17:30",
  "17:45",
  "18:00",
  "18:15",
  "18:30",
  "18:45",
  "19:00",
  "19:15",
  "19:30",
  "19:45",
  "20:00",
  "20:15",
  "20:30",
  "20:45",
  "21:00",
  "21:15",
  "21:30",
  "21:45",
  "22:00",
  "22:15",
  "22:30",
  "22:45",
];

const todayYYYYMMDD = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const parseYYYYMMDDToLocalDate = (yyyyMmDd: string) => {
  const [y, m, d] = (yyyyMmDd || "").split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
};

const getNextDayOfWeek = (dayOfWeek: string, fromDate: Date) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const target = daysOfWeek.indexOf(dayOfWeek);
  if (target < 0) return null;

  const current = fromDate.getDay();
  const diff = (target - current + 7) % 7; // 0 = hoje

  const next = new Date(fromDate);
  next.setDate(fromDate.getDate() + diff);
  return next;
};

const buildDateWithTime = (baseDate: Date, timeHHmm: string) => {
  const [hh, mm] = (timeHHmm || "00:00").split(":").map(Number);
  const d = new Date(baseDate);
  d.setHours(hh || 0, mm || 0, 0, 0);
  return d;
};

const formatTime = (timeStr: string) => {
  const [hours, minutes] = (timeStr || "00:00").split(":");
  return `${String(hours || "0").padStart(2, "0")}:${String(
    minutes || "0",
  ).padStart(2, "0")}`;
};

type Props = {
  student: any;
  actualHeaders: any;
  onUpdated?: () => void;
};

export const StudentTutoringEditorModal: FC<Props> = ({
  student,
  actualHeaders,
  onUpdated,
}) => {
  const studentId = student?.id || student?._id;

  // modal
  const [open, setOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  // lista
  const [tutorings, setTutorings] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // criar nova
  const [showNew, setShowNew] = useState(false);
  const [startDate, setStartDate] = useState<string>(() => todayYYYYMMDD());
  const [theNewWeekDay, setTheNewWeekDay] = useState("");
  const [theNewTime, setTheNewTime] = useState("");
  const [theNewLink, setTheNewLink] = useState("");
  const [newDuration, setNewDuration] = useState<any>(60);
  const [numberOfWeeks, setNumberOfWeeks] = useState<any>(4);

  // editar existente
  const [seeEdit, setSeeEdit] = useState(false);
  const [tutoringId, setTutoringId] = useState("");
  const [weekDay, setWeekDay] = useState("");
  const [timeOfTutoring, setTimeOfTutoring] = useState("");
  const [link, setLink] = useState("");
  const [duration, setDuration] = useState<any>(60);

  const resetNewForm = () => {
    setStartDate(todayYYYYMMDD());
    setTheNewWeekDay("");
    setTheNewTime("");
    setTheNewLink("");
    setNewDuration(60);
    setNumberOfWeeks(4);
  };

  const closeEdit = () => {
    setSeeEdit(false);
    setTutoringId("");
    setWeekDay("");
    setTimeOfTutoring("");
    setLink("");
    setDuration(60);
  };

  const fetchTutorings = async () => {
    if (!studentId) return;
    setLoadingList(true);
    try {
      const { data } = await axios.get(
        `${backDomain}/api/v1/tutoringsevents/${studentId}`,
        { headers: actualHeaders },
      );
      setTutorings(data?.tutorings ?? []);
    } catch (e) {
      console.log(e, "Erro ao buscar recorrências do aluno");
    } finally {
      setLoadingList(false);
    }
  };

  const openModal = async () => {
    setOpen(true);
    setLoadingModal(true);
    setShowNew(false);
    closeEdit();
    resetNewForm();

    try {
      await fetchTutorings();
    } finally {
      setLoadingModal(false);
    }
  };

  const closeModal = () => {
    setOpen(false);
    setShowNew(false);
    closeEdit();
    resetNewForm();
  };

  const seeEditOne = (item: any) => {
    setSeeEdit(true);
    setTutoringId(item.id);
    setWeekDay(item.day);
    setTimeOfTutoring(item.time || item.startTime || "");
    setLink(item.link || "");
    setDuration(item.duration ?? 60);
  };

  const updateOne = async () => {
    if (!studentId || !tutoringId || !weekDay || !timeOfTutoring || !link)
      return;

    setLoadingList(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/tutoringevent`,
        {
          id: tutoringId,
          studentID: studentId,
          day: weekDay,
          time: formatTime(timeOfTutoring),
          duration,
          link,
        },
        { headers: actualHeaders },
      );

      closeEdit();
      await fetchTutorings();
      onUpdated?.();
    } catch (e) {
      console.log(e, "Erro ao atualizar recorrência do aluno");
    } finally {
      setLoadingList(false);
    }
  };

  const deleteOne = async (item: any) => {
    if (!studentId) return;

    setLoadingList(true);
    try {
      await axios.delete(`${backDomain}/api/v1/tutoringevent`, {
        data: {
          id: item.id,
          day: item.day,
          time: item.time || item.startTime || "",
          studentID: studentId,
        },
        headers: actualHeaders,
      });

      closeEdit();
      await fetchTutorings();
      onUpdated?.();
    } catch (e) {
      console.log(e, "Erro ao deletar recorrência do aluno");
    } finally {
      setLoadingList(false);
    }
  };

  const createNew = async () => {
    if (!studentId) return;

    setLoadingList(true);
    try {
      const base = parseYYYYMMDDToLocalDate(startDate || todayYYYYMMDD());
      const firstDate = theNewWeekDay && getNextDayOfWeek(theNewWeekDay, base);

      if (!firstDate) return;

      const computedStartDate = buildDateWithTime(firstDate, theNewTime);

      const endDate = new Date(firstDate);
      endDate.setDate(
        firstDate.getDate() + (Number(numberOfWeeks) || 4) * 7 - 1,
      );

      await axios.post(
        `${backDomain}/api/v1/tutoringevent`,
        {
          day: theNewWeekDay,
          time: formatTime(theNewTime),
          duration: Number(newDuration) || 60,
          link: theNewLink,
          studentID: studentId,
          numberOfWeeks: Number(numberOfWeeks) || 4,
          startDate: computedStartDate,
          endDate,
        },
        { headers: actualHeaders },
      );

      setShowNew(false);
      resetNewForm();
      closeEdit();
      await fetchTutorings();
      onUpdated?.();
    } catch (e) {
      console.log(e, "Erro ao criar recorrência do aluno");
    } finally {
      setLoadingList(false);
    }
  };

  const isFormIncompleteNew =
    !startDate ||
    !theNewWeekDay ||
    !theNewTime ||
    !theNewLink ||
    !numberOfWeeks ||
    Number(numberOfWeeks) <= 0 ||
    Number(newDuration) <= 0;

  const periodPreview = useMemo(() => {
    if (!numberOfWeeks || Number(numberOfWeeks) <= 0 || !theNewWeekDay)
      return "";
    const base = parseYYYYMMDDToLocalDate(startDate || todayYYYYMMDD());
    const first = getNextDayOfWeek(theNewWeekDay, base);
    if (!first) return "";

    const end = new Date(first);
    end.setDate(first.getDate() + (Number(numberOfWeeks) || 4) * 7 - 1);

    const fmt = (d: Date) =>
      d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

    return `${fmt(first)} até ${fmt(end)} (${numberOfWeeks} semana${
      Number(numberOfWeeks) > 1 ? "s" : ""
    })`;
  }, [numberOfWeeks, theNewWeekDay, startDate]);

  return (
    <>
      <button
        onClick={openModal}
        style={{
          marginTop: 14,
          padding: "6px 10px",
          borderRadius: 6,
          border: "1px solid " + partnerColor(),
          background: "rgba(0,0,0,0.02)",
          color: partnerColor(),
          fontSize: 12,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontWeight: 700,
        }}
      >
        Gerenciar aulas fixas
      </button>

      {open &&
        createPortal(
          <>
            <div
              onClick={closeModal}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(15, 23, 42, 0.45)",
                zIndex: 999,
              }}
            />

            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
              }}
              onClick={closeModal}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "100%",
                  maxWidth: 520,
                  maxHeight: "90vh",
                  overflow: "hidden",
                  borderRadius: 12,
                  backgroundColor: alwaysWhite(),
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    padding: "14px 18px",
                    borderBottom: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        margin: 0,
                        color: partnerColor(),
                        fontSize: 18,
                        fontWeight: 800,
                      }}
                    >
                      Aulas fixas do aluno
                    </div>

                    <p
                      style={{
                        margin: "4px 0 0 0",
                        fontSize: 12,
                        color: "#64748b",
                      }}
                    >
                      Crie, edite e exclua recorrências com os mesmos campos do
                      calendário.
                    </p>
                  </div>

                  <button
                    onClick={closeModal}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      width: 28,
                      height: 28,
                      borderRadius: "999px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      color: "#94a3b8",
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div
                  style={{
                    padding: "14px 18px 16px",
                    overflowY: "auto",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  {loadingModal ? (
                    <div style={{ textAlign: "center", padding: "32px 0" }}>
                      <CircularProgress style={{ color: partnerColor() }} />
                    </div>
                  ) : (
                    <>
                      <section>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <p
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#475569",
                              margin: 0,
                            }}
                          >
                            Recorrências cadastradas
                          </p>

                          <button
                            onClick={() => {
                              setShowNew((v) => !v);
                              closeEdit();
                            }}
                            style={{
                              padding: "6px 10px",
                              borderRadius: 6,
                              border: "1px solid #cbd5e1",
                              backgroundColor: showNew ? "#fee2e2" : "#ecfdf3",
                              color: showNew ? "#b91c1c" : "#15803d",
                              fontSize: 12,
                              cursor: "pointer",
                              fontWeight: 700,
                            }}
                          >
                            {showNew ? "Fechar criação" : "Criar nova"}
                          </button>
                        </div>

                        {loadingList ? (
                          <div
                            style={{ textAlign: "center", padding: "24px 0" }}
                          >
                            <CircularProgress
                              style={{ color: partnerColor() }}
                            />
                          </div>
                        ) : tutorings.length > 0 ? (
                          <div
                            style={{ display: "grid", gap: 8, marginTop: 12 }}
                          >
                            {tutorings
                              .slice()
                              .sort(
                                (a: any, b: any) =>
                                  weekDays.indexOf(a.day) -
                                  weekDays.indexOf(b.day),
                              )
                              .map((item: any, index: number) => (
                                <div
                                  key={`${item.id}-${index}`}
                                  style={{
                                    backgroundColor: "#f8fafc",
                                    padding: "8px 10px",
                                    borderRadius: 6,
                                    border: "1px solid #e2e8f0",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      gap: 8,
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    <div>
                                      <div
                                        style={{
                                          fontWeight: 800,
                                          fontSize: 13,
                                          color: "#0f172a",
                                        }}
                                      >
                                        Aula #{index + 1}
                                      </div>

                                      <div
                                        style={{
                                          fontSize: 12,
                                          color: "#64748b",
                                          marginTop: 2,
                                        }}
                                      >
                                        {item.day} •{" "}
                                        {item.time || item.startTime} •{" "}
                                        {item.duration ?? 60} min
                                        {item.endDate && (
                                          <span style={{ marginLeft: 6 }}>
                                            até{" "}
                                            {moment(item.endDate).format(
                                              "DD/MM/YYYY",
                                            )}
                                          </span>
                                        )}
                                      </div>

                                      {item.link && (
                                        <a
                                          href={item.link}
                                          target="_blank"
                                          rel="noreferrer"
                                          style={{
                                            display: "inline-block",
                                            marginTop: 4,
                                            color: partnerColor(),
                                            textDecoration: "none",
                                            fontWeight: 700,
                                            fontSize: 12,
                                          }}
                                        >
                                          Abrir link
                                        </a>
                                      )}
                                    </div>

                                    <div
                                      style={{ display: "inline-flex", gap: 6 }}
                                    >
                                      <button
                                        onClick={() => {
                                          setShowNew(false);
                                          seeEditOne(item);
                                        }}
                                        style={{
                                          padding: "4px 10px",
                                          fontSize: 11,
                                          borderRadius: 6,
                                          border: "none",
                                          cursor: "pointer",
                                          backgroundColor: partnerColor(),
                                          color: "#fff",
                                          fontWeight: 800,
                                        }}
                                      >
                                        Editar
                                      </button>

                                      <button
                                        onClick={() => deleteOne(item)}
                                        style={{
                                          padding: "4px 10px",
                                          fontSize: 11,
                                          borderRadius: 6,
                                          border: "none",
                                          cursor: "pointer",
                                          backgroundColor: "#ef4444",
                                          color: "#fff",
                                          fontWeight: 800,
                                        }}
                                      >
                                        Excluir
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <p
                            style={{
                              fontSize: 12,
                              color: "#94a3b8",
                              marginTop: 12,
                            }}
                          >
                            Nenhuma recorrência encontrada para este aluno.
                          </p>
                        )}
                      </section>

                      {!loadingList && seeEdit && (
                        <section
                          style={{
                            padding: 12,
                            borderRadius: 10,
                            backgroundColor: "#fff7ed",
                            border: "1px solid #fed7aa",
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 900,
                                color: "#9a3412",
                              }}
                            >
                              Editar recorrência
                            </div>

                            <button
                              onClick={closeEdit}
                              style={{
                                padding: "4px 10px",
                                fontSize: 11,
                                borderRadius: 6,
                                border: "none",
                                cursor: "pointer",
                                backgroundColor: "#ef4444",
                                color: "#fff",
                                fontWeight: 800,
                              }}
                            >
                              Cancelar
                            </button>
                          </div>

                          <div style={{ display: "grid", gap: 8 }}>
                            <select
                              onChange={(e) => setWeekDay(e.target.value)}
                              value={weekDay}
                              style={{
                                padding: "6px 8px",
                                borderRadius: 6,
                                border: "1px solid #e2e8f0",
                                fontSize: 13,
                              }}
                            >
                              <option value="" hidden>
                                Dia
                              </option>
                              {weekDays.map((wd) => (
                                <option key={wd} value={wd}>
                                  {wd}
                                </option>
                              ))}
                            </select>

                            <select
                              onChange={(e) =>
                                setTimeOfTutoring(e.target.value)
                              }
                              value={timeOfTutoring}
                              style={{
                                padding: "6px 8px",
                                borderRadius: 6,
                                border: "1px solid #e2e8f0",
                                fontSize: 13,
                              }}
                            >
                              <option value="" hidden>
                                Horário
                              </option>
                              {times.map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>

                            <input
                              value={link}
                              onChange={(e) => setLink(e.target.value)}
                              placeholder="Link da aula"
                              type="text"
                              style={{
                                padding: "6px 8px",
                                borderRadius: 6,
                                border: "1px solid #e2e8f0",
                                fontSize: 13,
                              }}
                            />

                            <input
                              value={duration}
                              onChange={(e) => {
                                const v = e.target.value;
                                if (
                                  v === "" ||
                                  (v.length <= 3 &&
                                    Number(v) >= 0 &&
                                    Number(v) <= 300)
                                ) {
                                  setDuration(v);
                                }
                              }}
                              placeholder="Duração (min)"
                              type="number"
                              min={1}
                              max={300}
                              style={{
                                padding: "6px 8px",
                                borderRadius: 6,
                                border: "1px solid #e2e8f0",
                                fontSize: 13,
                                maxWidth: 110,
                              }}
                            />

                            <button
                              onClick={updateOne}
                              style={{
                                padding: "6px 12px",
                                borderRadius: 6,
                                border: "none",
                                cursor: "pointer",
                                fontSize: 12,
                                fontWeight: 900,
                                backgroundColor: "#22c55e",
                                color: "#fff",
                                alignSelf: "flex-start",
                              }}
                            >
                              Salvar alterações
                            </button>
                          </div>
                        </section>
                      )}

                      {!loadingList && showNew && !seeEdit && (
                        <section
                          style={{
                            padding: 12,
                            borderRadius: 10,
                            backgroundColor: "#ecfdf3",
                            border: "1px solid #bbf7d0",
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 900,
                              color: "#166534",
                            }}
                          >
                            Criar nova recorrência
                          </div>

                          <div style={{ display: "grid", gap: 8 }}>
                            <label
                              style={{
                                fontSize: 11,
                                fontWeight: 800,
                                color: "#64748b",
                              }}
                            >
                              Data de início
                            </label>
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              style={{
                                padding: "6px 8px",
                                borderRadius: 6,
                                border: "1px solid #e2e8f0",
                                fontSize: 13,
                              }}
                            />

                            <select
                              onChange={(e) => setTheNewWeekDay(e.target.value)}
                              value={theNewWeekDay}
                              style={{
                                padding: "6px 8px",
                                borderRadius: 6,
                                border: "1px solid #e2e8f0",
                                fontSize: 13,
                              }}
                            >
                              <option hidden value="">
                                Dia
                              </option>
                              {weekDays.map((wd) => (
                                <option key={wd} value={wd}>
                                  {wd}
                                </option>
                              ))}
                            </select>

                            <select
                              onChange={(e) => setTheNewTime(e.target.value)}
                              value={theNewTime}
                              style={{
                                padding: "6px 8px",
                                borderRadius: 6,
                                border: "1px solid #e2e8f0",
                                fontSize: 13,
                              }}
                            >
                              <option hidden value="">
                                Horário
                              </option>
                              {times.map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>

                            <input
                              placeholder="Link da aula"
                              value={theNewLink}
                              onChange={(e) => setTheNewLink(e.target.value)}
                              type="text"
                              style={{
                                padding: "6px 8px",
                                borderRadius: 6,
                                border: "1px solid #e2e8f0",
                                fontSize: 13,
                              }}
                            />

                            <div
                              style={{
                                display: "flex",
                                gap: 8,
                                flexWrap: "wrap",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 12,
                                  fontWeight: 800,
                                  color: "#64748b",
                                }}
                              >
                                Semanas
                              </div>
                              <input
                                value={numberOfWeeks}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  if (
                                    v === "" ||
                                    (v.length <= 3 &&
                                      Number(v) >= 0 &&
                                      Number(v) <= 999)
                                  ) {
                                    setNumberOfWeeks(v);
                                  }
                                }}
                                type="number"
                                min="1"
                                max="999"
                                style={{
                                  padding: "6px",
                                  maxWidth: 90,
                                  borderRadius: 6,
                                  border: "1px solid #e2e8f0",
                                  fontSize: 13,
                                  textAlign: "center",
                                }}
                              />

                              <div
                                style={{
                                  fontSize: 12,
                                  fontWeight: 800,
                                  color: "#64748b",
                                }}
                              >
                                Duração
                              </div>
                              <input
                                value={newDuration}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  if (
                                    v === "" ||
                                    (v.length <= 3 &&
                                      Number(v) >= 0 &&
                                      Number(v) <= 300)
                                  ) {
                                    setNewDuration(v);
                                  }
                                }}
                                type="number"
                                min="1"
                                max="300"
                                style={{
                                  padding: "6px",
                                  maxWidth: 90,
                                  borderRadius: 6,
                                  border: "1px solid #e2e8f0",
                                  fontSize: 13,
                                  textAlign: "center",
                                }}
                              />
                            </div>

                            {periodPreview && (
                              <div
                                style={{
                                  marginTop: 4,
                                  padding: "6px 8px",
                                  backgroundColor: "#f8f9fa",
                                  border: "1px solid #e9ecef",
                                  borderRadius: 6,
                                  fontSize: 11,
                                  color: "#6c757d",
                                  lineHeight: "1.3",
                                }}
                              >
                                {periodPreview}
                              </div>
                            )}

                            <button
                              onClick={createNew}
                              disabled={isFormIncompleteNew}
                              style={{
                                marginTop: 4,
                                padding: "6px 12px",
                                borderRadius: 6,
                                border: "none",
                                cursor: isFormIncompleteNew
                                  ? "not-allowed"
                                  : "pointer",
                                fontSize: 12,
                                fontWeight: 900,
                                backgroundColor: isFormIncompleteNew
                                  ? "#94a3b8"
                                  : partnerColor(),
                                color: "#fff",
                                opacity: isFormIncompleteNew ? 0.7 : 1,
                                alignSelf: "flex-start",
                              }}
                            >
                              Criar recorrência
                            </button>
                          </div>
                        </section>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
};
