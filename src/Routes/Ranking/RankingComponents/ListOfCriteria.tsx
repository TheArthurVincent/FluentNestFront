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
      { description: "Homework Realizado", score: 750, color: "green" },
      {
        description: "Homework Atrasado (> 7 dias) ou incompleto",
        score: 200,
        color: "green",
      },
      {
        color: "green",
        score: 75,
        description: "Participou da aula em grupo",
        text: "Participou da aula em grupo",
      },
      {
        description: "Revisou um card",
        score: 3,
        nobutton: true,
        color: "green",
      },
      {
        description: "Pontuação por palavra certa no Listening Exercise",
        score: 3,
        nobutton: true,
        color: "green",
      },
      {
        description: "Pontuação por palavra certa no Listening Exercise",
        score: 2,
        nobutton: true,
        color: "green",
      },
      {
        color: "green",
        score: 250,
        description: "Recomendação de aluno (a) particular fechada",
        text: "Recomendação",
      },
      // {
      //   color: "green",
      //   score: 50,
      //   description: "Recomendação de usuário da plataforma fechada",
      //   text: "Recomendação",
      // },
      {
        color: "Green",
        score: 500,
        description:
          "Adicionou todas as palavras da semana (Words of the week) aos flashcards e mandou a foto de todas anotadas no caderno.",
        text: "Adicionou todas as palavras da semana (Words of the week) aos flashcards e mandou a foto de todas anotadas no caderno.",
      },
      // {
      //   color: "red",
      //   score: -150,
      //   description: "AWOL Faltou na aula e não avisou",
      //   text: "Faltou na aula e não avisou",
      // },
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
