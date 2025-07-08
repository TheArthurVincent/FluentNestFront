import React, { useEffect, useState } from "react";
import { MyHeadersType } from "../../../../Resources/types.universalInterfaces";
interface ImageLessonModelSlideProps {
  headers: MyHeadersType | null;
  element: any;
}

export default function ImageLessonModelSlide({
  headers,
  element,
}: ImageLessonModelSlideProps) {
  return (
    <div
      className="sentences"
      style={{
        display: "flex",
        padding: "5px",
        margin: "10px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "20rem",
          marginTop: "20rem",
          fontSize: "3rem",
          marginBottom: "20rem",
          margin: "auto",
          flexDirection: "column",
          textAlign: "center",
          fontWeight: "900",
        }}
      >
        {element.images &&
          element.images.map((image: any, i: number) => (
            <div key={i}>
              <span>{image.text}</span>
              <img
                style={{
                  width: "100%",
                  maxWidth: "30rem",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                  display: "block",
                  margin: "auto",
                  objectPosition: "center",
                  borderRadius: "6px",
                }}
                className="box-shadow-white"
                src={image.img}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
