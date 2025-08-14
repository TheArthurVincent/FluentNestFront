import React, { useEffect, useState } from "react";
import { RouteDiv, HOne } from "../../Resources/Components/RouteBox";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import {
  BackToHomePage,
  getVideoEmbedUrl,
  onLoggOut,
} from "../../Resources/UniversalComponents";
import {
  partnerColor,
  textTitleFont,
  transparentWhite,
} from "../../Styles/Styles";
import { DivAppear, H3FAQ } from "../MyClasses/MyClasses.Styled";
import { Input } from "@mui/material";
import { contentFaq } from "./FaqContent";
import Helmets from "../../Resources/Helmets";
import { IFrameVideoBlog } from "../HomePage/Blog.Styled";
import { HeadersProps } from "../../Resources/types.universalInterfaces";

function Faq({ headers }: HeadersProps) {
  const { UniversalTexts } = useUserContext();

  const [expandedItem, setExpandedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContent = contentFaq.filter((item) => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    return (
      item.instruction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags &&
        item.tags.some((tag) =>
          tag.toLowerCase().includes(lowerCaseSearchQuery)
        ))
    );
  });

  const handleItemClick = (index: any) => {
    setExpandedItem((prevExpandedItem) =>
      prevExpandedItem === index ? null : index
    );
  };
  const checkLoggedIn = async () => {
    const getLoggedUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    if (!getLoggedUser) onLoggOut();
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  return (
    <RouteDiv>
      <Helmets text="FAQ" />
      <HOne>{UniversalTexts.faq}</HOne> <BackToHomePage />
      <Input
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 1rem",
        }}
        type="text"
        placeholder="Pesquisar..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div
        style={{
          height: "40rem",
          overflow: "auto",
        }}
      >
        {filteredContent.map((item, index) => (
          <div key={index}>
            {item.instruction && (
              <H3FAQ
                style={{ cursor: "pointer" }}
                onClick={() => handleItemClick(index)}
              >
                {item.instruction}
              </H3FAQ>
            )}
            {expandedItem === index && (
              <DivAppear>
                {/* @ts-ignore */}
                {item.url && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "1rem",
                    }}
                  >
                    <IFrameVideoBlog
                      // @ts-ignore
                      src={getVideoEmbedUrl(item.url)}
                      frameBorder="0"
                    />
                  </div>
                )}
                {item.explanation && (
                  <div
                    style={{
                      backgroundColor: transparentWhite(),
                      padding: "1rem",
                    }}
                  >
                    <div>{item.explanation}</div>
                  </div>
                )}
              </DivAppear>
            )}
          </div>
        ))}
      </div>
    </RouteDiv>
  );
}

export default Faq;
