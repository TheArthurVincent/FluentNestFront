import React from "react";
import { getVideoEmbedUrl } from "../../../../Resources/UniversalComponents";
import { IFrameVideoBlog } from "../../../HomePage/Blog.Styled";
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
      <IFrameVideoBlog src={getVideoEmbedUrl(element.video)} />
    </div>
  );
}
