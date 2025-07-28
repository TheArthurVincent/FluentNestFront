import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  alwaysBlack,
  alwaysWhite,
  backgroundImage,
  backgroundType,
  logoPartner,
  partnerColor,
  textGeneralFont,
  textPrimaryColorContrast,
  textTitleFont,
  theBackgroundColor,
} from "../../../../Styles/Styles";
import { ArvinButton } from "../../../../Resources/Components/ItemsLibrary";
import { HOne, HTwo } from "../../../../Resources/Components/RouteBox";
import { useUserContext } from "../../../../Application/SelectLanguage/SelectLanguage";
import { NavLink } from "react-router-dom";
import {
  backDomain,
  SpanHover,
  updateInfo,
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
  const [previewBackground, setPreviewBackground] = useState(backgroundImage());
  const [tabValue, setTabValue] = useState("1");
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
          ""
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
  const [formData, setFormData] = useState({
    backgroundType: "color", // "image" ou "color"
    backgroundImage: backgroundImage(),
    backgroundColor: "#eee",
    logo: logoPartner(),
    color: partnerColor(),
    contrastColor: textPrimaryColorContrast(),
    textTitleFont: textTitleFont(),
    textGeneralFont: textGeneralFont(),
  });
  const TabPreview = () => (
    <div>
      <h1
        style={{
          fontSize: "1.5rem",
          textAlign: "center",
          color: formData.color,
          fontFamily: formData.textTitleFont,
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
          fontFamily: formData.textTitleFont,
        }}
      >
        Exemplo de Subtítulo
      </h2>
      <h3
        style={{
          fontSize: "1.1rem",
          padding: "6px",
          fontFamily: formData.textGeneralFont,
        }}
      >
        Exemplo de Subtítulo
      </h3>
      <p style={{ fontFamily: formData.textGeneralFont }}>
        Visualização com o fundo, cores e fontes escolhidas.
      </p>
      <div style={{ margin: "2rem", display: "block" }}>
        <ArvinButton
          style={{ fontFamily: formData.textGeneralFont }}
          color="red"
        >
          Botão de exemplo
        </ArvinButton>
        <ArvinButton
          style={{ fontFamily: formData.textGeneralFont }}
          color="orange"
        >
          Botão de exemplo
        </ArvinButton>
        <ArvinButton
          style={{ fontFamily: formData.textGeneralFont }}
          color="green"
        >
          Botão de exemplo
        </ArvinButton>
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
          fontFamily: formData.textTitleFont,
        }}
      >
        Detalhes do Tema
      </h1>
      <p style={{ fontFamily: formData.textGeneralFont }}>
        Aqui você pode visualizar informações específicas sobre as fontes e
        cores escolhidas para o seu tema.
      </p>
      <ul style={{ fontFamily: formData.textGeneralFont, paddingLeft: "1rem" }}>
        <li>
          <strong>Fonte Título:</strong> {formData.textTitleFont}
        </li>
        <li>
          <strong>Fonte Geral:</strong> {formData.textGeneralFont}
        </li>
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
          fontFamily: formData.textTitleFont,
        }}
      >
        Mais informações
      </h1>
      <p style={{ fontFamily: formData.textGeneralFont }}>
        Nesta aba você pode adicionar elementos futuros, exemplos de uso do
        tema, ou botões personalizados.
      </p>
      <ArvinButton style={{ fontFamily: formData.textGeneralFont }}>
        Testar botão adicional
      </ArvinButton>
    </div>
  );

  const titleFonts = [
    "Arial",
    "Athiti",
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
      background: previewBackground,
    };

    try {
      const response = await axios.post(
        `${backDomain}/api/v1/whitelabel/${studentID}`,
        { finalFormData },
        { headers }
      );
      notifyAlert("Tema salvo com sucesso!", "green");
      setFormData(finalFormData);
      updateInfo(studentID, headers);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
      notifyAlert("Erro ao salvar o tema.");
      setLoading(false);
    }
  };

  const sampleStyles = {
    backgroundImage:
      formData.backgroundType === "image"
        ? `url(${previewBackground})`
        : "none",
    backgroundColor:
      formData.backgroundType === "color"
        ? formData.backgroundColor
        : "transparent",
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflowY: "auto",
    fontFamily: formData.textGeneralFont,
    color: formData.contrastColor,
    borderRadius: "12px",
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
    borderRadius: "6px",
    fontSize: "16px",
    fontFamily: formData.textTitleFont,
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
    <div
      className="page-wrapper"
      style={{ padding: "40px", fontFamily: formData.textGeneralFont }}
    >
      <HOne
        style={{
          color: partnerColor(),
          fontFamily: textTitleFont(),
          fontSize: "20px",
          marginBottom: "15px",
        }}
      >
        🎨 Personalizar Tema
      </HOne>

      {loading ? (
        <CircularProgress style={{ color: partnerColor() }} />
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            className="form-wrapper"
            style={{ maxWidth: "700px", margin: "40px auto" }}
          >
            {/* <div className="form-group" style={{ marginBottom: "15px" }}>
              <label>Tipo de fundo:</label>
              <select
                name="backgroundType"
                value={formData.backgroundType}
                onChange={handleChange}
                style={{ marginLeft: "10px", width: "220px" }}
              >
                <option value="image">Imagem</option>
                <option value="color">Cor sólida</option>
              </select>
            </div> */}
            {/* Se for imagem, mostra o input de upload */}
            {/* {formData.backgroundType === "image" && (
              <div className="form-group" style={{ marginBottom: "15 px" }}>
                <label>Imagem de fundo (upload): </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundChange}
                  ref={backgroundInputRef}
                />
              </div>
            )} */}

            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label>Cor de fundo: </label>
              <input
                type="color"
                name="backgroundColor"
                value={formData.backgroundColor}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label>Logo (upload): </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                ref={logoInputRef}
              />
            </div>

            {/* Cores corretas */}
            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label>Cor Principal do seu negócio: </label>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
            </div>
            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label>Cor de contraste: </label>
              <select
                name="contrastColor"
                value={formData.contrastColor}
                onChange={handleChange}
                style={{ marginLeft: "10px", width: "220px" }}
              >
                <option value="black">Black</option>
                <option value="white">White</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label>Fonte Primária (para títulos): </label>
              <select
                name="textTitleFont"
                value={formData.textTitleFont}
                onChange={handleChange}
                style={{ marginLeft: "10px", width: "220px" }}
              >
                {titleFonts.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: "20px" }}>
              <label>Fonte Secundária (para textos): </label>
              <select
                name="textGeneralFont"
                value={formData.textGeneralFont}
                onChange={handleChange}
                style={{ marginLeft: "10px", width: "220px" }}
              >
                {generalTextFonts.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <ArvinButton type="submit" color={partnerColor()}>
              Salvar Tema
            </ArvinButton>
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
                          fontFamily: formData.textGeneralFont,
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
                borderRadius: "6px",
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
                          fontFamily: formData.textTitleFont,
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
                        borderRadius: "1rem",
                      }}
                    >
                      <h1
                        style={{
                          fontFamily: formData.textTitleFont,
                        }}
                      >
                        Contraste
                      </h1>
                      <p
                        style={{
                          fontFamily: formData.textGeneralFont,
                        }}
                      >
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
        </>
      )}
    </div>
  );
}
