import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
} from "@mui/material";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import { backDomain, onLoggOut } from "../../Resources/UniversalComponents";
import {
  notifyAlert,
  readText,
} from "../EnglishLessons/Assets/Functions/FunctionLessons";
import {
  alwaysWhite,
  partnerColor,
  textPrimaryColorContrast,
} from "../../Styles/Styles";
import { HOne, RouteDiv } from "../../Resources/Components/RouteBox";
import Helmets from "../../Resources/Helmets";
import Voice from "../../Resources/Voice";
import {
  LiSentence,
  UlSentences,
} from "../EnglishLessons/Assets/Functions/EnglishActivities.Styled";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import { isArthurVincent } from "../../App";

interface FlashCardsPropsRv {
  headers: MyHeadersType | null;
  onChange: any;
  change: boolean;
  myPermissions: string;
}

const SentenceMining = ({
  headers,
  onChange,
  change,

  myPermissions,
}: FlashCardsPropsRv) => {
  const { UniversalTexts } = useUserContext();

  const [myId, setId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [dis, setDis] = useState<boolean>(false);
  const [see, setSee] = useState<boolean>(true);
  const [word, setWord] = useState<string>("");
  const [finalWord, setFinalWord] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("Basic");
  const [theAdaptedWord, setAdaptedWord] = useState<string>("");
  const [language, setLanguage] = useState<string>("en");
  const [thePermissions, setThePermissions] = useState<string>("");
  const [sentence1, setSentence1] = useState<string>("");
  const [transation1, setTransation1] = useState<string>("");
  const [sentence2, setSentence2] = useState<string>("");
  const [transation2, setTransation2] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    "Selecione um idioma"
  );
  const [loadingStudents, setLoadingStudents] = useState<boolean>(false);
  const [students, setStudents] = useState<any[]>([]);
  // Handle student selection
  const handleStudentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = event.target.value;
    setSelectedStudentId(studentId);
  };

  const youglishBaseUrl = `https://youglish.com/pronounce/${theAdaptedWord}/${
    language === "pt"
      ? "portuguese"
      : language === "en"
      ? "english"
      : language === "fr"
      ? "french"
      : "spanish"
  }`;

  const [examples, setExamples] = useState<
    { sentence: string; translation: string; added: boolean }[]
  >([]);

  useEffect(() => {
    const user = localStorage.getItem("loggedIn");
    if (user) {
      const { id, permissions } = JSON.parse(user);
      setThePermissions(permissions);
      setSelectedStudentId(id);
      setId(id);
    }
  }, []);

  const actualHeaders = headers || {};

  const mineWord = async () => {
    setDis(true);
    setLoading(true);
    setSee(true);
    event?.preventDefault();

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/flashcardsvocabulary/${selectedStudentId}`,
        {
          headers: actualHeaders,
          params: { selectedLanguage, word, difficulty, myId },
        }
      );
      setAdaptedWord(response.data.adaptedWord);
      setLanguage(response.data.lang);
      setSentence1(response.data.adaptedWord);
      setTransation1(response.data.translatedWord);
      if (response.data.examples.length >= 1) {
        setSentence2(response.data.examples[0].sentence);
        setTransation2(response.data.examples[0].translation);
      }

      setFinalWord(response.data.adaptedWord);
      setExplanation(response.data.explanation);
      setExamples(
        response.data.examples.map((ex: any) => ({
          sentence: ex.sentence,
          translation: ex.translation,
          added: false,
        }))
      );

      setLoading(false);
      onChange(!change);
      setDis(false);
    } catch (error: any) {
      console.error(error);
      notifyAlert(
        error.response?.data?.message || "Error fetching flashcards.",
        partnerColor()
      );
      setLoading(false);
      setDis(false);
    }
  };

  const [changeNumber, setChangeNumber] = useState<boolean>(true);

  const editWordOfTheDay = async () => {
    const newWord = [
      {
        word: sentence1,
        translatedWord: transation1,
        sentence: sentence2,
        translatedSentence: transation2,
        explanation,
      },
    ];
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/wordoftheday`,
        { newWord },
        { headers: actualHeaders }
      );

      alert("Palavra do dia alterada adicionada");
      window.location.assign("/");
    } catch (error: any) {
      alert(error.response?.data?.error || "Error adding flashcard.");
    }
  };

  const addNewCards = async (
    index: number,
    frontText: string,
    backText: string
  ) => {
    const newCards = [
      {
        mining: true,
        front: { text: frontText, language: language },
        back: { text: backText, language: "pt" },
        tags: [""],
      },
    ];
    try {
      const response = await axios.post(
        `${backDomain}/api/v1/flashcard/${selectedStudentId}`,
        { newCards },
        { headers: actualHeaders }
      );
      notifyAlert(
        "Card adicionado: " + response.data.addedNewFlashcards,
        "green"
      );
      onChange(!change);
    } catch (error: any) {
      notifyAlert("Error adding flashcard.");
      console.log(error);
    }
  };

  const fetchData = async () => {
    if (myPermissions === "superadmin" || myPermissions === "teacher") {
      setLoadingStudents(true);
      try {
        const response = await axios.get(
          `${backDomain}/api/v1/students/${myId}`,
          {
            headers: actualHeaders,
          }
        );
        const allUsers = response.data.listOfStudents || response.data;
        setStudents(allUsers);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoadingStudents(false);
      }
    } else {
      console.log("User is not admin/teacher, skipping student fetch");
    }
  };

  useEffect(() => {
    fetchData();
  }, [myId]);

  return (
    <RouteDiv>
      <Helmets text="Sentence Mining" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <HOne>Mineração de Sentenças</HOne>
        {(myPermissions === "superadmin" || myPermissions === "teacher") && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: alwaysWhite(),
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {loadingStudents ? (
              <CircularProgress size={20} style={{ color: partnerColor() }} />
            ) : (
              <select
                onChange={(e) => {
                  handleStudentChange(e);
                  const studentSelected = students.find(
                    (student) => student.id === e.target.value
                  );
                }}
                value={selectedStudentId}
                style={{
                  borderRadius: "4px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#f8fafc",
                  fontSize: "13px",
                  fontWeight: "400",
                  color: "#64748b",
                  padding: "6px 8px",
                  minWidth: "200px",
                  maxWidth: "300px",
                  outline: "none",
                  cursor: "pointer",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = partnerColor();
                  e.target.style.backgroundColor = "#ffffff";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.backgroundColor = "#f8fafc";
                }}
              >
                <option value="">
                  {UniversalTexts?.selectAStudent || "Selecione um aluno..."}
                </option>
                {students.map((student) => (
                  <option
                    key={student.id || student.theId}
                    value={student.id || student.theId}
                  >
                    {student.name} {student.lastname}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
        {!loading && (
          <select
            onChange={(e) => {
              setSelectedLanguage(e.target.value);
            }}
            value={selectedLanguage}
            style={{
              borderRadius: "4px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#f8fafc",
              fontSize: "13px",
              fontWeight: "400",
              color: "#64748b",
              padding: "6px 8px",
              minWidth: "200px",
              maxWidth: "300px",
              outline: "none",
              cursor: "pointer",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = partnerColor();
              e.target.style.backgroundColor = "#ffffff";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.backgroundColor = "#f8fafc";
            }}
          >
            {[
              "Selecione um idioma",
              "Inglês",
              "Espanhol",
              isArthurVincent ? "Francês" : null,
            ].map((language: any | null) => (
              <option
                hidden={language === "Selecione um idioma"}
                key={language}
                value={language}
              >
                {language}
              </option>
            ))}
          </select>
        )}
      </div>
      {selectedLanguage !== "Selecione um idioma" && (
        <section
          id="review"
          style={{
            padding: "20px",
            maxWidth: "600px",
            margin: "auto",
          }}
        >
          <form
            onSubmit={mineWord}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "8px",
              padding: "10px 14px",
              margin: "auto",
              backgroundColor: "#f9f9f9",
              borderRadius: "4px",
            }}
          >
            <input
              type="text"
              placeholder={
                selectedLanguage === "Francês"
                  ? "Choisissez un mot ou une expression en Portugais ou Français ..."
                  : selectedLanguage === "Inglês"
                  ? `Choose a word or phrase in Portuguese or English...`
                  : selectedLanguage === "Espanhol"
                  ? "Elige una palabra ou frase en Portugués o Español..."
                  : "Escolha uma palavra ou expressão..."
              }
              value={word}
              disabled={dis ? true : false}
              maxLength={30}
              onChange={(e) => {
                setWord(e.target.value);
              }}
              style={{
                width: "95%",
                padding: "6px 10px",
                fontSize: "14px",
                borderRadius: "4px",
              }}
            />
            {!dis && (
              <>
                <RadioGroup
                  row
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  sx={{ fontSize: "12px" }}
                >
                  {["Basic", "Intermediate", "Advanced"].map((level) => (
                    <FormControlLabel
                      key={level}
                      value={level}
                      control={
                        <Radio
                          size="small"
                          sx={{
                            color: "#888",
                            "&.Mui-checked": { color: partnerColor() },
                            padding: "2px",
                          }}
                        />
                      }
                      label={
                        <span style={{ fontSize: "13px", color: "#333" }}>
                          {level}
                        </span>
                      }
                    />
                  ))}
                </RadioGroup>
                <button
                  color={word == "" || dis ? "grey" : partnerColor()}
                  type="submit"
                  title="-15"
                  style={{
                    cursor: word == "" || dis ? "not-allowed" : "pointer",
                    padding: "4px 12px",
                    fontSize: "13px",
                    borderRadius: "4px",
                    textTransform: "none",
                  }}
                  disabled={word == "" || dis ? true : false}
                >
                  ✨ Minerar sentenças (-15)
                </button>
              </>
            )}
          </form>
          {see && (
            <>
              {loading ? (
                <CircularProgress style={{ color: partnerColor() }} />
              ) : (
                finalWord !== "" && (
                  <>
                    <div style={{ margin: "1rem" }}>
                      <strong
                        style={{
                          padding: "5px",
                          marginBottom: "15px",
                          borderRadius: "6px",
                          color: textPrimaryColorContrast(),
                          backgroundColor: partnerColor(),
                          fontSize: "18px",
                        }}
                      >
                        {finalWord}
                      </strong>
                      <br />
                      <a
                        href={youglishBaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "13px",
                          marginTop: "15px",
                          color: "#999",
                          textDecoration: "none",
                        }}
                      >
                        Ver mais exemplos em vídeos
                      </a>
                      <br />
                      <span
                        style={{
                          fontStyle: "italic",
                          fontSize: "14px",
                          color: "#555",
                        }}
                      >
                        {explanation}
                      </span>
                    </div>

                    <div style={{ marginTop: "10px" }}>
                      <Voice
                        maxW="12rem"
                        changeB={changeNumber}
                        setChangeB={setChangeNumber}
                        chosenLanguage={language}
                      />
                    </div>
                    <UlSentences grid={2}>
                      {examples.map((example, index) => (
                        <LiSentence key={index}>
                          {!example.added && (
                            <Tooltip title={"Add to flashcards"}>
                              <button
                                style={{
                                  color: textPrimaryColorContrast(),
                                  backgroundColor: partnerColor(),
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  addNewCards(
                                    index,
                                    example.sentence,
                                    example.translation
                                  );
                                  setExamples((prev) =>
                                    prev.map((ex, i) =>
                                      i === index ? { ...ex, added: true } : ex
                                    )
                                  );
                                }}
                              >
                                <i
                                  className="fa fa-files-o"
                                  aria-hidden="true"
                                />
                              </button>
                            </Tooltip>
                          )}
                          <br />
                          <strong>{example.sentence}</strong>
                          <span
                            className="audio-button"
                            onClick={() =>
                              readText(example.sentence, true, language)
                            }
                          >
                            <i className="fa fa-volume-up" aria-hidden="true" />
                          </span>
                          <br />
                          <span style={{ fontStyle: "italic" }}>
                            {example.translation}
                          </span>
                        </LiSentence>
                      ))}
                    </UlSentences>
                  </>
                )
              )}
            </>
          )}

          {thePermissions == "superadmin" && (
            <div style={{ marginTop: "5rem", display: "grid", gap: "10px" }}>
              <button onDoubleClick={editWordOfTheDay}>Word of the day</button>

              <input
                type="text"
                value={sentence1}
                onChange={(e) => {
                  setSentence1(e.target.value);
                }}
                style={{
                  padding: "8px",
                  fontWeight: 600,
                  width: "100%",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              />
              <input
                type="text"
                value={transation1}
                onChange={(e) => {
                  setTransation1(e.target.value);
                }}
                style={{
                  padding: "8px",
                  fontWeight: 600,
                  width: "100%",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              />
              <input
                type="text"
                value={sentence2}
                onChange={(e) => {
                  setSentence2(e.target.value);
                }}
                style={{
                  padding: "8px",
                  fontWeight: 600,
                  width: "100%",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              />
              <input
                type="text"
                value={transation2}
                onChange={(e) => {
                  setTransation2(e.target.value);
                }}
                style={{
                  padding: "8px",
                  fontWeight: 600,
                  width: "100%",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              />
            </div>
          )}
        </section>
      )}
      <span style={{ display: "flex", justifyContent: "right" }}>
        <a
          style={{
            fontSize: "13px",
            marginTop: "15px",
            color: "#999",
            textDecoration: "none",
          }}
          href="/flash-cards"
        >
          Veja os flashcards dos alunos
        </a>
      </span>
    </RouteDiv>
  );
};

export default SentenceMining;
