import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Button, Tooltip } from "@mui/material";

import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import { backDomain, formatDateBr } from "../../Resources/UniversalComponents";
import { readText } from "../EnglishLessons/Assets/Functions/FunctionLessons";
import { ArvinButton } from "../../Resources/Components/ItemsLibrary";
import { HOne, HTwo, RouteDiv } from "../../Resources/Components/RouteBox";
import {
  partnerColor,
  textGeneralFont,
  transparentBlack,
} from "../../Styles/Styles";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { myLogoDone } from "../NewStudentAsaas/EmailCheck";

interface WordOfTheDayListRv {
  headers: MyHeadersType | null;
}

const WordOfTheDayList = ({ headers }: WordOfTheDayListRv) => {
  const [open, setOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<any>(null);

  const handleOpen = (word: any) => {
    setSelectedWord(word);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const [thePermissions, setPermissions] = useState<string>("");
  const [myId, setId] = useState<string>("");
  const [words, setWords] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const user = localStorage.getItem("loggedIn");
    if (user) {
      const { permissions, id } = JSON.parse(user);
      setPermissions(permissions);
      setId(id);
    }
  }, []);

  const fetchWords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backDomain}/api/v1/wordoftheday`);
      setWords(response.data.words);
      console.log(response.data.words);
    } catch (error: any) {
      // alert(error.response?.data?.error || "Error.");
      console.log(error.response?.data?.error || "Error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  if (loading) {
    return <CircularProgress style={{ color: partnerColor() }} />;
  }

  return (
    <RouteDiv
      style={{
        maxWidth: "800px",
      }}
    >
      <HOne>Word of the Day</HOne>

      {words.map((wordItem: any) => (
        <div
          key={wordItem._id}
          style={{
            margin: "20px",
            border: "1px #eee solid",
            padding: "1rem",
          }}
        >
          <HTwo
            style={{
              margin: "20px",
            }}
          >
            <strong>{wordItem.word}</strong> | {wordItem.translatedWord} (
            {formatDateBr(wordItem.date)})
          </HTwo>
          <div
            style={{
              backgroundColor: "#777",
              color: "#fff",
              padding: "10px",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div>
              <p>
                <strong>{wordItem.sentence}</strong>
              </p>
              <p>{wordItem.translatedSentence}</p>
            </div>

            <ArvinButton
              onClick={() => readText(wordItem.sentence, false, "en")}
            >
              <i className="fa fa-volume-up" aria-hidden="true" />
            </ArvinButton>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              margin: "10px",
            }}
          >
            <a
              href={`https://youglish.com/pronounce/${wordItem.word}/english/us`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa fa-volume-up" aria-hidden="true" /> Hear YouGlish
            </a>{" "}
            <a
              href={`https://www.linguee.com/english-portuguese/search?source=auto&query=${wordItem.word}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa fa-volume-up" aria-hidden="true" /> Hear Linguee
            </a>
          </div>
          <ArvinButton onClick={() => handleOpen(wordItem)}>
            Ver no Card
          </ArvinButton>
          <Modal open={open} onClose={handleClose}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "90%", sm: 400 },
                bgcolor: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(10px)",
                borderRadius: 4,
                boxShadow: transparentBlack(),
                p: 4,
                color: "#333",
              }}
            >
              <IconButton
                onClick={handleClose}
                sx={{ position: "absolute", top: 8, right: 8, color: "#444" }}
              >
                <CloseIcon />
              </IconButton>

              {selectedWord && (
                <div
                  style={{
                    fontSize: "1.5rem",
                    display: "flex",
                    textAlign: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    padding: "2rem",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <HOne
                    style={{
                      margin: 0,
                      fontSize: "2.5rem",
                    }}
                  >
                    {selectedWord.word} - {selectedWord.translatedWord}
                  </HOne>
                  {myLogoDone}
                  <div
                    style={{
                      textAlign: "center",
                      fontFamily: textGeneralFont(),
                    }}
                  >
                    <p
                      style={{
                        fontWeight: "800",
                      }}
                    >
                      {selectedWord.sentence}
                    </p>
                    <p>{selectedWord.translatedSentence}</p>
                  </div>
                </div>
              )}
            </Box>
          </Modal>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "10px",
              margin: "10px",
            }}
          >
            {wordItem.studentsWhoDidIt.map((word: any, index: number) => {
              return (
                <Tooltip title={word.fullName}>
                  <img
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    src={word.photo}
                    alt={word.photo}
                  />
                </Tooltip>
              );
            })}
          </div>{" "}
        </div>
      ))}
    </RouteDiv>
  );
};

export default WordOfTheDayList;
