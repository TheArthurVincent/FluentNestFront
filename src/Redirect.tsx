import React, { useEffect } from "react";

function Redirect() {
  useEffect(() => {
    window.location.assign("/");
  }, []);
  return <></>;
}

export default Redirect;
