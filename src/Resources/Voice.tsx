import React, { FC, useEffect, useMemo, useState } from "react";
import { partnerColor, textGeneralFont } from "../Styles/Styles";

interface VoiceTypes {
  changeB: boolean;
  maxW?: string;
  setChangeB: (value: boolean) => void;
  chosenLanguage?: "en" | "es" | "fr" | string;
}

type VoiceOption = {
  label: string;
  value: string;
  lang: string; // e.g. en-US, es-ES, fr-FR
  gender: "MALE" | "FEMALE";
};

const Voice: FC<VoiceTypes> = ({
  changeB,
  setChangeB,
  maxW,
  chosenLanguage,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("male-us");

  const voiceOptions: VoiceOption[] = [
    // English
    {
      label: "Female American",
      value: "female-us",
      lang: "en-US",
      gender: "FEMALE",
    },
    { label: "Male American", value: "male-us", lang: "en-US", gender: "MALE" },
    {
      label: "Female Canadian",
      value: "female-ca",
      lang: "en-CA",
      gender: "FEMALE",
    },
    { label: "Male Canadian", value: "male-ca", lang: "en-CA", gender: "MALE" },
    {
      label: "Female British",
      value: "female-gb",
      lang: "en-GB",
      gender: "FEMALE",
    },
    { label: "Male British", value: "male-gb", lang: "en-GB", gender: "MALE" },
    {
      label: "Female Australian",
      value: "female-au",
      lang: "en-AU",
      gender: "FEMALE",
    },
    {
      label: "Male Australian",
      value: "male-au",
      lang: "en-AU",
      gender: "MALE",
    },
    {
      label: "Female Indian",
      value: "female-in",
      lang: "en-IN",
      gender: "FEMALE",
    },
    { label: "Male Indian", value: "male-in", lang: "en-IN", gender: "MALE" },

    // Spanish
    {
      label: "Female Spanish (Spain)",
      value: "female-es",
      lang: "es-ES",
      gender: "FEMALE",
    },
    {
      label: "Male Spanish (Spain)",
      value: "male-es",
      lang: "es-ES",
      gender: "MALE",
    },
    {
      label: "Female Spanish (Mexico)",
      value: "female-mx",
      lang: "es-MX",
      gender: "FEMALE",
    },
    {
      label: "Male Spanish (Mexico)",
      value: "male-mx",
      lang: "es-MX",
      gender: "MALE",
    },

    // French
    {
      label: "Female French (France)",
      value: "female-fr",
      lang: "fr-FR",
      gender: "FEMALE",
    },
    {
      label: "Male French (France)",
      value: "male-fr",
      lang: "fr-FR",
      gender: "MALE",
    },
    {
      label: "Female French (Canada)",
      value: "female-fr-ca",
      lang: "fr-CA",
      gender: "FEMALE",
    },
    {
      label: "Male French (Canada)",
      value: "male-fr-ca",
      lang: "fr-CA",
      gender: "MALE",
    },
  ];

  // Mapeia idioma -> valor padrão
  const defaultByLang: Record<string, string> = {
    en: "male-us",
    es: "male-es",
    fr: "male-fr",
  };

  // Filtra de acordo com chosenLanguage (prefixo de lang)
  const filteredOptions = useMemo(() => {
    const code = (chosenLanguage || "").toLowerCase();
    if (!code || !["en", "es", "fr"].includes(code)) return voiceOptions;
    return voiceOptions.filter((v) => v.lang.toLowerCase().startsWith(code));
  }, [chosenLanguage, voiceOptions]);

  // Carrega do localStorage ou define padrão global (en-US male)
  useEffect(() => {
    const stored = localStorage.getItem("voiceOption");
    if (stored) {
      setSelectedOption(stored);
    } else {
      localStorage.setItem("voiceOption", "male-us");
      localStorage.setItem("voiceLang", "en-US");
      localStorage.setItem("voiceGender", "MALE");
      setSelectedOption("male-us");
    }
  }, []);

  // Garante que a seleção atual exista na lista filtrada; se não, troca para o padrão do idioma
  useEffect(() => {
    const existsInFiltered = filteredOptions.some(
      (v) => v.value === selectedOption
    );
    if (!existsInFiltered) {
      const langKey = (chosenLanguage || "").toLowerCase();
      const fallback = defaultByLang[langKey] || "male-us";
      const existsFallback = filteredOptions.find(
        (v) => v.value === fallback
      )?.value;
      const next = existsFallback || filteredOptions[0]?.value || "male-us";
      setSelectedOption(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenLanguage, filteredOptions.length]);

  // Persiste a seleção atual
  useEffect(() => {
    const current = voiceOptions.find((v) => v.value === selectedOption);
    if (current) {
      localStorage.setItem("voiceOption", selectedOption);
      localStorage.setItem("voiceLang", current.lang);
      localStorage.setItem("voiceGender", current.gender);
    }
  }, [selectedOption, changeB]);

  return (
    <div style={{ margin: "5px 0", fontFamily: textGeneralFont() }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          margin: "auto",
          maxWidth: "10rem",
        }}
      >
        <select
          id="voice-select"
          value={selectedOption}
          onChange={(e) => {
            setSelectedOption(e.target.value);
            setChangeB(!changeB);
          }}
          style={{
            borderRadius: "4px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            fontSize: "11px",
            fontWeight: "400",
            color: "#64748b",
            padding: "4px 6px",
            height: "28px",
            minWidth: "120px",
            maxWidth: maxW || "150px",
            outline: "none",
            cursor: "pointer",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = partnerColor())}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
        >
          {filteredOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {(() => {
          const currentVoice = voiceOptions.find(
            (v) => v.value === selectedOption
          );
          return currentVoice?.gender === "MALE" ? "🧏‍♂️" : "🧏‍♀️";
        })()}
      </div>
    </div>
  );
};

export default Voice;
