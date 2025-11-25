import React, { useEffect, useState } from "react";
import { HeadersProps } from "../../../Resources/types.universalInterfaces";
import { backDomain } from "../../../Resources/UniversalComponents";
import axios from "axios";

type SearchMaterialsProps = HeadersProps & {
  change?: boolean;
  setChange?: any;
  isDesktop: boolean;
  actualHeaders?: any;
};

export var newArvinTitleStyle = {
  fontFamily: "Plus Jakarta Sans",
  fontWeight: 600,
  fontStyle: "SemiBold",
  fontSize: 24,
  letterSpacing: "0%",
};

export function SearchMaterials({
  headers,
  change,
  setChange,
  isDesktop,
  actualHeaders,
}: SearchMaterialsProps) {
  return (
    <>
      {" "}
      <input
        style={{
          width: "312px",
          padding: "8px 8px 8px 32px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          outline: "none",
        }}
        placeholder="Busque materiais, palavras e etc..."
        type="text"
      />
    </>
  );
}

export default SearchMaterials;
