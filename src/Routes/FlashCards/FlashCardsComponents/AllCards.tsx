import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  backDomain,
  onLoggOut,
  Xp,
} from "../../../Resources/UniversalComponents";
import { HeadersProps } from "../../../Resources/types.universalInterfaces";
import { ArvinButton } from "../../../Resources/Components/ItemsLibrary";
import { CircularProgress } from "@mui/material";
import { languages } from "./AddFlashONEFlashCard";
import { readText } from "../../EnglishLessons/Assets/Functions/FunctionLessons";
import { partnerColor } from "../../../Styles/Styles";
import Voice from "../../../Resources/Voice";

var AllCards = ({ headers }: HeadersProps) => {
  var actualHeaders = headers || {};

  var [addCardVisible, setAddCardVisible] = useState<boolean>(false);
  var [cards, setCards] = useState<any[]>([]);
  var [loading, setLoading] = useState<boolean>(true);
  var [loadingStudents, setLoadingStudents] = useState<boolean>(true);
  var [showModal, setShowModal] = useState<boolean>(false);
  var [newFront, setNewFront] = useState<string>("");
  var [newBack, setNewBack] = useState<string>("");
  var [newLGFront, setNewLGFront] = useState<string>("");
  var [newLGBack, setNewLGBack] = useState<string>("");
  var [cardIdToEdit, setCardIdToEdit] = useState<string>("");
  var [newBackComments, setNewBackComments] = useState<string>("");
  var [studentsList, setStudentsList] = useState<any>([]);
  var [perm, setPermissions] = useState<string>("");
  var [studentID, setStudentID] = useState<string>("");
  var [myId, setMyId] = useState<string>("");
  var [page, setPage] = useState(0);
  var [hasMore, setHasMore] = useState(true);

  var fetchMoreCards = async (
    isReset: boolean = false,
    customId?: string
  ): Promise<void> => {
    var currentPage = isReset ? 0 : page;
    var id = customId ?? studentID;

    if (!id) return; // segurança extra
    if (!hasMore && !isReset) return;

    if (isReset) {
      setCards([]);
      setHasMore(true);
      setPage(0);
    }

    setLoading(true);
    try {
      var response = await axios.get(
        `${backDomain}/api/v1/cards/${id}?skip=${currentPage * 10}&limit=10`,
        { headers: actualHeaders }
      );
      setLoading(false);

      var newCards = response.data.allFlashCards;
      if (newCards.length === 0) {
        setHasMore(false);
      } else {
        setCards((prev) => (isReset ? newCards : [...prev, ...newCards]));
        setPage((prev) => (isReset ? 1 : prev + 1));
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar flashcards", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  var scrollRef = useRef<HTMLDivElement>(null);

  var handleScroll = () => {
    var element = scrollRef.current;
    if (!element || loading || !hasMore) return;

    var isBottom =
      element.scrollTop + element.clientHeight + 1 >= element.scrollHeight;

    if (isBottom) {
      fetchMoreCards();
    }
    setLoading(false);
  };

  useEffect(() => {
    var user = localStorage.getItem("loggedIn");
    var { id, permissions } = JSON.parse(user || "");
    setPermissions(permissions);
    if (permissions == "superadmin" || permissions == "teacher") {
      fetchStudents(id);
    }

    if (user) {
      setStudentID(id);
      setMyId(id);
      setCards([]);
      setPage(0);
      setHasMore(true);
      fetchMoreCards();
    }
  }, []);

  var handleStudentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    var newID = event.target.value;
    setStudentID(newID);
    fetchMoreCards(true, newID);
  };

  var fetchStudents = async (id: string) => {
    setLoadingStudents(true);
    setAddCardVisible(!addCardVisible);
    try {
      var response = await axios.get(`${backDomain}/api/v1/students/${id}`, {
        headers: actualHeaders,
      });
      setStudentsList(response.data.listOfStudents);
      setLoadingStudents(false);
    } catch (error) {
      // onLoggOut();
    }
  };

  /////////////////
  /////////////////
  /////////////////
  /////////////////
  /////////////////
  /////////////////
  /////////////////
  /////////////////
  /////////////////
  /////////////////

  var handleSeeModal = async (cardId: string) => {
    setShowModal(true);
    try {
      var response = await axios.get(
        `${backDomain}/api/v1/flashcardfindone/${studentID}`,
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
    } catch (error) {
      console.log(error, "Erro ao obter cards");
      onLoggOut();
    }
  };
  var handleEditCard = async (cardId: string) => {
    setShowModal(true);
    try {
      var response = await axios.put(
        `${backDomain}/api/v1/flashcard/${studentID}`,
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
        `${backDomain}/api/v1/flashcard/${studentID}`,
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
  useEffect(() => {
    if (studentID) {
      fetchMoreCards(true);
    }
  }, [studentID]);

  return (
    <>
      <div style={{ margin: "auto", maxWidth: "40rem" }}>
        <Voice changeB={changeNumber} setChangeB={setChangeNumber} />
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "space-between",
          }}
        >
          <ArvinButton onClick={() => fetchMoreCards(true)}>
            <i className="fa fa-refresh" aria-hidden="true" />
          </ArvinButton>
          {(perm === "superadmin" || perm === "teacher") && (
            <div style={{ display: "inline" }}>
              {loadingStudents ? (
                <CircularProgress style={{ color: partnerColor() }} />
              ) : (
                <select onChange={handleStudentChange} value={studentID}>
                  {studentsList.map((student: any, index: number) => (
                    <option key={index} value={student.id}>
                      {student.name + " " + student.lastname}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        {/* Cards Section */}
        {loading ? (
          <CircularProgress style={{ color: partnerColor() }} />
        ) : (
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            style={{
              padding: "5px",
              overflowY: "auto", // ou apenas "overflow: 'auto'"
              backgroundColor: "#eee",
              maxHeight: "50vh",
            }}
          >
            {cards.map((card: any, index: number) => (
              <div
                key={index}
                style={{
                  padding: "1rem",
                  margin: "5px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  justifyContent: "space-between",
                  backgroundColor: "#fff",
                }}
              >
                <div>
                  <ArvinButton
                    onClick={() => handleSeeModal(card._id)}
                    color="yellow"
                  >
                    <i className="fa fa-edit" aria-hidden="true" />
                  </ArvinButton>
                  <ArvinButton
                    onClick={() => handleDeleteCard(card._id)}
                    color="red"
                  >
                    <i className="fa fa-trash" aria-hidden="true" />
                  </ArvinButton>

                  {card.front.language && card.front.language !== "pt" && (
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
                    >
                      <i className="fa fa-volume-up" aria-hidden="true" />
                    </button>
                  )}
                  <div
                    style={{ fontWeight: 600 }}
                    dangerouslySetInnerHTML={{ __html: card.front.text }}
                  />
                  <div dangerouslySetInnerHTML={{ __html: card.back.text }} />
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
                    >
                      <i className="fa fa-volume-up" aria-hidden="true" />
                    </button>
                  )}
                </div>
                <div>
                  <div></div>
                  <div>
                    <div
                      style={{ fontStyle: "italic" }}
                      dangerouslySetInnerHTML={{ __html: card.backComments }}
                    />
                  </div>
                </div>
                {card.img && (
                  <img
                    style={{
                      width: "100%",
                      maxWidth: "8rem",
                      aspectRatio: "1 / 1",
                      objectFit: "cover",
                      display: "block",
                      objectPosition: "center",
                      borderRadius: "6px",
                      boxShadow: "1px 1px 12px 3px #bbb",
                    }}
                    src={card.img}
                    alt={card.front?.text}
                  />
                )}
                <div style={{ padding: "0.5rem" }}>
                  <ul
                    style={{
                      fontSize: "10px",
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "0.5rem",
                      padding: "0",
                      margin: "0",
                    }}
                  >
                    <li
                      style={{
                        listStyle: "none",
                      }}
                    >
                      <strong>Reviewed:</strong>{" "}
                      {Math.round(card.numberOfReviews)} times
                    </li>
                    <li
                      style={{
                        listStyle: "none",
                      }}
                    >
                      <strong>Review Rate Total:</strong> {card.reviewRate}
                    </li>
                    <li
                      style={{
                        listStyle: "none",
                      }}
                    >
                      <strong>Created:</strong> {card.updatedAt}
                    </li>
                    <li
                      style={{
                        listStyle: "none",
                      }}
                    >
                      <strong>Tags:</strong>
                      <span
                        style={{ fontStyle: "italic", marginLeft: "0.3rem" }}
                      >
                        {card.tags.map((thetag: string, index: number) => (
                          <span key={index}>{thetag}; </span>
                        ))}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.8)",
          top: 0,
          left: 0,
          display: showModal ? "block" : "none",
          width: "100%",
          height: "100%",
          position: "fixed",
        }}
        onClick={handleHideModal}
      />

      {/* Modal Content */}
      <div
        style={{
          display: showModal ? "block" : "none",
          backgroundColor: "white",
          padding: "1rem",
          position: "fixed",
          top: "40%",
          left: "40%",
        }}
        id="modal"
        className="box-shadow-white"
      >
        <Xp onClick={handleHideModal}>X</Xp>
        <article id="front">
          <input
            style={{ maxWidth: "120px" }}
            value={newFront}
            onChange={(e) => setNewFront(e.target.value)}
            type="text"
          />
          <select
            style={{ maxWidth: "120px" }}
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

        <article id="back">
          <input
            style={{ maxWidth: "120px" }}
            value={newBack}
            onChange={(e) => setNewBack(e.target.value)}
            type="text"
          />
          <select
            style={{ maxWidth: "120px" }}
            value={newLGBack}
            onChange={(e) => setNewLGBack(e.target.value)}
          >
            {languages.map((language, langIndex) => (
              <option key={langIndex} value={language}>
                {language}
              </option>
            ))}
          </select>
          <br />
          <input
            style={{ maxWidth: "120px" }}
            value={newBackComments}
            onChange={(e) => setNewBackComments(e.target.value)}
            type="text"
          />
          <div>
            <ArvinButton
              onClick={() => handleDeleteCard(cardIdToEdit)}
              color="red"
            >
              <i className="fa fa-trash" aria-hidden="true" />
            </ArvinButton>
            <ArvinButton
              onClick={() => handleEditCard(cardIdToEdit)}
              color="green"
            >
              <i className="fa fa-folder" aria-hidden="true" />
            </ArvinButton>
          </div>
        </article>
      </div>
    </>
  );
};

export default AllCards;
