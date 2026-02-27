import React from "react";
interface ExerciseLessonSlideModelProps {
  item: any;
}

export default function ExerciseLessonSlideModel({
  item,
}: ExerciseLessonSlideModelProps) {
  return (
    <div
      style={{
        padding: "5px",
        fontSize: "2rem",
        margin: "10px 0",
      }}
    >
      <div>
        {item && item?.map((theitem: string, index: number) => {
          return (
            <div key={index}>
              {theitem}
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
}
