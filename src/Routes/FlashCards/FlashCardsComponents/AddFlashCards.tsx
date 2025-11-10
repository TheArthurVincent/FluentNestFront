import React, { useEffect, useState } from "react";
import axios from "axios";
import { backDomain, onLoggOut } from "../../../Resources/UniversalComponents";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import AddOneFlashCard from "./AddFlashONEFlashCard";
import { CircularProgress, Dialog } from "@mui/material";
import { partnerColor, textpartnerColorContrast } from "../../../Styles/Styles";
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
  selectedStudentName: string;
  change?: any;
  setChange?: any;
}
const AddFlashCards = ({
  headers,
  display,
  change,
  setChange,
  selectedStudentId,
  selectedStudentName,
}: AddFlashCardsProps) => {
  const { UniversalTexts } = useUserContext();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [addCardVisible, setAddCardVisible] = useState<boolean>(true);
  const [isAIMode, setIsAIMode] = useState<boolean>(false);
  const [textInput, setTextInput] = useState<string>("");
  const [numberOfCards, setNumberOfCards] = useState<number>(5);
  const [myId, setMyId] = useState<string>("");

  useEffect(() => {
    const { id } = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    setMyId(id);
  }, []);

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

  const toggleMode = () => {
    setIsAIMode(!isAIMode);
    // Reset cards when switching modes
    if (!isAIMode) {
      setCards([
        {
          frontCard: "",
          backCard: "",
          languageFront: "en",
          languageBack: "pt",
          backComments: "",
        },
      ]);
    }
  };

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

  const [loadingFlashcardsAI, setLoadingFlashcardsAI] = useState(false);

  const handleFlashcardsAI = async () => {
    setLoadingFlashcardsAI(true);
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/ai-flashcards-from-text/${myId}`,
        { textInput, numberOfCards }
      );

      // Processar os cards retornados pela IA
      if (response.data.flashcards && response.data.flashcards.cards) {
        const aiCards = response.data.flashcards.cards.map((card: any) => ({
          frontCard: card.frontCard || "",
          backCard: card.backCard || "",
          languageFront: card.languageFront || "en",
          languageBack: card.languageBack || "pt",
          backComments: card.backComments || "",
        }));

        // Atualizar o estado com os cards gerados pela IA
        setCards(aiCards);

        // Alternar para o modo manual para permitir edição
        setIsAIMode(false);

        // Limpar o texto de entrada
        setTextInput("");
        setChange && setChange(!change);
        notifyAlert(
          `${aiCards.length} flashcards gerados com sucesso!`,
          "green"
        );
      }

      setLoadingFlashcardsAI(false);
    } catch (error: any) {
      notifyAlert(error?.response?.data?.message || "Erro ao gerar flashcards");
      setLoadingFlashcardsAI(false);
      console.log(error?.response?.data?.error, "Erro");
    }
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
        borderRadius: "4px",
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
              {/* Toggle Mode Button */}
              <div
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={toggleMode}
                  style={{
                    backgroundColor: isAIMode ? partnerColor() : "#f0f0f0",
                    color: isAIMode ? textpartnerColorContrast() : "#333",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  {isAIMode ? "📝 Modo Manual" : "✨ Modo IA"}
                </button>
              </div>

              {/* AI Mode - Text Input */}
              {isAIMode ? (
                <div style={{ marginBottom: "1rem" }}>
                  {loadingFlashcardsAI ? (
                    <CircularProgress />
                  ) : (
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Cole aqui o conteúdo que você quer transformar em flashcards..."
                      style={{
                        width: "100%",
                        minHeight: "200px",
                        padding: "1rem",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        fontSize: "14px",
                        resize: "vertical",
                      }}
                    />
                  )}
                  <div
                    style={{
                      marginTop: "0.5rem",
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                    }}
                  >
                    <button
                      title={
                        //verificar se textimput está vazio ou é menor que 30 palavras
                        textInput.trim().split(" ").length < 30 ||
                        textInput.trim() === ""
                          ? "Insira pelo menos 30 palavras para gerar flashcards"
                          : `Gerar ${numberOfCards} flashcards`
                      }
                      disabled={
                        loadingFlashcardsAI ||
                        //verificar se textimput está vazio ou é menor que 5 palavras
                        textInput.trim().split(" ").length < 5 ||
                        textInput.trim() === ""
                      }
                      onClick={() => {
                        handleFlashcardsAI();
                      }}
                      style={{
                        backgroundColor:
                          loadingFlashcardsAI ||
                          //verificar se textimput está vazio ou é menor que 5 palavras
                          textInput.trim().split(" ").length < 5 ||
                          textInput.trim() === ""
                            ? "#ccc"
                            : partnerColor(),
                        color: textpartnerColorContrast(),
                        border: "none",
                        borderRadius: "4px",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                        flex: 1,
                      }}
                    >
                      ✨ Gerar {numberOfCards} Flashcards (-{numberOfCards * 2})
                    </button>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.2rem",
                      }}
                    >
                      <select
                        value={numberOfCards}
                        onChange={(e) =>
                          setNumberOfCards(Number(e.target.value))
                        }
                        style={{
                          padding: "0.4rem 0.5rem",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          fontSize: "14px",
                          backgroundColor: "#fff",
                          cursor: "pointer",
                          minWidth: "70px",
                        }}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                /* Manual Mode - Individual Cards */
                <div>
                  {cards.map((card, index) => (
                    <AddOneFlashCard
                      key={index}
                      studentId={myId}
                      setChange={setChange}
                      change={change}
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
              )}
              <br />
              <span
                style={{
                  display: "flex",
                  gap: "0.5rem",
                }}
              >
                {(cards.length > 0 || (isAIMode && textInput.trim())) && (
                  <button
                    color={partnerColor()}
                    onClick={() => {
                      if (selectedStudentName) {
                        setShowConfirmation(true);
                      } else {
                        notifyAlert(
                          "Nenhum aluno selecionado! Selecione um aluno",
                          partnerColor()
                        );
                      }
                    }}
                  >
                    {UniversalTexts?.addAllCards || "Add all cards"}
                  </button>
                )}
                {!isAIMode && (
                  <button color={partnerColor()} onClick={addNewCard}>
                    +
                  </button>
                )}
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
        <h1 style={{ padding: "10px" }}>
          {UniversalTexts?.confirmAddFlashcards ||
            "Confirmar adição de flashcards"}{" "}
          | {selectedStudentName || "Selecionar aluno"}
        </h1>
        <div
          style={{
            padding: "0 24px 20px 24px",
          }}
        >
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
                      borderRadius: "4px",
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
        </div>
        <div
          style={{
            padding: "0 24px 20px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button onClick={() => setShowConfirmation(false)}>
            {UniversalTexts?.cancel || "Cancelar"}
          </button>
          <button
            style={{
              backgroundColor: partnerColor(),
              color: textpartnerColorContrast(),
            }}
            onClick={() => {
              addNewCards();
              setShowConfirmation(false);
            }}
          >
            {UniversalTexts?.confirmAndAdd || "Confirmar e adicionar"}
          </button>
        </div>
        <h1 style={{ padding: "10px" }}>
          {UniversalTexts?.confirmAddFlashcards ||
            "Confirmar adição de flashcards"}{" "}
          | {selectedStudentName || "Selecionar aluno"}
        </h1>
      </Dialog>
    </div>
  );
};

export default AddFlashCards;
