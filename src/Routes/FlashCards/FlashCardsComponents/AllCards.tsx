import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  backDomain,
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
    if (!selectedStudentId) return; // segurança extra
    // Se estiver buscando, só carrega a primeira página e desativa o infinito
    if (search && !isReset) return;
    if (!hasMore && !isReset) return;

    if (isReset) {
      setCards([]);
      setPage(0);
      setHasMore(!search); // Se tem busca, não tem mais cards para carregar
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
      setLoading(false);

      var newCards = response.data.allFlashCards;
      if (newCards.length === 0) {
        setHasMore(false);
      } else {
        setCards((prev) => (isReset ? newCards : [...prev, ...newCards]));
        setPage((prev) => (isReset ? 1 : prev + 1));
        if (search) setHasMore(false); // Se está buscando, não tem mais para carregar
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar flashcards", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  var searchCards = (query: string) => {
    setSearch(query);
    // Não chama fetchMoreCards aqui, o useEffect de search faz isso
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

    // Só carrega mais se não estiver buscando
    if (isBottom && !search) {
      fetchMoreCards();
    }
    setLoading(false);
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
    setShowModal(true);
    try {
      var response = await axios.put(
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
      fetchMoreCards(true);
      setShowModal(false);
    } catch (error) {
      console.log(error, "Erro ao obter cards");
      onLoggOut();
    }
  };

  var handleDeleteCard = async (cardId: string) => {
    try {
      var response = await axios.delete(
        `${backDomain}/api/v1/flashcard/${selectedStudentId}`,
        {
          params: { cardId },
          headers: actualHeaders,
        }
      );
      fetchMoreCards(true);

      setShowModal(false);
    } catch (error) {
      console.log(error, "Erro ao apagar cards");
      onLoggOut();
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
          maxWidth: "600px",
          margin: "0 auto",
          padding: "1rem 0.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          {/* Header Controls */}
          <button
            onClick={() => fetchMoreCards(true)}
            style={{
              borderRadius: 4,
              fontSize: "11px",
              padding: "4px 8px",
              height: "28px",
            }}
          >
            <i className="fa fa-refresh" aria-hidden="true" />
          </button>
          <Voice changeB={changeNumber} setChangeB={setChangeNumber} />
          <input
            style={{
              borderRadius: 4,
              border: "1px solid #e2e8f0",
              backgroundColor: "#f8fafc",
              fontSize: "11px",
              fontWeight: "400",
              color: "#64748b",
              padding: "4px 6px",
              height: "28px",
              minWidth: "120px",
              outline: "none",
            }}
            type="text"
            placeholder={UniversalTexts.search}
            onChange={(e) => searchCards(e.target.value)}
          />
        </div>
        {/* Cards Section */}
        {loading ? (
          <CircularProgress style={{ color: partnerColor() }} />
        ) : (
          <div
            className="flashcard-history-list"
            style={{
              width: "100%",
              maxWidth: "500px",
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
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.06)",
                    border: "1px solid #f1f5f9",
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
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                      }}
                    >
                      📚 Flashcard #{index + 1}
                    </span>
                    <button
                      onClick={() => handleSeeModal(card._id)}
                      color="yellow"
                      style={{
                        fontSize: "11px",
                        padding: "2px 6px",
                        height: "24px",
                      }}
                    >
                      <i className="fa fa-edit" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: "0.75rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "0.5rem",
                        gap: "0.5rem",
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
                                background: "none",
                                border: "1px solid #e2e8f0",
                                borderRadius: 4,
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
                              background: "none",
                              border: "1px solid #e2e8f0",
                              borderRadius: 4,
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
                          color="red"
                          style={{
                            fontSize: "11px",
                            padding: "2px 6px",
                            height: "24px",
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
                            borderRadius: 4,
                            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
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
                          <strong>Created:</strong> {card.updatedAt}
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
            </div>
          </div>
        )}
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            top: 0,
            left: 0,
            display: showModal ? "block" : "none",
            width: "1000%",
            height: "1000%",
            position: "fixed",
          }}
          onClick={handleHideModal}
        />
        <div
          style={{
            display: showModal ? "flex" : "none",
            flexDirection: "column",
            gap: "1rem",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -70%)",
            backgroundColor: "#fff",
            borderRadius: 4,
            padding: "1rem",
            width: "300px",
            maxWidth: "90vw",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            zIndex: 2000,
          }}
          id="modal"
        >
          {/* Cabeçalho */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #eee",
              paddingBottom: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <HOne
              style={{
                padding: "1px",
                margin: "1px",
              }}
            >
              Editar Card
            </HOne>
            <Xp onClick={handleHideModal}>✕</Xp>
          </div>
          {!loadingModal ? (
            <>
              <article id="front" style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  style={{
                    flex: 1,
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: 4,
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
                    border: "1px solid #ddd",
                    borderRadius: 4,
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
                      border: "1px solid #ddd",
                      borderRadius: 4,
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
                      border: "1px solid #ddd",
                      borderRadius: 4,
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
                    border: "1px solid #ddd",
                    borderRadius: 4,
                  }}
                  value={newBackComments}
                  onChange={(e) => setNewBackComments(e.target.value)}
                  type="text"
                  placeholder="Comentários"
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.5rem",
                  }}
                >
                  <button
                    onClick={() => handleDeleteCard(cardIdToEdit)}
                    style={{
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      padding: "0.5rem 1rem",
                      cursor: "pointer",
                    }}
                  >
                    <i className="fa fa-trash" aria-hidden="true" /> Excluir
                  </button>
                  <button
                    onClick={() => handleEditCard(cardIdToEdit)}
                    style={{
                      backgroundColor: "#4caf50",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      padding: "0.5rem 1rem",
                      cursor: "pointer",
                    }}
                  >
                    <i className="fa fa-save" aria-hidden="true" /> Salvar
                  </button>
                </div>
              </article>
            </>
          ) : (
            <CircularProgress style={{ color: partnerColor() }} />
          )}
        </div>
      </div>
    </>
  );
};

export default AllCards;
