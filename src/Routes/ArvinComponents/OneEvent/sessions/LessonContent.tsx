import React, { FC, useEffect } from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
import EnglishClassCourse2 from "../../../EnglishLessons/Class";
import axios from "axios";
import { backDomain } from "../../../../Resources/UniversalComponents";

type LessonContentProps = {
  headers: MyHeadersType;
  theLessonRender?: any;
  eventId: string;
  fetchEventData: any;
  permissionsUser: string;
  studentID: string;
  date?: string;
  seeExercise: boolean;
  studentsIds?: string[];
};

const LessonContent: FC<LessonContentProps> = ({
  headers,
  theLessonRender,
  fetchEventData,
  permissionsUser,
  studentID,
  seeExercise = false,
  studentsIds,
}) => {
  const [hasElements, setHasElements] = React.useState(false);
  const fetchHasElements = async () => {
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/course/${theLessonRender}`,
        { headers: headers as any },
      );

      var clss = response.data.classDetails.elements.length;
      setHasElements(clss > 0);
    } catch (error) {
      console.error(error, "Erro ao obter aulas");
    }
  };
  useEffect(() => {
    if (theLessonRender) {
      fetchHasElements();
    }
  }, [theLessonRender]);

  return (
    <>
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 6,
          padding: 18,
          border: "1px solid #E5E7EB",
          display:
            hasElements || permissionsUser !== "student" ? "flex" : "none",
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
          studentsIds={studentsIds}
        />
      </div>
    </>
  );
};

export default LessonContent;
