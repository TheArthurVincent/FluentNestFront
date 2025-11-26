import React, { FC, useState } from "react";
import axios from "axios";
import {
  cardBase,
  cardTitle,
} from "../../Students/TheStudent/types/studentPage.styles";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import EnglishClassCourse2 from "../../../EnglishLessons/Class";

type LessonContentProps = {
  headers: MyHeadersType;
  theLessonRender?: any;
  eventId: string;
  fetchEventData: any;
  studentID: string;
  date?: string;
};

const LessonContent: FC<LessonContentProps> = ({
  headers,
  theLessonRender,
  fetchEventData,
  studentID,
}) => {
  return (
    <>
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 8,
          padding: 18,
          border: "1px solid #E5E7EB",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div
          style={{
            ...cardTitle,
            justifyContent: "space-between",
          }}
        >
          <span>Conteúdo da Aula</span>
        </div>
        <EnglishClassCourse2
          canEditCourse={true}
          fetchEventData={fetchEventData}
          mainStudentID={studentID}
          classId={theLessonRender}
          headers={headers}
        />
      </div>
    </>
  );
};

export default LessonContent;
