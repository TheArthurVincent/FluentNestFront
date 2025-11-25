import React, { FC, useEffect } from "react";
import { partnerColor } from "../../../Styles/Styles";
import axios from "axios";
import { backDomain } from "../../../Resources/UniversalComponents";
import { PlayIcon } from "@phosphor-icons/react";

interface ContinueProps {
  actualHeaders?: any;
  isDesktop?: boolean;
}

export const Continue: FC<ContinueProps> = ({ actualHeaders, isDesktop }) => {
  const [courseTitle, setCourseTitle] = React.useState("");
  const [courseId, setCourseId] = React.useState("");
  const [classId, setClassId] = React.useState<string>("");
  const [img, setImg] = React.useState(
    "https://ik.imagekit.io/vjz75qw96/assets/icons/mustshould.png?updatedAt=1748264443512"
  );
  const [loadingLESSON, setLoadingLESSON] = React.useState(false);
  const [hasData, setHasData] = React.useState(false);
  const [isRealClass, setIsRealClass] = React.useState(false);
  const fetchLastClassId = async (classid: string) => {
    setLoadingLESSON(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/lesson/${classid}`,
        {
          headers: actualHeaders,
        }
      );

      const courseTitleResp =
        response.data?.classDetails?.title ||
        response.data?.classDetails?.student ||
        "";
      const isc = response.data?.isClass || false;
      const courseResp = response.data?.classDetails?.courseId || "";
      const theImg =
        response.data?.classDetails?.image ||
        "https://ik.imagekit.io/vjz75qw96/assets/icons/mustshould.png?updatedAt=1748264443512";

      setImg(theImg);
      setCourseTitle(courseTitleResp);
      setCourseId(courseResp);
      setClassId(classid);
      setIsRealClass(isc);
      setHasData(true);
      setLoadingLESSON(false);
    } catch (error) {
      console.error("Erro ao buscar última aula:", error);
      setHasData(false);
      setLoadingLESSON(false);
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("loggedIn");
      if (!stored) return;

      const parsed = JSON.parse(stored);
      const lastClassId = parsed?.lastClassId;

      if (lastClassId) {
        console.log("loaded lastClassId:", lastClassId);
        fetchLastClassId(lastClassId);
      }
    } catch (err) {
      console.error("Erro ao ler lastClassId do localStorage:", err);
    }
  }, []);

  const href =
    hasData && courseId && classId && isRealClass
      ? `/teaching-materials/${courseId}/${classId}`
      : !isRealClass && classId && hasData
      ? `/my-calendar/event/${classId}`
      : "/teaching-materials/english-grammar/667ac39b4b4d6245dc8f385b";

  return (
    <div
      style={{
        border: `1px solid ${partnerColor()}50`,
        backgroundImage: `linear-gradient(180deg, ${partnerColor()}15 70%, ${partnerColor()}05 100%)`,
        borderRadius: "16px",
        marginTop: isDesktop ? 0 : 16,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "start",
          justifyContent: "space-between",
          justifyItems: "center",
        }}
      >
        <p
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 700,
            fontStyle: "Bold",
            fontSize: 14,
            lineHeight: "100%",
            letterSpacing: "4%",
            textTransform: "uppercase",
            color: partnerColor(),
          }}
        >
          PLANO DO DIA
        </p>

        <div>
          <p
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 700,
              fontStyle: "Bold",
              fontSize: isDesktop ? 28 : 20,
              letterSpacing: "0%",
              color: "#030303",
            }}
          >
            Continue de onde parou
          </p>
          <p
            style={{
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 600,
              fontStyle: "SemiBold",
              fontSize: 14,
              marginTop: 8,
              lineHeight: "100%",
              letterSpacing: "0%",
              color: "#65748C",
            }}
          >
            Retome sua última aula.
          </p>

          {loadingLESSON ? (
            <p
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontSize: 12,
                color: "#65748C",
                marginTop: 12,
              }}
            >
              Carregando última aula...
            </p>
          ) : (
            <>
              {hasData && (
                <div
                  style={{
                    marginTop: 12,
                    marginBottom: 8,
                    fontFamily: "Plus Jakarta Sans",
                    fontSize: 13,
                    color: "#4B5563",
                  }}
                >
                  {courseTitle && <div>Aula: {courseTitle}</div>}
                </div>
              )}

              <a
                href={href}
                style={{
                  textDecoration: "none",
                  padding: "16px 11px",
                  borderRadius: "8px",
                  border: `1px solid ${partnerColor()}45`,
                  marginTop: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  textAlign: isDesktop ? "center" : "left",
                  cursor: "pointer",
                  width: isDesktop ? "fit-content" : "100%",
                  backgroundColor: `${partnerColor()}30`,
                }}
              >
                <PlayIcon color="#030303" weight="bold" size={16} />
                <span
                  style={{
                    fontFamily: "Plus Jakarta Sans",
                    fontWeight: 600,
                    fontStyle: "SemiBold",
                    fontSize: 14,
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    color: "#030303",
                    display: "flex",
                  }}
                >
                  Última aula acessada
                </span>
              </a>
            </>
          )}
        </div>
      </div>

      {isDesktop && (
        <img
          src={img}
          alt={
            courseTitle
              ? `Imagem da aula ${courseTitle}`
              : "Imagem da última aula"
          }
          style={{
            borderRadius: "8px",
            maxWidth: "150px",
            width: "100%",
            objectFit: "cover",
            WebkitMaskImage:
              "linear-gradient(to left, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)",
            maskImage:
              "linear-gradient(to left, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)",
          }}
        />
      )}
    </div>
  );
};
