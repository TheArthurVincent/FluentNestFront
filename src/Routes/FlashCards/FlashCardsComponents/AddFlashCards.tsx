import React, { useEffect, useState } from "react";
import axios from "axios";
import { backDomain, onLoggOut } from "../../../Resources/UniversalComponents";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import AddOneFlashCard from "./AddFlashONEFlashCard";
import {
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { partnerColor } from "../../../Styles/Styles";
import { notifyAlert } from "../../EnglishLessons/Assets/Functions/FunctionLessons";
import { useUserContext } from "../../../Application/SelectLanguage/SelectLanguage";

interface FlashCard {
  frontCard: string;
  backCard: string;
  languageFront: string;
  languageBack: string;
  backComments: string;
}

interface AddFlashCardsProps {
  headers: MyHeadersType | null;
  display: string | null;
  selectedStudentId: string;
}
const AddFlashCards = ({
  headers,
  display,
  selectedStudentId,
}: AddFlashCardsProps) => {
  const { UniversalTexts } = useUserContext();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [addCardVisible, setAddCardVisible] = useState<boolean>(true);
  const [cards, setCards] = useState<FlashCard[]>([
    {
      frontCard: "",
      backCard: "",
      languageFront: "en",
      languageBack: "pt",
      backComments: "",
    },
  ]);
  const [myPermissions, setPermissions] = useState<string>("");

  useEffect(() => {
    const user = localStorage.getItem("loggedIn");
    if (user) {
      const { permissions, id } = JSON.parse(user);
      setPermissions(permissions);
    }
  }, []);

  const actualHeaders = headers || {};

  const addNewCard = () => {
    setCards([
      ...cards,
      {
        frontCard: "",
        backCard: "",
        languageFront: "en",
        languageBack: "pt",
        backComments: "",
      },
    ]);
  };

  const handleFrontCardChange = (index: number, value: string) => {
    const newCards = [...cards];
    newCards[index].frontCard = value;
    setCards(newCards);
  };

  const handleBackCardChange = (index: number, value: string) => {
    const newCards = [...cards];
    newCards[index].backCard = value;
    setCards(newCards);
  };

  const handleLanguageFrontChange = (index: number, value: string) => {
    const newCards = [...cards];
    newCards[index].languageFront = value;
    setCards(newCards);
  };

  const handleLanguageBackChange = (index: number, value: string) => {
    const newCards = [...cards];
    newCards[index].languageBack = value;
    setCards(newCards);
  };

  const handleCommentsBack = (index: number, value: string) => {
    const newCards = [...cards];
    newCards[index].backComments = value;
    setCards(newCards);
  };

  // Remove um card pelo índice
  const handleRemoveCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const addNewCards = async () => {
    // Filtra cards que tenham frente e verso preenchidos
    const filteredCards = cards.filter(
      (card) => card.frontCard.trim() !== "" && card.backCard.trim() !== ""
    );
    const newCards = filteredCards.map((card) => ({
      backComments: card.backComments,
      front: {
        text: card.frontCard,
        language: card.languageFront,
      },
      back: {
        text: card.backCard,
        language: card.languageBack,
      },
    }));
    try {
      const response = await axios.post(
        `${backDomain}/api/v1/flashcard/${selectedStudentId}`,
        { newCards },
        { headers: actualHeaders }
      );

      const showThis =
        `$${
          response.data.addedNewFlashcards
            ? response.data.addedNewFlashcards
            : ""
        }` +
        `${response.data.invalidNewCards ? response.data.invalidNewCards : ""}`;

      notifyAlert(showThis, "green");
      setCards([]);
    } catch (error) {
      notifyAlert(UniversalTexts?.errorSendingCards || "Erro ao enviar cards");
      onLoggOut();
    }
  };

  return (
    <div
      style={{
        borderRadius: "6px",
        zIndex: 10000,
        bottom: 10,
        right: 10,
        backgroundColor: "white",
        margin: "auto",
        padding: "1rem",
        maxWidth: display ? "fit-content" : "10px",
      }}
      className="smooth"
    >
      <div style={{ margin: "auto", display: "flex" }} id="addcards">
        {(myPermissions === "superadmin" || myPermissions === "teacher") && (
          <div style={{ display: "grid" }}>
            <button
              style={{ display: !addCardVisible ? "block" : "none" }}
              color={partnerColor()}
              onClick={() => setAddCardVisible(true)}
            >
              {UniversalTexts?.enterFlashcards || "Adicionar cartas"}
            </button>
            <div
              style={{
                marginTop: "1rem",
                display: addCardVisible ? "block" : "none",
              }}
            >
              <div>
                {cards.map((card, index) => (
                  <AddOneFlashCard
                    key={index}
                    index={index}
                    frontCard={card.frontCard}
                    backCard={card.backCard}
                    backComments={card.backComments}
                    languageFront={card.languageFront}
                    languageBack={card.languageBack}
                    handleFrontCardChange={handleFrontCardChange}
                    handleBackCardChange={handleBackCardChange}
                    handleLanguageFrontChange={handleLanguageFrontChange}
                    handleLanguageBackChange={handleLanguageBackChange}
                    handleCommentsBack={handleCommentsBack}
                    handleRemoveCard={handleRemoveCard}
                  />
                ))}
              </div>
              <br />
              <span
                style={{
                  marginTop: "1rem",
                }}
              >
                {cards.length > 0 && (
                  <button
                    color={partnerColor()}
                    onClick={() => setShowConfirmation(true)}
                  >
                    {UniversalTexts?.addAllCards || "Add all cards"}
                  </button>
                )}
                <button color={partnerColor()} onClick={addNewCard}>
                  +
                </button>
              </span>
            </div>
          </div>
        )}
      </div>
      <Dialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {UniversalTexts?.confirmAddFlashcards ||
            "Confirmar adição de flashcards"}
        </DialogTitle>
        <DialogContent dividers>
          {(() => {
            const filteredCards = cards.filter(
              (card) =>
                card.frontCard.trim() !== "" && card.backCard.trim() !== ""
            );
            if (filteredCards.length === 0) {
              return (
                <p>{UniversalTexts?.noCardsCreated || "Nenhum card criado."}</p>
              );
            }
            return (
              <ul
                style={{
                  maxHeight: "15rem",
                  overflow: "auto",
                  paddingLeft: 0,
                  display: "grid",
                  gap: "1rem",
                }}
              >
                {filteredCards.map((card, index) => (
                  <li
                    key={index}
                    style={{
                      listStyle: "none",
                      padding: "1rem",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      backgroundColor: "#f9f9f9",
                      boxShadow: "2px 2px 6px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <p style={{ margin: "0.3rem 0" }}>
                      <strong>📝 {UniversalTexts?.front || "Front"}:</strong>{" "}
                      {card.frontCard}
                    </p>
                    <p style={{ margin: "0.3rem 0" }}>
                      <strong>💬 {UniversalTexts?.backCard || "Back"}:</strong>{" "}
                      {card.backCard}
                    </p>
                    <p style={{ margin: "0.3rem 0" }}>
                      <strong>
                        🧠 {UniversalTexts?.comment || "Comentário"}:
                      </strong>{" "}
                      {card.backComments ? (
                        card.backComments
                      ) : (
                        <i>{UniversalTexts?.none || "Nenhum"}</i>
                      )}
                    </p>
                    <p style={{ margin: "0.3rem 0" }}>
                      <strong>
                        🌐 {UniversalTexts?.languages || "Idiomas"}:
                      </strong>{" "}
                      {card.languageFront} → {card.languageBack}
                    </p>
                  </li>
                ))}
              </ul>
            );
          })()}
        </DialogContent>
        <DialogActions>
          <button color="gray" onClick={() => setShowConfirmation(false)}>
            {UniversalTexts?.cancel || "Cancelar"}
          </button>
          <button
            color="green"
            onClick={() => {
              addNewCards();
              setShowConfirmation(false);
            }}
          >
            {UniversalTexts?.confirmAndAdd || "Confirmar e adicionar"}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddFlashCards;
