import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { useUserContext } from "../../../../Application/SelectLanguage/SelectLanguage";

interface ToDoAddButtonProps {
  userId: string | number;
  onCreated: (newItem: any) => void; // substitua `any` pelo tipo do item criado se souber
}

type FormState = {
  description: string;
  category: string;
  date: string;
  checkList1: string;
  checkList2: string;
  checkList3: string;
  checkList4: string;
  checkList5: string;
  checkList6: string;
  checkList7: string;
  checkList8: string;
  checkList9: string;
  checkList10: string;
};

interface ToDoModalProps {
  open: boolean;
  onClose: () => void;
  form: FormState;
  NumberOfChecklists: number;
  setNumberOfChecklists: React.Dispatch<React.SetStateAction<number>>;
  categories: { value: string; label: string }[];
  UniversalTexts: any;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: () => void;
  loading: boolean;
  formChecklistAllEmpty: boolean;
}

const ToDoModal: React.FC<ToDoModalProps> = ({
  open,
  onClose,
  form,
  NumberOfChecklists,
  setNumberOfChecklists,
  categories,
  UniversalTexts,
  handleChange,
  handleSubmit,
  loading,
  formChecklistAllEmpty,
}) => {
  if (!open) return null;

  // Garante que só roda no browser
  if (typeof document === "undefined") return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "4px",
          width: "320px",
          boxShadow: "0 2px 16px #0002",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{UniversalTexts.newTask}</h3>

        <input
          name="description"
          placeholder={UniversalTexts.description}
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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => setNumberOfChecklists((prev) => prev - 1)}
            disabled={NumberOfChecklists === 1}
            style={{
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
              fontWeight: 600,
              backgroundColor: "#edededff",
              color: "grey",
              marginBottom: "1rem",
            }}
          >
            - Check
          </button>
          {NumberOfChecklists}
          <button
            disabled={NumberOfChecklists === 10}
            onClick={() => setNumberOfChecklists((prev) => prev + 1)}
            style={{
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
              fontWeight: 600,
              backgroundColor: "#edededff",
              marginBottom: "1rem",
            }}
          >
            + Check
          </button>
        </div>

        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <input
            key={i}
            name={`checkList${i}`}
            placeholder={`Checklist ${i} ${
              i === 1 ? "(Descreva pelo menos uma subtarefa)" : ""
            }`}
            // @ts-ignore
            value={form[`checkList${i}`]}
            onChange={handleChange}
            style={{
              width: "100%",
              display: i <= NumberOfChecklists ? "block" : "none",
              marginBottom: "8px",
            }}
          />
        ))}

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "blue",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
            }}
          >
            {UniversalTexts.cancel}
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              form.description === "" ||
              NumberOfChecklists === 0 ||
              form.category === "" ||
              formChecklistAllEmpty ||
              form.date === ""
            }
            style={{
              backgroundColor:
                form.description === "" ||
                formChecklistAllEmpty ||
                NumberOfChecklists === 0 ||
                form.category === "" ||
                form.date === ""
                  ? "lightgray"
                  : "green",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
              fontWeight: 600,
            }}
          >
            {loading ? UniversalTexts.saving : UniversalTexts.save}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

function ToDoAddButton({ userId, onCreated }: ToDoAddButtonProps) {
  const [open, setOpen] = useState(false);
  const [NumberOfChecklists, setNumberOfChecklists] = useState(1);
  const [form, setForm] = useState<FormState>({
    description: "",
    category: "",
    date: "",
    checkList1: "",
    checkList2: "",
    checkList3: "",
    checkList4: "",
    checkList5: "",
    checkList6: "",
    checkList7: "",
    checkList8: "",
    checkList9: "",
    checkList10: "",
  });

  const { UniversalTexts } = useUserContext();

  const categories = [
    { value: "personal", label: "Vida pessoal" },
    { value: "finance", label: "Financeiro" },
    { value: "work", label: "Trabalho" },
    { value: "study", label: "Estudos" },
    { value: "health", label: "Saúde" },
    { value: "family", label: "Família" },
    { value: "other", label: "Outro" },
  ];

  const [formChecklistAllEmpty, setFormChecklistAllEmpty] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormChecklistAllEmpty(
      form.checkList1 === "" &&
        form.checkList2 === "" &&
        form.checkList3 === "" &&
        form.checkList4 === "" &&
        form.checkList5 === "" &&
        form.checkList6 === "" &&
        form.checkList7 === "" &&
        form.checkList8 === "" &&
        form.checkList9 === "" &&
        form.checkList10 === ""
    );
  }, [form]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let dateString: string | Date = form.date;

      if (dateString) {
        dateString = new Date(dateString).toISOString().split("T")[0];
      }

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
        checkList6: "",
        checkList7: "",
        checkList8: "",
        checkList9: "",
        checkList10: "",
      });
      setNumberOfChecklists(1);

      if (onCreated) onCreated(response.data);
    } catch (err) {
      alert("Erro ao criar ToDo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} title="Novo ToDo">
        + {UniversalTexts.task}
      </button>

      <ToDoModal
        open={open}
        onClose={() => setOpen(false)}
        form={form}
        NumberOfChecklists={NumberOfChecklists}
        setNumberOfChecklists={setNumberOfChecklists}
        categories={categories}
        UniversalTexts={UniversalTexts}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
        formChecklistAllEmpty={formChecklistAllEmpty}
      />
    </>
  );
}

export default ToDoAddButton;
