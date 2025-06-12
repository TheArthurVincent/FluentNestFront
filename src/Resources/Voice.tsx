import React, { FC, useEffect, useState } from "react";

interface VoiceTypes {
  changeB: boolean;
  setChangeB: (value: boolean) => void;
}

const Voice: FC<VoiceTypes> = ({ changeB, setChangeB }) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");

  useEffect(() => {
    const loadVoices = () => {
      let availableVoices = window.speechSynthesis.getVoices();
      const englishVoices = availableVoices.filter((voice) =>
        voice.lang.toLowerCase().includes("en")
      );

      if (englishVoices.length > 0) {
        setVoices(englishVoices);
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          availableVoices = window.speechSynthesis.getVoices();
          const englishVoices = availableVoices.filter((voice) =>
            voice.lang.toLowerCase().includes("en")
          );
          setVoices(englishVoices);
        };
      }
    };

    const storedVoice = localStorage.getItem("chosenVoice");
    if (storedVoice) {
      setSelectedVoice(storedVoice);
    }

    loadVoices();
  }, []);

  useEffect(() => {
    if (selectedVoice) {
      localStorage.setItem("chosenVoice", selectedVoice);
    }
  }, [selectedVoice, changeB]);

  function sanitizeVoiceName(voiceName: any) {
    if (!voiceName) return "";

    let name = voiceName.trim();

    // Remove "Google" ou "Microsoft" do início
    name = name.replace(/^(Google|Microsoft)\s+/i, "");

    // Remove "Online" e qualquer coisa entre parênteses
    name = name.replace(/\bOnline\b/gi, "").replace(/\s*\(.*?\)/g, "");
    name = name.replace(/\English\b/gi, "").replace(/\s*\(.*?\)/g, "");
    name = name.replace(/\UK \b/gi, "").replace(/\s*\(.*?\)/g, "");
    name = name.replace(/\US \b/gi, "").replace(/\s*\(.*?\)/g, "");

    // Remove espaços duplicados gerados
    name = name.trim().replace(/\s{2,}/g, " ");

    return name;
  }

  return (
    <div style={{ margin: "1rem 0", fontFamily: "Lato, sans-serif" }}>
      {voices.length > 0 && (
        <div
          style={{
            display: "flex",
            maxWidth: "15rem",
            alignItems: "center",
            gap: "0.5rem",
            margin: "auto",
          }}
        >
          <select
            id="voice-select"
            value={selectedVoice}
            onChange={(e) => {
              setSelectedVoice(e.target.value);
              setChangeB(!changeB);
            }}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              marginRight: "20px",
              border: "1px solid #ccc",
              backgroundColor: "#f9f9f9",
              fontSize: "0.9rem",
              color: "#333",
              outline: "none",
              transition: "border-color 0.3s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#1a73e8")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#ccc")}
          >
            {voices.map((voice, index) => (
              <option key={index} value={voice.name}>
                {sanitizeVoiceName(voice.name)} ({voice.lang})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Voice;
