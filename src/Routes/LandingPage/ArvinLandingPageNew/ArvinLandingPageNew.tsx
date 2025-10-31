import React, { useEffect, useMemo, useState } from "react";
import "./styles.arvinNewLp.css";
import { ListIcon } from "@phosphor-icons/react";

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

  // Limpeza de chaves legadas ao montar
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
    return found || languages[1]; // pt como padrão
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

  return (
    <div className="arvin-landing-page-container">
      <div className="arvin-landing-page-container-inside">
        <div
          style={{
            height: 96,
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
        <div
          style={{
            maxWidth: 500,
            margin: "0 auto",
          }}
        >
          <section>
            <div
              style={{
                fontWeight: 700,
                fontStyle: "Bold",
                fontSize: "36px",
                lineHeight: "120%",
                margin: "16px 24px",
                letterSpacing: "-3%",
                color: "#FFF",
                textAlign: "center",
              }}
            >
              Não existe outra plataforma tão completa para professores!
            </div>
            <div
              style={{
                fontFamily: "Plus Jakarta Sans",
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
              Conquiste mais alunos, tenha total controle da sua agenda e
              transforme sua forma de ensinar com metodologias e ferramentas que
              realmente funcionam.
            </div>
          </section>
          <section
            style={{
              display: "grid",
              gap: "16px",
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
        </div>
      </div>
    </div>
  );
}

export default ArvinLandingPageNew;
