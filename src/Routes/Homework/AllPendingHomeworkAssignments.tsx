import React, { useEffect, useState } from "react";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import Helmets from "../../Resources/Helmets";
import { createPortal } from "react-dom";
import { useParams } from "react-router-dom";
import {
  backDomain,
  formatDateBr,
  updateInfo,
} from "../../Resources/UniversalComponents";
import axios from "axios";
import { listOfCriteria } from "../Ranking/RankingComponents/ListOfCriteria";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import { partnerColor } from "../../Styles/Styles";
import { notifyAlert } from "../EnglishLessons/Assets/Functions/FunctionLessons";
import { CircularProgress } from "@mui/material";
import { newArvinTitleStyle } from "../ArvinComponents/NewHomePageArvin/NewHomePageArvin";
import {
  cardBase,
  cardTitle,
  pillStatus,
} from "../ArvinComponents/Students/TheStudent/types/studentPage.styles";

interface AllPendingHomeworkAssignmentsProps {
  headers: MyHeadersType | null;
  setChange: any;
  change: boolean;
  isDesktop: boolean;
}

type PaginationState = {
  page: number;
  limit: number;
  tutoring: { total: number; totalPages: number };
  groupclass: { total: number; totalPages: number };
};

export default function AllPendingHomeworkAssignments({
  headers,
  setChange,
  change,
  isDesktop,
}: AllPendingHomeworkAssignmentsProps) {
  const { studentId } = useParams<{ studentId: string }>();

  const [tutoringList, setTutoringList] = useState<any[]>([]);
  const [groupClassList, setGroupClassList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ID, setID] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [myPermissions, setPermissions] = useState<string>("");
  const [studentName, setStudentName] = useState<string>("");

  const { UniversalTexts } = useUserContext();

  const actualHeaders = headers || {};
  const pointsMadeHW = listOfCriteria[0].score[0].score;

  // ✅ Paginação
  const LIMIT = 10;
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: LIMIT,
    tutoring: { total: 0, totalPages: 1 },
    groupclass: { total: 0, totalPages: 1 },
  });

  const fetchHWPendingAll = async (loggedId: string, pageToFetch: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/homework-pending-all/${loggedId}?page=${pageToFetch}&limit=${LIMIT}`,
        { headers: actualHeaders },
      );

      setTutoringList(response.data.tutoringHomeworkList || []);
      setGroupClassList(response.data.groupClassHomeworkList || []);
      setStudentName(response.data.studentName || "");
      setPagination(
        response.data.pagination || {
          page: pageToFetch,
          limit: LIMIT,
          tutoring: { total: 0, totalPages: 1 },
          groupclass: { total: 0, totalPages: 1 },
        },
      );
    } catch (error) {
      console.log(error, "erro ao listar homework pendentes (all)");
    } finally {
      setLoading(false);
    }
  };

  const updateRealizedClass = async (tutoringId: string, score: number) => {
    setDisabled(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/homework/${studentId || ID}`,
        { tutoringId, score },
        { headers: actualHeaders },
      );
      setChange(!change);
      if (ID) fetchHWPendingAll(ID, page);
    } catch (error) {
      notifyAlert("Erro ao encontrar alunos");
    } finally {
      setDisabled(false);
    }
  };

  const handleReturnToPending = async (tutoringId: string) => {
    setDisabled(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/homework-return-pending/${studentId || ID}`,
        { tutoringId },
        { headers: actualHeaders },
      );
      setChange(!change);
      if (ID) fetchHWPendingAll(ID, page);
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorFindingStudents || "Erro ao encontrar alunos",
      );
    } finally {
      setDisabled(false);
    }
  };

  const justStatus = async (tutoringId: string) => {
    try {
      await axios.put(
        `${backDomain}/api/v1/homeworkjuststatus/${studentId || ID}`,
        { tutoringId },
        { headers: actualHeaders },
      );
      setChange(!change);
      if (ID) fetchHWPendingAll(ID, page);
    } catch (error) {
      notifyAlert(
        UniversalTexts?.errorFindingStudents || "Erro ao encontrar alunos",
      );
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [homeworkToDelete, setHomeworkToDelete] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const openDeleteModal = (homeworkId: string) => {
    setHomeworkToDelete(homeworkId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setHomeworkToDelete("");
    setIsDeleteModalOpen(false);
  };

  const deleteHomework = async (id: string) => {
    try {
      setIsDeleting(true);
      await axios.delete(`${backDomain}/api/v1/homework/${id}`, {
        headers: actualHeaders,
      });
      notifyAlert("Homework deletado com sucesso.", "green");

      // Se deletou o último item da página e sobrou página vazia, volta uma página
      const isLastItemOnPage =
        tutoringList.length + groupClassList.length === 1 && page > 1;

      const nextPage = isLastItemOnPage ? page - 1 : page;
      setPage(nextPage);

      if (ID) fetchHWPendingAll(ID, nextPage);
    } catch (error) {
      notifyAlert("Erro ao encontrar alunos");
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  useEffect(() => {
    const getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const { id, permissions } = getLoggedUser;

    setID(id);
    updateInfo(id, actualHeaders);
    setPermissions(permissions);
  }, []);

  useEffect(() => {
    if (ID) fetchHWPendingAll(ID, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ID, page, change]);

  const isAllowed =
    myPermissions === "superadmin" || myPermissions === "teacher";

  const totalPages = Math.max(
    pagination?.tutoring?.totalPages || 1,
    pagination?.groupclass?.totalPages || 1,
  );

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div style={{ margin: !isDesktop ? "0px" : "0px 16px 0px 0px" }}>
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
              Homeworks pendentes (todos os alunos) — {studentName}
            </span>
          </section>
        </div>
      )}

      <div
        style={{
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 600,
          fontStyle: "SemiBold",
          fontSize: "14px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          width: "95%",
          border: "1px solid #e8eaed",
          padding: "10px",
        }}
      >
        {isAllowed && (
          <div
            style={{
              marginTop: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* (Novo Homework removido) */}
          </div>
        )}

        <Helmets text={`Homeworks pendentes - ${studentName}`} />

        {/* ✅ CONTROLES DE PAGINAÇÃO */}
        {!loading && totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>
              Página {page} de {totalPages} • {pagination?.tutoring?.total || 0}{" "}
              tutoring • {pagination?.groupclass?.total || 0} groupclass
            </span>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                disabled={!canGoPrev}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid #E5E7EB",
                  backgroundColor: "#FFF",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: canGoPrev ? "pointer" : "not-allowed",
                  opacity: canGoPrev ? 1 : 0.5,
                }}
              >
                Anterior
              </button>

              <button
                type="button"
                disabled={!canGoNext}
                onClick={() => setPage((p) => p + 1)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid #E5E7EB",
                  backgroundColor: "#FFF",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: canGoNext ? "pointer" : "not-allowed",
                  opacity: canGoNext ? 1 : 0.5,
                }}
              >
                Próxima
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <CircularProgress style={{ color: partnerColor() }} />
        ) : (
          <div style={{ marginTop: 16 }}>
            {tutoringList.length === 0 && groupClassList.length === 0 ? (
              <p
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: 400,
                  fontSize: 13,
                  color: "#6B7280",
                }}
              >
                Nenhum homework pendente encontrado.
              </p>
            ) : (
              <>
                {tutoringList.map((hw: any) => {
                  const isDone = hw.status === "done";
                  const eventId = hw?.eventDetails?.id || hw?.eventID;
                  const cardStudentName = hw?.eventDetails?.studentName || "";

                  return hw.description ? (
                    <div
                      key={hw._id}
                      style={{ ...cardBase, padding: 14, marginBottom: 10 }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span
                            style={{
                              ...cardTitle,
                              marginBottom: 2,
                              fontSize: 13,
                            }}
                          >
                            {cardStudentName ? (
                              <span style={cardTitle}>{cardStudentName}</span>
                            ) : null}
                            {hw.dueDate ? (
                              <span style={{ marginLeft: 8 }}>
                                Entrega em: {formatDateBr(hw.dueDate)}
                              </span>
                            ) : null}
                          </span>

                          {hw.assignmentDate && (
                            <span
                              style={{
                                fontSize: 11,
                                color: "#6B7280",
                                fontWeight: 500,
                              }}
                            >
                              Atribuído em: {formatDateBr(hw.assignmentDate)}
                            </span>
                          )}
                        </div>

                        <span
                          style={{
                            ...pillStatus,
                            backgroundColor: isDone ? "#e6f4ea" : "#fff7e6",
                            color: isDone ? "#137333" : "#92400e",
                          }}
                        >
                          {isDone ? "Concluído" : "Pendente"}
                        </span>
                      </div>

                      {isAllowed && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 8,
                            marginTop: 4,
                          }}
                        >
                          {isDone ? (
                            <button
                              type="button"
                              disabled={disabled}
                              onClick={() => handleReturnToPending(hw._id)}
                              style={{
                                padding: "6px 10px",
                                borderRadius: 6,
                                border: "1px solid #E5E7EB",
                                backgroundColor: "#F9FAFB",
                                fontSize: 12,
                                fontWeight: 500,
                                cursor: disabled ? "not-allowed" : "pointer",
                              }}
                            >
                              Marcar como pendente
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={disabled}
                              onClick={() =>
                                updateRealizedClass(hw._id, pointsMadeHW)
                              }
                              style={{
                                padding: "6px 10px",
                                borderRadius: 6,
                                border: "1px solid #E5E7EB",
                                backgroundColor: "#F9FAFB",
                                fontSize: 12,
                                fontWeight: 500,
                                cursor: disabled ? "not-allowed" : "pointer",
                              }}
                            >
                              Marcar como feito
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => justStatus(hw._id)}
                            style={{
                              padding: "6px 10px",
                              borderRadius: 6,
                              border: "1px solid #E5E7EB",
                              backgroundColor: "#FFF",
                              fontSize: 12,
                              fontWeight: 500,
                              cursor: "pointer",
                            }}
                          >
                            Só mudar status
                          </button>

                          <button
                            type="button"
                            onClick={() => openDeleteModal(hw._id)}
                            style={{
                              padding: "6px 10px",
                              borderRadius: 6,
                              border: "1px solid #FCA5A5",
                              backgroundColor: "#FEF2F2",
                              fontSize: 12,
                              fontWeight: 500,
                              cursor: "pointer",
                              color: "#B91C1C",
                            }}
                          >
                            Excluir
                          </button>
                        </div>
                      )}

                      <div
                        style={{
                          fontFamily: "Plus Jakarta Sans",
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#111827",
                          marginBottom: 10,
                        }}
                      >
                        <div
                          style={{ color: "#333", lineHeight: "1.4" }}
                          dangerouslySetInnerHTML={{ __html: hw.description }}
                        />
                      </div>

                      {eventId && (
                        <a
                          href={`/my-calendar/event/${eventId}`}
                          style={{
                            marginTop: 14,
                            display: "block",
                            fontWeight: 700,
                            textAlign: "right",
                            color: partnerColor(),
                            textDecoration: "none",
                            fontSize: 12,
                            textTransform: "uppercase",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          Acessar{" "}
                          <i
                            style={{ marginLeft: 8 }}
                            className="fa fa-chevron-right"
                          />
                        </a>
                      )}
                    </div>
                  ) : null;
                })}

                {/* Se quiser paginar/renderizar groupClassList aqui também, basta mapear igual acima */}
              </>
            )}
          </div>
        )}

        {isDeleteModalOpen &&
          createPortal(
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10000,
                padding: "0 8px",
              }}
              onClick={closeDeleteModal}
            >
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 20,
                  maxWidth: 400,
                  width: "100%",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2
                  style={{
                    margin: 0,
                    marginBottom: 12,
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  Confirmar exclusão
                </h2>

                <p
                  style={{
                    margin: 0,
                    marginBottom: 20,
                    fontSize: 14,
                    color: "#4B5563",
                  }}
                >
                  Tem certeza de que deseja excluir este homework? Esta ação não
                  pode ser desfeita.
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                  }}
                >
                  <button
                    onClick={closeDeleteModal}
                    style={{
                      backgroundColor: "transparent",
                      color: "#374151",
                      border: "1px solid #D1D5DB",
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={() => deleteHomework(homeworkToDelete)}
                    disabled={isDeleting}
                    style={{
                      backgroundColor: isDeleting ? "#FCA5A5" : "#DC2626",
                      color: "#FFF",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 6,
                      fontSize: 13,
                      cursor: isDeleting ? "not-allowed" : "pointer",
                    }}
                  >
                    {isDeleting ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )}
      </div>
    </div>
  );
}
