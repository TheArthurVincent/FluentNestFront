import React, { useEffect, useState } from "react";
import { textGeneralFont, partnerColor } from "../../../../Styles/Styles";

export default function TextAreaLesson() {
  const [value, setValue] = useState("");
  const [permissions, setPermissions] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("loggedIn");
    if (user) {
      const { permissions } = JSON.parse(user);
      setPermissions(permissions);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <textarea
      className="comments"
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder="Write your thoughts, questions, or notes about this text..."
      style={{
        width: "100%",
        minHeight: "120px",
        padding: "16px",
        fontFamily: textGeneralFont(),
        fontSize: "14px",
        lineHeight: "1.6",
        border: isFocused 
          ? `2px solid ${partnerColor()}` 
          : "2px solid #e1e8ed",
        borderRadius: "10px",
        background: "#ffffff",
        color: "#2c3e50",
        resize: "vertical",
        outline: "none",
        transition: "all 0.3s ease",
        boxShadow: isFocused 
          ? `0 4px 12px ${partnerColor()}20` 
          : "0 2px 8px rgba(0, 0, 0, 0.05)",
        display: "block",
        boxSizing: "border-box",
      }}
    />
  );
}
