import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Tooltip } from "@mui/material";
import { MyHeadersType } from "../../../Resources/types.universalInterfaces";
import { backDomain } from "../../../Resources/UniversalComponents";
import { readText } from "../../EnglishLessons/Assets/Functions/FunctionLessons";
import { partnerColor } from "../../../Styles/Styles";

// Função para limpar a string
function cleanString(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\x20-\x7E]/g, "") // Remove caracteres não imprimíveis
    .trim();
}

interface FlashCardsPropsRv {
  headers: MyHeadersType | null;
  onChange: any;
  change: boolean;
}

const QnAExercise = ({ headers, onChange, change }: FlashCardsPropsRv) => {
  const [myId, setId] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [see, setSee] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [next, setNext] = useState<boolean>(false);
  const [enableVoice, setEnableVoice] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("en");
  const [answerStudent, setAnswerStudent] = useState<string>("en");

  const [question, setQuestion] = useState<string>("");
  const [questionId, setQuestionId] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");
  const [AIResponse, setAIResponse] = useState<string>("");
  const [justAudio, setJustAudio] = useState<boolean>(true);
  const [thereIsQuestion, setThereIsQuestion] = useState<boolean>(true);

  const [listening, setListening] = useState<boolean>(false);

  const actualHeaders = headers || {};

  useEffect(() => {
    const user = localStorage.getItem("loggedIn");
    if (user) {
      const { id } = JSON.parse(user);
      setId(id);
    }
  }, []);

  const [seeAnswer, setSeeAnswer] = useState<boolean>(false);
  const handleSeeQuestion = async () => {
    setSee(true);
    setSeeAnswer(false);
    setLoading(true);
    setQuestion("");
    setTranscript("");
    setLanguage("en");
    setAIResponse("");
    setIsDisabled(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/get1question/${myId}`,
        { headers: actualHeaders || {} }
      );
      if (!response.data.question) {
        setThereIsQuestion(false);
        setLoading(false);
      } else {
        setThereIsQuestion(true);

        var quest = response.data.question.question.text;
        var lg = response.data.question.question.language;
        const questId = response.data.question._id;
        setQuestion(quest);
        setLanguage(lg);
        setQuestionId(questId);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar cards");
    }
  };

  const handleSeeAnswer = async (answer: string) => {
    setSeeAnswer(true);
    setLoading(true);
    setIsDisabled(true);
    setSee(true);
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/answerquestion/${myId}`,
        {
          questionId,
          answer,
          isJustAudio: justAudio,
        },
        {
          headers: actualHeaders || {},
        }
      );
      readText(`Your answer is ${response.data.message}`, false, "en");
      setAIResponse(response.data.message);
      setAnswerStudent(response.data.answerStudent);
      setEnableVoice(false);
      setLoading(false);
      onChange(!change);
      setNext(next);
    } catch (error) {
      alert("Erro ao carregar cards");
      setLoading(false); // Ensure loading stops on error
    }
  };

  // Controle do reconhecimento de fala
  const SpeechRecognition =
    // @ts-ignore
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = myId !== "671b99e97acd42b04d2f7507" ? "en-US" : "fr-FR";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const startListening = () => {
    setListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setListening(false);
    recognition.stop();
  };
  recognition.onresult = (event: any) => {
    const speechToText = event.results[0][0].transcript;
    setTranscript(cleanString(speechToText));
    setTimeout(() => {
      setIsDisabled(false);
      handleSeeAnswer(cleanString(speechToText));
    }, 2000);
    setEnableVoice(false);
  };

  recognition.onspeechend = () => {
    setTimeout(() => {
      stopListening();
    }, 5000);
  };
  recognition.onerror = () => {
    stopListening();
    alert("Erro no reconhecimento de voz");
    window.location.reload();
  };

  return (
    <section id="review">
      {see && (
        <div>
          {loading ? (
            <CircularProgress style={{ color: partnerColor() }} />
          ) : (
            <>
              {thereIsQuestion ? (
                <div>
                  <div
                    style={{
                      display: seeAnswer ? "none" : "block",
                      margin: "auto",
                    }}
                  >
                    {" "}
                    <button
                      disabled={playingAudio}
                      onClick={() => {
                        setPlayingAudio(true);
                        setTimeout(() => {
                          setPlayingAudio(false);
                        }, 3000);
                        readText(
                          language === "pt"
                            ? `${question}`
                            : `Question: ${question}`,
                          false,
                          language
                        );
                        setEnableVoice(true);
                      }}
                      color={!playingAudio ? "blue" : "grey"}
                      style={{
                        cursor: playingAudio ? "not-allowed" : "pointer",
                        margin: "0 5px",
                        marginTop: !isDisabled ? "1rem" : 0,
                      }}
                    >
                      {!isDisabled ? (
                        `Listen again`
                      ) : (
                        <i className="fa fa-volume-up" aria-hidden="true" />
                      )}
                    </button>
                    <button
                      style={{
                        display: !isDisabled ? "none" : "inline-block",
                        cursor: enableVoice ? "pointer" : "not-allowed",
                        margin: "0 5px",
                      }}
                      disabled={!enableVoice}
                      onClick={!listening ? startListening : stopListening}
                      color={
                        !enableVoice
                          ? "grey"
                          : !listening && enableVoice
                          ? "green"
                          : "red"
                      }
                    >
                      <i
                        className={
                          !listening ? "fa fa-microphone" : "fa fa-stop"
                        }
                        aria-hidden="true"
                      />
                    </button>
                    <br />
                    {!justAudio ? question : ""}
                    <br />
                    <Tooltip title="Você pode clicar aqui para ler a resposta, porém, a pontuação pela resposta irá cair. Tente entender escutando!">
                      <button
                        style={{
                          display: !justAudio ? "none" : "block",
                        }}
                        onClick={() => {
                          setJustAudio(false);
                          setEnableVoice(true);
                        }}
                        color="yellow"
                      >
                        See text
                      </button>
                    </Tooltip>
                  </div>
                  <div
                    style={{
                      display: !seeAnswer ? "none" : "block",
                      marginTop: "1rem",
                      padding: "1.5rem",
                      borderRadius: "6px",
                    }}
                    className="box-shadow-white"
                  >
                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: "1.25rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      Question:
                    </div>
                    <div style={{ marginBottom: "1.25rem" }}>{question}</div>

                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: "1.25rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      Your Answer:
                    </div>

                    <div style={{ marginBottom: "1.25rem" }}>
                      {answerStudent}
                    </div>

                    <div
                      style={{
                        fontWeight: "600",
                        fontSize: "1.25rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      Feedback:
                    </div>
                    <div
                      onClick={() => {
                        readText(AIResponse, false, language);
                      }}
                      style={{
                        marginBottom: "1.25rem",
                        padding: "1rem",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "1.1rem",
                        color: "white",
                        backgroundColor: AIResponse.includes("Correct")
                          ? "#27ae60"
                          : AIResponse.includes("Wrong")
                          ? "#c0392b"
                          : "#d3d3d3",
                      }}
                    >
                      {AIResponse}
                    </div>
                    <div
                      style={{
                        marginBottom: "1rem",
                        fontStyle: "italic",
                        fontSize: "10px",
                      }}
                    >
                      {/* {justAudio
                        ? "You scored 7 points because you managed to answer just by listening to the audio without reading."
                        : "You scored 3 points because you read the text."} */}
                    </div>
                    <button
                      onClick={() => {
                        setJustAudio(true);
                        handleSeeQuestion();
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : (
                "No questions"
              )}
            </>
          )}
        </div>
      )}
      <div
        style={{
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <button
          style={{
            margin: "auto",
            display: "block",
          }}
          onClick={handleSeeQuestion}
        >
          {!see ? "Start" : <i className="fa fa-refresh" />}
        </button>
      </div>
    </section>
  );
};

export default QnAExercise;
