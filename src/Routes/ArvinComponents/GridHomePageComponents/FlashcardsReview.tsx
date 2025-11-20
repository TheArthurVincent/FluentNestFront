import React, { FC, useEffect, useState } from "react";
import { partnerColor } from "../../../Styles/Styles";
import axios from "axios";
import { backDomain, updateInfo } from "../../../Resources/UniversalComponents";
import { ShapesIcon } from "@phosphor-icons/react/dist/ssr";
import { ProgressCounter } from "../../FlashCardsToday/FlashCardsToday";
import { notifyAlert } from "../../EnglishLessons/Assets/Functions/FunctionLessons";
interface FlashcardsReviewProps {
  actualHeaders?: any;
}

export const FlashcardsReview: FC<FlashcardsReviewProps> = ({
  actualHeaders,
}) => {
  const [flashcardsToday, setFlashcardsToday] = useState<number>(0);
  const [seeConf, setSeeConf] = useState<boolean>(false);

  const seeCardsToReview = async () => {
    const student = JSON.parse(localStorage.getItem("loggedIn") || "0");
    let selectedStudentId: string | undefined;

    if (student.id) {
      selectedStudentId = student.id;
      updateInfo(selectedStudentId, actualHeaders);
    } else {
      return;
    }

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/flashcards-today/${selectedStudentId}`,
        {
          headers: actualHeaders,
          params: { category: null, lang: "en" },
        }
      );
      console.log(response.data);

      setFlashcardsToday(response.data.flashcardsToday);
      // se quiser usar isso pra algo:
      setSeeConf(!seeConf);
    } catch (error) {
      notifyAlert("Erro ao enviar cards");
    }
  };

  useEffect(() => {
    seeCardsToReview();
  }, [actualHeaders]); // ou [] se não mudar

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
