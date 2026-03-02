import styled from "styled-components";
// Interfaces
interface ScoreItem {
  description: string;
  score: number;
  color: string;
  nobutton?: boolean;
}

interface Criteria {
  title: string;
  score: ScoreItem[];
  icon: string;
  transform?: string;
  color: string;
  comment?: string;
}

interface Button {
  color: string;
  score: number;
  description: string;
  category: string;
  text: string;
}
// Lista
export const listOfCriteria = [
  {
    title: "Score",
    icon: "fa fa-book",
    color: "rgb(230, 160, 32)",
    score: [
      // =========================
      // BASE
      // =========================
      { description: "Homework Realizado", score: 750, color: "green" },

      {
        description: "Revisou um card",
        score: 3,
        nobutton: true,
        color: "green",
      },

      // =========================
      // VOCABULARY MATCH
      // =========================
      {
        description: "Vocabulary Match — 3 pontos (acertou de primeira)",
        score: 3,
        nobutton: true,
        color: "green",
      },
      {
        description:
          "Vocabulary Match — 2 pontos (acertou na segunda tentativa)",
        score: 2,
        nobutton: true,
        color: "green",
      },
      {
        description:
          "Vocabulary Match — 1 ponto (acertou na terceira tentativa)",
        score: 1,
        nobutton: true,
        color: "green",
      },
      {
        description: "Vocabulary Match — 0 pontos (3+ erros antes do acerto)",
        score: 0,
        nobutton: true,
        color: "gray",
      },

      // =========================
      // WORD → IMAGE
      // =========================
      {
        description: "Word → Image — 3 pontos por acerto",
        score: 3,
        nobutton: true,
        color: "green",
      },
      {
        description: "Word → Image — 0 pontos por erro",
        score: 0,
        nobutton: true,
        color: "gray",
      },

      // =========================
      // SESSÃO COMPLETA
      // =========================
      {
        description: "Word → Image — até 30 pontos por sessão (10 acertos)",
        score: 30,
        nobutton: true,
        color: "green",
      },
      {
        description: "Vocabulary Match — até 15 pontos por lote (5 pares)",
        score: 15,
        nobutton: true,
        color: "green",
      },
    ],
  },
];

// Método

function transformCriteriaToButtons(criteriaList: Criteria[]) {
  const buttonsList: Button[] = [];

  criteriaList.forEach((criteria) => {
    criteria.score.forEach((scoreItem) => {
      const button: Button = {
        color:
          typeof scoreItem.score === "number" && scoreItem.score >= 0
            ? "green"
            : "red",
        score: scoreItem.score,
        description: scoreItem.description,
        category: criteria.title,
        text: `${criteria.title.split(" ")[0]} ${
          scoreItem.description.split(" ")[0]
        } ${scoreItem.description.split(" ")[1]}`,
      };
      if (!scoreItem.nobutton) {
        buttonsList.push(button);
      }
    });
  });

  return buttonsList;
}

export const listOfButtons: Button[] =
  transformCriteriaToButtons(listOfCriteria);

export const GridRankingExplanation = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

export const GridRankingExplanationCard = styled.div`
  padding: 5px;
  border: 2px solid;
  margin: auto;
  borderradius: 5px;
  width: 20rem;
  min-height: 20rem;
  text-align: center;
  @media (max-width: 800px) {
    width: 85%;
    padding: 10px;
  }
`;
