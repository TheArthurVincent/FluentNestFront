import React, { useEffect, useState } from "react";
import { HOne, RouteDiv } from "../../Resources/Components/RouteBox";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import {
  alwaysWhite,
  primaryColor,
  textPrimaryColorContrast,
} from "../../Styles/Styles";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import { HeadersProps } from "../../Resources/types.universalInterfaces";
import RankingExplanation from "./RankingComponents/RankingExplanation";
import RankingTimeline from "./RankingComponents/RankingTimeline";
import StudentsRankingTotal from "./RankingComponents/StudentsRankingTotal";
import Helmets from "../../Resources/Helmets";
import StudentsRanking from "./RankingComponents/StudentsRanking";
import StudentsHistoryOfWinners from "./RankingComponents/StudentsHistoryOfWinners";
import Countdown from "./RankingComponents/Countdown";
import { monthInQuestion } from "./RankingComponents/RankingComponents";
import { onLoggOut } from "../../Resources/UniversalComponents";

export default function Ranking({ headers }: HeadersProps) {
  const { UniversalTexts } = useUserContext();

  const [value, setValue] = useState<string>("1");
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const theuser = JSON.parse(localStorage.getItem("loggedIn") || "");
    if (user) {
      setUser(theuser);
    } else {
      onLoggOut();
    }
  }, []);

  const componentsToRender = [
    {
      title: UniversalTexts.monthlyRanking + " " + monthInQuestion,
      value: "1",
      component: (
        <StudentsRanking monthNow={monthInQuestion} headers={headers} />
      ),
    },
    {
      title: UniversalTexts.totalRanking,
      value: "2",
      component: <StudentsRankingTotal headers={headers} />,
    },
    {
      title: UniversalTexts.timeline,
      value: "3",
      component: (
        <RankingTimeline
          id={user.id}
          permissions={user.permissions}
          name={user.name + " " + user.lastname}
          headers={headers}
        />
      ),
    },
    {
      title: UniversalTexts.rankingExplanation,
      value: "4",
      component: <RankingExplanation />,
    },
    {
      title: "History",
      value: "5",
      component: (
        <StudentsHistoryOfWinners
          monthNow={monthInQuestion}
          headers={headers}
        />
      ),
    },
  ];
  const handleChange = (event: any, newValue: string) => {
    event.preventDefault();
    setValue(newValue);
  };

  const targetDate = new Date("2025-06-30T23:59:59");

  return (
    <RouteDiv>
      <Helmets text="Ranking" />
      <HOne>Ranking</HOne>
      <TabContext value={value}>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: alwaysWhite(),
            justifyContent: "space-between",
          }}
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
        <Countdown targetDate={targetDate} text="Score resets on" />
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
}
