import React, { useEffect, useState } from "react";
import "./styles.lp.css";
import { useMediaQuery } from "@mui/material";

function LandingPageArvin() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const itemsOfPage = [
    {
      title: "👨‍🏫 Gestão de Alunos",
      description:
        "📊 Organize turmas, acompanhe o desempenho e facilite o controle dos seus alunos.",
      url: "https://www.youtube.com/embed/bobVcB0crX4",
      href: "gestao-alunos",
    },
    {
      title: "📚 Materiais de Aula",
      description:
        "🔑 Tenha acesso a materiais prontos e organizados, do nível básico ao avançado, para usar em suas aulas de gramática, vocabulário, leitura, escuta e conversação.",
      url: "https://www.youtube.com/embed/4wFkC5XOytI",
      href: "materiais-aula",
    },
    {
      title: "🚀 Curso de Gestão para Professores",
      description:
        "🌟 Aprenda passo a passo como se tornar um professor particular de sucesso e expandir seu negócio.",
      url: "https://www.youtube.com/embed/a3IOJN_n5VI",
      href: "curso-gestao",
    },
    {
      title: "🌍 3 Idiomas para Ensinar",
      description:
        "🗣️ Conte com materiais de inglês, espanhol e francês para oferecer mais opções aos seus alunos.",
      url: "https://www.youtube.com/embed/Bz7c-kT6tyE",
      href: "3-idiomas",
    },
    {
      title: "🎧 Ferramentas para Alunos",
      description:
        "✨ Forneça flashcards e exercícios de escuta e pronúncia para potencializar o aprendizado dos seus alunos.",
      url: "https://www.youtube.com/embed/g4YGm9G9SUw",
      href: "ferramentas-alunos",
    },
    {
      title: "🎨 Personalização da Plataforma",
      description:
        "⚙️ Adapte a plataforma ao seu estilo de ensino e ofereça uma experiência única aos seus alunos.",
      url: "https://www.youtube.com/embed/a3IOJN_n5VI",
      href: "personalizacao",
    },
    {
      title: "💰 Gestão Financeira",
      description:
        "📈 Controle pagamentos, organize suas finanças e mantenha a sustentabilidade do seu negócio de aulas particulares.",
      url: "https://www.youtube.com/embed/a3IOJN_n5VI",
      href: "gestao-financeira",
    },
  ];

  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem("loggedIn");
    const auth = localStorage.getItem("authorization");
    const whiteLabel = localStorage.getItem("whiteLabel");
    const notifications = localStorage.getItem("notifications");
    const voiceGender = localStorage.getItem("voiceGender");
    const voiceLang = localStorage.getItem("voiceLang");
    const voiceOption = localStorage.getItem("voiceOption");
    const flashcardsToday = localStorage.getItem("flashcardsToday");
    if (user) {
      localStorage.removeItem("loggedIn");
    }
    if (auth) {
      localStorage.removeItem("authorization");
    }
    if (whiteLabel) {
      localStorage.removeItem("whiteLabel");
    }
    if (notifications) {
      localStorage.removeItem("notifications");
    }
    if (voiceGender) {
      localStorage.removeItem("voiceGender");
    }
    if (voiceLang) {
      localStorage.removeItem("voiceLang");
    }
    if (voiceOption) {
      localStorage.removeItem("voiceOption");
    }
    if (flashcardsToday) {
      localStorage.removeItem("flashcardsToday");
    }
  }, []);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          backgroundColor: "#222",
          color: "white",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "12px",
          gap: "8px",
          zIndex: 1000,
          boxSizing: "border-box",
        }}
      >
        <span> Entrar como: </span>
        <a
          style={{
            padding: "4px 6px",
            backgroundColor: "#ed5914",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            textDecoration: "none",
            display: "inline-block",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
          href="https://portal.arvinplatform.com/login"
          target="_blank"
        >
          Aluno
        </a>
        <a
          style={{
            padding: "4px 6px",
            backgroundColor: "#ed5914",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            textDecoration: "none",
            display: "inline-block",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
          href="https://portal.arvinplatform.com/login"
          target="_blank"
        >
          Responsável
        </a>
        <a
          style={{
            padding: "4px 6px",
            backgroundColor: "#ed5914",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            textDecoration: "none",
            display: "inline-block",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
          href="https://portal.arvinplatform.com/login"
          target="_blank"
        >
          Professor
        </a>{" "}
      </div>
      <div style={{ height: "2.95rem" }} aria-hidden />
      <div className="container">
        <section className="hero-section thesection-1">
          <div className="hero-grid">
            <div
              style={{
                padding: "1rem",
                display: "grid",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                justifyItems: "center",
              }}
              className="hero-text"
            >
              <img
                src="https://ik.imagekit.io/vjz75qw96/assets/icons/Arvin/Horizontal-Black.png?updatedAt=1756124444679"
                alt=""
                style={{
                  maxWidth: isMobile ? "80vw" : "40vw",
                  marginBottom: "1rem",
                }}
              />
              <p className="hero-subtitle">
                <span
                  style={{
                    fontSize: "1.5rem",
                  }}
                >
                  <b>Não existe</b> outra plataforma tão completa para
                  professores!
                </span>
                <br />
                <b>Aprenda</b> a captar alunos;
                <br />
                <b>Gerencie</b> a sua agenda de aulas;
                <br />
                <b>Organize</b> a sua vida financeira;
                <br />
                <b>Ofereça</b> uma excelente plataforma de estudos para os seus
                alunos.
              </p>
              <a
                style={{ backgroundColor: "#ed5914" }}
                href="/lp/arvin"
                className="cta-button"
                target="_blank"
              >
                Inscreva-se
              </a>
            </div>
          </div>
        </section>
        <section className="benefits-section thesection-2">
          <h1>Por que empreender conosco?</h1>
          <div className="benefits-cards">
            {itemsOfPage.map((item: any, index: any) => (
              <a
                key={index}
                className="benefit-card"
                href={`#${item.href}`}
                style={{ cursor: "pointer", textDecoration: "none" }}
              >
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </a>
            ))}
          </div>
        </section>

        {itemsOfPage.map((section: any, index: any) => (
          <section
            key={section.id}
            id={section.href}
            className={`benefits-section ${
              index % 2 === 0 ? "thesection-1" : "thesection-2"
            }`}
          >
            <h1>{section.title}</h1>
            <p>{section.description}</p>
          </section>
        ))}
        <footer
          className="footer no-print"
          style={{
            display: "flex",
            fontSize: "11px",
            backgroundColor: "#f8fafc",
            color: "#64748b",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "2rem",
            width: "100%",
            borderTop: "1px solid #e2e8f0",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <img
            src="https://ik.imagekit.io/vjz75qw96/assets/icons/Arvin/Horizontal-Black.png?updatedAt=1756124444679"
            alt="ARVIN Logo"
            style={{
              height: "1.5rem",
              width: "auto",
              opacity: "0.7",
              objectFit: "contain",
            }}
          />
          <span
            style={{
              fontFamily: "Lato",
              fontSize: "12px",
              color: "#9ca3af",
            }}
          >
            © 2025 ARVIN • This Platform is powered by DOXA TECH Serviços de
            Software Ltda. All rights reserved
          </span>
        </footer>
      </div>
    </>
  );
}

export default LandingPageArvin;
