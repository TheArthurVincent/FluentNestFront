import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  backDomain,
  formatNumber,
  truncateString,
} from "../../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { partnerColor, primaryColor } from "../../../../../Styles/Styles";
import { isArthurVincent } from "../../../../../App";

type HeadersType = Record<string, string>;

type EntriesAndExitsProps = {
  headers: HeadersType;
  id: string;
  fetchFinancialReports: any;
};

type Student = {
  id: string;
  name: string;
  lastname: string;
  picture?: string;
  fee?: string | number;
  onHold?: boolean;
};

type FixedCost = {
  id?: string;
  description: string;
  amount: string | number;
  month?: string;
  typeOfItem?: string;
};

type ItemType = "others" | "debt";

const pad2 = (n: number) => String(n).padStart(2, "0");
const getCurrentMonthYear = () => {
  const d = new Date();
  return `${pad2(d.getMonth() + 1)}-${d.getFullYear()}`;
};

export function EntriesAndExits({
  headers,
  id,
  fetchFinancialReports,
}: EntriesAndExitsProps) {
  const currentMonthYear = useMemo(() => getCurrentMonthYear(), []);

  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState<Student[]>([]);
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([]);

  // Só precisamos saber se existem reports no mês (pra mostrar o checkbox)
  const [hasReportsThisMonth, setHasReportsThisMonth] = useState(false);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 700 : false,
  );

  const [revenueExpanded, setRevenueExpanded] = useState(false);
  const [fixedCostsExpanded, setFixedCostsExpanded] = useState(false);

  // Novo custo fixo
  const [newCostModalOpen, setNewCostModalOpen] = useState(false);
  const [newCostAmount, setNewCostAmount] = useState("");
  const [newCostDescription, setNewCostDescription] = useState("");
  const [includeThisMonth, setIncludeThisMonth] = useState(false);

  // Detalhes do custo fixo
  const [costDetailModalOpen, setCostDetailModalOpen] = useState(false);
  const [selectedCost, setSelectedCost] = useState<FixedCost | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isEditingCost, setIsEditingCost] = useState(false);
  const [editCostDescription, setEditCostDescription] = useState("");
  const [editCostAmount, setEditCostAmount] = useState("0");

  // =========================
  // Fetchers
  // =========================
  const fetchStudents = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/studentsfinancialreports/${id}`,
        { headers },
      );
      console.log("response students", response.data);
      const list = (response.data?.listOfStudentsFees || []) as Student[];
      setStudents(list);
    } catch {
      notifyAlert("Erro ao encontrar relatório financeiro");
    }
  }, [headers, id]);

  const fetchFixedCosts = useCallback(async (): Promise<void> => {
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/fixed-costs/${id}`,
        {
          headers,
        },
      );

      const costs = (response.data?.fixedCosts || []) as FixedCost[];
      setFixedCosts(costs);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("error", error);
    }
  }, [headers, id]);

  const fetchHasReports = useCallback(
    async (month: string): Promise<void> => {
      try {
        const response = await axios.get(`${backDomain}/api/v1/finance/${id}`, {
          headers,
          params: { month },
        });

        const list = (response.data?.financialReportsOfTheMonth ||
          []) as unknown[];
        setHasReportsThisMonth(list.length > 0);
      } catch {
        setHasReportsThisMonth(false);
      }
    },
    [headers, id],
  );

  // Resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 700);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Init
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await Promise.all([
          fetchStudents(),
          fetchFixedCosts(),
          fetchHasReports(currentMonthYear),
        ]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [fetchStudents, fetchFixedCosts, fetchHasReports, currentMonthYear]);

  // =========================
  // Computeds
  // =========================
  const activeStudents = useMemo(() => {
    return students.filter((s) => (Number(s.fee) || 0) > 0 && !s.onHold);
  }, [students]);

  const monthlyRevenue = useMemo(() => {
    return activeStudents.reduce((t, s) => t + (Number(s.fee) || 0), 0);
  }, [activeStudents]);

  const totalFixedCosts = useMemo(() => {
    return fixedCosts.reduce((t, c) => t + (Number(c.amount) || 0), 0);
  }, [fixedCosts]);

  const sortedStudents = useMemo(() => {
    return students.slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [students]);

  const sortedFixedCosts = useMemo(() => {
    return fixedCosts
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  }, [fixedCosts]);

  // =========================
  // UI Handlers
  // =========================
  const toggleRevenue = useCallback(() => setRevenueExpanded((v) => !v), []);
  const toggleFixedCosts = useCallback(
    () => setFixedCostsExpanded((v) => !v),
    [],
  );

  const onStudentClick = useCallback((studentId: string) => {
    // placeholder
    // eslint-disable-next-line no-console
    console.log("student clicked:", studentId);
  }, []);

  const openNewCostModal = useCallback(() => {
    setNewCostModalOpen(true);
    setNewCostAmount("");
    setNewCostDescription("");
    setIncludeThisMonth(false);
  }, []);

  const closeNewCostModal = useCallback(() => {
    setNewCostModalOpen(false);
    setNewCostAmount("");
    setNewCostDescription("");
    setIncludeThisMonth(false);
  }, []);

  const openCostDetailModal = useCallback((cost: FixedCost) => {
    setCostDetailModalOpen(true);
    setSelectedCost(cost);
    setShowDeleteConfirmation(false);
    setIsEditingCost(false);
    setEditCostDescription(cost?.description ?? "");
    setEditCostAmount(String(cost?.amount ?? "0"));
  }, []);

  const closeCostDetailModal = useCallback(() => {
    setCostDetailModalOpen(false);
    setSelectedCost(null);
    setShowDeleteConfirmation(false);
    setIsEditingCost(false);
    setEditCostDescription("");
    setEditCostAmount("0");
  }, []);

  // =========================
  // Validation
  // =========================
  const isDuplicateCostName = useMemo(() => {
    const name = newCostDescription.trim().toLowerCase();
    if (!name) return false;

    return fixedCosts.some(
      (c) => (c.description || "").toLowerCase().trim() === name,
    );
  }, [newCostDescription, fixedCosts]);

  const isSaveCostDisabled = useMemo(() => {
    return !newCostAmount || !newCostDescription.trim() || isDuplicateCostName;
  }, [newCostAmount, newCostDescription, isDuplicateCostName]);

  // =========================
  // CRUD Fixed Costs
  // =========================
  const [loadingNewCost, setLoadingNewCost] = useState(false);
  const createFixedCost = useCallback(
    async (typeOfItem: ItemType): Promise<void> => {
      if (!newCostAmount || !newCostDescription.trim()) {
        notifyAlert("Preencha todos os campos");
        return;
      }

      if (isDuplicateCostName) {
        notifyAlert(
          "Já existe um custo com esta descrição. Escolha outro nome.",
          "red",
        );
        return;
      }
      setLoadingNewCost(true);
      try {
        const response = await axios.post(
          `${backDomain}/api/v1/fixed-cost/${id}`,
          {
            amount: Number(newCostAmount),
            month: currentMonthYear,
            description: newCostDescription,
            addThisMonth: includeThisMonth,
            typeOfItem,
          },
          { headers },
        );

        setFixedCosts((response.data?.fixedCosts || []) as FixedCost[]);
        setIncludeThisMonth(false);
        // mantém coerência do checkbox
        void fetchHasReports(currentMonthYear);
        notifyAlert("Custo fixo adicionado com sucesso!", "green");
        setTimeout(() => {
          closeNewCostModal();
          window.location.reload();
          setLoadingNewCost(false);
        }, 500);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log("error", error);
        notifyAlert("Erro ao criar custo fixo", partnerColor());
      }
    },
    [
      newCostAmount,
      newCostDescription,
      includeThisMonth,
      isDuplicateCostName,
      id,
      headers,
      currentMonthYear,
      closeNewCostModal,
      fetchHasReports,
    ],
  );

  const deleteCost = useCallback(
    async (description: string, amount: string | number): Promise<void> => {
      try {
        const response = await axios.delete(
          `${backDomain}/api/v1/fixed-cost/${id}`,
          {
            headers,
            data: { description, amount },
          },
        );

        setFixedCosts((response.data?.remainingCosts || []) as FixedCost[]);
        notifyAlert("Custo excluído com sucesso!", "green");
        closeCostDetailModal();
        setShowDeleteConfirmation(false);

        void fetchHasReports(currentMonthYear);
      } catch (error) {
        notifyAlert("Erro ao excluir custo");
        // eslint-disable-next-line no-console
        console.log("error", error);
      }
    },
    [headers, id, closeCostDetailModal, fetchHasReports, currentMonthYear],
  );

  const updateCost = useCallback(
    async (
      oldDescription: string,
      oldAmount: string | number,
      newDescription: string,
      newAmount: string,
    ): Promise<void> => {
      try {
        const response = await axios.put(
          `${backDomain}/api/v1/fixed-cost/${id}`,
          {
            oldDescription,
            oldAmount,
            newDescription,
            newAmount: Number(newAmount),
            month: currentMonthYear,
          },
          { headers },
        );

        setFixedCosts((response.data?.remainingCosts || []) as FixedCost[]);
        notifyAlert("Custo editado com sucesso!", "green");
        setIsEditingCost(false);
        closeCostDetailModal();

        void fetchHasReports(currentMonthYear);
      } catch (error) {
        notifyAlert("Erro ao editar custo");
        // eslint-disable-next-line no-console
        console.log("error", error);
      }
    },
    [headers, id, currentMonthYear, closeCostDetailModal, fetchHasReports],
  );

  // =========================
  // Render
  // =========================
  if (loading) return <CircularProgress style={{ color: partnerColor() }} />;

  return (
    <section style={{ maxWidth: "400px", margin: "16px auto" }}>
      {/* Entradas Fixas */}
      <div
        onClick={toggleRevenue}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: "1px solid #f3f4f6",
          cursor: "pointer",
          transition: "all 0.2s ease",
          padding: "8px 0",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#f9fafb";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              color: "#374151",
              fontSize: "14px",
              fontWeight: "600",
              margin: 0,
            }}
            onClick={fetchStudents}
          >
            Entradas Fixas
          </div>

          {activeStudents.length > 0 && (
            <div
              style={{
                fontSize: "10px",
                color: "#9ca3af",
                backgroundColor: "#f9fafb",
                padding: "2px 6px",
                borderRadius: "6px",
                fontWeight: "500",
              }}
            >
              {activeStudents.length}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {activeStudents.length > 0 && (
            <div
              style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280" }}
            >
              R$ {formatNumber(monthlyRevenue)}
            </div>
          )}

          <div
            style={{
              fontSize: "14px",
              color: "#9ca3af",
              transform: revenueExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          >
            ▼
          </div>
        </div>
      </div>

      {revenueExpanded && (
        <div style={{ animation: "fadeIn 0.2s ease-in-out" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              padding: "12px 16px",
              margin: "auto",
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
              borderRadius: "6px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: "8px",
              }}
            >
              <div
                style={{
                  padding: "8px",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    color: partnerColor(),
                  }}
                >
                  R$ {formatNumber(monthlyRevenue)}
                </div>
                <div style={{ fontSize: "10px", color: "#666" }}>
                  Receita Total
                </div>
              </div>

              <div
                style={{
                  padding: "8px",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{ fontSize: "18px", fontWeight: "500", color: "#333" }}
                >
                  {activeStudents.length}
                </div>
                <div style={{ fontSize: "10px", color: "#666" }}>
                  Alunos Ativos/Com mensalidades contabilizadas
                </div>
              </div>
            </div>

            <div style={{ marginTop: "12px" }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#4b5563",
                  marginBottom: "6px",
                  padding: "6px 0",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Mensalidades ({students.length} total • {activeStudents.length}{" "}
                ativos/mensalidades contabilizadas)
              </div>

              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                }}
              >
                {sortedStudents.map((student) => (
                  <a
                    key={student.id}
                    href={`/students/${student.id}`}
                    
                    style={{
                      display: "flex",
                      gap: "8px",
                      textDecoration: "none",
                      justifyContent: "space-between",
                      padding: "8px",
                      borderBottom: "1px solid #eee",
                      alignItems: "center",
                      cursor: "pointer",
                      // backgroundColor: student.onHold  ?  partnerColor(): "#f8f8f8",
                      // color: student.onHold ?  "#eee":"white",
                      transition: "background-color 0.2s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flex: 1,
                      }}
                    >
                      <img
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          opacity: student.onHold ? 0.5 : 1,
                          display: isMobile ? "none" : "block",
                        }}
                        src={
                          student.picture ||
                          "https://ik.imagekit.io/vjz75qw96/logos/myp?updatedAt=1752031657485"
                        }
                        alt=""
                      />
                      <div
                        style={{
                          fontWeight: "500",
                          fontSize: "12px",
                          opacity: student.onHold ? 0.6 : 1,
                        }}
                      >
                        {student.name} {truncateString(student.lastname, 6)}
                      </div>
                    </div>

                    <div title={student.onHold ? "Matrícula trancada" : ""}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: "500",
                          color: student.onHold ? "#999" : partnerColor(),
                          textDecoration: student.onHold
                            ? "line-through"
                            : "none",
                        }}
                      >
                        R$ {formatNumber(student.fee ?? 0)}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {students.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "16px",
                  color: "#9ca3af",
                  fontSize: "11px",
                }}
              >
                Nenhum aluno encontrado
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custos Fixos */}
      <div
        onClick={toggleFixedCosts}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: "1px solid #f3f4f6",
          cursor: "pointer",
          transition: "all 0.2s ease",
          padding: "8px 0",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#f9fafb";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              color: "#374151",
              fontSize: "14px",
              fontWeight: "600",
              margin: 0,
            }}
          >
            Custos Fixos
          </div>

          {fixedCosts.length > 0 && (
            <div
              style={{
                fontSize: "10px",
                color: "#9ca3af",
                backgroundColor: "#f9fafb",
                padding: "2px 6px",
                borderRadius: "6px",
                fontWeight: "500",
              }}
            >
              {fixedCosts.length}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {fixedCosts.length > 0 && (
            <div
              style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280" }}
            >
              R$ {formatNumber(totalFixedCosts)}
            </div>
          )}

          <div
            style={{
              fontSize: "14px",
              color: "#9ca3af",
              transform: fixedCostsExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          >
            ▼
          </div>
        </div>
      </div>

      {fixedCostsExpanded && (
        <div style={{ animation: "fadeIn 0.2s ease-in-out" }}>
          <div
            style={{
              marginBottom: "12px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              title="Novo Custo Fixo"
              className="linguee-btn linguee-btn-ghost"
              onClick={(e) => {
                e.stopPropagation();
                openNewCostModal();
              }}
            >
              +
            </button>
          </div>

          {fixedCosts.length > 0 ? (
            <div>
              {sortedFixedCosts.map((cost, index) => (
                <div
                  key={cost.id || `${cost.description}-${index}`}
                  onClick={() => openCostDetailModal(cost)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom:
                      index < sortedFixedCosts.length - 1
                        ? "1px solid #f3f4f6"
                        : "none",
                    transition: "all 0.15s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f9fafb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "400",
                      color: "#4b5563",
                      lineHeight: "1.4",
                    }}
                  >
                    {cost.description}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#ef4444",
                    }}
                  >
                    R$ {formatNumber(cost.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "24px 16px",
                color: "#6b7280",
              }}
            >
              <div style={{ fontSize: "12px", lineHeight: "1.5" }}>
                Nenhum custo fixo
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL NOVO CUSTO FIXO */}
      <Dialog
        open={newCostModalOpen}
        onClose={closeNewCostModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{ style: { borderRadius: "6px", padding: "8px" } }}
      >
        <DialogTitle>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "16px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <h2
              style={{
                color: "#1f2937",
                fontSize: "18px",
                fontWeight: "500",
                margin: 0,
              }}
            >
              Novo Custo Mensal
            </h2>
            <button
              onClick={closeNewCostModal}
              style={{
                minWidth: "auto",
                padding: "8px",
                backgroundColor: partnerColor(),
                color: "white",
              }}
            >
              X
            </button>
          </div>
        </DialogTitle>
        {loadingNewCost ? (
          <CircularProgress style={{ color: partnerColor() }} />
        ) : (
          <>
            <DialogContent style={{ padding: "24px 24px 16px" }}>
              <div className="linguee-form-group">
                <label className="linguee-label">
                  Mês:{" "}
                  {new Date().toLocaleDateString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  })}
                </label>
              </div>

              <div className="linguee-form-group">
                <label className="linguee-label linguee-label-required">
                  Descrição
                </label>
                <input
                  type="text"
                  className="linguee-input linguee-input-text"
                  value={newCostDescription}
                  onChange={(e) => setNewCostDescription(e.target.value)}
                  placeholder="Ex: Aluguel, Energia, Internet..."
                />
                {isDuplicateCostName && (
                  <div className="linguee-error-text">
                    Já existe um custo com esta descrição
                  </div>
                )}
              </div>

              <div className="linguee-form-group">
                <label className="linguee-label linguee-label-required">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  className="linguee-input linguee-input-number"
                  value={newCostAmount ? Math.abs(Number(newCostAmount)) : ""}
                  onChange={(e) => setNewCostAmount(e.target.value)}
                  placeholder="0,00"
                  min={0}
                  step={0.01}
                />
              </div>
            </DialogContent>

            {/* {hasReportsThisMonth && ( */}
            <DialogContent>
              <div
                onClick={() => setIncludeThisMonth((v) => !v)}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
                className="linguee-form-group"
              >
                <input
                  type="checkbox"
                  className="linguee-input linguee-input-checkbox"
                  checked={includeThisMonth}
                  onChange={() => setIncludeThisMonth((v) => !v)}
                  style={{
                    display: "none",
                  }}
                />
                <label
                  style={{
                    fontSize: "16px",
                    backgroundColor: includeThisMonth ? "green" : "red",
                    color: "white",
                    padding: "2px 4px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Incluir este mês?{" "}
                  {includeThisMonth && isArthurVincent ? "Sim" : "Não"}
                </label>
              </div>
            </DialogContent>
            {/* )} */}

            <DialogActions
              style={{
                padding: "16px 24px 24px",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                style={{
                  backgroundColor: partnerColor(),
                  color: "white",
                }}
                className="linguee-btn"
                onClick={closeNewCostModal}
              >
                Cancelar
              </button>
              <button
                className={`linguee-btn ${!isSaveCostDisabled ? "linguee-btn-primary" : ""}`}
                onClick={() => void createFixedCost("debt")}
                disabled={isSaveCostDisabled || loadingNewCost}
                style={{
                  backgroundColor:
                    isSaveCostDisabled || loadingNewCost
                      ? "#9ca3af"
                      : partnerColor(),
                  color:
                    isSaveCostDisabled || loadingNewCost ? "#333" : "white",
                  cursor:
                    isSaveCostDisabled || loadingNewCost
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {isDuplicateCostName
                  ? "Nome já existe"
                  : loadingNewCost
                    ? "Carregando..."
                    : "Adicionar Custo"}
              </button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* MODAL DETALHES DO CUSTO */}
      <Dialog
        open={costDetailModalOpen}
        onClose={closeCostDetailModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{ style: { borderRadius: "6px", padding: "8px" } }}
      >
        <DialogTitle>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "16px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                color: "#1f2937",
                fontSize: "16px",
                fontWeight: "500",
                margin: 0,
              }}
            >
              Detalhes do Custo
            </div>
            <button
              onClick={closeCostDetailModal}
              style={{
                minWidth: "auto",
                padding: "8px",

                backgroundColor: partnerColor(),
                color: "white",
              }}
            >
              X
            </button>
          </div>
        </DialogTitle>

        <DialogContent style={{ padding: "24px 24px 16px" }}>
          {selectedCost && !showDeleteConfirmation && !isEditingCost && (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    color: "#6b7280",
                    fontSize: "12px",
                    marginBottom: "4px",
                  }}
                >
                  Descrição
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    color: "#374151",
                    fontWeight: "500",
                  }}
                >
                  {selectedCost.description}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    color: "#6b7280",
                    fontSize: "12px",
                    marginBottom: "4px",
                  }}
                >
                  Valor
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    color: "#ef4444",
                    fontWeight: "600",
                  }}
                >
                  R$ {formatNumber(selectedCost.amount)}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    color: "#6b7280",
                    fontSize: "12px",
                    marginBottom: "4px",
                  }}
                >
                  Mês
                </div>
                <div style={{ fontSize: "14px", color: "#374151" }}>
                  {selectedCost.month || currentMonthYear}
                </div>
              </div>
            </div>
          )}

          {selectedCost && isEditingCost && !showDeleteConfirmation && (
            <div>
              <div className="linguee-form-group">
                <label className="linguee-label">Descrição</label>
                <input
                  type="text"
                  className="linguee-input linguee-input-text"
                  value={editCostDescription}
                  onChange={(e) => setEditCostDescription(e.target.value)}
                  placeholder="Descrição do custo"
                />
              </div>

              <div className="linguee-form-group">
                <label className="linguee-label">Valor (R$)</label>
                <input
                  type="number"
                  className="linguee-input linguee-input-number"
                  value={
                    editCostAmount && !Number.isNaN(Number(editCostAmount))
                      ? Math.abs(Number(editCostAmount))
                      : ""
                  }
                  onChange={(e) => setEditCostAmount(e.target.value)}
                  placeholder="0,00"
                  min={0}
                  step={0.01}
                />
              </div>
            </div>
          )}

          {showDeleteConfirmation && selectedCost && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div
                style={{
                  fontSize: "18px",
                  color: "#ef4444",
                  fontWeight: "500",
                  marginBottom: "16px",
                }}
              >
                Tem certeza que deseja excluir?
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: "8px",
                }}
              >
                Esta ação não pode ser desfeita.
              </div>
              <div
                style={{
                  fontSize: "16px",
                  color: "#374151",
                  fontWeight: "500",
                }}
              >
                <strong>{selectedCost.description}</strong> - R${" "}
                {formatNumber(selectedCost.amount)}
              </div>
            </div>
          )}
        </DialogContent>

        <DialogActions
          style={{
            padding: "16px 24px 24px",
            gap: "12px",
            justifyContent: "flex-end",
          }}
        >
          {!showDeleteConfirmation && !isEditingCost && (
            <>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={closeCostDetailModal}
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    textTransform: "none",
                    padding: "6px 12px",
                    backgroundColor: `${partnerColor()}30`,
                    color: "black",
                  }}
                >
                  Fechar
                </button>
                <button
                  onClick={() => setShowDeleteConfirmation(true)}
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    textTransform: "none",
                    padding: "6px 12px",
                    backgroundColor: "red",
                    color: "white",
                  }}
                >
                  Excluir
                </button>
                <button
                  onClick={() => setIsEditingCost(true)}
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    textTransform: "none",
                    padding: "6px 12px",
                    backgroundColor: partnerColor(),
                    color: "white",
                  }}
                >
                  Editar
                </button>
              </div>
            </>
          )}

          {isEditingCost && !showDeleteConfirmation && (
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => {
                  setIsEditingCost(false);
                  if (selectedCost) {
                    setEditCostDescription(selectedCost.description);
                    setEditCostAmount(String(selectedCost.amount ?? "0"));
                  }
                }}
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  textTransform: "none",
                  backgroundColor: `${partnerColor()}30`,
                  color: "black",
                  padding: "6px 16px",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() =>
                  selectedCost &&
                  void updateCost(
                    selectedCost.description,
                    selectedCost.amount,
                    editCostDescription,
                    editCostAmount,
                  )
                }
                disabled={!editCostDescription.trim() || !editCostAmount}
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  textTransform: "none",
                  padding: "6px 16px",
                  backgroundColor:
                    !editCostDescription.trim() || !editCostAmount
                      ? "#9ca3af"
                      : partnerColor(),
                  color: "white",
                  cursor:
                    !editCostDescription.trim() || !editCostAmount
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                Salvar
              </button>
            </div>
          )}

          {showDeleteConfirmation && (
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  textTransform: "none",
                  backgroundColor: partnerColor(),
                  color: "white",
                  padding: "6px 16px",
                }}
              >
                Não
              </button>
              <button
                onClick={() =>
                  selectedCost &&
                  void deleteCost(selectedCost.description, selectedCost.amount)
                }
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  textTransform: "none",
                  padding: "6px 16px",
                  backgroundColor: `${partnerColor()}30`,
                  color: "black",
                }}
              >
                Sim, excluir
              </button>
            </div>
          )}
        </DialogActions>
      </Dialog>
    </section>
  );
}

export default EntriesAndExits;
