import React from "react";
import { getVideoEmbedUrl } from "../../../../Resources/UniversalComponents";
import { IFrameVideoBlog } from "../../../HomePage/Blog.Styled";
import { getEmbedUrl } from "../../../MyCalendar/CalendarComponents/MyCalendarFunctions/MyCalendarFunctions";
interface VideoLessonModelProps {
  element: any;
}

export default function VideoLessonModel({ element }: VideoLessonModelProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "1rem",
      }}
    >
      <IFrameVideoBlog src={getEmbedUrl(element.video)} />
    </div>
  );
}
