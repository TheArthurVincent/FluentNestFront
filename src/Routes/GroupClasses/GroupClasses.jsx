import React, { useEffect, useState } from "react";
import { HOne, HTwo, RouteDiv } from "../../Resources/Components/RouteBox";
import { Link } from "react-router-dom";
import {
  DivFlex,
  IFrameVideoClass,
  backDomain,
  getVideoEmbedUrl,
  onLoggOut,
} from "../../Resources/UniversalComponents";
import { useUserContext } from "../../Application/SelectLanguage/SelectLanguage";
import axios from "axios";
import { Button, CircularProgress } from "@mui/material";
import { ClassBox, TransectionMenu } from "../MyClasses/MyClasses.Styled";
import {
  alwaysBlack,
  partnerColor,
  textPrimaryColorContrast,
  textTitleFont,
  textpartnerColorContrast,
} from "../../Styles/Styles";
import Helmets from "../../Resources/Helmets";
import { IFrameVideoBlog } from "../HomePage/Blog.Styled";

export default function GroupClasses({ headers }) {
  const { UniversalTexts } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [classes, setClasses] = useState([]);

  async function fetchMonthYear() {
    setLoading(true);
    try {
      const response = await axios.get(`${backDomain}/api/v1/allgroupclasses`, {
        headers,
      });
      setClasses(response.data);
      setLoading(false);
    } catch (error) {
      onLoggOut();
    }
  }

  useEffect(() => {
    fetchMonthYear();
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClasses = classes.slice(startIndex, endIndex);

  const totalItems = classes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleItemsPerPageChange = (event) => {
    const selectedItemsPerPage = parseInt(event.target.value);
    setItemsPerPage(selectedItemsPerPage);
    setCurrentPage(1);
  };

  function GroupClassesSideBar() {
    return (
      <TransectionMenu
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            style={{
              backgroundColor: "#000",
              color: textPrimaryColorContrast(),
            }}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            {UniversalTexts.previousButton}
          </Button>
          <span
            style={{
              color: alwaysBlack(),
            }}
          >
            {currentPage}/{totalPages}
          </span>
          <Button
            style={{
              backgroundColor: "#000",
              color: textPrimaryColorContrast(),
            }}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            {UniversalTexts.nextButton}
          </Button>
        </div>
        <div style={{ display: "flex", gap: "3rem" }}>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <label>{UniversalTexts.itemsPerPage}</label>
            <select
              style={{
                minWidth: "4.5rem",
                padding: "0.1rem",
                fontSize: "1rem",
                cursor: "pointer",
              }}
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              {[1, 5, 10].map((option, index) => {
                return (
                  <option
                    style={{ cursor: "pointer" }}
                    key={index}
                    value={option}
                  >
                    {option}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </TransectionMenu>
    );
  }

  return (
    <RouteDiv>
      <Helmets text="Group Classes" />
      <>
        {!loading ? (
          <>
            <HOne
              style={{
                fontFamily: textTitleFont(),
                color: partnerColor(),
              }}
            >
              {UniversalTexts.previousGroupClasses}
            </HOne>
            <span
              style={{
                display: "flex",
                justifyContent: "right",
                alignItems: "center",
              }}
            >
              <Link
                style={{
                  backgroundColor: partnerColor(),
                  color: textpartnerColorContrast(),
                  padding: "10px",
                  borderRadius: "6px",
                  display: "flex",
                  gap: "5px",
                  alignItems: "center",
                }}
                to="/my-calendar"
              >
                <i className="fa fa-calendar" aria-hidden="true" />
                {UniversalTexts.calendar}
              </Link>
            </span>
            <GroupClassesSideBar />
            {currentClasses.map((item, index) => (
              <div key={index}>
                <ClassBox>
                  <div style={{ textAlign: "center" }}>
                    <DivFlex>
                      <HTwo>{item.classTitle}</HTwo>
                      {item.googleDriveLink && (
                        <Link to={item.googleDriveLink} target="_blank">
                          {UniversalTexts.files}
                        </Link>
                      )}
                    </DivFlex>{" "}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "1rem",
                      }}
                    >
                      <IFrameVideoBlog src={getVideoEmbedUrl(item.videoUrl)} />
                    </div>
                  </div>
                </ClassBox>
              </div>
            ))}
            {itemsPerPage > 2 && classes.length > 2 && <GroupClassesSideBar />}
          </>
        ) : (
          <CircularProgress style={{ color: partnerColor() }} />
        )}
      </>
    </RouteDiv>
  );
}
