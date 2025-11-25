import React, { FC, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import {
  cardBase,
  cardTitle,
  pillStatus,
  statCardBase,
  statLabel,
  statValue,
} from "../../Students/TheStudent/types/studentPage.styles";
import axios from "axios";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { partnerColor } from "../../../../Styles/Styles";
type LastClassProps = {
  headers: MyHeadersType;
  isDesktop?: boolean;
  lastLesson?: any;
  evendId?: string;
  allowedToEdit?: boolean;
};

const LastClass: FC<LastClassProps> = ({
  headers,
  isDesktop,
  lastLesson,
  evendId,
  allowedToEdit,
}) => {
  const renderStatusPill = (status?: string) => {
    if (!status) return null;
    return <span style={pillStatus}>{status}</span>;
  };

  const handleClassSummary = async () => {
    const logged = JSON.parse(localStorage.getItem("loggedIn") || "null");
    const thePermissions = logged?.permissions;
    if (thePermissions == "superadmin" || thePermissions == "teacher") {
      try {
        const response = await axios.put(
          `${backDomain}/api/v1/replicate-last-event/${evendId}`,
          { lastLesson: lastLesson._id },
          { headers: headers as any }
        );
        window.location.reload();
      } catch (error) {
        notifyAlert("Erro", partnerColor());
        console.log(error, "Erro");
      }
    }
  };

  return (
    <div
      style={{
        margin: !isDesktop ? "0px" : "0px 16px 0px 0px",
      }}
    >
      {/* WRAPPER PRINCIPAL */}
      <div
        style={{
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 600,
          fontStyle: "SemiBold",
          fontSize: "14px",
          borderRadius: "12px",
          margin: !isDesktop ? "12px" : "0px",
          display: "grid",
          gridAutoColumns: "1fr",
          gap: 12,
        }}
      >
        <>
          {lastLesson && (
            <div style={cardBase}>
              <div
                style={{
                  ...cardTitle,
                  marginBottom: 12,
                  justifyContent: "space-between",
                }}
              >
                <span>Aula Passada</span>
                {lastLesson.status && renderStatusPill(lastLesson.status)}
              </div>
              <div
                style={{
                  display: "grid",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div style={statCardBase}>
                  <span style={statLabel}>Quando foi</span>
                  <span style={statValue}>
                    {lastLesson.date} ({lastLesson.time})
                  </span>
                </div>{" "}
                <div style={statCardBase}>
                  <span style={statLabel}>Descrição</span>
                  <span style={statValue}>
                    {lastLesson.description || "Sem descrição"}
                  </span>
                </div>{" "}
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                {lastLesson.googleDriveLink && (
                  <a
                    href={lastLesson.googleDriveLink}
                    rel="noreferrer"
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "6px 12px",
                      borderRadius: 999,
                      backgroundColor: partnerColor(),
                      color: "#FFFFFF",
                      textDecoration: "none",
                    }}
                  >
                    Material / Drive
                  </a>
                )}
                {lastLesson.importantLink && !lastLesson.googleDriveLink && (
                  <a
                    href={lastLesson.importantLink}
                    rel="noreferrer"
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "6px 12px",
                      borderRadius: 999,
                      backgroundColor: partnerColor(),
                      color: "#FFFFFF",
                      textDecoration: "none",
                    }}
                  >
                    Link importante
                  </a>
                )}
                {allowedToEdit && (
                  <button
                    style={{
                      marginTop: 8,
                      borderRadius: "8px",
                      backgroundColor: partnerColor(),
                      color: "#FFFFFF",
                      fontWeight: 600,
                      border: "none",
                      maxWidth: "fit-content",
                      cursor: "pointer",
                      marginLeft: " auto",
                    }}
                    onClick={handleClassSummary}
                  >
                    Replicar conteúdo da última aula
                  </button>
                )}{" "}
              </div>
            </div>
          )}
        </>
      </div>

      {isDesktop && (
        <div
          style={{
            minHeight: 200,
          }}
        >
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default LastClass;
