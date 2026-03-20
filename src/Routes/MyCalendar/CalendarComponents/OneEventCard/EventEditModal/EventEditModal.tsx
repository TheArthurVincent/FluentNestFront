import React, { useEffect, useMemo, useState } from "react";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { partnerColor } from "../../../../../Styles/Styles";
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
interface EditModalProps {
  headers: any; // substitua pelo tipo real se souber a estrutura
  thePermissions: string[] | any;
  myId: string | number;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
  change: boolean;
  fetchStudents: () => void;
  alternateBoolean?: boolean;
  studentID?: string;
  setAlternateBoolean?: any;
  event: any; // substitua pelo tipo real se souber a estrutura
  onClose: () => void;
  onEventUpdated?: () => void; // Callback para atualizar dados do calendário
}

function EditModal({
  headers,
  thePermissions,
  myId,
  setChange,
  change,
  alternateBoolean,
  fetchStudents,
  event,
  studentID,
  setAlternateBoolean,
  onClose,
  onEventUpdated,
}: EditModalProps) {
  // Estados principais
  const [loadingModalInfo, setLoadingModalInfo] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [eventFull, setEventFull] = useState<any>({});
  const [theLesson, setTheLesson] = useState<any>(null);

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
  const [POSTNEWINFOCLASS, setPOSTNEWINFOCLASS] = useState(false);

  // Estados para últimas aulas
  const [lastFew, setLastFew] = useState<any[]>([]);
  const [showLastFew, setShowLastFew] = useState(false);
  const [isTutoring, setIsTutoring] = useState(false);

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

  const getClasses = async () => {
    if (thePermissions === "superadmin" || thePermissions === "teacher") {
      try {
        const { data } = await axios.get(
          `${backDomain}/api/v1/courses-organized/${myId}`,
          { headers }
        );
        const res = data?.lessons ?? [];
        setLessonsList(res);
      } catch (error) {
        console.log(error, "Erro ao encontrar cursos");
      }
    }
  };

  // Inicializar dados do evento quando o modal abre
  useEffect(() => {
    if (event) {
      console.log("Evento recebido no modal:", event);
      setTitle(event.title || "");
      setCategory(event.category || "aula");
      setDescription(event.description || "");
      setHomework(event.homework || "");
      setStatus(event.status || "");
      setHomeworkAdded(event.homeworkAdded || false);
      setFlashcardsAdded(event.flashcardsAdded || false);
      setNewStudentId(
        studentID ||
          event.student?._id ||
          event.student?.id ||
          event.studentId ||
          ""
      );
      setNewGroupId(event.group?._id || event.group?.id || event.groupId || "");
      setLessonId(event.lesson?._id || event.lesson?.id || "");
      setFileURL(event.fileURL || "");
      setOriginalFileURL(event.originalFileURL || "");

      // Determinar tipo de aula
      if (event.group || event.group?._id) {
        setClassType("turma");
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
      setTheLesson(eventData.theLesson || null);

      // Buscar últimas aulas se for tutoring
      if (
        eventData.category === "Tutoring" &&
        eventData.studentId &&
        eventData.studentId.trim() !== ""
      ) {
        fetchLastFewClasses(eventData.studentId);
      }

      // Buscar estudantes da turma se for aula da turma
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
    // Verificar se studentId é válido antes de fazer a requisição
    if (!studentId || studentId.trim() === "") {
      console.log("StudentId inválido ou vazio:", studentId);
      return;
    }

    try {
      const response = await axios.get(
        `${backDomain}/api/v1/lastfewevents/${studentId}`,
        { headers }
      );
      setLastFew(response.data.lastEvents || []);
      if (response.data.lastEvents && response.data.lastEvents.length > 0) {
        setTheLessonLast(response.data.lastEvents[0].lesson || null);
      }
    } catch (error: any) {
      console.log(error, "Erro ao buscar últimas aulas");

      // Se for 404, tentar endpoint alternativo
      if (error.response?.status === 404) {
        console.log(
          "Endpoint lastfewevents não encontrado, tentando endpoint alternativo"
        );
        try {
          // Tentar endpoint alternativo para buscar eventos gerais e filtrar
          const today = new Date();
          const twoWeeksAgo = new Date(
            today.getTime() - 14 * 24 * 60 * 60 * 1000
          );
          const response = await axios.get(
            `${backDomain}/api/v1/eventsgeneral/${studentId}`,
            {
              headers,
              params: {
                today: twoWeeksAgo.toISOString().split("T")[0],
              },
            }
          );

          // Filtrar eventos recentes e realizados
          const recentEvents =
            response.data.events
              ?.filter((event: any) => {
                const eventDate = new Date(event.date);
                const daysDiff =
                  (today.getTime() - eventDate.getTime()) / (1000 * 3600 * 24);
                return (
                  daysDiff >= 0 &&
                  daysDiff <= 14 &&
                  event.status === "realizada"
                );
              })
              .slice(0, 5) || [];

          setLastFew(recentEvents);
          if (recentEvents.length > 0) {
            setTheLessonLast(recentEvents[0].lesson || null);
          }
        } catch (alternativeError) {
          // Se ambos falharem, apenas ignorar silenciosamente
          setLastFew([]);
          setTheLessonLast(null);
        }
      } else {
        // Para outros tipos de erro, apenas limpar os dados
        setLastFew([]);
        setTheLessonLast(null);
      }
    }
  };

  // Buscar estudantes da turma
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
      console.log(error, "Erro ao buscar estudantes da turma");
    }
  };

  useEffect(() => {
    getClasses();
    fetchStudents();
  }, []);

  // useEffect separado para buscar últimas aulas quando newStudentId mudar
  useEffect(() => {
    if (newStudentId && newStudentId.trim() !== "") {
      fetchLastFewClasses(newStudentId);
    }
  }, [newStudentId]);

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
      // Validações básicas
      if (!date || !theTime) {
        notifyAlert("Data e horário são obrigatórios", partnerColor());
        return;
      }

      // Determinar se é tutoring baseado na categoria
      const isTutoringClass =
        category === "Tutoring" ||
        category === "Standalone" ||
        category === "Prize Class" ||
        category === "Rep" ||
        category === "Marcar Reposição";

      let backendStatus = status;
      if (status === "Scheduled") {
        backendStatus = "marcado";
      } else if (status === "Canceled") {
        backendStatus = "desmarcado";
      } else if (status === "Realized") {
        backendStatus = "realizada";
      }

      const userString = localStorage.getItem("loggedIn");
      const user = userString ? JSON.parse(userString) : { id: null };

      const response = await axios.put(
        `${backDomain}/api/v1/event/${event._id || event.id}`,
        {
          studentID: isTutoringClass ? user.id || newStudentId : null,
          date,
          time: theTime,
          category: category || "aula",
          status: backendStatus,
          link: link || "",
          video: video || "",
          homework: homework || "",
          googleDriveLink: googleDriveLink || "",
          dueDate: dueDate || "",
          theLesson: theLesson ? theLesson : null,
          duration: duration || 60,
          base64String: base64String || "",
          fileName: fileName || "",
          showHomework: showHomework || false,
          showFlashcards: showFlashcards || false,
          fileType: fileType || "",
          newFlashcards: flashcards || "",
          description: description || "",
          group: newGroupId || null,
          teacherID: user.id,
          POSTNEWINFOCLASS: POSTNEWINFOCLASS || false,
          comments: comments || [],
        },
        {
          headers,
        }
      );

      if (response) {
        notifyAlert("Evento atualizado com sucesso!", partnerColor());
        setShowEditForm(false);
        setChange(!change);
        setAlternateBoolean?.(!alternateBoolean);
        // Recarregar dados do evento
        fetchOneEvent(event._id || event.id);
        // Atualizar dados do calendário principal
        onEventUpdated?.();
      }
    } catch (error: any) {
      console.log(error, "Erro ao editar evento");
      console.log("Resposta do servidor:", error.response?.data);
      notifyAlert("Erro ao atualizar evento", partnerColor());
    } finally {
      setLoadingInfo(false);
    }
  };

  // Atualizar status para marcado
  const updateScheduled = async () => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/eventstatus/${event._id || event.id}`,
        {
          status: "marcado",
        },
        { headers }
      );
      if (response) {
        setStatus("marcado");
        setChange(!change);
        fetchOneEvent(event._id || event.id);
        // Atualizar dados do calendário principal
        onEventUpdated?.();
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar status");
    }
  };

  // Atualizar status para desmarcado
  const updateUnscheduled = async () => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/eventstatus/${event._id || event.id}`,
        {
          status: "desmarcado",
        },
        { headers }
      );
      if (response) {
        setStatus("desmarcado");
        setChange(!change);
        fetchOneEvent(event._id || event.id);
        // Atualizar dados do calendário principal
        onEventUpdated?.();
      }
    } catch (error) {
      console.log(error, "Erro ao atualizar status");
    }
  };

  // Atualizar status para realizada
  const updateRealizedClass = async () => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/eventstatus/${event._id || event.id}`,
        {
          status: "realizada",
        },
        { headers }
      );
      if (response) {
        setStatus("realizada");
        setChange(!change);
        fetchOneEvent(event._id || event.id);
        // Atualizar dados do calendário principal
        onEventUpdated?.();
      }
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
    if (thePermissions == "superadmin" || thePermissions == "teacher") {
      try {
        const response = await axios.put(
          `${backDomain}/api/v1/ai-description/${myId}`,
          { description, classTitle: theLesson?.title || "", status },
          { headers }
        );
        const adapted = response.data.adapted;
        setDescription(adapted);
        setLoadingDescription(false);
        setChange(!change);
      } catch (error) {
        setLoadingDescription(false);
        // notifyAlert(error?.response?.data?.message);
        console.log(error, "Erro");
      }
    }
  };
  // Gerar homework com AI
  const handleHWDescription = async () => {
    setLoadingHWDescription(true);
    if (thePermissions === "superadmin" || thePermissions === "teacher") {
      try {
        const response = await axios.put(
          `${backDomain}/api/v1/ai-description-hw/${myId}`,
          { homework },
          { headers }
        );
        const adapted = response.data.adapted;
        setShowAIGENERATED(true);
        setHomework(adapted);
        setLoadingHWDescription(false);
        setChange(!change);
      } catch (error: any) {
        setLoadingHWDescription(false);
        console.log(error, "Erro");
        notifyAlert(error?.response?.data?.message);
      }
    }
  };

  // Função para deletar evento
  const deleteThisEvent = async () => {
    if (!window.confirm("Tem certeza que deseja deletar este evento?")) return;

    setLoadingInfo(true);
    try {
      const response = await axios.delete(
        `${backDomain}/api/v1/event/${event._id || event.id}`,
        { headers }
      );

      if (response) {
        notifyAlert("Evento deletado com sucesso!", partnerColor());
        setChange(!change);
        setAlternateBoolean?.(!alternateBoolean);
        // Atualizar dados do calendário principal
        onEventUpdated?.();
        onClose();
      }
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
      // Atualizar dados do calendário principal
      onEventUpdated?.();
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
        <div>
          {/* Header Info */}
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <div style={{ fontWeight: "bold", fontSize: "1.1em" }}>
              {event.title || name}
            </div>
            <div style={{ color: "#6c757d", marginTop: "0.5rem" }}>
              {formatDateForDisplay(event.date)} - {event.time}
            </div>
          </div>

          {/* Status Buttons - Same as MyCalendar */}
          {authorizeOrNot && !showEditForm && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                padding: "0.5rem",
                backgroundColor: "#f8f9fa",
                borderRadius: 4,
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => updateScheduled()}
              >
                <i
                  className="fa fa-clock-o"
                  style={{
                    fontSize: status === "marcado" ? "24px" : "18px",
                    color: status === "marcado" ? "#007bff" : "#6c757d",
                    transition: "all 0.2s",
                  }}
                />
                <div
                  style={{
                    color: status === "marcado" ? "#007bff" : "#6c757d",
                    marginTop: "2px",
                    fontSize: "12px",
                  }}
                >
                  {UniversalTexts.calendarModal?.scheduled || "Marcado"}
                </div>
              </div>

              <div
                style={{
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => updateRealizedClass()}
              >
                <i
                  className="fa fa-check-circle"
                  style={{
                    fontSize: status === "realizada" ? "24px" : "18px",
                    color: status === "realizada" ? "#28a745" : "#6c757d",
                    transition: "all 0.2s",
                  }}
                />
                <div
                  style={{
                    color: status === "realizada" ? "#28a745" : "#6c757d",
                    marginTop: "2px",
                    fontSize: "12px",
                  }}
                >
                  {UniversalTexts.calendarModal?.realized || "Realizada"}
                </div>
              </div>

              <div
                style={{
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => updateUnscheduled()}
              >
                <i
                  className="fa fa-times-circle-o"
                  style={{
                    fontSize: status === "desmarcado" ? "24px" : "18px",
                    color: status === "desmarcado" ? "#dc3545" : "#6c757d",
                    transition: "all 0.2s",
                  }}
                />
                <div
                  style={{
                    color: status === "desmarcado" ? "#dc3545" : "#6c757d",
                    marginTop: "2px",
                    fontSize: "12px",
                  }}
                >
                  {UniversalTexts.calendarModal?.canceled || "Desmarcado"}
                </div>
              </div>
            </div>
          )}

          {/* Edit and Delete Buttons */}
          {authorizeOrNot && !showEditForm && !deleteVisible && (
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <button
                onClick={() => setShowEditForm(!showEditForm)}
                style={{
                  backgroundColor: partnerColor(),
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                {showEditForm ? "Cancelar" : "Editar"}
              </button>
              <button
                onClick={() => setDeleteVisible(!deleteVisible)}
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Deletar
              </button>
            </div>
          )}

          {/* Delete Confirmation */}
          {deleteVisible && (
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "1rem",
                borderRadius: 4,
                border: "1px solid #dee2e6",
                marginTop: "1rem",
                textAlign: "center",
              }}
            >
              <p>Tem certeza que deseja deletar este evento?</p>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={deleteThisEvent}
                  disabled={loadingInfo}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  {loadingInfo ? "Deletando..." : "Confirmar"}
                </button>
                <button
                  onClick={() => setDeleteVisible(false)}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
          {!showEditForm && (
            <div
              style={{
                maxWidth: "100%",
                margin: "0 auto",
                padding: "0 1rem",
              }}
            >
              {/* Link da aula */}
              {link && (
                <div
                  style={{
                    fontWeight: "600",
                    padding: "12px 16px",
                    textAlign: "center",
                    backgroundColor: "#f8f9fa",
                    borderRadius: 4,
                    marginBottom: "8px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textAlign: "center",
                      marginLeft: "8px",
                      color: partnerColor(),
                      textDecoration: "none",
                      fontSize: "14px",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.textDecoration = "underline")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.textDecoration = "none")
                    }
                  >
                    Acessar aula
                  </a>
                </div>
              )}
              {/* Informações básicas em grid discreto */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  marginBottom: "0.5rem",
                }}
              >
                {/* Categoria */}
                {category && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 12px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: 4,
                      border: "1px solid #e9ecef",
                      fontSize: "13px",
                    }}
                  >
                    <i
                      className="fa fa-tag"
                      style={{
                        color: "#6c757d",
                        marginRight: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <span style={{ color: "#6c757d" }}>
                      {categoryList.map((cat, index) =>
                        cat.value == category ? (
                          <span key={index}>{cat.text}</span>
                        ) : null
                      )}
                    </span>
                  </div>
                )}
                {/* Duração */}
                {duration && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 12px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: 4,
                      border: "1px solid #e9ecef",
                      fontSize: "13px",
                    }}
                  >
                    <i
                      className="fa fa-clock-o"
                      style={{
                        color: "#6c757d",
                        marginRight: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <span style={{ color: "#6c757d" }}>{duration} min</span>
                  </div>
                )}
                {/* Google Drive */}
                {googleDriveLink && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 12px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: 4,
                      border: "1px solid #e9ecef",
                      fontSize: "13px",
                    }}
                  >
                    <i
                      className="fa fa-google"
                      style={{
                        color: "#6c757d",
                        marginRight: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <a
                      href={googleDriveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: partnerColor(),
                        textDecoration: "none",
                        fontSize: "13px",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.textDecoration = "underline")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.textDecoration = "none")
                      }
                    >
                      Link Importante
                    </a>
                  </div>
                )}
                {/* Lição relacionada */}
                {theLesson && theLesson.course && theLesson.id && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px 12px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: 4,
                      border: "1px solid #e9ecef",
                      fontSize: "13px",
                    }}
                  >
                    <i
                      className="fa fa-book"
                      style={{
                        color: "#6c757d",
                        marginRight: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <a
                      href={`/teaching-materials/${theLesson.course
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^\w\-]+/g, "")}/${theLesson.id}`}
                      target="_blank"
                      style={{
                        color: partnerColor(),
                        textDecoration: "none",
                        fontSize: "13px",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.textDecoration = "underline")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.textDecoration = "none")
                      }
                    >
                      {truncateString(theLesson.title, 12)} |{" "}
                      {truncateString(theLesson.course, 12)}
                    </a>
                  </div>
                )}
              </div>

              {/* Descrição da aula */}
              {description && (
                <div
                  style={{
                    backgroundColor: "#fff",
                    padding: "16px",
                    borderRadius: 4,
                    border: "1px solid #e9ecef",
                    borderLeft: `4px solid ${partnerColor()}`,
                    marginBottom: "1.5rem",
                  }}
                >
                  <h6
                    style={{
                      margin: "0 0 8px 0",
                      color: partnerColor(),
                      fontWeight: "600",
                      fontSize: "14px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Descrição da Aula
                  </h6>
                  <p
                    style={{
                      margin: 0,
                      color: "#495057",
                      lineHeight: "1.5",
                      fontSize: "14px",
                    }}
                  >
                    {description}
                  </p>
                </div>
              )}

              {/* Homework */}
              {homework && (
                <div
                  style={{
                    backgroundColor: "#fff",
                    padding: "16px",
                    borderRadius: 4,
                    border: "1px solid #e9ecef",
                    borderLeft: `4px solid #ffc107`,
                    marginBottom: "1.5rem",
                  }}
                >
                  <h6
                    style={{
                      margin: "0 0 8px 0",
                      color: "#ffc107",
                      fontWeight: "600",
                      fontSize: "14px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Homework
                  </h6>
                  <div
                    style={{
                      color: "#495057",
                      lineHeight: "1.5",
                      fontSize: "14px",
                    }}
                    dangerouslySetInnerHTML={{ __html: homework }}
                  />
                  {dueDate && (
                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "12px",
                        color: "#6c757d",
                        fontStyle: "italic",
                      }}
                    >
                      Prazo: {new Date(dueDate).toLocaleDateString("pt-BR")}
                    </div>
                  )}
                </div>
              )}

              {/* Last Few Classes */}
              {lastFew.length > 0 &&
                category !== "Test Class" &&
                category !== "Standalone" &&
                category !== "Group Class" &&
                category !== "Established Group Class" &&
                category !== "Marcar Reposição" && (
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: 4,
                        border: "1px solid #e9ecef",
                        cursor: "pointer",
                      }}
                      onClick={() => setShowLastFew(!showLastFew)}
                    >
                      <span style={{ fontWeight: "500", color: "#495057" }}>
                        Últimas aulas ({lastFew.length})
                      </span>
                      <i
                        className={`fa fa-chevron-${
                          showLastFew ? "up" : "down"
                        }`}
                        style={{ color: "#6c757d" }}
                      />
                    </div>

                    {showLastFew && (
                      <div
                        style={{
                          marginTop: "8px",
                          padding: "12px",
                          backgroundColor: "#fff",
                          borderRadius: 4,
                          border: "1px solid #e9ecef",
                        }}
                      >
                        {lastFew.map((classItem, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "8px 0",
                              borderBottom:
                                index < lastFew.length - 1
                                  ? "1px solid #e9ecef"
                                  : "none",
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontWeight: "500",
                                  fontSize: "14px",
                                  color: "#495057",
                                }}
                              >
                                {formatDateBr(classItem.date)}
                              </div>
                              {classItem.lesson && (
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#6c757d",
                                    marginTop: "2px",
                                  }}
                                >
                                  {classItem.lesson.title}
                                </div>
                              )}
                            </div>
                            <div
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: 4,
                                backgroundColor: "#28a745",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              {/* Vídeo da aula - Última seção */}
              {video && (
                <div style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      position: "relative",
                      paddingBottom: "56.25%",
                      height: 0,
                      overflow: "hidden",
                      borderRadius: 4,
                      backgroundColor: "#000",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    <iframe
                      src={getEmbedUrl(video)}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: "none",
                        borderRadius: 4,
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Class Video"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Edit Form */}
          {showEditForm &&
            (status !== "desmarcado" ? (
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "1rem",
                  borderRadius: 4,
                  border: "1px solid #dee2e6",
                  marginTop: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h4>Editar Evento</h4>
                  <span
                    style={{
                      color: "black",
                      fontWeight: "900",
                    }}
                    onClick={() => setShowEditForm(false)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.cursor = "pointer";
                      e.currentTarget.style.color = partnerColor();
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.cursor = "pointer";
                      e.currentTarget.style.color = "black";
                    }}
                  >
                    x
                  </span>
                </div>
                {/* Description */}
                <div
                  style={{
                    display: "grid",
                    alignItems: "center",
                    gap: "1rem",
                    gridTemplateColumns: "1fr 1fr",
                  }}
                >
                  <div style={{ marginBottom: "1rem" }}>
                    <label>Descrição:</label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "4px",
                          marginTop: "4px",
                        }}
                      />
                      <button
                        title="-5"
                        style={{
                          all: "unset",
                          fontSize: "1rem",
                          border: "null",
                          padding: "0",
                          backgroundColor: "transparent",
                          cursor:
                            loadingDescription || !description
                              ? "not-allowed"
                              : "pointer",
                          opacity: loadingDescription || !description ? 0.5 : 1,
                        }}
                        disabled={loadingDescription || !description}
                        onClick={handleClassSummary}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "2px",
                          }}
                        >
                          ✨{" "}
                          <span
                            style={{
                              fontSize: "0.75rem",
                              verticalAlign: "super",
                              marginLeft: "-2px",
                            }}
                          >
                            -5
                          </span>
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Lesson Selection */}
                  <div style={{ marginBottom: "1rem" }}>
                    <label>Aula Usada:</label>
                    <select
                      onChange={handleLessonChange}
                      value={theLesson?.id ? String(theLesson.id) : ""}
                      style={{
                        width: "100%",
                        padding: "4px",
                        marginTop: "4px",
                      }}
                    >
                      <option value="" hidden>
                        Selecionar aula...
                      </option>
                      {Object.entries(grouped).map(([course, modules]) => (
                        <optgroup key={course} label={course}>
                          {Object.entries(modules).map(([module, ls]) => (
                            <React.Fragment key={`${course}-${module}`}>
                              <option
                                value={`sep:${course}:${module}`}
                                disabled
                              >
                                — {module} —
                              </option>
                              {ls.map((l) => (
                                <option key={l.id} value={String(l.id)}>
                                  {l.title}
                                </option>
                              ))}
                            </React.Fragment>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>
                {status !== "realizada" && (
                  <div
                    style={{
                      display: "grid",
                      gap: "1rem",
                      gridTemplateColumns: "1fr 1fr",
                    }}
                  >
                    <div style={{ marginBottom: "1rem" }}>
                      <label>Data:</label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "4px",
                          marginTop: "4px",
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                      <label>Horário:</label>
                      <input
                        type="time"
                        value={theTime}
                        onChange={(e) => setTheTime(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "4px",
                          marginTop: "4px",
                        }}
                      />
                    </div>
                  </div>
                )}
                {/* Link */}
                {status !== "realizada" && (
                  <div style={{ marginBottom: "1rem" }}>
                    <label>Link da aula:</label>
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://..."
                      style={{
                        width: "100%",
                        padding: "4px",
                        marginTop: "4px",
                      }}
                    />
                  </div>
                )}
                {/* Link */}
                {status == "realizada" && (
                  <div style={{ marginBottom: "1rem" }}>
                    <label>Vídeo:</label>
                    <input
                      type="url"
                      value={video}
                      onChange={(e) => setVideo(e.target.value)}
                      placeholder="https://youtube.com/..."
                      style={{
                        width: "100%",
                        padding: "4px",
                        marginTop: "4px",
                      }}
                    />
                  </div>
                )}
                {/* Google Drive */}
                <div
                  style={{
                    display: "grid",
                    gap: "1rem",
                    gridTemplateColumns: "1fr 1fr",
                  }}
                >
                  <div style={{ marginBottom: "1rem" }}>
                    <label>Google Drive:</label>
                    <input
                      type="url"
                      value={googleDriveLink}
                      onChange={(e) => setGoogleDriveLink(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      style={{
                        width: "100%",
                        padding: "4px",
                        marginTop: "4px",
                      }}
                    />
                  </div>
                  {/* Duration */}
                  <div style={{ marginBottom: "1rem" }}>
                    <label>Duração (minutos):</label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      style={{
                        width: "100%",
                        padding: "4px",
                        marginTop: "4px",
                      }}
                    />
                  </div>
                </div>
                <div>
                  {/* Homework Section */}
                  <span>
                    {!homeworkAdded && status == "realizada" && (
                      <div style={{ marginBottom: "5px" }}>
                        <button
                          type="button"
                          onClick={() => setShowHomework(!showHomework)}
                          style={{
                            padding: "6px 12px",
                            fontSize: "13px",
                            fontWeight: "500",
                            color: "#6c757d",
                            backgroundColor: "white",
                            border: "1px solid #e9ecef",
                            borderRadius: "6px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          {showHomework ? "- Hide Homework" : "+ Add Homework"}
                        </button>
                        {showHomework && (
                          <div>
                            <label
                              style={{
                                display: "block",
                                marginBottom: "0.5rem",
                                fontWeight: "500",
                                color: "#374151",
                                fontSize: "0.875rem",
                              }}
                            >
                              Homework
                            </label>
                            {!loadingHWDescription ? (
                              <>
                                <div
                                  style={{
                                    backgroundColor: "white",
                                    borderRadius: "6px",
                                    border: "1px solid #ced4da",
                                    overflow: "hidden",
                                  }}
                                >
                                  {!showAIGENERATED ? (
                                    <HTMLEditor
                                      onChange={handleHomeworkChange}
                                      initialContent={homework || "Type"}
                                    />
                                  ) : (
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: homework,
                                      }}
                                    />
                                  )}
                                </div>
                                <div style={{ margin: "1rem" }} />
                                {showAIGENERATED ? (
                                  <button
                                    style={{
                                      fontSize: "0.75rem",
                                      cursor: "pointer",
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setShowAIGENERATED(false);
                                    }}
                                  >
                                    Voltar ao editor (isto excluirá a descrição
                                    gerada)
                                  </button>
                                ) : (
                                  <button
                                    title="-15"
                                    style={{
                                      fontSize: "0.75rem",
                                      cursor: "pointer",
                                    }}
                                    onClick={handleHWDescription}
                                  >
                                    ✨Ajude-me com a descrição do homework (-15)
                                  </button>
                                )}
                              </>
                            ) : (
                              <CircularProgress
                                style={{
                                  color: partnerColor(),
                                }}
                              />
                            )}
                            {studentsInGroup.length > 1 && (
                              <div style={{ marginTop: "1rem" }}>
                                <label
                                  style={{
                                    display: "block",
                                    marginBottom: "0.5rem",
                                    fontWeight: "600",
                                    color: "#495057",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  📝 Descrição individual para cada aluno.
                                </label>
                                {studentsInGroup.map((student, index) => (
                                  <div key={student._id || index}>
                                    {student.name + " " + student.lastname}
                                    <input
                                      type="text"
                                      value={comments[index]?.description || ""}
                                      onChange={(e) =>
                                        handleStudentDescriptionChange(
                                          index,
                                          e.target.value
                                        )
                                      }
                                      placeholder="Comentário para o aluno"
                                      style={{
                                        width: "100%",
                                        padding: "0.75rem",
                                        borderRadius: "6px",
                                        border: "1px solid #ced4da",
                                        fontSize: "0.9rem",
                                        marginTop: "0.5rem",
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </span>
                  {/* Flashcards Section */}
                  <span>
                    <div style={{ marginBottom: "5px" }}>
                      {!flashcardsAdded && status == "realizada" && (
                        <button
                          type="button"
                          onClick={() => setShowFlashcards(!showFlashcards)}
                          style={{
                            padding: "6px 12px",
                            fontSize: "13px",
                            fontWeight: "500",
                            color: "#6c757d",
                            backgroundColor: "white",
                            border: "1px solid #e9ecef",
                            borderRadius: "6px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          {showFlashcards
                            ? "- Hide Flashcards"
                            : "+ Add Flashcards"}
                        </button>
                      )}

                      {showFlashcards && (
                        <div>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "0.5rem",
                              fontWeight: "500",
                              color: "#374151",
                              fontSize: "0.875rem",
                            }}
                          >
                            Flashcards
                          </label>
                          <textarea
                            value={flashcards}
                            onChange={(e) => setFlashcards(e.target.value)}
                            rows={4}
                            style={{
                              width: "100%",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              border: "1px solid #ced4da",
                              fontSize: "14px",
                            }}
                            placeholder="Digite os flashcards aqui..."
                          />
                        </div>
                      )}
                    </div>
                  </span>
                </div>

                {/* Save Button */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={() => setShowEditForm(false)}
                    style={{
                      backgroundColor: "#6c757d",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={editOneEvent}
                    disabled={loadingInfo}
                    style={{
                      backgroundColor: partnerColor(),
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: 4,
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    {loadingInfo ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label>Descrição (Motivo do cancelamento):</label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "1rem",
                  }}
                >
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "4px",
                      marginTop: "4px",
                    }}
                  />
                  <button
                    title="-5"
                    style={{
                      all: "unset",
                      fontSize: "1rem",
                      border: "null",
                      padding: "0",
                      backgroundColor: "transparent",
                      cursor:
                        loadingDescription || !description
                          ? "not-allowed"
                          : "pointer",
                      opacity: loadingDescription || !description ? 0.5 : 1,
                    }}
                    disabled={loadingDescription || !description}
                    onClick={handleClassSummary}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "2px",
                      }}
                    >
                      ✨{" "}
                      <span
                        style={{
                          fontSize: "0.75rem",
                          verticalAlign: "super",
                          marginLeft: "-2px",
                        }}
                      >
                        -5
                      </span>
                    </span>
                  </button>
                </div>
                {/* Save Button */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={() => setShowEditForm(false)}
                    style={{
                      backgroundColor: "#6c757d",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={editOneEvent}
                    disabled={loadingInfo}
                    style={{
                      backgroundColor: partnerColor(),
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: 4,
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    {loadingInfo ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
}

export default EditModal;
