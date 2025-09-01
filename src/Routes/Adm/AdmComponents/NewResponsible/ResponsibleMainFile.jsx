import React, { useState } from "react";
import NewResponsible from "./ResponsibleFiles/NewResponsible";
import AllResponsibles from "./ResponsibleFiles/AllResponsibles";

export function ResponsibleMainFile({ headers, id }) {
  const [flag, setFlag] = useState(false);
  return (
    <span>
      <AllResponsibles
        headers={headers}
        id={id}
        flag={flag}
        setFlag={setFlag}
      />
      <NewResponsible headers={headers} id={id} flag={flag} setFlag={setFlag} />
    </span>
  );
}

export default ResponsibleMainFile;
