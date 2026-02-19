// Routes/ArvinComponents/Students/sections/ModalEditClassesGroup.tsx
import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { backDomain } from "../../../../../../Resources/UniversalComponents";
import { partnerColor } from "../../../../../../Styles/Styles";
import { notifyAlert } from "../../../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { createPortal } from "react-dom";

interface ModalEditClassesGroupProps {
  group?: any;
  actualHeaders?: any;
}

export const ModalEditClassesGroup: FC<ModalEditClassesGroupProps> = ({
  group,
  actualHeaders,
}) => {
  const [seeEditTutoring, setSeeEditTutoring] = useState(false);
  const [loadingTutoringDays, setLoadingTutoringDays] = useState(false);

  const [tutorings, setTutorings] = useState<any[]>([]);
  const [seeIndividualTutoring, setSeeIndividualTutoring] = useState(false);

  // edição
  const [tutoringId, setTutoringId] = useState<string | null>(null);
  const [weekDay, setWeekDay] = useState<string>("Mon");
  const [timeOfTutoring, setTimeOfTutoring] = useState<string>("07:00");
  const [duration, setDuration] = useState<number>(55);
  const [link, setLink] = useState<string>("");

  // nova
  const [theNewWeekDay, setTheNewWeekDay] = useState<string>("Mon");
  const [theNewTimeOfTutoring, setTheNewTimeOfTutoring] =
    useState<string>("07:00");
  const [theNewLink, setTheNewLink] = useState<string>("");
  const [numberOfWeeks, setNumberOfWeeks] = useState<number>(4);
  const [endDateForTutoring, setEndDateForTutoring] = useState<Date | null>(
    null,
  );

  // ✅ Aqui é MODAL DE GRUPO, então o dono é sempre o group
  const groupId: string = group?._id || "";
  const ownerType = "group";
  const ownerId = groupId;

  const myId: string = (() => {
    try {
      const raw = localStorage.getItem("loggedIn");
      if (!raw) return "";
      const parsed = JSON.parse(raw);
      return parsed.theId || parsed._id || parsed.id || "";
    } catch {
      return "";
    }
  })();

  const dayOptions: { value: string; label: string }[] = [
    { value: "Mon", label: "Segunda" },
    { value: "Tue", label: "Terça" },
    { value: "Wed", label: "Quarta" },
    { value: "Thu", label: "Quinta" },
    { value: "Fri", label: "Sexta" },
    { value: "Sat", label: "Sábado" },
    { value: "Sun", label: "Domingo" },
  ];

  // ================================
  // Buscar tutorias do DONO (grupo)
  // ================================
  const fetchTutorings = async () => {
    if (!ownerId) return;
    setLoadingTutoringDays(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/tutoringsevents/${ownerId}?ownerType=${ownerType}`,
        { headers: actualHeaders },
      );
      setTutorings(response.data.tutorings || []);
    } catch (error) {
      console.log(error, "Erro ao encontrar tutorias");
    } finally {
      setLoadingTutoringDays(false);
      setSeeIndividualTutoring(false);
      setTutoringId(null);
      setWeekDay("Mon");
      setTimeOfTutoring("07:00");
      setDuration(55);
      setLink("");
    }
  };

  const handleOpenModal = () => {
    if (group?.tutoringDays?.length) setTutorings(group.tutoringDays);
    setSeeEditTutoring(true);
  };

  const handleCloseModal = () => {
    setSeeEditTutoring(false);
    setTutoringId(null);
    window.location.reload();
  };

  useEffect(() => {
    if (seeEditTutoring) fetchTutorings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seeEditTutoring, ownerId]);

  useEffect(() => {
    if (!seeEditTutoring) return;
    const handleKey = (e: KeyboardEvent) =>
      e.key === "Escape" && handleCloseModal();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seeEditTutoring]);

  const handleSelectTutoring = (item: any) => {
    setSeeIndividualTutoring(true);
    setTutoringId(item.id || item._id || null);
    setWeekDay(item.day || "Mon");
    setTimeOfTutoring(item.time || "07:00");
    setDuration(Number(item.duration) || 55);
    setLink(item.link || "");
  };

  // ================================
  // PUT: atualizar recorrência
  // ================================
  const updateOneTutoring = async () => {
    if (!tutoringId) {
      notifyAlert("Selecione uma tutoria para editar.", partnerColor());
      return;
    }
    if (!myId) {
      notifyAlert(
        "Não foi possível identificar quem está editando.",
        partnerColor(),
      );
      return;
    }
    if (!groupId) {
      notifyAlert("Grupo inválido.", partnerColor());
      return;
    }

    setLoadingTutoringDays(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/tutoringevent`,
        {
          tutoringId, // ✅ qual recorrência editar (antiga)
          editorId: myId, // ✅ quem editou
          groupId, // ✅ dono (grupo)
          day: weekDay,
          time: timeOfTutoring,
          duration,
          link,
        },
        { headers: actualHeaders },
      );

      await fetchTutorings();
      notifyAlert("Tutoria atualizada com sucesso!", partnerColor());
    } catch (error) {
      console.log(error, "Erro ao atualizar tutoria");
      notifyAlert("Erro ao atualizar tutoria.", partnerColor());
      setLoadingTutoringDays(false);
    }
  };

  // ================================
  // POST: criar nova recorrência
  // ================================
  const newTutoring = async () => {
    if (!groupId || !myId) {
      notifyAlert(
        "Não foi possível identificar grupo ou editor.",
        partnerColor(),
      );
      return;
    }

    // (sua regra de aviso de período curto mantida)
    if (endDateForTutoring) {
      const today = new Date();
      const oneMonthFromNow = new Date(today);
      oneMonthFromNow.setMonth(today.getMonth() + 1);
      if (endDateForTutoring < oneMonthFromNow) {
        const endDateFormatted = endDateForTutoring.toLocaleDateString(
          "pt-BR",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          },
        );
        const confirmMessage = `⚠️ ATENÇÃO: O período selecionado termina em ${endDateFormatted}, que é em menos de 1 mês.\n\nPara períodos curtos, recomendamos:\n• Excluir esta configuração de tutoria recorrente\n• Criar eventos únicos através do botão "Criar Evento"\n\nDeseja continuar mesmo assim?`;
        // eslint-disable-next-line no-restricted-globals
        if (!confirm(confirmMessage)) return;
      }
    }

    setLoadingTutoringDays(true);
    try {
      await axios.post(
        `${backDomain}/api/v1/tutoringevent`,
        {
          editorId: myId,
          groupId,
          day: theNewWeekDay,
          time: theNewTimeOfTutoring,
          duration,
          link: theNewLink,
          numberOfWeeks: numberOfWeeks || 4,
          endDate: endDateForTutoring,
        },
        { headers: actualHeaders },
      );

      await fetchTutorings();
      setTheNewLink("");
      setNumberOfWeeks(4);
      setEndDateForTutoring(null);
      notifyAlert("Nova tutoria criada com sucesso!", partnerColor());
    } catch (error) {
      console.log(error, "Erro ao criar tutoria");
      notifyAlert("Erro ao criar tutoria.", partnerColor());
      setLoadingTutoringDays(false);
    }
  };

  // ================================
  // DELETE: excluir recorrência
  // ================================
  const deleteTutoring = async (item: any) => {
    if (!groupId || !myId) return;
    // eslint-disable-next-line no-restricted-globals
    const ok = confirm("Tem certeza que deseja excluir esta tutoria fixa?");
    if (!ok) return;

    setLoadingTutoringDays(true);
    try {
      await axios.delete(`${backDomain}/api/v1/tutoringevent`, {
        data: {
          tutoringId: item.id || item._id,
          editorId: myId,
          groupId,
          day: item.day,
          time: item.time,
        },
        headers: actualHeaders,
      });

      await fetchTutorings();
      if (tutoringId === (item.id || item._id)) setTutoringId(null);
      notifyAlert("Tutoria excluída com sucesso!", partnerColor());
    } catch (error) {
      console.log(error, "Erro ao excluir tutoria");
      notifyAlert("Erro ao excluir tutoria.", partnerColor());
    } finally {
      setLoadingTutoringDays(false);
    }
  };

  // ================================
  // UI
  // ================================
  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 40,
    zIndex: 99999,
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 720,
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 10px 30px rgba(15,23,42,0.25)",
  };

  const sectionTitle: React.CSSProperties = {
    fontWeight: 700,
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  };

  const renderModal = () => {
    if (typeof document === "undefined") return null;
    if (!seeEditTutoring) return null;

    return createPortal(
      <div
        style={overlayStyle}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
      >
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          {!loadingTutoringDays ? (
            <>
              {/* Cabeçalho */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <div>
                  <div style={{ fontSize: 14, color: "#6b7280" }}>
                    Tutorias de
                  </div>
                  <div
                    style={{ fontWeight: 700, fontSize: 18, color: "#111827" }}
                  >
                    {group?.fullname || group?.name || "Grupo"}
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  style={{
                    border: "none",
                    background: "transparent",
                    fontSize: 18,
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Lista */}
              <div style={sectionTitle}>Tutorias recorrentes do grupo</div>

              {tutorings.length === 0 ? (
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  Nenhuma tutoria fixa encontrada.
                </div>
              ) : (
                <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                  {tutorings.map((td: any) => {
                    const selected =
                      tutoringId === (td.id || td._id || undefined);
                    const dayLabel =
                      dayOptions.find((d) => d.value === td.day)?.label ||
                      td.day;

                    return (
                      <div
                        key={td.id || td._id}
                        style={{
                          borderRadius: 12,
                          border: selected
                            ? `2px solid ${partnerColor()}`
                            : "1px solid #E5E7EB",
                          padding: 10,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div style={{ display: "grid", gap: 2 }}>
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: 14,
                              color: "#111827",
                            }}
                          >
                            {td.time} · {dayLabel}
                          </span>
                          <span style={{ fontSize: 12, color: "#6b7280" }}>
                            Duração: {td.duration} min
                          </span>
                          {td.link && (
                            <span
                              style={{
                                fontSize: 11,
                                color: "#2563eb",
                                wordBreak: "break-all",
                              }}
                            >
                              {td.link}
                            </span>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => handleSelectTutoring(td)}
                            style={{
                              borderRadius: 999,
                              border: "1px solid #D1D5DB",
                              padding: "4px 10px",
                              fontSize: 11,
                              cursor: "pointer",
                              backgroundColor: selected ? "#F3F4FF" : "#FFFFFF",
                            }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => deleteTutoring(td)}
                            style={{
                              borderRadius: 999,
                              border: "1px solid #FECACA",
                              padding: "4px 10px",
                              fontSize: 11,
                              cursor: "pointer",
                              backgroundColor: "#FEF2F2",
                              color: "#B91C1C",
                            }}
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {seeIndividualTutoring ? (
                <>
                  <div style={sectionTitle}>Editar tutoria selecionada</div>

                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(140px, 1fr))",
                      alignItems: "flex-end",
                    }}
                  >
                    <div style={{ display: "grid", gap: 4 }}>
                      <label style={{ fontSize: 12, color: "#6b7280" }}>
                        Dia da semana
                      </label>
                      <select
                        value={weekDay}
                        onChange={(e) => setWeekDay(e.target.value)}
                        style={{
                          borderRadius: 8,
                          border: "1px solid #E5E7EB",
                          padding: "6px 8px",
                          fontSize: 13,
                        }}
                      >
                        {dayOptions.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: "grid", gap: 4 }}>
                      <label style={{ fontSize: 12, color: "#6b7280" }}>
                        Horário
                      </label>
                      <input
                        type="time"
                        value={timeOfTutoring}
                        onChange={(e) => setTimeOfTutoring(e.target.value)}
                        style={{
                          borderRadius: 8,
                          border: "1px solid #E5E7EB",
                          padding: "6px 8px",
                          fontSize: 13,
                        }}
                      />
                    </div>

                    <div style={{ display: "grid", gap: 4 }}>
                      <label style={{ fontSize: 12, color: "#6b7280" }}>
                        Duração (min)
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={240}
                        value={duration}
                        onChange={(e) =>
                          setDuration(Number(e.target.value) || 0)
                        }
                        style={{
                          borderRadius: 8,
                          border: "1px solid #E5E7EB",
                          padding: "6px 8px",
                          fontSize: 13,
                        }}
                      />
                    </div>

                    <div
                      style={{ display: "grid", gap: 4, gridColumn: "1 / -1" }}
                    >
                      <label style={{ fontSize: 12, color: "#6b7280" }}>
                        Link da aula
                      </label>
                      <input
                        type="text"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="https://meet.google.com/..."
                        style={{
                          borderRadius: 8,
                          border: "1px solid #E5E7EB",
                          padding: "6px 8px",
                          fontSize: 13,
                        }}
                      />
                    </div>

                    <div
                      style={{
                        gridColumn: "1 / -1",
                        marginTop: 4,
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 8,
                      }}
                    >
                      <button
                        onClick={() => {
                          setSeeIndividualTutoring(false);
                          setTutoringId(null);
                        }}
                        style={{
                          backgroundColor: `${partnerColor()}20`,
                          color: "black",
                          border: "none",
                          borderRadius: 999,
                          padding: "8px 16px",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={updateOneTutoring}
                        style={{
                          backgroundColor: partnerColor(),
                          color: "white",
                          border: "none",
                          borderRadius: 999,
                          padding: "8px 16px",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Salvar alterações
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={sectionTitle}>Criar nova tutoria fixa</div>

                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(140px, 1fr))",
                    }}
                  >
                    <div style={{ display: "grid", gap: 4 }}>
                      <label style={{ fontSize: 12, color: "#6b7280" }}>
                        Dia da semana
                      </label>
                      <select
                        value={theNewWeekDay}
                        onChange={(e) => setTheNewWeekDay(e.target.value)}
                        style={{
                          borderRadius: 8,
                          border: "1px solid #E5E7EB",
                          padding: "6px 8px",
                          fontSize: 13,
                        }}
                      >
                        {dayOptions.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: "grid", gap: 4 }}>
                      <label style={{ fontSize: 12, color: "#6b7280" }}>
                        Horário
                      </label>
                      <input
                        type="time"
                        value={theNewTimeOfTutoring}
                        onChange={(e) =>
                          setTheNewTimeOfTutoring(e.target.value)
                        }
                        style={{
                          borderRadius: 8,
                          border: "1px solid #E5E7EB",
                          padding: "6px 8px",
                          fontSize: 13,
                        }}
                      />
                    </div>

                    <div style={{ display: "grid", gap: 4 }}>
                      <label style={{ fontSize: 12, color: "#6b7280" }}>
                        Duração (min)
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={240}
                        value={duration}
                        onChange={(e) =>
                          setDuration(Number(e.target.value) || 0)
                        }
                        style={{
                          borderRadius: 8,
                          border: "1px solid #E5E7EB",
                          padding: "6px 8px",
                          fontSize: 13,
                        }}
                      />
                    </div>

                    <div
                      style={{ display: "grid", gap: 4, gridColumn: "1 / -1" }}
                    >
                      <label style={{ fontSize: 12, color: "#6b7280" }}>
                        Link da aula
                      </label>
                      <input
                        type="text"
                        value={theNewLink}
                        onChange={(e) => setTheNewLink(e.target.value)}
                        placeholder="https://meet.google.com/..."
                        style={{
                          borderRadius: 8,
                          border: "1px solid #E5E7EB",
                          padding: "6px 8px",
                          fontSize: 13,
                        }}
                      />
                    </div>

                    <div style={{ gridColumn: "1 / -1", marginTop: 4 }}>
                      <button
                        onClick={newTutoring}
                        style={{
                          backgroundColor: "#111827",
                          color: "white",
                          border: "none",
                          borderRadius: 999,
                          padding: "8px 16px",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Criar nova tutoria
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div style={{ fontSize: 14 }}>Carregando...</div>
          )}
        </div>
      </div>,
      document.body,
    );
  };

  return (
    <>
      <div
        onClick={handleOpenModal}
        style={{
          marginTop: 14,
          display: "flex",
          fontWeight: 700,
          color: partnerColor(),
          fontSize: 12,
          cursor: "pointer",
          textTransform: "uppercase",
          alignItems: "center",
          gap: 6,
        }}
      >
        <i className="fa fa-pencil" /> Editar aulas fixas
      </div>

      {renderModal()}
    </>
  );
};
