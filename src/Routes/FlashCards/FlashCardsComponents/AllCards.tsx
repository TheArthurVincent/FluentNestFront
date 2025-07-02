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
import { secondaryColor } from "../../../Styles/Styles";
import Voice from "../../../Resources/Voice";

const AllCards = ({ headers }: HeadersProps) => {
  const actualHeaders = headers || {};

  const [addCardVisible, setAddCardVisible] = useState<boolean>(false);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingStudents, setLoadingStudents] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newFront, setNewFront] = useState<string>("");
  const [newBack, setNewBack] = useState<string>("");
  const [newLGFront, setNewLGFront] = useState<string>("");
  const [newLGBack, setNewLGBack] = useState<string>("");
  const [cardIdToEdit, setCardIdToEdit] = useState<string>("");
  const [newBackComments, setNewBackComments] = useState<string>("");
  const [studentsList, setStudentsList] = useState<any>([]);
  const [perm, setPermissions] = useState<string>("");
  const [studentID, setStudentID] = useState<string>("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreCards = async (
    isReset: boolean = false,
    customId?: string
  ): Promise<void> => {
    const currentPage = isReset ? 0 : page;
    const id = customId ?? studentID;

    if (!id) return; // segurança extra
    if (!hasMore && !isReset) return;

    if (isReset) {
      setCards([]);
      setHasMore(true);
      setPage(0);
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/cards/${id}?skip=${currentPage * 10}&limit=10`,
        { headers: actualHeaders }
      );
      setLoading(false);

      const newCards = response.data.allFlashCards;
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

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const element = scrollRef.current;
    if (!element || loading || !hasMore) return;

    const isBottom =
      element.scrollTop + element.clientHeight + 1 >= element.scrollHeight;

    if (isBottom) {
      console.log("🔁 Fetching more cards...");
      fetchMoreCards();
    }
    setLoading(false);
  };

  useEffect(() => {
    const user = localStorage.getItem("loggedIn");
    const { id, permissions } = JSON.parse(user || "");
    setPermissions(permissions);
    if (permissions == "superadmin") {
      fetchStudents();
    }

    if (user) {
      setStudentID(id);
      setCards([]);
      setPage(0);
      setHasMore(true);
      fetchMoreCards();
    }
  }, []);

  const handleStudentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newID = event.target.value;
    setStudentID(newID);
    fetchMoreCards(true, newID);
  };

  const fetchStudents = async () => {
    setLoadingStudents(true);
    setAddCardVisible(!addCardVisible);
    try {
      const response = await axios.get(`${backDomain}/api/v1/students/`, {
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

  const handleSeeModal = async (cardId: string) => {
    setShowModal(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/flashcardfindone/${studentID}`,
        {
          params: { cardId },
          headers: actualHeaders,
        }
      );
      const newf = response.data.flashcard.front.text;
      const newb = response.data.flashcard.back.text;
      const newlf = response.data.flashcard.front.language;
      const newlb = response.data.flashcard.back.language;
      const newIDcard = response.data.flashcard._id;
      const newComments = response.data.flashcard.backComments;

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
  const handleEditCard = async (cardId: string) => {
    setShowModal(true);
    try {
      const response = await axios.put(
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

  const handleDeleteCard = async (cardId: string) => {
    try {
      const response = await axios.delete(
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

  const handleHideModal = () => {
    setShowModal(false);
  };

  const [selectedVoice, setSelectedVoice] = useState<any>("");
  const [changeNumber, setChangeNumber] = useState<boolean>(true);

  useEffect(() => {
    const storedVoice = localStorage.getItem("chosenVoice");
    setSelectedVoice(storedVoice);
    console.log(storedVoice);
  }, [selectedVoice, changeNumber]);
  useEffect(() => {
    const element = scrollRef.current;
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
          {perm === "superadmin" && (
            <div style={{ display: "inline" }}>
              {loadingStudents ? (
                <CircularProgress style={{ color: secondaryColor() }} />
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
          <CircularProgress style={{ color: secondaryColor() }} />
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
