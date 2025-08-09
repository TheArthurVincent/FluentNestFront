import React, { useEffect, useState } from "react";
import axios from "axios";
import { backDomain, onLoggOut } from "../../../Resources/UniversalComponents";
import { ArvinButton } from "../../../Resources/Components/ItemsLibrary";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import AddOneFlashCard from "./AddFlashONEFlashCard";
import {
  CircularProgress,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { partnerColor } from "../../../Styles/Styles";
import { notifyAlert } from "../../EnglishLessons/Assets/Functions/FunctionLessons";
import { useUserContext } from "../../../Application/SelectLanguage/SelectLanguage";

interface Student {
  id: string;
  name: string;
  lastname: string;
}

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
const AddFlashCards = ({ headers, display, selectedStudentId }: AddFlashCardsProps) => {
  const { UniversalTexts } = useUserContext();
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [myId, setMyId] = useState<string>("");
  const [addCardVisible, setAddCardVisible] = useState<boolean>(false);
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [myPermissions, setPermissions] = useState<string>("");

  useEffect(() => {
    const user = localStorage.getItem("loggedIn");
    if (user) {
      const { permissions, id } = JSON.parse(user);
      setMyId(id);
      setPermissions(permissions);
    }
  }, []);

  const actualHeaders = headers || {};
  const [loading, setLoading] = useState<Boolean>(false);

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

  const addNewCards = async () => {
    const newCards = cards.map((card) => ({
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
        `${
          response.data.addedNewFlashcards
            ? response.data.addedNewFlashcards
            : ""
        }` +
        `${response.data.invalidNewCards ? response.data.invalidNewCards : ""}`;

      notifyAlert(showThis, "green");
      setCards([]);
    } catch (error) {
      notifyAlert("Erro ao enviar cards");
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
            <ArvinButton
              style={{ display: !addCardVisible ? "block" : "none" }}
              color={partnerColor()}
              onClick={() => setAddCardVisible(true)}
            >
              {UniversalTexts?.enterFlashcards || "Adicionar cartas"}
            </ArvinButton>
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
                  <ArvinButton
                    color={partnerColor()}
                    onClick={() => setShowConfirmation(true)}
                  >
                    {UniversalTexts?.add || "Add all cards"}
                  </ArvinButton>
                )}

                <ArvinButton color="navy" onClick={addNewCard}>
                  +
                </ArvinButton>
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
          {UniversalTexts?.enterFlashcards ? `Confirmar ${UniversalTexts.enterFlashcards.toLowerCase()}` : "Confirmar adição de flashcards"}
        </DialogTitle>
        <DialogContent dividers>
          {cards.length === 0 ? (
            <p>Nenhum card criado.</p>
          ) : (
            <ul
              style={{
                maxHeight: "15rem",
                overflow: "auto",
                paddingLeft: 0,
                display: "grid",
                gap: "1rem",
              }}
            >
              {cards.map((card, index) => (
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
                    <strong>📝 Front:</strong> {card.frontCard}
                  </p>
                  <p style={{ margin: "0.3rem 0" }}>
                    <strong>💬 Back:</strong> {card.backCard}
                  </p>
                  <p style={{ margin: "0.3rem 0" }}>
                    <strong>🧠 Comentário:</strong>{" "}
                    {card.backComments ? card.backComments : <i>Nenhum</i>}
                  </p>
                  <p style={{ margin: "0.3rem 0" }}>
                    <strong>🌐 Idiomas:</strong> {card.languageFront} →{" "}
                    {card.languageBack}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
        <DialogActions>
          <ArvinButton color="gray" onClick={() => setShowConfirmation(false)}>
            {UniversalTexts?.cancel || "Cancelar"}
          </ArvinButton>
          <ArvinButton
            color="green"
            onClick={() => {
              addNewCards();
              setShowConfirmation(false);
            }}
          >
            {UniversalTexts?.add ? `Confirmar e ${UniversalTexts.add.toLowerCase()}` : "Confirmar e adicionar"}
          </ArvinButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddFlashCards;
