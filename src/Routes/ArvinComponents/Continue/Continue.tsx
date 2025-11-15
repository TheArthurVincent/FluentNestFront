import React, { FC, useEffect } from "react";
import { partnerColor } from "../../../Styles/Styles";
import axios from "axios";
import { backDomain } from "../../../Resources/UniversalComponents";
interface ContinueProps {
  appLoaded?: boolean;
  actualHeaders?: any;
  isDesktop?: boolean;
}

export const Continue: FC<ContinueProps> = ({
  appLoaded,
  actualHeaders,
  isDesktop,
}) => {
  const [course, setCourse] = React.useState("");
  const [lesson, setLesson] = React.useState("");
  const [img, setImg] = React.useState(
    "https://ik.imagekit.io/vjz75qw96/assets/icons/mustshould.png?updatedAt=1748264443512"
  );
  const [loadingLESSON, setLoadingLESSON] = React.useState(false);
  const [no, setNo] = React.useState(true);

  const fetchLastClassId = async (classid: string) => {
    setLoadingLESSON(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/lesson/${classid}`,
        {
          headers: actualHeaders,
        }
      );

      var cour = response.data.course.title;
      var less = response.data.classDetails.title;
      var imgg = response.data.classDetails.image
        ? response.data.classDetails.image
        : "https://ik.imagekit.io/vjz75qw96/assets/icons/mustshould.png?updatedAt=1748264443512";
      setCourse(cour);
      setLesson(less);
      setImg(imgg);
      setLoadingLESSON(false);
    } catch (error) {
      setNo(false);
      setLoadingLESSON(false);
    }
  };

  useEffect(() => {
    const { lastClassId } = JSON.parse(
      localStorage.getItem("loggedIn") || '""'
    );
    if (lastClassId) {
      console.log("loaded", lastClassId);
      fetchLastClassId(lastClassId);
    }
    console.log("Continue component loaded", lastClassId);
  }, []);

  return (
    <div
      style={{
        border: `1px solid ${partnerColor()}50`,
        backgroundImage: `linear-gradient(180deg, ${partnerColor()}15 70%, ${partnerColor()}05 100%)`,
        borderRadius: "16px",
        marginTop: isDesktop ? 0 : 85,
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
              fontSize: 28,
              lineHeight: "100%",
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
            Retome sua última aula e mantenha o foco na meta de hoje.
          </p>
          <a
            href=""
            style={{
              textDecoration: "none",
              padding: "16px 11px",
              borderRadius: "8px",
              border: `1px solid ${partnerColor()}45`,
              marginTop: 16,
              display: "flex",
              cursor: "pointer",
              width: "fit-content",
              backgroundColor: `${partnerColor()}20`,
            }}
          >
            <span
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 600,
                fontStyle: "SemiBold",
                fontSize: 14,
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#030303",
              }}
            >
              Última aula acessada
            </span>
          </a>
        </div>
      </div>
      <img
        src={img}
        alt={`Imagem da aula ${lesson}`}
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
    </div>
  );
};
