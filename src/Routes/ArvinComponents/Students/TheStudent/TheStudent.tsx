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
  WalletIcon,
  ChartBarIcon,
  GraduationCapIcon,
} from "@phosphor-icons/react";
import {
  menuItems,
  MenuItem,
} from "../../ArvinTopSideBar/SideDownBar/menuItems";

type StudentPageProps = {
  headers: MyHeadersType;
};

type TutoringDay = {
  day: string;
  time: string;
  link: string;
  duration: number;
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

const StudentPage: FC<StudentPageProps> = ({ headers }) => {
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
        console.log("Student raw:", res.data);
        setStudent(res.data.formattedStudentData as StudentItem);
      } catch (err) {
        console.error("Erro ao carregar aluno", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId, headers]);

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

  useEffect(() => {
    // fecha o menu quando a rota muda
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

  const cardTitleStyle: React.CSSProperties = {
    display: "flex",
    marginLeft: "4px",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  };

  const cardHeaderLeftStyle: React.CSSProperties = {
    display: "flex",
    gap: "8px",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: 600,
    color: "#030303",
    fontFamily: "Plus Jakarta Sans",
  };

  const cardTitleTextStyle: React.CSSProperties = {
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 700,
    fontSize: "15px",
    lineHeight: "100%",
    color: "#030303",
    letterSpacing: "0%",
  };

  const cardContainerStyle: React.CSSProperties = {
    marginTop: "16px",
    borderLeft: `4px solid ${partnerColor()}`,
    padding: "0px 12px 12px 12px",
  };

  const baseCardStyle: React.CSSProperties = {
    ...cardContainerStyle,
    border: "2px solid #E5E7EB",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
  };

  const menuBoxStyle: React.CSSProperties = {
    position: "absolute",
    top: 48,
    right: 16,
    minWidth: 220,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    border: "1px solid #E5E7EB",
    boxShadow:
      "0 18px 45px rgba(15, 23, 42, 0.17), 0 0 0 1px rgba(148, 163, 184, 0.2)",
    padding: 8,
    zIndex: 999,
  };

  const menuButtonStyle: React.CSSProperties = {
    borderRadius: 999,
    border: "1px solid #E5E7EB",
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "Plus Jakarta Sans",
    backgroundColor: "#F9FAFB",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
  };

  const topBarStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.94) 100%)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid #E5E7EB",
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  };

  const itemsForMenu: MenuItem[] = menuItems
    .filter((item) => !item.justBottom)
    .sort(
      (a, b) =>
        (a.orderSideBar || a.orderMobile || 0) -
        (b.orderSideBar || b.orderMobile || 0)
    );

  return (
    <div
      style={{
        padding: 0,
        maxWidth: 1100,
        margin: "0 auto",
        fontFamily:
          "Plus Jakarta Sans, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* TOPBAR FIXA */}
      <div style={topBarStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 0,
          }}
        >
          {student.picture && (
            <img
              src={student.picture}
              alt={student.fullname}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                objectFit: "cover",
                border: `2px solid ${partnerColor()}`,
                flexShrink: 0,
              }}
            />
          )}
          <div
            style={{
              display: "grid",
              gap: 2,
              minWidth: 0,
            }}
          >
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#030303",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {student.fullname}
            </span>
            <span
              style={{
                fontSize: 12,
                color: "#6B7280",
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {student.email}
            </span>
          </div>
        </div>
        <div
          style={{ position: "relative", display: "flex", gap: 8 }}
          ref={menuRef}
        >
          <button
            type="button"
            onClick={() => window.location.assign("/students")}
            style={menuButtonStyle}
          >
            Voltar aos Alunos
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            style={menuButtonStyle}
          >
            <span>Menu</span>
            <span
              style={{
                fontSize: 16,
                lineHeight: 1,
                transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.15s ease",
              }}
            >
              ▾
            </span>
          </button>

          {menuOpen && (
            <div style={menuBoxStyle}>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "grid",
                  gap: 2,
                }}
              >
                {itemsForMenu.map((item) => {
                  const isActive =
                    location.pathname === item.path ||
                    location.pathname.startsWith(item.path + "/");

                  return (
                    <li
                      style={{
                        listStyle: "none",
                      }}
                      key={item.path}
                    >
                      <Link
                        to={item.path}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "8px 10px",
                          borderRadius: 8,
                          textDecoration: "none",
                          fontSize: 13,
                          fontWeight: 500,
                          color: isActive ? "#0F172A" : "#4B5563",
                          backgroundColor: isActive
                            ? "rgba(59,130,246,0.08)"
                            : "transparent",
                        }}
                      >
                        <item.Icon
                          size={18}
                          weight="bold"
                          color={isActive ? partnerColor() : "#6B7280"}
                        />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL (cards) */}
      <div
        style={{
          padding: 16,
          paddingTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* GRID DOS CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {/* CARD: DADOS PRINCIPAIS */}
          <div>
            <span style={cardTitleStyle}>
              <span style={cardHeaderLeftStyle}>
                <UserCheckIcon size={20} weight="bold" color={"#030303"} />
                <span style={cardTitleTextStyle}>Dados principais</span>
              </span>
            </span>
            <div style={baseCardStyle}>
              <div
                style={{
                  display: "grid",
                  gap: 6,
                  fontSize: 13,
                  color: "#606060",
                }}
              >
                <span>
                  <strong>ID:</strong> {student.id}
                </span>
                <span>
                  <strong>Email:</strong> {student.email}
                </span>
                <span>
                  <strong>Telefone:</strong> {student.phoneNumber}
                </span>
                <span>
                  <strong>CPF/Doc:</strong> {student.doc}
                </span>
                <span>
                  <strong>Data de nascimento:</strong>{" "}
                  {formatDate(student.dateOfBirth)}
                </span>
                <span>
                  <strong>Endereço:</strong> {student.address}
                </span>
                <span>
                  <strong>Idioma:</strong> {student.language}
                </span>
                <span>
                  <strong>Teacher ID:</strong> {student.teacherID}
                </span>
                <span>
                  <strong>Google Drive:</strong>{" "}
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
                </span>
                <span>
                  <strong>Aulas semanais:</strong> {student.weeklyClasses}
                </span>
                <span>
                  <strong>Fee:</strong> R$ {student.fee}
                </span>
                <span>
                  <strong>Fee em dia?</strong>{" "}
                  {student.feeUpToDate ? "✅ Sim" : "⚠️ Não"}
                </span>
                <span>
                  <strong>Pagamento via cartão?</strong>{" "}
                  {student.creditCardPayment ? "Sim" : "Não"}
                </span>
              </div>
            </div>
          </div>

          {/* CARD: PLANO & STATUS */}
          <div>
            <span style={cardTitleStyle}>
              <span style={cardHeaderLeftStyle}>
                <WalletIcon size={20} weight="bold" color={"#030303"} />
                <span style={cardTitleTextStyle}>Plano & Status</span>
              </span>
            </span>
            <div style={baseCardStyle}>
              <div
                style={{
                  display: "grid",
                  gap: 6,
                  fontSize: 13,
                  color: "#606060",
                }}
              >
                <span>
                  <strong>Criado em:</strong> {formatDate(student.createdAt)}
                </span>
                <span>
                  <strong>Atualizado em:</strong>{" "}
                  {formatDate(student.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* CARD: SCORES & FLASHCARDS */}
          <div>
            <span style={cardTitleStyle}>
              <span style={cardHeaderLeftStyle}>
                <ChartBarIcon size={20} weight="bold" color={"#030303"} />
                <span style={cardTitleTextStyle}>Scores & Flashcards</span>
              </span>
            </span>
            <div style={baseCardStyle}>
              <div
                style={{
                  display: "grid",
                  gap: 6,
                  fontSize: 13,
                  color: "#606060",
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
                  <strong>Último dia de review:</strong>{" "}
                  {formatDate(student.lastDayFlashcardReview)}
                </span>
              </div>
            </div>
          </div>

          {/* CARD: TUTORIA */}
          <div>
            <span style={cardTitleStyle}>
              <span style={cardHeaderLeftStyle}>
                <GraduationCapIcon size={20} weight="bold" color={"#030303"} />
                <span style={cardTitleTextStyle}>Tutoria</span>
              </span>
            </span>
            <div style={baseCardStyle}>
              {student.tutoree && student.tutoringDays?.length > 0 ? (
                <ul
                  style={{
                    paddingLeft: 18,
                    margin: 0,
                    fontSize: 13,
                    color: "#606060",
                  }}
                >
                  {student.tutoringDays.map((td) => (
                    <li key={td.id} style={{ marginBottom: 6 }}>
                      <strong>{td.day}</strong> às <strong>{td.time}</strong> —{" "}
                      {td.duration} min •{" "}
                      <a
                        href={td.link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: partnerColor(),
                          textDecoration: "none",
                          fontWeight: 600,
                        }}
                      >
                        Link da aula
                      </a>{" "}
                      • até {formatDate(td.endDate)}
                    </li>
                  ))}
                </ul>
              ) : (
                <span
                  style={{
                    fontSize: 13,
                    color: "#606060",
                  }}
                >
                  Nenhum dia de tutoria cadastrado.
                </span>
              )}
            </div>
          </div>

          {/* CARD: FINANCIAL REPORTS (full width) */}
          <div style={{ gridColumn: "1 / -1" }}>
            <span style={cardTitleStyle}>
              <span style={cardHeaderLeftStyle}>
                <MoneyIcon size={20} weight="bold" color={"#030303"} />
                <span style={cardTitleTextStyle}>Financial Reports</span>
              </span>
            </span>
            <div style={baseCardStyle}>
              {student.financialReports &&
              student.financialReports.length > 0 ? (
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
                              borderBottom: "2px solid #EDF2F7",
                            }}
                          >
                            {fr.month}
                          </td>
                          <td
                            style={{
                              padding: "6px 4px",
                              borderBottom: "2px solid #EDF2F7",
                            }}
                          >
                            {fr.description}
                          </td>
                          <td
                            style={{
                              padding: "6px 4px",
                              borderBottom: "2px solid #EDF2F7",
                            }}
                          >
                            R$ {fr.amount}
                          </td>
                          <td
                            style={{
                              padding: "6px 4px",
                              borderBottom: "2px solid #EDF2F7",
                            }}
                          >
                            {fr.paidFor ? "✅" : "⚠️"}
                          </td>
                          <td
                            style={{
                              padding: "6px 4px",
                              borderBottom: "2px solid #EDF2F7",
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
                    color: "#606060",
                  }}
                >
                  Nenhum lançamento financeiro registrado.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
