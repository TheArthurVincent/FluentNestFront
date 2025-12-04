import axios from "axios";
import React, { useEffect, useState } from "react";
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
      setLoading(false);
    } catch (err) {
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

  return <>{loading ? <></> : <>✨ {tokens}</>}</>;
}

export default Tokens;
