import React, { useEffect, useState } from "react";
import { HOne, RouteDiv } from "../../Resources/Components/RouteBox";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Tab } from "@mui/material";
import { alwaysWhite, partnerColor } from "../../Styles/Styles";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import { HeadersProps } from "../../Resources/types.universalInterfaces";
import RankingExplanation from "./RankingComponents/RankingExplanation";
import RankingTimeline from "./RankingComponents/RankingTimeline";
import StudentsRankingTotal from "./RankingComponents/StudentsRankingTotal";
import Helmets from "../../Resources/Helmets";
import StudentsRanking from "./RankingComponents/StudentsRanking";
import Countdown from "./RankingComponents/Countdown";
import { monthInQuestion } from "./RankingComponents/RankingComponents";
import { onLoggOut } from "../../Resources/UniversalComponents";

type Props = {
  headers: any;
  isDesktop: boolean;
};

export default function Ranking({ headers, isDesktop }: Props) {
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
        <StudentsRanking monthNow={monthInQuestion} headers={headers || {}} />
      ),
    },
    {
      title: UniversalTexts.totalRanking,
      value: "2",
      component: <StudentsRankingTotal headers={headers || {}} />,
    },
    {
      title: UniversalTexts.rankingExplanation,
      value: "3",
      component: <RankingExplanation />,
    },
  ];
  const handleChange = (event: any, newValue: string) => {
    event.preventDefault();
    setValue(newValue);
  };

  const targetDate = new Date(import.meta.env.VITE_TARGET_DATABASE);

  return (
    <div
      style={{
        margin: !isDesktop ? "4.5rem auto" : "16px auto",
        fontFamily: "Plus Jakarta Sans",
        fontWeight: 600,
        fontStyle: "SemiBold",
        fontSize: "14px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e8eaed",
        padding: isDesktop ? "2rem" : "5px 1rem ",
        maxWidth: isDesktop ? "800px" : "95vw",
      }}
    >
      <Helmets text="Ranking" />
      <HOne>Ranking</HOne>
      <TabContext value={value}>
        <div
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
            sx={{
              color: partnerColor(),
              "& .MuiTab-root": {
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
                  }}
                  label={component.title}
                  value={component.value}
                />
              );
            })}
          </TabList>
        </div>
        <Countdown targetDate={targetDate} text={""} />
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
    </div>
  );
}
