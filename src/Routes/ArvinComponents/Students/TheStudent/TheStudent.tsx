// Routes/ArvinComponents/Students/StudentPage.tsx
import React, { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, useLocation, Link } from "react-router-dom";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { partnerColor } from "../../../../Styles/Styles";
import {
  MoneyIcon,
  UserCheckIcon,
  ChartBarIcon,
  GraduationCapIcon,
} from "@phosphor-icons/react";
import {
  menuItems,
  MenuItem,
} from "../../ArvinTopSideBar/SideDownBar/menuItems";
import { newArvinTitleStyle } from "../Students";

type StudentPageProps = {
  headers: MyHeadersType;
  isDesktop?: boolean;
};

type TutoringDay = {
  day: string;
  time: string;
  link: string;
  duration?: number;
  id: string;
  endDate: string;
};

type FinancialReport = {
  _id: string;
  studentId: string;
  description: string;
  typeOfItem: string;
  teacherId: string;
  paidFor: boolean;
  accountFor: boolean;
  amount: number;
  paidSoFar: number;
  month: string;
  discount: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

type StudentItem = {
  id: string;
  theId: string;
  username: string;
  permissions: string;
  supreme: boolean;
  name: string;
  lastname: string;
  fullname: string;
  email: string;
  doc: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  picture?: string;
  language: string;
  teacherID: string;
  lastClassId: string;
  level: string;
  weeklyClasses: number;
  tutoree: boolean;
  tutoringDays: TutoringDay[];
  totalScore: number;
  monthlyScore: number;
  homeworkAssignmentsDone: number;
  flashCards: any[];
  flashCardsReviewRate: number;
  flashCardsReviewsToday: number;
  flashcards25Reviews: number;
  flashcardsStreak: number;
  flashcardsLongestStreak: number;
  flashCardsTodayAccountedFor: boolean;
  lastDayFlashcardReview?: string;
  flashcardsStreakLastDay?: string;
  package1: boolean;
  package2: boolean;
  package3: boolean;
  classesToReplenish: number;
  replenishTarget: boolean;
  fee: number;
  feeUpToDate: boolean;
  creditCardPayment: boolean;
  paymentId: string;
  subscriptionAsaas: string;
  pagseguroSubscriptionCode: string;
  plan: string;
  promoCode: string;
  onHold: boolean;
  askedToCancel: boolean;
  limitDate: string;
  limitCancelDate: string;
  changedPasswordBeforeLogInAgain: boolean;
  googleDriveLink: string;
  createdAt: string;
  updatedAt: string;
  financialReports?: FinancialReport[];
};

const StudentPage: FC<StudentPageProps> = ({ headers, isDesktop }) => {
  const { studentId } = useParams<{ studentId: string }>();
  const location = useLocation();
  const [student, setStudent] = useState<StudentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!studentId) return;
    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `${backDomain}/api/v1/student/${studentId}`,
          { headers: headers as any }
        );
        setStudent(res.data.formattedStudentData as StudentItem);
      } catch (err) {
        console.error("Erro ao carregar aluno", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId, headers]);

  // fechar menu ao clicar fora / ESC
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [menuOpen]);

  // fecha o menu quando a rota muda
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div
        style={{
          padding: 16,
          fontFamily: "Plus Jakarta Sans",
        }}
      >
        Carregando aluno...
      </div>
    );
  }

  if (!student) {
    return (
      <div
        style={{
          padding: 16,
          fontFamily: "Plus Jakarta Sans",
        }}
      >
        Aluno não encontrado.
      </div>
    );
  }

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("pt-BR");
  };

  const formatDay = (day: string) => {
    const map: Record<string, string> = {
      Mon: "Seg",
      Tue: "Ter",
      Wed: "Qua",
      Thu: "Qui",
      Fri: "Sex",
      Sat: "Sáb",
      Sun: "Dom",
    };
    return map[day] || day;
  };

  const cardBase: React.CSSProperties = {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 18,
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
    border: "1px solid #E5E7EB",
  };

  const cardTitle: React.CSSProperties = {
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 700,
    fontSize: 14,
    color: "#111827",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  const pillStatus: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    color: partnerColor(),
  };

  const statCardBase: React.CSSProperties = {
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#EEF2FF",
    display: "grid",
    gap: 4,
  };

  const statLabel: React.CSSProperties = {
    fontSize: 11,
    color: "#4B5563",
    fontWeight: 500,
  };

  const statValue: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 700,
    color: "#111827",
  };

  const itemsForMenu: MenuItem[] = menuItems
    .filter((item) => !item.justBottom)
    .sort(
      (a, b) =>
        (a.orderSideBar || a.orderMobile || 0) -
        (b.orderSideBar || b.orderMobile || 0)
    );

  // ===== MOCK "Aulas de hoje" (arquitetura) =====
  const mockTodayClasses =
    student.tutoree && student.tutoringDays?.length
      ? student.tutoringDays.map((td) => ({
          id: td.id,
          title: "Tutoria de Inglês",
          time: td.time,
          day: formatDay(td.day),
          type: "Tutoria",
          status: "Agendada",
          link: td.link,
        }))
      : [];

  return (
    <div
      style={{
        margin: !isDesktop ? "0px" : "0px 16px 0px 0px",
      }}
    >
      {isDesktop && (
        <div
          style={{
            paddingTop: 29,
            paddingBottom: 17,
            display: "flex",
            alignItems: "center",
          }}
        >
          <section
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "8px",
              width: "100%",
              fontSize: "1.5rem",
            }}
          >
            <span style={newArvinTitleStyle}>
              {student.name + " " + student.lastname}
            </span>
          </section>
        </div>
      )}

      <div
        style={{
          fontFamily:
            "Plus Jakarta Sans, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          display: "grid",
          gridTemplateColumns: isDesktop ? "1fr 1fr 1fr" : "1fr",
          gap: 24,
        }}
      >
        {/* ================= COLUNA ESQUERDA ================= */}
        <div style={{ display: "grid", gap: 16 }}>
          {/* CARD PRINCIPAL DO ALUNO */}
          <div style={cardBase}>
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 8,
                  background:
                    "linear-gradient(135deg, #E0ECFF 0%, #F4E8FF 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {student.picture ? (
                  <img
                    src={student.picture}
                    alt={student.fullname}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      color: partnerColor(),
                    }}
                  >
                    {student.name?.[0]}
                  </span>
                )}
              </div>
              <div style={{ display: "grid", gap: 4, minWidth: 0 }}>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {student.fullname}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "#6B7280",
                  }}
                >
                  Plano {student.plan?.toUpperCase()} · Nível{" "}
                  {student.level || "-"}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "#9CA3AF",
                  }}
                >
                  ID: {student.id}
                </span>
              </div>
            </div>

            <div
              style={{
                marginTop: 8,
                paddingTop: 10,
                borderTop: "1px dashed #E5E7EB",
                display: "grid",
                gap: 8,
                fontSize: 13,
                color: "#4B5563",
              }}
            >
              <div style={{ display: "flex", gap: 8 }}>
                <span
                  style={{
                    width: 60,
                    fontWeight: 600,
                    color: "#9CA3AF",
                  }}
                >
                  Email
                </span>
                <span style={{ flex: 1 }}>{student.email}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span
                  style={{
                    width: 60,
                    fontWeight: 600,
                    color: "#9CA3AF",
                  }}
                >
                  Telefone
                </span>
                <span style={{ flex: 1 }}>{student.phoneNumber || "-"}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span
                  style={{
                    width: 60,
                    fontWeight: 600,
                    color: "#9CA3AF",
                  }}
                >
                  Endereço
                </span>
                <span style={{ flex: 1 }}>{student.address || "-"}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span
                  style={{
                    width: 60,
                    fontWeight: 600,
                    color: "#9CA3AF",
                  }}
                >
                  Idioma
                </span>
                <span style={{ flex: 1 }}>{student.language || "-"}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span
                  style={{
                    width: 60,
                    fontWeight: 600,
                    color: "#9CA3AF",
                  }}
                >
                  Drive
                </span>
                <span style={{ flex: 1 }}>
                  {student.googleDriveLink ? (
                    <a
                      href={student.googleDriveLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: partnerColor(),
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      Abrir pasta
                    </a>
                  ) : (
                    "-"
                  )}
                </span>
              </div>
            </div>

            <div
              style={{
                marginTop: 14,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                style={{
                  borderRadius: 8,
                  padding: "8px 16px",
                  border: "none",
                  backgroundColor: partnerColor(),
                  color: "#FFFFFF",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Editar aluno
              </button>
            </div>
          </div>

          {/* CARD – AULAS DE HOJE (MOCK) */}
          <div style={cardBase}>
            <div style={cardTitle}>
              <GraduationCapIcon size={18} weight="bold" color="#111827" />
              <span>Aulas de hoje</span>
            </div>

            {mockTodayClasses.length === 0 ? (
              <span
                style={{
                  fontSize: 13,
                  color: "#6B7280",
                }}
              >
                Nenhuma aula cadastrada para hoje. (Mock – depois conectar à
                API)
              </span>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: 10,
                  fontSize: 13,
                }}
              >
                {mockTodayClasses.map((cls) => (
                  <div
                    key={cls.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 10,
                      borderRadius: 8,
                      backgroundColor: "#F3F4FF",
                    }}
                  >
                    <div style={{ display: "grid", gap: 2 }}>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#111827",
                        }}
                      >
                        {cls.time} · {cls.type}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: "#6B7280",
                        }}
                      >
                        {cls.day} · Online
                      </span>
                    </div>
                    <span style={pillStatus}>{cls.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= COLUNA CENTRAL ================= */}
        <div style={{ display: "grid", gap: 16 }}>
          {/* FAIXA DE STATS (CARDS ROXOS) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 12,
            }}
          >
            <div style={statCardBase}>
              <span style={statLabel}>Score total</span>
              <span style={statValue}>{student.totalScore}</span>
            </div>
            <div style={statCardBase}>
              <span style={statLabel}>Score mensal</span>
              <span style={statValue}>{student.monthlyScore}</span>
            </div>
            <div style={statCardBase}>
              <span style={statLabel}>Lições feitas</span>
              <span style={statValue}>
                {student.homeworkAssignmentsDone || 0}
              </span>
            </div>
            <div style={statCardBase}>
              <span style={statLabel}>Reviews hoje</span>
              <span style={statValue}>
                {student.flashCardsReviewsToday || 0}
              </span>
            </div>
          </div>

          {/* CARD – SOBRE O ALUNO */}
          <div style={cardBase}>
            <div style={cardTitle}>
              <UserCheckIcon size={18} weight="bold" color="#111827" />
              <span>Sobre o aluno</span>
            </div>

            <div
              style={{
                display: "grid",
                gap: 12,
                fontSize: 13,
                color: "#4B5563",
              }}
            >
              <div>
                <strong style={{ fontSize: 12, color: "#9CA3AF" }}>
                  Descrição
                </strong>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    lineHeight: 1.5,
                  }}
                >
                  {student.fullname} é aluno do plano{" "}
                  {student.plan?.toUpperCase()} com {student.weeklyClasses || 0}{" "}
                  aula(s) por semana. Nível {student.level || "—"} e idioma de
                  estudo {student.language || "—"}.
                </p>
              </div>

              <div>
                <strong style={{ fontSize: 12, color: "#9CA3AF" }}>
                  Educação / Plano
                </strong>
                <ul
                  style={{
                    margin: "6px 0 0 16px",
                    padding: 0,
                    lineHeight: 1.5,
                  }}
                >
                  <li>Plano: {student.plan?.toUpperCase()}</li>
                  <li>Nível atual: {student.level || "—"}</li>
                  <li>Aulas semanais: {student.weeklyClasses || 0}</li>
                </ul>
              </div>

              <div>
                <strong style={{ fontSize: 12, color: "#9CA3AF" }}>
                  Experiências / Progresso
                </strong>
                <ul
                  style={{
                    margin: "6px 0 0 16px",
                    padding: 0,
                    lineHeight: 1.5,
                  }}
                >
                  <li>Total de pontos: {student.totalScore}</li>
                  <li>
                    Maior streak de flashcards:{" "}
                    {student.flashcardsLongestStreak || 0} dia(s)
                  </li>
                  <li>
                    Último dia de review:{" "}
                    {formatDate(student.lastDayFlashcardReview)}
                  </li>
                </ul>
              </div>

              <div>
                <strong style={{ fontSize: 12, color: "#9CA3AF" }}>
                  Informações financeiras
                </strong>
                <ul
                  style={{
                    margin: "6px 0 0 16px",
                    padding: 0,
                    lineHeight: 1.5,
                  }}
                >
                  <li>Mensalidade: R$ {student.fee}</li>
                  <li>
                    Fee em dia: {student.feeUpToDate ? "Sim ✅" : "Não ⚠️"}
                  </li>
                  <li>
                    Pagamento via cartão:{" "}
                    {student.creditCardPayment ? "Sim" : "Não"}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ================= COLUNA DIREITA ================= */}
        <div style={{ display: "grid", gap: 16 }}>
          {/* CARD: SCORES & FLASHCARDS */}
          <div style={cardBase}>
            <div style={cardTitle}>
              <ChartBarIcon size={18} weight="bold" color="#111827" />
              <span>Scores & Flashcards</span>
            </div>
            <div
              style={{
                display: "grid",
                gap: 6,
                fontSize: 13,
                color: "#4B5563",
              }}
            >
              <span>
                <strong>Total Score:</strong> {student.totalScore}
              </span>
              <span>
                <strong>Monthly Score:</strong> {student.monthlyScore}
              </span>
              <span>
                <strong>Lições feitas:</strong>{" "}
                {student.homeworkAssignmentsDone}
              </span>
              <span>
                <strong>Taxa de acerto (reviews):</strong>{" "}
                {student.flashCardsReviewRate}%
              </span>
              <span>
                <strong>Reviews hoje:</strong> {student.flashCardsReviewsToday}
              </span>
              <span>
                <strong>Streak atual:</strong> {student.flashcardsStreak} dia
                (s)
              </span>
              <span>
                <strong>Maior streak:</strong> {student.flashcardsLongestStreak}{" "}
                dia(s)
              </span>
            </div>
          </div>

          {/* CARD: FINANCIAL REPORTS */}
          <div style={cardBase}>
            <div style={cardTitle}>
              <MoneyIcon size={18} weight="bold" color="#111827" />
              <span>Financial Reports</span>
            </div>
            {student.financialReports && student.financialReports.length > 0 ? (
              <div
                style={{
                  width: "100%",
                  overflowX: "auto",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 12,
                    color: "#4A5568",
                    minWidth: 480,
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "6px 4px",
                          borderBottom: "2px solid #E2E8F0",
                        }}
                      >
                        Mês
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "6px 4px",
                          borderBottom: "2px solid #E2E8F0",
                        }}
                      >
                        Descrição
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "6px 4px",
                          borderBottom: "2px solid #E2E8F0",
                        }}
                      >
                        Valor
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "6px 4px",
                          borderBottom: "2px solid #E2E8F0",
                        }}
                      >
                        Pago
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "6px 4px",
                          borderBottom: "2px solid #E2E8F0",
                        }}
                      >
                        Criado em
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.financialReports.map((fr) => (
                      <tr key={fr._id}>
                        <td
                          style={{
                            padding: "6px 4px",
                            borderBottom: "1px solid #EDF2F7",
                          }}
                        >
                          {fr.month}
                        </td>
                        <td
                          style={{
                            padding: "6px 4px",
                            borderBottom: "1px solid #EDF2F7",
                          }}
                        >
                          {fr.description}
                        </td>
                        <td
                          style={{
                            padding: "6px 4px",
                            borderBottom: "1px solid #EDF2F7",
                          }}
                        >
                          R$ {fr.amount}
                        </td>
                        <td
                          style={{
                            padding: "6px 4px",
                            borderBottom: "1px solid #EDF2F7",
                          }}
                        >
                          {fr.paidFor ? "✅" : "⚠️"}
                        </td>
                        <td
                          style={{
                            padding: "6px 4px",
                            borderBottom: "1px solid #EDF2F7",
                          }}
                        >
                          {formatDate(fr.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <span
                style={{
                  fontSize: 13,
                  color: "#6B7280",
                }}
              >
                Nenhum lançamento financeiro registrado.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
