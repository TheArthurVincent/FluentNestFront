import React, { useEffect, useState } from "react";
import { HOne, HTwo } from "../../../../Resources/Components/RouteBox";
import axios from "axios";
import { backDomain } from "../../../../Resources/UniversalComponents";
import { CircularProgress, Button, TextField } from "@mui/material";
import {
  alwaysWhite,
  lightGreyColor,
  partnerColor,
} from "../../../../Styles/Styles";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import HTMLEditor from "../../../../Resources/Components/HTMLEditor";

export function ManageGroupClasses({ headers }) {
  const [coursesList, setCoursesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [classTitle, setClassTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [googleDriveLink, setGoogleDriveLink] = useState("");
  const [moduleTitle, setModuleTitle] = useState("");
  const [classCourse, setClassCourse] = useState("");
  const [ID, setID] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newGoogleDriveLink, setNewGoogleDriveLink] = useState("");
  const [newModuleTitle, setNewModuleTitle] = useState("group class");
  const [newCourseTitle, setNewCourseTitle] = useState("group class");
  const [newDescription, setNewDescription] = useState("");
  const [partner, setPartner] = useState("0");
  const [tabValue, setTabValue] = useState("1");

  const handleDescriptionChange = (htmlContent) => {
    setNewDescription(htmlContent);
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/allcourseobjects`,
        { headers }
      );
      setCoursesList(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Erro ao encontrar cursos", error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const deleteClass = async (classId) => {
    try {
      await axios.delete(`${backDomain}/api/v1/groupclass/${classId}`, {
        headers,
      });
      getCourses();
      closeModal();
    } catch (error) {
      console.log("Erro ao excluir aula", error);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  const openEditClass = async (classId) => {
    setID(classId);
    setModalVisible(true);
    setLoadingModal(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/groupclass/${classId}`,
        { headers }
      );
      setClassTitle(response.data.classTitle);
      setDescription(response.data.description);
      setVideoUrl(response.data.videoUrl);
      setGoogleDriveLink(response.data.googleDriveLink);
      setModuleTitle(response.data.moduleTitle);
      setClassCourse(response.data.courseTitle);
      setLoadingModal(false);
    } catch (error) {
      console.log("Erro ao editar aula", error);
    }
  };

  const editClass = async (classId) => {
    setLoadingModal(true);
    try {
      await axios.put(
        `${backDomain}/api/v1/groupclass/${classId}`,
        {
          classTitle,
          description,
          videoUrl,
          googleDriveLink,
          courseTitle: classCourse,
          moduleTitle,
        },
        { headers }
      );
      getCourses();
      setModalVisible(false);
    } catch (error) {
      console.log("Erro ao editar aula", error);
      getCourses();
      setModalVisible(false);
    }
  };
  const postNewClass = async () => {
    try {
      await axios.post(
        `${backDomain}/api/v1/groupclass`,
        {
          classTitle: newClassName,
          videoUrl: newVideoUrl,
          googleDriveLink: newGoogleDriveLink,
          moduleTitle: newModuleTitle,
          courseTitle: newCourseTitle,
          description: newDescription,
          partner: partner,
        },
        { headers }
      );

      setNewClassName("");
      setNewVideoUrl("");
      setNewGoogleDriveLink("");
      setNewModuleTitle("");
      setNewCourseTitle("");
      setNewDescription("");
      setPartner("");
      getCourses();
    } catch (error) {
      console.error("Erro ao postar nova aula:", error);
    }
  };

  return (
    <>
      <HOne>Gerenciar Aulas em Grupo</HOne>
      <div id="1">
        {" "}
        <HTwo>Postar aula em grupo</HTwo>
        <div
          style={{
            display: "grid",
            gap: "0.5rem",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Nome da nova aula"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: partnerColor() },
                "&:hover fieldset": { borderColor: partnerColor() },
                "&.Mui-focused fieldset": {
                  borderColor: partnerColor(),
                },
              },
              "& label": { color: partnerColor() },
              "& label.Mui-focused": { color: partnerColor() },
            }}
            variant="outlined"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="URL do Vídeo da nova aula"
            variant="outlined"
            value={newVideoUrl}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: partnerColor() },
                "&:hover fieldset": { borderColor: partnerColor() },
                "&.Mui-focused fieldset": {
                  borderColor: partnerColor(),
                },
              },
              "& label": { color: partnerColor() },
              "& label.Mui-focused": { color: partnerColor() },
            }}
            onChange={(e) => setNewVideoUrl(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Pasta da nova aula"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: partnerColor() },
                "&:hover fieldset": { borderColor: partnerColor() },
                "&.Mui-focused fieldset": {
                  borderColor: partnerColor(),
                },
              },
              "& label": { color: partnerColor() },
              "& label.Mui-focused": { color: partnerColor() },
            }}
            value={newGoogleDriveLink}
            onChange={(e) => setNewGoogleDriveLink(e.target.value)}
          />
          <HTMLEditor onChange={handleDescriptionChange} />
          <Button onClick={() => postNewClass()}>Salvar</Button>
        </div>
      </div>
    </>
  );
}

export default ManageGroupClasses;
