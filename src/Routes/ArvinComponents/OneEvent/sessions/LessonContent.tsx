import React, { FC, useState } from "react";
import axios from "axios";
import {
  cardBase,
  cardTitle,
} from "../../Students/TheStudent/types/studentPage.styles";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import HTMLEditor from "../../../../Resources/Components/HTMLEditor";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { partnerColor } from "../../../../Styles/Styles";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import EnglishClassCourse2 from "../../../EnglishLessons/Class";

type LessonContentProps = {
  headers: MyHeadersType;
  theLessonContent?: any;
  eventId: string;
  studentID: string;
  date?: string;
};

const LessonContent: FC<LessonContentProps> = ({
  headers,
  theLessonContent,
  eventId,
  studentID,
  date,
}) => {
  const [change, setChange] = useState(false);

  return (
    <>
      <div
        style={{
          ...cardBase,
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
          mainStudentID={studentID}
          classId={"667714cce1ee6e0c1302fc1e"}
          headers={headers}
        />
      </div>
    </>
  );
};

export default LessonContent;
