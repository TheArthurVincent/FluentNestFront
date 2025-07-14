import React, { useEffect, useState } from "react";
import axios from "axios";
import { backDomain, onLoggOut } from "../../../Resources/UniversalComponents";
import { ArvinButton } from "../../../Resources/Components/ItemsLibrary";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import AddOneFlashCard from "./AddFlashONEFlashCard";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { partnerColor } from "../../../Styles/Styles";
import { notifyError } from "../../EnglishLessons/Assets/Functions/FunctionLessons";

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
}
const AddFlashCards = ({ headers, display }: AddFlashCardsProps) => {
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [studentID, setStudentID] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [myId, setMyId] = useState<string>("");
  const [addCardVisible, setAddCardVisible] = useState<boolean>(false);
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [myPermissions, setPermissions] = useState<string>("");

  useEffect(() => {
    const user = localStorage.getItem("loggedIn");
    if (user) {
      const { permissions, id } = JSON.parse(user);
      setStudentID(id);
      setMyId(id);
      setPermissions(permissions);
    }
  }, []);

  const actualHeaders = headers || {};

  const [loading, setLoading] = useState<Boolean>(false);

  const fetchStudents = async () => {
    setLoading(true);
    setAddCardVisible(!addCardVisible);
    if (myPermissions === "superadmin") {
      try {
        const response = await axios.get(
          `${backDomain}/api/v1/students/${myId}`,
          {
            headers: actualHeaders,
          }
        );

        if (response.data.listOfStudents.length > 0) {
          setStudentsList(response.data.listOfStudents);
          setLoading(false);
        } else {
          setStudentsList([]);
          setLoading(false);
        }
      } catch (error) {
        notifyError("Erro ao encontrar alunos");
      }
    }
  };

  const handleStudentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStudentID(event.target.value);
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
        `${backDomain}/api/v1/flashcard/${studentID}`,
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

      notifyError(showThis, "green");
      setCards([]);
    } catch (error) {
      notifyError("Erro ao enviar cards");
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
              onClick={fetchStudents}
            >
              Adicionar cartas
            </ArvinButton>
            <div
              style={{
                marginTop: "1rem",
                display: addCardVisible ? "block" : "none",
              }}
            >
              <div style={{ display: "flex" }}>
                {loading ? (
                  <CircularProgress style={{ color: partnerColor() }} />
                ) : (
                  <FormControl style={{ width: "250px" }}>
                    <InputLabel id="student-select-label">
                      Choose student
                    </InputLabel>
                    <Select
                      labelId="student-select-label"
                      value={studentID}
                      // @ts-ignore
                      onChange={handleStudentChange}
                      label="Choose student"
                    >
                      <MenuItem value="student" disabled hidden>
                        Choose student
                      </MenuItem>
                      {studentsList.map((student, index) => (
                        <MenuItem key={index} value={student.id}>
                          {student.name + " " + student.lastname}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </div>
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
                <ArvinButton
                  color="green"
                  onClick={() => setShowConfirmation(true)}
                >
                  Add all cards
                </ArvinButton>

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
        <DialogTitle>Confirmar adição de flashcards</DialogTitle>
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
            Cancelar
          </ArvinButton>
          <ArvinButton
            color="green"
            onClick={() => {
              addNewCards();
              setShowConfirmation(false);
            }}
          >
            Confirmar e adicionar
          </ArvinButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddFlashCards;
