import React, { useState } from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import {
  backDomain,
  onLoggOut,
} from "../../../../Resources/UniversalComponents";
import axios from "axios";
import { readText } from "../Functions/FunctionLessons";
import { Tooltip, IconButton, Collapse } from "@mui/material";
import { ArvinButton } from "../../../../Resources/Components/ItemsLibrary";
import { LiSentence, UlSentences } from "../Functions/EnglishActivities.Styled";

interface QandALessonModelProps {
  headers: MyHeadersType | null;
  item: any;
  mainTag: string;
  studentId: string;
}

export default function QandALessonModel({
  headers,
  item,
  mainTag,
  studentId,
}: QandALessonModelProps) {
  const actualHeaders = headers || {};
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addNewCards = async (
    question: string,
    answer: string,
    criteria?: any
  ) => {
    const QandA = [
      {
        question: {
          text: question,
          language: "en",
        },
        answer: {
          text: answer,
          language: "pt",
        },
        criteria: criteria,
        tags: [mainTag ? mainTag : ""],
      },
    ];

    try {
      const response = await axios.post(
        `${backDomain}/api/v1/answerquestion/${studentId}`,
        { QandA },
        { headers: actualHeaders }
      );
      alert(response.data.messageQandA);
    } catch (error) {
      alert("Error adding cards");
      console.log(error);
      onLoggOut();
    }
  };

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <UlSentences grid={1}>
      {item.questions.map((theitem: any, index: number) => (
        <LiSentence key={index}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: "bold" }}>{theitem.question}</p>
            </div>
            <Tooltip title="Add to flashcards">
              <ArvinButton
                color="white"
                onClick={() =>
                  addNewCards(
                    theitem.question,
                    theitem.answer,
                    theitem.criteria
                  )
                }
              >
                <i className="fa fa-files-o" aria-hidden="true" />
              </ArvinButton>
            </Tooltip>
            <IconButton
              onClick={() => readText(theitem.question, true)}
              color="primary"
              size="small"
            >
              <i className="fa fa-volume-up" aria-hidden="true" />
            </IconButton>
          </div>

          <Collapse in={expandedIndex === index} timeout="auto" unmountOnExit>
            <div>
              <p>
                {theitem.answer}{" "}
                <span onClick={() => readText(theitem.answer, true)}>
                  <i className="fa fa-volume-up" aria-hidden="true" />
                </span>
              </p>
            </div>
          </Collapse>
          <div>
            <ArvinButton
              color="white"
              onClick={() => {
                if (expandedIndex !== index) {
                  readText(theitem.answer, true);
                }
                handleToggle(index);
              }}
            >
              {expandedIndex === index ? "Hide Answer" : "Show Answer"}
            </ArvinButton>
          </div>
        </LiSentence>
      ))}
    </UlSentences>
  );
}
