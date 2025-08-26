import React, { useEffect, useState } from "react";
import "./styles.lp.css";
import { useMediaQuery } from "@mui/material";

function LandingPageArvin() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const videos = [
    {
      title: "👨‍🏫 Gestão de Alunos",
      description:
        "📊 Organize turmas, acompanhe o desempenho e facilite o controle dos seus alunos.",
      url: "https://www.youtube.com/embed/bobVcB0crX4",
    },
    {
      title: "📚 Materiais de Aula",
      description:
        "🔑 Tenha acesso a materiais prontos e organizados, do nível básico ao avançado, para usar em suas aulas de gramática, vocabulário, leitura, escuta e conversação.",
      url: "https://www.youtube.com/embed/4wFkC5XOytI",
    },
    {
      title: "🚀 Curso de Gestão para Professores",
      description:
        "🌟 Aprenda passo a passo como se tornar um professor particular de sucesso e expandir seu negócio.",
      url: "https://www.youtube.com/embed/a3IOJN_n5VI",
    },
    {
      title: "🌍 3 Idiomas para Ensinar",
      description:
        "🗣️ Conte com materiais de inglês, espanhol e francês para oferecer mais opções aos seus alunos.",
      url: "https://www.youtube.com/embed/Bz7c-kT6tyE",
    },
    {
      title: "🎧 Ferramentas para Alunos",
      description:
        "✨ Forneça flashcards e exercícios de escuta e pronúncia para potencializar o aprendizado dos seus alunos.",
      url: "https://www.youtube.com/embed/g4YGm9G9SUw",
    },
    {
      title: "🎨 Personalização da Plataforma",
      description:
        "⚙️ Adapte a plataforma ao seu estilo de ensino e ofereça uma experiência única aos seus alunos.",
      url: "https://www.youtube.com/embed/a3IOJN_n5VI",
    },
    {
      title: "💰 Gestão Financeira",
      description:
        "📈 Controle pagamentos, organize suas finanças e mantenha a sustentabilidade do seu negócio de aulas particulares.",
      url: "https://www.youtube.com/embed/a3IOJN_n5VI",
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
          padding: "12px", // dá altura sem forçar
          gap: "8px",
          zIndex: 1000,
          boxSizing: "border-box",
        }}
      >
        <span
          style={
            {
              // marginRight: "1rem",
            }
          }
        >
          {" "}
          Entrar como:{" "}
        </span>
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
            lineHeight: 1, // evita crescer por line-height
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
            lineHeight: 1, // evita crescer por line-height
            whiteSpace: "nowrap",
          }}
          href="https://portal.arvinplatform.com/login"
          target="_blank"
        >
          Professor
        </a>{" "}
      </div>

      {/* ESPAÇADOR para não ficar por baixo do header fixo */}
      <div style={{ height: "2.5rem" }} aria-hidden />
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
                <b>Não existe</b> outra plataforma tão completa para
                professores!
                <br />
                <b>Aprenda</b> a captar alunos;
                <br />
                <b>Gerencie</b> a sua agenda de aulas;
                <br />
                <b>Organize</b> a sua vida financeira;
                <br />
                <b>Oferece</b> uma excelente plataforma para os seus alunos.
              </p>

              <a
                style={{ backgroundColor: "#ed5914" }}
                href="#subscription-section"
                className="cta-button"
              >
                Inscreva-se
              </a>
            </div>
          </div>
        </section>
        {/* Benefícios */}
        <section className="benefits-section thesection-2">
          <h2 className="section-title">Por que empreender conosco?</h2>
          <div className="benefits-cards">
            {videos.map((video: any, index: any) => (
              <div
                key={index}
                className="benefit-card"
                // onClick={() => setSelectedVideo(video)}
                style={{ cursor: "auto" }}
              >
                <h3>{video.title}</h3>
                <p>{video.description}</p>
              </div>
            ))}

            {selectedVideo && (
              <div
                className="modal-overlay"
                onClick={() => setSelectedVideo(null)}
              >
                <div
                  className="modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <iframe
                    width="100%"
                    height="315"
                    src={selectedVideo.url}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <button
                    className="close-button"
                    onClick={() => setSelectedVideo(null)}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
        {/* <section className="benefits-section thesection-1">
          <h2 className="section-title">💬 Veja o que dizem os professores</h2>
          <div className="testimonial-scroller">
            {[
              "https://www.youtube.com/embed/-eSmGb2CkPY",
              "https://www.youtube.com/embed/X0T1y17ycN8",
              "https://www.youtube.com/embed/hPnj2UgXZUU",
              "https://www.youtube.com/embed/uLl_ak4AMOk",
              "https://youtube.com/embed/rA9JWtcCDBc",
            ].map((url, index) => (
              <div className="testimonial-video" key={index}>
                <iframe
                  src={url}
                  title={`Depoimento ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        </section> */}
        <section id="subscription-section" className="thesection-1">
          <div
            style={{
              padding: "3rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <button
              onClick={() =>
                window.location.assign("https://wa.me/5511950925086")
              }
              style={{
                margin: "auto",
                gap: "8px",
                backgroundColor: "#25D366", // verde do WhatsApp
                color: "white",
                padding: "12px 18px",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
              }}
            >
              Fale com nossa equipe por WhatsApp
            </button>
          </div>
          {/* <Subscription /> */}
        </section>
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
              fontFamily: "Athiti",
              fontSize: "12px",
              color: "#9ca3af",
            }}
          >
            © 2025 ARVIN • This Platform is powered by ARVIN Corp. All rights
            reserved
          </span>
        </footer>
      </div>
    </>
  );
}

export default LandingPageArvin;
