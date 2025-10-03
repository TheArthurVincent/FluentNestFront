import React, { useEffect, useMemo, useState } from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import { notifyAlert } from "../Functions/FunctionLessons";
import { textTitleFont, partnerColor } from "../../../../Styles/Styles";
import { backDomain } from "../../../../Resources/UniversalComponents";
import axios from "axios";

interface DialogueLessonModelProps {
  headers: MyHeadersType | null;
  element: any;
  language: any;
  selectedVoice?: {
    value: string;
    label: string;
    lang: string;
    gender?: "MALE" | "FEMALE";
  } | null;
}

// Mapeamento de locais por língua para montar languageCode e a UI
const LOCALES: Record<any, { value: string; label: string; code: string }[]> = {
  en: [
    { value: "US", label: "🇺🇸 United States", code: "en-US" },
    { value: "GB", label: "🇬🇧 United Kingdom", code: "en-GB" },
    { value: "CA", label: "🇨🇦 Canada", code: "en-CA" },
    { value: "AU", label: "🇦🇺 Australia", code: "en-AU" },
    { value: "IN", label: "🇮🇳 India", code: "en-IN" },
  ],
  es: [
    { value: "ES", label: "🇪🇸 España", code: "es-ES" },
    { value: "MX", label: "🇲🇽 México", code: "es-MX" },
    { value: "AR", label: "🇦🇷 Argentina", code: "es-AR" },
    { value: "CO", label: "🇨🇴 Colombia", code: "es-CO" },
  ],
  fr: [
    { value: "FR", label: "🇫🇷 France", code: "fr-FR" },
    { value: "CA", label: "🇨🇦 Canada (fr)", code: "fr-CA" },
  ],
};

// util para obter o languageCode final
const getLanguageCode = (lang: "en" | "es" | "fr", country: string) => {
  const list = LOCALES[lang];
  const found = list.find((l) => l.value === country);
  return found?.code ?? list[0].code; // fallback seguro
};

const readDialogueText = async (
  text: string,
  isPersonA: boolean,
  lang: "en" | "es" | "fr",
  country: string,
  selectedVoice?: { lang: string; gender?: "MALE" | "FEMALE" } | null
) => {
  if (window?.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  try {
    const defaultGender = isPersonA ? "MALE" : "FEMALE";
    const gender = selectedVoice?.gender ?? defaultGender;
    const languageCode = getLanguageCode(lang, country);

    const response = await axios.post(`${backDomain}/api/v1/text-to-speech`, {
      text,
      languageCode,
      gender,
      pitch: 0.7,
      speakingRate: 1.1,
    });

    const audioBase64 = response.data.audio;
    const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
    audio.play();
  } catch (error) {
    notifyAlert("Erro ao gerar áudio");
    console.error("Erro TTS:", error);
  }
};

export default function DialogueLessonModel({
  element,
  headers,
  selectedVoice,
  language,
}: DialogueLessonModelProps) {
  const countryOptions = useMemo(() => LOCALES[language], [language]);

  const [selectedCountry, setSelectedCountry] = useState<string>(
    countryOptions[0]?.value ?? ""
  );

  useEffect(() => {
    setSelectedCountry(countryOptions[0]?.value ?? "");
  }, [language, countryOptions]);

  function isEven(val: number) {
    return val % 2 === 0;
  }

  return (
    <div
      style={{
        padding: "20px",
        margin: "20px 0",
        backgroundColor: "#f8fafc",
        borderRadius: "4px",
        border: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "16px",
          gap: 12,
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 14,
            color: "#475569",
          }}
        >
          {language === "en"
            ? "English"
            : language === "es"
            ? "Español"
            : "Français"}
        </span>

        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "4px",
            border: `1px solid ${partnerColor()}`,
            backgroundColor: "#ffffff",
            color: partnerColor(),
            fontSize: "18px",
            cursor: "pointer",
            outline: "none",
          }}
        >
          {countryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {element.subtitle && (
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                backgroundColor: partnerColor(),
                color: "white",
                borderRadius: "50%",
                width: "48px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              💬
            </div>
          </div>
          <div
            style={{
              position: "relative",
              paddingLeft: "24px",
              paddingRight: "24px",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "0",
                bottom: "0",
                width: "3px",
                backgroundColor: "#e2e8f0",
                transform: "translateX(-50%)",
                borderRadius: "2px",
              }}
            />

            {element.dialogue &&
              element.dialogue.map((text: any, index: number) => {
                const isLeft = isEven(index);
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: isLeft ? "flex-start" : "flex-end",
                      marginBottom: "20px",
                      position: "relative",
                    }}
                  >
                    {isLeft && (
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "18px",
                          marginRight: "12px",
                          flexShrink: 0,
                        }}
                      >
                        👨🏻
                      </div>
                    )}
                    <div
                      style={{
                        maxWidth: "70%",
                        position: "relative",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        readDialogueText(
                          text,
                          isLeft,
                          language,
                          selectedCountry,
                          selectedVoice
                        )
                      }
                    >
                      <div
                        style={{
                          backgroundColor: isLeft ? "#ffffff" : partnerColor(),
                          color: isLeft ? "#1f2937" : "white",
                          padding: "16px 20px",
                          borderRadius: isLeft
                            ? "20px 20px 20px 0px"
                            : "20px 20px 0px 20px",
                          boxShadow: isLeft
                            ? "0 0px 12px rgba(0,0,0,0.1)"
                            : `0 0px 12px ${partnerColor()}40`,
                          border: isLeft ? "1px solid #e5e7eb" : "none",
                          fontSize: "18px",
                          lineHeight: "1.5",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = isLeft
                            ? "0 6px 20px rgba(0,0,0,0.15)"
                            : `0 6px 20px ${partnerColor()}60`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = isLeft
                            ? "0 4px 12px rgba(0,0,0,0.1)"
                            : `0 4px 12px ${partnerColor()}40`;
                        }}
                      >
                        {text}
                      </div>
                    </div>
                    {!isLeft && (
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "18px",
                          marginLeft: "12px",
                          flexShrink: 0,
                        }}
                      >
                        👩🏽
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {element.text && (
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            backgroundColor: "#f1f5f9",
            borderRadius: "4px",
            border: "1px solid #e2e8f0",
            fontSize: "18px",
            color: "#64748b",
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          {element.text}
        </div>
      )}
    </div>
  );
}
