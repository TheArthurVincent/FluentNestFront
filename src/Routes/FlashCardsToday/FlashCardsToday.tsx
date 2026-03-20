import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { partnerColor } from "../../Styles/Styles";

interface ProgressCounterProps {
  flashcardsToday: number;
  see?: boolean;
  nSeeM?: boolean;
}

export const ProgressCounter: React.FC<ProgressCounterProps> = ({
  flashcardsToday,
  see,
  nSeeM,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const progressPercentage = Math.min((flashcardsToday / 25) * 100, 100);
  const isCompleted = flashcardsToday >= 25;

  useEffect(() => {
    if (flashcardsToday === 25) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [flashcardsToday, see]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          padding: "8px",
          borderRadius: "6px",
          transition: "background-color 0.2s",
        }}
        onClick={() =>
          nSeeM ? window.location.assign("/flash-cards") : setShowModal(true)
        }
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#f5f5f5")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        {showConfetti && <Confetti numberOfPieces={200} />}

        {/* Indicador atual/meta */}
        <div
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: partnerColor(),
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          {flashcardsToday}/25
          <span
            style={{
              fontSize: "11px",
              fontWeight: "400",
              color: "#666",
              marginLeft: "4px",
            }}
          >
            flashcards
          </span>
        </div>

        {/* Barra de progresso */}
        <div
          style={{
            width: "100%",
            height: "12px",
            backgroundColor: "#e0e0e0",
            borderRadius: "6px",
            overflow: "hidden",
            margin: "5px 0",
            position: "relative",
          }}
        >
          <motion.div
            style={{
              height: "100%",
              backgroundColor: isCompleted ? "#4CAF50" : partnerColor(),
              borderRadius: "6px",
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Indicador de porcentagem */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "8px",
              fontWeight: "600",
              color: progressPercentage > 50 ? "#fff" : "#333",
              textShadow:
                progressPercentage > 50 ? "0 1px 1px rgba(0,0,0,0.3)" : "none",
            }}
          >
            {Math.round(progressPercentage)}%
          </div>
        </div>

        {/* Hint para clicar */}
        {/* <div
          style={{
            fontSize: "8px",
            color: "#999",
            marginTop: "4px",
            opacity: 0.7,
          }}
        >
          👆 Click for details
        </div> */}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: "#fff",
              borderRadius: "6px",
              padding: "24px",
              maxWidth: "320px",
              width: "90%",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
                borderBottom: "1px solid #eee",
                paddingBottom: "16px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "600",
                  color: partnerColor(),
                }}
              >
                📚 Daily Progress
              </h3>
            </div>

            {/* Current Progress */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
                padding: "16px",
                backgroundColor: isCompleted ? "#e8f5e8" : "#f8f9fa",
                borderRadius: "6px",
                border: isCompleted ? "2px solid #4CAF50" : "none",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: isCompleted ? "#4CAF50" : partnerColor(),
                  marginBottom: "4px",
                }}
              >
                {flashcardsToday}/25
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Flashcards Today
              </div>
              {isCompleted && (
                <div
                  style={{
                    fontSize: "10px",
                    color: "#4CAF50",
                    marginTop: "4px",
                    fontWeight: "600",
                  }}
                >
                  ✅ GOAL ACHIEVED!
                </div>
              )}
            </div>

            {/* Stats */}
            <div style={{ marginBottom: "20px" }}>
              {/* Daily Goal */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    🎯 Daily Goal
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  25 flashcards
                </div>
              </div>

              {/* Completed Today */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    ✅ Completed Today
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: isCompleted ? "#4CAF50" : "#333",
                  }}
                >
                  {flashcardsToday} flashcards
                </div>
              </div>

              {/* Remaining */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    📝 Remaining
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: isCompleted ? "#4CAF50" : "#ff9800",
                  }}
                >
                  {Math.max(0, 25 - flashcardsToday)} flashcards
                </div>
              </div>

              {/* Progress Percentage */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    📊 Progress
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: partnerColor(),
                  }}
                >
                  {Math.round(progressPercentage)}%
                </div>
              </div>
            </div>

            {/* Status Messages */}
            <div
              style={{
                textAlign: "center",
                padding: "12px",
                backgroundColor: isCompleted ? "#e8f5e8" : "#f8f9fa",
                borderRadius: "6px",
                marginBottom: "16px",
              }}
            >
              {isCompleted ? (
                <div>
                  <div
                    style={{
                      color: "#4CAF50",
                      fontWeight: "600",
                      fontSize: "14px",
                      marginBottom: "4px",
                    }}
                  >
                    🎉 Daily goal completed!
                  </div>
                  {flashcardsToday > 25 && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#4CAF50",
                        fontWeight: "600",
                      }}
                    >
                      +{flashcardsToday - 25} bonus flashcards!
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ fontSize: "12px", color: "#666" }}>
                  📚 {25 - flashcardsToday} more flashcards to reach today's
                  goal
                </div>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: partnerColor(),
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
};
