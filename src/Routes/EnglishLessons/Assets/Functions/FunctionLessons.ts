import axios from "axios";
import { backDomain } from "../../../../Resources/UniversalComponents";

export const notifyAlert = (
  message: string,
  color?: string,
  timeEstablished?: number
) => {
  const existing = document.getElementById("voice-error-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");

  toast.id = "voice-error-toast";
  toast.innerText = message;

  // Estilos visuais
  toast.style.position = "fixed";
  toast.style.top = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = color || "rgb(205, 50, 50)";
  toast.style.color = "white";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "8px";
  toast.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.6)";
  toast.style.zIndex = "9999";
  toast.style.fontWeight = "500";
  toast.style.opacity = "0.5";

  // Animação
  const animationName = "slide-in";
  const style = document.createElement("style");
  style.textContent = `
    @keyframes ${animationName} {
      0% {
        transform: translateX(-150%) scale(0.95);
        opacity: 0;
      }
      100% {
        transform: translateX(-50%) scale(1);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  toast.style.animation = `${animationName} 0.3s ease-out forwards`;

  document.body.appendChild(toast);

  setTimeout(
    () => {
      toast.remove();
      style.remove();
    },
    timeEstablished ? timeEstablished : 2500
  );
};
export let globalAudioController: {
  currentAudio: HTMLAudioElement | null;
} = {
  currentAudio: null,
};
export const readText = async (
  text: string,
  restart: boolean, // mantido por compatibilidade, mas será ignorado
  lang?: string,
  chosenVoice?: string, // mantido, mas não usado
  rate?: number
) => {
  try {
    // Se já houver áudio tocando, parar e resetar SEM retornar
    if (globalAudioController.currentAudio) {
      globalAudioController.currentAudio.pause();
      globalAudioController.currentAudio.currentTime = 0;
    }

    const voiceLang = localStorage.getItem("voiceLang");
    const voiceGender = localStorage.getItem("voiceGender");

    const response = await axios.post(`${backDomain}/api/v1/text-to-speech`, {
      text,
      languageCode: voiceLang || lang,
      gender: voiceGender,
      pitch: 0.6,
      speakingRate: rate || 1,
    });

    const audioBase64 = response.data.audio;
    const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);

    globalAudioController.currentAudio = audio;
    audio.play();
  } catch (error) {
    notifyAlert("Erro ao gerar áudio");
    console.error("Erro TTS:", error);
  }
};
