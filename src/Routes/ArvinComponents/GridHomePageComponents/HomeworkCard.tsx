import React, { FC, useEffect } from "react";
import { partnerColor } from "../../../Styles/Styles";
import axios from "axios";
import { backDomain } from "../../../Resources/UniversalComponents";
import { FileTextIcon } from "@phosphor-icons/react";
interface HomeworkCardProps {
  appLoaded?: boolean;
  actualHeaders?: any;
  isDesktop?: boolean;
  studentId?: string;
}

export const HomeworkCard: FC<HomeworkCardProps> = ({
  appLoaded,
  actualHeaders,
  isDesktop,
  studentId,
}) => {
  // ====== GET recommended classes ======

  const [studentIdState, setStudentIdState] = React.useState<string | null>(
    null,
  );
  const [loading, setLoading] = React.useState(true);
  const [homeworkData, setHomeworkData] = React.useState<any>(null);

  const seeLastHw = async () => {
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/last-hw/${studentId}`,
        {
          headers: actualHeaders ? { ...actualHeaders } : {},
        },
      );
      setHomeworkData(response.data.homework[0].description);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    seeLastHw();
  }, [appLoaded, actualHeaders, studentId]);

  return (
    <>
      <span
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "600",
            color: "#030303",
          }}
        >
          <FileTextIcon size={20} color={"#030303"} weight="bold" />
          <span>Trabalhos de casa</span>
        </span>
      </span>
      <div
        style={{
          marginTop: "16px",
          fontFamily: "Lato",
          fontWeight: 500,
          fontSize: "12px",
          padding: "8px 0",
          color: "#030303",
          maxWidth: "100%",
          maxHeight: "150px",
          overflowY: "auto",
          scrollbarColor: `${partnerColor()}50 #FFFFFF`,
          scrollbarWidth: "thin",
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: homeworkData }} />
      </div>
      <a
        href={`/my-homework-and-lessons/${studentId}`}
        style={{
          fontFamily: "Lato",
          fontWeight: 700,
          fontStyle: "Bold",
          marginTop: "20px",
          fontSize: "12px",
          lineHeight: "100%",
          textTransform: "uppercase",
          letterSpacing: "0%",
          cursor: "pointer",
          textDecoration: "none",
          display: "flex",
          color: partnerColor(),
          alignItems: "center",
          gap: "8px",
        }}
      >
        Acessar
        <i className="fa fa-chevron-right" />
      </a>
    </>
  );
};
