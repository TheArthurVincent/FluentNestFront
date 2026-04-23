import React, { FC, useEffect, useMemo, useState } from "react";
import { partnerColor } from "../../../Styles/Styles";
import axios from "axios";
import { backDomain } from "../../../Resources/UniversalComponents";
import { PresentationIcon } from "@phosphor-icons/react";

interface ContinueProps {
  actualHeaders?: any;
  studentId?: string;
  isDesktop?: boolean;
}

type LastClassData = {
  href: string;
  image: string;
  title: string;
  moduleTitle: string;
};

const defaultMaterialIllustration =
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80";

export const Continue: FC<ContinueProps> = ({
  actualHeaders,
  studentId,
  isDesktop,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [thePermissions, setPermissions] = useState<any>("");
  const [lastClassData, setLastClassData] = useState<LastClassData>({
    href: "/teaching-materials",
    image: "",
    title: "",
    moduleTitle: "",
  });

  const fetchLastClass = async () => {
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    setPermissions(user.permissions || "");

    const targetId = studentId || user.id;

    if (!targetId) {
      setLastClassData({
        href: "/teaching-materials",
        image: "",
        title: "",
        moduleTitle: "",
      });
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/currentclass/${targetId}`,
        {
          headers: actualHeaders,
        },
      );

      const theClass = response?.data?.theClass;
      console.log("Resposta da última aula:", response.data);
      if (!theClass) {
        setLastClassData({
          href: response.data.theClass
            ? `/teaching-materials/${response.data.theClass.courseId}/${response.data.theClass._id}`
            : "/teaching-materials",
          image: "",
          title: "",
          moduleTitle: "",
        });
        return;
      }

      const classId = theClass?._id || theClass?.classId || theClass?.id || "";
      const moduleId =
        theClass?.courseId ||
        theClass?.moduleId ||
        theClass?.module?._id ||
        theClass?.module?.id ||
        theClass?.module ||
        "";

      const image =
        theClass?.image ||
        theClass?.classImage ||
        theClass?.thumb ||
        theClass?.thumbnail ||
        theClass?.cover ||
        theClass?.coverImage ||
        theClass?.moduleImage ||
        "";

      const title =
        theClass?.title ||
        theClass?.classTitle ||
        theClass?.name ||
        "Última aula recebida";

      const moduleTitle =
        theClass?.moduleTitle ||
        theClass?.module?.title ||
        theClass?.module?.moduleTitle ||
        "";

      const href =
        moduleId && classId
          ? `/teaching-materials/${moduleId}/${classId}`
          : "/teaching-materials";

      setLastClassData({
        href,
        image,
        title,
        moduleTitle,
      });
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar última aula:", error);
      setLastClassData({
        href: "/teaching-materials",
        image: "",
        title: "",
        moduleTitle: "",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLastClass();
  }, [studentId, actualHeaders]);

  const hasLastClass = useMemo(() => {
    return lastClassData.href !== "/teaching-materials";
  }, [lastClassData.href]);

  const titleLine = (() => {
    if (loading) return "Carregando materiais...";
    if (hasLastClass) return "Continue de onde parou";
    return "Materiais de estudos";
  })();

  const descriptionLine = (() => {
    if (loading) return "Buscando sua última aula";
    if (hasLastClass && lastClassData.title) return lastClassData.title;
    return "Acesse suas aulas, conteúdos e materiais";
  })();

  const buttonLabel = (() => {
    if (loading) return "Carregando...";
    if (hasLastClass) return "Abrir última aula";
    return "Acessar materiais";
  })();

  return (
    <div
      style={{
        position: "relative",
        borderRadius: "18px",
        overflow: "hidden",
        marginTop: isDesktop ? 0 : 16,
        height: isDesktop ? "180px" : "160px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        border: `1px solid ${partnerColor()}25`,
      }}
    >
      {/* Background Image */}
      <img
        src={lastClassData.image || defaultMaterialIllustration}
        alt="Background"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Degradê da esquerda */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
          linear-gradient(
            -90deg,
            rgba(0,0,0,0.75) 0%,
            rgba(0,0,0,0.55) 95%,
            rgba(0,0,0,0.15) 70%,
            rgba(0,0,0,0.0) 100%
          )
        `,
        }}
      />

      {/* Conteúdo */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          textAlign: "right",
          gap: "10px",
          padding: "20px",
          maxWidth: "70%",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#ffffffee",
            padding: "6px 10px",
            borderRadius: "999px",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <PresentationIcon size={16} weight="bold" />
          {hasLastClass ? "Última aula" : "Materiais"}
        </div>

        {/* Título */}
        <span
          style={{
            fontFamily: "Lato",
            fontWeight: 700,
            fontSize: isDesktop ? 20 : 17,
            color: "#ffffff",
            lineHeight: 1.3,
          }}
        >
          {titleLine}
        </span>

        {/* Descrição */}
        <span
          style={{
            fontFamily: "Lato",
            fontWeight: 500,
            fontSize: 13,
            color: "#e5e7eb",
          }}
        >
          {descriptionLine}
        </span>

        {/* Botão */}
        <a
          href={lastClassData.href}
          style={{
            marginTop: "4px",
            textDecoration: "none",
            padding: "10px 14px",
            borderRadius: "8px",
            backgroundColor: "#ffffff",
            color: "#030303",
            fontWeight: 700,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {buttonLabel}
          <i className="fa fa-chevron-right" />
        </a>
      </div>
    </div>
  );
};
