import React, { useState } from "react";
import { primaryColor, secondaryColor, textFont } from "../../Styles/Styles";
import AppFooter from "../../Application/Footer/Footer";
import { backDomain, LogoSVG } from "../../Resources/UniversalComponents";
import "./styles.lp.css";
import Subscription from "../NewStudentAsaas/NewStudentAsaas";
import { ArvinButton } from "../../Resources/Components/ItemsLibrary";
import { Alert, CircularProgress, TextField } from "@mui/material";
import axios from "axios";

import { useMediaQuery } from "@mui/material"; // Adicione isso

function LandingPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fail, setFail] = useState<boolean>(false);
  const [button, setButton] = useState<any>("Entrar");

  const isMobile = useMediaQuery("(max-width:768px)");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFail(false);
    setButton(<CircularProgress style={{ color: secondaryColor() }} />);

    try {
      const response = await axios.post(`${backDomain}/api/v1/studentlogin/`, {
        email,
        password,
      });
      const { token, loggedIn, notifications } = response.data;

      localStorage.removeItem("authorization");
      localStorage.removeItem("loggedIn");

      localStorage.setItem("authorization", `${token}`);
      localStorage.setItem("notifications", JSON.stringify(notifications));
      localStorage.setItem("loggedIn", JSON.stringify(loggedIn));
      setButton("Sucesso");
      window.location.assign("/");
    } catch (error) {
      setFail(true);
      setButton("Entrar");
    }
  };
  const myLogo = LogoSVG(primaryColor(), secondaryColor(), 4);

  const videos = [
    {
      title: "🃏 Flashcards",
      description: "Memorize vocabulário com técnica de repetição espaçada.",
      url: "https://www.youtube.com/embed/bobVcB0crX4",
    },
    {
      title: "🎧 Listening",
      description:
        "Melhore sua compreensão auditiva com conteúdos adaptados ao seu nível.",
      url: "https://www.youtube.com/embed/4wFkC5XOytI",
    },
    {
      title: "📚 Conteúdo Completo",
      description:
        "Acesse cursos organizados do nível básico ao avançado. Aprenda gramática, vocabulário, leitura, escuta e conversação com métodos práticos, objetivos e eficientes.",
      url: "https://www.youtube.com/embed/Bz7c-kT6tyE",
    },
    {
      title: "🗣️ Clube de Conversação",
      description:
        "Participe de encontros ao vivo para praticar o inglês com outros alunos e professores.",
      url: "https://www.youtube.com/embed/g4YGm9G9SUw",
    },

    {
      title: "🧠 Sentence Mining",
      description:
        "Aprenda vocabulário e gramática a partir de frases reais e úteis.",
      url: "https://www.youtube.com/embed/a3IOJN_n5VI",
    },
  ];
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  return (
    <div className="container">
      <div
        style={{
          width: "100%",
          backgroundColor: "#222",
          display: "flex",
          justifyContent: "center",
          marginRight: "1rem",
          alignItems: "center",
          padding: "0.5rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          zIndex: 10,
        }}
      >
        <a
          style={{
            marginLeft: "auto",
            padding: "5px",
            fontSize: "12px",
            backgroundColor: secondaryColor(),
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
            textDecoration: "none",
          }}
          href="https://portal.arthurvincent.com.br/"
          target="_blank"
        >
          Já sou aluno
        </a>
        {fail && (
          <Alert
            severity="error"
            style={{
              marginTop: isMobile ? "1rem" : "0",
              marginLeft: isMobile ? "0" : "1rem",
              width: isMobile ? "100%" : "auto",
            }}
          >
            Credenciais inválidas!
          </Alert>
        )}
      </div>

      <section
        style={{
          marginBottom: "1rem",
        }}
        className="hero-section thesection-1"
      >
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
            {myLogo}
            <p className="hero-subtitle">
              Você <b>precisa</b> aprender inglês! <br />
              Você <b>quer</b> aprender inglês! <br />
              Você <b>vai</b> aprender inglês!
            </p>
            <a
              style={{ backgroundColor: secondaryColor() }}
              href="#subscription-section"
              className="cta-button"
            >
              Quero, preciso e vou aprender inglês!
            </a>
          </div>
        </div>
      </section>
      {/* Benefícios */}
      <section className="benefits-section thesection-2">
        <h2 className="section-title">Por que aprender conosco?</h2>
        <div className="benefits-cards">
          {videos.map((video: any, index: any) => (
            <div
              key={index}
              className="benefit-card"
              onClick={() => setSelectedVideo(video)}
              style={{ cursor: "pointer" }}
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
                ></iframe>
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
      <section className="benefits-section thesection-1">
        <h2 className="section-title">💬 Veja o que dizem os alunos</h2>
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
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      </section>
      <section id="subscription-section" className="thesection-3">
        <Subscription />
      </section>
      <AppFooter see={true} />
    </div>
  );
}

export default LandingPage;

{
  /* <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "5px" : "1rem",
            padding: isMobile ? "1rem" : "0",
            alignItems: isMobile ? "stretch" : "center",
            width: isMobile ? "100%" : "auto",
            maxWidth: "1380px",
          }}
        >
          <TextField
            label="E-mail"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            size="small"
            fullWidth={isMobile}
            sx={{ minWidth: isMobile ? "auto" : "200px" }}
          />
          <TextField
            label="Senha"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            size="small"
            fullWidth={isMobile}
            sx={{ minWidth: isMobile ? "auto" : "200px" }}
          />

          <span
            style={
              isMobile
                ? {
                    marginLeft: "auto",
                  }
                : undefined
            }
          >
            <ArvinButton
              type="submit"
              style={{
                backgroundColor: secondaryColor(),
                color: "#fff",
                width: isMobile ? "100%" : "auto",
              }}
            >
              {button}
            </ArvinButton>
            <ArvinButton
              onClick={() => window.location.assign("/request-reset-password")}
              style={{
                backgroundColor: "#eee",
                color: primaryColor(),
                marginRight: isMobile ? "0" : "1rem",
                width: isMobile ? "100%" : "auto",
              }}
            >
              Esqueci a senha
            </ArvinButton>
          </span>
        </form> */
}
