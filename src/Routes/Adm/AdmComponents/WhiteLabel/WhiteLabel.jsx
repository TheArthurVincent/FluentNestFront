import { useEffect, useState } from "react";
import axios from "axios";
import {
  alwaysBlack,
  alwaysWhite,
  backgroundImage,
  logoPartner,
  primaryColor,
  primaryColor2,
  secondaryColor,
  secondaryColor2,
  textGeneralFont,
  textTitleFont,
} from "../../../../Styles/Styles";
import { ArvinButton } from "../../../../Resources/Components/ItemsLibrary";
import { HOne } from "../../../../Resources/Components/RouteBox";

export default function WhiteLabelPreview({ headers }) {
  const [studentID, setid] = useState("");
  useEffect(() => {
    const getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    setid(getLoggedUser.id);
  }, []);

  const [formData, setFormData] = useState({
    background: backgroundImage(),
    logo: logoPartner(),
    color1: primaryColor(),
    color1Gradient: primaryColor2(),
    color1Contrast: alwaysBlack(),
    color2: secondaryColor(),
    color2Gradient: secondaryColor2(),
    color2Contrast: alwaysWhite(),
    fontPrimary: textGeneralFont(),
    fontSecondary: textTitleFont(),
  });

  const textFonts = [
    "Lato",
    "Pt Sans Narrow",
    "Pt Sans",
    "Poppins",
    "Roboto",
    "Montserrat",
    "Inter",
    "Raleway",
    "Oswald",
    "Nunito",
    "Ubuntu",
    "Playfair Display",
    "Athiti",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/whitelabel/${studentID}`, formData);
      alert("Tema salvo com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar o tema.");
    }
  };

  const sampleStyles = {
    backgroundImage: `url(${formData.background})`,
    backgroundSize: "cover",
    overflowY: "auto",
    backgroundPosition: "center",
    fontFamily: formData.fontPrimary,
    color: formData.color1Contrast,
    padding: "30px",
    borderRadius: "12px",
    marginTop: "40px",
    border: `2px solid ${formData.color2}`,
    width: "100%",
    maxWidth: "700px",
    height: "700px",
    margin: "40px auto",
  };

  const buttonStyles = {
    background: formData.color1,
    color: formData.color1Contrast,
    logo: formData.logo,
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontFamily: formData.fontSecondary,
    cursor: "pointer",
  };

  return (
    <div
      className="page-wrapper"
      style={{ padding: "40px", fontFamily: formData.fontPrimary }}
    >
      <form
        onSubmit={handleSubmit}
        className="form-wrapper"
        style={{ maxWidth: "700px", margin: "40px auto" }}
      >
        <h2 style={{ fontSize: "20px", marginBottom: "15px" }}>
          🎨 Personalizar Tema
        </h2>

        {/* Fundo (imagem) */}
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label>Imagem de fundo (URL): </label>
          <input
            type="text"
            name="background"
            value={formData.background}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label>Logo: </label>
          <input
            type="text"
            name="background"
            value={formData.logo}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </div>

        {/* Cores corretas */}
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label>Cor primária: </label>
          <input
            type="color"
            name="color1"
            value={formData.color1}
            onChange={handleChange}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label>Gradiente da cor primária: </label>
          <input
            type="color"
            name="color1Gradient"
            value={formData.color1Gradient}
            onChange={handleChange}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label>Contraste da cor primária: </label>
          <input
            type="color"
            name="color1Contrast"
            value={formData.color1Contrast}
            onChange={handleChange}
          />
        </div>

        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label>Cor secundária: </label>
          <input
            type="color"
            name="color2"
            value={formData.color2}
            onChange={handleChange}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label>Gradiente da cor secundária: </label>
          <input
            type="color"
            name="color2Gradient"
            value={formData.color2Gradient}
            onChange={handleChange}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label>Contraste da cor secundária: </label>
          <input
            type="color"
            name="color2Contrast"
            value={formData.color2Contrast}
            onChange={handleChange}
          />
        </div>

        {/* Fontes */}
        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label>Fonte Primária (para títulos): </label>

          <select
            name="fontPrimary"
            value={formData.fontPrimary}
            onChange={handleChange}
            style={{ marginLeft: "10px", width: "220px" }}
          >
            {textFonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: "20px" }}>
          <label>Fonte Secundária (para textos): </label>
          <select
            name="fontSecondary"
            value={formData.fontSecondary}
            onChange={handleChange}
            style={{ marginLeft: "10px", width: "220px" }}
          >
            {textFonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          style={{
            padding: "12px 24px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Salvar Tema
        </button>
      </form>

      {/* 🔎 Visualização do tema */}
      <div className="sample" style={sampleStyles}>
        <img
          src={formData.logo}
          alt=""
          style={{
            maxWidth: "15rem",
            margin: "auto",
          }}
        />
        <div
          className="box-shadow-black smooth"
          style={{
            backgroundColor: alwaysWhite(),
            borderRadius: "6px",
            color: alwaysBlack(),
            padding: "0.5rem",
            height: "100%",
          }}
        >
          <h1
            style={{
              textAlign: " center",
              fontSize: "1.1rem",
              color: formData.color1,
              fontFamily: formData.textTitleFont,
            }}
          >
            Exemplo de Título
          </h1>
          <p>Visualização com o fundo, cores e fontes escolhidas.</p>
          <ArvinButton
            color={formData.color1}
            colorContrast={formData.color1Contrast}
          >
            Botão de exemplo
          </ArvinButton>
        </div>
      </div>
    </div>
  );
}
