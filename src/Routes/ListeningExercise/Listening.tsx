import React, { useEffect, useState } from "react";
import { HOne, RouteDiv } from "../../Resources/Components/RouteBox";
import Helmets from "../../Resources/Helmets";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import { Box, Tab } from "@mui/material";
import {
  alwaysWhite,
  primaryColor,
  textPrimaryColorContrast,
} from "../../Styles/Styles";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { onLoggOut } from "../../Resources/UniversalComponents";
import ListeningExercise from "./ListeningComponents/ListeningExercise";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import ListeningHistory from "./ListeningComponents/ListeningHistory";

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

  const handleChange = (event: any, newValue: string) => {
    event.preventDefault();
    setValue(newValue);
  };

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

  const displayIsAdm = myPermissions === "superadmin" ? "block" : "none";

  return (
    <RouteDiv>
      <Helmets text="Listening Exercise" />
      {/* <TabContext value={value}>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: alwaysWhite(),
            justifyContent: "space-between",
          }}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <TabList
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            {componentsToRender.map((component, index) => {
              return (
                <Tab
                  key={index + component.value}
                  style={{
                    display: component.adm === false ? "block" : displayIsAdm,
                    fontWeight: 500,
                    backgroundColor: textPrimaryColorContrast(),
                    color: primaryColor(),
                  }}
                  label={component.title}
                  value={component.value}
                />
              );
            })}
          </TabList>
        </Box>
        {componentsToRender.map((component, index) => {
          return (
            <TabPanel
              style={{
                padding: 0,
                margin: "1rem auto",
              }}
              key={index + component.value}
              value={component.value}
            >
              {component.component}
            </TabPanel>
          );
        })}
      </TabContext> */}
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
