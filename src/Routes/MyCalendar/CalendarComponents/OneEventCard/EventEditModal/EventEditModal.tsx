import React, { useEffect, useMemo, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import { partnerColor } from "../../../../../Styles/Styles";
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
