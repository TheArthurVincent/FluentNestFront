import React, { useEffect, useMemo, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  partnerColor,
  alwaysWhite,
  textpartnerColorContrast,
} from "../../../../../Styles/Styles";
import {
  backDomain,
  formatDateBr,
  truncateString,
} from "../../../../../Resources/UniversalComponents";
import { useUserContext } from "../../../../../Application/SelectLanguage/SelectLanguage";
import { notifyAlert } from "../../../../EnglishLessons/Assets/Functions/FunctionLessons";
import HTMLEditor from "../../../../../Resources/Components/HTMLEditor";
import {
  categoryList,
  convertToBase64,
  getEmbedUrl,
} from "../../MyCalendarFunctions/MyCalendarFunctions";
import {
  inputCheckBox,
  spanChecked,
  styleLiChecked,
} from "../../MyCalendarFunctions/MyCalendarFunctions.Styles";
interface EditModalProps {
  headers: any; // substitua pelo tipo real se souber a estrutura
  thePermissions: string[] | any;
  myId: string | number;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
  change: boolean;
  alternateBoolean?: boolean;
  setAlternateBoolean?: any;
  event: any; // substitua pelo tipo real se souber a estrutura
  onClose: () => void;
}

function EditModal({
  headers,
  thePermissions,
  myId,
  setChange,
  change,
  alternateBoolean,
  event,
  setAlternateBoolean,
  onClose,
}: EditModalProps) {
  // Estados principais
  const [loadingModalInfo, setLoadingModalInfo] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [eventFull, setEventFull] = useState<any>({});

  // Estados do formulário
  const [date, setDate] = useState("");
  const [theTime, setTheTime] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [googleDriveLink, setGoogleDriveLink] = useState("");
  const [homework, setHomework] = useState("");
  const [dueDate, setDueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [duration, setDuration] = useState(60);
  const [groupName, setGroupName] = useState("");
  const [name, setName] = useState("");

  // Estados para arquivos
  const [base64String, setBase64String] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Estados para lições e estudantes
  const [lessonsList, setLessonsList] = useState<any[]>([]);
  const [theLesson, setTheLesson] = useState<any>(null);
  const [theLessonLast, setTheLessonLast] = useState<any>(null);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [groupsList, setGroupsList] = useState<any[]>([]);
  const [newStudentId, setNewStudentId] = useState("");
  const [newGroupId, setNewGroupId] = useState("");

  // Estados para homework e flashcards
  const [showHomework, setShowHomework] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [flashcards, setFlashcards] = useState("");
  const [homeworkAdded, setHomeworkAdded] = useState(false);
  const [flashcardsAdded, setFlashcardsAdded] = useState(false);

  // Estados para últimas aulas
  const [lastFew, setLastFew] = useState<any[]>([]);
  const [showLastFew, setShowLastFew] = useState(false);

  // Estados para comentários dos estudantes
  const [studentsInGroup, setStudentsInGroup] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);

  // Estados básicos do formulário (que não existem ainda)
  const [title, setTitle] = useState("");
  const [classType, setClassType] = useState("individual");
  const [lessonId, setLessonId] = useState("");

  // Estados para arquivos (que não existem)
  const [fileURL, setFileURL] = useState("");
  const [originalFileURL, setOriginalFileURL] = useState("");

  // Listas de dados (que não existem)
  const [students, setStudents] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);

  // Inicializar dados do evento quando o modal abre
  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setCategory(event.category || "aula");
      setDescription(event.description || "");
      setHomework(event.homework || "");
      setStatus(event.status || "");
      setNewStudentId(event.student?._id || event.student || "");
      setNewGroupId(event.group?._id || event.group || "");
      setLessonId(event.lesson?._id || event.lesson || "");
      setFileURL(event.fileURL || "");
      setOriginalFileURL(event.originalFileURL || "");

      // Determinar tipo de aula
      if (event.group || event.group?._id) {
        setClassType("grupo");
      } else if (event.student || event.student?._id) {
        setClassType("individual");
      }

      // Carregar dados necessários
      fetchOneEvent(event._id || event.id);
      fetchStudents();
      getClasses();
    }
  }, [event]);

  // Estados para AI e loading
  const [showAIGENERATED, setShowAIGENERATED] = useState(false);
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [loadingHWDescription, setLoadingHWDescription] = useState(false);

  // Estados para reposição
  const [seeReplenish, setSeeReplenish] = useState(false);

  const { UniversalTexts } = useUserContext();

  // Inicializar dados quando o evento mudar
  useEffect(() => {
    if (event) {
      fetchOneEvent(event._id || event.id);
    }
  }, [event]);

  // Buscar dados do evento
  const fetchOneEvent = async (id: string) => {
    setLoadingModalInfo(true);
    if (!id) return;

    try {
      const response = await axios.get(`${backDomain}/api/v1/event/${id}`, {
        headers,
      });
      const eventData = response.data.event;

      setEventFull(eventData);
      setDate(eventData.date || "");
      setTheTime(eventData.time || "");
      setLink(eventData.link || "");
      setDescription(eventData.description || "");
      setVideo(eventData.video || "");
      setGoogleDriveLink(eventData.googleDriveLink || "");
      setHomework(eventData.homework || "");
      setDueDate(eventData.dueDate || new Date().toISOString().split("T")[0]);
      setCategory(eventData.category || "");
      setStatus(eventData.status || "");
      setDuration(eventData.duration || 60);
      setGroupName(eventData.groupName || "");
      setName(eventData.student || eventData.name || "");
      setNewStudentId(eventData.studentId || "");
      setNewGroupId(eventData.groupId || "");
      setBase64String(eventData.base64String || "");
      setFileName(eventData.fileName || "");
      setFileType(eventData.fileType || "");
      setFlashcards(eventData.flashcards || "");
      setTheLesson(eventData.lesson || null);

      // Buscar últimas aulas se for tutoring
      if (eventData.category === "Tutoring" && eventData.studentId) {
        fetchLastFewClasses(eventData.studentId);
      }

      // Buscar estudantes do grupo se for aula em grupo
      if (
        (eventData.category === "Group Class" ||
          eventData.category === "Established Group Class") &&
        eventData.groupId
      ) {
        fetchGroupStudents(eventData.groupId);
      }
    } catch (error: any) {
      console.log(error, "Erro ao buscar evento");
      notifyAlert("Erro ao carregar dados do evento", partnerColor());
    } finally {
      setLoadingModalInfo(false);
    }
  };

  // Buscar últimas aulas de um estudante
  const fetchLastFewClasses = async (studentId: string) => {
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/lastfewevents/${studentId}`,
        { headers }
      );
      setLastFew(response.data.lastEvents || []);
      if (response.data.lastEvents && response.data.lastEvents.length > 0) {
        setTheLessonLast(response.data.lastEvents[0].lesson || null);
      }
    } catch (error) {
      console.log(error, "Erro ao buscar últimas aulas");
    }
  };

  // Buscar estudantes do grupo
  const fetchGroupStudents = async (groupId: string) => {
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/groupstudents/${groupId}`,
        { headers }
      );
      const students = response.data.students || [];
      setStudentsInGroup(students);
      setComments(students.map(() => ({ description: "" })));
    } catch (error) {
      console.log(error, "Erro ao buscar estudantes do grupo");
    }
  };

  // Buscar lições disponíveis
  const getClasses = async () => {
    if (thePermissions === "superadmin" || thePermissions === "teacher") {
      try {
        const response = await axios.get(`${backDomain}/api/v1/lessons`, {
          headers,
        });
        setLessonsList(response.data.lessons || []);
      } catch (error) {
        console.log(error, "Erro ao buscar lições");
      }
    }
  };

  // Buscar estudantes e grupos
  const fetchStudents = async () => {
    if (thePermissions === "superadmin" || thePermissions === "teacher") {
      try {
        const [studentsResponse, groupsResponse] = await Promise.all([
          axios.get(`${backDomain}/api/v1/students/${myId}`, { headers }),
          axios.get(`${backDomain}/api/v1/groups/${myId}`, { headers }),
        ]);
        setStudentsList(studentsResponse.data.listOfStudents || []);
        setGroupsList(groupsResponse.data.groups || []);
      } catch (error) {
        console.log(error, "Erro ao buscar estudantes e grupos");
      }
    }
  };

  useEffect(() => {
    getClasses();
    fetchStudents();
  }, []);

  // Função para atualizar comentário de estudante
  const handleStudentDescriptionChange = (index: number, value: string) => {
    setComments((prev: any[]) => {
      const newComments = [...prev];
      newComments[index] = { ...newComments[index], description: value };
      return newComments;
    });
  };

  // Função para editar evento
  const editOneEvent = async () => {
    setLoadingInfo(true);
    try {
      const updateData = {
        id: event._id || event.id,
        date,
        time: theTime,
        link,
        description,
        video,
        googleDriveLink,
        homework,
        dueDate,
        duration,
        flashcards,
        base64String,
        fileName,
        fileType,
        lesson: theLesson,
        studentComments: comments,
      };

      await axios.put(`${backDomain}/api/v1/event`, updateData, { headers });
      notifyAlert("Evento atualizado com sucesso!", partnerColor());
      setShowEditForm(false);
      setChange(!change);
      setAlternateBoolean?.(!alternateBoolean);
    } catch (error: any) {
      console.log(error, "Erro ao editar evento");
      notifyAlert("Erro ao atualizar evento", partnerColor());
    } finally {
      setLoadingInfo(false);
    }
  };

  // Função para deletar evento
  const deleteOneEvent = async () => {
    setLoadingInfo(true);
    try {
      await axios.delete(`${backDomain}/api/v1/event`, {
        data: { id: event._id || event.id },
        headers,
      });
      notifyAlert("Evento deletado com sucesso!", partnerColor());
      setChange(!change);
      setAlternateBoolean?.(!alternateBoolean);
    } catch (error: any) {
      console.log(error, "Erro ao deletar evento");
      notifyAlert("Erro ao deletar evento", partnerColor());
    } finally {
      setLoadingInfo(false);
    }
  };

  // Atualizar status para marcado
  const updateScheduled = async () => {
    try {
      await axios.put(
        `${backDomain}/api/v1/eventstatus`,
        {
          id: event._id || event.id,
          status: "marcado",
        },
        { headers }
      );
      notifyAlert("Status atualizado para Marcado!", partnerColor());
      setStatus("marcado");
      setChange(!change);
    } catch (error) {
      console.log(error, "Erro ao atualizar status");
    }
  };

  // Atualizar status para desmarcado
  const updateUnscheduled = async () => {
    try {
      await axios.put(
        `${backDomain}/api/v1/eventstatus`,
        {
          id: event._id || event.id,
          status: "desmarcado",
        },
        { headers }
      );
      notifyAlert("Status atualizado para Desmarcado!", partnerColor());
      setStatus("desmarcado");
      setChange(!change);
    } catch (error) {
      console.log(error, "Erro ao atualizar status");
    }
  };

  // Atualizar status para realizada
  const updateRealizedClass = async () => {
    try {
      await axios.put(
        `${backDomain}/api/v1/eventstatus`,
        {
          id: event._id || event.id,
          status: "realizada",
        },
        { headers }
      );
      notifyAlert("Status atualizado para Realizada!", partnerColor());
      setStatus("realizada");
      setChange(!change);
    } catch (error) {
      console.log(error, "Erro ao atualizar status");
    }
  };

  // Handle file upload
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);

    if (file) {
      setUploading(true);
      try {
        const base64 = await convertToBase64(file);
        setBase64String(base64.split(",")[1]); // Remove data:type;base64, prefix
        setFileName(file.name);
        setFileType(file.type);
      } catch (error) {
        console.log(error, "Erro ao converter arquivo");
      } finally {
        setUploading(false);
      }
    } else {
      clearFile();
    }
  };

  // Limpar arquivo
  const clearFile = () => {
    setSelectedFile(null);
    setBase64String("");
    setFileName("");
    setFileType("");
  };

  // Handle lesson change
  const handleLessonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id || id.startsWith("sep:")) return;

    const found =
      lessonsList.find((lesson: any) => String(lesson.id) === id) || null;
    setTheLesson(found);
  };

  // Gerar resumo da aula com AI
  const handleClassSummary = async () => {
    setLoadingDescription(true);
    if (thePermissions === "superadmin" || thePermissions === "teacher") {
      try {
        const prompt = `Generate a class summary for: ${
          theLesson?.title || "English lesson"
        }`;
        const response = await axios.post(
          `${backDomain}/api/v1/ai-description`,
          { prompt },
          { headers }
        );
        setDescription(response.data.description || "");
      } catch (error) {
        console.log(error, "Erro ao gerar resumo");
      } finally {
        setLoadingDescription(false);
      }
    }
  };

  // Gerar homework com AI
  const handleHWDescription = async () => {
    setLoadingHWDescription(true);
    if (thePermissions === "superadmin" || thePermissions === "teacher") {
      try {
        const prompt = `Generate homework for: ${
          theLesson?.title || "English lesson"
        }`;
        const response = await axios.post(
          `${backDomain}/api/v1/ai-homework`,
          { prompt },
          { headers }
        );
        setHomework(response.data.homework || "");
      } catch (error) {
        console.log(error, "Erro ao gerar homework");
      } finally {
        setLoadingHWDescription(false);
      }
    }
  };

  // Função para atualizar status para realizada
  const updateCompleted = async () => {
    try {
      await axios.put(
        `${backDomain}/api/v1/eventstatus`,
        {
          id: event._id || event.id,
          status: "realizada",
        },
        { headers }
      );
      notifyAlert("Status atualizado para Realizada!", partnerColor());
      setStatus("realizada");
      setChange(!change);
    } catch (error) {
      console.log(error, "Erro ao atualizar status");
    }
  };

  // Função para deletar evento
  const deleteThisEvent = async () => {
    if (!window.confirm("Tem certeza que deseja deletar este evento?")) return;

    setLoadingInfo(true);
    try {
      await axios.delete(
        `${backDomain}/api/v1/event/${event._id || event.id}`,
        { headers }
      );
      notifyAlert("Evento deletado com sucesso!", partnerColor());
      setChange(!change);
      setAlternateBoolean?.(!alternateBoolean);
      onClose();
    } catch (error: any) {
      console.log(error, "Erro ao deletar evento");
      notifyAlert("Erro ao deletar evento", partnerColor());
    } finally {
      setLoadingInfo(false);
    }
  };

  // Função para gerar descrição com AI
  const handleAiDescription = async () => {
    setLoadingDescription(true);
    if (thePermissions === "superadmin" || thePermissions === "teacher") {
      try {
        const prompt = `Generate a class description for: ${
          theLesson?.title || "English lesson"
        }`;
        const response = await axios.post(
          `${backDomain}/api/v1/ai-description`,
          { prompt },
          { headers }
        );
        setDescription(response.data.description || "");
      } catch (error) {
        console.log(error, "Erro ao gerar descrição");
      } finally {
        setLoadingDescription(false);
      }
    }
  };

  // Função para upload de arquivos
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const base64 = await convertToBase64(file);
      setBase64String(base64 as string);
      setFileName(file.name);
      setFileType(file.type);
      setSelectedFile(file);

      // Criar URL temporária para preview
      const url = URL.createObjectURL(file);
      setFileURL(url);
    } catch (error) {
      console.log(error, "Erro ao processar arquivo");
    } finally {
      setUploading(false);
    }
  };

  // Grouped lessons for better organization
  const grouped = useMemo(() => {
    const byCourse: { [course: string]: { [module: string]: any[] } } = {};
    for (const lesson of lessonsList) {
      const course = lesson.course || "Outros";
      const module = lesson.module || "Sem módulo";
      if (!byCourse[course]) byCourse[course] = {};
      if (!byCourse[course][module]) byCourse[course][module] = [];
      byCourse[course][module].push(lesson);
    }
    return byCourse;
  }, [lessonsList]);

  // Handle homework change from HTMLEditor
  const handleHomeworkChange = (htmlContent: string) => {
    setHomework(htmlContent);
  };

  // Handle schedule replenishment
  const handleScheduleReplenish = async () => {
    try {
      await axios.post(
        `${backDomain}/api/v1/schedule-replenishment`,
        {
          eventId: event._id || event.id,
          studentId: newStudentId,
          groupId: newGroupId,
        },
        { headers }
      );
      notifyAlert("Reposição agendada com sucesso!", partnerColor());
      setSeeReplenish(false);
      setChange(!change);
    } catch (error) {
      console.log(error, "Erro ao agendar reposição");
    }
  };

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const authorizeOrNot =
    thePermissions === "superadmin" || thePermissions === "teacher";

  return (
    <>
      {loadingModalInfo ? (
        <CircularProgress style={{ color: partnerColor() }} />
      ) : (
        <>{name}</>
      )}
    </>
  );
}

export default EditModal;
