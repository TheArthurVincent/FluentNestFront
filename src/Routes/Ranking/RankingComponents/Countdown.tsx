import React, { useState, useEffect } from "react";
import { formatDate } from "../../../Resources/UniversalComponents";
import { partnerColor, textPrimaryColorContrast } from "../../../Styles/Styles";

interface CountDownProps {
  text: string;
  targetDate: Date;
}

export default function Countdown({ text, targetDate }: CountDownProps) {
  const textToUse = text;

  const calculateTimeLeft = () => {
    var now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        marginBottom: "1rem",
      }}
    >
      <p
        style={{
          margin: "10px",
          fontSize: "11px",
          fontWeight: 700,
        }}
      >
        {textToUse} {formatDate(targetDate)}
      </p>
      <div
        style={{
          backgroundColor: timeLeft.days == 0 ? "red" : partnerColor(),
          color: textPrimaryColorContrast(),
          borderRadius: "4px",
          fontSize: "1rem",
          padding: "6px 8px",
          fontWeight: 600,
          display: "inline",
        }}
      >
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
        {timeLeft.seconds}s
      </div>
    </div>
  );
}
