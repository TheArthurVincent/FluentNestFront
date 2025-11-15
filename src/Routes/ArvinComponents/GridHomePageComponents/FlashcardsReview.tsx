import React, { FC, useEffect, useState } from "react";
import { partnerColor } from "../../../Styles/Styles";
import axios from "axios";
import { backDomain, updateInfo } from "../../../Resources/UniversalComponents";
import { ShapesIcon } from "@phosphor-icons/react/dist/ssr";
import { ProgressCounter } from "../../FlashCardsToday/FlashCardsToday";
import { notifyAlert } from "../../EnglishLessons/Assets/Functions/FunctionLessons";
interface FlashcardsReviewProps {
  appLoaded?: boolean;
  actualHeaders?: any;
  isDesktop?: boolean;
}

export const FlashcardsReview: FC<FlashcardsReviewProps> = ({
  appLoaded,
  actualHeaders,
  isDesktop,
}) => {
  const [flashcardsToday, setFlashcardsToday] = useState<any>(0);
  const [seeConf, setSeeConf] = useState<boolean>(false);

  const seeCardsToReview = async () => {
    const student = JSON.parse(localStorage.getItem("loggedIn") || "0");
    var selectedStudentId;

    if (student.id) {
      selectedStudentId = student.id;
      updateInfo(selectedStudentId, actualHeaders);
    }

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/flashcards/${selectedStudentId}`,
        {
          headers: actualHeaders,
          params: { category: null, lang: "en" },
        }
      );

      setFlashcardsToday(response.data.flashcardsToday);
    } catch (error) {
      notifyAlert("Erro ao enviar cards");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      seeCardsToReview();
      setSeeConf(seeConf);
    }, 1000);
  }, [flashcardsToday]);

  return (
    <>
      <span
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "600",
            color: "#030303",
            marginBottom: "20px",
          }}
        >
          <ShapesIcon size={20} color={"#030303"} weight="bold" />
          <span>Revisão de Flashcards</span>
        </span>
      </span>
      <div>
        <ProgressCounter
          nSeeM={true}
          see={seeConf}
          flashcardsToday={flashcardsToday}
        />
      </div>
    </>
  );
};
