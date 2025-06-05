import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
} from "@mui/material";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import { backDomain } from "../../Resources/UniversalComponents";
import {
  notifyError,
  readText,
} from "../EnglishLessons/Assets/Functions/FunctionLessons";
import { ArvinButton } from "../../Resources/Components/ItemsLibrary";
import {
  darkGreyColor,
  secondaryColor,
  textTitleFont,
} from "../../Styles/Styles";
import { HOne, RouteDiv } from "../../Resources/Components/RouteBox";
import Helmets from "../../Resources/Helmets";

interface FlashCardsPropsRv {
  headers: MyHeadersType | null;
  onChange: any;
  change: boolean;
}

const SentenceMining = ({ headers, onChange, change }: FlashCardsPropsRv) => {
  const [myId, setId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [see, setSee] = useState<boolean>(false);
  const [heardSentences, setHeardSentences] = useState([false, false, false]);
  const [word, setWord] = useState<string>("");
  const [finalWord, setFinalWord] = useState<string>("");
  const [disabledButton, setDisabledButton] = useState(true);

  const [explanation, setExplanation] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("Basic");
  const [tense, setTense] = useState<string>("Present");
  const [sentenceType, setSentenceType] = useState<string>("Affirmative");
  const [theAdaptedWord, setAdaptedWord] = useState<string>("");
  const [context, setContext] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [thePermissions, setThePermissions] = useState<string>("");

  const [sentence1, setSentence1] = useState<string>("");
  const [transation1, setTransation1] = useState<string>("");
  const [sentence2, setSentence2] = useState<string>("");
  const [transation2, setTransation2] = useState<string>("");

  const youglishBaseUrl = `https://youglish.com/pronounce/${theAdaptedWord}/english/us`;

  const [sentences, setSentences] = useState([
    { text: "", translation: "", added: false },
    { text: "", translation: "", added: false },
  ]);

  useEffect(() => {
    const user = localStorage.getItem("loggedIn");
    if (user) {
      const { id, permissions } = JSON.parse(user);
      setThePermissions(permissions);
      setId(id);
    }
  }, []);

  const actualHeaders = headers || {};

  const seeCardsToReview = async () => {
    setLoading(true);
    setSee(true);

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/flashcardsvocabulary/${myId}`,
        {
          headers: actualHeaders,
          params: { context, language, word, tense, sentenceType, difficulty },
        }
      );

      setFinalWord(response.data.adaptedWord);

      setSentences([
        {
          text: response.data.sentence1,
          translation: response.data.translation1,
          added: false,
        },
        {
          text: response.data.sentence2,
          translation: response.data.translation2,
          added: false,
        },
      ]);

      setSentence1(response.data.sentence1);
      setTransation1(response.data.translation1);
      setSentence2(response.data.sentence2);
      setTransation2(response.data.translation2);

      setExplanation(response.data.explanation);
      setAdaptedWord(response.data.adaptedWord);

      setLoading(false);
      setHeardSentences([false, false, false]);
    } catch (error: any) {
      console.log(error);
      alert(error.response?.data?.error || "Error fetching flashcards.");
    }
  };

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
        front: { text: frontText, language: "en" },
        back: { text: backText, language: "pt" },
        tags: [""],
      },
    ];

    try {
      const response = await axios.post(
        `${backDomain}/api/v1/flashcard/${myId}`,
        { newCards },
        { headers: actualHeaders }
      );
      notifyError(
        "Card adicionado: " + response.data.addedNewFlashcards,
        "green"
      );
      onChange(!change);
      setSentences((prevSentences) =>
        prevSentences.map((sentence, i) =>
          i === index ? { ...sentence, added: true } : sentence
        )
      );
    } catch (error: any) {
      alert(error.response?.data?.error || "Error adding flashcard.");
    }
  };

  const handleReadText = (index: number, text: string, language: string) => {
    readText(text, true, "en");
    const newHeardSentences = [...heardSentences];
    newHeardSentences[index] = true;
    setHeardSentences(newHeardSentences);
  };

  return (
    <RouteDiv>
      <Helmets text="Sentence Mining" />
      <section
        id="review"
        style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}
      >
        {see && (
          <div style={{ color: "black" }}>
            {loading ? (
              <CircularProgress style={{ color: secondaryColor() }} />
            ) : (
              <div>
                <div style={{ marginBottom: "15px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <HOne>{finalWord}</HOne>
                    <div
                      style={{
                        fontStyle: "italic",
                        fontSize: "16px",
                        color: "#555",
                      }}
                    >
                      {explanation}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  />
                </div>
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <p>
                    <a
                      href={youglishBaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver mais exemplos em vídeos
                    </a>
                  </p>
                </div>
                <div style={{ margin: "auto", padding: "10px" }}>
                  {sentences.map((sentence, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      {!sentence.added && (
                        <Tooltip
                          title={
                            !heardSentences[index]
                              ? "Listen first!"
                              : "Add to flashcards"
                          }
                        >
                          <ArvinButton
                            color={!heardSentences[index] ? "white" : "green"}
                            cursor={
                              !heardSentences[index] ? "not-allowed" : "pointer"
                            }
                            onClick={() =>
                              addNewCards(
                                index,
                                sentence.text,
                                sentence.translation
                              )
                            }
                            disabled={!heardSentences[index]}
                          >
                            <i className="fa fa-files-o" aria-hidden="true" />
                          </ArvinButton>
                        </Tooltip>
                      )}
                      <ArvinButton
                        className="audio-button bgwhite"
                        onClick={() =>
                          handleReadText(index, sentence.text, language)
                        }
                      >
                        <i className="fa fa-volume-up" aria-hidden="true" />
                      </ArvinButton>
                      <span>
                        <span
                          style={{ fontWeight: 800, fontSize: "16px" }}
                          dangerouslySetInnerHTML={{ __html: sentence.text }}
                        />
                        <br />
                        <span
                          style={{ fontSize: "14px", color: "#666" }}
                          dangerouslySetInnerHTML={{
                            __html: sentence.translation,
                          }}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "20px",
            gap: "10px",
            padding: "15px",
            borderRadius: "6px",
          }}
        >
          <input
            type="text"
            placeholder="What word would you like to know more about?"
            value={word}
            maxLength={20}
            onChange={(e) => {
              setWord(e.target.value);
              setDisabledButton(true);
              setLanguage("");
            }}
            style={{
              padding: "8px",
              fontWeight: 600,
              fontFamily: textTitleFont(),
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />

          <FormControl>
            <RadioGroup
              row
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value);
              }}
            >
              <FormControlLabel
                value="Basic"
                control={
                  <Radio
                    sx={{
                      color: darkGreyColor(),
                      "&.Mui-checked": { color: secondaryColor() },
                    }}
                  />
                }
                label="Basic"
              />
              <FormControlLabel
                value="Intermediate"
                control={
                  <Radio
                    sx={{
                      color: darkGreyColor(),
                      "&.Mui-checked": { color: secondaryColor() },
                    }}
                  />
                }
                label="Intermediate"
              />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <RadioGroup
              row
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setDisabledButton(false);
              }}
            >
              <FormControlLabel
                value="en"
                control={
                  <Radio
                    sx={{
                      color: darkGreyColor(),
                      "&.Mui-checked": { color: secondaryColor() },
                    }}
                  />
                }
                label="English"
              />
              <FormControlLabel
                value="pt"
                control={
                  <Radio
                    sx={{
                      color: darkGreyColor(),
                      "&.Mui-checked": { color: secondaryColor() },
                    }}
                  />
                }
                label="Português"
              />
            </RadioGroup>
          </FormControl>
          <ArvinButton
            disabled={word == "" || disabledButton}
            cursor={word == "" || disabledButton ? "not-allowed" : "pointer"}
            color={word == "" || disabledButton ? "grey" : "green"}
            onClick={seeCardsToReview}
          >
            Mine new word
          </ArvinButton>
          {thePermissions == "superadmin" && (
            <>
              <ArvinButton onDoubleClick={editWordOfTheDay}>
                Word of the day
              </ArvinButton>

              <input
                type="text"
                value={sentence1}
                onChange={(e) => {
                  setSentence1(e.target.value);
                }}
                style={{
                  padding: "8px",
                  fontWeight: 600,
                  fontFamily: textTitleFont(),
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
                  fontFamily: textTitleFont(),
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
                  fontFamily: textTitleFont(),
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
                  fontFamily: textTitleFont(),
                  width: "100%",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              />
            </>
          )}
        </div>
      </section>
    </RouteDiv>
  );
};

export default SentenceMining;
