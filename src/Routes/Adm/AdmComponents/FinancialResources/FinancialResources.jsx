import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DivModal,
  Xp,
  backDomain,
  formatDateBr,
  formatNumber,
  onLoggOut,
} from "../../../../Resources/UniversalComponents";
import { useUserContext } from "../../../../Application/SelectLanguage/SelectLanguage";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Switch,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Tab,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  alwaysWhite,
  partnerColor,
  textGeneralFont,
  textPrimaryColorContrast,
  textTitleFont,
} from "../../../../Styles/Styles";
import { HOne } from "../../../../Resources/Components/RouteBox";
import {
  ArvinButton,
  MyButton,
} from "../../../../Resources/Components/ItemsLibrary";
import { HThree } from "../../../MyClasses/MyClasses.Styled";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { listOfButtons } from "../../../Ranking/RankingComponents/ListOfCriteria";

export function FinancialResources({ headers, id }) {
  // ===== CONTEXT =====
  const { UniversalTexts } = useUserContext();

  // ===== USESTATE DECLARATIONS =====
  // Form fields
  const [newName, setNewName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [googleDriveLink, setGoogleDriveLink] = useState("");
  const [picture, setPicture] = useState("");
  const [fee, setFee] = useState("");
  const [permissions, setPermissions] = useState("");

  // UI States
  const [thereAreReports, setThereAreReports] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [seeConfirmDelete, setSeeConfirmDelete] = useState(false);
  const [value, setValue] = useState("1");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasReset, setHasReset] = useState(false);
  const [resetVisible, setResetVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [newCostModalOpen, setNewCostModalOpen] = useState(false);
  const [newCostAmount, setNewCostAmount] = useState("");
  const [newCostDescription, setNewCostDescription] = useState("");
  const [fixedCostsExpanded, setFixedCostsExpanded] = useState(false);
  const [revenueExpanded, setRevenueExpanded] = useState(false);
  const [costDetailModalOpen, setCostDetailModalOpen] = useState(false);
  const [selectedCost, setSelectedCost] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isEditingCost, setIsEditingCost] = useState(false);
  const [editCostDescription, setEditCostDescription] = useState("");
  const [editCostAmount, setEditCostAmount] = useState("");

  // Financial Report Edit Modal States
  const [financialReportModalOpen, setFinancialReportModalOpen] =
    useState(false);
  const [selectedFinancialReport, setSelectedFinancialReport] = useState(null);
  const [editReportDescription, setEditReportDescription] = useState("");
  const [editReportAmount, setEditReportAmount] = useState("");
  const [editReportDiscount, setEditReportDiscount] = useState("");
  const [editReportAccountFor, setEditReportAccountFor] = useState(true);
  const [editReportPaidFor, setEditReportPaidFor] = useState(false);
  const [editReportTypeOfItem, setEditReportTypeOfItem] = useState("");
  const [editReportMonth, setEditReportMonth] = useState("");

  // New Standalone Item Modal States
  const [newItemModalOpen, setNewItemModalOpen] = useState(false);
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");
  const [newItemDiscount, setNewItemDiscount] = useState("");
  const [newItemTypeOfItem, setNewItemTypeOfItem] = useState("others");
  const [newItemAccountFor, setNewItemAccountFor] = useState(true);
  const [newItemPaidFor, setNewItemPaidFor] = useState(false);

  // Student data
  const [students, setStudents] = useState([]);
  const [ID, setID] = useState("");
  const [weeklyClasses, setWeeklyClasses] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [monthlyScore, setMonthlyScore] = useState(0);
  const [homeworkAssignmentsDone, setHomeworkAssignmentsDone] = useState("1");
  const [flashcards25Reviews, setFlashcards25Reviews] = useState("1");
  const [descSpecial, setDescSpecial] = useState("");
  const [plusScore, setPlusScore] = useState(0);

  // Boolean flags
  const [feeUpToDate, setFeeUpToDate] = useState(false);
  const [replenishTarget, setReplenishTarget] = useState(false);
  const [tutoree, setTutoree] = useState(false);
  const [isAdm, setIsAdm] = useState(false);
  const [onHold, setOnHold] = useState(false);
  const [myFirstMonth, setMyFirstMonth] = useState("");
  const [loadingFM, setLoadingFM] = useState(false);

  //fórmula que pega a data atual e coloca no formato mm-yyyy
  const currentDate = new Date();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0"); // Meses são baseados em zero
  const currentYear = currentDate.getFullYear();
  const currentMonthYear = `${currentMonth}-${currentYear}`;

  const [selectedMonth, setSelectedMonth] = useState(currentMonthYear);
  const [financialReports, setFinancialReports] = useState([]);

  // ===== CONSTANTS =====
  const isMobile = window.innerWidth <= 700;
  const cellTable = {
    whiteSpace: "nowrap",
  };
  const stickyHeaderStyle = {
    position: "sticky",
    top: 0,
    backgroundColor: "#f6f6f6",
    zIndex: 1,
    whiteSpace: "nowrap",
  };

  // ===== HANDLER FUNCTIONS =====
  const handleChangeEdit = (event, newValue) => {
    setValue(newValue);
  };

  const handleChange = (event) => {
    setPermissions(event.target.value);
  };

  const handleSeeModal = () => {
    setIsVisible(!isVisible);
    setValue("1");
    setSeeConfirmDelete(false);
  };

  const handleConfirmDelete = () => {
    setSeeConfirmDelete(!seeConfirmDelete);
  };

  const handleDelete = () => {
    deleteStudent(ID);
  };

  const handleNewCostModal = () => {
    setNewCostModalOpen(!newCostModalOpen);
    if (!newCostModalOpen) {
      // Reset form when opening
      setNewCostAmount("");
      setNewCostDescription("");
    }
  };

  const handleCostDetailModal = (cost = null) => {
    setCostDetailModalOpen(!costDetailModalOpen);
    setSelectedCost(cost);
    if (!costDetailModalOpen) {
      // Reset states when opening
      setShowDeleteConfirmation(false);
      setIsEditingCost(false);
      if (cost) {
        setEditCostDescription(cost.description);
        setEditCostAmount(cost.amount.toString());
      }
    }
  };

  const toggleFixedCosts = () => {
    setFixedCostsExpanded(!fixedCostsExpanded);
  };

  const toggleRevenue = () => {
    setRevenueExpanded(!revenueExpanded);
  };

  // Financial Report Modal Handlers
  const handleFinancialReportModal = (report = null) => {
    setFinancialReportModalOpen(!financialReportModalOpen);
    if (report) {
      setSelectedFinancialReport(report);
      setEditReportDescription(report.description);
      setEditReportAmount(report.amount.toString());
      setEditReportDiscount(report.discount.toString());
      setEditReportAccountFor(report.accountFor);
      setEditReportPaidFor(report.paidFor);
      setEditReportTypeOfItem(report.typeOfItem);
      setEditReportMonth(report.month);
    } else {
      setSelectedFinancialReport(null);
      setEditReportDescription("");
      setEditReportAmount("");
      setEditReportDiscount("");
      setEditReportAccountFor(true);
      setEditReportPaidFor(false);
      setEditReportTypeOfItem("");
      setEditReportMonth("");
    }
  };

  // New Item Modal Handler
  const handleNewItemModal = () => {
    setNewItemModalOpen(!newItemModalOpen);
    if (!newItemModalOpen) {
      // Reset form when opening
      setNewItemDescription("");
      setNewItemAmount("");
      setNewItemDiscount("");
      setNewItemTypeOfItem("others");
      setNewItemAccountFor(true);
      setNewItemPaidFor(false);
    }
  };

  const handleSaveCost = async () => {
    if (!newCostAmount || !newCostDescription) {
      notifyAlert("Preencha todos os campos");
      return;
    }

    // Verificar se já existe um custo com a mesma descrição
    const duplicateCost = fixedCosts.find(
      (cost) =>
        cost.description.toLowerCase().trim() ===
        newCostDescription.toLowerCase().trim()
    );

    if (duplicateCost) {
      notifyAlert(
        "Já existe um custo com esta descrição. Escolha outro nome.",
        "red"
      );
      return;
    }

    try {
      await newFixedCost(
        parseFloat(newCostAmount),
        currentMonthYear,
        newCostDescription
      );
      notifyAlert("Custo fixo adicionado com sucesso!", "green");
      handleNewCostModal();

      // Refresh the fixed costs
      generateReports(selectedMonth);
    } catch (error) {
      notifyAlert("Erro ao adicionar custo fixo");
    }
  };

  // ===== API FUNCTIONS =====

  const seeEdition = async (id) => {
    handleSeeModal();
    try {
      const response = await axios.get(`${backDomain}/api/v1/student/${id}`, {
        headers,
      });
      console.log(response.data.formattedStudentData);
      setNewName(response.data.formattedStudentData.name);
      setNewLastName(response.data.formattedStudentData.lastname);
      setOnHold(response.data.formattedStudentData.onHold);
      setNewUsername(response.data.formattedStudentData.username);
      setNewPhone(response.data.formattedStudentData.phoneNumber);
      setNewEmail(response.data.formattedStudentData.email);
      setFeeUpToDate(response.data.formattedStudentData.feeUpToDate);
      setReplenishTarget(response.data.formattedStudentData.replenishTarget);
      setTutoree(response.data.formattedStudentData.tutoree);
      setPermissions(response.data.formattedStudentData.permissions);
      setWeeklyClasses(response.data.formattedStudentData.weeklyClasses);
      setID(response.data.formattedStudentData.id);
      setGoogleDriveLink(response.data.formattedStudentData.googleDriveLink);
      setTotalScore(response.data.formattedStudentData.totalScore);
      setMonthlyScore(response.data.formattedStudentData.monthlyScore);
      setPicture(response.data.formattedStudentData.picture);
      setFee(response.data.formattedStudentData.fee);
      setNewAddress(response.data.formattedStudentData.address);
      setHomeworkAssignmentsDone(
        response.data.formattedStudentData.homeworkAssignmentsDone
      );
      setFlashcards25Reviews(
        response.data.formattedStudentData.flashcards25Reviews
      );
    } catch (error) {
      notifyAlert(error);
      console.error(error);
    }
  };

  const seeReports = async (month) => {
    try {
      const response = await axios.get(`${backDomain}/api/v1/finance/${id}`, {
        headers,
        params: { month },
      });
      console.log("response", response.data.financialReportsOfTheMonth);
      console.log("month", month);
      if (response.data.financialReportsOfTheMonth?.length === 0) {
        setFinancialReports(
          response.data.financialReportsOfTheMonth?.length > 0
            ? response.data.financialReportsOfTheMonth
            : []
        );
        setThereAreReports(false);
      } else {
        setFinancialReports(response.data.financialReportsOfTheMonth || []);
        setTimeout(() => {
          setThereAreReports(true);
        }, 500);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const [fixedCosts, setFixedCosts] = useState([]);
  // Fetch all fixed costs for the current month
  const getAllCosts = async () => {
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/fixed-costs/${id}`,
        {
          headers,
        }
      );
      setFixedCosts(response.data.fixedCosts);
      console.log("response", response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDeleteCost = async (description, amount) => {
    try {
      const response = await axios.delete(
        `${backDomain}/api/v1/fixed-cost/${id}`,
        {
          headers,
          data: {
            description,
            amount,
          },
        }
      );
      setFixedCosts(response.data.remainingCosts);
      notifyAlert("Custo excluído com sucesso!", "green");
      handleCostDetailModal(); // Fechar o modal
      setShowDeleteConfirmation(false); // Reset confirmation
      console.log("response", response.data);
    } catch (error) {
      notifyAlert("Erro ao excluir custo");
      console.log("error", error);
    }
  };

  const handleEditCost = async (
    oldDescription,
    oldAmount,
    newDescription,
    newAmount
  ) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/fixed-cost/${id}`,
        {
          oldDescription,
          oldAmount,
          newDescription,
          newAmount: parseFloat(newAmount),
          month: currentMonthYear,
        },
        {
          headers,
        }
      );
      setFixedCosts(response.data.remainingCosts);
      notifyAlert("Custo editado com sucesso!", "green");
      handleCostDetailModal(); // Fechar o modal
      setIsEditingCost(false);
      console.log("response", response.data);
    } catch (error) {
      notifyAlert("Erro ao editar custo");
      console.log("error", error);
    }
  };

  const generateReports = async (month) => {
    try {
      const response = await axios.post(
        `${backDomain}/api/v1/finance-month/${id}`,
        {
          month,
        },
        {
          headers,
        }
      );
      setFinancialReports(
        response.data.financialReportsOfTheMonth?.length > 0
          ? response.data.financialReportsOfTheMonth
          : []
      );
      console.log("response", response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const updateReports = async (report) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/finance-item/${id}`,
        {
          report,
        },
        {
          headers,
        }
      );
      setFinancialReports(
        response.data.financialReportsOfTheMonth?.length > 0
          ? response.data.financialReportsOfTheMonth
          : []
      );
      console.log("response", response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const newStandaloneItem = async () => {
    if (!newItemDescription || !newItemAmount) {
      notifyAlert("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const newItem = {
        description: newItemDescription,
        month: selectedMonth,
        typeOfItem: newItemTypeOfItem,
        amount:
          newItemTypeOfItem === "debt"
            ? -Math.abs(parseFloat(newItemAmount))
            : Math.abs(parseFloat(newItemAmount)),
        discount: parseFloat(newItemDiscount) || 0,
        accountFor: newItemAccountFor,
        paidFor: newItemPaidFor,
        studentId: null, // Item standalone não tem aluno específico
      };

      const response = await axios.post(
        `${backDomain}/api/v1/finance-item/${id}`,
        newItem,
        {
          headers,
        }
      );

      notifyAlert("Item financeiro criado com sucesso!", "green");
      handleNewItemModal(); // Fechar o modal
      seeReports(currentMonthYear);

      console.log("response", response.data);
    } catch (error) {
      notifyAlert("Erro ao criar item financeiro");
      console.log("error", error);
    }
  };

  const handleSaveFinancialReport = async () => {
    if (!selectedFinancialReport) return;

    try {
      const updatedReport = {
        ...selectedFinancialReport,
        description: editReportDescription,
        amount: parseFloat(editReportAmount),
        discount: parseFloat(editReportDiscount) || 0,
        accountFor: editReportAccountFor,
        paidFor: editReportPaidFor,
        typeOfItem: editReportTypeOfItem,
        month: editReportMonth,
      };

      const response = await axios.put(
        `${backDomain}/api/v1/finance-item/${id}`,
        {
          report: updatedReport,
        },
        {
          headers,
        }
      );

      seeReports(currentMonthYear);
      handleFinancialReportModal(); // Close modal
      notifyAlert("Relatório financeiro atualizado com sucesso!", "green");
      console.log("response", response.data);
    } catch (error) {
      console.log("error", error);
      notifyAlert("Erro ao atualizar relatório financeiro");
    }
  };

  const newFixedCost = async (amount, month, description) => {
    try {
      const response = await axios.post(
        `${backDomain}/api/v1/fixed-cost/${id}`,
        {
          amount,
          month,
          description,
        },
        {
          headers,
        }
      );
      setFixedCosts(response.data.fixedCosts);
    } catch (error) {
      console.log("error", error);
    }
  };

  const editStudent = async (id) => {
    let editedStudent = {
      username: newUsername,
      password: newPassword,
      email: newEmail,
      name: newName,
      lastname: newLastName,
      phoneNumber: newPhone,
      weeklyClasses,
      permissions: permissions,
      googleDriveLink: googleDriveLink,
      address: newAddress,
      fee,
      picture: picture,
    };

    try {
      const response = await axios.put(
        `${backDomain}/api/v1/students/${id}`,
        editedStudent,
        { headers }
      );
      notifyAlert("Usuário editado com sucesso!", "green");
      handleSeeModal();
      fetchStudents();
    } catch (error) {
      notifyAlert("Erro ao editar usuário");
      handleSeeModal();
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/studentsfinancialreports/${id}`,
        {
          headers,
        }
      );
      setStudents(response.data.listOfStudentsFees);
      setLoading(false);
    } catch (error) {
      notifyAlert("Erro ao encontrar alunos");
    }
  };

  const seeMyFirstMonth = async () => {
    setLoadingFM(true);
    try {
      const response = await axios.get(
        `${backDomain}/api/v1/my-first-month/${id}`,
        { headers }
      );
      setMyFirstMonth(response.data.myFirstMonth);
      console.log("response", response.data.myFirstMonth);
      setLoadingFM(false);
    } catch (error) {
      console.log("error", error);
      setLoadingFM(false);
    }
  };

  const deleteStudent = async (id) => {
    try {
      const response = await axios.delete(
        `${backDomain}/api/v1/students/${id}`,
        { headers }
      );
      notifyAlert("Aluno excluído");
      fetchStudents();
      handleSeeModal();
    } catch (error) {
      notifyAlert(error);
      handleSeeModal();
      console.error(error);
    }
  };
  const updateOnHold = async (id) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/onhold/${id}`,
        {},
        {
          headers,
        }
      );
      console.log("response", response);
      setOnHold(response.data.newValue);

      fetchStudents();
    } catch (error) {
      console.log("error", error);
    }
  };
  const updateFeeStatus = async (id) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/feeuptodate/${id}`,
        {},
        {
          headers,
        }
      );
      fetchStudents();
    } catch (error) {
      console.log("error", error);
    }
  };

  const updateTutoree = async (id) => {
    try {
      const response = await axios.put(
        `${backDomain}/api/v1/tutoree/${id}`,
        {},
        { headers }
      );
      fetchStudents();
    } catch (error) {
      console.log("error", error);
    }
  };

  // ===== CALCULATION FUNCTIONS =====

  // Verificar se já existe um custo com a mesma descrição
  const checkDuplicateCost = () => {
    if (!newCostDescription.trim()) return false;
    return fixedCosts.some(
      (cost) =>
        cost.description.toLowerCase().trim() ===
        newCostDescription.toLowerCase().trim()
    );
  };

  // Verificar se o botão de salvar deve estar habilitado
  const isSaveButtonDisabled = () => {
    return !newCostAmount || !newCostDescription || checkDuplicateCost();
  };

  const calculateMonthlyRevenue = () => {
    return students.reduce((total, student) => {
      const fee = parseFloat(student.fee) || 0;
      if (!student.onHold && fee > 0) {
        return total + fee;
      }
      return total;
    }, 0);
  };

  // Get students with fees for the financial table
  const getStudentsWithFees = () => {
    return students;
  };

  // Get only active students (not on hold) with fees
  const getActiveStudentsWithFees = () => {
    return students.filter(
      (student) => student.fee && parseFloat(student.fee) > 0 && !student.onHold
    );
  };

  // Generate dynamic month options (from first month to next month)
  const generateMonthOptions = () => {
    const options = [];
    const monthNames = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];

    // Se não tiver myFirstMonth ainda, retorna só o mês atual
    if (!myFirstMonth) {
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();
      const value = `${month}-${year}`;
      const label = `${monthNames[today.getMonth()]} ${year}`;
      return [{ value, label }];
    }

    // Parse do primeiro mês (formato: "MM-YYYY")
    const [firstMonth, firstYear] = myFirstMonth.split("-");
    const startDate = new Date(
      parseInt(firstYear),
      parseInt(firstMonth) - 1,
      1
    );

    // Data atual + 1 mês
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    // Gerar todos os meses desde o primeiro até o próximo mês
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const year = currentDate.getFullYear();
      const value = `${month}-${year}`;
      const label = `${monthNames[currentDate.getMonth()]} ${year}`;

      options.push({ value, label });

      // Avançar para o próximo mês
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return options;
  };

  // Verificar se o mês selecionado é atual ou futuro
  const isCurrentOrFutureMonth = (selectedMonth) => {
    const [selectedMonthNum, selectedYear] = selectedMonth.split("-");
    const selectedDate = new Date(
      parseInt(selectedYear),
      parseInt(selectedMonthNum) - 1,
      1
    );

    const today = new Date();
    const currentDate = new Date(today.getFullYear(), today.getMonth(), 1);

    return selectedDate >= currentDate;
  };

  // ===== USEEFFECTS =====
  useEffect(() => {
    seeReports(currentMonthYear);
    fetchStudents();
    getAllCosts();
    seeMyFirstMonth();
  }, []);

  // Atualizar selectedMonth quando myFirstMonth for carregado (para garantir que seja o mês atual como padrão)
  useEffect(() => {
    if (myFirstMonth) {
      // Manter o mês atual como padrão, mas permitir que o select tenha todas as opções disponíveis
      setSelectedMonth(currentMonthYear);
    }
  }, [myFirstMonth]);

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <HOne
        style={{
          fontFamily: textTitleFont(),
          color: partnerColor(),
          textAlign: "center",
          margin: "0.5rem",
        }}
      >
        Gestão Financeira
      </HOne>
      <select
        value={selectedMonth}
        onChange={(e) => {
          setSelectedMonth(e.target.value);
          seeReports(e.target.value);
        }}
      >
        {generateMonthOptions().map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: window.innerWidth <= 768 ? "1fr" : "1fr 0.3fr",
          justifyContent: "top",
          gap: "1rem",
          margin: "16px auto",
          marginBottom: "16px",
        }}
      >
        <section>
          {financialReports.length > 0 ? (
            <div
              style={{
                maxWidth: "800px",
                margin: "16px auto",
              }}
            >
              {/* <button onClick={() => updateReports(selectedMonth)}>
                Atualizar mês
              </button> */}
              {/* RESUMO FINANCEIRO */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                {/* Entradas */}

                <div
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    padding: "20px",
                    textAlign: "center",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#6b7280",
                      marginBottom: "8px",
                      fontFamily: textGeneralFont(),
                      fontWeight: "400",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Entradas Esperadas
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "600",
                      color: "#059669",
                      marginBottom: "4px",
                      fontFamily: textTitleFont(),
                    }}
                  >
                    R${" "}
                    {formatNumber(
                      financialReports
                        .filter(
                          (report) =>
                            report.accountFor && report.typeOfItem !== "debt"
                        )
                        .reduce(
                          (total, report) =>
                            total +
                            (Math.abs(report.amount || 0) -
                              (report.discount || 0)),
                          0
                        )
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      fontFamily: textGeneralFont(),
                      fontWeight: "400",
                    }}
                  >
                    Já recebido: R${" "}
                    {formatNumber(
                      financialReports
                        .filter(
                          (report) =>
                            report.accountFor &&
                            report.typeOfItem !== "debt" &&
                            report.paidFor
                        )
                        .reduce(
                          (total, report) =>
                            total +
                            (Math.abs(report.amount || 0) -
                              (report.discount || 0)),
                          0
                        )
                    )}
                  </div>
                </div>

                {/* Saídas */}
                <div
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    padding: "20px",
                    textAlign: "center",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#6b7280",
                      marginBottom: "8px",
                      fontFamily: textGeneralFont(),
                      fontWeight: "400",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Saídas Esperadas
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "600",
                      color: "#dc2626",
                      marginBottom: "4px",
                      fontFamily: textTitleFont(),
                    }}
                  >
                    R${" "}
                    {formatNumber(
                      financialReports
                        .filter(
                          (report) =>
                            report.accountFor && report.typeOfItem === "debt"
                        )
                        .reduce(
                          (total, report) =>
                            total + Math.abs(report.amount || 0),
                          0
                        )
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      fontFamily: textGeneralFont(),
                      fontWeight: "400",
                    }}
                  >
                    Já pago: R${" "}
                    {formatNumber(
                      financialReports
                        .filter(
                          (report) =>
                            report.accountFor &&
                            report.typeOfItem === "debt" &&
                            report.paidFor
                        )
                        .reduce(
                          (total, report) =>
                            total + Math.abs(report.amount || 0),
                          0
                        )
                    )}
                  </div>
                </div>

                {/* Saldo */}
                <div
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    padding: "20px",
                    textAlign: "center",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#6b7280",
                      marginBottom: "8px",
                      fontFamily: textGeneralFont(),
                      fontWeight: "400",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Saldo Previsto
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "600",
                      color: (() => {
                        const entradas = financialReports
                          .filter(
                            (report) =>
                              report.accountFor && report.typeOfItem !== "debt"
                          )
                          .reduce(
                            (total, report) =>
                              total +
                              (Math.abs(report.amount || 0) -
                                (report.discount || 0)),
                            0
                          );
                        const saidas = financialReports
                          .filter(
                            (report) =>
                              report.accountFor && report.typeOfItem === "debt"
                          )
                          .reduce(
                            (total, report) =>
                              total + Math.abs(report.amount || 0),
                            0
                          );
                        const saldo = entradas - saidas;
                        return saldo < 0 ? "#dc2626" : "#16a34a";
                      })(),
                      fontFamily: textTitleFont(),
                    }}
                  >
                    R${" "}
                    {formatNumber(
                      financialReports
                        .filter(
                          (report) =>
                            report.accountFor && report.typeOfItem !== "debt"
                        )
                        .reduce(
                          (total, report) =>
                            total +
                            (Math.abs(report.amount || 0) -
                              (report.discount || 0)),
                          0
                        ) -
                        financialReports
                          .filter(
                            (report) =>
                              report.accountFor && report.typeOfItem === "debt"
                          )
                          .reduce(
                            (total, report) =>
                              total + Math.abs(report.amount || 0),
                            0
                          )
                    )}
                  </div>
                </div>
              </div>

              {/* TÍTULO DO RELATÓRIO */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px",
                  marginTop: "32px",
                }}
              >
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#374151",
                    fontFamily: textGeneralFont(),
                    textAlign: "left",
                  }}
                >
                  Relatórios Financeiros • {selectedMonth}
                </div>
                <button
                  onClick={handleNewItemModal}
                  style={{
                    border: "1px solid #3b82f6",
                    backgroundColor: "#3b82f6",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "500",
                    fontFamily: textGeneralFont(),
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#2563eb";
                    e.target.style.borderColor = "#2563eb";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#3b82f6";
                    e.target.style.borderColor = "#3b82f6";
                  }}
                >
                  + Novo Item
                </button>
              </div>

              {/* ENTRADAS */}
              {financialReports.filter(
                (report) => report.accountFor && report.typeOfItem !== "debt"
              ).length > 0 && (
                <div
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    padding: "20px",
                    marginBottom: "20px",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "16px",
                      fontFamily: textGeneralFont(),
                    }}
                  >
                    Entradas
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {financialReports
                      .filter(
                        (report) =>
                          report.accountFor && report.typeOfItem !== "debt"
                      )
                      .map((report, index) => (
                        <div
                          key={report.studentId || index}
                          onClick={() => handleFinancialReportModal(report)}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "16px",
                            backgroundColor: "#f9fafb",
                            border: "1px solid #f3f4f6",
                            borderRadius: "4px",
                            transition: "all 0.2s ease",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f0f9ff";
                            e.currentTarget.style.borderColor = "#0ea5e9";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#fff";
                            e.currentTarget.style.borderColor = "#bae6fd";
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151",
                                marginBottom: "2px",
                                fontFamily: textGeneralFont(),
                              }}
                            >
                              {report.description}
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                color: "#6b7280",
                                fontFamily: textGeneralFont(),
                              }}
                            >
                              Tipo: {report.typeOfItem}
                              {report.discount > 0 &&
                                ` • Desconto: R$ ${formatNumber(
                                  report.discount
                                )}`}
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#0369a1",
                                fontFamily: textGeneralFont(),
                              }}
                            >
                              R${" "}
                              {formatNumber(
                                Math.abs(report.amount) - (report.discount || 0)
                              )}
                            </div>

                            <div
                              style={{
                                fontSize: "10px",
                                fontWeight: "500",
                                textAlign: "center",
                                padding: "3px 8px",
                                borderRadius: "12px",
                                backgroundColor: report.paidFor
                                  ? "#e8f5e8"
                                  : "#ffebee",
                                color: report.paidFor ? "#2e7d32" : "#c62828",
                                fontFamily: textGeneralFont(),
                                minWidth: "60px",
                              }}
                            >
                              {report.paidFor ? "Recebido" : "Pendente"}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* SAÍDAS */}
              {financialReports.filter(
                (report) => report.accountFor && report.typeOfItem === "debt"
              ).length > 0 && (
                <div
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    padding: "20px",
                    marginBottom: "20px",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "16px",
                      fontFamily: textGeneralFont(),
                    }}
                  >
                    Saídas
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {financialReports
                      .filter(
                        (report) =>
                          report.accountFor && report.typeOfItem === "debt"
                      )
                      .map((report, index) => (
                        <div
                          key={report.studentId || index}
                          onClick={() => handleFinancialReportModal(report)}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "16px",
                            backgroundColor: "#f9fafb",
                            border: "1px solid #f3f4f6",
                            borderRadius: "4px",
                            transition: "all 0.2s ease",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f3f4f6";
                            e.currentTarget.style.borderColor = "#d1d5db";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#f9fafb";
                            e.currentTarget.style.borderColor = "#f3f4f6";
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151",
                                marginBottom: "2px",
                                fontFamily: textGeneralFont(),
                              }}
                            >
                              {report.description}
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                color: "#6b7280",
                                fontFamily: textGeneralFont(),
                              }}
                            >
                              Tipo: {report.typeOfItem}
                              {report.discount > 0 &&
                                ` • Desconto: R$ ${formatNumber(
                                  report.discount
                                )}`}
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#dc2626",
                                fontFamily: textGeneralFont(),
                              }}
                            >
                              R${" "}
                              {formatNumber(
                                Math.abs(report.amount) - (report.discount || 0)
                              )}
                            </div>

                            <div
                              style={{
                                fontSize: "10px",
                                fontWeight: "500",
                                textAlign: "center",
                                padding: "3px 8px",
                                borderRadius: "12px",
                                backgroundColor: report.paidFor
                                  ? "#e8f5e8"
                                  : "#ffebee",
                                color: report.paidFor ? "#2e7d32" : "#c62828",
                                fontFamily: textGeneralFont(),
                                minWidth: "60px",
                              }}
                            >
                              {report.paidFor ? "Pago" : "Pendente"}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* ITENS NÃO CONTABILIZADOS */}
              {financialReports.filter((report) => !report.accountFor).length >
                0 && (
                <div
                  style={{
                    backgroundColor: "#f9fafb",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#6b7280",
                      marginBottom: "12px",
                      fontFamily: textGeneralFont(),
                    }}
                  >
                    📋 Itens não contabilizados
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {financialReports
                      .filter((report) => !report.accountFor)
                      .map((report, index) => (
                        <div
                          key={report.studentId || index}
                          onClick={() => handleFinancialReportModal(report)}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px",
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            opacity: 0.7,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "1";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "0.7";
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: "400",
                                color: "#6b7280",
                                marginBottom: "2px",
                                fontFamily: textGeneralFont(),
                              }}
                            >
                              {report.description}
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                color: "#9ca3af",
                                fontFamily: textGeneralFont(),
                              }}
                            >
                              Tipo:{" "}
                              {report.typeOfItem === "fee"
                                ? "Mensalidade"
                                : report.typeOfItem}
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "16px",
                                fontWeight: "500",
                                color: "#9ca3af",
                                fontFamily: textGeneralFont(),
                              }}
                            >
                              R${" "}
                              {formatNumber(
                                Math.abs(report.amount) - (report.discount || 0)
                              )}
                            </div>

                            <div
                              style={{
                                fontSize: "10px",
                                fontWeight: "500",
                                textAlign: "center",
                                padding: "3px 8px",
                                borderRadius: "12px",
                                backgroundColor: "#f3f4f6",
                                color: "#6b7280",
                                fontFamily: textGeneralFont(),
                                minWidth: "60px",
                              }}
                            >
                              Ignorado
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <p>Nenhum relatório disponível para este mês.</p>
              {isCurrentOrFutureMonth(selectedMonth) && (
                <button onClick={() => generateReports(selectedMonth)}>
                  Gerar relatório para {selectedMonth}
                </button>
              )}
            </div>
          )}
        </section>

        <section
          style={{
            maxWidth: "400px",
            margin: "16px auto",
          }}
        >
          {!loading && (
            <section
              style={{
                maxWidth: "400px",
                margin: "16px auto",
              }}
            >
              <div
                onClick={toggleRevenue}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid #f3f4f6",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  padding: "8px 0",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                  e.currentTarget.style.marginLeft = "1px";
                  e.currentTarget.style.marginRight = "1px";
                  e.currentTarget.style.paddingLeft = "1px";
                  e.currentTarget.style.paddingRight = "1px";
                  e.currentTarget.style.paddingTop = "1px";
                  e.currentTarget.style.borderRadius = "1px";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.marginLeft = "0";
                  e.currentTarget.style.marginRight = "0";
                  e.currentTarget.style.paddingLeft = "0";
                  e.currentTarget.style.paddingRight = "0";
                  e.currentTarget.style.paddingTop = "0";
                  e.currentTarget.style.borderRadius = "0";
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      fontFamily: textGeneralFont(),
                      color: "#374151",
                      fontSize: "14px",
                      fontWeight: "600",
                      margin: "0",
                    }}
                  >
                    Entradas Fixas
                  </div>
                  {getActiveStudentsWithFees().length > 0 && (
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#9ca3af",
                        backgroundColor: "#f9fafb",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontWeight: "500",
                        fontFamily: textGeneralFont(),
                      }}
                    >
                      {getActiveStudentsWithFees().length}
                    </div>
                  )}
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {getActiveStudentsWithFees().length > 0 && (
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#6b7280",
                        fontFamily: textGeneralFont(),
                      }}
                    >
                      R$ {formatNumber(calculateMonthlyRevenue())}
                    </div>
                  )}

                  <div
                    style={{
                      fontSize: "14px",
                      color: "#9ca3af",
                      transform: revenueExpanded
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    ▼
                  </div>
                </div>
              </div>

              {revenueExpanded && (
                <div
                  style={{
                    animation: "fadeIn 0.2s ease-in-out",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      padding: "12px 16px",
                      margin: "auto",
                      backgroundColor: "#f9f9f9",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(120px, 1fr))",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          padding: "8px",
                          backgroundColor: "#fff",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "500",
                            color: partnerColor(),
                            fontFamily: textGeneralFont(),
                          }}
                        >
                          R$ {formatNumber(calculateMonthlyRevenue())}
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#666",
                            fontFamily: textGeneralFont(),
                          }}
                        >
                          Receita Total
                        </div>
                      </div>

                      <div
                        style={{
                          padding: "8px",
                          backgroundColor: "#fff",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "500",
                            color: "#333",
                            fontFamily: textGeneralFont(),
                          }}
                        >
                          {getActiveStudentsWithFees().length}
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#666",
                            fontFamily: textGeneralFont(),
                          }}
                        >
                          Alunos Ativos
                        </div>
                      </div>
                    </div>

                    {/* Lista técnica de estudantes */}
                    <div style={{ marginTop: "12px" }}>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "500",
                          color: "#4b5563",
                          marginBottom: "6px",
                          padding: "6px 0",
                          borderBottom: "1px solid #ddd",
                          fontFamily: textGeneralFont(),
                        }}
                      >
                        Mensalidades ({getStudentsWithFees().length} total •{" "}
                        {getActiveStudentsWithFees().length} ativos)
                      </div>

                      <div
                        style={{
                          maxHeight: "300px",
                          overflowY: "auto",
                          border: "1px solid #ccc",
                          backgroundColor: "#fff",
                        }}
                      >
                        {getStudentsWithFees().map((student, index) => (
                          <div
                            key={student.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              seeEdition(student.id);
                            }}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "0.6fr 5fr 2fr 1fr",
                              gap: "8px",
                              padding: "8px",
                              borderBottom: "1px solid #eee",
                              alignItems: "center",
                              cursor: "pointer",
                              backgroundColor: student.onHold
                                ? "#f8f8f8"
                                : "#fff",
                              transition: "background-color 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              if (!student.onHold) {
                                e.currentTarget.style.backgroundColor =
                                  "#f5f5f5";
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                student.onHold ? "#f8f8f8" : "#fff";
                            }}
                          >
                            <img
                              style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                opacity: student.onHold ? 0.5 : 1,
                              }}
                              src={
                                student.picture ||
                                "https://ik.imagekit.io/vjz75qw96/logos/myp?updatedAt=1752031657485"
                              }
                              alt=""
                            />
                            <div>
                              <div
                                style={{
                                  fontWeight: "500",
                                  fontSize: "12px",
                                  opacity: student.onHold ? 0.6 : 1,
                                  fontFamily: textGeneralFont(),
                                }}
                              >
                                {student.name} {student.lastname}
                              </div>
                              <div
                                style={{
                                  fontSize: "10px",
                                  color: "#666",
                                  opacity: student.onHold ? 0.6 : 1,
                                  fontFamily: textGeneralFont(),
                                }}
                              >
                                {student.email}
                              </div>
                            </div>

                            <Tooltip
                              title={student.onHold ? "Matrícula trancada" : ""}
                              arrow
                            >
                              <div
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  color: student.onHold
                                    ? "#999"
                                    : partnerColor(),
                                  textDecoration: student.onHold
                                    ? "line-through"
                                    : "none",
                                  fontFamily: textGeneralFont(),
                                }}
                              >
                                R$ {formatNumber(student.fee)}
                              </div>
                            </Tooltip>
                            <div
                              style={{
                                fontSize: "9px",
                                fontWeight: "500",
                                textAlign: "center",
                                padding: "2px 4px",
                                borderRadius: "3px",
                                backgroundColor: student.onHold
                                  ? "#ffebee"
                                  : "#e8f5e8",
                                color: student.onHold ? "#c62828" : "#2e7d32",
                                fontFamily: textGeneralFont(),
                              }}
                            >
                              {student.onHold ? "Trancado" : "Ativo"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!revenueExpanded && getActiveStudentsWithFees().length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "16px",
                    color: "#9ca3af",
                    fontSize: "11px",
                    fontFamily: textGeneralFont(),
                  }}
                >
                  Clique para ver
                </div>
              )}
            </section>
          )}

          <div
            onClick={toggleFixedCosts}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "1px solid #f3f4f6",
              cursor: "pointer",
              transition: "all 0.2s ease",
              padding: "8px 0",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f9fafb";
              e.currentTarget.style.marginLeft = "1px";
              e.currentTarget.style.marginRight = "1px";
              e.currentTarget.style.paddingLeft = "1px";
              e.currentTarget.style.paddingRight = "1px";
              e.currentTarget.style.paddingTop = "1px";
              e.currentTarget.style.borderRadius = "1px";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.marginLeft = "0";
              e.currentTarget.style.marginRight = "0";
              e.currentTarget.style.paddingLeft = "0";
              e.currentTarget.style.paddingRight = "0";
              e.currentTarget.style.paddingTop = "0";
              e.currentTarget.style.borderRadius = "0";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  fontFamily: textGeneralFont(),
                  color: "#374151",
                  fontSize: "14px",
                  fontWeight: "600",
                  margin: "0",
                }}
              >
                Custos Fixos
              </div>

              {fixedCosts.length > 0 && (
                <div
                  style={{
                    fontSize: "10px",
                    color: "#9ca3af",
                    backgroundColor: "#f9fafb",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontWeight: "500",
                    fontFamily: textGeneralFont(),
                  }}
                >
                  {fixedCosts.length}
                </div>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {fixedCosts.length > 0 && (
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#6b7280",
                    fontFamily: textGeneralFont(),
                  }}
                >
                  R${" "}
                  {formatNumber(
                    fixedCosts.reduce(
                      (total, cost) => total + (parseFloat(cost.amount) || 0),
                      0
                    )
                  )}
                </div>
              )}

              <div
                style={{
                  fontSize: "14px",
                  color: "#9ca3af",
                  transform: fixedCostsExpanded
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              >
                ▼
              </div>
            </div>
          </div>

          {fixedCostsExpanded && (
            <div
              style={{
                animation: "fadeIn 0.2s ease-in-out",
              }}
            >
              <div
                style={{
                  marginBottom: "12px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNewCostModal();
                  }}
                  style={{
                    border: "1px solid #d1d5db",
                    backgroundColor: "transparent",
                    color: "#6b7280",
                    fontSize: "12px",
                    fontWeight: "400",
                    fontFamily: textGeneralFont(),
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#9ca3af";
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#d1d5db";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  + Novo
                </button>
              </div>

              {fixedCosts.length > 0 ? (
                <div>
                  {fixedCosts.map((cost, index) => (
                    <div
                      key={cost.id || index}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCostDetailModal(cost);
                      }}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom:
                          index < fixedCosts.length - 1
                            ? "1px solid #f3f4f6"
                            : "none",
                        transition: "all 0.15s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f9fafb";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: "400",
                          color: "#4b5563",
                          lineHeight: "1.4",
                          fontFamily: textGeneralFont(),
                        }}
                      >
                        {cost.description}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: "500",
                          color: "#ef4444",
                          fontFamily: textGeneralFont(),
                        }}
                      >
                        R$ {formatNumber(cost.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "24px 16px",
                    color: "#6b7280",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      lineHeight: "1.5",
                      fontFamily: textGeneralFont(),
                    }}
                  >
                    Nenhum custo fixo
                  </div>
                </div>
              )}
            </div>
          )}

          {!fixedCostsExpanded && fixedCosts.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "16px",
                color: "#9ca3af",
                fontSize: "11px",
                fontFamily: textGeneralFont(),
              }}
            >
              Clique para ver
            </div>
          )}

          {/* Modal para Novo Custo Fixo */}
          <Dialog
            open={newCostModalOpen}
            onClose={handleNewCostModal}
            fullWidth
            maxWidth="sm"
            PaperProps={{
              style: {
                borderRadius: "12px",
                padding: "8px",
              },
            }}
          >
            <DialogTitle>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "16px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <h2
                  style={{
                    fontFamily: textTitleFont(),
                    color: "#1f2937",
                    fontSize: "18px",
                    fontWeight: "500",
                    margin: "0",
                    letterSpacing: "-0.025em",
                  }}
                >
                  Novo Custo Mensal
                </h2>
                <Button
                  onClick={handleNewCostModal}
                  style={{
                    minWidth: "auto",
                    padding: "8px",
                    color: "#6b7280",
                  }}
                >
                  <CloseIcon />
                </Button>
              </div>
            </DialogTitle>

            <DialogContent style={{ padding: "24px 24px 16px" }}>
              <div style={{ marginBottom: "20px" }}>
                <h2
                  variant="body2"
                  style={{
                    color: "#6b7280",
                    fontSize: "14px",
                    marginBottom: "12px",
                  }}
                >
                  Mês:{" "}
                  {new Date().toLocaleDateString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
              </div>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descrição"
                    value={newCostDescription}
                    onChange={(e) => setNewCostDescription(e.target.value)}
                    placeholder="Ex: Aluguel, Energia, Internet..."
                    variant="outlined"
                    style={{ marginBottom: "16px" }}
                    InputLabelProps={{
                      style: { color: "#6b7280" },
                    }}
                    InputProps={{
                      style: {
                        fontSize: "15px",
                        color: "#374151",
                      },
                    }}
                    error={checkDuplicateCost()}
                    helperText={
                      checkDuplicateCost()
                        ? "Já existe um custo com esta descrição"
                        : ""
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Valor (R$)"
                    type="number"
                    value={newCostAmount}
                    onChange={(e) => setNewCostAmount(e.target.value)}
                    placeholder="0,00"
                    variant="outlined"
                    InputLabelProps={{
                      style: { color: "#6b7280" },
                    }}
                    InputProps={{
                      style: {
                        fontSize: "15px",
                        color: "#374151",
                        fontFamily:
                          "SF Mono, Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
                      },
                      inputProps: {
                        min: 0,
                        step: 0.01,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions
              style={{
                padding: "16px 24px 24px",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <Button
                onClick={handleNewCostModal}
                style={{
                  color: "#6b7280",
                  fontSize: "14px",
                  fontWeight: "500",
                  textTransform: "none",
                  padding: "8px 16px",
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveCost}
                variant="contained"
                style={{
                  backgroundColor: isSaveButtonDisabled()
                    ? "#9ca3af"
                    : "#3b82f6",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "500",
                  textTransform: "none",
                  padding: "8px 20px",
                  borderRadius: "6px",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  cursor: isSaveButtonDisabled() ? "not-allowed" : "pointer",
                }}
                disabled={isSaveButtonDisabled()}
              >
                {checkDuplicateCost() ? "Nome já existe" : "Adicionar Custo"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Modal para Detalhes do Custo */}
          <Dialog
            open={costDetailModalOpen}
            onClose={() => handleCostDetailModal()}
            fullWidth
            maxWidth="sm"
            PaperProps={{
              style: {
                borderRadius: "12px",
                padding: "8px",
              },
            }}
          >
            <DialogTitle>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "16px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    fontFamily: textGeneralFont(),
                    color: "#1f2937",
                    fontSize: "16px",
                    fontWeight: "500",
                    margin: "0",
                  }}
                >
                  Detalhes do Custo
                </div>
                <Button
                  onClick={() => handleCostDetailModal()}
                  style={{
                    minWidth: "auto",
                    padding: "8px",
                    color: "#6b7280",
                  }}
                >
                  <CloseIcon />
                </Button>
              </div>
            </DialogTitle>

            <DialogContent style={{ padding: "24px 24px 16px" }}>
              {selectedCost && !showDeleteConfirmation && !isEditingCost && (
                <div>
                  <div style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        color: "#6b7280",
                        fontSize: "12px",
                        marginBottom: "4px",
                        fontFamily: textGeneralFont(),
                      }}
                    >
                      Descrição
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        color: "#374151",
                        fontWeight: "500",
                        fontFamily: textGeneralFont(),
                      }}
                    >
                      {selectedCost.description}
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        color: "#6b7280",
                        fontSize: "12px",
                        marginBottom: "4px",
                        fontFamily: textGeneralFont(),
                      }}
                    >
                      Valor
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        color: "#ef4444",
                        fontWeight: "600",
                        fontFamily: textGeneralFont(),
                      }}
                    >
                      R$ {formatNumber(selectedCost.amount)}
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        color: "#6b7280",
                        fontSize: "12px",
                        marginBottom: "4px",
                        fontFamily: textGeneralFont(),
                      }}
                    >
                      Mês
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#374151",
                        fontFamily: textGeneralFont(),
                      }}
                    >
                      {selectedCost.month || currentMonthYear}
                    </div>
                  </div>
                </div>
              )}

              {selectedCost && isEditingCost && !showDeleteConfirmation && (
                <div>
                  <div style={{ marginBottom: "20px" }}>
                    <TextField
                      fullWidth
                      label="Descrição"
                      value={editCostDescription}
                      onChange={(e) => setEditCostDescription(e.target.value)}
                      variant="outlined"
                      size="small"
                      style={{ marginBottom: "16px" }}
                      InputLabelProps={{
                        style: {
                          color: "#6b7280",
                          fontFamily: textGeneralFont(),
                        },
                      }}
                      InputProps={{
                        style: {
                          fontSize: "14px",
                          color: "#374151",
                          fontFamily: textGeneralFont(),
                        },
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <TextField
                      fullWidth
                      label="Valor (R$)"
                      type="number"
                      value={editCostAmount}
                      onChange={(e) => setEditCostAmount(e.target.value)}
                      variant="outlined"
                      size="small"
                      InputLabelProps={{
                        style: {
                          color: "#6b7280",
                          fontFamily: textGeneralFont(),
                        },
                      }}
                      InputProps={{
                        style: {
                          fontSize: "14px",
                          color: "#374151",
                          fontFamily: textGeneralFont(),
                        },
                        inputProps: {
                          min: 0,
                          step: 0.01,
                        },
                      }}
                    />
                  </div>

                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      fontFamily: textGeneralFont(),
                    }}
                  >
                    Mês: {selectedCost.month || currentMonthYear}
                  </div>
                </div>
              )}

              {showDeleteConfirmation && selectedCost && (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div
                    style={{
                      fontSize: "18px",
                      color: "#ef4444",
                      fontWeight: "500",
                      marginBottom: "16px",
                      fontFamily: textGeneralFont(),
                    }}
                  >
                    ⚠️ Tem certeza que deseja excluir?
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: "8px",
                      fontFamily: textGeneralFont(),
                    }}
                  >
                    Esta ação não pode ser desfeita.
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      color: "#374151",
                      fontWeight: "500",
                      fontFamily: textGeneralFont(),
                    }}
                  >
                    <strong>{selectedCost.description}</strong> - R${" "}
                    {formatNumber(selectedCost.amount)}
                  </div>
                </div>
              )}
            </DialogContent>

            <DialogActions
              style={{
                padding: "16px 24px 24px",
                gap: "12px",
                justifyContent: showDeleteConfirmation
                  ? "center"
                  : isEditingCost
                  ? "flex-end"
                  : "space-between",
              }}
            >
              {!showDeleteConfirmation && !isEditingCost && (
                <>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Button
                      onClick={() => setIsEditingCost(true)}
                      variant="outlined"
                      style={{
                        fontSize: "12px",
                        fontWeight: "500",
                        textTransform: "none",
                        padding: "6px 12px",
                        fontFamily: textGeneralFont(),
                        borderColor: "#3b82f6",
                        color: "#3b82f6",
                      }}
                    >
                      ✏️ Editar
                    </Button>
                    <Button
                      onClick={() => setShowDeleteConfirmation(true)}
                      color="error"
                      variant="outlined"
                      style={{
                        fontSize: "12px",
                        fontWeight: "500",
                        textTransform: "none",
                        padding: "6px 12px",
                        fontFamily: textGeneralFont(),
                      }}
                    >
                      🗑️ Excluir
                    </Button>
                  </div>
                  <Button
                    onClick={() => handleCostDetailModal()}
                    style={{
                      color: "#6b7280",
                      fontSize: "12px",
                      fontWeight: "500",
                      textTransform: "none",
                      padding: "6px 12px",
                      fontFamily: textGeneralFont(),
                    }}
                  >
                    Fechar
                  </Button>
                </>
              )}

              {isEditingCost && !showDeleteConfirmation && (
                <div style={{ display: "flex", gap: "12px" }}>
                  <Button
                    onClick={() => {
                      setIsEditingCost(false);
                      // Reset values to original
                      if (selectedCost) {
                        setEditCostDescription(selectedCost.description);
                        setEditCostAmount(selectedCost.amount.toString());
                      }
                    }}
                    style={{
                      color: "#6b7280",
                      fontSize: "12px",
                      fontWeight: "500",
                      textTransform: "none",
                      padding: "6px 16px",
                      fontFamily: textGeneralFont(),
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() =>
                      selectedCost &&
                      handleEditCost(
                        selectedCost.description,
                        selectedCost.amount,
                        editCostDescription,
                        editCostAmount
                      )
                    }
                    variant="contained"
                    disabled={!editCostDescription.trim() || !editCostAmount}
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      textTransform: "none",
                      padding: "6px 16px",
                      fontFamily: textGeneralFont(),
                      backgroundColor:
                        !editCostDescription.trim() || !editCostAmount
                          ? "#9ca3af"
                          : "#3b82f6",
                    }}
                  >
                    Salvar
                  </Button>
                </div>
              )}

              {showDeleteConfirmation && (
                <div style={{ display: "flex", gap: "12px" }}>
                  <Button
                    onClick={() => setShowDeleteConfirmation(false)}
                    style={{
                      color: "#6b7280",
                      fontSize: "12px",
                      fontWeight: "500",
                      textTransform: "none",
                      padding: "6px 16px",
                      fontFamily: textGeneralFont(),
                    }}
                  >
                    Não
                  </Button>
                  <Button
                    onClick={() =>
                      selectedCost &&
                      handleDeleteCost(
                        selectedCost.description,
                        selectedCost.amount
                      )
                    }
                    color="error"
                    variant="contained"
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      textTransform: "none",
                      padding: "6px 16px",
                      fontFamily: textGeneralFont(),
                      backgroundColor: "#ef4444",
                    }}
                  >
                    Sim, excluir
                  </Button>
                </div>
              )}
            </DialogActions>
          </Dialog>

          <Dialog
            open={isVisible}
            onClose={handleSeeModal}
            fullWidth
            maxWidth="md"
            PaperProps={{
              style: { borderRadius: "12px" },
            }}
          >
            <DialogTitle>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "1rem",
                }}
              >
                <h2 variant="h5" fontWeight="600" color="#333">
                  {newName} {newLastName}
                </h2>
                <Button
                  onClick={handleSeeModal}
                  style={{ minWidth: "auto", padding: "8px" }}
                >
                  <CloseIcon />
                </Button>
              </div>
            </DialogTitle>

            <DialogContent style={{ padding: "2rem" }}>
              {/* SEÇÃO 1: INFORMAÇÕES BÁSICAS */}
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  marginBottom: "2rem",
                }}
              >
                <h2 gutterBottom fontWeight="600" color="#333">
                  📝 Informações Básicas
                </h2>
                <Grid container spacing={2}>
                  {newName && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Nome"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        size="small"
                      />
                    </Grid>
                  )}
                  {newLastName && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Sobrenome"
                        value={newLastName}
                        onChange={(e) => setNewLastName(e.target.value)}
                        size="small"
                      />
                    </Grid>
                  )}
                  {newPhone && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Telefone"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        size="small"
                      />
                    </Grid>
                  )}
                  {newAddress && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Endereço"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        size="small"
                      />
                    </Grid>
                  )}
                  {weeklyClasses && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Aulas por semana"
                        value={weeklyClasses}
                        onChange={(e) => setWeeklyClasses(e.target.value)}
                        size="small"
                      />
                    </Grid>
                  )}{" "}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="string"
                      label="Mensalidade"
                      value={fee}
                      onChange={(e) => setFee(e.target.value)}
                      size="small"
                    />
                  </Grid>
                </Grid>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "1rem",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => editStudent(ID)}
                    style={{
                      backgroundColor: partnerColor(),
                      color: "#fff",
                      fontWeight: "600",
                    }}
                  >
                    💾 Salvar Informações
                  </Button>
                </div>
              </div>
              {/* SEÇÃO 3: CONFIGURAÇÕES */}
              <div
                style={{
                  backgroundColor: "#e3f2fd",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  marginBottom: "2rem",
                  border: "1px solid #bbdefb",
                }}
              >
                <h2 gutterBottom fontWeight="600" color="#333">
                  ⚙️ Configurações
                </h2>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    Mensalidade em dia?
                    <br />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={feeUpToDate}
                          onChange={() => {
                            updateFeeStatus(ID);
                            setFeeUpToDate(!feeUpToDate);
                          }}
                          color="primary"
                        />
                      }
                      label={feeUpToDate ? "💰 Sim" : "⚠️ Não"}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    Matrícula ativa?
                    <br />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!onHold}
                          onChange={() => {
                            updateOnHold(ID);
                            setOnHold(!onHold);
                          }}
                          color="primary"
                        />
                      }
                      label={onHold ? "Não" : "Sim"}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    Aluno particular?
                    <br />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={tutoree}
                          onChange={() => {
                            updateTutoree(ID);
                            setTutoree(!tutoree);
                          }}
                          color="primary"
                        />
                      }
                      label={tutoree ? "📚 Sim" : "📖 Não"}
                    />
                  </Grid>
                  <div>
                    <span
                      style={{
                        color: !feeUpToDate ? "red" : "green",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        marginLeft: "1rem",
                      }}
                    >
                      {feeUpToDate
                        ? "Mensalidade em Dia"
                        : "Mensalidade Atrasada"}
                    </span>
                    <span
                      style={{
                        color: onHold ? "red" : "green",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        marginLeft: "1rem",
                      }}
                    >
                      {onHold ? "Matrícula Trancada" : "Matrícula Ativa"}
                    </span>
                    <span
                      style={{
                        color: !tutoree ? "red" : "green",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        marginLeft: "1rem",
                      }}
                    >
                      {tutoree ? "Aluno particular" : "Não é aluno particular"}
                    </span>
                  </div>
                </Grid>
              </div>
            </DialogContent>

            <DialogActions
              style={{
                padding: "1.5rem",
                borderTop: "1px solid #eee",
                justifyContent: "space-between",
              }}
            >
              {!seeConfirmDelete ? (
                <>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => setSeeConfirmDelete(true)}
                    style={{ fontWeight: "600" }}
                  >
                    🗑️ Excluir Aluno
                  </Button>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <Button
                      onClick={handleSeeModal}
                      style={{ fontWeight: "600" }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : (
                <div style={{ width: "100%", textAlign: "center" }}>
                  <h2 color="error" gutterBottom>
                    ⚠️ Confirmar Exclusão
                  </h2>
                  <h2 color="textSecondary" gutterBottom>
                    Tem certeza que deseja excluir{" "}
                    <strong>
                      {newName} {newLastName}
                    </strong>
                    ?
                    <br />
                    <small>Esta ação não pode ser desfeita.</small>
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "1rem",
                      marginTop: "1rem",
                    }}
                  >
                    <Button
                      onClick={() => setSeeConfirmDelete(false)}
                      style={{ fontWeight: "600" }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      color="error"
                      variant="contained"
                      onClick={handleDelete}
                      style={{ fontWeight: "600" }}
                    >
                      Confirmar Exclusão
                    </Button>
                  </div>
                </div>
              )}
            </DialogActions>
          </Dialog>

          {/* Financial Report Edit Modal */}
          <Dialog
            open={financialReportModalOpen}
            onClose={() => handleFinancialReportModal()}
            fullWidth
            maxWidth="sm"
            PaperProps={{
              style: {
                borderRadius: "12px",
                padding: "8px",
              },
            }}
          >
            <DialogTitle>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "16px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <h2
                  style={{
                    fontFamily: textTitleFont(),
                    color: "#1f2937",
                    fontSize: "18px",
                    fontWeight: "500",
                    margin: "0",
                    letterSpacing: "-0.025em",
                  }}
                >
                  Editar Relatório Financeiro
                </h2>
                <Button
                  onClick={() => handleFinancialReportModal()}
                  style={{
                    minWidth: "auto",
                    padding: "8px",
                    color: "#6b7280",
                  }}
                >
                  <CloseIcon />
                </Button>
              </div>
            </DialogTitle>

            <DialogContent style={{ padding: "24px 24px 16px" }}>
              {selectedFinancialReport && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    width: "100%",
                    gap: "16px",
                    justifyContent: "space-between",
                    margin: "auto",
                    alignItems: "center",
                  }}
                >
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Descrição"
                      value={editReportDescription}
                      onChange={(e) => setEditReportDescription(e.target.value)}
                      variant="outlined"
                      InputLabelProps={{
                        style: {
                          color: "#6b7280",
                          fontFamily: textGeneralFont(),
                        },
                      }}
                      InputProps={{
                        style: {
                          fontSize: "15px",
                          color: "#374151",
                          fontFamily: textGeneralFont(),
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Valor (R$)"
                      type="number"
                      value={editReportAmount}
                      onChange={(e) => setEditReportAmount(e.target.value)}
                      variant="outlined"
                      InputLabelProps={{
                        style: {
                          color: "#6b7280",
                          fontFamily: textGeneralFont(),
                        },
                      }}
                      InputProps={{
                        style: {
                          fontSize: "15px",
                          color: "#374151",
                          fontFamily: textGeneralFont(),
                        },
                        inputProps: {
                          min: 0,
                          step: 0.01,
                        },
                      }}
                    />
                  </Grid>

                  {editReportTypeOfItem !== "debt" && (
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Desconto (R$)"
                        type="number"
                        value={editReportDiscount}
                        onChange={(e) => setEditReportDiscount(e.target.value)}
                        variant="outlined"
                        InputLabelProps={{
                          style: {
                            color: "#6b7280",
                            fontFamily: textGeneralFont(),
                          },
                        }}
                        InputProps={{
                          style: {
                            fontSize: "15px",
                            color: "#374151",
                            fontFamily: textGeneralFont(),
                          },
                          inputProps: {
                            min: 0,
                            step: 0.01,
                          },
                        }}
                      />
                    </Grid>
                  )}

                  {editReportTypeOfItem !== "debt" && (
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel
                          style={{
                            color: "#6b7280",
                            fontFamily: textGeneralFont(),
                          }}
                        >
                          Tipo de Item
                        </InputLabel>
                        <Select
                          value={editReportTypeOfItem}
                          onChange={(e) =>
                            setEditReportTypeOfItem(e.target.value)
                          }
                          label="Tipo de Item"
                          style={{
                            fontSize: "15px",
                            color: "#374151",
                            fontFamily: textGeneralFont(),
                          }}
                        >
                          <MenuItem value="fee">Mensalidade</MenuItem>
                          <MenuItem value="others">Outro</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",

                      width: "70%",
                      gap: "16px",
                      justifyContent: "space-between",
                      margin: "auto",
                      alignItems: "center",
                    }}
                  >
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={editReportAccountFor}
                            onChange={(e) =>
                              setEditReportAccountFor(e.target.checked)
                            }
                            color="primary"
                          />
                        }
                        label="Contabilizar"
                        style={{
                          color: "#374151",
                          fontFamily: textGeneralFont(),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={editReportPaidFor}
                            onChange={(e) =>
                              setEditReportPaidFor(e.target.checked)
                            }
                            color="primary"
                          />
                        }
                        label="Quitado"
                        style={{
                          color: "#374151",
                          fontFamily: textGeneralFont(),
                        }}
                      />
                    </Grid>
                  </div>
                </div>
              )}
            </DialogContent>

            <DialogActions
              style={{
                padding: "16px 24px 24px",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <Button
                onClick={() => handleFinancialReportModal()}
                style={{
                  color: "#6b7280",
                  fontSize: "14px",
                  fontWeight: "500",
                  textTransform: "none",
                  padding: "8px 16px",
                  fontFamily: textGeneralFont(),
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveFinancialReport}
                variant="contained"
                disabled={!editReportDescription.trim() || !editReportAmount}
                style={{
                  backgroundColor:
                    !editReportDescription.trim() || !editReportAmount
                      ? "#9ca3af"
                      : "#3b82f6",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "500",
                  textTransform: "none",
                  padding: "8px 20px",
                  borderRadius: "6px",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  cursor:
                    !editReportDescription.trim() || !editReportAmount
                      ? "not-allowed"
                      : "pointer",
                  fontFamily: textGeneralFont(),
                }}
              >
                Salvar
              </Button>
            </DialogActions>
          </Dialog>

          {/* MODAL NOVO ITEM FINANCEIRO */}
          <Dialog
            open={newItemModalOpen}
            onClose={handleNewItemModal}
            fullWidth
            maxWidth="sm"
            PaperProps={{
              style: {
                borderRadius: "12px",
                padding: "8px",
              },
            }}
          >
            <DialogTitle>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: "16px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <h2
                  style={{
                    fontFamily: textTitleFont(),
                    color: "#1f2937",
                    fontSize: "18px",
                    fontWeight: "500",
                    margin: "0",
                    letterSpacing: "-0.025em",
                  }}
                >
                  Novo Item Financeiro
                </h2>
                <Button
                  onClick={handleNewItemModal}
                  style={{
                    minWidth: "auto",
                    padding: "8px",
                    color: "#6b7280",
                  }}
                >
                  <CloseIcon />
                </Button>
              </div>
            </DialogTitle>

            <DialogContent style={{ padding: "24px 24px 16px" }}>
              <div style={{ marginBottom: "20px" }}>
                <h2
                  style={{
                    color: "#6b7280",
                    fontSize: "14px",
                    marginBottom: "12px",
                    fontFamily: textGeneralFont(),
                  }}
                >
                  Mês: {selectedMonth}
                </h2>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  width: "100%",
                  gap: "16px",
                  justifyContent: "space-between",
                  margin: "auto",
                  alignItems: "center",
                }}
              >
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descrição"
                    value={newItemDescription}
                    onChange={(e) => setNewItemDescription(e.target.value)}
                    variant="outlined"
                    placeholder="Ex: Venda de curso, Aluguel..."
                    InputLabelProps={{
                      style: {
                        color: "#6b7280",
                        fontFamily: textGeneralFont(),
                      },
                    }}
                    InputProps={{
                      style: {
                        fontSize: "15px",
                        color: "#374151",
                        fontFamily: textGeneralFont(),
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Valor (R$)"
                    type="number"
                    value={newItemAmount}
                    onChange={(e) => setNewItemAmount(e.target.value)}
                    variant="outlined"
                    InputLabelProps={{
                      style: {
                        color: "#6b7280",
                        fontFamily: textGeneralFont(),
                      },
                    }}
                    InputProps={{
                      style: {
                        fontSize: "15px",
                        color: "#374151",
                        fontFamily: textGeneralFont(),
                      },
                      inputProps: {
                        min: 0,
                        step: 0.01,
                      },
                    }}
                  />
                </Grid>

                {newItemTypeOfItem !== "debt" && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Desconto (R$)"
                      type="number"
                      value={newItemDiscount}
                      onChange={(e) => setNewItemDiscount(e.target.value)}
                      variant="outlined"
                      InputLabelProps={{
                        style: {
                          color: "#6b7280",
                          fontFamily: textGeneralFont(),
                        },
                      }}
                      InputProps={{
                        style: {
                          fontSize: "15px",
                          color: "#374151",
                          fontFamily: textGeneralFont(),
                        },
                        inputProps: {
                          min: 0,
                          step: 0.01,
                        },
                      }}
                    />
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel
                      style={{
                        color: "#6b7280",
                        fontFamily: textGeneralFont(),
                      }}
                    >
                      Tipo de Item
                    </InputLabel>
                    <Select
                      value={newItemTypeOfItem}
                      onChange={(e) => setNewItemTypeOfItem(e.target.value)}
                      label="Tipo de Item"
                      style={{
                        fontSize: "15px",
                        color: "#374151",
                        fontFamily: textGeneralFont(),
                      }}
                    >
                      <MenuItem value="others">Entrada</MenuItem>
                      <MenuItem value="debt">Saída</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    width: "70%",
                    gap: "16px",
                    justifyContent: "space-between",
                    margin: "auto",
                    alignItems: "center",
                  }}
                >
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newItemAccountFor}
                          onChange={(e) =>
                            setNewItemAccountFor(e.target.checked)
                          }
                          color="primary"
                        />
                      }
                      label="Contabilizar"
                      style={{
                        color: "#374151",
                        fontFamily: textGeneralFont(),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={newItemPaidFor}
                          onChange={(e) => setNewItemPaidFor(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Quitado"
                      style={{
                        color: "#374151",
                        fontFamily: textGeneralFont(),
                      }}
                    />
                  </Grid>
                </div>
              </div>
            </DialogContent>

            <DialogActions
              style={{
                padding: "16px 24px 24px",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <Button
                onClick={handleNewItemModal}
                style={{
                  color: "#6b7280",
                  fontSize: "14px",
                  fontWeight: "500",
                  textTransform: "none",
                  padding: "8px 16px",
                  fontFamily: textGeneralFont(),
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={newStandaloneItem}
                variant="contained"
                disabled={!newItemDescription.trim() || !newItemAmount}
                style={{
                  backgroundColor:
                    !newItemDescription.trim() || !newItemAmount
                      ? "#9ca3af"
                      : newItemTypeOfItem === "debt"
                      ? "#dc2626"
                      : "#16a34a",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "500",
                  textTransform: "none",
                  padding: "8px 20px",
                  borderRadius: "6px",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  cursor:
                    !newItemDescription.trim() || !newItemAmount
                      ? "not-allowed"
                      : "pointer",
                  fontFamily: textGeneralFont(),
                }}
              >
                {newItemTypeOfItem === "debt"
                  ? "💸 Criar Saída"
                  : "💰 Criar Entrada"}
              </Button>
            </DialogActions>
          </Dialog>
        </section>
      </div>
    </>
  );
}

export default FinancialResources;
