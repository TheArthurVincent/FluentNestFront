import React, { FC, useEffect, useState } from "react";
import { partnerColor, textGeneralFont } from "../Styles/Styles";

interface VoiceTypes {
  changeB: boolean;
  maxW?: string;
  setChangeB: (value: boolean) => void;
}

const Voice: FC<VoiceTypes> = ({ changeB, setChangeB, maxW }) => {
  const [selectedOption, setSelectedOption] = useState<string>("male-us");

  const voiceOptions = [
    {
      label: "Female American",
      value: "female-us",
      lang: "en-US",
      gender: "FEMALE",
    },
    {
      label: "Male American",
      value: "male-us",
      lang: "en-US",
      gender: "MALE",
    },
    {
      label: "Female Canadian",
      value: "female-ca",
      lang: "en-CA",
      gender: "FEMALE",
    },
    {
      label: "Male Canadian",
      value: "male-ca",
      lang: "en-CA",
      gender: "MALE",
    },
    {
      label: "Female British",
      value: "female-gb",
      lang: "en-GB",
      gender: "FEMALE",
    },
    {
      label: "Male British",
      value: "male-gb",
      lang: "en-GB",
      gender: "MALE",
    },
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
    {
      label: "Male Indian",
      value: "male-in",
      lang: "en-IN",
      gender: "MALE",
    },
  ];

  useEffect(() => {
    const stored = localStorage.getItem("voiceOption");
    if (stored) {
      setSelectedOption(stored);
    } else {
      // Definindo padrão
      localStorage.setItem("voiceOption", "male-us");
      localStorage.setItem("voiceLang", "en-US");
      localStorage.setItem("voiceGender", "MALE");
    }
  }, []);

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
          {voiceOptions.map((opt) => (
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
