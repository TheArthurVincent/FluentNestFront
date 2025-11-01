import React, { useEffect, useMemo, useState } from "react";
import "./styles.arvinNewLp.css";
import {
  CheckCircleIcon,
  CheckIcon,
  ListIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { featuresArvin } from "./assetsLandingPageArvin/featuresArvin";
import { fontSize } from "@mui/system";

const safeStorage = {
  get(key: any, fallback = null) {
    try {
      if (typeof window === "undefined") return fallback;
      const v = window.localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: any, value: any) {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  remove(keys: any) {
    try {
      if (typeof window === "undefined") return;
      keys.forEach((k: any) => window.localStorage.removeItem(k));
    } catch {}
  },
};

function ArvinLandingPageNew() {
  const itemsOfPage = useMemo(
    () => [
      {
        title: "👨‍🏫 Gestão de Alunos",
        description:
          "Organize turmas, acompanhe o desempenho e facilite o controle dos seus alunos.",
        href: "gestao-alunos",
        video: "https://www.youtube.com/watch?v=esFGOKs5hPI",
      },
      {
        title: "📚 Materiais de Aula",
        description:
          "Tenha acesso a materiais prontos e organizados, do nível básico ao avançado, para usar em suas aulas de gramática, vocabulário, leitura, escuta e conversação.",
        href: "materiais-aula",
        video: "https://www.youtube.com/watch?v=sm8xx9d6uRU",
      },
      {
        title: "🌍 2 Idiomas Para Ensinar",
        description:
          "Conte com materiais de inglês e espanhol para oferecer mais opções aos seus alunos.",
        href: "2-idiomas",
        imgs: [
          "https://ik.imagekit.io/vjz75qw96/assets/icons/Arvin/Screenshots/arvinlg.png?updatedAt=1759444234870",
          "https://ik.imagekit.io/vjz75qw96/assets/icons/Arvin/Screenshots/espen.png?updatedAt=1759444234580",
          "https://ik.imagekit.io/vjz75qw96/assets/icons/Arvin/Screenshots/screen%20(4).png?updatedAt=1759444234627",
          "https://ik.imagekit.io/vjz75qw96/assets/icons/Arvin/Screenshots/quest.png?updatedAt=1759444312417",
        ],
      },
      {
        title: "🎧 Ferramentas De Estudos Para Alunos",
        description:
          "Forneça flashcards e exercícios de escuta e escrita para potencializar o aprendizado dos seus alunos.",
        href: "ferramentas-alunos",
      },
      {
        title: "🎨 Personalização da Plataforma",
        description:
          "Adapte a plataforma ao seu estilo de ensino e ofereça uma experiência única aos seus alunos.",
        href: "personalizacao",
      },
      {
        title: "💰 Gestão Financeira",
        description:
          "Controle pagamentos, organize suas finanças e mantenha a sustentabilidade do seu negócio de aulas particulares.",
        href: "gestao-financeira",
        imgs: [
          "https://ik.imagekit.io/vjz75qw96/assets/icons/financ?updatedAt=1758412532112",
          "https://ik.imagekit.io/vjz75qw96/assets/icons/fic?updatedAt=1758412532107",
        ],
      },
      {
        title: "✨ Assistente de IA",
        description:
          "Gerencie seu negócio e conteúdo educacional de forma automatizada e personalizada.",
        href: "assistente-ia",
      },
    ],
    []
  );

  const getWhatsAppLink = () => {
    const message = `Olá, gostaria de fazer saber mais sobre a plataforma ARVIN.`;
    return `https://wa.me/5511972369299?text=${encodeURIComponent(message)}`;
  };

  useEffect(() => {
    const keysToDrop = [
      "loggedIn",
      "selectedStudentID",
      "authorization",
      "whiteLabel",
      "notifications",
      "voiceGender",
      "voiceLang",
      "voiceOption",
      "flashcardsToday",
    ];
    safeStorage.remove(keysToDrop);
  }, []);

  const languages = [
    { code: "en", label: "English", flag: "https://flagcdn.com/gb.svg" },
    { code: "pt", label: "Português", flag: "https://flagcdn.com/br.svg" },
    { code: "es", label: "Español", flag: "https://flagcdn.com/es.svg" },
    { code: "fr", label: "Français", flag: "https://flagcdn.com/fr.svg" },
  ];

  const defaultLang = useMemo(() => {
    const stored = safeStorage.get("arvin_selected_lang");
    const found = languages.find((l) => l.code === stored?.code);
    return found || languages[1];
  }, []);

  const [selectedLang, setSelectedLang] = useState<any>(defaultLang);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchor);

  const handleButtonClick = (e: any) => setMenuAnchor(e.currentTarget);
  const handleClose = () => setMenuAnchor(null);

  const handleSelect = (lang: any) => {
    setSelectedLang(lang);
    safeStorage.set("arvin_selected_lang", lang);
    handleClose();
  };
  const [selectedToggle, setSelectedToggle] = useState(1);

  const selectedToggle1 = {
    cursor: "pointer",
    borderRadius: "30px",
    fontSize: "14px",
    paddingTop: "13px",
    paddingRight: "24px",
    paddingBottom: "13px",
    paddingLeft: "24px",
    backgroundColor: selectedToggle == 1 ? "#ED5914" : "#101721",
    color: "#FFF",
    fontFamily: "Plus Jakarta Sans",
  };

  const selectedToggle2 = {
    borderRadius: "30px",
    cursor: "pointer",
    fontSize: "14px",
    paddingTop: "13px",
    paddingRight: "24px",
    paddingBottom: "13px",
    paddingLeft: "24px",
    backgroundColor: "#f3f5f7",
    color: "#90A3BF",
    fontFamily: "Plus Jakarta Sans",
  };

  return (
    <div className="arvin-landing-page-container">
      <div
        className="arvin-landing-page-container-inside"
        style={{
          boxSizing: "border-box",
          width: "100%",
          minHeight: "100dvh",
        }}
      >
        <div
          style={{
            height: 96,
            maxWidth: 1700,
            margin: "0 auto",
            padding: 24,
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img
            style={{ height: 48 }}
            src="https://ik.imagekit.io/vjz75qw96/assets/icons/Arvin/Horizontal-V1-White.svg?updatedAt=1759757390290"
            alt="arvin"
          />
          <div className="arvin-landing-page-desktop-menu">
            <a
              className="arvin-landing-page-desktop-menu-link"
              href="http://arvinplatform.com/login"
              target="_blank"
            >
              Entrar
            </a>
            <button className="arvin-landing-page-desktop-menu-button">
              Inscrever-se
            </button>
          </div>
          <div className="arvin-landing-page-hamburguer-menu">
            <span
              style={{
                height: 32,
                width: 32,
                fontWeight: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                cursor: "pointer",
              }}
            >
              <ListIcon color="#C3D4E9" size={28} />
            </span>
          </div>
        </div>
        <div>
          <section
            style={{
              margin: "0 auto",
              maxWidth: 850,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontStyle: "Bold",
                fontSize: "36px",
                maxWidth: 850,
                lineHeight: "120%",
                margin: "16px 24px",
                letterSpacing: "-3%",
                color: "#FFF",
                textAlign: "center",
              }}
            >
              Não existe outra plataforma tão completa para professores!
            </div>
            <div
              style={{
                fontFamily: "Plus Jakarta Sans",
                maxWidth: 850,
                fontWeight: 400,
                fontStyle: "Regular",
                fontSize: "16px",
                lineHeight: "150%",
                color: "#90A3BF",
                margin: "0px 24px 32px 24px",
                letterSpacing: "-2%",
                textAlign: "center",
              }}
            >
              Engaje seus alunos, tenha total controle da sua agenda e
              transforme sua forma de ensinar com metodologias e ferramentas que
              realmente funcionam.
            </div>
          </section>
          <section
            style={{
              display: "grid",
              gap: "16px",
              maxWidth: 850,
              margin: "0 auto",
              padding: "24px",
            }}
          >
            <button
              style={{
                color: "#FFF",
                backgroundColor: "#ED5914",
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "150%",
                letterSpacing: "-2%",
                textAlign: "center",
                borderRadius: "30px",
                border: "none",
                padding: "15.5px 0",
              }}
            >
              Testar gratuitamente por 30 dias
            </button>
            <button
              style={{
                backgroundColor: "#1A202C",
                color: "#C3D4E9",
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "150%",
                letterSpacing: "-2%",
                textAlign: "center",
                borderRadius: "30px",
                border: "none",
                padding: "15.5px 0",
              }}
            >
              Ver planos
            </button>
          </section>
          <section
            style={{
              backgroundColor: "#fff",
              width: "100%",
              padding: "24px",
              margin: "0 auto",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                maxWidth: 850,
                margin: "0 auto",
                display: "grid",
                gap: "12px",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  color: "#ED5914",
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: 700,
                  fontStyle: "Bold",
                  fontSize: "12px",
                  lineHeight: "150%",
                  letterSpacing: "0%",
                  textTransform: "uppercase",
                }}
              >
                PRINCIPAIS FUNCIONALIDADES
              </div>
              <div
                style={{
                  color: "#101721",
                  fontFamily: "Plus Jakarta Sans",
                  marginTop: "6px",
                  fontWeight: 700,
                  fontStyle: "Bold",
                  fontSize: "24px",
                  lineHeight: "150%",
                  letterSpacing: "-3%",
                }}
              >
                O que você ganha ao empreender com a gente?
              </div>
              <div>
                Tenha acesso a ferramentas que ajudam a otimizar o ensino e a
                gestão do seu negócio, proporcionando uma experiência eficiente
                e personalizada tanto para o professor quanto para o aluno.
              </div>
              <div>O que você ganha ao empreender com a gente?</div>
              <div>
                Tenha acesso a ferramentas que ajudam a otimizar o ensino e a
                gestão do seu negócio, proporcionando uma experiência eficiente
                e personalizada tanto para o professor quanto para o aluno.
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "24px",
                }}
              >
                {featuresArvin.map((item: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className="arvin-landing-page-feature-item"
                      style={{
                        marginTop: "32px",
                      }}
                    >
                      {item.icon && (
                        <div
                          style={{
                            backgroundColor: "#ED5914",
                            display: "inline-flex",
                            padding: "12px",
                            borderRadius: "8px",
                          }}
                        >
                          {item.icon}
                        </div>
                      )}
                      <div>
                        {item.title && (
                          <p
                            style={{
                              color: "#101721",
                              fontFamily: "Plus Jakarta Sans",
                              fontWeight: 600,
                              fontStyle: "SemiBold",
                              marginTop: "16px",
                              marginBottom: "8px",
                              fontSize: "18px",
                              lineHeight: "150%",
                              letterSpacing: "-3%",
                            }}
                          >
                            {item.title}
                          </p>
                        )}
                        {item.description && (
                          <p
                            style={{
                              fontFamily: "Plus Jakarta Sans",
                              fontWeight: 500,
                              fontStyle: "Medium",
                              fontSize: "14px",
                              lineHeight: "150%",
                              color: "#596780",
                              letterSpacing: "-2%",
                            }}
                          >
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
          <section
            style={{
              backgroundColor: "#fff",
              width: "100%",
              padding: "24px",
              margin: "0 auto",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                maxWidth: 850,
                margin: "0 auto",
                display: "grid",
                gap: "12px",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  color: "#ED5914",
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: 700,
                  fontStyle: "Bold",
                  fontSize: "12px",
                  lineHeight: "150%",
                  letterSpacing: "0%",
                  textTransform: "uppercase",
                }}
              >
                A FÓRMULA DO SUCESSO
              </div>
              <div
                style={{
                  display: "grid",
                  gap: "24px",
                  alignItems: "end",
                  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#101721",
                      fontFamily: "Plus Jakarta Sans",
                      marginTop: "6px",
                      fontWeight: 700,
                      padding: "2px",
                      fontStyle: "Bold",
                      fontSize: "24px",
                      lineHeight: "150%",
                      letterSpacing: "-3%",
                      marginBottom: "64px",
                    }}
                  >
                    Saiba por que o Arvin é essencial para o seu sucesso
                  </div>
                  <div
                    style={{
                      gap: "10px",
                      fontWeight: 600,
                      marginBottom: "24px",
                      opacity: 1,
                      borderRadius: "30px",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      alignItems: "center",
                      textAlign: "center",
                      justifyContent: "space-between",
                      backgroundColor: "#f3f5f7",
                    }}
                  >
                    <div
                      onClick={() => {
                        setSelectedToggle(1);
                      }}
                      style={
                        selectedToggle == 1 ? selectedToggle1 : selectedToggle2
                      }
                    >
                      Com o Arvin
                    </div>
                    <div
                      onClick={() => {
                        setSelectedToggle(2);
                      }}
                      style={
                        selectedToggle == 2 ? selectedToggle1 : selectedToggle2
                      }
                    >
                      Sem o Arvin
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "Plus Jakarta Sans",
                        fontWeight: 700,
                        fontStyle: "Bold",
                        fontSize: "16px",
                        lineHeight: "150%",
                        letterSpacing: "-3%",
                        marginBottom: "24px",
                      }}
                    >
                      {selectedToggle === 1
                        ? "Vantagens exclusivas para o seu ensino"
                        : "Desvantagens de ensinar sem o Arvin"}
                    </div>
                    {selectedToggle === 1 &&
                      [
                        "Acompanhe o progresso dos alunos em tempo real e organize tudo em um único lugar.",
                        "Ofereça materiais didáticos prontos e personalize a experiência de ensino.",
                        "Automatize relatórios financeiros e o envio de conteúdos com facilidade.",
                      ].map((item: any, index: any) => {
                        return (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              gap: "12px",
                              marginBottom: "24px",
                            }}
                          >
                            <CheckCircleIcon
                              weight="fill"
                              color="#0FBD11"
                              size={24}
                            />
                            <p
                              style={{
                                fontFamily: "Plus Jakarta Sans",
                                fontWeight: 500,
                                fontStyle: "Medium",
                                fontSize: "14px",
                                lineHeight: "150%",
                                letterSpacing: "-2%",
                              }}
                            >
                              {item}
                            </p>
                          </div>
                        );
                      })}
                    {selectedToggle === 2 &&
                      [
                        "Acompanhe manualmente o progresso dos alunos, o que toma mais tempo.",
                        "Depende de materiais externos e não oferece uma experiência personalizada.",
                        "Relatórios financeiros e o envio de conteúdos exigem trabalho manual.",
                      ].map((item: any, index: any) => {
                        return (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              gap: "12px",
                              marginBottom: "24px",
                            }}
                          >
                            <XCircleIcon
                              weight="fill"
                              color="#FF4423"
                              size={24}
                            />
                            <p
                              style={{
                                fontFamily: "Plus Jakarta Sans",
                                fontWeight: 500,
                                fontStyle: "Medium",
                                fontSize: "14px",
                                lineHeight: "150%",
                                letterSpacing: "-2%",
                              }}
                            >
                              {item}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>
                {selectedToggle === 1 ? (
                  <img
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                    src="https://ik.imagekit.io/vjz75qw96/assets/icons/Arvin/Card.svg"
                  />
                ) : (
                  <img
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                    src="https://ik.imagekit.io/vjz75qw96/assets/icons/Arvin/Card%20(1).svg"
                  />
                )}
              </div>
            </div>
          </section>
          <section
            style={{
              backgroundColor: "#fff",
              width: "100%",
              padding: "24px",
              margin: "0 auto",
              boxSizing: "border-box",
            }}
          >
            {" "}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ArvinLandingPageNew;
