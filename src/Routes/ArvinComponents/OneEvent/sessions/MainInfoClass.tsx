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
  borderRadius: 8,
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  overflow: "hidden",
  border: "1px solid #e2e8f0",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 13,
};

const ghostBtnStyle: React.CSSProperties = {
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  backgroundColor: "white",
  color: "#0f172a",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 13,
};

const primaryBtnStyle: React.CSSProperties = {
  borderRadius: 8,
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

  const presetOptions = [30, 45, 60, 90];
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
  }, [lesson]);

  const hasDescription = useMemo(
    () => !!theDescription && theDescription.trim().length > 0,
    [theDescription],
  );

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
        `${backDomain}/api/v1/free-events/${event.studentID}`,
        { headers: headers as any },
      );

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

    const logged = JSON.parse(localStorage.getItem("loggedIn") || "null");
    const thePermissions = logged?.permissions;
    const myId = logged?.id;

    if (thePermissions === "superadmin" || thePermissions === "teacher") {
      try {
        const response = await axios.put(
          `${backDomain}/api/v1/ai-description/${myId}`,
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
        borderRadius: 8,
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
            width: "min(96vw, 980px)", // maior pra caber o histórico
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
                armazenamento de materiais, por exemplo)
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
              Você excedeu o limite de reagendamentos.
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
                        style={{ display: "flex", gap: 8, marginLeft: "auto" }}
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
                          {rescheduling ? "Reagendando..." : "REAGENDAR AGORA"}
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
              display: "flex",
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
                  ✨ (-10)
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
        }}
      >
        <article
          style={{
            display: "grid",
            gridTemplateColumns: isDesktop && event.video ? "1fr 1fr" : "1fr",
          }}
        >
          <div
            style={{
              ...cardTitle,
              marginBottom: 6,
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
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
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 13 }}>
                {event.rescheduledDescription}
              </span>
            </div>
          )}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                gap: 12,
                flexWrap: "wrap",
                padding: "4px 8px",
                maxWidth: "fit-content",
              }}
            >
              {/* Link da Sala */}
              {event.link && (
                <a
                  href={event.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    maxWidth: "fit-content",
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
                  }}
                >
                  <i className="fa fa-external-link" />
                  Link da Sala
                </a>
              )}

              {/* Link Externo */}
              {event.importantLink && (
                <a
                  href={event.importantLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    maxWidth: "fit-content",
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
                  }}
                >
                  <i className="fa fa-external-link" />
                  Link Externo
                </a>
              )}
            </div>
            {/* Bloco compacto: Data/Hora, Duração */}
            <div
              style={{
                marginTop: 6,
                borderLeft: `4px solid ${partnerColor()}`,
                paddingLeft: 12,
                display: "grid",
                gap: 8,
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
              {theDescription ||
                (allowedToEdit && (
                  <div style={{ display: "grid", gap: 4 }}>
                    <span style={{ fontSize: 11, color: "#606060" }}>
                      Descrição
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#030303",
                        fontSize: 13,
                      }}
                    >
                      {theDescription && theDescription.trim()
                        ? theDescription
                        : "Nenhuma descrição cadastrada para esta aula."}
                    </span>
                  </div>
                ))}
              {allowedToEdit && (
                <div style={{ display: "grid", gap: 4 }}>
                  <span style={{ fontSize: 11, color: "#606060" }}>
                    Descrição do prof
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
            </div>
            {/* Botões (mantendo todas as ações/modais) */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
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
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 700,
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
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 700,
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
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    Aulas anteriores
                  </button>

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
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    Descrição
                  </button>
                </>
              )}
            </div>
          </div>
        </article>
      </div>
      {renderMainInfoModal()}
      {renderRescheduleModal()}
      {renderPreviousClassesModal()}
      {renderDescriptionModal()}
    </>
  );
};

export default MainInfoClass;
