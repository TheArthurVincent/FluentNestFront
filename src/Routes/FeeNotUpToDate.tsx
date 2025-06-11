import React, { useEffect, useState } from "react";
import Ranking from "./Ranking/Ranking";
import GroupClasses from "./GroupClasses/GroupClasses";
import { Login } from "@mui/icons-material";
import { verifyToken } from "../App";
import { Outlet, Route, Routes } from "react-router-dom";
import {
  onLoggOut,
  pathGenerator,
  updateInfo,
} from "../Resources/UniversalComponents";
import MyProfile from "./MyProfile/MyProfile";
import Faq from "./Faq/Faq";
import MyClasses from "./MyClasses/MyClasses";
import MyCalendar from "./MyCalendar/MyCalendar";
import Adm from "./Adm/Adm";
import Blog from "./Blog/HomePageContent";
import { LevelCard } from "./LevelCard/LevelCard";
import {
  BlogRouteSizeControlBox,
  HOne,
} from "../Resources/Components/RouteBox";
import { HeadersProps } from "../Resources/types.universalInterfaces";
import { TopBar } from "../Application/TopBar/TopBar";
import FlashCards from "./FlashCards/FlashCards";
import Homework from "./Homework/Homework";
import AppFooter from "../Application/Footer/Footer";
import EnglishCourses from "./EnglishLessons/Courses";
import Listening from "./ListeningExercise/Listening";
import SentenceMining from "./SentenceMining/SentenceMining";
import BlogPosts from "./Blog/BlogPosts";
import WordOfTheDayList from "./WordOfTheDay/WordOfTheDayList";
import { secondaryColor } from "../Styles/Styles";
import { myLogoDone } from "./NewStudentAsaas/EmailCheck";

export function FeeNotUpToDate() {
  return (
    <div
      style={{
        height: "500px",
        width: "500px",
        display: "flex",
        margin: "auto",
        marginTop: "10rem",
        backgroundColor: "white",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        borderRadius: "20px",
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      {myLogoDone}
      <HOne>Falta pouco para utilizar a plataforma!</HOne>
      <p style={{ fontSize: "18px", marginTop: "20px" }}>
        Para finalizar seu pagamento, entre em contato conosco:
      </p>
      <a
        href="https://wa.me/5511915857807"
        target="_blank"
        rel="noreferrer"
        style={{
          marginTop: "30px",
          display: "inline-block",
          padding: "12px 20px",
          backgroundColor: secondaryColor(),
          color: "#fff",
          borderRadius: "8px",
          textDecoration: "none",
          fontSize: "18px",
        }}
      >
        Falar com a gente no WhatsApp
      </a>
    </div>
  );
}

export default FeeNotUpToDate;
