import React, { useEffect, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Tab } from "@mui/material";
import { alwaysWhite, partnerColor } from "../../Styles/Styles";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import RankingExplanation from "./RankingComponents/RankingExplanation";
import StudentsRankingTotal from "./RankingComponents/StudentsRankingTotal";
import Helmets from "../../Resources/Helmets";
import StudentsRanking from "./RankingComponents/StudentsRanking";
import Countdown from "./RankingComponents/Countdown";
import { monthInQuestion } from "./RankingComponents/RankingComponents";
import { onLoggOut } from "../../Resources/UniversalComponents";
import { newArvinTitleStyle } from "../ArvinComponents/NewHomePageArvin/NewHomePageArvin";

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
      component: <StudentsRanking headers={headers || {}} />,
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
        margin: !isDesktop ? "0px" : "0px 16px 0px 0px",
      }}
    >
      {isDesktop && (
        <div
          style={{
            paddingTop: 29,
            paddingBottom: 17,
            display: "flex",
            alignItems: "center",
          }}
        >
          <section
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "8px",
              width: "100%",
              fontSize: "1.5rem",
            }}
          >
            <span style={newArvinTitleStyle}>Ranking</span>
          </section>
        </div>
      )}
      <div
        style={{
          fontFamily: "Plus Jakarta Sans",
          fontWeight: 600,
          margin: !isDesktop ? "12px" : "16px auto",
          fontStyle: "SemiBold",
          fontSize: "14px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          border: "1px solid #e8eaed",
          padding: "12px",
        }}
      >
        <Helmets text="Ranking" />
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
    </div>
  );
}
