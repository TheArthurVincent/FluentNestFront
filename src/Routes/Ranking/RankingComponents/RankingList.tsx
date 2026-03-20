import React from "react";
import { levels } from "./RankingLevelsList";
import { ImgResponsive } from "../../../Resources/UniversalComponents";

export default function RankingList() {
  const theItems = levels();

  return (
    <div style={{ padding: "1rem" }}>
      <h2
        style={{ textAlign: "center", marginBottom: "1.5rem", color: "#333" }}
      >
        Ranking Levels
      </h2>
      <ul
        style={{
          listStyleType: "none",
          padding: 0,
          display: "grid",
          gap: "1rem",
        }}
      >
        {theItems.map((item, index) => {
          const levelNumber = index;
          const isSpecial = index >= theItems.length - 5; // Verifica se está nos últimos 3 níveis

          return (
            <li
              key={index}
              style={{
                background: isSpecial
                  ? `linear-gradient(135deg, ${theItems[levelNumber].textcolor}, rgba(255, 255, 255, 0.5))`
                  : theItems[levelNumber].color,
                color: theItems[levelNumber].textcolor,
                borderRadius: "6px",
                boxShadow: isSpecial
                  ? "0 0 20px rgba(255, 215, 0, 0.8)"
                  : "0 4px 8px rgba(0, 0, 0, 0.1)",
                border: isSpecial
                  ? "4px solid rgba(255, 255, 255, 0.8)"
                  : "none",
                padding: "1rem",
                display: index >= theItems.length - 2 ? "none" : "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                transform: isSpecial ? "scale(1.05)" : "scale(1)",
              }}
              // onMouseOver={() =>
              //   isSpecial && (document.body.style.cursor = "pointer")
              // }
              onMouseOut={() =>
                isSpecial && (document.body.style.cursor = "default")
              }
            >
              <ImgResponsive
                src={theItems[levelNumber].image2}
                alt={theItems[levelNumber].text}
                style={{
                  width: isSpecial ? "100px" : "80px",
                  height: isSpecial ? "100px" : "80px",
                  marginBottom: "1rem",
                }}
              />
              <div
                style={{
                  marginBottom: "1rem",
                  backgroundColor: theItems[levelNumber].color,
                  padding: "1rem",
                  borderRadius: "6px",
                }}
              >
                <h3
                  style={{
                    fontSize: isSpecial ? "1.5rem" : "1.2rem",
                    fontWeight: isSpecial ? "bold" : "normal",
                    margin: 0,
                    color: theItems[levelNumber].textcolor,
                    textShadow: isSpecial
                      ? "0 0 10px rgba(255, 255, 255, 0.8)"
                      : "none",
                  }}
                >
                  <i
                    className={theItems[levelNumber].icon}
                    aria-hidden="true"
                    style={{
                      marginRight: "0.5rem",
                      fontSize: isSpecial ? "1.5rem" : "1rem",
                    }}
                  />
                  Level {index + 1}
                </h3>
                <p
                  style={{
                    margin: "0.5rem 0",
                    fontSize: "1rem",
                    color: isSpecial ? "#fff" : "inherit",
                  }}
                >
                  {theItems[levelNumber].text}
                </p>
              </div>
              <div
                style={{
                  background: theItems[levelNumber].backgroundcolor,
                  borderRadius: "6px",
                  padding: "0.5rem 1rem",
                  textAlign: "left",
                  width: "100%",
                  fontSize: "0.9rem",
                }}
              >
                <p style={{ margin: "0.5rem 0" }}>
                  <strong>Total Score:</strong> {item.totalScore}
                </p>
                <p style={{ margin: "0.5rem 0" }}>
                  <strong>Homework:</strong> {item.homeworkAssignmentsDone}
                </p>
                <p style={{ margin: "0.5rem 0" }}>
                  <strong>25 Flashcards/Day:</strong> {item.flashcards25Reviews}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
