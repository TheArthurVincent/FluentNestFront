import { useEffect, useState } from "react";
import { HeadersProps } from "../../Resources/types.universalInterfaces";
import { HOne, RouteDiv } from "../../Resources/Components/RouteBox";
import React from "react";

export function SeeMyStudents({ headers }: HeadersProps) {
  var [loading, setLoading] = useState<boolean>(true);

  return (
    <RouteDiv>
      <HOne>Alunos</HOne>
    </RouteDiv>
  );
}

export default SeeMyStudents;
