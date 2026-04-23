import React, { useEffect, useMemo, useRef, useState } from "react";
import "./styles.arvinNewLp.css";
import {
  CheckCircleIcon,
  ListIcon,
  WhatsappLogoIcon,
  XCircleIcon,
  XIcon,
} from "@phosphor-icons/react";
import { featuresArvin } from "./assetsLandingPageArvin/featuresArvin";
import { testimonialsArvin } from "./assetsLandingPageArvin/testimonialsArvin";
import TermsAndConditions from "./assetsLandingPageArvin/TermsAndConditions/TermsAndConditions";
import TeacherSignupSection from "./assetsLandingPageArvin/TermsAndConditions/SubscriptionLPNew";
import { getResponsiveEmbedUrl } from "../../../Resources/UniversalComponents";
import styled from "styled-components";

const IFrameAsaas = styled.iframe`
  display: block;
  width: min(80%, 850px);
  max-width: 100%;
  aspect-ratio: 16 / 9; /* mantém proporção */
  height: auto;
  margin-inline: auto; /* centraliza horizontalmente */
  border: 0;
  border-radius: 16px;
`;
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
  const getWhatsAppLink = () => {
    const message = `Olá, gostaria de saber mais sobre a plataforma ARVIN.`;
    // Abre em nova aba
    window.open(
      `https://wa.me/5511972369299?text=${encodeURIComponent(message)}`,
      "_blank"
    );
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

  const [isMonth, setIsMonth] = useState(false);
  const [showBurger, setShowBurger] = useState(false);
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
    fontFamily: "Lato",
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
    fontFamily: "Lato",
  };

  const scrollToPlans = () => {
    document.getElementById("planos")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToSubscription = () => {
    setShowBurger(false);
    setTimeout(() => {
      document.getElementById("cadastro")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
  };

  const [openTerms, setOpenTerms] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [openPolicy, setOpenPolicy] = useState(false);

  // trava scroll quando aberto
  useEffect(() => {
    if (!openTerms) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [openTerms]);

  // ESC + focus trap simples
  useEffect(() => {
    if (!openTerms) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenTerms(false);
      if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          (last as HTMLElement).focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          (first as HTMLElement).focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => document.removeEventListener("keydown", onKey);
  }, [openTerms]);

  const openTermsModal = () => setOpenTerms(true);
  const closeTermsModal = () => setOpenTerms(false);
  const overlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeTermsModal();
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
              href="http://portal.arvinplatform.com/login"
              
            >
              Entrar
            </a>
            <button
              onClick={scrollToSubscription}
              className="arvin-landing-page-desktop-menu-button"
            >
              Inscrever-se
            </button>
          </div>
          <div
            onClick={() => setShowBurger(!showBurger)}
            className="arvin-landing-page-hamburguer-menu"
          >
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
              {!showBurger ? (
                <ListIcon color="#C3D4E9" size={28} />
              ) : (
                <XIcon color="#C3D4E9" size={28} />
              )}
            </span>
          </div>
        </div>
        <div>
          {!showBurger ? (
            <>
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
                    fontFamily: "Lato",
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
                  transforme sua forma de ensinar com metodologias e ferramentas
                  que realmente funcionam.
                </div>
              </section>
              <section
                style={{
                  display: "grid",
                  gap: "16px",
                  alignItems: "center",
                  justifyItems: "space-between",
                  maxWidth: 650,
                  margin: "0 auto",
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gap: "16px",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  }}
                >
                  <button
                    style={{
                      color: "#FFF",
                      backgroundColor: "#ED5914",
                      fontFamily: "Lato",
                      fontWeight: 600,
                      fontSize: "14px",
                      lineHeight: "150%",
                      letterSpacing: "-2%",
                      textAlign: "center",
                      borderRadius: "30px",
                      border: "none",
                      padding: "15.5px 0",
                    }}
                    onClick={scrollToSubscription}
                  >
                    Testar gratuitamente por 30 dias
                  </button>
                  <button
                    style={{
                      backgroundColor: "#1A202C",
                      color: "#C3D4E9",
                      fontFamily: "Lato",
                      fontWeight: 600,
                      fontSize: "14px",
                      lineHeight: "150%",
                      letterSpacing: "-2%",
                      textAlign: "center",
                      borderRadius: "30px",
                      border: "none",
                      padding: "15.5px 0",
                    }}
                    onClick={scrollToPlans}
                  >
                    Ver planos
                  </button>
                </div>
              </section>
              <section
                style={{
                  background:
                    "linear-gradient(to bottom, #000000ff 50%, #ffffff 50%)",
                  display: "grid",
                  gap: "16px",
                  alignItems: "center",
                  justifyItems: "center",
                  margin: "0 auto",
                  padding: "8px 0",
                }}
              >
                <div style={{ width: "100%", maxWidth: 850, margin: "0 auto" }}>
                  <IFrameAsaas
                    src={getResponsiveEmbedUrl(
                      "https://www.youtube.com/watch?v=mJc5dBDVPaA"
                    )}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title="Apresentação Arvin"
                  />
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
                    margin: " 0 auto",
                    display: "grid",
                    gap: "12px",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      color: "#ED5914",
                      fontFamily: "Lato",
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
                      fontFamily: "Lato",
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
                    Tenha acesso a ferramentas que ajudam a otimizar o ensino e
                    a gestão do seu negócio, proporcionando uma experiência
                    eficiente e personalizada tanto para o professor quanto para
                    o aluno.
                  </div>
                  <div>O que você ganha ao empreender com a gente?</div>
                  <div>
                    Tenha acesso a ferramentas que ajudam a otimizar o ensino e
                    a gestão do seu negócio, proporcionando uma experiência
                    eficiente e personalizada tanto para o professor quanto para
                    o aluno.
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
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
                                borderRadius: "6px",
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
                                  fontFamily: "Lato",
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
                                  fontFamily: "Lato",
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
                      fontFamily: "Lato",
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
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(350px, 1fr))",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: "#101721",
                          fontFamily: "Lato",
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
                            selectedToggle == 1
                              ? selectedToggle1
                              : selectedToggle2
                          }
                        >
                          Com o Arvin
                        </div>
                        <div
                          onClick={() => {
                            setSelectedToggle(2);
                          }}
                          style={
                            selectedToggle == 2
                              ? selectedToggle1
                              : selectedToggle2
                          }
                        >
                          Sem o Arvin
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: "Lato",
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
                            "Ofereça materiais didáticos prontos e com exercícios para os alunos.",
                            "Gere relatórios financeiros e o envio de conteúdos com facilidade.",
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
                                    fontFamily: "Lato",
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
                            "Dependa de materiais externos que não oferecem uma experiência personalizada.",
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
                                    fontFamily: "Lato",
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
                        src="https://ik.imagekit.io/vjz75qw96/assets/icons/Arvin/up.svg"
                      />
                    ) : (
                      <img
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "contain",
                        }}
                        src="https://ik.imagekit.io/vjz75qw96/assets/icons/Arvin/down.svg"
                      />
                    )}
                  </div>
                </div>
              </section>
              <section
                style={{
                  backgroundColor: "#101721",
                  width: "100%",
                  padding: "24px 0",
                  margin: 0,
                  boxSizing: "border-box",
                  overflowX: "clip", // evita comer a direita no mobile
                }}
              >
                <div
                  style={{
                    maxWidth: 850,
                    margin: "0 auto",
                    display: "grid",
                    gap: 12,
                    textAlign: "center",
                    paddingInline: 24, // garante respiro lateral
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Lato",
                      fontWeight: 700,
                      fontSize: 12,
                      lineHeight: "150%",
                      textTransform: "uppercase",
                      color: "#ED5914",
                    }}
                  >
                    TESTEMUNHOS
                  </div>

                  <p
                    style={{
                      fontFamily: "Lato",
                      fontWeight: 700,
                      fontSize: 24,
                      lineHeight: "150%",
                      letterSpacing: "-0.03em", // % → em
                      color: "#FFFFFF",
                      margin: 0,
                    }}
                  >
                    O que dizem os nossos parceiros
                  </p>

                  <p
                    style={{
                      fontFamily: "Lato",
                      fontWeight: 500,
                      fontSize: 14,
                      lineHeight: "150%",
                      letterSpacing: "-0.02em",
                      color: "#90A3BF",
                      margin: 0,
                    }}
                  >
                    Depoimentos reais de quem já usa o Arvin para transformar
                    suas aulas, gerenciar alunos e conquistar mais resultados.
                  </p>

                  <div
                    style={{
                      display: "grid",
                      // coluna encolhe até 100% da tela, mas com piso de ~300px
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
                      gap: 24,
                      justifyItems: "center", // centraliza os cards na coluna
                    }}
                  >
                    {testimonialsArvin.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          backgroundColor: "#1A202C",
                          padding: 24,
                          textAlign: "left",
                          width: "100%",
                          maxWidth: 520, // impede alargar demais em telas médias
                          boxSizing: "border-box",
                          borderRadius: 12,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 40,
                            width: "100%",
                            flexDirection: "column",
                          }}
                        >
                          <div>
                            <p
                              style={{
                                margin: "0 0 8px 0",
                                fontFamily: "Lato",
                                fontWeight: 700,
                                fontSize: 14,
                                lineHeight: "150%",
                                letterSpacing: "-0.02em",
                                color: "#FFFFFF",
                              }}
                            >
                              {item.title}
                            </p>
                            <p
                              style={{
                                margin: 0,
                                fontFamily: "Lato",
                                fontWeight: 500,
                                fontSize: 14,
                                lineHeight: "150%",
                                letterSpacing: "-0.02em",
                                color: "#F3F5F7",
                              }}
                            >
                              {item.description}
                            </p>
                          </div>

                          <div
                            style={{
                              border: "1px solid rgba(144,163,191,0.2)", // parêntese corrigido
                            }}
                          />

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <img
                              style={{
                                width: 56,
                                height: 56,
                                borderRadius: 10.5,
                                objectFit: "cover",
                              }}
                              src={item.img}
                              alt={item.name}
                            />
                            <div>
                              <p
                                style={{
                                  margin: 0,
                                  fontFamily: "Lato",
                                  fontWeight: 700,
                                  fontSize: 14,
                                  lineHeight: "150%",
                                  letterSpacing: "-0.03em",
                                  color: "#FFFFFF",
                                }}
                              >
                                {item.name}
                              </p>
                              <p
                                style={{
                                  margin: 0,
                                  fontFamily: "Lato",
                                  fontWeight: 400,
                                  fontSize: 14,
                                  lineHeight: "150%",
                                  letterSpacing: "-0.03em",
                                  color: "#C3D4E9",
                                }}
                              >
                                {item.role}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              <section
                id="planos"
                style={{
                  backgroundColor: "#fff",
                  width: "100%",
                  padding: "48.15px 24px",
                  display: "grid",
                  margin: "0 auto",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    fontFamily: "Lato",
                  }}
                >
                  <p
                    style={{
                      fontWeight: 700,
                      fontStyle: "Bold",
                      fontSize: "24px",
                      color: "#101721",
                      lineHeight: "150%",
                      letterSpacing: -"-3%",
                      textAlign: "center",
                    }}
                  >
                    Dê o próximo passo na sua jornada como educador
                  </p>
                  <p
                    style={{
                      color: "#596780",
                      marginTop: "12px",
                      marginBottom: "36px",
                      fontFamily: "Lato",
                      fontWeight: 500,
                      fontStyle: "Medium",
                      fontSize: "14px",
                      lineHeight: "150%",
                      letterSpacing: "-2%",
                      textAlign: "center",
                    }}
                  >
                    Escolha o plano que oferece as ferramentas certas para
                    crescer e ensinar com liberdade.
                  </p>
                </div>
                <div
                  onClick={() => {
                    setIsMonth(!isMonth);
                  }}
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "209px",
                    margin: "0 auto",
                  }}
                >
                  <div>Mensal </div>
                  <div
                    style={{
                      height: "36px",
                      width: "70px",
                      padding: "1px",
                      backgroundColor: "#ED5914",
                      borderRadius: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      alignSelf: "center",
                    }}
                  >
                    <div
                      style={{
                        borderRadius: "50%",
                        backgroundColor: isMonth ? "#ED5914" : "#FFF",
                        height: "28px",
                        width: "28px",
                        margin: "4px",
                      }}
                    />
                    <div
                      style={{
                        borderRadius: "50%",
                        backgroundColor: !isMonth ? "#ED5914" : "#FFF",
                        height: "28px",
                        width: "28px",
                        margin: "4px",
                      }}
                    />
                  </div>{" "}
                  <div>Anual</div>
                  <img
                    style={{
                      translate: "-40% 50%",
                    }}
                    src="https://ik.imagekit.io/vjz75qw96/assets/icons/Arvin/Arrow.png"
                    alt=""
                  />
                </div>
                <div
                  style={{
                    margin: "auto",
                    display: "inline",
                    backgroundColor: "#ED59143D",
                    color: "#101721",
                    fontSize: "14px",
                    padding: "4px 12px",
                    marginBottom: "24px",
                    borderRadius: "30px",
                    fontFamily: "Lato",
                  }}
                >
                  Economize 20%
                </div>
                <div
                  style={{
                    maxWidth: "1500px",
                    gap: "32px",
                    margin: "auto",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "24px",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#F3F5F7",
                        borderRadius: "6px",
                        marginBottom: "12px",
                        padding: "4px 12px",
                      }}
                    >
                      <div
                        style={{
                          marginTop: "16px",
                          marginBottom: "12px",
                          backgroundColor: "#101721",
                          color: "#fff",
                          gap: "10px",
                          borderRadius: "30px",
                          paddingTop: "4px",
                          paddingRight: "16px",
                          paddingBottom: "4px",
                          textAlign: "center",
                          paddingLeft: "16px",
                        }}
                      >
                        Grátis por 30 dias
                      </div>
                      <p
                        style={{
                          fontFamily: "Lato",
                          fontWeight: 500,
                          fontStyle: "Medium",
                          fontSize: "14px",
                          marginTop: "24px",
                          lineHeight: "150%",
                          letterSpacing: "-2%",
                          color: "#596780",
                        }}
                      >
                        Para quem vive do ensino e busca liberdade total com
                        recursos avançados.
                      </p>
                      <p
                        style={{
                          margin: "24px 0",
                        }}
                      >
                        <span
                          style={{
                            color: "#101721",
                            fontFamily: " Lato",
                            fontWeight: 600,
                            fontStyle: "SemiBold",
                            fontSize: "32px",
                            lineHeight: "150%",
                            letterSpacing: "-3%",
                          }}
                        >
                          {!isMonth ? <>R$ 79,99</> : <>R$ 799,90</>}
                        </span>
                        <span
                          style={{
                            color: "#596780",
                            fontFamily: "Lato",
                            fontWeight: 500,
                            fontStyle: "Medium",
                            fontSize: "16px",
                            lineHeight: "150%",
                            letterSpacing: "-2%",
                          }}
                        >
                          {!isMonth ? (
                            <>/mês</>
                          ) : (
                            <>
                              /ano <br /> (em até 5x sem juros)
                            </>
                          )}
                        </span>
                      </p>
                      <div>
                        {[
                          {
                            check: true,
                            text: "Personalização da plataforma",
                          },
                          {
                            check: true,
                            text: "Construção de materiais e aulas completos",
                          },
                          {
                            check: true,
                            text: "1.000 tokens de IA por mês",
                          },
                          {
                            check: true,
                            text: "100+ alunos particulares",
                          },
                          {
                            check: true,
                            text: "Flashcards e exercícios para os alunos",
                          },
                          {
                            check: true,
                            text: "Aulas prontas para lecionar",
                          },

                          {
                            check: true,
                            text: "Gerenciamento de alunos",
                          },
                          {
                            check: true,
                            text: "Gestão financeira e relatórios",
                          },
                          {
                            check: true,
                            text: "Área de responsáveis",
                          },
                          {
                            check: true,
                            text: "Emissão de recibos",
                          },
                        ].map((item: any, index: number) => {
                          return (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                marginBottom: "16px",
                              }}
                              key={index}
                            >
                              {item.check ? (
                                <CheckCircleIcon
                                  weight="fill"
                                  color="#0FBD11"
                                  size={24}
                                />
                              ) : (
                                <XCircleIcon
                                  weight="fill"
                                  color="#596780"
                                  size={24}
                                />
                              )}
                              <span
                                style={{
                                  fontFamily: "Lato",
                                  fontWeight: 500,
                                  fontStyle: "Medium",
                                  fontSize: "14px",
                                  lineHeight: "150%",
                                  letterSpacing: "-2%",
                                }}
                              >
                                {item.text}
                              </span>
                            </div>
                          );
                        })}
                        <button
                          style={{
                            color: "#FFFFFF",
                            backgroundColor: "#ED5914",
                            borderRadius: 30,
                            padding: "12px 24px",
                            border: "none",
                            cursor: "pointer",
                            marginTop: "16px",
                            marginBottom: "16px",
                            marginLeft: "auto",
                            marginRight: "auto",
                            display: "block",
                            width: "90%",
                            fontFamily: "Lato",
                            fontWeight: 600,
                            fontStyle: "SemiBold",
                            fontSize: "14px",
                            lineHeight: "150%",
                            letterSpacing: "-2%",
                            textAlign: "center",
                          }}
                          onClick={scrollToSubscription}
                        >
                          Contratar agora
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <>
              <section
                style={{
                  // backgroundColor: "#fff",
                  width: "100%",
                  padding: "48.15px 24px",
                  display: "grid",
                  margin: "0 auto",
                  boxSizing: "border-box",
                }}
              >
                <p
                  style={{
                    fontFamily: "Lato",
                    fontWeight: 700,
                    fontSize: 24,
                    lineHeight: "150%",
                    letterSpacing: "-0.03em", // % → em
                    color: "#FFFFFF",
                    marginBottom: 32,
                    marginLeft: 10,
                  }}
                >
                  Acesse sua conta agora!
                </p>
                <div
                  style={{
                    display: "grid",
                    gap: "16px",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  }}
                >
                  <button
                    style={{
                      backgroundColor: "#1A202C",
                      color: "#C3D4E9",
                      fontFamily: "Lato",
                      fontWeight: 600,
                      fontSize: "14px",
                      lineHeight: "150%",
                      letterSpacing: "-2%",
                      textAlign: "center",
                      borderRadius: "30px",
                      border: "none",
                      padding: "15.5px 0",
                    }}
                    onClick={() =>
                      window.location.assign(
                        "https://portal.arvinplatform.com/login"
                      )
                    }
                  >
                    Entrar{" "}
                  </button>
                  <button
                    style={{
                      color: "#FFF",
                      backgroundColor: "#ED5914",
                      fontFamily: "Lato",
                      fontWeight: 600,
                      fontSize: "14px",
                      lineHeight: "150%",
                      letterSpacing: "-2%",
                      textAlign: "center",
                      borderRadius: "30px",
                      border: "none",
                      padding: "15.5px 0",
                    }}
                    onClick={scrollToSubscription}
                  >
                    Inscrever-se{" "}
                  </button>
                  <p
                    style={{
                      fontFamily: "Lato",
                      fontWeight: 700,
                      fontSize: 24,
                      lineHeight: "150%",
                      letterSpacing: "-0.03em", // % → em
                      color: "#FFFFFF",
                      marginTop: 64,
                      marginLeft: 24,
                    }}
                  >
                    Precisa de suporte?
                  </p>
                  <p
                    style={{
                      fontFamily: "Lato",
                      maxWidth: 850,
                      fontWeight: 400,
                      fontStyle: "Regular",
                      marginLeft: 10,
                      lineHeight: "150%",
                      color: "#90A3BF",
                      margin: "0px 24px 32px 24px",
                      letterSpacing: "-2%",
                    }}
                  >
                    Tire suas dúvidas, conheça os planos, fale com o suporte e
                    descubra como a plataforma pode impulsionar seus resultados
                    no ensino e nos negócios.
                  </p>
                  <button
                    onClick={() => getWhatsAppLink()}
                    style={{
                      color: "#FFFFFF",
                      backgroundColor: "#0FBD11",
                      borderRadius: 30,
                      padding: "12px 24px",
                      border: "none",
                      cursor: "pointer",
                      marginBottom: "16px",
                      marginLeft: "auto",
                      marginRight: "auto",
                      display: "flex",
                      width: "90%",
                      fontFamily: "Lato",
                      fontWeight: 600,
                      fontStyle: "SemiBold",
                      fontSize: "14px",
                      lineHeight: "150%",
                      letterSpacing: "-2%",
                      textAlign: "center",
                    }}
                  >
                    <WhatsappLogoIcon color="#fff" size={18} />
                    Chamar no WhatsApp{" "}
                  </button>
                </div>
              </section>
            </>
          )}
          {!showBurger && (
            <section
              id="cadastro"
              style={{
                backgroundColor: "#101721",
                width: "100%",
              }}
            >
              <div
                style={{
                  padding: "24px 48px",
                  margin: 0,
                  maxWidth: 900,
                  color: "#fff",
                  marginLeft: "auto",
                  marginRight: "auto",
                  boxSizing: "border-box",
                  overflowX: "clip",
                  display: "grid",
                }}
              >
                <TeacherSignupSection />
              </div>
            </section>
          )}
          {!showBurger && (
            <section
              style={{
                backgroundColor: "#fff",
                width: "100%",
              }}
            >
              <div
                style={{
                  padding: "24px 48px",
                  margin: 0,
                  maxWidth: 900,
                  marginLeft: "auto",
                  marginRight: "auto",
                  boxSizing: "border-box",
                  overflowX: "clip",
                  display: "grid",
                }}
              >
                <div
                  style={{
                    fontFamily: "Lato",
                    fontWeight: 700,
                    fontSize: 12,
                    marginBottom: "6px",
                    lineHeight: "150%",
                    textTransform: "uppercase",
                    color: "#ED5914",
                  }}
                >
                  FALE CONOSCO
                </div>
                <p
                  style={{
                    fontFamily: "Lato",
                    fontWeight: 700,
                    marginBottom: "12px",
                    fontSize: 24,
                    lineHeight: "150%",
                    letterSpacing: "-0.03em", // % → em
                    color: "#101721",
                    margin: 0,
                  }}
                >
                  Fale com nossa equipe agora no WhatsApp{" "}
                </p>

                <p
                  style={{
                    fontFamily: "Lato",
                    fontWeight: 500,
                    fontSize: 14,
                    lineHeight: "150%",
                    letterSpacing: "-0.02em",
                    color: "#90A3BF",
                    margin: 0,
                  }}
                >
                  Tire suas dúvidas, conheça os planos, fale com o suporte e
                  descubra como a plataforma pode impulsionar seus resultados no
                  ensino e nos negócios.
                </p>
                <button
                  onClick={() => getWhatsAppLink()}
                  style={{
                    color: "#FFFFFF",
                    backgroundColor: "#0FBD11",
                    borderRadius: 30,
                    padding: "12px 24px",
                    marginTop: "36px",
                    border: "none",
                    cursor: "pointer",
                    marginBottom: "16px",
                    marginLeft: "auto",
                    marginRight: "auto",
                    display: "flex",
                    width: "90%",
                    fontFamily: "Lato",
                    fontWeight: 600,
                    fontStyle: "SemiBold",
                    fontSize: "14px",
                    lineHeight: "150%",
                    letterSpacing: "-2%",
                    textAlign: "center",
                  }}
                >
                  <WhatsappLogoIcon color="#fff" size={18} />
                  Chamar no WhatsApp{" "}
                </button>
              </div>
            </section>
          )}
          {!showBurger && (
            <footer
              style={{
                backgroundColor: "#101721",
                width: "100%",
                padding: "24px 48px",
                color: "#FFFFFF",
                margin: 0,
                boxSizing: "border-box",
                overflowX: "clip",
                display: "grid",
                alignItems: "center",
                justifyItems: "center",
              }}
            >
              <img
                style={{
                  width: "80px",
                  height: "auto",
                  marginBottom: "16px",
                  objectFit: "contain",
                }}
                src="https://ik.imagekit.io/vjz75qw96/assets/icons/Arvin/Horizontal-White-Slogan.png?updatedAt=1756124444756"
                alt="Arvin Logo"
              />

              <div
                style={{
                  display: "flex",
                  gap: 32,
                  textDecoration: "underline",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                {/* ---------- Termos e Condições ---------- */}
                <span
                  onClick={() => setOpenTerms(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && setOpenTerms(true)
                  }
                  style={{ cursor: "pointer" }}
                >
                  Termos e Condições
                </span>

                {/* ---------- Política de Publicidade ---------- */}
                <span
                  onClick={() => setOpenPolicy(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && setOpenPolicy(true)
                  }
                  style={{ cursor: "pointer" }}
                >
                  Política de Publicidade
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  marginTop: "24px",
                  gap: 8,
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                <span>© 2025 Arvin</span>
                <span>
                  Doxa Tech Serviços de Software Ltda. All rights reserved
                </span>
              </div>

              {/* ---------- MODAL: Termos e Condições ---------- */}
              {openTerms && (
                <div
                  onClick={overlayClick}
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "grid",
                    placeItems: "center",
                    zIndex: 9999,
                    padding: 16,
                  }}
                  role="presentation"
                >
                  <div
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="terms-title-inline"
                    style={{
                      width: "min(900px, 100%)",
                      maxHeight: "85vh",
                      background: "#FFFFFF",
                      color: "#101721",
                      borderRadius: 12,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px 20px",
                        borderBottom: "1px solid rgba(0,0,0,0.08)",
                        background: "#F9FAFB",
                      }}
                    >
                      <h2
                        id="terms-title-inline"
                        style={{
                          margin: 0,
                          fontFamily: "Lato",
                          fontWeight: 700,
                          fontSize: 14,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        Termos e Condições
                      </h2>
                      <button
                        ref={closeBtnRef}
                        onClick={() => setOpenTerms(false)}
                        aria-label="Fechar"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 22,
                          lineHeight: 1,
                          padding: 4,
                        }}
                      >
                        ×
                      </button>
                    </div>

                    <div
                      style={{
                        padding: 20,
                        overflow: "auto",
                        fontFamily: "Lato",
                        fontSize: 14,
                        lineHeight: "160%",
                        color: "#596780",
                      }}
                    >
                      <TermsAndConditions />
                    </div>
                  </div>
                </div>
              )}

              {/* ---------- MODAL: Política de Publicidade ---------- */}
              {openPolicy && (
                <div
                  onClick={overlayClick}
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "grid",
                    placeItems: "center",
                    zIndex: 9999,
                    padding: 16,
                  }}
                  role="presentation"
                >
                  <div
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="policy-title-inline"
                    style={{
                      width: "min(900px, 100%)",
                      maxHeight: "85vh",
                      background: "#FFFFFF",
                      color: "#101721",
                      borderRadius: 12,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px 20px",
                        borderBottom: "1px solid rgba(0,0,0,0.08)",
                        background: "#F9FAFB",
                      }}
                    >
                      <h2
                        id="policy-title-inline"
                        style={{
                          margin: 0,
                          fontFamily: "Lato",
                          fontWeight: 700,
                          fontSize: 14,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        Política de Publicidade
                      </h2>
                      <button
                        ref={closeBtnRef}
                        onClick={() => setOpenPolicy(false)}
                        aria-label="Fechar"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 22,
                          lineHeight: 1,
                          padding: 4,
                        }}
                      >
                        ×
                      </button>
                    </div>

                    <div
                      style={{
                        padding: 20,
                        overflow: "auto",
                        fontFamily: "Lato",
                        fontSize: 14,
                        lineHeight: "160%",
                        color: "#596780",
                      }}
                    >
                      <p>
                        A presente Política de Publicidade regula a exibição de
                        anúncios, conteúdos patrocinados e parcerias dentro da
                        plataforma Arvin. Toda publicidade será claramente
                        identificada, e nenhum dado pessoal será compartilhado
                        com terceiros sem o consentimento do usuário.
                      </p>
                      <p>
                        A Arvin compromete-se a manter transparência, ética e
                        conformidade com a Lei Geral de Proteção de Dados (Lei
                        nº 13.709/2018), zelando pela experiência segura e
                        educativa de seus usuários.
                      </p>
                      <p style={{ marginTop: 16 }}>
                        Última atualização: 24 de setembro de 2025
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArvinLandingPageNew;
