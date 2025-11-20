// Routes/ArvinComponents/Students/StudentPage.tsx
import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { partnerColor } from "../../../../Styles/Styles";
import {
  UserCircle,
  IdentificationBadge,
  ChartBar,
  Wallet,
  GraduationCap,
  CalendarDots,
  CalendarBlankIcon,
  MoneyIcon,
  UserCheckIcon,
  WalletIcon,
  ChartBarIcon,
  GraduationCapIcon,
} from "@phosphor-icons/react";

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
  const [student, setStudent] = useState<StudentItem | null>(null);
  const [loading, setLoading] = useState(true);


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

  return (
    <div
      style={{
        padding: 16,
        maxWidth: 1100,
        margin: "0 auto",
        fontFamily:
          "Plus Jakarta Sans, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* HEADER PRINCIPAL - FOTO + NOME */}
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          padding: 16,
          borderRadius: 16,
          borderLeft: `4px solid ${partnerColor()}`,
          backgroundColor: "#ffffff",
        }}
      >
        {student.picture && (
          <img
            src={student.picture}
            alt={student.fullname}
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              objectFit: "cover",
              border: `2px solid ${partnerColor()}`,
            }}
          />
        )}
        <div style={{ display: "grid", gap: 4 }}>
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#030303",
            }}
          >
            {student.fullname}
          </span>
          <span
            style={{
              fontSize: 13,
              color: "#606060",
              fontWeight: 500,
            }}
          >
            @{student.username} • {student.permissions} • Plano{" "}
            {student.plan?.toUpperCase()}
          </span>
          <span
            style={{
              fontSize: 12,
              color: "#808080",
            }}
          >
            Nível: <strong>{student.level}</strong> • Aulas semanais:{" "}
            <strong>{student.weeklyClasses}</strong> • Fee:{" "}
            <strong>R$ {student.fee}</strong>{" "}
            {student.feeUpToDate ? "✅ em dia" : "⚠️ em aberto"}
          </span>
        </div>
      </div>

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
          <div
            style={{
              ...cardContainerStyle,
              border: "2px solid #E5E7EB",
              padding: 16,
              borderRadius: 8,
            }}
          >
            <div
              style={{
                display: "grid",
                gap: 4,
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
          <div
            style={{
              ...cardContainerStyle,
              border: "2px solid #E5E7EB",
              padding: 16,
              borderRadius: 8,
            }}
          >
            <div
              style={{
                display: "grid",
                gap: 4,
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
                <strong>Homeworks feitos:</strong>{" "}
                {student.homeworkAssignmentsDone}
              </span>

              <hr style={{ margin: "8px 0", borderColor: "#E5E7EB" }} />

              <span>
                <strong>Review rate:</strong> {student.flashCardsReviewRate}
              </span>
              <span>
                <strong>Reviews hoje:</strong> {student.flashCardsReviewsToday}
              </span>
              <span>
                <strong>25+ Reviews:</strong> {student.flashcards25Reviews}
              </span>
              <span>
                <strong>Streak atual:</strong> {student.flashcardsStreak}
              </span>
              <span>
                <strong>Maior streak:</strong> {student.flashcardsLongestStreak}
              </span>
              <span>
                <strong>Último dia de review:</strong>{" "}
                {formatDate(student.lastDayFlashcardReview)}
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
          <div
            style={{
              ...cardContainerStyle,
              border: "2px solid #E5E7EB",
              padding: 16,
              borderRadius: 8,
            }}
          >
            <div
              style={{
                display: "grid",
                gap: 4,
                fontSize: 13,
                color: "#606060",
              }}
            >
              <span>
                <strong>Plano:</strong> {student.plan}
              </span>
              <span>
                <strong>Packages:</strong> {String(student.package1)} /{" "}
                {String(student.package2)} / {String(student.package3)}
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
              <span>
                <strong>On hold?</strong> {student.onHold ? "Sim" : "Não"}
              </span>
              <span>
                <strong>Pediu cancelamento?</strong>{" "}
                {student.askedToCancel ? "Sim" : "Não"}
              </span>
              <span>
                <strong>Limit Date:</strong> {formatDate(student.limitDate)}
              </span>
              <span>
                <strong>Limit Cancel Date:</strong>{" "}
                {formatDate(student.limitCancelDate)}
              </span>
              <span>
                <strong>Criado em:</strong> {formatDate(student.createdAt)}
              </span>
              <span>
                <strong>Atualizado em:</strong> {formatDate(student.updatedAt)}
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
          <div
            style={{
              ...cardContainerStyle,
              border: "2px solid #E5E7EB",
              padding: 16,
              borderRadius: 8,
            }}
          >
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
      </div>

      {/* CARD: FINANCIAL REPORTS */}
      <div>
        <span style={cardTitleStyle}>
          <span style={cardHeaderLeftStyle}>
            <MoneyIcon size={20} weight="bold" color={"#030303"} />
            <span style={cardTitleTextStyle}>Financial Reports</span>
          </span>
        </span>
        <div
          style={{
            ...cardContainerStyle,
            border: "2px solid #E5E7EB",
            padding: 16,
            borderRadius: 8,
          }}
        >
          {student.financialReports && student.financialReports.length > 0 ? (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
                color: "#4A5568",
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
  );
};

export default StudentPage;
