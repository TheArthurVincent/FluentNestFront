import React, { useState } from "react";
import { motion } from "framer-motion";
import { partnerColor } from "../../Styles/Styles";

interface StreakProps {
  streak: number;
  longest: number;
  message: string;
  studentLongest: string;
  yourLongest: number;
}

export const Streak: React.FC<StreakProps> = ({
  streak,
  message,
  longest,
  yourLongest,
  studentLongest,
}) => {
  const [showModal, setShowModal] = useState(false);
  const progressPercentage = Math.min((streak / longest) * 100, 100);

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
        onClick={() => setShowModal(true)}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#f5f5f5")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        {/* Indicador atual/record */}
        <div
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: partnerColor(),
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          {streak}/{longest}
          <span
            style={{
              fontSize: "11px",
              fontWeight: "400",
              color: "#666",
              marginLeft: "4px",
            }}
          >
            days
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
              backgroundColor: partnerColor(),
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
                📊 Streak Details
              </h3>
            </div>

            {/* Current Streak */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
                padding: "16px",
                backgroundColor: "#f8f9fa",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: partnerColor(),
                  marginBottom: "4px",
                }}
              >
                {streak} days
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Current Streak
              </div>
            </div>

            {/* Stats */}
            <div style={{ marginBottom: "20px" }}>
              {/* Global Record */}
              {studentLongest && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      🏆 Global Record
                    </div>
                    <div style={{ fontSize: "10px", color: "#999" }}>
                      by {studentLongest}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    {longest} days
                  </div>
                </div>
              )}

              {/* Personal Best */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    📈 Your Best
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  {yourLongest || 0} days
                </div>
              </div>
              {/* At All Best */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    📈 Your Current Streak
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  {streak || 0} days
                </div>
              </div>
              {/* Progress */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    📊 Progress to Record
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
                backgroundColor: "#f8f9fa",
                borderRadius: "6px",
                marginBottom: "16px",
              }}
            >
              {streak === longest ? (
                <div
                  style={{
                    color: partnerColor(),
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  🎉 NEW RECORD HOLDER!
                </div>
              ) : streak > 0 && streak < longest ? (
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {longest - streak} days to beat the record
                </div>
              ) : (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    fontStyle: "italic",
                  }}
                >
                  {message}
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
