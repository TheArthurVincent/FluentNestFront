import React, { FC, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import {
  cardBase,
  cardTitle,
  pillStatus,
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
  replicateLastEvent?: boolean;
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#606060",
};

const valueStyle: React.CSSProperties = {
  fontWeight: 600,
  color: "#030303",
  fontSize: 13,
  whiteSpace: "pre-wrap",
};

const btnStyle: React.CSSProperties = {
  padding: "8px 12px",
  backgroundColor: partnerColor(),
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 700,
};

const linkGhostStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  padding: "6px 10px",
  borderRadius: 6,
  border: `1px solid ${partnerColor()}`,
  color: partnerColor(),
  textDecoration: "none",
  background: "#fff",
};

const linkPrimaryStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  padding: "6px 10px",
  borderRadius: 6,
  backgroundColor: partnerColor(),
  color: "#FFFFFF",
  textDecoration: "none",
};

const LastClass: FC<LastClassProps> = ({
  headers,
  isDesktop,
  lastLesson,
  evendId,
  allowedToEdit,
  replicateLastEvent,
}) => {
  const renderStatusPill = (status?: string) => {
    if (!status) return null;
    return <span style={pillStatus}>{status}</span>;
  };

  const handleClassSummary = async () => {
    const logged = JSON.parse(localStorage.getItem("loggedIn") || "null");
    const thePermissions = logged?.permissions;

    if (thePermissions === "superadmin" || thePermissions === "teacher") {
      try {
        await axios.put(
          `${backDomain}/api/v1/replicate-last-event/${evendId}`,
          { lastLesson: lastLesson._id },
          { headers: headers as any },
        );
        window.location.reload();
      } catch (error) {
        notifyAlert("Erro", partnerColor());
        console.log(error, "Erro");
      }
    }
  };

  return (
    <div style={{ margin: !isDesktop ? "0px" : "0px 16px 0px 0px" }}>
      <div
        style={{
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 600,
          fontSize: "14px",
          borderRadius: "6px",
          margin: !isDesktop ? "12px" : "0px",
          display: "grid",
          gap: 12,
        }}
      >
        {lastLesson && (
          <div
            style={{
              ...cardBase,
              gap: 10,
            }}
          >
            <div
              style={{
                ...cardTitle,
                marginBottom: 6,
                justifyContent: "space-between",
                fontSize: 14,
              }}
            >
              <span>Aula Passada</span>
              {lastLesson.status && renderStatusPill(lastLesson.status)}
            </div>

            <div
              style={{
                marginTop: 4,
                borderLeft: `4px solid ${partnerColor()}`,
                paddingLeft: 12,
                display: "grid",
                gap: 8,
              }}
            >
              <div style={{ display: "grid", gap: 3 }}>
                <span style={labelStyle}>Quando foi</span>
                <span style={valueStyle}>
                  {lastLesson.date} ({lastLesson.time})
                </span>
              </div>

              <div style={{ display: "grid", gap: 3 }}>
                <span style={labelStyle}>Descrição</span>
                <span style={valueStyle}>
                  {lastLesson.description || "Sem descrição"}
                </span>
              </div>

              <div style={{ display: "grid", gap: 3 }}>
                <span style={labelStyle}>Descrição do Professor</span>
                <span
                  style={{
                    ...valueStyle,
                    fontStyle: "italic",
                    color: "#4B5563",
                  }}
                >
                  {lastLesson.teacherDescription || "Sem descrição"}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 8,
              }}
            >
              {lastLesson.googleDriveLink && (
                <a
                  href={lastLesson.googleDriveLink}
                  rel="noreferrer"
                  style={linkGhostStyle}
                >
                  Important Link
                </a>
              )}

              {lastLesson.importantLink && !lastLesson.googleDriveLink && (
                <a
                  href={lastLesson.importantLink}
                  rel="noreferrer"
                  style={linkPrimaryStyle}
                >
                  Link importante
                </a>
              )}

              {allowedToEdit && replicateLastEvent && (
                <button
                  style={{
                    ...btnStyle,
                    marginLeft: "auto",
                    opacity: !evendId ? 0.7 : 1,
                  }}
                  onClick={handleClassSummary}
                  disabled={!evendId}
                  title={!evendId ? "Evento atual não encontrado" : ""}
                >
                  Replicar conteúdo
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {isDesktop && (
        <div style={{ minHeight: 200 }}>
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default LastClass;
