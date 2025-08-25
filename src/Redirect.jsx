import React, { useEffect } from "react";

function Redirect({ to }) {
  useEffect(() => {
    window.location.assign(to);
  }, []);
  return <></>;
}

export default Redirect;
