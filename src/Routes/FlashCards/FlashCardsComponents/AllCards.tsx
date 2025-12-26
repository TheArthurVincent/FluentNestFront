import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  backDomain,
  formatDate,
  onLoggOut,
  Xp,
} from "../../../Resources/UniversalComponents";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import { CircularProgress } from "@mui/material";
import { languages } from "./AddFlashONEFlashCard";
import { readText } from "../../EnglishLessons/Assets/Functions/FunctionLessons";
import { partnerColor } from "../../../Styles/Styles";
import Voice from "../../../Resources/Voice";
import { useUserContext } from "../../../Application/SelectLanguage/SelectLanguage";
import { HOne } from "../../../Resources/Components/RouteBox";
import { createPortal } from "react-dom";

var AllCards = ({
  headers,
  selectedStudentId,
}: {
  headers: MyHeadersType | null;
  selectedStudentId: string;
}) => {
  var actualHeaders = headers || {};
  const { UniversalTexts } = useUserContext();

  var [cards, setCards] = useState<any[]>([]);
  var [loading, setLoading] = useState<boolean>(true);
  var [showModal, setShowModal] = useState<boolean>(false);
  var [newFront, setNewFront] = useState<string>("");
  var [newBack, setNewBack] = useState<string>("");
  var [newLGFront, setNewLGFront] = useState<string>("");
  var [newLGBack, setNewLGBack] = useState<string>("");
  var [cardIdToEdit, setCardIdToEdit] = useState<string>("");
  var [search, setSearch] = useState<string>("");
  var [newBackComments, setNewBackComments] = useState<string>("");
  var [page, setPage] = useState(0);
  var [hasMore, setHasMore] = useState(true);

  var fetchMoreCards = async (isReset: boolean = false): Promise<void> => {
    var currentPage = isReset ? 0 : page;
    if (!selectedStudentId) return;
    if (search && !isReset) return;
    if (!hasMore && !isReset) return;

    if (isReset) {
      setCards([]);
      setPage(0);
      setHasMore(!search);
    }

    setLoading(true);
    try {
      var response = await axios.get(
        `${backDomain}/api/v1/cards/${selectedStudentId}?skip=${
          currentPage * 10
        }&limit=10&search=${search}`,
        {
          headers: actualHeaders,
        }
      );

      var newCards = response.data.allFlashCards;
      if (newCards.length === 0) {
        setHasMore(false);
      } else {
        setCards((prev) => (isReset ? newCards : [...prev, ...newCards]));
        setPage((prev) => (isReset ? 1 : prev + 1));
        if (search) setHasMore(false);
      }
    } catch (error) {
      console.error("Erro ao carregar flashcards", error);
    } finally {
      setLoading(false);
    }
  };

  var searchCards = (query: string) => {
    setSearch(query);
  };

  useEffect(() => {
    if (selectedStudentId) {
      fetchMoreCards(true);
    }
  }, [search, selectedStudentId]);

  var scrollRef = useRef<HTMLDivElement>(null);

  var handleScroll = () => {
    var element = scrollRef.current;
    if (!element || loading || !hasMore) return;

    var isBottom =
      element.scrollTop + element.clientHeight + 1 >= element.scrollHeight;

    if (isBottom && !search) {
      fetchMoreCards();
    }
  };

  const [loadingModal, setLoadingModal] = useState<boolean>(false);

  var handleSeeModal = async (cardId: string) => {
    setShowModal(true);
    setLoadingModal(true);
    try {
      var response = await axios.get(
        `${backDomain}/api/v1/flashcardfindone/${selectedStudentId}`,
        {
          params: { cardId },
          headers: actualHeaders,
        }
      );
      var newf = response.data.flashcard.front.text;
      var newb = response.data.flashcard.back.text;
      var newlf = response.data.flashcard.front.language;
      var newlb = response.data.flashcard.back.language;
      var newIDcard = response.data.flashcard._id;
      var newComments = response.data.flashcard.backComments;

      setNewBackComments(newComments);
      setNewFront(newf);
      setNewBack(newb);
      setNewLGFront(newlf);
      setNewLGBack(newlb);
      setCardIdToEdit(newIDcard);
      setLoadingModal(false);
    } catch (error) {
      console.log(error, "Erro ao obter cards");
      onLoggOut();
    }
  };

  var handleEditCard = async (cardId: string) => {
    setLoadingModal(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/flashcard/${selectedStudentId}`,
        {
          newFront,
          newBack,
          newLGBack,
          newLGFront,
          newBackComments,
        },
        {
          params: { cardId },
          headers: actualHeaders,
        }
      );
      await fetchMoreCards(true);
      setShowModal(false);
    } catch (error) {
      console.log(error, "Erro ao editar card");
      onLoggOut();
    } finally {
      setLoadingModal(false);
    }
  };

  var handleDeleteCard = async (cardId: string) => {
    setLoadingModal(true);
    try {
      await axios.delete(
        `${backDomain}/api/v1/flashcard/${selectedStudentId}`,
        {
          params: { cardId },
          headers: actualHeaders,
        }
      );
      await fetchMoreCards(true);
      setShowModal(false);
    } catch (error) {
      console.log(error, "Erro ao apagar cards");
      onLoggOut();
    } finally {
      setLoadingModal(false);
    }
  };

  var handleHideModal = () => {
    setShowModal(false);
  };

  var [selectedVoice, setSelectedVoice] = useState<any>("");
  var [changeNumber, setChangeNumber] = useState<boolean>(true);

  useEffect(() => {
    var storedVoice = localStorage.getItem("chosenVoice");
    setSelectedVoice(storedVoice);
  }, [selectedVoice, changeNumber]);

  useEffect(() => {
    var element = scrollRef.current;
    if (element && element.scrollHeight <= element.clientHeight) {
      fetchMoreCards();
    }
  }, [cards]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "640px",
          margin: "0 auto",
          padding: "1rem 0.5rem",
        }}
      >
        {/* Header de controles */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            marginBottom: "0.75rem",
          }}
        >
          <button
            onClick={() => fetchMoreCards(true)}
            style={{
              borderRadius: 999,
              fontSize: "11px",
              padding: "4px 8px",
              height: "28px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#f8fafc",
              cursor: "pointer",
            }}
          >
            <i className="fa fa-refresh" aria-hidden="true" />
          </button>
          <Voice changeB={changeNumber} setChangeB={setChangeNumber} />
          <input
            style={{
              borderRadius: 999,
              border: "1px solid #e2e8f0",
              backgroundColor: "#f8fafc",
              fontSize: "11px",
              fontWeight: "400",
              color: "#64748b",
              padding: "4px 10px",
              height: "28px",
              minWidth: "140px",
              outline: "none",
            }}
            type="text"
            placeholder={UniversalTexts.search}
            onChange={(e) => searchCards(e.target.value)}
          />
        </div>

        {/* Lista de cards */}
        {loading && cards.length === 0 ? (
          <CircularProgress style={{ color: partnerColor() }} />
        ) : (
          <div
            className="flashcard-history-list"
            style={{
              width: "100%",
              maxWidth: "560px",
            }}
          >
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              style={{
                maxHeight: "60vh",
                overflowY: "auto",
                padding: "8px",
              }}
            >
              {cards.map((card: any, index: number) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "0.75rem",
                    borderRadius: 10,
                    overflow: "hidden",
                    boxShadow: "0 6px 16px rgba(15,23,42,0.06)",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      backgroundColor: "#f8fafc",
                      borderBottom: "1px solid #e2e8f0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      Flashcard #{index + 1}
                    </span>
                    <button
                      onClick={() => handleSeeModal(card._id)}
                      style={{
                        fontSize: "11px",
                        padding: "3px 8px",
                        height: "24px",
                        borderRadius: 999,
                        border: "1px solid #e2e8f0",
                        backgroundColor: "#fff7ed",
                        cursor: "pointer",
                        color: "#c2410c",
                      }}
                    >
                      <i className="fa fa-edit" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: "0.75rem 1rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "0.5rem",
                        gap: "0.75rem",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            marginBottom: "0.5rem",
                            fontSize: "14px",
                          }}
                          dangerouslySetInnerHTML={{ __html: card.front.text }}
                        />
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#64748b",
                          }}
                          dangerouslySetInnerHTML={{ __html: card.back.text }}
                        />
                        {card.backComments && (
                          <div
                            style={{
                              fontStyle: "italic",
                              fontSize: "12px",
                              color: "#94a3b8",
                              marginTop: "0.25rem",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: card.backComments,
                            }}
                          />
                        )}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "0.25rem",
                          flexDirection: "column",
                          alignItems: "flex-end",
                        }}
                      >
                        {card.front.language &&
                          card.front.language !== "pt" && (
                            <button
                              className="audio-button"
                              onClick={() =>
                                readText(
                                  card.front.text,
                                  true,
                                  card.front.language,
                                  selectedVoice
                                )
                              }
                              style={{
                                background: "#ffffff",
                                border: "1px solid #e2e8f0",
                                borderRadius: 999,
                                padding: "4px 6px",
                                cursor: "pointer",
                                fontSize: "12px",
                                color: "#64748b",
                              }}
                            >
                              <i
                                className="fa fa-volume-up"
                                aria-hidden="true"
                              />
                            </button>
                          )}
                        {card.back.language && card.back.language !== "pt" && (
                          <button
                            className="audio-button"
                            onClick={() =>
                              readText(
                                card.back.text,
                                true,
                                card.back.language,
                                selectedVoice
                              )
                            }
                            style={{
                              background: "#ffffff",
                              border: "1px solid #e2e8f0",
                              borderRadius: 999,
                              padding: "4px 6px",
                              cursor: "pointer",
                              fontSize: "12px",
                              color: "#64748b",
                            }}
                          >
                            <i className="fa fa-volume-up" aria-hidden="true" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteCard(card._id)}
                          style={{
                            fontSize: "11px",
                            padding: "3px 8px",
                            height: "24px",
                            borderRadius: 999,
                            border: "1px solid #fee2e2",
                            backgroundColor: "#fef2f2",
                            cursor: "pointer",
                            color: "#b91c1c",
                          }}
                        >
                          <i className="fa fa-trash" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {/* Image Section */}
                    {card.img && (
                      <div style={{ margin: "0.5rem 0" }}>
                        <img
                          style={{
                            width: "100%",
                            maxWidth: "8rem",
                            aspectRatio: "1 / 1",
                            objectFit: "cover",
                            objectPosition: "center",
                            borderRadius: 6,
                            boxShadow: "0 4px 10px rgba(15,23,42,0.18)",
                          }}
                          src={card.img}
                          alt={card.front?.text}
                        />
                      </div>
                    )}

                    {/* Stats Section */}
                    <div
                      style={{
                        borderTop: "1px solid #f1f5f9",
                        paddingTop: "0.5rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#64748b",
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "0.5rem",
                        }}
                      >
                        <div>
                          <strong>Reviews:</strong>{" "}
                          {Math.round(card.numberOfReviews)}
                        </div>
                        <div>
                          <strong>Rate:</strong> {card.reviewRate}
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                          <strong>Created:</strong> {formatDate(card.updatedAt)}
                        </div>
                        {card.tags && card.tags.length > 0 && (
                          <div style={{ gridColumn: "1 / -1" }}>
                            <strong>Tags:</strong>{" "}
                            <span style={{ fontStyle: "italic" }}>
                              {card.tags.map(
                                (thetag: string, index: number) => (
                                  <span key={index}>
                                    {thetag}
                                    {index < card.tags.length - 1 ? ", " : ""}
                                  </span>
                                )
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {loading && cards.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "0.75rem 0",
                  }}
                >
                  <CircularProgress
                    size={20}
                    style={{ color: partnerColor() }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL NO BODY VIA PORTAL */}
      {showModal &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              onClick={handleHideModal}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(15,23,42,0.45)",
                zIndex: 999,
              }}
            />

            {/* Container centralizado */}
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
              }}
              onClick={handleHideModal}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "100%",
                  maxWidth: 420,
                  maxHeight: "90vh",
                  overflow: "hidden",
                  borderRadius: 12,
                  backgroundColor: "#ffffff",
                  boxShadow: "0 18px 55px rgba(15,23,42,0.25)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <HOne
                    style={{
                      padding: 0,
                      margin: 0,
                      fontSize: 16,
                      color: partnerColor(),
                    }}
                  >
                    {UniversalTexts.editCardTitle || "Editar Flashcard"}
                  </HOne>
                  <button
                    onClick={handleHideModal}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      width: 28,
                      height: 28,
                      borderRadius: "999px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      color: "#94a3b8",
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Body */}
                <div
                  style={{
                    padding: "12px 16px 14px",
                    overflowY: "auto",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {!loadingModal ? (
                    <>
                      <article
                        id="front"
                        style={{ display: "flex", gap: "0.5rem" }}
                      >
                        <input
                          style={{
                            flex: 1,
                            padding: "8px",
                            border: "1px solid #e2e8f0",
                            borderRadius: 8,
                            fontSize: 13,
                          }}
                          value={newFront}
                          onChange={(e) => setNewFront(e.target.value)}
                          type="text"
                          placeholder="Frente"
                        />
                        <select
                          style={{
                            flexBasis: "35%",
                            padding: "8px",
                            border: "1px solid #e2e8f0",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                          value={newLGFront}
                          onChange={(e) => setNewLGFront(e.target.value)}
                        >
                          {languages.map((language, langIndex) => (
                            <option key={langIndex} value={language}>
                              {language}
                            </option>
                          ))}
                        </select>
                      </article>

                      <article
                        id="back"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <input
                            style={{
                              flex: 1,
                              padding: "8px",
                              border: "1px solid #e2e8f0",
                              borderRadius: 8,
                              fontSize: 13,
                            }}
                            value={newBack}
                            onChange={(e) => setNewBack(e.target.value)}
                            type="text"
                            placeholder="Verso"
                          />
                          <select
                            style={{
                              flexBasis: "35%",
                              padding: "8px",
                              border: "1px solid #e2e8f0",
                              borderRadius: 8,
                              fontSize: 12,
                            }}
                            value={newLGBack}
                            onChange={(e) => setNewLGBack(e.target.value)}
                          >
                            {languages.map((language, langIndex) => (
                              <option key={langIndex} value={language}>
                                {language}
                              </option>
                            ))}
                          </select>
                        </div>

                        <input
                          style={{
                            padding: "8px",
                            border: "1px solid #e2e8f0",
                            borderRadius: 8,
                            fontSize: 13,
                          }}
                          value={newBackComments}
                          onChange={(e) => setNewBackComments(e.target.value)}
                          type="text"
                          placeholder="Comentários"
                        />
                      </article>
                    </>
                  ) : (
                    <div
                      style={{
                        padding: "24px 0",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress style={{ color: partnerColor() }} />
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div
                  style={{
                    padding: "10px 16px 12px",
                    borderTop: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.5rem",
                  }}
                >
                  <button
                    onClick={() => handleDeleteCard(cardIdToEdit)}
                    style={{
                      backgroundColor: "#fee2e2",
                      color: "#b91c1c",
                      border: "none",
                      borderRadius: 999,
                      padding: "0.4rem 0.9rem",
                      cursor: "pointer",
                      fontSize: 12,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <i className="fa fa-trash" aria-hidden="true" />{" "}
                    {UniversalTexts.delete || "Excluir"}
                  </button>
                  <button
                    onClick={() => handleEditCard(cardIdToEdit)}
                    style={{
                      backgroundColor: partnerColor(),
                      color: "#ffffff",
                      border: "none",
                      borderRadius: 999,
                      padding: "0.4rem 0.9rem",
                      cursor: "pointer",
                      fontSize: 12,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <i className="fa fa-save" aria-hidden="true" />{" "}
                    {UniversalTexts.save || "Salvar"}
                  </button>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
};

export default AllCards;
