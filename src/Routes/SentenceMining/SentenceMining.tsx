import React, { useEffect, useState } from "react";
import axios from "axios";
import { FormControlLabel, Radio, RadioGroup, Tooltip } from "@mui/material";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import { backDomain } from "../../Resources/UniversalComponents";
import {
  notifyAlert,
  readText,
} from "../EnglishLessons/Assets/Functions/FunctionLessons";
import {
  alwaysWhite,
  partnerColor,
  textPrimaryColorContrast,
} from "../../Styles/Styles";
import {
  LiSentence,
  UlSentences,
} from "../EnglishLessons/Assets/Functions/EnglishActivities.Styled";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import { isArthurVincent } from "../../App";
import { newArvinTitleStyle } from "../ArvinComponents/Students/Students";
import Voice from "../../Resources/Voice";

interface FlashCardsPropsRv {
  headers: MyHeadersType | null;
  onChange: (value: any) => void;
  change: boolean;
  myPermissions: string;
  isDesktop?: boolean;
}

const SentenceMining = ({
  headers,
  onChange,
  isDesktop,
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
  const [selectedLanguage, setSelectedLanguage] = useState<string>("english");

  const [loadingStudents, setLoadingStudents] = useState<boolean>(false);
  const [students, setStudents] = useState<any[]>([]);

  const [examples, setExamples] = useState<
    { sentence: string; translation: string; added: boolean }[]
  >([]);

  const [changeNumber, setChangeNumber] = useState<boolean>(true);

  const actualHeaders = headers || {};

  const youglishBaseUrl = `https://youglish.com/pronounce/${theAdaptedWord}/${
    selectedLanguage === "Português"
      ? "portuguese"
      : selectedLanguage === "Inglês"
        ? "english"
        : selectedLanguage === "Francês"
          ? "french"
          : "spanish"
  }`;

  // Carrega usuário logado e define comportamento diferente para aluno x professor/admin
  useEffect(() => {
    const user = localStorage.getItem("loggedIn");
    if (user) {
      const { id, permissions } = JSON.parse(user);
      setThePermissions(permissions);
      setId(id);
      setSelectedStudentId(id);
    }
  }, []);

  // Busca lista de alunos se for superadmin/teacher
  const fetchData = async () => {
    if (myPermissions === "superadmin" || myPermissions === "teacher") {
      setLoadingStudents(true);
      try {
        const response = await axios.get(
          `${backDomain}/api/v1/students/${myId}`,
          {
            headers: actualHeaders,
          },
        );
        const allUsers = response.data.listOfStudents || response.data;
        setStudents(allUsers);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoadingStudents(false);
      }
    } else {
      // aluno não precisa buscar lista de alunos
      console.log("User is not admin/teacher, skipping student fetch");
    }
  };

  useEffect(() => {
    if (myId) {
      fetchData();
    }
  }, [myId]);

  // Mineração da palavra/frase
  const mineWord = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!word.trim()) {
      notifyAlert(
        "Digite uma palavra ou expressão para minerar.",
        partnerColor(),
      );
      return;
    }

    // Se for professor/admin, precisa escolher um aluno explicitamente
    if (
      (thePermissions === "superadmin" || thePermissions === "teacher") &&
      !selectedStudentId
    ) {
      notifyAlert(
        "Selecione um aluno antes de minerar sentenças.",
        partnerColor(),
      );
      return;
    }

    // Se for aluno, selectedStudentId já é o próprio id (setado no useEffect)
    if (!selectedStudentId) {
      notifyAlert(
        "Erro ao identificar o aluno. Faça login novamente.",
        partnerColor(),
      );
      return;
    }

    setDis(true);
    setLoading(true);
    setSee(true);

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/flashcardsvocabulary`,
        {
          headers: actualHeaders,
          params: {
            selectedLanguage,
            word,
            difficulty,
            myId,
          },
        },
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
        })),
      );
      onChange(!change);
    } catch (error: any) {
      console.error(error);
      notifyAlert(
        error?.response?.data?.message || "Error fetching flashcards.",
        partnerColor(),
      );
    } finally {
      setLoading(false);
      setDis(false);
    }
  };

  // Palavra do dia (mantido, caso esteja usando em outro fluxo)
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
      await axios.put(
        `${backDomain}/api/v1/wordoftheday`,
        { newWord },
        { headers: actualHeaders },
      );

      alert("Palavra do dia alterada adicionada");
      window.location.assign("/");
    } catch (error: any) {
      alert(error?.response?.data?.error || "Error adding flashcard.");
    }
  };

  // Adiciona novos flashcards para o aluno selecionado
  const addNewCards = async (
    index: number,
    frontText: string,
    backText: string,
  ) => {
    if (!selectedStudentId) {
      notifyAlert(
        "Selecione um aluno antes de adicionar o flashcard.",
        partnerColor(),
      );
      return;
    }

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
        { headers: actualHeaders },
      );
      notifyAlert(
        "Card adicionado: " + response.data.addedNewFlashcards,
        partnerColor(),
      );
      onChange(!change);

      // Marca o exemplo como "added"
      setExamples((prev) =>
        prev.map((ex, i) => (i === index ? { ...ex, added: true } : ex)),
      );
    } catch (error: any) {
      console.log(error);
      notifyAlert("Error adding flashcard.", partnerColor());
    }
  };

  return (
    <div
      style={{
        margin: !isDesktop ? "0px" : "0px 16px 0px 0px",
      }}
    >
      {/* Título da página (desktop) */}
      {isDesktop && (
        <div
          style={{
            paddingTop: 29,
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
            <span style={newArvinTitleStyle}>Mineração de Sentenças</span>
          </section>
        </div>
      )}

      {/* CARD PRINCIPAL */}
      <div
        style={{
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 600,
          fontStyle: "SemiBold",
          margin: !isDesktop ? "12px" : "16px auto",
          fontSize: "14px",
          backgroundColor: "#ffffff",
          borderRadius: "6px",
          border: "1px solid #e8eaed",
          padding: isDesktop ? "16px 18px 18px" : "12px 14px 16px",
          maxWidth: 960,
        }}
      >
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
                borderRadius: "6px",
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
                        ? "Elige una palabra o frase en Portugués o Español..."
                        : "Escolha uma palavra ou expressão..."
                }
                value={word}
                disabled={dis}
                maxLength={30}
                onChange={(e) => {
                  setWord(e.target.value);
                }}
                style={{
                  width: "95%",
                  padding: "6px 10px",
                  fontSize: "14px",
                  borderRadius: "6px",
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
                    type="submit"
                    style={{
                      cursor:
                        word.trim() === "" || dis ? "not-allowed" : "pointer",
                      padding: "4px 12px",
                      fontSize: "13px",
                      borderRadius: "6px",
                      textTransform: "none",
                    }}
                    disabled={word.trim() === "" || dis}
                  >
                    Minerar
                  </button>
                </>
              )}
            </form>

            {see && (
              <>
                {loading ? (
                  <i className="fa fa-spinner fa-spin" aria-hidden="true" />
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
                            margin: "15px 0",
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
                                  onClick={() =>
                                    addNewCards(
                                      index,
                                      example.sentence,
                                      example.translation,
                                    )
                                  }
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
                              <i
                                className="fa fa-volume-up"
                                aria-hidden="true"
                              />
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
          </section>
        )}
      </div>
    </div>
  );
};

export default SentenceMining;
