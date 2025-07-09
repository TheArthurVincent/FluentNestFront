import React, { useEffect, useState } from "react";
import { RouteDiv } from "../../Resources/Components/RouteBox";
import Helmets from "../../Resources/Helmets";
import { MyHeadersType } from "../../Resources/types.universalInterfaces";
import { Box, Tab } from "@mui/material";
import {
  alwaysWhite,
  partnerColor,
  textPrimaryColorContrast,
  textTitleFont,
} from "../../Styles/Styles";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import AddFlashCards from "./FlashCardsComponents/AddFlashCards";
import ReviewFlashCards from "./FlashCardsComponents/ReviewFlashCards";
import AllCards from "./FlashCardsComponents/AllCards";
import { onLoggOut } from "../../Resources/UniversalComponents";
import FlashcardsHistory from "./FlashCardsComponents/FlashcardsHistory";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";

interface FlashCardsProps {
  headers: MyHeadersType | null;
  onChange: any;
  change: boolean;
}
const FlashCards = ({ headers, onChange, change }: FlashCardsProps) => {
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

  const handleChange = (event: any, newValue: string) => {
    event.preventDefault();
    setValue(newValue);
  };

  const componentsToRender = [
    {
      title: UniversalTexts.sentences,
      value: "1",
      adm: false,
      component: (
        <ReviewFlashCards
          onChange={onChange}
          change={change}
          headers={headers}
        />
      ),
    },
    {
      title: UniversalTexts.myCards,
      value: "2",
      adm: false,
      component: <AllCards headers={headers} />,
    },
    {
      title: UniversalTexts.history,
      value: "3",
      adm: false,
      component: <FlashcardsHistory headers={headers} />,
    },
    {
      title: UniversalTexts.add,
      value: "4",
      adm: true,
      component: <AddFlashCards display="block" headers={headers} />,
    },
  ];

  const displayIsAdm = myPermissions === "superadmin" ? "block" : "none";
  return (
    <RouteDiv
      style={{
        maxWidth: "600px",
      }}
    >
      <Helmets text="Flashcards" />
      <TabContext value={value}>
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
            sx={{
              fontFamily: textTitleFont(),
              color: partnerColor(),
              "& .MuiTab-root": {
                fontFamily: textTitleFont(),
                color: partnerColor(),
              },
              "& .Mui-selected": {
                color: partnerColor(),
              },
              "& .MuiTabs-indicator": {
                backgroundColor: partnerColor(),
              },
            }}
          >
            {componentsToRender.map((component, index) => {
              return (
                <Tab
                  key={index + component.value}
                  style={{
                    color: partnerColor(),
                    fontWeight: (index + 1).toString() === value ? 800 : 500,
                    display: component.adm === false ? "block" : displayIsAdm,
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
      </TabContext>
    </RouteDiv>
  );
};

export default FlashCards;
