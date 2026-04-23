import React, { useEffect, useState } from "react";
import { HeadersProps } from "../../../Resources/types.universalInterfaces";
import { backDomain, updateInfo } from "../../../Resources/UniversalComponents";
import axios from "axios";
import { partnerColor } from "../../../Styles/Styles";
import Helmets from "../../../Resources/Helmets";
import Tokens from "../../Tokens";
import { User } from "../../MyProfile/types.MyProfile";
import ModalShowAllCORINGA from "./ModalAll/NewHomePageArvin";
import { Continue } from "../Continue/Continue";

type MyHomePageProps = HeadersProps & {
  change?: boolean;
  setChange?: any;
  isDesktop: boolean;
  actualHeaders?: any;
};

type HomeCardItem = {
  showToStudent: boolean;
  showToTeacher: boolean;
  title: string;
  href: string;
  type: "materials" | "flashcards" | "sentence-mining";
};

export const newArvinTitleStyle = {
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontSize: 24,
};

const cardIllustrations: Record<HomeCardItem["type"], string> = {
  materials:
    "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80",
  flashcards:
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
  "sentence-mining":
    "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1200&q=80",
};

const cardVisualContent: Record<
  HomeCardItem["type"],
  {
    icon: string;
    title: string;
    subtitle: string;
  }
> = {
  materials: {
    icon: "fa-book",
    title: "Cursos e conteúdos",
    subtitle: "Acesse seus materiais",
  },
  flashcards: {
    icon: "fa-clone",
    title: "Revisão rápida",
    subtitle: "Pratique com flashcards",
  },
  "sentence-mining": {
    icon: "fa-quote-left",
    title: "Frases úteis",
    subtitle: "Explore a mineração",
  },
};

export function MyHomePage({
  headers,
  change,
  isDesktop,
  actualHeaders,
}: MyHomePageProps) {
  const [monthlyScore, setMonthlyScore] = useState(0);
  const [PERMISSIONS, setPERMISSIONS] = useState<
    "student" | "teacher" | "superadmin" | ""
  >("");
  const [studentPicture, setStudentPicture] = useState("");
  const [id, setId] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [universalWarning, setUniversalWarning] = useState(false);
  const [user, setUser] = useState<User>({} as User);

  const seeScore = async (userId: string) => {
    try {
      updateInfo(userId, headers);

      const response = await axios.get(`${backDomain}/api/v1/score/${userId}`, {
        headers: headers ? { ...headers } : {},
      });

      setMonthlyScore(response.data.monthlyScore);
      setStudentPicture(response.data.picture);
    } catch (error) {
      console.error(error);
    }
  };

  const isUniversalWarning = async (userId: string) => {
    try {
      updateInfo(userId, headers);

      const response = await axios.get(
        `${backDomain}/api/v1/universal-warning/${userId}`,
        {
          headers: headers ? { ...headers } : {},
        },
      );

      setUniversalWarning(response.data.universalWarning);
    } catch (error) {
      console.error(error);
    }
  };

  const turnOffUniversalWarning = async () => {
    if (!id) return;

    try {
      await axios.put(
        `${backDomain}/api/v1/universal-warning/${id}`,
        {},
        {
          headers: headers ? { ...headers } : {},
        },
      );

      setUniversalWarning(false);
      updateInfo(id, headers);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const userLocal = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const userId = userLocal.id;
    const permissions = userLocal.permissions || "";

    setUser(userLocal);
    setStudentId(userId);
    setId(userId);
    setPERMISSIONS(permissions);

    if (userId) {
      seeScore(userId);
      isUniversalWarning(userId);
    }
  }, [change]);

  const cards: HomeCardItem[] = [
    {
      showToStudent: false,
      showToTeacher: true,
      title: "Materiais de estudos",
      href: "/teaching-materials",
      type: "materials",
    },
    {
      showToStudent: false,
      showToTeacher: true,
      title: "Flashcards",
      href: "/flash-cards",
      type: "flashcards",
    },
    {
      showToStudent: false,
      showToTeacher: true,
      title: "Mineração de Sentenças",
      href: "/sentence-mining",
      type: "sentence-mining",
    },
  ];

  const canSee = (
    item: Pick<HomeCardItem, "showToStudent" | "showToTeacher">,
  ) => {
    if (PERMISSIONS === "teacher" || PERMISSIONS === "superadmin") {
      return item.showToTeacher;
    }

    return item.showToStudent;
  };

  const visibleCards = cards.filter(canSee);

  const renderCardVisual = (item: HomeCardItem) => {
    const visual = cardVisualContent[item.type];
    const image = cardIllustrations[item.type];

    return (
      <div
        style={{
          width: "100%",
          height: "110px",
          borderRadius: "14px",
          overflow: "hidden",
          position: "relative",
          background:
            "linear-gradient(135deg, rgba(84,191,8,0.14), rgba(84,191,8,0.04))",
          border: "1px solid rgba(84,191,8,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={image}
          alt={item.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.22,
            display: "block",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(84,191,8,0.18), rgba(255,255,255,0.08))",
          }}
        />

        <div
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: partnerColor(),
            padding: "0 14px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              backgroundColor: "#ffffffdd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              flexShrink: 0,
            }}
          >
            <i
              className={`fa ${visual.icon}`}
              style={{
                fontSize: "20px",
                color: partnerColor(),
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 1.2,
            }}
          >
            <span
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 700,
                fontSize: "14px",
                color: "#1D2939",
              }}
            >
              {visual.title}
            </span>

            <span
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 500,
                fontSize: "12px",
                color: "#475467",
              }}
            >
              {visual.subtitle}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        margin: isDesktop ? "0px 16px 0px 0px" : "0px",
      }}
    >
      {isDesktop && (
        <div
          style={{
            paddingTop: 29,
            paddingBottom: 17,
            display: "flex",
            alignItems: "center",
          }}
        >
          <section
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "8px",
              width: "100%",
            }}
          >
            <span style={newArvinTitleStyle}>Início</span>
          </section>
        </div>
      )}

      <Continue
        actualHeaders={actualHeaders}
        studentId={studentId}
        isDesktop={isDesktop}
      />

      <ModalShowAllCORINGA
        universalWarning={universalWarning}
        onClose={() => window.location.reload()}
        user={user}
        headers={actualHeaders}
        isDesktop={isDesktop}
        onSaved={async () => {
          await turnOffUniversalWarning();
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isDesktop ? "repeat(3, 1fr)" : "1fr",
          gap: "16px",
          paddingBottom: "64px",
        }}
      >
        {visibleCards.map((item) => (
          <a
            key={item.type}
            href={item.href}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "18px",
              border: "1px solid #E3E8F0",
              padding: "14px",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "210px",
              gap: "16px",
              boxShadow: "0 8px 30px rgba(16, 24, 40, 0.04)",
              transition: "transform 0.18s ease, box-shadow 0.18s ease",
            }}
          >
            {renderCardVisual(item)}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <span
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#030303",
                  lineHeight: 1.4,
                }}
              >
                {item.title}
              </span>

              <span
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: 700,
                  fontSize: "11px",
                  textTransform: "uppercase",
                  display: "flex",
                  color: partnerColor(),
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Acessar
                <i className="fa fa-chevron-right" />
              </span>
            </div>
          </a>
        ))}
      </div>

      <Helmets text="Início" />
    </div>
  );
}

export default MyHomePage;
