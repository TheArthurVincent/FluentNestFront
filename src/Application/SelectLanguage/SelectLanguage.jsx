import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("pt");
  const [textContent, setTextContent] = useState("UniversalTexts");
  const [UniversalTexts, setUniversalTexts] = useState({});

  const handleLanguageChange = (newLanguage) => {
    setSelectedLanguage(newLanguage);
    if (newLanguage === "en") {
      setTextContent("UniversalTextsEn");
    } else if (newLanguage === "pt") {
      setTextContent("UniversalTexts");
    }
  };

  useEffect(() => {
    const importTexts = async () => {
      if (textContent === "UniversalTexts") {
        const module = await import("../../Resources/UniversalTexts.json");
        setUniversalTexts(module.default);
      } else if (textContent === "UniversalTextsEn") {
        const module = await import("../../Resources/UniversalTextsEn.json");
        setUniversalTexts(module.default);
      }
    };

    importTexts();
  }, [textContent]);

  // Load initial texts on mount
  useEffect(() => {
    const importInitialTexts = async () => {
      const module = await import("../../Resources/UniversalTexts.json");
      setUniversalTexts(module.default);
    };
    
    importInitialTexts();
  }, []);

  const contextValue = {
    selectedLanguage,
    textContent,
    handleLanguageChange,
    UniversalTexts,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
