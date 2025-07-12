const getWhiteLabel = () =>
  JSON.parse(localStorage.getItem("whiteLabel") || "{}");

export const backgroundType = (): string =>
  getWhiteLabel().backgroundType || "color";

export const partnerColor = (): string => getWhiteLabel().color || "rgba(67, 125, 172, 1)";

export const theBackgroundColor = (): string =>
  getWhiteLabel().backgroundColor || "rgba(188, 221, 248, 1)";

export const textPrimaryColorContrast = (): string =>
  getWhiteLabel().contrastColor || "#eee";

export const textpartnerColorContrast = (): string => "#f2f2f2";

export const backgroundImage = (): string =>
  getWhiteLabel().backgroundImage ||
  "https://ik.imagekit.io/vjz75qw96/assets/icons/eagbggg?updatedAt=1749920491769";

export const logoPartner = (): string =>
  getWhiteLabel().logo ||
  "https://ik.imagekit.io/vjz75qw96/logos/arvin-platform-final?updatedAt=1752033415166";

export const textGeneralFont = (): string =>
  getWhiteLabel().textGeneralFont || "Lato";

export const textTitleFont = (): string =>
  getWhiteLabel().textTitleFont || "Athiti";

export const primaryColor = (): string => "#000";
export const primaryColor2 = (): string => "#5c5c5c";
export const darkGreyColor = (): string => "#5c5c5c";
export const mediumGreyColor = (): string => "#555";
export const lightGreyColor = (): string => "#e6e6e6";
export const transparentWhite = (): string => "rgba(255, 255, 255, 0.7)";
export const transparentBlack = (): string => "rgba(1, 1, 1, 0.7)";
export const alwaysWhite = (): string => "#fefefe";
export const alwaysBlack = (): string => "#111";
