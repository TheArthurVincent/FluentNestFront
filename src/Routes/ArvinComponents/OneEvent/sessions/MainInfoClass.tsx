import React, { FC, useEffect, useState } from "react";
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

type MainInfoClassProps = {
  headers: MyHeadersType;
  evendId: string;
  fetchEventData: () => void;
  isDesktop?: boolean;
  event?: any;
  allowedToEdit?: boolean;
};

type FreeEventItem = {
  _id: string;
  date: string; // "2025-12-17"
  time: string; // "10:00"
};

// ---------- estilos ----------
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

// tabs
const tabsRowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 8,
  padding: "0 12px 12px 12px",
};

const tabBtnStyle = (active: boolean): React.CSSProperties => ({
  borderRadius: 10,
  border: `1px solid ${active ? partnerColor() : "#e2e8f0"}`,
  background: active ? "rgba(84,191,8,0.10)" : "#fff",
  color: "#0f172a",
  padding: "10px 10px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: active ? 700 : 600,
});

const MainInfoClass: FC<MainInfoClassProps> = ({
  headers,
  evendId,
  isDesktop,
  event,
  fetchEventData,
  allowedToEdit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // modal "Reagendar"
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleTab, setRescheduleTab] = useState<"fixed" | "free">("fixed");
  const [rescheduling, setRescheduling] = useState(false);

  // estados para edição (modal antigo)
  const [date, setDate] = useState<string>(event?.date || "");
  const [time, setTime] = useState<string>(event?.time || "");
  const [link, setLink] = useState<string>(event?.link || "");
  const [category, setCategory] = useState<string>(event?.category || "");
  const [duration, setDuration] = useState<number | "">(event?.duration ?? "");

  // estados para reagendar (tab livre)
  const [newDate, setNewDate] = useState<string>(event?.date || "");
  const [newTime, setNewTime] = useState<string>(event?.time || "");

  // estados para tab "fixo"
  const [loadingEventsFree, setLoadingEventsFree] = useState(false);
  const [eventsFreeArray, setEventsFreeArray] = useState<FreeEventItem[]>([]);
  const [selectedFreeEvent, setSelectedFreeEvent] =
    useState<FreeEventItem | null>(null);

  // presets de duração
  const presetOptions = [30, 45, 60, 90];
  const [preset, setPreset] = useState<string>("");

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

    // ao trocar evento, limpa seleção do fixo
    setSelectedFreeEvent(null);
  }, [event]);

  const updateMainInfo = async (id: string) => {
    try {
      setSaving(true);

      const payload: any = {
        date,
        time,
        link,
        category,
        duration: typeof duration === "number" ? duration : undefined,
      };

      const response = await axios.put(
        `${backDomain}/api/v1/eventmaininfo/${id}`,
        payload,
        { headers: headers as any }
      );

      if (response) fetchEventData();
    } catch (error) {
      console.error("Erro ao atualizar informações do evento", error);
    } finally {
      setSaving(false);
    }
  };

  const rescheduleEvent = async (
    id: string,
    forced?: { date: string; time: string; idNew?: string }
  ) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/event-reschedule/${id}`,
        { forced },
        { headers: headers as any }
      );

      window.location.reload();
    } catch (error) {
      console.error("Erro ao reagendar o evento", error);
    } finally {
      setRescheduling(false);
    }
  };

  const [allowedToReschedule, setAllowedToReschedule] = useState(false);
  const fetchEventsFree = async () => {
    const loggedIn = JSON.parse(localStorage.getItem("loggedIn") || "false");
    if (!loggedIn) return;

    try {
      setLoadingEventsFree(true);

      const response = await axios.get(
        `${backDomain}/api/v1/free-events/${loggedIn.id || loggedIn._id}`,
        { headers: headers as any }
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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    if (!saving) setIsModalOpen(false);
  };
  const handleSave = async () => {
    await updateMainInfo(evendId);
    setIsModalOpen(false);
  };

  const openRescheduleModal = () => {
    fetchEventsFree();
    setRescheduleTab("fixed");
    setSelectedFreeEvent(null);
    setIsRescheduleOpen(true);
  };

  const closeRescheduleModal = () => {
    if (!rescheduling) setIsRescheduleOpen(false);
  };

  const handleRescheduleSave = async () => {
    // tab livre (mantém o comportamento anterior)
    await rescheduleEvent(evendId);
    setIsRescheduleOpen(false);
  };

  const renderModal = () => {
    if (!isModalOpen) return null;
    if (typeof document === "undefined") return null;

    return createPortal(
      <div style={overlayStyle}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <div
            style={{
              padding: "20px 16px",
              maxWidth: "fit-content",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Editar informações da aula
          </div>

          <div style={{ padding: 12, display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>Data</label>
              <input
                type="date"
                disabled={saving}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>Horário</label>
              <input
                type="time"
                disabled={saving}
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
                disabled={saving}
                value={link}
                onChange={(e) => setLink(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>
                Categoria
              </label>
              <select
                disabled={saving}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ ...inputStyle, paddingRight: 24 }}
              >
                <option value="">Selecione uma categoria...</option>
                {categoryList.map((cat) => {
                  if (cat.forStudent == true)
                    return (
                      <option key={cat.value} value={cat.value}>
                        {cat.text}
                      </option>
                    );
                  return null;
                })}
              </select>
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>
                Duração (minutos)
              </label>

              <select
                disabled={saving}
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
                disabled={saving || preset !== "custom"}
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

              <span style={{ fontSize: 11, color: "#94a3b8" }}>
                Escolha uma duração padrão ou selecione &quot;Outro&quot; e
                digite um valor manualmente.
              </span>
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
                onClick={closeModal}
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                style={{ ...primaryBtnStyle, opacity: saving ? 0.7 : 1 }}
                disabled={saving}
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          )}
        </div>
      </div>,
      document.body
    );
  };

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
        border: `1px solid ${selected ? partnerColor() : "#e2e8f0"}`,
        background: selected ? "rgba(84,191,8,0.12)" : "#fff",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: selected ? 700 : 500,
        color: "#0f172a",
      }}
    >
      {item.date} • {item.time}
    </button>
  );

  // modal Reagendar
  const renderRescheduleModal = () => {
    if (!isRescheduleOpen) return null;
    if (typeof document === "undefined") return null;

    return createPortal(
      <div style={overlayStyle} onClick={closeRescheduleModal}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <div
            style={{
              padding: "20px 16px 10px 16px",
              maxWidth: "fit-content",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Reagendar aula
          </div>

          {allowedToEdit && (
            <div style={tabsRowStyle}>
              <button
                type="button"
                style={tabBtnStyle(rescheduleTab === "fixed")}
                onClick={() => setRescheduleTab("fixed")}
                disabled={rescheduling}
              >
                Horários fixos
              </button>
              <button
                type="button"
                style={tabBtnStyle(rescheduleTab === "free")}
                onClick={() => setRescheduleTab("free")}
                disabled={rescheduling}
              >
                Horário livre
              </button>
            </div>
          )}
          {!allowedToReschedule ? (
            <div
              style={{
                padding: 12,
              }}
            >
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
                  ) : eventsFreeArray.length === 0 ? (
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
                    <div style={{ display: "grid", gap: 10 }}>
                      {eventsFreeArray.map((it) => (
                        <FreeEventItemButton
                          key={it._id}
                          item={it}
                          selected={selectedFreeEvent?._id === it._id}
                          onClick={() => setSelectedFreeEvent(it)}
                        />
                      ))}
                    </div>
                  )}

                  {/* confirmação irreversível */}
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
                      <div style={{ fontSize: 13, color: "#0f172a" }}>
                        <b>{selectedFreeEvent.date}</b> às{" "}
                        <b>{selectedFreeEvent.time}</b>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          marginTop: 6,
                          marginLeft: "auto",
                        }}
                      >
                        <button
                          type="button"
                          disabled={rescheduling}
                          onClick={async () => {
                            setSelectedFreeEvent(null);
                          }}
                          style={{
                            ...primaryBtnStyle,
                            border: "1px solid #eee",
                            color: "#555",
                            background: "#fff",
                            opacity: rescheduling ? 0.7 : 1,
                          }}
                        >
                          Cancelar
                        </button>{" "}
                        <button
                          type="button"
                          disabled={rescheduling}
                          onClick={async () => {
                            // ação irreversível: reage na hora
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
          {/* Footer com Salvar (não faz nada) e Cancelar */}
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
              onClick={closeRescheduleModal}
              disabled={rescheduling}
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={() => {
                // por enquanto não faz nada
              }}
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
      document.body
    );
  };

  if (!event) return null;

  return (
    <>
      <div
        style={{
          ...cardBase,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          position: "relative",
        }}
      >
        <div
          style={{
            ...cardTitle,
            marginBottom: 12,
            justifyContent: "space-between",
          }}
        >
          <span>Informações do Evento</span>
        </div>

        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noreferrer"
            style={{
              marginTop: 14,
              display: "flex",
              fontWeight: 700,
              color: partnerColor(),
              textDecoration: "none",
              fontSize: 18,
              textTransform: "uppercase",
              alignItems: "center",
              gap: 6,
            }}
          >
            <i className="fa fa-external-link" />
            Link da Sala
          </a>
        )}

        <div
          style={{
            marginTop: 12,
            borderLeft: `4px solid ${partnerColor()}`,
            paddingLeft: 12,
            display: "grid",
            gap: 8,
          }}
        >
          {!isDesktop && (
            <div style={{ display: "grid" }}>
              <span style={{ fontSize: 12, color: "#606060" }}>Aluno</span>
              <span style={{ fontWeight: 600, color: "#030303", fontSize: 14 }}>
                {event.student}
              </span>
            </div>
          )}

          <div style={{ display: "grid" }}>
            <span style={{ fontSize: 12, color: "#606060" }}>
              Data e horário
            </span>
            <span style={{ fontWeight: 600, color: "#030303", fontSize: 14 }}>
              {event.date} ({event.time})
            </span>
          </div>

          <div style={{ display: "grid" }}>
            <span style={{ fontSize: 12, color: "#606060" }}>Duração</span>
            <span style={{ fontWeight: 600, color: "#030303", fontSize: 14 }}>
              {event.duration} min
            </span>
          </div>

          <div style={{ display: "grid" }}>
            <span style={{ fontSize: 12, color: "#606060" }}>Categoria</span>
            <span style={{ fontWeight: 600, color: "#030303", fontSize: 14 }}>
              {categoryList.find((c) => c.value === event.category)?.text ||
                "-"}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            gap: 12,
          }}
        >
          {event.status == "marcado" &&
            event.category !== "Established Group Class" && (
              <button
                onClick={openRescheduleModal}
                style={{
                  padding: "8px 16px",
                  backgroundColor: partnerColor(),
                  color: "#fff",
                  maxWidth: "fit-content",
                  border: "none",
                  marginLeft: "auto",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Reagendar
              </button>
            )}

          {allowedToEdit && (
            <button
              onClick={openModal}
              style={{
                padding: "8px 16px",
                backgroundColor: partnerColor(),
                color: "#fff",
                maxWidth: "fit-content",
                border: "none",
                marginLeft: "auto",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Editar informações
            </button>
          )}
        </div>
      </div>

      {renderModal()}
      {renderRescheduleModal()}
    </>
  );
};

export default MainInfoClass;
