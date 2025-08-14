import React, { useEffect, useState } from "react";
import { HOne, RouteDiv } from "../../Resources/Components/RouteBox";
import Helmets from "../../Resources/Helmets";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import { partnerColor, textTitleFont } from "../../Styles/Styles";
import { onLoggOut } from "../../Resources/UniversalComponents";
import ListeningExercise from "./ListeningComponents/ListeningExercise";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";

interface ListeningProps {
  headers: MyHeadersType | null;
  onChange: any;
  change: boolean;
}
const Listening = ({ headers, onChange, change }: ListeningProps) => {
  useState<number>(0);
  const [myPermissions, setPermissions] = useState<string>("");
  const [value, setValue] = useState<string>("1");
  const { UniversalTexts } = useUserContext();

  useEffect(() => {
    const user = localStorage.getItem("loggedIn");
    if (user) {
      const { permissions } = JSON.parse(user);
      setPermissions(permissions);
    } else {
      onLoggOut();
    }
  }, []);

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
    // {
    //   title: UniversalTexts.history,
    //   value: "2",
    //   adm: false,
    //   component: <ListeningHistory headers={headers} />,
    // },
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
