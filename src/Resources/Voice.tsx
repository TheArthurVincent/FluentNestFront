import React, { FC, useEffect, useState } from "react";
import { textGeneralFont } from "../Styles/Styles";

interface VoiceTypes {
  changeB: boolean;
  maxW?: string;
  setChangeB: (value: boolean) => void;
}

const Voice: FC<VoiceTypes> = ({ changeB, setChangeB, maxW }) => {
  const [selectedOption, setSelectedOption] = useState<string>("male-us");

  const voiceOptions = [
    {
      label: "Male",
      value: "male-us",
      lang: "en-US",
      gender: "MALE",
    },
    {
      label: "Female",
      value: "female-us",
      lang: "en-US",
      gender: "FEMALE",
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
            borderRadius: "6px",
            maxWidth: maxW || "15rem",
            border: "1px solid #ccc",
            backgroundColor: "#f9f9f9",
            fontSize: "0.9rem",
            margin: "auto",
            color: "#333",
            outline: "none",
            transition: "border-color 0.3s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#1a73e8")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#ccc")}
        >
          {voiceOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {selectedOption !== "male-us" ? "🧏‍♀️🗣️" : "🧏‍♂️🗣️"}
      </div>
    </div>
  );
};

export default Voice;
