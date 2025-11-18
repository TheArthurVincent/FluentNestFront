import React, { useEffect, useState } from "react";
import { HeadersProps } from "../../../../Resources/types.universalInterfaces";
type ListOfGroupsToClickProps = HeadersProps & {
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

export function ListOfGroupsToClick({
  actualHeaders,
  change,
  setChange,
  isDesktop,
}: ListOfGroupsToClickProps) {
  return (
    <div
      style={{
        margin: !isDesktop ? "0px" : "0px 16px 0px 0px",
      }}
    ></div>
  );
}

export default ListOfGroupsToClick;
