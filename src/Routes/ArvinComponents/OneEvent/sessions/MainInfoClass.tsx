import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import { categoryList } from "../../../MyCalendar/CalendarComponents/MyCalendarFunctions/MyCalendarFunctions";
import { cardBase } from "../../Students/TheStudent/types/studentPage.styles";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { partnerColor } from "../../../../Styles/Styles";
import { backDomain } from "../../../../Resources/UniversalComponents";

type MainInfoClassProps = {
  headers: MyHeadersType;
  evendId: string;
  fetchEventData: () => void;
  isDesktop?: boolean;
  event?: any;
};

// ---------- estilos reaproveitando a ideia do SimpleAIGenerator ----------
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
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // estados para edição
  const [date, setDate] = useState<string>(event?.date || "");
  const [time, setTime] = useState<string>(event?.time || "");
  const [link, setLink] = useState<string>(event?.link || "");
  const [category, setCategory] = useState<string>(event?.category || "");
  const [duration, setDuration] = useState<number | "">(event?.duration ?? "");

  // presets de duração
  const presetOptions = [30, 45, 60, 90];
  const [preset, setPreset] = useState<string>("");

  // sincroniza quando o evento mudar
  useEffect(() => {
    setDate(event?.date || "");
    setTime(event?.time || "");
    const d = event?.duration ?? "";
    setDuration(d);
    if (typeof d === "number" && presetOptions.includes(d)) {
      setPreset(String(d));
    } else {
      setPreset("custom");
    }
    setCategory(event?.category || "");
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

      if (response) {
        fetchEventData();
      }
    } catch (error) {
      console.error("Erro ao atualizar informações do evento", error);
    } finally {
      setSaving(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (!saving) setIsModalOpen(false);
  };

  const handleSave = async () => {
    await updateMainInfo(evendId);
    setIsModalOpen(false);
  };

  const renderModal = () => {
    if (!isModalOpen) return null;
    if (typeof document === "undefined") return null;

    return createPortal(
      <div style={overlayStyle} onClick={saving ? undefined : closeModal}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
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

          {/* Corpo */}
          <div style={{ padding: 12, display: "grid", gap: 12 }}>
            {/* Data */}
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

            {/* Horário */}
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
            {/* Link */}
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

            {/* Categoria */}
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>
                Categoria
              </label>
              <select
                disabled={saving}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  ...inputStyle,
                  paddingRight: 24,
                }}
              >
                <option value="">Selecione uma categoria...</option>
                {categoryList.map((cat) => {
                  if (cat.forStudent == true)
                    return (
                      <option key={cat.value} value={cat.value}>
                        {cat.text}
                      </option>
                    );
                })}
              </select>
            </div>

            {/* Duração */}
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontSize: 12, color: "#334155" }}>
                Duração (minutos)
              </label>

              {/* Select de presets */}
              <select
                disabled={saving}
                value={preset}
                onChange={(e) => {
                  const v = e.target.value;
                  setPreset(v);
                  if (v !== "custom" && v !== "") {
                    const num = Number(v);
                    if (!Number.isNaN(num)) {
                      setDuration(num);
                    }
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

              {/* Input numérico */}
              <input
                type="number"
                min={1}
                disabled={saving || preset !== "custom"}
                value={duration === "" ? "" : duration}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setDuration("");
                  } else {
                    const num = Number(val);
                    if (!Number.isNaN(num)) {
                      setDuration(num);
                    }
                  }
                  setPreset("custom");
                }}
                placeholder="Digite a duração em minutos"
                style={inputStyle}
              />

              <span
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                }}
              >
                Escolha uma duração padrão ou selecione &quot;Outro&quot; e
                digite um valor manualmente.
              </span>
            </div>
          </div>

          {/* Footer */}
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
            Entrar na Aula
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
          {/* Aluno (somente mobile) */}
          {!isDesktop && (
            <div style={{ display: "grid" }}>
              <span
                style={{
                  fontSize: 12,
                  color: "#606060",
                }}
              >
                Aluno
              </span>
              <span
                style={{
                  fontWeight: 600,
                  color: "#030303",
                  fontSize: 14,
                }}
              >
                {event.student}
              </span>
            </div>
          )}

          {/* Data e horário */}
          <div style={{ display: "grid" }}>
            <span
              style={{
                fontSize: 12,
                color: "#606060",
              }}
            >
              Data e horário
            </span>
            <span
              style={{
                fontWeight: 600,
                color: "#030303",
                fontSize: 14,
              }}
            >
              {event.date} ({event.time})
            </span>
          </div>

          {/* Duração */}
          <div style={{ display: "grid" }}>
            <span
              style={{
                fontSize: 12,
                color: "#606060",
              }}
            >
              Duração
            </span>
            <span
              style={{
                fontWeight: 600,
                color: "#030303",
                fontSize: 14,
              }}
            >
              {event.duration} min
            </span>
          </div>

          {/* Categoria */}
          <div style={{ display: "grid" }}>
            <span
              style={{
                fontSize: 12,
                color: "#606060",
              }}
            >
              Categoria
            </span>
            <span
              style={{
                fontWeight: 600,
                color: "#030303",
                fontSize: 14,
              }}
            >
              {categoryList.find((c) => c.value === event.category)?.text ||
                "-"}
            </span>
          </div>
        </div>
        {/* Botão para abrir o modal de edição */}
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
      </div>

      {renderModal()}
    </>
  );
};

export default MainInfoClass;
