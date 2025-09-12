import React, { useState } from "react";
import { HOne, RouteDiv } from "../../Resources/Components/RouteBox";
import Helmets from "../../Resources/Helmets";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";

import ListeningExercise from "./ListeningComponents/ListeningExercise";
import ListeningExerciseNew from "./ListeningComponents/ListeningExerciseNew";

interface ListeningProps {
  headers: MyHeadersType | null;
  onChange: any;
  change: boolean;
}
const Listening = ({ headers, onChange, change }: ListeningProps) => {
  useState<number>(0);

  return (
    <RouteDiv>
      <Helmets text="Listening Exercise" />
      <HOne>Listening Exercise</HOne>
      {/* <ListeningExercise
        onChange={onChange}
        change={change}
        headers={headers}
      />
      <br />
      <br /> */}
      <ListeningExerciseNew
        onChange={onChange}
        change={change}
        headers={headers}
      />

    </RouteDiv>
  );
};

export default Listening;
