const getWhiteLabel = () => {
  try {
    const wl = localStorage.getItem("whiteLabel");
    if (!wl) return {};
    const parsed = JSON.parse(wl);
    if (typeof parsed === "object" && parsed !== null) return parsed;
    return {};
  } catch (err) {
    console.error("[Styles] Erro ao ler whiteLabel:", err);
    return {};
  }
};

export const backgroundType = (): string => {
  const wl = getWhiteLabel();
  return wl.backgroundType || "color";
};

export const partnerColor = (): string => {
  const wl = getWhiteLabel();
  return wl.color || "rgba(67, 125, 172, 1)";
};

export const theBackgroundColor = (): string => {
  const wl = getWhiteLabel();
  return wl.backgroundColor || "rgba(207, 207, 207, 1)";
};

export const textPrimaryColorContrast = (): string => {
  const wl = getWhiteLabel();
  return wl.contrastColor || "#eee";
};

export const backgroundImage = (): string => {
  const wl = getWhiteLabel();
  return (
    wl.backgroundImage ||
    "https://ik.imagekit.io/vjz75qw96/assets/icons/eagbggg?updatedAt=1749920491769"
  );
};

export const logoPartner = (): string => {
  const wl = getWhiteLabel();
  return (
    wl.logo ||
    "https://ik.imagekit.io/vjz75qw96/logos/arvin-platform-final?updatedAt=1752033415166"
  );
};

export const textGeneralFont = (): string => {
  const wl = getWhiteLabel();
  return wl.textGeneralFont || "Lato";
};

export const textpartnerColorContrast = (): string => "#f2f2f2";

export const textTitleFont = (): string => {
  const wl = getWhiteLabel();
  return wl.textTitleFont || "Athiti";
};

// Cores fixas
export const primaryColor = (): string => "#000";
export const primaryColor2 = (): string => "#5c5c5c";
export const darkGreyColor = (): string => "#5c5c5c";
export const mediumGreyColor = (): string => "#555";
export const lightGreyColor = (): string => "#e6e6e6";
export const transparentWhite = (): string => "rgba(255, 255, 255, 0.7)";
export const transparentBlack = (): string => "rgba(1, 1, 1, 0.7)";
export const alwaysWhite = (): string => "#fefefe";
export const alwaysBlack = (): string => "#111";
