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

export const partnerColor = (): string => {
  const wl = getWhiteLabel();
  return wl.color || "#ed5914";
};

export const textPrimaryColorContrast = (): string => {
  const wl = getWhiteLabel();
  return wl.contrastColor || "#eee";
};

export const logoPartner = (): string => {
  const wl = getWhiteLabel();
  return (
    wl.logo ||
    "https://ik.imagekit.io/vjz75qw96/assets/icons/Arvin/Profile-White.png?updatedAt=1756235005135"
  );
};

export const textpartnerColorContrast = (): string => "#fff";

// Cores fixas
export const primaryColor = (): string => "#000";
export const primaryColor2 = (): string => "#5c5c5c";
export const darkGreyColor = (): string => "#5c5c5c";
export const mediumGreyColor = (): string => "#555";
export const lightGreyColor = (): string => "#e6e6e6";
export const transparentWhite = (): string => "rgba(255, 255, 255, 0.7)";
export const transparentBlack = (): string => "rgba(1, 1, 1, 0.7)";
export const alwaysWhite = (): string => "#fff";
export const alwaysBlack = (): string => "#111";
