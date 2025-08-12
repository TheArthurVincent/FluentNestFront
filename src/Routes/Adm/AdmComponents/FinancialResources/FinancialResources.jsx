import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DivModal,
  Xp,
  backDomain,
  formatDateBr,
  formatNumber,
  onLoggOut,
  transformMonth,
  truncateString,
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
  primaryColor,
  textGeneralFont,
  textPrimaryColorContrast,
  textTitleFont,
} from "../../../../Styles/Styles";
import { HOne, HTwo } from "../../../../Resources/Components/RouteBox";
import {
  ArvinButton,
  MyButton,
} from "../../../../Resources/Components/ItemsLibrary";
import { HThree } from "../../../MyClasses/MyClasses.Styled";
import { notifyAlert } from "../../../EnglishLessons/Assets/Functions/FunctionLessons";
import { listOfButtons } from "../../../Ranking/RankingComponents/ListOfCriteria";
import { isArthurVincent } from "../../../../App";

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
  const [editCostAmount, setEditCostAmount] = useState(0);

  // Financial Report Edit Modal States
  const [financialReportModalOpen, setFinancialReportModalOpen] =
    useState(false);
  const [selectedFinancialReport, setSelectedFinancialReport] = useState(null);
  const [editReportDescription, setEditReportDescription] = useState("");
  const [editReportAmount, setEditReportAmount] = useState("");
  const [editReportDiscount, setEditReportDiscount] = useState("");
  const [editReportDiscountType, setEditReportDiscountType] =
    useState("absolute"); // "absolute" ou "percentage"
  const [editReportDiscountPercentage, setEditReportDiscountPercentage] =
    useState("");
  const [editReportPaidSoFar, setEditReportPaidSoFar] = useState("");
  const [editReportAccountFor, setEditReportAccountFor] = useState(true);
  const [editReportPaidFor, setEditReportPaidFor] = useState(false);
  const [editReportTypeOfItem, setEditReportTypeOfItem] = useState("");
  const [editReportMonth, setEditReportMonth] = useState("");

  // New Standalone Item Modal States
  const [newItemModalOpen, setNewItemModalOpen] = useState(false);
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");
  const [newItemDiscount, setNewItemDiscount] = useState("");
  const [newItemDiscountType, setNewItemDiscountType] = useState("absolute"); // "absolute" ou "percentage"
  const [newItemDiscountPercentage, setNewItemDiscountPercentage] =
    useState("");
  const [newItemTypeOfItem, setNewItemTypeOfItem] = useState("others");
  const [newItemAccountFor, setNewItemAccountFor] = useState(true);
  const [newItemPaidFor, setNewItemPaidFor] = useState(false);
  const [includeThisMonth, setIncludeThisMonth] = useState(false);
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
  const [loadingReports, setLoadingReports] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup do event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // ===== CONSTANTS =====
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
    setShowGenerateButton(false);
    setSeeConfirmDelete(!seeConfirmDelete);
  };

  const handleDelete = () => {
    deleteStudent(ID);
    setShowGenerateButton(false);
  };

  const handleNewCostModal = () => {
    setShowGenerateButton(false);

    setIncludeThisMonth(false);

    setNewCostModalOpen(!newCostModalOpen);
    if (!newCostModalOpen) {
      // Reset form when opening
      setNewCostAmount("");
      setNewCostDescription("");
    }
  };

  const handleCostDetailModal = (cost = null) => {
    setShowGenerateButton(false);
    setCostDetailModalOpen(!costDetailModalOpen);
    setSelectedCost(cost);
    if (!costDetailModalOpen) {
      // Reset states when opening
      setShowDeleteConfirmation(false);
      setIsEditingCost(false);
      if (cost) {
        setEditCostDescription(cost.description);
        setEditCostAmount(cost.amount);
      } else {
        setEditCostDescription("");
        setEditCostAmount(0);
      }
    } else {
      // When closing modal, reset states
      setEditCostDescription("");
      setEditCostAmount(0);
    }
  };

  const toggleFixedCosts = () => {
    setFixedCostsExpanded(!fixedCostsExpanded);
    setShowGenerateButton(false);
  };

  const toggleRevenue = () => {
    setRevenueExpanded(!revenueExpanded);
    setShowGenerateButton(false);
  };

  // Financial Report Modal Handlers
  const handleFinancialReportModal = (report = null) => {
    setShowGenerateButton(false);
    setEditReportPaidSoFar(0);
    setFinancialReportModalOpen(!financialReportModalOpen);
    if (report) {
      setSelectedFinancialReport(report);
      setEditReportDescription(report.description);
      setEditReportAmount(report.amount.toString());
      setEditReportDiscount(report.discount.toString());
      setEditReportDiscountType("absolute"); // Sempre começar com valor absoluto
      setEditReportDiscountPercentage(""); // Reset porcentagem
      setEditReportPaidSoFar(report.paidSoFar ? report.paidSoFar : 0);
      setEditReportAccountFor(report.accountFor);
      setEditReportPaidFor(report.paidFor);
      setEditReportTypeOfItem(report.typeOfItem);
      setEditReportMonth(report.month);
    } else {
      setSelectedFinancialReport(null);
      setEditReportDescription("");
      setEditReportAmount("");
      setEditReportPaidSoFar(0);
      setEditReportDiscount("");
      setEditReportDiscountType("absolute"); // Reset tipo de desconto
      setEditReportDiscountPercentage(""); // Reset porcentagem
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
      setNewItemDiscountType("absolute"); // Reset tipo de desconto
      setNewItemDiscountPercentage(""); // Reset porcentagem
      setNewItemTypeOfItem("others");
      setNewItemAccountFor(true);
      setNewItemPaidFor(false);
    }
  };

  const handleSaveCost = async (typeOfItem) => {
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
        newCostDescription,
        typeOfItem
      );
      notifyAlert("Custo fixo adicionado com sucesso!", "green");
      handleNewCostModal();
    } catch (error) {
      notifyAlert("Erro ao adicionar custo fixo");
      console.log("error", error);
    }
  };

  // ===== API FUNCTIONS =====

  const seeEdition = async (id) => {
    handleSeeModal();
    try {
      const response = await axios.get(`${backDomain}/api/v1/student/${id}`, {
        headers,
      });
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
    setLoadingReports(true);
    try {
      const response = await axios.get(`${backDomain}/api/v1/finance/${id}`, {
        headers,
        params: { month },
      });
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
      setLoadingReports(false);
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
    } catch (error) {
      notifyAlert("Erro ao editar custo");
      console.log("error", error);
    }
  };

  const generateReports = async (month) => {
    setLoadingReports(true);
    setShowGenerateButton(false);
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
      setLoadingReports(false);
    } catch (error) {
      setLoadingReports(false);
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
      setShowGenerateButton(false);
    } catch (error) {
      notifyAlert("Erro ao criar item financeiro");
      console.log("error", error);
    }
  };

  const handleSaveFinancialReport = async () => {
    if (!selectedFinancialReport) return;
    setShowGenerateButton(false);

    try {
      const updatedReport = {
        ...selectedFinancialReport,
        description: editReportDescription,
        amount: parseFloat(editReportAmount),
        discount: parseFloat(editReportDiscount) || 0,
        accountFor: editReportAccountFor,
        paidFor: editReportPaidFor,
        typeOfItem: editReportTypeOfItem,
        paidSoFar: editReportPaidSoFar,
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
      notifyAlert(
        "Relatório financeiro atualizado com sucesso!",
        partnerColor()
      );
    } catch (error) {
      console.log("error", error);
      notifyAlert("Erro ao atualizar relatório financeiro");
    }
  };

  const newFixedCost = async (amount, month, description, typeOfItem) => {
    setShowGenerateButton(false);

    try {
      const response = await axios.post(
        `${backDomain}/api/v1/fixed-cost/${id}`,
        {
          amount,
          month,
          description,
          addThisMonth: includeThisMonth,
          typeOfItem,
        },
        {
          headers,
        }
      );
      setFixedCosts(response.data.fixedCosts);
      setFinancialReports(
        response.data.reportsThisMonth.length > 0
          ? response.data.reportsThisMonth
          : financialReports
      );
      setIncludeThisMonth(false);
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
  const [showGenerateButton, setShowGenerateButton] = useState(false);
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

  // Dados do resumo financeiro
  const calculateFinancialData = () => {
    // Verificação de segurança para evitar erros quando financialReports é undefined
    if (!financialReports || !Array.isArray(financialReports)) {
      return [
        {
          id: "entradas",
          title: "Entradas Esperadas",
          value: 0,
          color: "#059669",
        },
        {
          id: "entradas-recebidas",
          title: "Entradas Recebidas",
          value: 0,
          color: "#04865dff",
        },
        { id: "saidas", title: "Saídas Esperadas", value: 0, color: "#dc2626" },
        {
          id: "saidas-pagas",
          title: "Saídas Pagas",
          value: 0,
          color: "rgba(203, 38, 38, 1)",
        },
        { id: "saldo", title: "Saldo Previsto", value: 0, color: "#16a34a" },
      ];
    }

    const entradas = financialReports
      .filter((report) => report.accountFor && report.typeOfItem !== "debt")
      .reduce(
        (total, report) =>
          total + (Math.abs(report.amount || 0) - (report.discount || 0)),
        0
      );

    const entradasRecebidas = financialReports
      .filter(
        (report) =>
          report.accountFor &&
          report.typeOfItem !== "debt" &&
          (report.paidFor || (report.paidSoFar && report.paidSoFar > 0))
      )
      .reduce((total, report) => {
        // Sempre usar paidSoFar quando disponível, pois pode ser maior que o valor original
        if (report.paidSoFar && report.paidSoFar > 0) {
          return total + Math.abs(report.paidSoFar);
        } else if (report.paidFor) {
          // Fallback para casos onde paidFor é true mas paidSoFar não está definido
          return (
            total + (Math.abs(report.amount || 0) - (report.discount || 0))
          );
        }
        return total;
      }, 0);

    const saidas = financialReports
      .filter((report) => report.accountFor && report.typeOfItem === "debt")
      .reduce((total, report) => total + Math.abs(report.amount || 0), 0);

    const saidasPagas = financialReports
      .filter(
        (report) =>
          report.accountFor &&
          report.typeOfItem === "debt" &&
          (report.paidFor || (report.paidSoFar && report.paidSoFar > 0))
      )
      .reduce((total, report) => {
        // Sempre usar paidSoFar quando disponível, pois pode ser maior que o valor original
        if (report.paidSoFar && report.paidSoFar > 0) {
          return total + Math.abs(report.paidSoFar);
        } else if (report.paidFor) {
          // Fallback para casos onde paidFor é true mas paidSoFar não está definido
          return total + Math.abs(report.amount || 0);
        }
        return total;
      }, 0);

    const saldo = entradas - saidas;

    return [
      {
        id: "entradas",
        title: "Entradas Esperadas",
        value: entradas,
        color: "#059669",
      },
      {
        id: "entradas-recebidas",
        title: "Entradas Recebidas",
        value: entradasRecebidas,
        color: "#04865dff",
      },
      {
        id: "saidas",
        title: "Saídas Esperadas",
        value: saidas,
        color: "#dc2626",
      },
      {
        id: "saidas-pagas",
        title: "Saídas Pagas",
        value: saidasPagas,
        color: "rgba(203, 38, 38, 1)",
      },
      {
        id: "saldo",
        title: "Saldo Previsto",
        value: saldo,
        color: saldo < 0 ? "#dc2626" : "#16a34a",
      },
    ];
  };

  return (
    <div
      style={{
        padding: isMobile ? "8px" : "16px",
      }}
    >
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
          setShowGenerateButton(false);

          setSelectedMonth(e.target.value);
          seeReports(e.target.value);
        }}
        style={{
          padding: "12px 16px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          fontSize: "14px",
          fontFamily: textGeneralFont(),
          color: "#374151",
          backgroundColor: "#fff",
          outline: "none",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          minWidth: "200px",
          margin: "0 auto 24px auto",
          display: "block",
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = "#3b82f6";
          e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = "#d1d5db";
          e.target.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#3b82f6";
          e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#d1d5db";
          e.target.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
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
          justifyContent: "top",
          gap: "1rem",
          margin: "16px auto",
          marginBottom: "16px",
        }}
      >
        <section>
          {!loadingReports ? (
            <>
              {financialReports.length <= 0 ? (
                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#6b7280",
                      fontFamily: textGeneralFont(),
                      marginBottom: "20px",
                    }}
                  >
                    Nenhum relatório disponível para este mês.
                  </p>
                  {isCurrentOrFutureMonth(selectedMonth) && (
                    <>
                      {!showGenerateButton && (
                        <button
                          className="linguee-btn linguee-btn-outline"
                          onClick={() =>
                            setShowGenerateButton(!showGenerateButton)
                          }
                        >
                          Gerar relatório para {transformMonth(selectedMonth)}
                        </button>
                      )}
                      {showGenerateButton && (
                        <>
                          <div
                            style={{
                              backgroundColor: "#e8f4fd",
                              border: "1px solid #bee5eb",
                              borderRadius: "8px",
                              padding: "16px",
                              margin: "16px 0",
                              display: "grid",
                              gap: "12px",
                            }}
                          >
                            <div style={{ fontSize: "20px", color: "#0c5460" }}>
                              💡
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "600",
                                  color: "#0c5460",
                                  marginBottom: "8px",
                                  fontFamily: textGeneralFont(),
                                }}
                              >
                                DICA: Verifique antes de gerar o relatório
                              </div>
                              <div
                                style={{
                                  fontSize: "13px",
                                  color: "#0c5460",
                                  lineHeight: "1.5",
                                  fontFamily: textGeneralFont(),
                                }}
                              >
                                • Confirme se as{" "}
                                <strong>mensalidades dos alunos</strong> estão
                                atualizadas
                                <br />• Verifique se há{" "}
                                <strong>alunos trancados</strong> que devem ser
                                removidos
                                <br />• O relatório será gerado com base nas
                                informações atuais dos alunos
                              </div>
                            </div>
                          </div>

                          <button
                            className="linguee-btn linguee-btn-outline"
                            onClick={() => generateReports(selectedMonth)}
                          >
                            Gerar relatório para {selectedMonth}
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    maxWidth: "800px",
                    margin: "16px auto",
                  }}
                >
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
                    <HTwo>{transformMonth(selectedMonth)}</HTwo>
                    <button
                      title={`Novo ítem para o mês de ${transformMonth(
                        selectedMonth
                      )}`}
                      className="linguee-btn linguee-btn-primary"
                      style={{
                        marginLeft: "8px",
                      }}
                      onClick={handleNewItemModal}
                    >
                      +
                    </button>
                  </div>

                  {/* RESUMO FINANCEIRO */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateAreas: `
                    "item1 item2"
                    "item3 item4"
                    "item5 item5"
                  `,
                      gap: "12px",
                      marginBottom: "20px",
                    }}
                  >
                    {calculateFinancialData().map((item, index) => (
                      <div
                        key={item.id}
                        style={{
                          gridArea: `item${index + 1}`,
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                          padding: "12px",
                          textAlign: "center",
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
                          {item.title}
                        </div>
                        <div
                          style={{
                            fontWeight: "600",
                            color: item.color,
                            marginBottom: "4px",
                            fontFamily: textTitleFont(),
                          }}
                        >
                          R$ {formatNumber(item.value)}
                        </div>
                        {item.subtitle && (
                          <div
                            style={{
                              color: "#9ca3af",
                              fontFamily: textGeneralFont(),
                              fontWeight: "400",
                              ...item.subtitleStyle,
                            }}
                          >
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                      gap: "16px",
                    }}
                  >
                    {/* ENTRADAS */}
                    {(financialReports.filter(
                      (report) =>
                        report.accountFor && report.typeOfItem !== "debt"
                    ).length > 0 ||
                      financialReports.filter(
                        (report) =>
                          !report.accountFor && report.typeOfItem !== "debt"
                      ).length > 0) && (
                      <div
                        style={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                          padding: "12px",
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
                          {/* Entradas contabilizadas */}
                          {financialReports
                            .filter(
                              (report) =>
                                report.accountFor &&
                                report.typeOfItem !== "debt"
                            )
                            .sort((a, b) =>
                              a.description.localeCompare(b.description)
                            )
                            .map((report, index) => (
                              <div
                                key={report.studentId || index}
                                onClick={() =>
                                  handleFinancialReportModal(report)
                                }
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                  alignItems: "left",
                                  padding: "12px",
                                  gap: "12px",
                                  backgroundColor: "#fff",
                                  border: "1px solid #eee",
                                  borderRadius: "4px",
                                  transition: "all 0.2s ease",
                                  cursor: "pointer",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#e7f4ebff";
                                  e.currentTarget.style.borderColor =
                                    "#daf9e4ff";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#fff";
                                  e.currentTarget.style.borderColor = "#eee";
                                }}
                              >
                                <div
                                  style={{
                                    textAlign: "center",
                                    borderRadius: "12px",
                                    color: report.paidFor
                                      ? "#2e7d32"
                                      : report.paidSoFar && report.paidSoFar > 0
                                      ? "#f59e0b"
                                      : "#c62828",
                                    fontFamily: textGeneralFont(),
                                  }}
                                >
                                  {report.paidFor &&
                                  report.paidSoFar ==
                                    Math.abs(report.amount) -
                                      (report.discount || 0) ? (
                                    <i
                                      className="fa fa-check-circle-o"
                                      style={{ color: "#2e7d32" }}
                                    />
                                  ) : report.paidSoFar &&
                                    report.paidSoFar > 0 &&
                                    report.paidSoFar <
                                      Math.abs(report.amount) -
                                        (report.discount || 0) ? (
                                    <i
                                      className="fa fa-adjust"
                                      style={{ color: "#f59e0b" }}
                                    />
                                  ) : report.paidSoFar &&
                                    report.paidSoFar >
                                      Math.abs(report.amount) -
                                        (report.discount || 0) ? (
                                    <div
                                      style={{
                                        display: "grid",
                                      }}
                                    >
                                      {" "}
                                      <i
                                        className="fa fa-money"
                                        style={{ color: "#24e21aff" }}
                                      />
                                      <span
                                        style={{
                                          fontWeight: 800,
                                          fontSize: "10px",
                                          color: "#24e21aff",
                                        }}
                                      >
                                        Superado!
                                      </span>
                                    </div>
                                  ) : (
                                    <i
                                      className="fa fa-circle-o"
                                      style={{ color: "#c62828" }}
                                    />
                                  )}
                                </div>

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
                                    {truncateString(
                                      report.description,
                                      isMobile ? 25 : 50
                                    )}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "11px",
                                      color: "#6b7280",
                                      fontFamily: textGeneralFont(),
                                    }}
                                  >
                                    {report.discount > 0 &&
                                      `Original: R$ ${formatNumber(
                                        report.amount
                                      )} • Desconto: R$ ${formatNumber(
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
                                      fontSize: "13px",

                                      fontWeight: "600",
                                      color: "#0f8311ff",
                                      fontFamily: textGeneralFont(),
                                    }}
                                  >
                                    R$ {formatNumber(report.paidSoFar || 0)} /
                                    R${" "}
                                    {formatNumber(
                                      Math.abs(report.amount) -
                                        (report.discount || 0)
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}

                          {/* Entradas não contabilizadas */}
                          {financialReports
                            .filter(
                              (report) =>
                                !report.accountFor &&
                                report.typeOfItem !== "debt"
                            )
                            .sort((a, b) =>
                              a.description.localeCompare(b.description)
                            )
                            .map((report, index) => (
                              <div
                                key={`unaccounted-${report.studentId || index}`}
                                onClick={() =>
                                  handleFinancialReportModal(report)
                                }
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                  alignItems: "left",
                                  padding: "12px",
                                  gap: "12px",
                                  backgroundColor: "#fff",
                                  border: "1px solid #e5e7eb",
                                  borderRadius: "4px",
                                  opacity: 0.7,
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.opacity = "1";
                                  e.currentTarget.style.backgroundColor =
                                    "#f0f9f0";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.opacity = "0.7";
                                  e.currentTarget.style.backgroundColor =
                                    "#fff";
                                }}
                              >
                                <div
                                  style={{
                                    textAlign: "center",
                                    borderRadius: "12px",
                                    color: "#9ca3af",
                                    fontFamily: textGeneralFont(),
                                  }}
                                >
                                  <i
                                    className="fa fa-eye-slash"
                                    style={{ color: "#9ca3af" }}
                                  />
                                </div>

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
                                    {truncateString(
                                      report.description,
                                      isMobile ? 25 : 50
                                    )}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "11px",
                                      color: "#9ca3af",
                                      fontFamily: textGeneralFont(),
                                    }}
                                  >
                                    Não contabilizado
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
                                      fontSize: "13px",
                                      fontWeight: "500",
                                      color: "#9ca3af",
                                      fontFamily: textGeneralFont(),
                                    }}
                                  >
                                    R${" "}
                                    {formatNumber(
                                      Math.abs(report.amount) -
                                        (report.discount || 0)
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

                    {/* SAÍDAS */}
                    {(financialReports.filter(
                      (report) =>
                        report.accountFor && report.typeOfItem === "debt"
                    ).length > 0 ||
                      financialReports.filter(
                        (report) =>
                          !report.accountFor && report.typeOfItem === "debt"
                      ).length > 0) && (
                      <div
                        style={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                          padding: "12px",
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
                          {/* Saídas contabilizadas */}
                          {financialReports
                            .filter(
                              (report) =>
                                report.accountFor &&
                                report.typeOfItem === "debt"
                            )
                            .sort((a, b) =>
                              a.description.localeCompare(b.description)
                            )
                            .map((report, index) => (
                              <div
                                key={report.studentId || index}
                                onClick={() =>
                                  handleFinancialReportModal(report)
                                }
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                  alignItems: "left",
                                  padding: "12px",
                                  gap: "12px",
                                  backgroundColor: "#fff",
                                  border: "1px solid #eee",
                                  borderRadius: "4px",
                                  transition: "all 0.2s ease",
                                  cursor: "pointer",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#fef2f2ff";
                                  e.currentTarget.style.borderColor =
                                    "#fecacaff";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#fff";
                                  e.currentTarget.style.borderColor = "#eee";
                                }}
                              >
                                <div
                                  style={{
                                    textAlign: "center",
                                    borderRadius: "12px",
                                    color: report.paidFor
                                      ? "#2e7d32"
                                      : report.paidSoFar && report.paidSoFar > 0
                                      ? "#f59e0b"
                                      : "#c62828",
                                    fontFamily: textGeneralFont(),
                                  }}
                                >
                                  {report.paidFor &&
                                  report.paidSoFar ==
                                    Math.abs(report.amount) -
                                      (report.discount || 0) ? (
                                    <i
                                      className="fa fa-check-circle-o"
                                      style={{ color: "#2e7d32" }}
                                    />
                                  ) : report.paidSoFar &&
                                    report.paidSoFar > 0 &&
                                    report.paidSoFar <
                                      Math.abs(report.amount) -
                                        (report.discount || 0) ? (
                                    <i
                                      className="fa fa-adjust"
                                      style={{ color: "#f59e0b" }}
                                    />
                                  ) : report.paidSoFar &&
                                    report.paidSoFar >
                                      Math.abs(report.amount) -
                                        (report.discount || 0) ? (
                                    <div
                                      style={{
                                        display: "grid",
                                      }}
                                    >
                                      {" "}
                                      <i
                                        className="fa fa-money"
                                        style={{ color: "#dc2626" }}
                                      />
                                      <span
                                        style={{
                                          fontWeight: 800,
                                          fontSize: "10px",
                                          color: "#dc2626",
                                        }}
                                      >
                                        Superado
                                      </span>
                                    </div>
                                  ) : (
                                    <i
                                      className="fa fa-circle-o"
                                      style={{ color: "#c62828" }}
                                    />
                                  )}
                                </div>

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
                                    {truncateString(
                                      report.description,
                                      isMobile ? 25 : 50
                                    )}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "11px",
                                      color: "#6b7280",
                                      fontFamily: textGeneralFont(),
                                    }}
                                  >
                                    {report.discount > 0 &&
                                      `Original: R$ ${formatNumber(
                                        report.amount
                                      )} • Desconto: R$ ${formatNumber(
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
                                      fontSize: "13px",
                                      fontWeight: "600",
                                      color: "#dc2626",
                                      fontFamily: textGeneralFont(),
                                    }}
                                  >
                                    R$ {formatNumber(report.paidSoFar || 0)} /
                                    R${" "}
                                    {formatNumber(
                                      Math.abs(report.amount) -
                                        (report.discount || 0)
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}

                          {/* Saídas não contabilizadas */}
                          {financialReports
                            .filter(
                              (report) =>
                                !report.accountFor &&
                                report.typeOfItem === "debt"
                            )
                            .sort((a, b) =>
                              a.description.localeCompare(b.description)
                            )
                            .map((report, index) => (
                              <div
                                key={`unaccounted-debt-${
                                  report.studentId || index
                                }`}
                                onClick={() =>
                                  handleFinancialReportModal(report)
                                }
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                  alignItems: "left",
                                  padding: "12px",
                                  gap: "12px",
                                  backgroundColor: "#fff",
                                  border: "1px solid #e5e7eb",
                                  borderRadius: "4px",
                                  opacity: 0.7,
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.opacity = "1";
                                  e.currentTarget.style.backgroundColor =
                                    "#fef8f8";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.opacity = "0.7";
                                  e.currentTarget.style.backgroundColor =
                                    "#fff";
                                }}
                              >
                                <div
                                  style={{
                                    textAlign: "center",
                                    borderRadius: "12px",
                                    color: "#9ca3af",
                                    fontFamily: textGeneralFont(),
                                  }}
                                >
                                  <i
                                    className="fa fa-eye-slash"
                                    style={{ color: "#9ca3af" }}
                                  />
                                </div>

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
                                    {truncateString(
                                      report.description,
                                      isMobile ? 25 : 50
                                    )}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "11px",
                                      color: "#9ca3af",
                                      fontFamily: textGeneralFont(),
                                    }}
                                  >
                                    Não contabilizado
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
                                      fontSize: "13px",
                                      fontWeight: "500",
                                      color: "#9ca3af",
                                      fontFamily: textGeneralFont(),
                                    }}
                                  >
                                    R${" "}
                                    {formatNumber(
                                      Math.abs(report.amount) -
                                        (report.discount || 0)
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
                </div>
              )}
            </>
          ) : (
            <CircularProgress style={{ color: primaryColor() }} />
          )}
        </section>
      </div>
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
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
                      {getStudentsWithFees()
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((student, index) => (
                          <div
                            key={student.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              seeEdition(student.id);
                            }}
                            style={{
                              display: "flex",
                              gap: "8px",
                              justifyContent: "space-between",
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
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                flex: 1,
                              }}
                            >
                              <img
                                style={{
                                  width: "24px",
                                  height: "24px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  opacity: student.onHold ? 0.5 : 1,
                                  display: isMobile ? "none" : "block",
                                }}
                                src={
                                  student.picture ||
                                  "https://ik.imagekit.io/vjz75qw96/logos/myp?updatedAt=1752031657485"
                                }
                                alt=""
                              />
                              <div
                                style={{
                                  fontWeight: "500",
                                  fontSize: "12px",
                                  opacity: student.onHold ? 0.6 : 1,
                                  fontFamily: textGeneralFont(),
                                }}
                              >
                                {student.name}{" "}
                                {truncateString(student.lastname, 6)}
                              </div>
                            </div>

                            <div
                              style={{
                                position: "relative",
                                display: "inline-block",
                              }}
                              title={student.onHold ? "Matrícula trancada" : ""}
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
                            </div>
                            {/* <div
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
                            </div> */}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
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
                title="Novo Custo Fixo"
                className="linguee-btn linguee-btn-ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNewCostModal();
                }}
              >
                +
              </button>
            </div>

            {fixedCosts.length > 0 ? (
              <div>
                {fixedCosts
                  .sort((a, b) => a.description.localeCompare(b.description))
                  .map((cost, index) => (
                    <div
                      key={cost.id || index}
                      onClick={(e) => {
                        // e.stopPropagation();
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
              <ArvinButton
                onClick={handleNewCostModal}
                style={{
                  minWidth: "auto",
                  padding: "8px",
                }}
              >
                X
              </ArvinButton>
            </div>
          </DialogTitle>

          <DialogContent style={{ padding: "24px 24px 16px" }}>
            <div className="linguee-form-group">
              <label className="linguee-label">
                Mês:{" "}
                {new Date().toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </label>
            </div>

            <div className="linguee-form-group">
              <label className="linguee-label linguee-label-required">
                Descrição
              </label>
              <input
                type="text"
                className="linguee-input linguee-input-text"
                value={newCostDescription}
                onChange={(e) => setNewCostDescription(e.target.value)}
                placeholder="Ex: Aluguel, Energia, Internet..."
              />
              {checkDuplicateCost() && (
                <div className="linguee-error-text">
                  Já existe um custo com esta descrição
                </div>
              )}
            </div>

            <div className="linguee-form-group">
              <label className="linguee-label linguee-label-required">
                Valor (R$)
              </label>
              <input
                type="number"
                className="linguee-input linguee-input-number"
                value={newCostAmount ? Math.abs(newCostAmount) : ""}
                onChange={(e) => setNewCostAmount(e.target.value)}
                placeholder="0,00"
                min="0"
                step="0.01"
              />
            </div>
          </DialogContent>
          {financialReports.length > 0 && (
            <DialogContent>
              {/* um check que dê um toggle num estado Incluir esse mês entre true ou false */}
              <div
                onClick={() => setIncludeThisMonth(!includeThisMonth)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                className="linguee-form-group"
              >
                <input
                  type="checkbox"
                  className="linguee-input linguee-input-checkbox"
                  checked={includeThisMonth}
                  onChange={() => setIncludeThisMonth(!includeThisMonth)}
                />
                <label>
                  Incluir este mês?{" "}
                  {includeThisMonth && isArthurVincent ? "Sim" : "Não"}
                </label>
              </div>
            </DialogContent>
          )}
          <DialogActions
            style={{
              padding: "16px 24px 24px",
              gap: "12px",
              justifyContent: "flex-end",
            }}
          >
            <button className="linguee-btn" onClick={handleNewCostModal}>
              Cancelar
            </button>
            <button
              className={`linguee-btn ${
                !isSaveButtonDisabled() ? "linguee-btn-primary" : ""
              }`}
              onClick={() => handleSaveCost("debt")}
              disabled={isSaveButtonDisabled()}
              style={{
                backgroundColor: isSaveButtonDisabled() ? "#9ca3af" : undefined,
                cursor: isSaveButtonDisabled() ? "not-allowed" : "pointer",
              }}
            >
              {checkDuplicateCost() ? "Nome já existe" : "Adicionar Custo"}
            </button>
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
              <ArvinButton
                onClick={() => handleCostDetailModal()}
                style={{
                  minWidth: "auto",
                  padding: "8px",
                  color: "#6b7280",
                }}
              >
                X
              </ArvinButton>
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
                <div className="linguee-form-group">
                  <label className="linguee-label">Descrição</label>
                  <input
                    type="text"
                    className="linguee-input linguee-input-text"
                    value={editCostDescription}
                    onChange={(e) => setEditCostDescription(e.target.value)}
                    placeholder="Descrição do custo"
                  />
                </div>
                <div className="linguee-form-group">
                  <label className="linguee-label">Valor (R$)</label>
                  <input
                    type="number"
                    className="linguee-input linguee-input-number"
                    value={
                      editCostAmount && !isNaN(Number(editCostAmount))
                        ? Math.abs(Number(editCostAmount))
                        : ""
                    }
                    onChange={(e) => setEditCostAmount(e.target.value)}
                    placeholder="0,00"
                    min="0"
                    step="0.01"
                  />
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
                  <ArvinButton
                    onClick={() => {
                      setIsEditingCost(true);
                    }}
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      textTransform: "none",
                      padding: "6px 12px",
                    }}
                  >
                    ✏️ Editar
                  </ArvinButton>
                  <ArvinButton
                    onClick={() => setShowDeleteConfirmation(true)}
                    color="grey"
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      textTransform: "none",
                      padding: "6px 12px",
                    }}
                  >
                    🗑️ Excluir
                  </ArvinButton>
                </div>
                <ArvinButton
                  onClick={() => handleCostDetailModal()}
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    textTransform: "none",
                    padding: "6px 12px",
                  }}
                >
                  Fechar
                </ArvinButton>
              </>
            )}

            {isEditingCost && !showDeleteConfirmation && (
              <div style={{ display: "flex", gap: "12px" }}>
                <ArvinButton
                  onClick={() => {
                    setIsEditingCost(false);
                    if (selectedCost) {
                      setEditCostDescription(selectedCost.description);
                      setEditCostAmount(selectedCost.amount);
                    }
                  }}
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    textTransform: "none",
                    padding: "6px 16px",
                    fontFamily: textGeneralFont(),
                  }}
                >
                  Cancelar
                </ArvinButton>
                <ArvinButton
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
                        : primaryColor(),
                  }}
                >
                  Salvar
                </ArvinButton>
              </div>
            )}

            {showDeleteConfirmation && (
              <div style={{ display: "flex", gap: "12px" }}>
                <ArvinButton
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
                </ArvinButton>
                <ArvinButton
                  onClick={() =>
                    selectedCost &&
                    handleDeleteCost(
                      selectedCost.description,
                      selectedCost.amount
                    )
                  }
                  color="red"
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    textTransform: "none",
                    padding: "6px 16px",
                    fontFamily: textGeneralFont(),
                  }}
                >
                  Sim, excluir
                </ArvinButton>
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
              <ArvinButton
                onClick={handleSeeModal}
                style={{ minWidth: "auto", padding: "8px" }}
              >
                X
              </ArvinButton>
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

              <div
                style={{
                  backgroundColor: "#fff3cd",
                  border: "1px solid #ffeaa7",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <div style={{ fontSize: "20px", color: "#d4a574" }}>⚠️</div>
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#856404",
                      marginBottom: "8px",
                      fontFamily: textGeneralFont(),
                    }}
                  >
                    IMPORTANTE: Mudanças nesta sessão não afetam dados já
                    contabilizados este mês.
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#856404",
                      lineHeight: "1.5",
                      fontFamily: textGeneralFont(),
                    }}
                  >
                    • As mudanças <strong>só afetarão</strong> os próximos
                    relatórios financeiros
                    <br />• Para ajustar valores do mês atual, edite diretamente
                    os itens do relatório financeiro de{" "}
                    {transformMonth(selectedMonth)}
                  </div>
                </div>
              </div>

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
                <ArvinButton
                  onClick={() => editStudent(ID)}
                  style={{
                    backgroundColor: partnerColor(),
                    fontWeight: "600",
                  }}
                >
                  💾 Salvar Informações
                </ArvinButton>
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
                <ArvinButton
                  color="red"
                  onClick={() => setSeeConfirmDelete(true)}
                >
                  🗑️ Excluir Aluno
                </ArvinButton>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <ArvinButton onClick={handleSeeModal}>Cancelar</ArvinButton>
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
                  <ArvinButton onClick={() => setSeeConfirmDelete(false)}>
                    Cancelar
                  </ArvinButton>
                  <ArvinButton color="red" onClick={handleDelete}>
                    Confirmar Exclusão
                  </ArvinButton>
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
              <ArvinButton
                onClick={() => handleFinancialReportModal()}
                style={{
                  minWidth: "auto",
                  padding: "8px",
                }}
              >
                x
              </ArvinButton>
            </div>
          </DialogTitle>

          <DialogContent style={{ padding: "24px 24px 16px" }}>
            {selectedFinancialReport && (
              <div>
                <div className="linguee-form-group">
                  <label className="linguee-label linguee-label-required">
                    Descrição
                  </label>
                  <input
                    type="text"
                    className="linguee-input linguee-input-text"
                    value={editReportDescription}
                    onChange={(e) => setEditReportDescription(e.target.value)}
                    placeholder="Descrição do item financeiro"
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <div className="linguee-form-group">
                    <label className="linguee-label linguee-label-required">
                      Valor (R$)
                    </label>
                    <input
                      type="number"
                      className="linguee-input linguee-input-number"
                      value={editReportAmount ? Math.abs(editReportAmount) : ""}
                      onChange={(e) => {
                        setEditReportAmount(e.target.value);
                        if (editReportPaidFor) {
                          const finalAmount =
                            Math.abs(e.target.value) -
                            (parseFloat(editReportDiscount) || 0);
                          setEditReportPaidSoFar(finalAmount);
                        }
                      }}
                      placeholder="0,00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {editReportTypeOfItem !== "debt" && (
                    <div className="linguee-form-group">
                      <label className="linguee-label">Desconto</label>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "8px",
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="radio"
                            value="absolute"
                            checked={editReportDiscountType === "absolute"}
                            onChange={() => {
                              setEditReportDiscountType("absolute");
                              // Manter o valor atual do desconto
                            }}
                          />
                          <span style={{ marginLeft: "5px", fontSize: "14px" }}>
                            R$
                          </span>
                        </label>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="radio"
                            value="percentage"
                            checked={editReportDiscountType === "percentage"}
                            onChange={() => {
                              setEditReportDiscountType("percentage");
                              // Calcular a porcentagem equivalente ao valor absoluto atual
                              const currentDiscount =
                                parseFloat(editReportDiscount) || 0;
                              const amount = parseFloat(editReportAmount) || 0;
                              if (amount > 0) {
                                const percentage =
                                  (currentDiscount / amount) * 100;
                                setEditReportDiscountPercentage(
                                  percentage.toFixed(2)
                                );
                              }
                            }}
                          />
                          <span style={{ marginLeft: "5px", fontSize: "14px" }}>
                            %
                          </span>
                        </label>
                      </div>
                      <input
                        type="number"
                        className="linguee-input linguee-input-number"
                        value={
                          editReportDiscountType === "absolute"
                            ? editReportDiscount
                            : editReportDiscountPercentage
                        }
                        onChange={(e) => {
                          if (editReportDiscountType === "absolute") {
                            setEditReportDiscount(e.target.value);
                          } else {
                            setEditReportDiscountPercentage(e.target.value);
                            // Calcular desconto absoluto baseado na porcentagem
                            const percentage = parseFloat(e.target.value) || 0;
                            const amount = parseFloat(editReportAmount) || 0;
                            const absoluteDiscount =
                              (amount * percentage) / 100;
                            setEditReportDiscount(absoluteDiscount.toString());
                          }

                          // Atualizar paidSoFar se paidFor estiver marcado
                          if (editReportPaidFor) {
                            const finalAmount =
                              Math.abs(editReportAmount) -
                              (parseFloat(editReportDiscount) || 0);
                            setEditReportPaidSoFar(finalAmount);
                          }
                        }}
                        placeholder={
                          editReportDiscountType === "absolute"
                            ? "0,00"
                            : "0,00"
                        }
                        min="0"
                        step={
                          editReportDiscountType === "absolute"
                            ? "0.01"
                            : "0.01"
                        }
                        max={
                          editReportDiscountType === "percentage"
                            ? "100"
                            : undefined
                        }
                      />
                    </div>
                  )}
                </div>

                {/* DIV DO CÁLCULO DO VALOR FINAL */}
                {editReportAmount && (
                  <div
                    style={{
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      borderRadius: "8px",
                      padding: "16px",
                      margin: "16px 0",
                      fontSize: "16px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        marginBottom: "8px",
                        color: "#495057",
                      }}
                    >
                      💰 Cálculo do Valor Final:
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      <div style={{ color: "#28a745" }}>
                        Valor Total: R${" "}
                        {Math.abs(parseFloat(editReportAmount) || 0)
                          .toFixed(2)
                          .replace(".", ",")}
                      </div>
                      <div style={{ color: "#dc3545" }}>
                        Desconto: R${" "}
                        {(parseFloat(editReportDiscount) || 0)
                          .toFixed(2)
                          .replace(".", ",")}
                        {editReportDiscountType === "percentage" &&
                          editReportDiscountPercentage &&
                          ` (${editReportDiscountPercentage}%)`}
                      </div>
                      <hr style={{ margin: "8px 0", borderColor: "#dee2e6" }} />
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "18px",
                          color: "#007bff",
                        }}
                      >
                        Valor Líquido: R${" "}
                        {(
                          Math.abs(parseFloat(editReportAmount) || 0) -
                          (parseFloat(editReportDiscount) || 0)
                        )
                          .toFixed(2)
                          .replace(".", ",")}
                      </div>
                    </div>
                  </div>
                )}

                <div className="linguee-form-group">
                  <label className="linguee-label">Pago até aqui</label>
                  <input
                    type="number"
                    className="linguee-input linguee-input-number"
                    value={editReportPaidSoFar}
                    onChange={(e) => {
                      setEditReportPaidSoFar(e.target.value);
                      const finalAmount =
                        Math.abs(editReportAmount) -
                        (parseFloat(editReportDiscount) || 0);
                      if (e.target.value >= finalAmount) {
                        setEditReportPaidFor(true);
                      } else if (e.target.value < finalAmount) {
                        setEditReportPaidFor(false);
                      }
                    }}
                    placeholder="0,00"
                    min="0"
                    step="0.01"
                  />
                </div>
                {editReportTypeOfItem !== "debt" && (
                  <div className="linguee-form-group">
                    <label className="linguee-label">Tipo de Item</label>
                    <select
                      className="linguee-select"
                      value={editReportTypeOfItem}
                      onChange={(e) => setEditReportTypeOfItem(e.target.value)}
                    >
                      <option value="fee">Mensalidade</option>
                      <option value="others">Outro</option>
                    </select>
                  </div>
                )}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: editReportAccountFor
                      ? "1fr 1fr"
                      : "1fr",
                    gap: "16px",
                  }}
                >
                  <div className="linguee-form-group">
                    <label className="linguee-checkbox-item">
                      <div className="linguee-toggle">
                        <input
                          type="checkbox"
                          checked={editReportAccountFor}
                          onChange={(e) => {
                            setEditReportAccountFor(e.target.checked);
                            // Se desmarcar "Contabilizar", desmarcar "Quitado"
                            if (!e.target.checked) {
                              setEditReportPaidFor(false);
                            }
                          }}
                        />
                        <div className="linguee-toggle-slider"></div>
                      </div>
                      <span className="linguee-checkbox-label">
                        Contabilizar
                      </span>
                    </label>
                  </div>

                  {/* Só mostra o toggle "Quitado" se "Contabilizar" estiver marcado */}
                  {editReportAccountFor && (
                    <div className="linguee-form-group">
                      <label className="linguee-checkbox-item">
                        <div className="linguee-toggle">
                          <input
                            type="checkbox"
                            checked={editReportPaidFor}
                            onChange={(e) => {
                              setEditReportPaidFor(e.target.checked);
                              if (e.target.checked) {
                                const finalAmount =
                                  Math.abs(editReportAmount) -
                                  (parseFloat(editReportDiscount) || 0);
                                setEditReportPaidSoFar(finalAmount);
                              }
                            }}
                          />
                          <div className="linguee-toggle-slider"></div>
                        </div>
                        <span className="linguee-checkbox-label">Quitado</span>
                      </label>
                    </div>
                  )}
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
            <button
              className="linguee-btn"
              onClick={() => handleFinancialReportModal()}
            >
              Cancelar
            </button>
            <button
              className={`linguee-btn ${
                !editReportDescription.trim() || !editReportAmount
                  ? ""
                  : "linguee-btn-primary"
              }`}
              onClick={handleSaveFinancialReport}
              disabled={!editReportDescription.trim() || !editReportAmount}
              style={{
                backgroundColor:
                  !editReportDescription.trim() || !editReportAmount
                    ? "#9ca3af"
                    : undefined,
                cursor:
                  !editReportDescription.trim() || !editReportAmount
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              Salvar
            </button>
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
                Novo Item Financeiro: {transformMonth(selectedMonth)}
              </h2>
              <ArvinButton
                onClick={handleNewItemModal}
                style={{
                  minWidth: "auto",
                  padding: "8px",
                }}
              >
                x{" "}
              </ArvinButton>
            </div>
          </DialogTitle>

          <DialogContent style={{ padding: "24px 24px 16px" }}>
            <div className="linguee-form-group">
              <label className="linguee-label linguee-label-required">
                Descrição
              </label>
              <input
                type="text"
                className="linguee-input linguee-input-text"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder="Ex: Venda de curso, Aluguel..."
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div className="linguee-form-group">
                <label className="linguee-label linguee-label-required">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  className="linguee-input linguee-input-number"
                  value={newItemAmount ? Math.abs(newItemAmount) : ""}
                  onChange={(e) => setNewItemAmount(e.target.value)}
                  placeholder="0,00"
                  min="0"
                  step="0.01"
                />
              </div>

              {newItemTypeOfItem !== "debt" && (
                <div className="linguee-form-group">
                  <label className="linguee-label">Desconto</label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "8px",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        value="absolute"
                        checked={newItemDiscountType === "absolute"}
                        onChange={() => {
                          setNewItemDiscountType("absolute");
                          // Manter o valor atual do desconto
                        }}
                      />
                      <span style={{ marginLeft: "5px", fontSize: "14px" }}>
                        R$
                      </span>
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        value="percentage"
                        checked={newItemDiscountType === "percentage"}
                        onChange={() => {
                          setNewItemDiscountType("percentage");
                          // Calcular a porcentagem equivalente ao valor absoluto atual
                          const currentDiscount =
                            parseFloat(newItemDiscount) || 0;
                          const amount = parseFloat(newItemAmount) || 0;
                          if (amount > 0) {
                            const percentage = (currentDiscount / amount) * 100;
                            setNewItemDiscountPercentage(percentage.toFixed(2));
                          }
                        }}
                      />
                      <span style={{ marginLeft: "5px", fontSize: "14px" }}>
                        %
                      </span>
                    </label>
                  </div>
                  <input
                    type="number"
                    className="linguee-input linguee-input-number"
                    value={
                      newItemDiscountType === "absolute"
                        ? newItemDiscount
                        : newItemDiscountPercentage
                    }
                    onChange={(e) => {
                      if (newItemDiscountType === "absolute") {
                        setNewItemDiscount(e.target.value);
                      } else {
                        setNewItemDiscountPercentage(e.target.value);
                        // Calcular desconto absoluto baseado na porcentagem
                        const percentage = parseFloat(e.target.value) || 0;
                        const amount = parseFloat(newItemAmount) || 0;
                        const absoluteDiscount = (amount * percentage) / 100;
                        setNewItemDiscount(absoluteDiscount.toString());
                      }
                    }}
                    placeholder={
                      newItemDiscountType === "absolute" ? "0,00" : "0,00"
                    }
                    min="0"
                    step={newItemDiscountType === "absolute" ? "0.01" : "0.01"}
                    max={
                      newItemDiscountType === "percentage" ? "100" : undefined
                    }
                  />
                </div>
              )}
            </div>

            {/* DIV DO CÁLCULO DO VALOR FINAL - NOVO ITEM */}
            {newItemAmount && (
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #e9ecef",
                  borderRadius: "8px",
                  padding: "16px",
                  margin: "16px 0",
                  fontSize: "16px",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "8px",
                    color: "#495057",
                  }}
                >
                  💰 Cálculo do Valor Final:
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      color:
                        newItemTypeOfItem === "debt" ? "#dc3545" : "#28a745",
                    }}
                  >
                    Valor Total: R${" "}
                    {Math.abs(parseFloat(newItemAmount) || 0)
                      .toFixed(2)
                      .replace(".", ",")}
                  </div>
                  {newItemTypeOfItem !== "debt" && (
                    <div style={{ color: "#dc3545" }}>
                      Desconto: R${" "}
                      {(parseFloat(newItemDiscount) || 0)
                        .toFixed(2)
                        .replace(".", ",")}
                      {newItemDiscountType === "percentage" &&
                        newItemDiscountPercentage &&
                        ` (${newItemDiscountPercentage}%)`}
                    </div>
                  )}
                  <hr style={{ margin: "8px 0", borderColor: "#dee2e6" }} />
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      color:
                        newItemTypeOfItem === "debt" ? "#dc3545" : "#007bff",
                    }}
                  >
                    Valor{" "}
                    {newItemTypeOfItem === "debt" ? "de Saída" : "Líquido"}: R${" "}
                    {newItemTypeOfItem === "debt"
                      ? Math.abs(parseFloat(newItemAmount) || 0)
                          .toFixed(2)
                          .replace(".", ",")
                      : (
                          Math.abs(parseFloat(newItemAmount) || 0) -
                          (parseFloat(newItemDiscount) || 0)
                        )
                          .toFixed(2)
                          .replace(".", ",")}
                  </div>
                </div>
              </div>
            )}

            <div className="linguee-form-group">
              <label className="linguee-label">Tipo de Item</label>
              <select
                className="linguee-select"
                value={newItemTypeOfItem}
                onChange={(e) => setNewItemTypeOfItem(e.target.value)}
              >
                <option value="others">Entrada</option>
                <option value="debt">Saída</option>
              </select>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: newItemAccountFor ? "1fr 1fr" : "1fr",
                gap: "16px",
              }}
            >
              <div className="linguee-form-group">
                <label className="linguee-checkbox-item">
                  <div className="linguee-toggle">
                    <input
                      type="checkbox"
                      checked={newItemAccountFor}
                      onChange={(e) => {
                        setNewItemAccountFor(e.target.checked);
                        // Se desmarcar "Contabilizar", desmarcar "Quitado"
                        if (!e.target.checked) {
                          setNewItemPaidFor(false);
                        }
                      }}
                    />
                    <div className="linguee-toggle-slider"></div>
                  </div>
                  <span className="linguee-checkbox-label">Contabilizar</span>
                </label>
              </div>

              {/* Só mostra o toggle "Quitado" se "Contabilizar" estiver marcado */}
              {newItemAccountFor && (
                <div className="linguee-form-group">
                  <label className="linguee-checkbox-item">
                    <div className="linguee-toggle">
                      <input
                        type="checkbox"
                        checked={newItemPaidFor}
                        onChange={(e) => setNewItemPaidFor(e.target.checked)}
                      />
                      <div className="linguee-toggle-slider"></div>
                    </div>
                    <span className="linguee-checkbox-label">Quitado</span>
                  </label>
                </div>
              )}
            </div>
          </DialogContent>

          <DialogActions
            style={{
              padding: "16px 24px 24px",
              gap: "12px",
              justifyContent: "flex-end",
            }}
          >
            <button
              className="linguee-btn linguee-btn-ghost"
              onClick={handleNewItemModal}
            >
              Cancelar
            </button>
            <button
              className="linguee-btn linguee-btn-primary"
              onClick={newStandaloneItem}
              disabled={!newItemDescription.trim() || !newItemAmount}
              style={{
                backgroundColor:
                  !newItemDescription.trim() || !newItemAmount
                    ? "#9ca3af"
                    : newItemTypeOfItem === "debt"
                    ? "#dc2626"
                    : "#16a34a",
                cursor:
                  !newItemDescription.trim() || !newItemAmount
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {newItemTypeOfItem === "debt"
                ? "💸 Criar Saída"
                : "💰 Criar Entrada"}
            </button>
          </DialogActions>
        </Dialog>
      </section>
    </div>
  );
}

export default FinancialResources;
