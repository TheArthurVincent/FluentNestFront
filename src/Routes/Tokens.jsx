import axios from "axios";
import React, { useEffect, useState } from "react";
import { textTitleFont } from "../Styles/Styles";
import { backDomain } from "../Resources/UniversalComponents";

export function Tokens({ id, headers, change }) {
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState(0);

  const fetchTokens = async () => {
    try {
      const response = await axios.get(`${backDomain}/api/v1/tokens/${id}`, {
        headers,
      });
      setTokens(response.data?.tokens ?? 0);
      console.log(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch tokens:", err);
      setTokens(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTokens();
    }
  }, [id, change]);

  const Box = {
    backgroundColor: "#ffffff",
    padding: "5px 10px",
    borderRadius: "10px",
    fontSize: "14px",
    fontFamily: textTitleFont(),
    fontWeight: "bold",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    position: "fixed",
    bottom: 10,
    right: 10,
    zIndex: 9999,
  };

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <div
          onClick={() => {
            fetchTokens();
          }}
          style={Box}
          title={"Tokens"}
        >
          ✨ {tokens}
        </div>
      )}
    </>
  );
}

export default Tokens;
