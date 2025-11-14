import React, { FC, useEffect } from "react";
import { partnerColor } from "../../../Styles/Styles";
import axios from "axios";
import { backDomain } from "../../../Resources/UniversalComponents";
import { PresentationIcon } from "@phosphor-icons/react";
interface NextClassProps {
  appLoaded?: boolean;
  actualHeaders?: any;
  isDesktop?: boolean;
}

export const NextClass: FC<NextClassProps> = ({
  appLoaded,
  actualHeaders,
  isDesktop,
}) => {
  const fetchLastClassId = async (classid: string) => {
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/lesson/${classid}`,
        {
          headers: actualHeaders,
        }
      );

      console.log("Fetched lesson:", response.data);
    } catch (error) {}
  };

  useEffect(() => {
    const { lastClassId } = JSON.parse(
      localStorage.getItem("loggedIn") || '""'
    );
    if (lastClassId) {
      console.log("loaded", lastClassId);
      fetchLastClassId(lastClassId);
    }
    console.log("NextClass component loaded", lastClassId);
  }, []);

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
          <PresentationIcon size={20} color={"#030303"} weight="bold" />
          <span>Próxima aula</span>
        </span>
        <span
          style={{
            borderRadius: "16px",
            fontSize: "12px",
            backgroundColor: partnerColor(),
            color: "white",
            fontWeight: "500",
            padding: "8px 12px",
          }}
        >
          <i className="fa fa-circle" style={{ marginRight: "6px" }} />
          Ao vivo
        </span>
      </span>
      <div></div>
    </>
  );
};
