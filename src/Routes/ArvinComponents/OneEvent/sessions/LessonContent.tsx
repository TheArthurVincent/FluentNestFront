import React, { FC } from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import EnglishClassCourse2 from "../../../EnglishLessons/Class";

type LessonContentProps = {
  headers: MyHeadersType;
  theLessonRender?: any;
  eventId: string;
  fetchEventData: any;
  studentID: string;
  date?: string;
  seeExercise: boolean;
};

const LessonContent: FC<LessonContentProps> = ({
  headers,
  theLessonRender,
  fetchEventData,
  studentID,
  seeExercise = false,
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
        <EnglishClassCourse2
          canEditCourse={true}
          seeExercise={seeExercise}
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
