import React, { useState } from "react";
import { HOne, RouteDiv } from "../../Resources/Components/RouteBox";
import Helmets from "../../Resources/Helmets";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import ListeningExercise from "./ListeningComponents/ListeningExercise";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";

interface ListeningProps {
  headers: MyHeadersType | null;
  onChange: any;
  change: boolean;
}
const Listening = ({ headers, onChange, change }: ListeningProps) => {
  useState<number>(0);
  const { UniversalTexts } = useUserContext();

  const componentsToRender = [
    {
      title: UniversalTexts.listening,
      value: "1",
      adm: false,
      component: (
        <ListeningExercise
          onChange={onChange}
          change={change}
          headers={headers}
        />
      ),
    },
  ];

  return (
    <RouteDiv>
      <Helmets text="Listening Exercise" />
      <HOne>Listening Exercise</HOne>
      <ListeningExercise
        onChange={onChange}
        change={change}
        headers={headers}
      />
    </RouteDiv>
  );
};

export default Listening;
