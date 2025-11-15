import React, { FC, useMemo } from "react";
import { FlashlightIcon } from "@phosphor-icons/react";

interface PracticalTipsTargetProps {
  appLoaded?: boolean;
  actualHeaders?: any;
  isDesktop?: boolean;
}

const tipsLesson = [
  "Faça 10 frases na sessão 'Dictation' de sua última aula.",
  "Se o dia estiver corrido, faça 5 frases na sessão 'Dictation' de sua última aula.",
  "Faça 20 frases na sessão 'Dictation' de sua última aula.",
  "Escolha uma aula de vocabulário para revisar.",
  "Revise os pontos gramaticais abordados em sua última aula.",
  "Assista a vídeos relacionados ao tema da sua última aula.",
  "Pratique a pronúncia escutando os áudios das suas últimas aulas.",
];

const tipsFlashcards = [
  "Revise seus flashcards para não esquecer o que aprendeu.",
  "Tire o dia de hoje para revisar pelo menos 25 flashcards.",
  "Tire o dia de hoje para revisar pelo menos 50 flashcards.",
];

const tipsHomework = [
  "Já fez sua última Lição de Casa para a próxima aula?",
  "Revisite suas últimas 3 Lições de Casa.",
  "Anote dúvidas ao revisar suas Lições de Casa e pergunte ao professor.",
];

// ---- Função determinística com base no dia ----
function pickByDay(array: string[], dayIndex: number) {
  return array[dayIndex % array.length];
}

export const PracticalTipsTarget: FC<PracticalTipsTargetProps> = ({
  appLoaded,
  actualHeaders,
  isDesktop,
}) => {
  // 0 = Domingo, 1 = Segunda, etc
  const today = new Date().getDay();

  const selectedTips = useMemo(() => {
    return {
      lesson: pickByDay(tipsLesson, today),
      flashcards: pickByDay(tipsFlashcards, today),
      homework: pickByDay(tipsHomework, today),
    };
  }, [today]);

  const styleLi = {
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 600,
    fontStyle: "SemiBold",
    fontSize: "13px",
    lineHeight: "22px",
    letterSpacing: "0%",
    color: "#65748C",
  };

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
          }}
        >
          <FlashlightIcon size={20} color={"#030303"} weight="bold" />
          <span>Dicas práticas</span>
        </span>
      </span>

      <div>
        <ul
          style={{
            marginTop: "20px",
          }}
        >
          <li style={styleLi}>{selectedTips.lesson}</li>
          <li style={styleLi}>{selectedTips.homework}</li>
          <li style={styleLi}>{selectedTips.flashcards}</li>
        </ul>
      </div>
    </>
  );
};
