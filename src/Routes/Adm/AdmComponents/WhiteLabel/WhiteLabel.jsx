import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  alwaysBlack,
  alwaysWhite,
  logoPartner,
  partnerColor,
  textpartnerColorContrast,
  textPrimaryColorContrast,
} from "../../../../Styles/Styles";
import { HOne, HTwo } from "../../../../Resources/Components/RouteBox";
import { useUserContext } from "../../../../Application/SelectLanguage/SelectLanguage";
import { NavLink } from "react-router-dom";
import {
  backDomain,
  SpanHover,
  updateInfo,
  UpgradeGoldButton,
} from "../../../../Resources/UniversalComponents";
import { HThree } from "../../../MyClasses/MyClasses.Styled";
import AppFooter from "../../../../Application/Footer/Footer";
import { CircularProgress, Tab, Tabs } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { FontDownload } from "@mui/icons-material";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";

export default function WhiteLabelPreview({ headers }) {
  const [studentID, setid] = useState("");
  const [previewLogo, setPreviewLogo] = useState(logoPartner());
  const [tabValue, setTabValue] = useState("1");
  const [goldVisible, setGoldVisible] = useState(false);
  const [formData, setFormData] = useState({
    logo: logoPartner(),
    color: partnerColor(),
    contrastColor: textPrimaryColorContrast(),
  });
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");

    setid(getLoggedUser.id);
  }, []);
  const logoInputRef = React.useRef(null);
  const backgroundInputRef = React.useRef(null);
  const resizeAndConvertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");

        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Erro no canvas");

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const resizedBase64 = canvas.toDataURL("image/jpeg", 0.8);
        const base64WithoutPrefix = resizedBase64.replace(
          /^data:image\/jpeg;base64,/,
          "",
        );

        resolve(base64WithoutPrefix);
      };

      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  const uploadImage = async (file) => {
    const base64 = await resizeAndConvertToBase64(file);
    try {
      const response = await axios.post("/api/v1/upload-whitelabel", {
        file: base64,
      });
      return response.data.url;
    } catch (err) {
      console.error("Erro no upload da imagem:", err);
      throw err;
    }
  };
  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64 = await resizeAndConvertToBase64(file);
      const fullBase64 = `data:image/jpeg;base64,${base64}`;
      setPreviewLogo(fullBase64);
      setFormData((prev) => ({
        ...prev,
        logo: fullBase64,
      }));
    } catch (err) {
      console.error(err);
      alert("Erro ao processar o logo.");
    }
  };

  const handleBackgroundChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64 = await resizeAndConvertToBase64(file);
      const fullBase64 = `data:image/jpeg;base64,${base64}`;
      setPreviewBackground(fullBase64);
      setFormData((prev) => ({
        ...prev,
        background: fullBase64,
      }));
    } catch (err) {
      console.error(err);
      alert("Erro ao processar o fundo.");
    }
  };

  const TabPreview = () => (
    <div>
      <h1
        style={{
          fontSize: "1.5rem",
          textAlign: "center",
          color: formData.color,
        }}
      >
        Exemplo de Título
      </h1>
      <h2
        style={{
          fontSize: "1.3rem",
          fontWeight: 500,
          padding: "0.6rem",
          marginBottom: "1rem",
          color: formData.color,
        }}
      >
        Exemplo de Subtítulo
      </h2>
      <h3
        style={{
          fontSize: "1.1rem",
          padding: "6px",
        }}
      >
        Exemplo de Subtítulo
      </h3>
      <p>Visualização com o fundo, cores e fontes escolhidas.</p>
      <div
        style={{
          margin: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <button
          style={{
            backgroundColor: formData.color,
            color: formData.contrastColor,
          }}
        >
          Botão de exemplo
        </button>
        <button>Botão de exemplo</button>
      </div>
    </div>
  );

  const TabDetalhes = () => (
    <div>
      <h1
        style={{
          fontSize: "1.3rem",
          textAlign: "center",
          color: formData.color,
        }}
      >
        Detalhes do Tema
      </h1>
      <p>
        Aqui você pode visualizar informações específicas sobre as fontes e
        cores escolhidas para o seu tema.
      </p>
      <ul style={{ paddingLeft: "1rem" }}>
        <li>
          <strong>Cor Principal:</strong>{" "}
          <span style={{ color: formData.color }}>{formData.color}</span>
        </li>
      </ul>
    </div>
  );

  const TabMais = () => (
    <div>
      <h1
        style={{
          fontSize: "1.3rem",
          textAlign: "center",
          color: formData.color,
        }}
      >
        Mais informações
      </h1>
      <p>
        Nesta aba você pode adicionar elementos futuros, exemplos de uso do
        tema, ou botões personalizados.
      </p>
      <button>Testar botão adicional</button>
    </div>
  );

  const titleFonts = [
    "Arial",
    "Athiti",
    "Teko",
    "Comic Sans MS",
    "Courier New",
    "Georgia",
    "Helvetica",
    "Impact",
    "Inter",
    "Lato",
    "Lucida Console",
    "Montserrat",
    "Nunito",
    "Oswald",
    "Playfair Display",
    "Poppins",
    "Pt Sans",
    "Pt Sans Narrow",
    "Raleway",
    "Roboto",
    "Ubuntu",
    "system-ui",
    "serif",
    "sans-serif",
    "monospace",
    "cursive",
    "fantasy",
    "Times New Roman",
  ];
  const generalTextFonts = [
    "Arial",
    "Comic Sans MS",
    "Georgia",
    "Helvetica",
    "Inter",
    "Lato",
    "Montserrat",
    "Poppins",
    "Pt Sans",
    "Pt Sans Narrow",
    "Roboto",
    "Times New Roman",
  ];
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  var [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const finalFormData = {
      ...formData,
      logo: previewLogo,
    };

    try {
      const response = await axios.post(
        `${backDomain}/api/v1/whitelabel/${studentID}`,
        { finalFormData },
        { headers },
      );
      notifyAlert("Tema salvo com sucesso!", partnerColor());
      setFormData(finalFormData);
      updateInfo(studentID, headers);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
      notifyAlert(
        error.response?.data?.message || "Erro ao salvar tema.",
        partnerColor(),
      );
      setGoldVisible(true);
      setLoading(false);
    }
  };

  const sampleStyles = {
    backgroundColor: "#eee",
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflowY: "auto",
    color: formData.contrastColor,
    borderRadius: "4px",
    marginTop: "40px",
    border: `2px solid black`,
    width: "100%",
    maxWidth: "700px",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    height: "700px",
    margin: "40px auto",
  };

  const buttonStyles = {
    background: formData.color,
    color: formData.contrastColor,
    logo: formData.logo,
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",

    cursor: "pointer",
  };
  const { UniversalTexts } = useUserContext();

  const allLinksForUser = [
    {
      title: UniversalTexts.theCourses,
      icon: "address-book-o",
      display: "block",
      color: true,
      isLearning: true,
    },
    {
      title: "Flashcards",
      icon: "clone",
      display: "block",
      isLearning: true,
    },
    {
      title: UniversalTexts.calendar,
      icon: "calendar",
      display: "block",
    },
    {
      title: "Ranking",
      icon: "th-list",
      display: "block",
    },
  ];

  return (
    <div className="page-wrapper" style={{ padding: "40px" }}>
      {goldVisible && <UpgradeGoldButton />}
      {loading ? (
        <CircularProgress style={{ color: partnerColor() }} />
      ) : (
        <div className="personalization-wrapper">
          <form
            onSubmit={handleSubmit}
            className="form-wrapper"
            style={{ maxWidth: "400px", margin: "40px auto" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px",
                padding: "10px",
                width: "200px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <div style={{ display: "grid", gap: "5px" }}>
                <label>Logo (upload): </label>
                <input
                  style={{
                    maxWidth: "137px",
                  }}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  ref={logoInputRef}
                />
              </div>
            </div>

            {/* Cores corretas */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px",
                padding: "10px",
                width: "200px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              {" "}
              <div
                style={{ display: "flex", gap: "5px", alignItems: "center" }}
              >
                <label
                  style={{
                    color: formData.color,
                    padding: "5px",
                    borderRadius: "4px",
                  }}
                >
                  Cor Principal
                </label>
                <input
                  style={{
                    maxWidth: "160px",
                  }}
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                />
                <div
                  style={{
                    height: "1rem",
                    width: "1rem",
                    backgroundColor: formData.color,
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px",
                padding: "10px",
                width: "200px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              {" "}
              <div style={{ display: "grid", gap: "5px" }}>
                <label
                  style={{
                    color: formData.contrastColor,
                    backgroundColor: formData.color,
                    padding: "5px",
                    borderRadius: "4px",
                  }}
                >
                  Cor de contraste:{" "}
                </label>
                <select
                  style={{
                    maxWidth: "160px",
                  }}
                  name="contrastColor"
                  value={formData.contrastColor}
                  onChange={handleChange}
                >
                  <option value="black">Black</option>
                  <option value="white">White</option>
                </select>
              </div>
            </div>
            {/* <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px",
                padding: "10px",
                width: "200px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <label
                style={{
                  padding: "5px",
                  borderRadius: "4px",
                }}
              >
                Cor de fundo:{" "}
              </label>
              <input
                style={{
                  maxWidth: "160px",
                }}
                type="color"
                name="backgroundColor"
                value={formData.backgroundColor}
                onChange={handleChange}
              />
              <div
                style={{
                  height: "1rem",
                  width: "1rem",
                  backgroundColor: formData.backgroundColor,
                }}
              />
            </div> */}
            {goldVisible ? (
              <UpgradeGoldButton />
            ) : (
              <button
                type="submit"
                style={{
                  backgroundColor: partnerColor(),
                  color: textpartnerColorContrast(),
                  marginLeft: "auto",
                  display: "flex",
                }}
                color={partnerColor()}
              >
                Salvar Tema
              </button>
            )}
          </form>
          {/* 🔎 Visualização do tema */}
          <div className="sample" style={sampleStyles}>
            <div
              style={{
                backgroundColor: "#fff",
                marginBottom: "1rem",
                padding: "1rem",
                display: "flex",
                justifyContent: "space-around",
                gap: "2rem",
              }}
            >
              <img
                src={formData.logo}
                alt=""
                style={{
                  height: "2rem",
                  width: "auto",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
              <ul
                style={{
                  display: "flex",
                  gap: "1rem",
                  padding: "10px",
                  justifyContent: "space-between",
                }}
              >
                {allLinksForUser.map((link, index) => {
                  return (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        color: link.color ? sampleStyles.color : alwaysBlack(),
                      }}
                    >
                      <i
                        style={{
                          color: link.color ? formData.color : alwaysBlack(),
                        }}
                        className={`fa fa-${link.icon}`}
                      />
                      <span
                        style={{
                          color: link.color ? formData.color : alwaysBlack(),
                          textAlign: "center",
                        }}
                      >
                        {link.title}
                      </span>
                    </span>
                  );
                })}
              </ul>
            </div>
            <div
              className="box-shadow-black smooth"
              style={{
                backgroundColor: alwaysWhite(),
                borderRadius: "4px",
                color: alwaysBlack(),
                padding: "0 0 2rem",
                width: "85%",
                margin: "auto",
                marginBottom: "1rem",
                height: "100%",
              }}
            >
              <div>
                <TabContext value={tabValue}>
                  <div>
                    <TabList
                      sx={{
                        bgcolor: "white",
                        borderRadius: "8px 8px 0 0",
                        border: `1px solid #eee`,
                      }}
                      onChange={handleTabChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      aria-label="tabs preview"
                      sx={{
                        "& .MuiTab-root": {
                          color: "black",
                          fontWeight: 500,
                        },
                        "& .Mui-selected": {
                          color: formData.color,
                        },
                        "& .MuiTabs-indicator": {
                          backgroundColor: formData.color,
                        },
                      }}
                    >
                      <Tab
                        style={{
                          color: formData.partnerColor,
                          fontWeight: tabValue == "1" ? 800 : 500,
                        }}
                        label="Preview"
                        value="1"
                      />
                      <Tab
                        style={{
                          color: formData.partnerColor,
                          fontWeight: tabValue == "2" ? 800 : 500,
                        }}
                        label="Detalhes"
                        value="2"
                      />
                      <Tab
                        style={{
                          color: formData.partnerColor,
                          fontWeight: tabValue == "3" ? 800 : 500,
                        }}
                        label="Mais"
                        value="3"
                      />
                    </TabList>
                  </div>
                  <TabPanel
                    value="1"
                    sx={{ backgroundColor: "#fff", padding: "1rem" }}
                  >
                    <TabPreview />
                    <div
                      style={{
                        color: formData.contrastColor,
                        backgroundColor: formData.color,
                        textAlign: "center",
                        padding: "12px",
                        borderRadius: "4px",
                      }}
                    >
                      <h1 style={{}}>Contraste</h1>
                      <p>
                        Este é um exemplo de contraste entre as cores. Escolha
                        entre **preto** ou **branco** a opção que oferece melhor
                        legibilidade e harmonia visual com a sua marca.
                      </p>
                    </div>
                  </TabPanel>
                  <TabPanel
                    value="2"
                    sx={{ backgroundColor: "#fff", padding: "1rem" }}
                  >
                    <TabDetalhes />
                  </TabPanel>
                  <TabPanel
                    value="3"
                    sx={{ backgroundColor: "#fff", padding: "1rem" }}
                  >
                    <TabMais />
                  </TabPanel>
                </TabContext>
              </div>
            </div>
            <AppFooter style={{ marginTop: "auto" }} see={true} />
          </div>
        </div>
      )}
    </div>
  );
}
