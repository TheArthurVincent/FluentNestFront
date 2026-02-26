import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

export default function MonthPickerModalButton({
  selectedMonth,
  setSelectedMonth,
  setShowGenerateButton,
  seeReports,
  generateMonthOptions,
  buttonLabel,
}) {
  const [open, setOpen] = useState(false);
  const [draftMonth, setDraftMonth] = useState(selectedMonth || "");

  const monthOptions = useMemo(() => {
    return typeof generateMonthOptions === "function"
      ? generateMonthOptions()
      : [];
  }, [generateMonthOptions]);

  const toUrlFormat = (yyyyMm) => {
    if (!yyyyMm || !yyyyMm.includes("-")) return "";
    const [year, month] = yyyyMm.split("-");
    return `${Number(month)}-${year}`; // m-yyyy (sem zero à esquerda)
  };

  const fromUrlFormat = (mYyyy) => {
    if (!mYyyy || !mYyyy.includes("-")) return "";
    const [month, year] = mYyyy.split("-");
    const mm = String(month).padStart(2, "0");
    return `${year}-${mm}`; // yyyy-mm
  };

  const updateUrlMonth = (yyyyMm) => {
    const params = new URLSearchParams(window.location.search);
    params.set("month", toUrlFormat(yyyyMm));
    const newUrl = window.location.pathname + "?" + params.toString();
    window.history.replaceState({}, "", newUrl);
  };

  const openModal = () => {
    setDraftMonth(selectedMonth || "");
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setDraftMonth(selectedMonth || "");
  };

  const handleSave = () => {
    if (!draftMonth) return;

    setShowGenerateButton(false);
    setSelectedMonth(draftMonth);
    seeReports(draftMonth);
    updateUrlMonth(draftMonth);

    setOpen(false);
  };

  // Lê month da URL ao montar (m-yyyy) e converte para yyyy-mm
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const monthFromUrl = params.get("month");

    if (monthFromUrl) {
      const formatted = fromUrlFormat(monthFromUrl);
      if (formatted) {
        setShowGenerateButton(false);
        setSelectedMonth(formatted);
        seeReports(formatted);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mantém draft sincronizado com o selectedMonth
  useEffect(() => {
    setDraftMonth(selectedMonth || "");
  }, [selectedMonth]);

  // ESC + trava scroll
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const modal = (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        zIndex: 999999,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 18px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}>
            Selecionar mês
          </div>

          <button
            type="button"
            onClick={closeModal}
            style={{
              border: "1px solid #e5e7eb",
              background: "#fff",
              borderRadius: "8px",
              padding: "6px 10px",
              cursor: "pointer",
              color: "#374151",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "18px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: "#374151",
              marginBottom: "8px",
            }}
          >
            Mês
          </label>

          <select
            value={draftMonth}
            onChange={(e) => setDraftMonth(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              color: "#374151",
              backgroundColor: "#fff",
              outline: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {monthOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div
          style={{
            padding: "14px 18px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={closeModal}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              background: "#fff",
              cursor: "pointer",
              color: "#374151",
              fontWeight: 600,
            }}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!draftMonth}
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              cursor: !draftMonth ? "not-allowed" : "pointer",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "none",
      }}
    >
      <button
        type="button"
        onClick={openModal}
        style={{
          fontSize: "14px",
          color: "#374151",
          border: "1px solid #d1d5db",
          backgroundColor: "#fff",
          outline: "none",
          cursor: "pointer",
          transition: "all 0.2s ease",
          display: "block",
        }}
      >
        {buttonLabel}
      </button>

      {open && createPortal(modal, document.body)}
    </div>
  );
}
