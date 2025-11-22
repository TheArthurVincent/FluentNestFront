import React, { FC } from "react";
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
type LastClassProps = {
  headers: MyHeadersType;
  isDesktop?: boolean;
  lastLesson?: any;
};

const LastClass: FC<LastClassProps> = ({ headers, isDesktop, lastLesson }) => {
  const renderStatusPill = (status?: string) => {
    if (!status) return null;
    return <span style={pillStatus}>{status}</span>;
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
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div style={statCardBase}>
                  <span style={statLabel}>Material</span>
                  <span style={statValue}>
                    {lastLesson.theLesson?.title || "Sem título"}
                  </span>
                </div>

                <div style={statCardBase}>
                  <span style={statLabel}>Quando foi</span>
                  <span style={statValue}>
                    {lastLesson.date} ({lastLesson.time})
                  </span>
                </div>
              </div>

              {lastLesson.description && (
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#4B5563",
                    marginBottom: 10,
                  }}
                >
                  {lastLesson.description}
                </div>
              )}

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
                      backgroundColor: "#1D4ED8",
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
                      backgroundColor: "#1D4ED8",
                      color: "#FFFFFF",
                      textDecoration: "none",
                    }}
                  >
                    Link importante
                  </a>
                )}
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
