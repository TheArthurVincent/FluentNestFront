import React, { useEffect, useMemo, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import {
  backDomain,
  formatDateBr,
  onLoggOut,
  onLoggOutFee,
  truncateString,
  updateInfo,
} from "../../../../Resources/UniversalComponents";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import {
  partnerColor,
  textpartnerColorContrast,
  transparentWhite,
} from "../../../../Styles/Styles";
import {
  categoryList,
  convertToBase64,
  getEmbedUrl,
  getLastMonday,
} from "../MyCalendarFunctions/MyCalendarFuncions";
import { Link } from "react-router-dom";
import HTMLEditor from "../../../../Resources/Components/HTMLEditor";
import { HOne, HTwo } from "../../../../Resources/Components/RouteBox";
import { useUserContext } from "../../../../Application/SelectLanguage/SelectLanguage";
import {
  inputCheckBox,
  spanChecked,
  styleLiChecked,
} from "../MyCalendarFunctions/MyCalendarFuncions.Styles";

interface EditModalProps {
  headers: any; // substitua pelo tipo real se souber a estrutura
  thePermissions: string[] | any;
  myId: string | number;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
  change: boolean;
  alternateBoolean?: boolean;
  setAlternateBoolean?: any;
  event: any; // substitua pelo tipo real se souber a estrutura
}

function EditModal({
  headers,
  thePermissions,
  myId,
  setChange,
  change,
  alternateBoolean,
  event,
  setAlternateBoolean,
}: EditModalProps) {
  const [loadingModalInfo, setLoadingModalInfo] = useState(false);
  return (
    <>
      {loadingModalInfo ? (
        <CircularProgress style={{ color: partnerColor() }} />
      ) : (
        <div></div>
      )}
    </>
  );
}

export default EditModal;
