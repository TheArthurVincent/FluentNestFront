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
import { backDomain } from "../../Resources/UniversalComponents";
import {
  notifyError,
  readText,
} from "../EnglishLessons/Assets/Functions/FunctionLessons";
import { ArvinButton } from "../../Resources/Components/ItemsLibrary";
import {
  partnerColor,
  textPrimaryColorContrast,
  textTitleFont,
} from "../../Styles/Styles";
import { HOne, RouteDiv } from "../../Resources/Components/RouteBox";
import Helmets from "../../Resources/Helmets";
import Voice from "../../Resources/Voice";
import {
  LiSentence,
  UlSentences,
} from "../EnglishLessons/Assets/Functions/EnglishActivities.Styled";

interface FlashCardsPropsRv {
  headers: MyHeadersType | null;
  onChange: any;
  change: boolean;
}

const SentenceMining = ({ headers, onChange, change }: FlashCardsPropsRv) => {
  const [myId, setId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [dis, setDis] = useState<boolean>(false);
  const [see, setSee] = useState<boolean>(true);
  const [word, setWord] = useState<string>("");
  const [finalWord, setFinalWord] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("Basic");
  const [theAdaptedWord, setAdaptedWord] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [thePermissions, setThePermissions] = useState<string>("");
  const [sentence1, setSentence1] = useState<string>("");
  const [transation1, setTransation1] = useState<string>("");
  const [sentence2, setSentence2] = useState<string>("");
  const [transation2, setTransation2] = useState<string>("");

  const youglishBaseUrl = `https://youglish.com/pronounce/${theAdaptedWord}/english/us`;

  const [examples, setExamples] = useState<
    { sentence: string; translation: string; added: boolean }[]
  >([]);

  useEffect(() => {
    const user = localStorage.getItem("loggedIn");
    if (user) {
      const { id, permissions } = JSON.parse(user);
      setThePermissions(permissions);
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
        `${backDomain}/api/v1/flashcardsvocabulary/${myId}`,
        {
          headers: actualHeaders,
          params: { language, word, difficulty },
        }
      );
      setAdaptedWord(response.data.adaptedWord);
      setSentence1(response.data.adaptedWord);
      setTransation1(response.data.translatedWord);
      if (response.data.examples.length >= 1) {
        setSentence2(response.data.examples[0].sentence);
        setTransation2(response.data.examples[0].translation);
      }

      setFinalWord(response.data.adaptedWord);
      setExplanation(response.data.explanation);
      console.log(response);

      setExamples(
        response.data.examples.map((ex: any) => ({
          sentence: ex.sentence,
          translation: ex.translation,
          added: false,
        }))
      );

      setLoading(false);
      setDis(false);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || "Error fetching flashcards.");
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
        front: { text: frontText, language: "en" },
        back: { text: backText, language: "pt" },
        tags: [""],
      },
    ];
    readText(frontText, true, "en");
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
    } catch (error: any) {
      notifyError("Error adding flashcard.");
      console.log(error);
    }
  };

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
        <HOne
          style={{
            fontFamily: textTitleFont(),
            color: partnerColor(),
            textAlign: "center",
            margin: "0.5rem",
          }}
        >
          Sentence Mining
        </HOne>
        <a
          style={{
            fontSize: "13px",
            color: "#999",
            textDecoration: "none",
          }}
          href="/flash-cards"
        >
          Revise seus flashcards!
        </a>
      </div>
      <section
        id="review"
        style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}
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
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        >
          <input
            type="text"
            placeholder="Type a word..."
            value={word}
            disabled={dis ? true : false}
            maxLength={30}
            onChange={(e) => {
              setWord(e.target.value);
              setLanguage("");
            }}
            style={{
              width: "95%",
              padding: "6px 10px",
              fontSize: "14px",
              borderRadius: "4px",
              border: "1px solid #ccc",
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
              <ArvinButton
                color={word == "" || dis ? "grey" : partnerColor()}
                cursor={word == "" || dis ? "not-allowed" : "pointer"}
                type="submit"
                style={{
                  padding: "4px 12px",
                  fontSize: "13px",
                  borderRadius: "4px",
                  textTransform: "none",
                }}
                disabled={word == "" || dis ? true : false}
              >
                Mine word
              </ArvinButton>
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
                        borderRadius: "5px",
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
                    />
                  </div>
                  <UlSentences grid={2}>
                    {examples.map((example, index) => (
                      <LiSentence key={index}>
                        {!example.added && (
                          <Tooltip title={"Add to flashcards"}>
                            <ArvinButton
                              color={partnerColor()}
                              cursor={"pointer"}
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
                              <i className="fa fa-files-o" aria-hidden="true" />
                            </ArvinButton>
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
    </RouteDiv>
  );
};

export default SentenceMining;
