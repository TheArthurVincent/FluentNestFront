import { useEffect, useState } from "react";
import { HOne, RouteDiv } from "../../Resources/Components/RouteBox";
import React from "react";
import FindStudent from "../Adm/AdmComponents/FindStudentAssets/FindStudent";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import Helmets from "../../Resources/Helmets";

export interface SeeMyStudentsProps {
  headers: MyHeadersType | null;
  id: string;
}

export function SeeMyStudents({ headers, id }: SeeMyStudentsProps) {
  var [loading, setLoading] = useState<boolean>(true);
  const [upload, setUpload] = useState(true);

  return (
    <RouteDiv>
      <HOne>Alunos</HOne>
      <FindStudent
        headers={headers}
        id={id}
        uploadStatus={upload}
        isResponsible={true}
      />
      <Helmets text="Alunos" />
    </RouteDiv>
  );
}

export default SeeMyStudents;
