import React, { useEffect, useMemo, useState } from "react";
import "./styles.arvinNewLp.css";
import {
  CastleTurretIcon,
  CheckCircleIcon,
  CrownSimpleIcon,
  LightningIcon,
  ListIcon,
  SketchLogoIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { featuresArvin } from "./assetsLandingPageArvin/featuresArvin";

import { testimonialsArvin } from "./assetsLandingPageArvin/testimonialsArvin";

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

  const [isMonth, setIsMonth] = useState(false);
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
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: 700,
                  fontStyle: "bold",
                  fontSize: "12px",
                  lineHeight: "150%",
                  letterSpacing: "0%",
                  textAlign: "center",
                  textTransform: "uppercase",
                  color: "#ED5914",
                }}
              >
                TESTEMUNHOS
              </div>
              <p
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: 700,
                  fontStyle: "Bold",
                  fontSize: "24px",
                  lineHeight: "150%",
                  letterSpacing: "-3%",
                  textAlign: "center",
                  color: "#FFFFFF",
                }}
              >
                O que dizem os nossos parceiros
              </p>
              <p
                style={{
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: 500,
                  fontStyle: "Medium",
                  fontSize: "14px",
                  lineHeight: "150%",
                  letterSpacing: "-2%",
                  textAlign: "center",
                  color: "#90A3BF",
                }}
              >
                Depoimentos reais de quem já usa o Arvin para transformar suas
                aulas, gerenciar alunos e conquistar mais resultados.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(384px, 1fr))",
                  gap: "24px",
                }}
              >
                {testimonialsArvin.map((item: any, index: any) => {
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        backgroundColor: "#1A202C",
                        padding: "24px",
                        justifyContent: "center",
                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "40px",
                          width: "100%",
                          flexDirection: "column",
                        }}
                      >
                        <div>
                          {" "}
                          <p
                            style={{
                              marginBottom: "12px",
                              fontFamily: "Plus Jakarta Sans",
                              fontWeight: " 700",
                              fontStyle: " Bold",
                              fontSize: " 16px",
                              lineHeight: "150%",
                              letterSpacing: -"2%",
                              color: "#FFFFFF",
                            }}
                          >
                            {item.title}{" "}
                          </p>
                          <p
                            style={{
                              fontFamily: "Plus Jakarta Sans",
                              fontWeight: 500,
                              fontStyle: "Medium",
                              fontSize: "14px",
                              lineHeight: "150%",
                              letterSpacing: "-2%",
                              color: "#F3F5F7",
                            }}
                          >
                            {item.description}
                          </p>
                        </div>
                        <div
                          style={{
                            border: "1px solid rgba(144, 163, 191, 0.2",
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <img
                            style={{
                              width: 56,
                              height: 56,
                              borderRadius: "10.5px",
                            }}
                            src={item.img}
                            alt={item.name}
                          />
                          <div>
                            <p
                              style={{
                                fontFamily: "Plus Jakarta Sans",
                                fontWeight: 700,
                                fontStyle: "Bold",
                                fontSize: "18px",
                                lineHeight: "150%",
                                letterSpacing: "-3%",
                                color: "#FFFFFF",
                              }}
                            >
                              {item.name}
                            </p>
                            <p
                              style={{
                                fontFamily: "Plus Jakarta Sans",
                                fontWeight: 400,
                                fontSize: "14px",
                                lineHeight: "150%",
                                letterSpacing: "-3%",
                                color: "#C3D4E9",
                              }}
                            >
                              {item.role}
                            </p>
                          </div>
                        </div>
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
              padding: "48.15px 24px",
              display: "grid",
              margin: "0 auto",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontFamily: "Plus Jakarta Sans",
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
                  fontFamily: "Plus Jakarta Sans",
                  fontWeight: 500,
                  fontStyle: "Medium",
                  fontSize: "14px",
                  lineHeight: "150%",
                  letterSpacing: "-2%",
                  textAlign: "center",
                }}
              >
                Escolha o plano que oferece as ferramentas certas para crescer e
                ensinar com liberdade.
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
                fontFamily: "Plus Jakarta Sans",
              }}
            >
              Economize 20%
            </div>
            <div
              style={{
                maxWidth: "1500px",
                gap: "32px",
                margin: "auto",
                padding: "24px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "24px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#F3F5F7",
                    borderRadius: "12px",
                    padding: "4px 12px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "Plus Jakarta Sans",
                        fontWeight: 600,
                        fontStyle: "SemiBold",
                        fontSize: "24px",
                        lineHeight: "150%",
                        letterSpacing: "-3%",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginTop: "16px",
                        marginBottom: "12px",
                      }}
                    >
                      <CastleTurretIcon size={24} color="grey" weight="fill" />
                      Silver
                    </p>
                    <div
                      style={{
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
                  </div>
                  <p
                    style={{
                      fontFamily: "Plus Jakarta Sans",
                      fontWeight: 500,
                      fontStyle: "Medium",
                      fontSize: "14px",
                      marginTop: "24px",
                      lineHeight: "150%",
                      letterSpacing: "-2%",
                      color: "#596780",
                    }}
                  >
                    Para quem está começando a ensinar e quer uma plataforma
                    completa e prática.
                  </p>
                  <p
                    style={{
                      margin: "24px 0",
                    }}
                  >
                    <span
                      style={{
                        color: "#101721",
                        fontFamily: " Plus Jakarta Sans",
                        fontWeight: 600,
                        fontStyle: "SemiBold",
                        fontSize: "32px",
                        lineHeight: "150%",
                        letterSpacing: "-3%",
                      }}
                    >
                      {!isMonth ? <>R$ 89,99</> : <>R$ 899,90</>}
                    </span>
                    <span
                      style={{
                        color: "#596780",
                        fontFamily: "Plus Jakarta Sans",
                        fontWeight: 500,
                        fontStyle: "Medium",
                        fontSize: "16px",
                        lineHeight: "150%",
                        letterSpacing: "-2%",
                      }}
                    >
                      {!isMonth ? <>/mês</> : <>/ano (em até 10x sem juros)</>}
                    </span>
                  </p>
                  <div>
                    {[
                      {
                        check: true,
                        text: "Até 30 alunos particulares",
                      },
                      {
                        check: true,
                        text: "25 flashcards/dia",
                      },
                      {
                        check: true,
                        text: "Aulas prontas para lecionar",
                      },
                      {
                        check: true,
                        text: "1.000 tokens de IA por mês",
                      },
                      {
                        check: true,
                        text: "Gerenciamento de alunos",
                      },
                      {
                        check: false,
                        text: "Gestão financeira e relatórios",
                      },
                      {
                        check: false,
                        text: "Área de responsáveis",
                      },
                      {
                        check: false,
                        text: "Emissão de recibos",
                      },
                      {
                        check: false,
                        text: "Personalização da plataforma",
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
                              fontFamily: "Plus Jakarta Sans",
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
                        fontFamily: "Plus Jakarta Sans",
                        fontWeight: 600,
                        fontStyle: "SemiBold",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "-2%",
                        textAlign: "center",
                      }}
                    >
                      Contratar agora
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: "#F3F5F7",
                    borderRadius: "12px",
                    padding: "4px 12px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "Plus Jakarta Sans",
                        fontWeight: 600,
                        fontStyle: "SemiBold",
                        fontSize: "24px",
                        lineHeight: "150%",
                        letterSpacing: "-3%",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginTop: "16px",
                        marginBottom: "12px",
                      }}
                    >
                      <CrownSimpleIcon size={24} color="gold" weight="fill" />
                      Gold
                    </p>
                    <div
                      style={{
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
                  </div>
                  <p
                    style={{
                      fontFamily: "Plus Jakarta Sans",
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
                        fontFamily: " Plus Jakarta Sans",
                        fontWeight: 600,
                        fontStyle: "SemiBold",
                        fontSize: "32px",
                        lineHeight: "150%",
                        letterSpacing: "-3%",
                      }}
                    >
                      {!isMonth ? <>R$ 149,99</> : <>R$ 1.499,90</>}
                    </span>
                    <span
                      style={{
                        color: "#596780",
                        fontFamily: "Plus Jakarta Sans",
                        fontWeight: 500,
                        fontStyle: "Medium",
                        fontSize: "16px",
                        lineHeight: "150%",
                        letterSpacing: "-2%",
                      }}
                    >
                      {!isMonth ? <>/mês</> : <>/ano (em até 10x sem juros)</>}
                    </span>
                  </p>
                  <div>
                    {[
                      {
                        check: true,
                        text: "Até 100 alunos particulares",
                      },
                      {
                        check: true,
                        text: "Flashcards ilimitados por dia",
                      },
                      {
                        check: true,
                        text: "Aulas prontas para lecionar",
                      },
                      {
                        check: true,
                        text: "25 tokens de IA por mês",
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
                      {
                        check: true,
                        text: "Personalização da plataforma",
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
                              fontFamily: "Plus Jakarta Sans",
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
                        fontFamily: "Plus Jakarta Sans",
                        fontWeight: 600,
                        fontStyle: "SemiBold",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "-2%",
                        textAlign: "center",
                      }}
                    >
                      Contratar agora
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div style={{ height: "1000px" }} />
        </div>
      </div>
    </div>
  );
}

export default ArvinLandingPageNew;
