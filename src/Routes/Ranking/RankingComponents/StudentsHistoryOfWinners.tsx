import React, { useEffect, useState } from "react";
import { AnimatedLi, HOne } from "../../../Resources/Components/RouteBox";
import { backDomain } from "../../../Resources/UniversalComponents";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { lightGreyColor, secondaryColor } from "../../../Styles/Styles";
import { ArvinButton } from "../../../Resources/Components/ItemsLibrary";
import { monthInQuestion } from "./RankingComponents";

const medals = [
  {
    place: "🥇 1st",
    img: "https://ik.imagekit.io/vjz75qw96/assets/icons/10.png",
    backgroundColor: "linear-gradient(135deg, gold, yellow)",
    borderRadius: "6px",
  },
  {
    place: "🥈 2nd",
    img: "https://ik.imagekit.io/vjz75qw96/assets/icons/11.png",
    backgroundColor: "linear-gradient(135deg, silver, lightgray)",
    borderRadius: "2rem",
  },
  {
    place: "🥉 3rd",
    img: "https://ik.imagekit.io/vjz75qw96/assets/icons/12.png",
    backgroundColor: "linear-gradient(135deg, orange, #8B4513)",
    borderRadius: "3rem",
  },
];

const ModelListItem = ({
  backgroundColor,
  place,
  picture,
  borderRadius,
  name,
  lastname,
  img,
}) => (
  <AnimatedLi
    style={{
      background: backgroundColor,
      borderRadius,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1.5rem",
      boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
      border: "1px solid #ddd",
      transition: "transform 0.2s",
    }}
    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    <img
      src={picture}
      style={{
        width: "4.5rem",
        height: "4.5rem",
        objectFit: "cover",
        borderRadius: "50%",
        border: "4px solid white",
      }}
    />
    <div
      style={{
        textAlign: "center",
        fontSize: "1.2rem",
        fontWeight: "bold",
        color: "#333",
      }}
    >
      {place} <br /> {name} {lastname}
    </div>
    <img
      src={img}
      style={{ width: "4rem", height: "4rem", objectFit: "cover" }}
    />
  </AnimatedLi>
);

export default function StudentsHistoryOfWinners({ headers, monthNow }) {
  const [students, setStudents] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdm, setIsAdm] = useState(false);
  const actualHeaders = headers || {};

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    setIsAdm(user.permissions === "superadmin");
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await axios.get(
          `${backDomain}/api/v1/scoresranking/`,
          { headers: actualHeaders }
        );
        setStudents(data.listOfStudents);
      } catch (error) {
        console.error("Erro ao buscar alunos", error);
      }
    };

    const fetchHistory = async () => {
      try {
        const { data } = await axios.get(
          `${backDomain}/api/v1/allitemhistory/`,
          { headers: actualHeaders }
        );
        setHistory(data.scoreMonth);
      } catch (error) {
        console.error("Erro ao buscar histórico", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
    fetchHistory();
  }, []);

  const saveMonth = async () => {
    try {
      await axios.post(
        `${backDomain}/api/v1/newitemhistory/`,
        {
          scoreMonth: medals.map((item, index) => ({
            ...item,
            name: students[index]?.name,
            lastname: students[index]?.lastname,
            picture: students[index]?.picture,
          })),
        },
        { headers: actualHeaders }
      );
      setHistory((prev) => [...prev, { score: medals }]);
    } catch (error) {
      console.error("Erro ao salvar mês", error);
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "2rem auto",
        padding: "1.5rem",
        background: "#fff",
        borderRadius: "6px",
        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      {isAdm && (
        <ArvinButton onDoubleClick={saveMonth} style={{ marginBottom: "1rem" }}>
          Gerar Mês De {monthInQuestion}
        </ArvinButton>
      )}
      {loading ? (
        <CircularProgress style={{ color: secondaryColor() }} />
      ) : (
        history.map((month, index) => (
          <ul
            key={index}
            style={{
              background: `${lightGreyColor()} radial-gradient(white, ${lightGreyColor()})`,
              padding: "1.5rem",
              borderRadius: "6px",
              margin: "1rem 0",
              textAlign: "center",
              boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.08)",
            }}
          >
            <HOne>{month?.score[0]?.month}</HOne>
            {month.score.map((item, i) => (
              <ModelListItem
                key={i}
                {...medals[i]}
                name={item.name}
                lastname={item.lastname}
                picture={item.picture}
              />
            ))}
          </ul>
        ))
      )}
    </div>
  );
}
