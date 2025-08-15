import React, { useState } from "react";
import axios from "axios";
import { partnerColor, textpartnerColorContrast } from "../../../Styles/Styles";
import { backDomain } from "../../../Resources/UniversalComponents";

function ToDoAddButton({ userId, onCreated }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    description: "",
    category: "",
    date: "",
    checkList1: "",
    checkList2: "",
    checkList3: "",
    checkList4: "",
    checkList5: "",
  });

  // Categorias fixas para o backend e labels para o select
  const categories = [
    { value: "personal", label: "Vida pessoal" },
    { value: "finance", label: "Financeiro" },
    { value: "work", label: "Trabalho" },
    { value: "study", label: "Estudos" },
    { value: "health", label: "Saúde" },
    { value: "family", label: "Família" },
    { value: "other", label: "Outro" },
  ];
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Garante que a data está no formato YYYY-MM-DD
      let dateString = form.date;
      if (dateString instanceof Date) {
        dateString = dateString.toISOString().split("T")[0];
      }
      // Se vier como string, só garante o formato
      if (typeof dateString === "string" && dateString.includes("T")) {
        dateString = dateString.split("T")[0];
      }
      const payload = { ...form, date: dateString };
      const response = await axios.post(
        `${backDomain}/api/v1/todo/${userId}`,
        payload
      );
      setOpen(false);
      setForm({
        description: "",
        category: "",
        date: "",
        checkList1: "",
        checkList2: "",
        checkList3: "",
        checkList4: "",
        checkList5: "",
      });
      if (onCreated) onCreated();
    } catch (err) {
      alert("Erro ao criar ToDo");
    }
    setLoading(false);
  };

  return (
    <>
      <button
        style={{
          border: "1px solid #dee2e6",
          borderRadius: "6px",
          fontSize: "12px",
          transition: "all 0.15s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => setOpen(true)}
        title="Novo ToDo"
      >
        + Task
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            description: { type: String, required: false, unique: false },
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "12px",
              minWidth: "320px",
              boxShadow: "0 2px 16px #0002",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Novo ToDo</h3>
            <input
              name="description"
              placeholder="Descrição"
              value={form.description}
              onChange={handleChange}
              style={{ width: "100%", marginBottom: "8px" }}
            />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={{ width: "100%", marginBottom: "8px" }}
              required
            >
              <option value="">Selecione a categoria</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              style={{ width: "100%", marginBottom: "8px" }}
            />
            {[1, 2, 3, 4, 5].map((i) => (
              <input
                key={i}
                name={`checkList${i}`}
                placeholder={`Checklist ${i}`}
                value={form[`checkList${i}`]}
                onChange={handleChange}
                style={{ width: "100%", marginBottom: "8px" }}
              />
            ))}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "right",
                marginTop: "1rem",
                marginRight: "auto",
              }}
            >
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 16px",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  background: partnerColor(),
                  color: textpartnerColorContrast(),
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 16px",
                  fontWeight: 600,
                }}
              >
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ToDoAddButton;
