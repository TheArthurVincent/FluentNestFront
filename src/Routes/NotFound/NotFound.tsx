import React from "react";
import {
  HOne,
  RouteDiv,
  RouteSizeControlBox,
} from "../../Resources/Components/RouteBox";
import { BackToHomePage } from "../../Resources/UniversalComponents";
import Helmets from "../../Resources/Helmets";
import { partnerColor, textTitleFont } from "../../Styles/Styles";

export default function NotFound() {
  return (
    <RouteSizeControlBox>
      <RouteDiv>
        <Helmets text="Not Found!" />
        <BackToHomePage />
        <HOne>Page Not Found!</HOne>
      </RouteDiv>
    </RouteSizeControlBox>
  );
}
