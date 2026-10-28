import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";
// import { BrowserRouter as Router } from 'react-router-dom';
import "../styles/AdminDashboard.css";
import avatarImage from "../assets/avtar.png";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useReactToPrint } from "react-to-print";
import logo from "../assets/logo1.png";
import adani from "../assets/adani-img.jpg";
import solar from "../assets/solar-img.jpeg";
import solarhand from "../assets/solarhand.png";
import solarpanel from "../assets/solarpanels.jpg";
import community from "../assets/community.jpg";
import { useNavigate } from "react-router-dom";
import APIEndpoints from "./endPoints.jsx";
import barcode from "../assets/invoice/barcode.png";
import signature from "../assets/invoice/signature.png";
import paymenticons from "../assets/invoice/paymenticons.png";
import { Buffer } from "buffer";
import html2pdf from "html2pdf.js";
import AllTickets from "./AllTickets.jsx";
import Loader from "./Loader.jsx";

const LoadingButton = ({ isLoading, children, ...props }) => (
  <button {...props} disabled={isLoading}>
    {isLoading ? (
      <span className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" style={{ borderColor: '#22c55e', borderTopColor: 'transparent' }}></div>
        Loading...
      </span>
    ) : (
      children
    )}
  </button>
);

const AdminDashboard = ({ handleMenuClick }) => {     
  const Endpoints = new APIEndpoints();
  const [activeSection, setActiveSection] = useState("HR");
  const [message, setMessage] = useState("");
  const [selectedInvoiceType, setSelectedInvoiceType] = useState("all");
  const [selectedQuotationType, setSelectedQuotationType] = useState("all");
  const [announcements, setAnnouncements] = useState([]);
  const [partyAddress, setPartyAddress] = useState("");
  const [partyMobile, setPartyMobile] = useState("");
  const [partyAddress2, setPartyAddress2] = useState("");
  const [partyAddress2Line2, setPartyAddress2Line2] = useState("");
  const [partyAddress2Line3, setPartyAddress2Line3] = useState("");
  const [partyAddress3, setPartyAddress3] = useState("");
  const [partyMobile2, setPartyMobile2] = useState("");
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  const [logobase64, setLogobase64] = useState("");
  const [adanibase64, setAdanibase64] = useState("");
  const [communitybase64, setCommunitybase64] = useState("");
  const [solarbase64, setSolarbase64] = useState("");
  const [solarhandbase64, setSolarhandbase64] = useState("");
  const [solarpanelbase64, setSolarpanelbase64] = useState("");
  const [signaturebase64, setSignaturebase64] = useState("");
  const [barcodebase64, setBarcodebase64] = useState("");
  const [paymentbase64, setPaymentbase64] = useState("");
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("Overview");
  const [allInvoices, setAllInvoices] = useState([]);
  const [allQuotations, setAllQuotations] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [topMenuOpen, setTopMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoading, setIsLoading] = useState(false);
  const [partyName, setPartyName] = useState("");
  const [issueDate, setIssueDate] = useState(formatDate(new Date()));
  const [partyName2, setPartyName2] = useState("");
  const [issueDate2, setIssueDate2] = useState(formatDate(new Date()));
  const [issueDate3, setIssueDate3] = useState(formatDate(new Date()));
  const [issueDate4, setIssueDate4] = useState(formatDate(new Date()));
  const [issueDate5, setIssueDate5] = useState(formatDate(new Date()));

  const [employeecount, setEmployeecount] = useState(0);
  const [internCount, setInternCount] = useState(0);
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const currentDate = new Date(Date.now);
  const [successMessageTax, setSuccessMessageTax] = useState("");
  const [errorMessageTax, setErrorMessageTax] = useState("");
  const [successMessageNoTax, setSuccessMessageNoTax] = useState("");
  const [errorMessageNoTax, setErrorMessageNoTax] = useState("");
  const [successMessageTaxQuote, setSuccessMessageTaxQuote] = useState("");
  const [errorMessageTaxQuote, setErrorMessageTaxQuote] = useState("");
  const [successMessageNoTaxQuote, setSuccessMessageNoTaxQuote] = useState("");
  const [errorMessageNoTaxQuote, setErrorMessageNoTaxQuote] = useState("");
  const [successMessageSolarTax, setSuccessMessageSolarTax] = useState("");
  const [errorMessageSolarTax, setErrorMessageSolarTax] = useState("");
  const [partyNameTaxQuote, setPartyNameTaxQuote] = useState("");
  const [partyNameNoTaxQuote, setPartyNameNoTaxQuote] = useState("");
  const [partyNameSolarQuote, setPartyNameSolarQuote] = useState("");

  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const [editingAnnouncementText, setEditingAnnouncementText] = useState("");

  // for solar quotation
  const thStyle = {
    padding: "10px",
    border: "1px solid #000",
    backgroundColor: "#FFA500",
    color: "#fff",
    textAlign: "left",
    fontSize: "14px",
  };

  const tdStyle = {
    padding: "10px",
    border: "1px solid #000",
    fontSize: "14px",
  };

  const tdBlueStyle = {
    ...tdStyle,
    backgroundColor: "#c6dafc",
    color: "#2c72d9",
    fontWeight: "bold",
  };
  const HeaderRow = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #000",
        paddingBottom: "10px",
        marginBottom: "20px",
      }}
    >
      <div style={{ flex: 1, textAlign: "left" }}>
        <a
          href="https://www.techkisan.in"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "blue" }}
        >
          www.techkisan.in
        </a>
      </div>
      <div style={{ flex: 1, textAlign: "center" }}>
        <img
          src={logobase64}
          alt="Company Logo"
          style={{
            paddingRight: "1%",
            width: "200px",
            height: "50px",
          }}
        />
      </div>
      <div style={{ flex: 1, textAlign: "right" }}>
        <img
          src={adanibase64}
          alt="Adani Solar"
          style={{ height: "50px", width: "100px", marginLeft: "140px" }}
        />
      </div>
    </div>
  );
  // ===============================================================
  //-------------------------------------start-invoice setup---------------------------------------------//

  const componentRef = useRef();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceNumberQuote, setInvoiceNumberQuote] = useState("");
  const [taxQuotationNumber, setTaxQuotationNumber] = useState("");
  const [notaxQuotationNumber, setNotaxQuotationNumber] = useState("");
  const [taxInvoiceNumber, setTaxInvoiceNumber] = useState("");

  const [taxInvoiceNumberQuote, setTaxInvoiceNumberQuote] = useState("");
  const [solarInvoiceNumber, setSolarInvoiceNumber] = useState("");
  const [partyName3, setPartyName3] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isSavedTax, setIsSavedTax] = useState(false);
  const [isSavedQuote, setIsSavedQuote] = useState(false);
  const [isSavedTaxQuote, setIsSavedTaxQuote] = useState(false);
  const [isSavedSolar, setIsSavedSolar] = useState(false);
  const [taxType, setTaxType] = useState("GST_18");
  const [taxTypeQuote, setTaxTypeQuote] = useState("GST_18");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdownQuote, setShowDropdownQuote] = useState(false);
  const [noTaxRows, setNoTaxRows] = useState(
    Array(4).fill({ desc: "", hsn: "", qty: "", rate: "", amount: "" })
  );
  const [taxRows, setTaxRows] = useState(
    Array(3).fill({ desc: "", hsn: "", qty: "", rate: "", amount: "" })
  );
  const [taxQuoteRows, setTaxQuoteRows] = useState(
    Array(3).fill({ desc: "", hsn: "", qty: "", rate: "", amount: "" })
  );
  const [noTaxQuoteRows, setNoTaxQuoteRows] = useState(
    Array(4).fill({ desc: "", hsn: "", qty: "", rate: "", amount: "" })
  );

const taxQuoteDescSelector = (index) =>
  `textarea[data-taxquote-index="${index}"]`;

  const taxQuoteRateSelector = (index) =>
    `input[data-taxquote-rate-index="${index}"]`;

  const noTaxQuoteDescSelector = (index) =>
    `textarea[data-notaxquote-index="${index}"]`;

  const noTaxQuoteRateSelector = (index) =>
    `input[data-notaxquote-rate-index="${index}"]`;

  const taxDescSelector = (index) => `textarea[data-tax-index="${index}"]`;

  const taxRateSelector = (index) => `input[data-tax-rate-index="${index}"]`;

  const noTaxDescSelector = (index) => `textarea[data-notax-index="${index}"]`;

  const noTaxRateSelector = (index) =>
    `input[data-notax-rate-index="${index}"]`;

  const handleDeleteInvoives = async (Invoice_id) => {
    try {
      await axios.delete(`${Endpoints.ADMIN_DELETE_INVOICE}/${Invoice_id}`);
      setAllInvoices(
        allInvoices.filter((invoice) => invoice._id !== Invoice_id)
      );
    } catch (error) {
      console.error("Error deleting Invoice:", error.message);
    }
  };

  // converting image to base 64

  const getImageAsBase64 = async (imagePath) => {
    const response = await fetch(imagePath); // e.g., "/logo.png"
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // base64 string
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Handle changes in the No-Tax Invoice Table
  const handleNoTaxChange = (index, field, value) => {
    const updatedRows = [...noTaxRows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };

    const qty = parseFloat(updatedRows[index].qty);
    const rate = parseFloat(updatedRows[index].rate);

    updatedRows[index].amount = !qty || !rate ? "" : (qty * rate).toFixed(2);

    setNoTaxRows(updatedRows);
  };

  // Handle changes in the Tax Invoice Table
  const handleTaxChange = (index, field, value) => {
    const updatedRows = [...taxRows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };

    const qty = parseFloat(updatedRows[index].qty);
    const rate = parseFloat(updatedRows[index].rate);

    updatedRows[index].amount = !qty || !rate ? "" : (qty * rate).toFixed(2);

    setTaxRows(updatedRows);
  };

  // Handle changes in the No-Tax Quote Invoice Table
  const handleNoTaxQuoteChange = (index, field, value) => {
    const updatedRows = [...noTaxQuoteRows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };

    const qty = parseFloat(updatedRows[index].qty);
    const rate = parseFloat(updatedRows[index].rate);

    updatedRows[index].amount = !qty || !rate ? "" : (qty * rate).toFixed(2);

    setNoTaxQuoteRows(updatedRows);
  };

  // Handle changes in the Tax Quote Invoice Table
  const handleTaxQuoteChange = (index, field, value) => {
    const updatedRows = [...taxQuoteRows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };

    const qty = parseFloat(updatedRows[index].qty);
    const rate = parseFloat(updatedRows[index].rate);

    updatedRows[index].amount = !qty || !rate ? "" : (qty * rate).toFixed(2);

    setTaxQuoteRows(updatedRows);
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const logoBase64 = await getImageAsBase64(logo);
        setLogobase64(logoBase64);
        const adaniBase64 = await getImageAsBase64(adani);
        setAdanibase64(adaniBase64);
        const communityBase64 = await getImageAsBase64(community);
        setCommunitybase64(communityBase64);
        const solarBase64 = await getImageAsBase64(solar);
        setSolarbase64(solarBase64);
        const solarhandBase64 = await getImageAsBase64(solarhand);
        setSolarhandbase64(solarhandBase64);
        const solarpanelBase64 = await getImageAsBase64(solarpanel);
        setSolarpanelbase64(solarpanelBase64);
        const signatureBase64 = await getImageAsBase64(signature);
        setSignaturebase64(signatureBase64);
        const barcodeBase64 = await getImageAsBase64(barcode);
        setBarcodebase64(barcodeBase64);
        const paymentBase64 = await getImageAsBase64(paymenticons);
        setPaymentbase64(paymentBase64);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
    fetchImage();
  }, []);
  useEffect(() => {
    const fetchAllIvoices = async () => {
      try {
        const response = await axios.get(Endpoints.ADMIN_FETCH_ALL_INVOICES);
        setAllInvoices(response.data);
      } catch (error) {
        console.error("Error fetching all invoices:", error);
      }
    };
    const fetchInvoiceNumber = async () => {
      try {
        const response = await axios.get(
          Endpoints.ADMIN_FETCH_LATEST_NOTAXINVOICE_ID
        );
        console.log(response.data.invoiceNumber);
        setInvoiceNumber(response.data.invoiceNumber || "TKN-INV-00");
      } catch (error) {
        console.error("Error fetching invoice number:", error);
      }
    };
    const fetchTaxInvoiceNumber = async () => {
      try {
        const response = await axios.get(
          Endpoints.ADMIN_FETCH_LATEST_TAXINVOICE_ID
        );
        setTaxInvoiceNumber(response.data.invoiceNumber || "TKN-TI-00");
      } catch (error) {
        console.error("Error fetching tax invoice number:", error);
      }
    };
    const fetchSolarInvoiceNumber = async () => {
      try {
        const response = await axios.get(
          Endpoints.ADMIN_FETCH_LATEST_SOLARINVOICE_ID
        );
        setSolarInvoiceNumber(response.data.invoiceNumber || "TKN-S-00");
      } catch (error) {
        console.error("Error fetching tax invoice number:", error);
      }
    };
    fetchAllIvoices();
    fetchInvoiceNumber();
    fetchTaxInvoiceNumber();
    fetchSolarInvoiceNumber();
    fetchTaxQuotaionNumber();
    fetchNoTaxQuotationNumber();
  }, []);
  const fetchTaxQuotaionNumber = async () => {
    try {
      const response = await axios.get(
        Endpoints.ADMIN_FETCH_LATEST_TAXQUOTATION_ID
      );
      setTaxQuotationNumber(response.data.quotationNumber || "TKN-TQ-01");
    } catch (error) {
      console.error("Error fetching tax invoice number:", error);
    }
  };
  const fetchNoTaxQuotationNumber = async () => {
    try {
      const response = await axios.get(
        Endpoints.ADMIN_FETCH_LATEST_NOTAXQUOTATION_ID
      );
      setNotaxQuotationNumber(response.data.quotationNumber || "TKN-NTQ-01");
    } catch (error) {
      console.error("Error fetching tax invoice number:", error);
    }
  };

  const handleKeyPress = ({
    index,
    field,
    event,
    rows,
    setRows,
    rowSelector,
  }) => {
    if (event.key === "Enter" && field === "rate") {
      event.preventDefault();

      setRows((prev) => {
        const newRows = [
          ...prev,
          { desc: "", hsn: "", qty: "", rate: "", amount: "" },
        ];

        setTimeout(() => {
          requestAnimationFrame(() => {
            const nextInput = document.querySelector(rowSelector(index + 1));
            if (nextInput) nextInput.focus();
          });
        }, 50);

        return newRows;
      });
    }

    if (event.key === "Backspace" && field === "desc" && index !== 0) {
      if (
        !rows[index].desc &&
        !rows[index].hsn &&
        !rows[index].qty &&
        !rows[index].rate
      ) {
        setRows((prev) => {
          const updatedRows = prev.filter((_, i) => i !== index);

          setTimeout(() => {
            const prevInput = document.querySelector(rowSelector(index - 1));
            if (prevInput) prevInput.focus();
          }, 100);

          return updatedRows;
        });
      }
    }
  };

  const numberToWords = (num) => {
    if (num === undefined || num === null || isNaN(num)) return "Zero";

    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const convertToWords = (n) => {
      if (n === 0) return "Zero";
      if (n < 20) return a[n];
      if (n < 100)
        return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
      if (n < 1000)
        return (
          a[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 ? " " + convertToWords(n % 100) : "")
        );
      if (n < 100000)
        return (
          convertToWords(Math.floor(n / 1000)) +
          " Thousand" +
          (n % 1000 ? " " + convertToWords(n % 1000) : "")
        );
      if (n < 10000000)
        return (
          convertToWords(Math.floor(n / 100000)) +
          " Lakh" +
          (n % 100000 ? " " + convertToWords(n % 100000) : "")
        );
      return (
        convertToWords(Math.floor(n / 10000000)) +
        " Crore" +
        (n % 10000000 ? " " + convertToWords(n % 10000000) : "")
      );
    };

    return convertToWords(Math.floor(num)).trim();
  };

  const noTaxTotalAmount = noTaxRows.reduce(
    (sum, row) => sum + parseFloat(row.amount || 0),
    0
  );

  const taxTotalAmount = taxRows.reduce(
    (sum, row) => sum + parseFloat(row.amount || 0),
    0
  );
  //tax invoice
  const taxOptions = {
  GST_12: { label: "GST @12%", totalRate: 0.12 },
  GST_18: { label: "GST @18%", totalRate: 0.18, },
  GST_28: { label: "GST @28%", totalRate: 0.28, },
  IGST_12: { label: "IGST @12%", totalRate: 0.12, cgst: 0.06, sgst: 0.06 },
  IGST_18: { label: "IGST @18%", totalRate: 0.18, cgst: 0.09, sgst: 0.09 },
  IGST_28: { label: "IGST @28%", totalRate: 0.28, cgst: 0.14, sgst: 0.14 },
};
  //------Tax--------//
const selectedTax = taxOptions[taxType];
const gstAmount = taxTotalAmount * selectedTax.totalRate;
const cgstSgstAmount = selectedTax.cgst
  ? taxTotalAmount * selectedTax.cgst
  : 0;
const taxRoundedTotal = Math.floor(taxTotalAmount + gstAmount);
const taxRoundOff = taxRoundedTotal - (taxTotalAmount + gstAmount);
const taxTotalInWords = numberToWords(taxRoundedTotal);

  //------NoTax--------//
  const noTaxFinalTotal = Math.floor(noTaxTotalAmount);
  const noTaxRoundOff = noTaxFinalTotal - noTaxTotalAmount;
  const noTaxTotalInWords = numberToWords(noTaxFinalTotal);

  const noTaxTotalAmountQuote = noTaxQuoteRows.reduce(
    (sum, row) => sum + parseFloat(row.amount || 0),
    0
  );

  const taxTotalAmountQuote = taxQuoteRows.reduce(
    (sum, row) => sum + parseFloat(row.amount || 0),
    0
  );
//solar invoice hooks ==========================================
const [handhoverDate, setHandhoverDate] = useState("");
const [quoteName, setQuoteName] = useState("");
const [quoteAddress, setQuoteAddress] = useState("");
const [quotegstin, setQuoteGstin] = useState("");
const [quotesCode, setQuoteCode] = useState("");
const [shipName, setShipName] = useState("");
const [shipAddress, setShipAddress] = useState("");
const [shipGstin, setShipGstin] = useState("");
const [shipCode, setShipCode] = useState("");
const [vehicleNo, setVehicleNo] = useState("");
const [dateofvisit, setDateofvisit] = useState("");
const [placeofSupply, setPlaceofSupply] = useState("");
const [code, setCode] = useState("");
const [inverterSNo, setInverterSNo] = useState("");

const [panelCells, setPanelCells] = useState(["", "", "", "", "", ""]);
const panelInputRefs = useRef([]);

const handlePanelChange = (e, index) => {
  const updated = [...panelCells];
  updated[index] = e.target.value;
  setPanelCells(updated);
};

const handlePanelKeyDown = (e, index) => {
  const isLast = index === panelCells.length - 1;
  const isEmpty = panelCells[index] === "";

  if (e.key === "Enter") {
    e.preventDefault();
    if (isLast) {
      setPanelCells((prev) => [...prev, ""]);
      setTimeout(() => {
        panelInputRefs.current[index + 1]?.focus();
      }, 0);
    } else {
      panelInputRefs.current[index + 1]?.focus();
    }
  }

  if (e.key === "Backspace" && isEmpty) {
    if (panelCells.length > 1) {
      e.preventDefault();
      const updated = [...panelCells];
      updated.splice(index, 1);
      setPanelCells(updated);
      setTimeout(() => {
        panelInputRefs.current[index - 1]?.focus();
      }, 0);
    }
  }
};

// ==========================================

const [taxGSTIN, setTaxGSTIN] = useState("");
// ===================notax inovices hooks===============
const [notaxaddress1, setNotaxaddress1] = useState("");
const [notaxaddress2, setNotaxaddress2] = useState("");
const [notaxaddress3, setNotaxaddress3] = useState("");
const [notaxmobile, setNotaxmobile] = useState("");
const [partyName002, setPartyName002] = useState("");
// ==============================================================
// ===================notax quotation hooks===============
 const [notaxQuotAddress1, setNotaxQuotAddress1] = useState("");
 const [notaxQuotAddress2, setNotaxQuotAddress2] = useState("");
 const [notaxQuotAddress3, setNotaxQuotAddress3] = useState("");
 const [notaxQuotMobile, setNotaxQuotMobile] = useState("");
 const [partyNameNoTaxQuote2, setPartyNameNoTaxQuote2] = useState("");
// ==============================================================

// ===================tax quotation hooks===============
const [taxQuotAddress1, setTaxQuotAddress1] = useState("");
const [taxQuotAddress2, setTaxQuotAddress2] = useState("");
const [taxQuotAddress3, setTaxQuotAddress3] = useState("");
const [taxQuotMobile, setTaxQuotMobile] = useState("");
const [partyNameTaxQuote2, setPartyNameTaxQuote2] = useState("");
const [taxQuotGSTNo, setTaxQuotGSTNo] = useState("");
// ==============================================================
const [partyName02, setPartyName02] = useState("");

//tax quote gst cal
const taxOptionsQuote = {
  GST_12: { label: "GST @12%", totalRate: 0.12 },
  GST_18: { label: "GST @18%", totalRate: 0.18 },
  GST_28: { label: "GST @28%", totalRate: 0.28 },
  IGST_12: { label: "IGST @12%", totalRate: 0.12 },
  IGST_18: { label: "IGST @18%", totalRate: 0.18 },
  IGST_28: { label: "IGST @28%", totalRate: 0.28 },
};
  //------Tax Quote--------//
  const selectedTaxQuote = taxOptionsQuote[taxTypeQuote] || { totalRate: 0 };

const gstAmountQuote = taxTotalAmountQuote * selectedTaxQuote.totalRate;
const taxRoundedTotalQuote = Math.floor(taxTotalAmountQuote + gstAmountQuote);
const taxRoundOffQuote = taxRoundedTotalQuote - (taxTotalAmountQuote + gstAmountQuote);
const taxTotalInWordsQuote = numberToWords(taxRoundedTotalQuote);
  //------NoTax Quote--------//
  const noTaxFinalTotalQuote = Math.floor(noTaxTotalAmountQuote);
  const noTaxRoundOffQuote = noTaxFinalTotalQuote - noTaxTotalAmountQuote;
  const noTaxTotalInWordsQuote = numberToWords(noTaxFinalTotalQuote);
  //---------------------------------------end-invoice setup----------------------------------------------//

  const handleItemClick = (item) => {
    setActiveItem(item); // Set active page
    setIsMenuOpen(false); // Close menu on mobile after click
  };

  const sections = [
    "HR",
    "Sales/Purchase",
    "Accounting",
    "Company",
    "Tools",
    "Modules",
    "Add-Ons",
    "Setting",
    "Logout",
  ];
  const hrLinks = [
    "Overview",
    "Employees",
    "Departments",
    "Designation",
    "Announcement",
    "Reports",
    "Ticket",
    "Help",
  ];
  const handlePost = async () => {
    if (!message.trim()) return alert("Please write an announcement!");
    try {
      await axios.post(Endpoints.ADMIN_ADD_ANNOUNCEMENT, { message });
      setMessage(""); // Clear input after posting
      setAnnouncements([
        ...announcements,
        { message, date: formatDate(new Date.now()) },
      ]);
    } catch (error) {
      console.error("Error posting announcement:", error);
    }
  };

  // handle delete for employee page
  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`${Endpoints.ADMIN_DELETE_EMPLOYEE}/${id}`);

      // Update the state after successful deletion
      setEmployees(employees.filter((employee) => employee._id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  // Handle delete for announcement page
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${Endpoints.ADMIN_DELETE_ANNOUNCEMENT}/${id}`);
      setAnnouncements(
        announcements.filter((announcement) => announcement._id !== id)
      );
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };
  const handleEdit = async (id) => {
    try {
      const response = await axios.put(`${Endpoints.ADMIN_UPDATE_ANNOUNCEMENT}/${id}`, {
        Announcement: editingAnnouncementText
      });
      if (response.status === 200) {
        setAnnouncements(announcements.map((announcement) =>
          announcement._id === id
            ? { ...announcement, Announcement: editingAnnouncementText }
            : announcement
        ));
        setEditingAnnouncementId(null);
        setEditingAnnouncementText("");
      }
    } catch (error) {
      console.error("Error editing announcement:", error);
    }
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setActivePage("");
    setTopMenuOpen(isMobile && section === "HR" ? false : true);
    setMenuOpen(false);
  };

  const handleLinkClick = (link) => {
    setActivePage(link);
    setTopMenuOpen(false);
  };
  const handlelogout = () => {
    localStorage.removeItem("token");
    navigate("/admin-login");
  };
  //---------------------------------------------------------------------------------------------//

  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted components

    // ✅ Move async function inside useEffect
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/admin-login");
          return;
        }

        const decode = jwtDecode(token);
        if (decode.role !== "admin") {
          navigate("/admin-login");
          return;
        }

        // Fetch data only if component is mounted
        const response = await axios.get(Endpoints.ADMIN_DASHBOARD, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (isMounted) {
          console.log(response.data);
          setEmployeecount(response.data.employeeCount);
          setInternCount(response.data.internCount);
          setEmployees(response.data.employee);
          setAnnouncements(response.data.Announcement);
          setAllInvoices(response.data.allInvoices);
          setAllQuotations(response.data.allQuotations);
          setLoading(false);
        }
      } catch (err) {
        console.error(
          "Error in admin dashboard:",
          err.message || "Server error"
        );
        setLoading(false);
        navigate("/admin-login");
      }
    };

    fetchData(); // Call the async function

    const handleResize = () => {
      if (isMounted) setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      isMounted = false; // Prevent updates on unmounted component
      window.removeEventListener("resize", handleResize); // ✅ Proper cleanup
    };
  }, [navigate]);

  // -----------------------------------------------------------------------------------------------------------//

  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  // Function to print the invoice
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,

    onAfterPrint: () => {
      window.location.reload();
    },
  });
  //  tax invoice handler
  const handleSaveTax = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const invoiceElement = componentRef.current;
    const invoiceHTML = invoiceElement.outerHTML;
    const newInvoiceNumber = taxInvoiceNumber;
    try {
      // Send PDF to backend
      const response = await axios.post(Endpoints.ADMIN_SAVE_TAXINVOICE, {
        invoiceHTML: invoiceHTML,
        PartyName: partyName,
        DateofIssue: issueDate,
        invoiceNumber: newInvoiceNumber,
      });

      if (response.data.message === "Invoice saved successfully") {
        setTaxInvoiceNumber(newInvoiceNumber);
        setSuccessMessageTax(response.data.message);
        setIsSavedTax(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error saving invoice:", error.message);
      setErrorMessageTax(error.message);
      setIsLoading(false);
    }
  };
  //  No tax invoice handler
  const handleSave = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const invoiceElement = componentRef.current;
    const invoiceHTML = invoiceElement.outerHTML;
    const newInvoiceNumber = invoiceNumber;

    try {
      const response = await axios.post(Endpoints.ADMIN_SAVE_NOTAXINVOICE, {
        invoiceHTML: invoiceHTML,
        PartyName: partyName2,
        DateofIssue: issueDate,
        invoiceNumber: newInvoiceNumber,
      });

      if (response.data.message === "Invoice saved successfully") {
        setInvoiceNumber(newInvoiceNumber);
        setSuccessMessageNoTax(response.data.message);
        setIsSaved(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      setErrorMessageNoTax("Error saving invoice...");
      setIsLoading(false);
    }
  };
  // Tax Quatation Handler
  const handleSaveTaxQuote = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const invoiceElement = componentRef.current;
    const invoiceHTML = invoiceElement.outerHTML;
    const newInvoiceNumber = taxQuotationNumber;
    console.log(invoiceHTML);
    try {
      // Send PDF to backend
      const response = await axios.post(Endpoints.ADMIN_SAVE_TAXQUOTATION, {
        quotationHTML: invoiceHTML,
        PartyName: partyNameTaxQuote,
        DateofIssue: issueDate4,
        quotationNumber: newInvoiceNumber,
      });

      if (response.data.message === "Invoice saved successfully") {
        setTaxQuotationNumber(newInvoiceNumber);
        setSuccessMessageTaxQuote(response.data.message);
        setIsSavedTaxQuote(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error saving invoice:", error.message);
      setErrorMessageTaxQuote(error.message);
      setIsLoading(false);
    }
  };
  //  No tax Quotation handler
  const handleSaveQuote = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const invoiceElement = componentRef.current;
    const invoiceHTML = invoiceElement.outerHTML;
    const newInvoiceNumber = notaxQuotationNumber;

    try {
      const response = await axios.post(Endpoints.ADMIN_SAVE_NOTAXQUOTATION, {
        quotationHTML: invoiceHTML,
        PartyName: partyNameNoTaxQuote,
        DateofIssue: issueDate,
        quotationNumber: newInvoiceNumber,
      });

      if (response.data.message === "Invoice saved successfully") {
        setInvoiceNumberQuote(newInvoiceNumber);
        setSuccessMessageNoTaxQuote(response.data.message);
        setIsSavedQuote(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      setErrorMessageNoTaxQuote("Error saving invoice...");
      setIsLoading(false);
    }
  };

  const handleSaveSolar = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const invoiceElement = printRef.current;
    const invoiceHTML = invoiceElement.outerHTML;
    const newInvoiceNumber = solarInvoiceNumber;

    try {
      const response = await axios.post(Endpoints.ADMIN_SAVE_SOLARINVOICE, {
        invoiceHTML: invoiceHTML,
        PartyName: partyName,
        DateofIssue: issueDate,
        invoiceNumber: newInvoiceNumber,
      });

      if (response.data.message === "Invoice saved successfully") {
        setInvoiceNumber(newInvoiceNumber);
        setSuccessMessageSolarTax(response.data.message);
        setIsSavedSolar(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      if (error.response && error.response.status === 400) {
        setErrorMessageSolarTax(error.response.data.message); 
      } 
      else{
        setErrorMessageSolarTax("Error saving invoice...");
      }
      setIsLoading(false);
    }
  };

  const handleQuit = () => {
    // Logic to handle quit action
    console.log("Quit action triggered");
  };

  const handleDownload = async (invoiceId, invoiceNumber) => {
    try {
      const response = await fetch(
        `${Endpoints.DOWNLOAD_INVOICE}/${invoiceId}`
      );

      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `Invoice_${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading invoice:", error);
    }
  };

  // State to track the active item
  const [activeItem, setActiveItem] = useState("add-account");

  // employee page-------------------------------------------------------------------------------
  const [employees, setEmployees] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  //  Search filter function
  // const filteredEmployees = employees.filter(
  //   (emp) =>
  //     emp?.id.toString().includes(searchQuery) ||
  //     emp?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     emp?.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     emp?.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     emp?.joiningDate.includes(searchQuery) ||
  //     emp?.assignManager.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  const printRef = useRef();

  const handlePrint2 = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => {
      window.location.reload();
    },
  });

  //--------------------------------solar invoice-----------------------------------------------------------//
  const [totalPayable, setTotalPayable] = useState(); // Editable total
  const [items, setItems] = useState([
    {
      srNo: 1,
      description: "4KW Adani PV Panels Bifacial, K Solar 4KVA Inverter",
      uom: "pcs",
      qty: 1,
      gst: 12, // total GST (6% CGST + 6% SGST)
      share: 0.68892,
    },
    {
      srNo: 2,
      description:
        "GI Structure, Cables, LA, MCB, Installation and Commissioning",
      uom: "pcs",
      qty: 1,
      gst: 18, // total GST (9% + 9%)
      share: 0.31108,
    },
  ]);

  const [calculatedRows, setCalculatedRows] = useState([]);
  const [totals, setTotals] = useState({ beforeTax: 0, tax: 0 });

  useEffect(() => {
    const rows = items.map((item) => {
      const itemTotal = totalPayable * item.share;
      const taxableAmount = itemTotal / (1 + item.gst / 100);
      const taxAmount = itemTotal - taxableAmount;
      const halfTax = taxAmount / 2;

      return {
        ...item,
        rate: taxableAmount.toFixed(2),
        taxableAmount: taxableAmount.toFixed(2),
        cgst: `${item.gst / 2}%`,
        cgstAmount: halfTax.toFixed(2),
        sgst: `${item.gst / 2}%`,
        sgstAmount: halfTax.toFixed(2),
        totalRate: `${item.gst}%`,
        totalTax: taxAmount.toFixed(2),
        grandTotal: itemTotal.toFixed(2),
      };
    });

    const totalBeforeTax = rows.reduce(
      (acc, item) => acc + parseFloat(item.taxableAmount),
      0
    );
    const totalTax = rows.reduce(
      (acc, item) => acc + parseFloat(item.totalTax),
      0
    );

    setCalculatedRows(rows);
    setTotals({
      beforeTax: totalBeforeTax.toFixed(2),
      tax: totalTax.toFixed(2),
    });
  }, [totalPayable, items]);

  const solarTotalInWords = numberToWords(totalPayable);

  // -----------------------------------------------------------------------------------------------------------
  if (loading) {
    return <Loader text="Loading dashboard..." />;
  }

  // Place this just before the return (
  const tabBarStyle = {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
  };
  const tabStyle = (active) => ({
    padding: '10px 20px',
    borderRadius: '6px 6px 0 0',
    border: '1px solid #3498db',
    background: active ? '#3498db' : '#f4f4f4',
    color: active ? '#fff' : '#3498db',
    fontWeight: active ? 'bold' : 'normal',
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none',
    borderBottom: active ? '2px solid #fff' : '1px solid #3498db',
  });

  return (
    <div className="admindashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${menuOpen ? "menu-open" : ""}`}>
        <div className="head-menu">
          <h2>Dashboard</h2>
          <button className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>

        <ul>
          {sections.map((section) => (
            <li
              key={section}
              onClick={() => handleSectionClick(section)}
              className={activeSection === section ? "active" : ""}
            >
              {section}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navbar when HR is clicked */}
        {activeSection === "HR" && (
          <div className="top-navbar">
            <div className="navbar-left">
              <i className="fa-solid fa-users navbar-icon"></i>
              <h3>HR</h3>
            </div>
            <div className="navbar-right">
              <button
                className="topmenu-icon"
                onClick={() => setTopMenuOpen(!topMenuOpen)}
              >
                {topMenuOpen ? "✖" : "☰"}
              </button>
              {(isMobile && topMenuOpen) || !isMobile ? (
                <ul className={`hr-links ${topMenuOpen ? "show-links" : ""}`}>
                  {hrLinks.map((link) => (
                    <li
                      key={link}
                      onClick={() => handleLinkClick(link)}
                      className={activePage === link ? "active" : ""}
                    >
                      {link}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="page-content">
          {/* Overview page */}
          {activeSection === "HR" && activePage === "Overview" && (
            <div id="overview" className="overview-section">
              <h1>HR Management</h1>
              <div className="sections-wrapper">
                <div className="left-section">
                  <div className="info-overview">
                    <div className="info-block">
                      <h1>{employeecount ? employeecount : 0}</h1>
                      <h2>Employee</h2>
                      <Link className="view-link" to="#">
                        View Employees
                      </Link>
                    </div>
                    <div className="info-block">
                      <h1>{internCount ? internCount : 0}</h1>
                      <h2>Interns</h2>
                      <Link className="view-link" to="#">
                        View Intern
                      </Link>
                    </div>
                    <div className="info-block">
                      <h1>13</h1>
                      <h2>Department</h2>
                      <Link className="view-link" to="#">
                        View Department
                      </Link>
                    </div>
                  </div>
                  {/* Latest Announcement Section */}
                  <div className="latest-announcement">
                    <h3>
                      <i className="fa-solid fa-microphone"></i> Latest
                      Announcement
                    </h3>
                    <hr />
                    <div className="announcements">
                      {announcements.length > 0 ? (
                        announcements.map((announcement, index) => (
                          <div key={index} className="announcement-content">
                            <h1>
                              {announcement.Announcement}{" "}
                              <span className="vertical-line"></span>
                              <span className="announcement-date">
                                {formatDate(announcement.Date)}
                              </span>
                            </h1>
                          </div>
                        ))
                      ) : (
                        <div>No new Annoucment</div>
                      )}
                    </div>
                  </div>
                  {/* My Leave Calendar Section */}
                  <div className="leave-calendar">
                    <h3>
                      <i className="fa-regular fa-calendar"></i> My Leave
                      Calendar
                    </h3>
                    <hr />
                    <div className="calendar">
                      <p>Calendar Placeholder</p>
                    </div>
                  </div>
                </div>
                <div className="right-section">
                  {/* Birthday Buddies Block */}
                  <div className="birthday-buddies">
                    <h3>
                      <i className="fa-solid fa-cake-candles"></i> Birthday
                      Buddies
                    </h3>
                    <hr />
                    <p>Today's Birthday</p>
                    <div className="photo-upload">
                      <div className="photo-item">
                        <img src={avatarImage} alt="Avatar" />
                        <i className="fa-regular fa-envelope mail-icon"></i>
                      </div>
                      <div className="photo-item">
                        <img src={avatarImage} alt="Avatar" />
                        <i className="fa-regular fa-envelope mail-icon"></i>
                      </div>
                    </div>
                  </div>
                  {/* Who is Out Block */}
                  <div className="who-is-out">
                    <h3>
                      <i className="fa-solid fa-paper-plane"></i> Who is out
                    </h3>
                    <hr />
                    <p>This Month</p>
                    <p>Next Month</p>
                  </div>
                  {/* Attendance Status Block */}
                  <div className="attendance-status">
                    <h3>
                      <i className="fa-solid fa-chart-pie"></i> Attendance
                      Status
                    </h3>
                    <hr />
                    <p className="no-data">Not enough data</p>
                    <div className="filter">
                      <span>Filter by:</span>
                      <select>
                        <option>This Month</option>
                        <option>Next Month</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Employee page */}
          {activeSection === "HR" && activePage === "Employees" && (
            <div id="employee" className="employee-section">
              <div className="employee-row">
                <div className="employee-block">
                  <h2>Employees</h2>
                  <Link className="add-new" to="/add-employee">
                    Add New
                  </Link>
                </div>
                <div className="manager-block">
                  <h2>Managers</h2>
                  <Link className="add-new" to="/add-manager">
                    Add New
                  </Link>
                </div>
                <div className="intern-block">
                  <h2>Intern</h2>
                  <Link className="add-new" to="/add-intern">
                    Add New
                  </Link>
                </div>
              </div>

              <div className="search-employeetable">
                {/* Search Input */}
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search by ID, Name, Department, Designation, Joining Date, or Assign Manager..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-box"
                  />
                </div>

                {/* Employee Table */}
                <div className="admin-table-container">
                  <table className="employee-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>EMAIL</th>
                        <th>Mobile No.</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Joining Date</th>
                        <th>Assign Manager</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.length > 0 ? (
                        employees.map((emp, index) => (
                          <tr key={emp.id}>
                            <td>{index + 1}</td>
                            <td>
                              {emp ? emp.firstName + " " + emp.lastName : "NA"}
                            </td>
                            <td>{emp.email ? emp.email : "NA"}</td>
                            <td>{emp.mobile ? emp.mobile : "NA"}</td>
                            <td>{emp.department ? emp.department : "NA"}</td>
                            <td>{emp.jobTitle ? emp.jobTitle : "NA"}</td>
                            <td>
                              {emp.dateOfHire
                                ? formatDate(emp.dateOfHire)
                                : "NA"}
                            </td>
                            <td>
                              {emp.assignManager ? emp.assignManager : "NA"}
                            </td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <Link
                                  to="/update-employee"
                                  state={{ employee: emp }}
                                >
                                  <button className="search-update-btn">
                                    Update
                                  </button>
                                </Link>
                                <button
                                  style={{ color: "#dc3545" }}
                                  onClick={() => handleDeleteEmployee(emp._id)}
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="no-data">
                            No employees found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === "HR" && activePage === "Designation" && (
            <p className="comming-soon">Coming Soon.....</p>
          )}
          {activeSection === "HR" && activePage === "Departments" && (
            <p className="comming-soon">Coming Soon.....</p>
          )}
          {/* Announcement section */}
          {activeSection === "HR" && activePage === "Announcement" && (
            <div className="announcement-section">
              {/* Input Area */}
              <div className="announcement-input">
                <textarea
                  className="announcement-textarea"
                  placeholder="Write your announcement..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <button className="post-button" onClick={handlePost}>
                  Post
                </button>
              </div>

              {/* Announcements Box */}
              <div className="announcements-box">
                <div className="announcements-list">
                  {announcements && announcements.length > 0 ? (
                    announcements.slice().reverse().map((announcement, index) => (
                      <div className="announcement-item" key={announcement._id}>
                        <span className="announcement-date">
                          {announcement.Date ? formatDate(announcement.Date) : "No Date"}
                        </span>
                        {editingAnnouncementId === announcement._id ? (
                          <>
                            <input
                              type="text"
                              value={editingAnnouncementText}
                              onChange={e => setEditingAnnouncementText(e.target.value)}
                            />
                            <button onClick={() => handleEdit(announcement._id)}>Save</button>
                            <button onClick={() => { setEditingAnnouncementId(null); setEditingAnnouncementText(""); }}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <p className="announcement-message">
                              {announcement.Announcement || "No Announcement"}
                            </p>
                            <span
                              className="delete-icon"
                              onClick={() => handleDelete(announcement._id)}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </span>
                            <span
                              className="edit-icon"
                              onClick={() => {
                                setEditingAnnouncementId(announcement._id);
                                setEditingAnnouncementText(announcement.Announcement);
                              }}
                            >
                              <i className="fa-solid fa-pen"></i>
                            </span>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="no-announcements">No new announcements</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === "HR" && activePage === "Reports" && (
            <p className="comming-soon">Coming Soon.....</p>
          )}
          {activeSection === "HR" && activePage === "Ticket" && (
            <p>
              <AllTickets employee={employees} />
            </p>
          )}
          {activeSection === "HR" && activePage === "Help" && (
            <p className="comming-soon">Coming Soon.....</p>
          )}
          {/* sales and purchase section */}
          {activeSection === "Sales/Purchase" && (
            <div id="sales/purchase" className="sales-purchase-section">
              {/* Hamburger Button (Only for Mobile) */}
              <button
                className="menu-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                Side Menu ☰
              </button>

              {/* Right Buttons Container (Toggle for Mobile) */}
              <div
                className={`right-buttons-container ${
                  isMenuOpen ? "active" : ""
                }`}
              >
                {[
                  { id: "add-account", label: "Add Account" },
                  { id: "add-item", label: "Add Item" },
                  { id: "tax-invoice", label: "Tax Invoice" },
                  { id: "notax-invoice", label: "NoTax Invoice" },
                  { id: "solar-invoice", label: "Solar Invoice" },
                  { id: "tax-quote", label: "Tax Quote" },
                  { id: "notax-quote", label: "NoTax Quote" },
                  { id: "solar-quote", label: "Solar Quote" },
                  { id: "add-sales", label: "Add Sales" },
                  { id: "add-purchase", label: "Add Purchase" },
                  { id: "stock-status", label: "Stock Status" },
                  { id: "acc-ledger", label: "Acc. Ledger" },
                  { id: "item-summary", label: "Item Summary" },
                  { id: "all-invoices", label: "All Invoices" },
                  { id: "all-quotes", label: "All Quotes" },
                  { id: "gst-summary", label: "GST Summary" },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => handleItemClick(btn.id)}
                    className={`right-button-row ${
                      activeItem === btn.id ? "active" : ""
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}

                {/* Tax Type Display */}
                <a className="right-button-tax">
                  <span>Tax Type:</span>
                  <span className="gst-text">GST</span>
                </a>
              </div>
              <div className="sales-purchase-main-content">
                {activeItem === "add-account" && (
                  <div className="content-box">
                    <div className="form-container">
                      <div className="header-section">
                        <h2>Create Company</h2>
                      </div>
                      <div className="merged-top-sections">
                        <div className="section-container">
                          <div className="form-row">
                            <label>Name:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>Print Name:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>Short Name:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>Country:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>State:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>F.Y. Beginning from:</label>
                            <input type="date" />
                          </div>
                          <div className="form-row">
                            <label>Books Commencing from:</label>
                            <input type="date" />
                          </div>
                        </div>

                        <div className="section-container">
                          <div className="form-row">
                            <label>Address:</label>
                            <textarea
                              rows={4}
                              style={{ fontSize: "14px" }}
                              type="text"
                              className="input-wide"
                            />
                          </div>
                          <div className="form-row">
                            <label>CIN:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>IT PAN:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>Telephone No.:</label>
                            <input rows type="text" />
                          </div>
                          <div className="form-row">
                            <label>E-Mail:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>Fax:</label>
                            <input type="text" />
                          </div>
                        </div>
                      </div>

                      <div className="info-sections">
                        <div className="currency-section">
                          <h4>Currency Information</h4>
                          <div className="form-row">
                            <label>Currency Symbol:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>Currency String:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>Currency Sub-String:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>Currency Font:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>Currency Character:</label>
                            <input type="text" />
                          </div>
                        </div>

                        <div className="gst-vat-section">
                          <h4>GST/VAT Information</h4>
                          <div className="form-row">
                            <label>Enable GST/VAT:</label>
                            <input type="text" defaultValue="Y" />
                            <label className="aligned-label">Type:</label>
                            <input type="text" defaultValue="GST" />
                          </div>
                          <div className="form-row">
                            <label>Enable Cess:</label>
                            <input type="text" defaultValue="N" />
                            <label className="aligned-label">Caption 1:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>Enable Add. Cess</label>
                            <input type="text"></input>
                            <label className="aligned-label">Caption 2:</label>
                            <input type="text" />
                          </div>
                          <div className="form-row">
                            <label>GSTN</label>
                            <input type="text"></input>
                          </div>
                          <div className="form-row">
                            <label>Type of Dealer:</label>
                            <input type="text" defaultValue="Regular" />
                          </div>
                          <div className="form-row">
                            <label>Default Tax Rate 1:</label>
                            <input type="number" defaultValue="0.00" />
                            <label className="aligned-label">
                              Default Tax Rate 2:
                            </label>
                            <input type="number" defaultValue="0.00" />
                          </div>
                        </div>
                      </div>

                      <div className="copy-masters-section">
                        <h4>
                          Copy Masters, Configuration, and Users From Existing
                          Company
                        </h4>
                        <div className="radio-group">
                          <div className="radio-option">
                            <input
                              type="radio"
                              id="notRequired"
                              name="copyOptions"
                              value="Not Required"
                              defaultChecked
                            />
                            <label htmlFor="notRequired">Not Required</label>
                          </div>
                          <div className="radio-option">
                            <input
                              type="radio"
                              id="copyMastersConfig"
                              name="copyOptions"
                              value="Copy Masters & Config"
                            />
                            <label htmlFor="copyMastersConfig">
                              Copy Masters & Config
                            </label>
                          </div>
                          <div className="radio-option">
                            <input
                              type="radio"
                              id="copyMastersConfigUsers"
                              name="copyOptions"
                              value="Copy Masters, Config & Users"
                            />
                            <label htmlFor="copyMastersConfigUsers">
                              Copy Masters, Config & Users
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="button-row right-buttons">
                        <button>Save</button>
                        <button>Quit</button>
                      </div>
                    </div>
                  </div>
                )}

                {activeItem === "add-item" && (
                  <div className="content-box">
                    <div className="item-master-container">
                      <h2 className="item-master-title">Add Item Master</h2>
                      <div className="main-container">
                        {/* Left Container */}
                        <div className="left-container">
                          <div className="grid-item item1">
                            <div className="row">
                              <label>Name:</label>
                              <input type="text" />
                            </div>
                            <div className="row">
                              <label>Alias:</label>
                              <input type="text" />
                            </div>
                            <div className="row">
                              <label>Print Name:</label>
                              <input type="text" />
                            </div>
                            <div className="row">
                              <label>Group:</label>
                              <input type="text" />
                            </div>
                          </div>

                          <div className="side-by-side">
                            <div className="grid-item item2">
                              <h4>Main Unit Details</h4>
                              <div className="row">
                                <label>Unit:</label>
                                <input type="text" />
                              </div>
                              <div className="row">
                                <label>Op. Stock (Qty.):</label>
                                <input type="text" defaultValue="0.00" />
                              </div>
                              <div className="row">
                                <label>Op. Stock (Value):</label>
                                <input type="text" />
                              </div>
                            </div>
                            <div className="grid-item item3">
                              <h4>Alternate Unit Details</h4>
                              <div className="row">
                                <label>Alternate Unit:</label>
                                <input type="text" />
                              </div>
                              <div className="row">
                                <label>Con. Factor:</label>
                                <input type="text" defaultValue="0.000" />
                              </div>
                              <div className="row">
                                <label>Con. Type:</label>
                                <input type="text" />
                              </div>
                              <div className="row">
                                <label>Op. Stock (Qty.):</label>
                                <input type="text" defaultValue="0.00" />
                              </div>
                            </div>
                          </div>

                          {/* Container with Visible Border around Invisible Containers */}
                          <div className="grid-item bordered-container">
                            <h4>Item Price Info</h4>
                            <div className="invisible-containers">
                              <div className="grid-item">
                                <div className="row">
                                  <label>Sales Price Applied On:</label>
                                  <input type="text" defaultValue="Main Unit" />
                                </div>
                                <div className="row">
                                  <label>Sales Price:</label>
                                  <input type="text" defaultValue="0.00" />
                                </div>
                                <div className="row">
                                  <label>Purc. Price:</label>
                                  <input type="text" defaultValue="0.00" />
                                </div>
                                <div className="row">
                                  <label>M.R.P.:</label>
                                  <input type="text" defaultValue="0.00" />
                                </div>
                                <div className="row">
                                  <label>Min. Sales Price:</label>
                                  <input type="text" defaultValue="0.00" />
                                </div>
                                <div className="row">
                                  <label>Self-Val. Price:</label>
                                  <input type="text" defaultValue="0.00" />
                                </div>
                              </div>
                              <div className="grid-item">
                                <div className="row">
                                  <label>Purc. Price Applied On:</label>
                                  <input type="text" defaultValue="Main Unit" />
                                </div>
                                <div className="row">
                                  <label>Sales Price:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Purc. Price:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Min. Sales Price:</label>
                                  <input type="text" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid-item bordered-container">
                            <h4>Packaging Unit Details</h4>
                            <div className="invisible-containers">
                              <div className="grid-item">
                                <div className="row">
                                  <label>Packaging Unit:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Sales Price:</label>
                                  <input type="text" />
                                </div>
                              </div>
                              <div className="grid-item">
                                <div className="row">
                                  <label>Con. Factor:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Purc. Price:</label>
                                  <input type="text" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Next container */}
                          <div className="grid-item bordered-container">
                            <div className="invisible-containers">
                              <div className="grid-item">
                                <div className="row">
                                  <label>Default Unit For Sales:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Tax Category:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>HSN/SAC Code For GST:</label>
                                  <input type="text" />
                                </div>
                              </div>
                              <div className="grid-item">
                                <div className="row">
                                  <label>Default Unit For Purc.:</label>
                                  <input type="text" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Final container */}
                          <div className="grid-item bordered-container">
                            <h4>Item Tax Details</h4>
                            <div className="invisible-containers">
                              <div className="grid-item">
                                <div className="row">
                                  <label>Type:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Rate of Tax (CGST):</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Rate of Tax (SGST):</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Rate of Tax (IGST):</label>
                                  <input type="text" />
                                </div>
                              </div>
                              <div className="grid-item">
                                <div className="row">
                                  <label>Tax on MRP:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Taxation Type:</label>
                                  <input type="text" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Button Row in Left Container */}
                          <div className="button-row left-buttons">
                            <button>Notes</button>
                            <button>Opt. Fields</button>
                            <button>Multiple Alias</button>
                            <button>Item Image</button>
                          </div>
                        </div>

                        {/* Right Container */}
                        <div className="right-container">
                          <div className="grid-item bordered-container">
                            <h4>Discount & Markup Det.</h4>
                            <div className="invisible-containers">
                              <div className="grid-item">
                                <div className="row">
                                  <label>Sale Discount:</label>
                                  <input type="text" defaultValue="0.00" />
                                </div>
                                <div className="row">
                                  <label>Sale Compound Disc:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Specify Sales Disc. Structure:</label>
                                  <input type="text" defaultValue="N" />
                                </div>
                              </div>
                              <div className="grid-item">
                                <div className="row">
                                  <label>Purc. Discount:</label>
                                  <input type="text" defaultValue="0.00" />
                                </div>
                                <div className="row">
                                  <label>Purc. Compound Disc.:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Specify Purc. Disc. Structure:</label>
                                  <input type="text" defaultValue="N" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="grid-item bordered-container">
                            <div className="invisible-containers">
                              <div className="grid-item">
                                <div className="row">
                                  <label>Sale Markup:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Sale Comp. Markup:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Specify Sales Markup Structure:</label>
                                  <input type="text" />
                                </div>
                              </div>
                              <div className="grid-item">
                                <div className="row">
                                  <label>Purc. Markup:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Purc. Comp. Markup:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Specify Purc. Markup Structure:</label>
                                  <input type="text" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="grid-item item8">
                            <h4>Item Description</h4>
                            <textarea
                              rows={4}
                              type="text"
                              className="input-wide"
                            />
                          </div>
                          <div className="grid-item bordered-container">
                            <div className="invisible-containers">
                              <div className="grid-item">
                                <div className="row">
                                  <label>Set Critical Level (Y/N):</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Maintain RG-23D:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Serial No.-wise Details:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>MRP-wise Details:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Exp./Mfg. Date Required:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Specify Sales Account:</label>
                                  <input type="text" defaultValue="N" />
                                </div>
                                <div className="row">
                                  <label>Specify Purc Account:</label>
                                  <input type="text" defaultValue="N" />
                                </div>
                                <div className="row">
                                  <label>Specify Default MC:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Freeze MC for Item:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Total No. of Authors (Max. 10):</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>
                                    Pick Item Sizing Info. from Item
                                    Description:
                                  </label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Specify Default Vendor:</label>
                                  <input type="text" defaultValue="N" />
                                </div>
                                <div className="row">
                                  <label>Don't Maintain Stock Balance:</label>
                                  <input type="text" defaultValue="N" />
                                </div>
                              </div>
                              <div className="grid-item">
                                <div className="row">
                                  <label>Tariff Heading:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Parameterized Details:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Batch-wise Details:</label>
                                  <input type="text" />
                                </div>
                                <div className="row">
                                  <label>Expiry Days:</label>
                                  <input type="text" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Button Row in Right Container */}
                          <div className="button-row right-buttons">
                            <button>Save</button>
                            <button>Quit</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* TAX INVOICE */}
                {activeItem === "tax-invoice" && (
                  <div className="content-box">
                    {/* <h2>Add-Reciept</h2> */}
                    <div>
                      <div className="button-container-invoice">
                        {/* Save Button */}
                        <LoadingButton 
                          className="save-button-invoice" 
                          onClick={handleSaveTax} 
                          isLoading={isLoading}
                          disabled={isSavedTax || isLoading}
                        >
                          Save
                        </LoadingButton>

                        {/* Print Button */}
                        <button
                          className="print-button-invoice"
                          onClick={handlePrint}
                          disabled={!isSavedTax}
                        >
                          Print
                        </button>
                      </div>
                      <p style={{ color: "green" }}>
                        {successMessageTax ? successMessageTax : ""}
                      </p>
                      <p style={{ color: "red" }}>
                        {errorMessageTax ? errorMessageTax : ""}
                      </p>

                      <div
                        className="invoice-container"
                        ref={componentRef}
                        style={{
                          width: "753px",
                          margin: "10px auto",
                          // marginLeft: "2.5%",
                          padding: "5px",
                          border: "1px solid #000",
                          backgroundColor: "#fff",
                          fontFamily: "Arial, sans-serif",
                          overflow: "auto",
                          fontSize: "smaller",
                        }}
                      >
                        <div>
                          <h2
                            style={{
                              color: "black",
                              marginBottom: "10px",
                            }}
                          >
                            Tax Invoice
                          </h2>
                        </div>
                        <div
                          className="invoice-header"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #000",
                          }}
                        >
                          <div style={{ textAlign: "center" }}>
                            <img
                              src={logobase64}
                              alt="Company Logo"
                              style={{
                                paddingRight: "1%",
                                width: "200px",
                                height: "50px",
                              }}
                            />
                          </div>

                          <div
                            className="invoice-info"
                            style={{ width: "30%" }}
                          >
                            <div
                              className="invoice-info-row"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "10px",
                              }}
                            >
                              <label
                                htmlFor="invoice-no"
                                style={{ fontWeight: "bold" }}
                              >
                                Invoice No.:
                              </label>
                              <input
                                type="text"
                                id="invoice-no"
                                name="invoice-no"
                                value={taxInvoiceNumber}
                                readOnly
                                style={{ border: "none", maxWidth: "120px" }}
                              />
                            </div>
                            <div
                              className="invoice-info-row"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "10px",
                              }}
                            >
                              <label
                                htmlFor="date-of-issue"
                                style={{ fontWeight: "bold" }}
                              >
                                Date of Issue:
                              </label>
                              <input
                                type="text"
                                id="date-of-issue"
                                name="date-of-issue"
                                value={issueDate}
                                style={{ border: "none", maxWidth: "120px" }}
                                onChange={(e) => {
                                  setIssueDate(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          className="invoice-fromto"
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            margin: "5px 0px",
                          }}
                        >
                          <div
                            className="from-section"
                            style={{ textAlign: "left", width: "40%" }}
                          >
                            <h3
                              style={{
                                fontWeight: "bolder",
                                fontSize: "larger",
                                color:"green"
                              }}
                            >
                              From
                            </h3>
                            <p>Techkisan Automation,</p>
                            <p>Nakade Complex, Mama Chawk, Civil Line</p>
                            <p>Gondia, Maharashtra, India - 441601</p>
                            <p>
                              <strong>Mobile No. :</strong>
                              <span style={{ margin: "0 3px" }}></span>
                              7972021213 | 9511831914
                            </p>
                            <p>
                              <strong>Email I'd :</strong>
                              <span style={{ margin: "0px 9px" }}></span>
                              tkn.automation@gmail.com
                            </p>
                            <p>
                              <strong>GST No. :</strong>
                              <span style={{ margin: "0px 9px" }}></span>
                              27AAQFT9534N1Z5
                            </p>
                          </div>
                          <div
                            className="to-section"
                            style={{ textAlign: "left", width: "40%" }}
                          >
                            <h3
                            style={{
                              fontWeight: "bolder",
                              fontSize: "larger",
                              color:"green"
                            }}
                            >Bill To</h3>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              >
                                M/s{" "}
                              </label>
                              <input
                                type="text"
                                name="partyName"
                                onChange={(e) => setPartyName(e.target.value)}
                                value={partyName}
                                style={{ width: "100%", border: "none" }}
                              />
                            </div>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              >
                              
                              </label>
                              <input
                                type="text"
                                name="partyName"
                                onChange={(e) => setPartyName02(e.target.value)}
                                value={partyName02}
                                style={{ width: "100%", border: "none" }}
                              />
                            </div>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              >
                                Address:
                              </label>
                              <input
                                type="text"
                                value={partyAddress}
                                onChange={(e) =>
                                  setPartyAddress(e.target.value)
                                }
                                style={{ width: "100%", border: "none" }}
                              />
                            </div>
                            
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              ></label>
                              <input
                                style={{ border: "none", width: "100%" }}
                                type="text"
                                value={partyAddress2}
                                onChange={(e) =>
                                  setPartyAddress2(e.target.value)
                                }
                              />
                            </div>
                            
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              ></label>
                              <input
                                style={{ border: "none", width: "100%" }}
                                type="text"
                                value={partyAddress2Line2}
                                onChange={(e) =>
                                  setPartyAddress2Line2(e.target.value)
                                }
                              />
                            </div>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                             
                            </div>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              >
                                Mobile No.:{" "}
                              </label>
                              <input
                                style={{ border: "none", width: "100%" }}
                                type="text"
                                value={partyMobile2}
                                onChange={(e) =>
                                  setPartyMobile2(e.target.value)
                                }
                              />
                            </div>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              >
                                GST No.:{" "}
                              </label>
                              <input
                                style={{ border: "none", width: "100%" }}
                                type="text"
                                value={taxGSTIN}
                                onChange={(e) =>
                                  setTaxGSTIN(e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div
                          className="invoice-table"
                          style={{ width: "100%", overflowX: "auto" }}
                        >
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              tableLayout: "fixed",
                            }}
                          >
                            <thead
                              style={{
                                height: "40px",
                                backgroundColor: "#d5e8d6",
                              }}
                            >
                              <tr>
                                <th
                                  style={{
                                    width: "4%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                  }}
                                >
                                  S.N.
                                </th>
                                <th
                                  style={{
                                    width: "34%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                  }}
                                >
                                  Product Description
                                </th>
                                <th
                                  style={{
                                    width: "10%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                  }}
                                >
                                  HSN
                                </th>
                                <th
                                  style={{
                                    width: "9%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                  }}
                                >
                                  Qty(N)
                                </th>
                                <th
                                  style={{
                                    width: "11%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                  }}
                                >
                                  Rate(₹)
                                </th>
                                <th
                                  style={{
                                    width: "12%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                    paddingBottom: "0px",
                                  }}
                                >
                                  Amount(₹)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {taxRows.map((row, index) => (
                                <tr key={index}>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                    }}
                                  >
                                    {index + 1}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      maxWidth: "200px",
                                      wordWrap: "break-word",
                                      overflowWrap: "break-word",
                                    }}
                                  >
                                    <textarea
                                      rows="3"
                                      style={{
                                        width: "100%",
                                        resize: "none",
                                        overflow: "hidden",
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        marginTop: "0px",
                                        border: "none",
                                        outline: "none",
                                        boxShadow: "none",
                                      }}
                                      value={row.desc}
                                      data-tax-index={index}
                                      onChange={(e) =>
                                        handleTaxChange(
                                          index,
                                          "desc",
                                          e.target.value
                                        )
                                      }
                                      onKeyDown={(e) =>
                                        handleKeyPress({
                                          index,
                                          field: "desc",
                                          event: e,
                                          rows: taxRows,
                                          setRows: setTaxRows,
                                          rowSelector: taxDescSelector,
                                        })
                                      }
                                    />
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                    }}
                                  >
                                    <input
                                      type="text"
                                      value={row.hsn}
                                      style={{
                                        width: "100%",
                                        border: "none",
                                        outline: "none",
                                        fontSize: "14px",
                                      }}
                                      onChange={(e) =>
                                        handleTaxChange(
                                          index,
                                          "hsn",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                    }}
                                  >
                                    <input
                                      type="number"
                                      value={row.qty}
                                      style={{
                                        width: "100%",
                                        border: "none",
                                        outline: "none",
                                        fontSize: "14px",
                                      }}
                                      onChange={(e) =>
                                        handleTaxChange(
                                          index,
                                          "qty",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                    }}
                                  >
                                    <input
                                      type="number"
                                      value={row.rate}
                                      data-tax-rate-index={index}
                                      style={{
                                        width: "100%",
                                        border: "none",
                                        outline: "none",
                                        fontSize: "14px",
                                      }}
                                      onChange={(e) =>
                                        handleTaxChange(
                                          index,
                                          "rate",
                                          e.target.value
                                        )
                                      }
                                      onKeyDown={(e) =>
                                        handleKeyPress({
                                          index,
                                          field: "rate",
                                          event: e,
                                          rows: taxRows,
                                          setRows: setTaxRows,
                                          rowSelector: taxRateSelector,
                                        })
                                      }
                                    />
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                    }}
                                  >
                                    <input
                                      type="text"
                                      value={row.amount}
                                      readOnly
                                      style={{
                                        width: "100%",
                                        border: "none",
                                        outline: "none",
                                        fontSize: "14px",
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                <td
                                  colSpan="5"
                                  style={{
                                    textAlign: "right",
                                    fontWeight: "bold",
                                    padding: "3px",
                                    border: "1px solid #000",
                                  }}
                                >
                                  Total (₹):
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #000",
                                    padding: "3px",
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={taxTotalAmount.toFixed(2)}
                                    readOnly
                                    style={{
                                      width: "100%",
                                      border: "none",
                                      outline: "none",
                                      fontSize: "14px",
                                    }}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td
                                  colSpan="5"
                                  style={{
                                    textAlign: "right",
                                    fontWeight: "bold",
                                    border: "1px solid #000",
                                    padding: "3px",
                                    position: "relative",
                                  }}
                                  onClick={() => setShowDropdown(true)}
                                  onBlur={() =>
                                    setTimeout(
                                      () => setShowDropdown(false),
                                      200
                                    )
                                  }
                                >
                                  {showDropdown ? (
                                    <select
                                      value={taxType}
                                      onChange={(e) => setTaxType(e.target.value)}
                                      autoFocus
                                      style={{
                                        width: "110px",
                                        fontSize: "12px",
                                      }}
                                    >
                                      {Object.entries(taxOptions).map(([key, option]) => (
                                        <option key={key} value={key}>
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>

                                      ) : (
                                      taxOptions[taxType]?.label || "Select Tax"
                                    )}
                                    </td>
                                    <td
                                      style={{
                                        border: "1px solid #000",
                                        padding: "3px",
                                      }}
                                    >
                                      <input
                                        type="text"
                                        value={gstAmount.toFixed(2)}
                                        readOnly
                                        style={{
                                          width: "100%",
                                          border: "none",
                                          outline: "none",
                                          fontSize: "14px",
                                        }}
                                      />
                                    </td>
                                    </tr>

                                      {taxType.startsWith("IGST") && (
                                      <>
                                        <tr>
                                          <td colSpan="5" style={{ textAlign: "right", fontWeight: "bold", padding: "3px", border: "1px solid #000" }}>
                                            -CGST {Number((selectedTax.totalRate / 2) * 100).toFixed()}%
                                          </td>
                                          <td style={{ border: "1px solid #000" }}>
                                            <input
                                              type="text"
                                              value={cgstSgstAmount.toFixed(2)}
                                              readOnly
                                              style={{ width: "100%", border: "none", outline: "none", fontSize: "14px" }}
                                            />
                                          </td>
                                        </tr>
                                        <tr>
                                          <td colSpan="5" style={{ textAlign: "right", fontWeight: "bold", padding: "3px", border: "1px solid #000" }}>
                                            -SGST {Number((selectedTax.totalRate / 2) * 100).toFixed()}%
                                          </td>
                                          <td style={{ border: "1px solid #000" }}>
                                            <input
                                              type="text"
                                              value={cgstSgstAmount.toFixed(2)}
                                              readOnly
                                              style={{ width: "100%", border: "none", outline: "none", fontSize: "14px" }}
                                            />
                                          </td>
                                        </tr>
                                      </>
                                    )}

                              <tr>
                                <td
                                  colSpan="5"
                                  style={{
                                    textAlign: "right",
                                    fontWeight: "bold",
                                    padding: "3px",
                                    border: "1px solid #000",
                                  }}
                                >
                                  Round Off (₹):
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #000",
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={taxRoundOff.toFixed(2)}
                                    readOnly
                                    style={{
                                      width: "100%",
                                      border: "none",
                                      outline: "none",
                                      fontSize: "14px",
                                    }}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td
                                  colSpan="5"
                                  style={{
                                    textAlign: "right",
                                    fontWeight: "bold",
                                    padding: "3px",
                                    border: "1px solid #000",
                                  }}
                                >
                                  Final Total (₹):
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #000",
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={taxRoundedTotal.toFixed(2)}
                                    readOnly
                                    style={{
                                      width: "100%",
                                      border: "none",
                                      outline: "none",
                                      fontSize: "14px",
                                    }}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td
                                  colSpan="6"
                                  style={{
                                    textAlign: "right",
                                    padding: "3px",
                                    border: "1px solid #000",
                                  }}
                                >
                                  <b>Amount in Words:</b>{" "}
                                  <p>{taxTotalInWords} Rupees Only</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div
                          className="footer-section"
                          style={{
                            marginTop: "2px",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            className="payment-section"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            <h4
                              style={{
                                fontWeight: "bold",
                                marginBottom: "0px",
                                color: "#000",
                                fontSize: "12px",
                                marginTop: "5px",
                              }}
                            >
                              BANK DETAILS
                            </h4>
                            <div
                              className="payment-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                                textAlign: "left",
                              }}
                            >
                              <p
                                style={{
                                  textAlign: "left",
                                  fontWeight: "bold",
                                  width: "140px",
                                }}
                              >
                                Bank Name:
                              </p>
                              <p style={{ textAlign: "left" }}>HDFC Bank</p>
                            </div>

                            <div
                              className="payment-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                                textAlign: "left",
                              }}
                            >
                              <p
                                style={{
                                  textAlign: "left",
                                  fontWeight: "bold",
                                  width: "140px",
                                }}
                              >
                                A/c Holder Name:
                              </p>
                              <p style={{ textAlign: "left" }}>
                                TechKisan Automation
                              </p>
                            </div>

                            <div
                              className="payment-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                                textAlign: "left",
                              }}
                            >
                              <p
                                style={{
                                  textAlign: "left",
                                  fontWeight: "bold",
                                  width: "140px",
                                }}
                              >
                                Account No.:
                              </p>
                              <p style={{ textAlign: "left" }}>
                                50200063151545
                              </p>
                            </div>

                            <div
                              className="payment-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                                textAlign: "left",
                              }}
                            >
                              <p
                                style={{
                                  textAlign: "left",
                                  fontWeight: "bold",
                                  width: "140px",
                                }}
                              >
                                IFSC Code:
                              </p>
                              <p style={{ textAlign: "left" }}>HDFC000963</p>
                            </div>

                            <div className="UPI-section-main">
                              <h4
                                style={{
                                  fontSize: "12px",
                                  marginBottom: "0px",
                                }}
                              >
                                PAYMENT VIA QR CODE
                              </h4>
                              <div
                                className="UPI-section"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  textAlign: "left",
                                }}
                              >
                                <div>
                                  <p>
                                    <strong>UPI ID:</strong>
                                  </p>
                                  <p>9511831914@hdfcbank</p>
                                  <p>8698105221@hdfcbank</p>
                                  <div>
                                    <img
                                      src={paymentbase64}
                                      alt="payment icons"
                                      style={{
                                        height: "30px",
                                        width: "145px",
                                        marginTop: "5px",
                                      }}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <img
                                    src={barcodebase64}
                                    alt="QR code"
                                    style={{ height: "78px", width: "78px" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="signature-section"
                            style={{ textAlign: "left", marginTop: "5px" }}
                          >
                            <p>
                              <strong>For Techkisan Automation</strong>
                            </p>
                            <img
                              src={signaturebase64}
                              alt="Signature"
                              style={{
                                width: "105px",
                                height: "100px",
                                marginLeft: "40px",
                              }}
                            />
                            <p style={{ fontSize: "10px", marginLeft: "25px" }}>
                              <i>Computer Generated Invoice</i>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* NO TAX INVOICE  */}
                {activeItem === "notax-invoice" && (
                  <div className="content-box">
                    {/* <h2>Add-Reciept</h2> */}
                    <div>
                      <div className="button-container-invoice">
                        {/* Save Button */}
                        <LoadingButton 
                          className="save-button-invoice" 
                          onClick={handleSave} 
                          isLoading={isLoading}
                          disabled={isSaved || isLoading}
                        >
                          Save
                        </LoadingButton>

                        {/* Print Button */}
                        <button
                          className="print-button-invoice"
                          onClick={handlePrint}
                          disabled={!isSaved}
                        >
                          Print
                        </button>
                        <p style={{ color: "green" }}>
                          {successMessageNoTax ? successMessageNoTax : ""}
                        </p>
                        <p style={{ color: "red" }}>
                          {errorMessageNoTax ? errorMessageNoTax : ""}
                        </p>
                      </div>

                      <div
                        className="invoice-container"
                        ref={componentRef}
                        style={{
                          width: "753px",
                          margin: "10px auto",
                          // marginLeft: "2.5%",
                          padding: "5px",
                          border: "1px solid #000",
                          backgroundColor: "#fff",
                          fontFamily: "Arial, sans-serif",
                          overflow: "auto",
                          fontSize: "smaller",
                        }}
                      >
                        <div>
                          <h2
                            style={{
                              color: "black",
                              marginBottom: "10px",
                            }}
                          >
                            Invoice
                          </h2>
                        </div>
                        <div
                          className="invoice-header"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #000",
                          }}
                        >
                          <div className="logo-sectionlogoin">
                            <img
                              src={logobase64}
                              alt="Company Logo"
                              className="logoin"
                              style={{
                                paddingRight: "1%",
                                height: "50px",
                                width: "200px",
                              }}
                            />
                          </div>
                          <div
                            className="invoice-info"
                            style={{ width: "30%" }}
                          >
                            <div
                              className="invoice-info-row"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "10px",
                              }}
                            >
                              <label
                                htmlFor="invoice-no"
                                style={{ fontWeight: "bold" }}
                              >
                                Invoice No.:
                              </label>
                              <input
                                type="text"
                                id="invoice-no"
                                name="invoice-no"
                                value={invoiceNumber}
                                style={{ border: "none", maxWidth: "120px" }}
                                readOnly
                              />
                            </div>
                            <div
                              className="invoice-info-row"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "10px",
                              }}
                            >
                              <label
                                htmlFor="date-of-issue"
                                style={{ fontWeight: "bold" }}
                              >
                                Date of Issue:
                              </label>
                              <input
                                type="text"
                                id="date-of-issue"
                                name="date-of-issue"
                                value={issueDate2}
                                style={{ border: "none", maxWidth: "120px" }}
                                onChange={(e) => {
                                  setIssueDate2(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          className="invoice-fromto"
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            margin: "5px 0px",
                          }}
                        >
                          <div
                            className="from-section"
                            style={{ textAlign: "left", width: "40%" }}
                          >
                            <h3
                              style={{
                                fontWeight: "bolder",
                                fontSize: "larger",
                                color:"green"
                              }}
                            >
                              From
                            </h3>
                            <p>Techkisan Automation,</p>
                            <p>Nakade Complex, Mama Chawk, Civil Line</p>
                            <p>Gondia, Maharashtra, India - 441601</p>
                            <p>
                              <strong>Mobile No. :</strong>
                              <span style={{ margin: "0 3px" }}></span>
                              7972021213 | 9511831914
                            </p>
                            <p>
                              <strong>Email I'd :</strong>
                              <span style={{ margin: "0px 9px" }}></span>
                              tkn.automation@gmail.com
                            </p>
                          </div>
                          <div
                            className="to-section"
                            style={{ textAlign: "left", width: "40%" }}
                          >
                            <h3
                              style={{
                                fontWeight: "bolder",
                                fontSize: "larger",
                                color:"green"
                              }}
                            >
                              Bill To</h3>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              >
                                M/s{" "}
                              </label>
                              <input
                                type="text"
                                value={partyName2}
                                style={{ width: "100%", border: "none" }}
                                onChange={(e) => {
                                  setPartyName2(e.target.value);
                                }}
                              />
                               
                            </div>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              >
                                
                              </label>
                              <input
                                type="text"
                                value={partyName002}
                                style={{ width: "100%", border: "none" }}
                                onChange={(e) => {
                                  setPartyName002(e.target.value);
                                }}
                              />
                               
                            </div>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              >
                                Address:
                              </label>
                              <input
                                style={{ width: "100%", border: "none" }}
                                type="text"
                                value={notaxaddress1}
                                onChange={(e) => {
                                  setNotaxaddress1(e.target.value);
                                }}
                              />
                            </div>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              ></label>
                              <input
                                style={{ width: "100%", border: "none" }}
                                type="text"
                                value={notaxaddress2}
                                onChange={(e) => {
                                  setNotaxaddress2(e.target.value);
                                }}
                              />
                            </div>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              ></label>
                              <input
                                style={{ width: "100%", border: "none" }}
                                type="text"
                                value={notaxaddress3}
                                onChange={(e) => {
                                  setNotaxaddress3(e.target.value);
                                }}
                              />
                            </div>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              >
                                Mobile No.:{" "}
                              </label>
                              <input
                                style={{ width: "100%", border: "none" }}
                                type="text"
                                value={notaxmobile}
                                onChange={(e) => {
                                  setNotaxmobile(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div
                          className="invoice-table"
                          style={{
                            width: "100%",
                          }}
                        >
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              tableLayout: "fixed",
                            }}
                          >
                            <thead
                              style={{
                                height: "40px",
                                backgroundColor: "#d5e8d6",
                              }}
                            >
                              <tr>
                                <th
                                  style={{
                                    width: "4%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                  }}
                                >
                                  S.N.
                                </th>
                                <th
                                  style={{
                                    width: "34%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                  }}
                                >
                                  Product Description
                                </th>
                                <th
                                  style={{
                                    width: "10%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                  }}
                                >
                                  HSN
                                </th>
                                <th
                                  style={{
                                    width: "9%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                  }}
                                >
                                  Qty(N)
                                </th>
                                <th
                                  style={{
                                    width: "11%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                  }}
                                >
                                  Rate(₹)
                                </th>
                                <th
                                  style={{
                                    width: "12%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                    paddingBottom: "0px",
                                  }}
                                >
                                  Amount(₹)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {noTaxRows.map((row, index) => (
                                <tr key={index}>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                    }}
                                  >
                                    {index + 1}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                      maxWidth: "200px",
                                      wordWrap: "break-word",
                                      overflowWrap: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    <textarea
                                      rows="3"
                                      style={{
                                        width: "100%",
                                        resize: "none",
                                        overflow: "hidden",
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        marginTop: "0px",
                                        border: "none",
                                        outline: "none",
                                        boxShadow: "none",
                                      }}
                                      value={row.desc}
                                      data-notax-index={index}
                                      onChange={(e) =>
                                        handleNoTaxChange(
                                          index,
                                          "desc",
                                          e.target.value
                                        )
                                      }
                                      onKeyDown={(e) =>
                                        handleKeyPress({
                                          index,
                                          field: "desc",
                                          event: e,
                                          rows: noTaxRows,
                                          setRows: setNoTaxRows,
                                          rowSelector: noTaxDescSelector,
                                        })
                                      }
                                    />
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                    }}
                                  >
                                    <input
                                      type="text"
                                      value={row.hsn}
                                      style={{
                                        width: "100%",
                                        border: "none",
                                        outline: "none",
                                        fontSize: "14px",
                                        boxShadow: "none",
                                      }}
                                      onChange={(e) =>
                                        handleNoTaxChange(
                                          index,
                                          "hsn",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                    }}
                                  >
                                    <input
                                      type="number"
                                      value={row.qty}
                                      style={{
                                        width: "100%",
                                        border: "none",
                                        outline: "none",
                                        fontSize: "14px",
                                        boxShadow: "none",
                                      }}
                                      onChange={(e) =>
                                        handleNoTaxChange(
                                          index,
                                          "qty",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                    }}
                                  >
                                    <input
                                      type="number"
                                      value={row.rate}
                                      data-notax-rate-index={index}
                                      style={{
                                        width: "100%",
                                        border: "none",
                                        outline: "none",
                                        fontSize: "14px",
                                        boxShadow: "none",
                                      }}
                                      onChange={(e) =>
                                        handleNoTaxChange(
                                          index,
                                          "rate",
                                          e.target.value
                                        )
                                      }
                                      onKeyDown={(e) =>
                                        handleKeyPress({
                                          index,
                                          field: "rate",
                                          event: e,
                                          rows: noTaxRows,
                                          setRows: setNoTaxRows,
                                          rowSelector: noTaxRateSelector,
                                        })
                                      }
                                    />
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                    }}
                                  >
                                    <input
                                      type="text"
                                      value={row.amount}
                                      readOnly
                                      style={{
                                        width: "100%",
                                        border: "none",
                                        outline: "none",
                                        fontSize: "14px",
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                <td
                                  colSpan="5"
                                  style={{
                                    textAlign: "right",
                                    fontWeight: "bold",
                                    padding: "3px",
                                    border: "1px solid #000",
                                  }}
                                >
                                  Total (₹):
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #000",
                                    padding: "3px",
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={noTaxTotalAmount.toFixed(2)}
                                    readOnly
                                    style={{
                                      width: "100%",
                                      border: "none",
                                      outline: "none",
                                      fontSize: "14px",
                                    }}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td
                                  colSpan="5"
                                  style={{
                                    textAlign: "right",
                                    fontWeight: "bold",
                                    padding: "3px",
                                    border: "1px solid #000",
                                  }}
                                >
                                  Round Off (₹):
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #000",
                                    padding: "3px",
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={noTaxRoundOff.toFixed(2)}
                                    readOnly
                                    style={{
                                      width: "100%",
                                      border: "none",
                                      outline: "none",
                                      fontSize: "14px",
                                    }}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td
                                  colSpan="5"
                                  style={{
                                    textAlign: "right",
                                    fontWeight: "bold",
                                    padding: "3px",
                                    border: "1px solid #000",
                                  }}
                                >
                                  Final Total (₹):
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #000",
                                    padding: "3px",
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={noTaxFinalTotal}
                                    readOnly
                                    style={{
                                      width: "100%",
                                      border: "none",
                                      outline: "none",
                                      fontSize: "14px",
                                    }}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td
                                  colSpan="6"
                                  style={{
                                    textAlign: "right",
                                    border: "1px solid #000",
                                    padding: "3px",
                                  }}
                                >
                                  <b>Amount in Words: </b>
                                  <p>{noTaxTotalInWords} Rupees Only</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div
                          className="footer-section"
                          style={{
                            marginTop: "2px",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            className="payment-section"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            <h4
                              style={{
                                fontWeight: "bold",
                                marginBottom: "0px",
                                color: "#000",
                                fontSize: "12px",
                                marginTop: "5px",
                              }}
                            >
                              BANK DETAILS
                            </h4>
                            <div
                              className="payment-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                                textAlign: "left",
                              }}
                            >
                              <p
                                style={{
                                  textAlign: "left",
                                  fontWeight: "bold",
                                  width: "140px",
                                }}
                              >
                                Bank Name:
                              </p>
                              <p style={{ textAlign: "left" }}>HDFC Bank</p>
                            </div>

                            <div
                              className="payment-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                                textAlign: "left",
                              }}
                            >
                              <p
                                style={{
                                  textAlign: "left",
                                  fontWeight: "bold",
                                  width: "140px",
                                }}
                              >
                                A/c Holder Name:
                              </p>
                              <p style={{ textAlign: "left" }}>
                                TechKisan Automation
                              </p>
                            </div>

                            <div
                              className="payment-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                                textAlign: "left",
                              }}
                            >
                              <p
                                style={{
                                  textAlign: "left",
                                  fontWeight: "bold",
                                  width: "140px",
                                }}
                              >
                                Account No.:
                              </p>
                              <p style={{ textAlign: "left" }}>
                                50200063151545
                              </p>
                            </div>

                            <div
                              className="payment-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                                textAlign: "left",
                              }}
                            >
                              <p
                                style={{
                                  textAlign: "left",
                                  fontWeight: "bold",
                                  width: "140px",
                                }}
                              >
                                IFSC Code:
                              </p>
                              <p style={{ textAlign: "left" }}>HDFC000963</p>
                            </div>

                            <div className="UPI-section-main">
                              <h4>PAYMENT VIA QR CODE</h4>
                              <div
                                className="UPI-section"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  textAlign: "left",
                                }}
                              >
                                <div>
                                  <p>
                                    <strong>UPI ID:</strong>
                                  </p>
                                  <p>9511831914@hdfcbank</p>
                                  <p>8698105221@hdfcbank</p>
                                  <div>
                                    <img
                                      src={paymentbase64}
                                      alt="payment icons"
                                      style={{
                                        height: "30px",
                                        width: "145px",
                                        marginTop: "5px",
                                      }}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <img
                                    src={barcodebase64}
                                    alt="QR code"
                                    style={{ height: "78px", width: "78px" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="signature-section"
                            style={{ textAlign: "left", marginTop: "5px" }}
                          >
                            <p>
                              <strong>For Techkisan Automation</strong>
                            </p>
                            <img
                              src={signaturebase64}
                              alt="Signature"
                              style={{
                                width: "105px",
                                height: "100px",
                                marginLeft: "40px",
                              }}
                            />
                            <p style={{ fontSize: "10px", marginLeft: "25px" }}>
                              <i>Computer Generated Invoice</i>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* SOLAR INVOIVE */}
                {activeItem === "solar-invoice" && (
                  <div className="content-box">
                    <div style={{ marginLeft: "170px" }}>
                      <LoadingButton 
                        className="save-button-invoice"
                        onClick={handleSaveSolar}
                        isLoading={isLoading}
                        disabled={isSavedSolar || isLoading}
                      >
                        Save
                      </LoadingButton>
                      <button
                        style={{ marginBottom: "10px" }}
                        className="print-button-invoice"
                        onClick={handlePrint2}
                        disabled={!isSavedSolar}
                      >
                        Print
                      </button>
                      <p style={{ color: "green" }}>
                        {successMessageSolarTax ? successMessageSolarTax : ""}
                      </p>
                      <p style={{ color: "red" }}>
                        {errorMessageSolarTax ? errorMessageSolarTax : ""}
                      </p>
                      <div
                        ref={printRef}
                        className="solar-invoice-container"
                        style={{
                          width: "90%",
                          margin: "auto",
                          border: "1px solid #000",
                          fontFamily: "Arial, sans-serif",
                          background: "#fff",
                          marginBottom: "10px",
                        }}
                      >
                        <div
                          className="solar-header"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "5px",
                          }}
                        >
                          <div
                            className="solar-company-details"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            <h2
                              style={{
                                fontSize: "18px",
                                textTransform: "uppercase",
                                color: "#000",
                                marginBottom: "4px",
                              }}
                            >
                              Techkisan Automation
                            </h2>
                            <p
                              style={{
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              Ambule Building, Shrinagar, Near Murri Chawky,
                              Gondia - 441601
                            </p>
                            <p
                              style={{
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              Tel. No.: +91-7972025213 / +91-9511831914
                            </p>
                            <p
                              style={{
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              GSTN: 27AAQFT9534N1Z5
                            </p>
                            <p
                              style={{
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              PAN No.: AAQFT9534N
                            </p>
                          </div>

                          <div className="logo-solar">
                            <img
                              src={logobase64}
                              alt="Company Logo"
                              className="solar-logo"
                              style={{ height: "60px", width: "250px", margin: '10px'}}
                            />
                          </div>
                        </div>
                        {/* <div
                          className="WOno"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            width: "100%",
                            backgroundColor: "#3e6e17",
                            fontSize: "12px",
                            color: "white",
                            // padding: "2px",
                            fontWeight: "bold",
                          }}
                        >
                          <div
                            className="solar-left-section"
                            style={{
                              textAlign: "left",
                            }}
                          >
                            <p
                              style={{
                                margin: "0",
                              }}
                            >
                              Techkisan Automation
                            </p>
                          </div>
                          <p
                            className="solar-right-section"
                            style={{
                              textAlign: "right",
                              lineHeight: "20px",
                            }}
                          >
                            GSTN: 27AAQFT9534N1Z5
                          </p>
                        </div> */}

                        <div
                          style={{
                            marginTop: "0px",
                            fontSize: "18px",
                            fontWeight: "bold",
                            backgroundColor: "rgb(207, 207, 123)",
                            padding: "3px",
                            textAlign: "center",
                            borderTop: "1px solid black"
                          }}
                        >
                          Tax Invoice
                        </div>

                        <div
                          style={{
                            width: "100%",
                          }}
                        >
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              
                            }}
                          >
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    width: "50%",
                                    borderTop: "1px solid black",
                                    borderBottom: "1px solid black",
                                    borderRight: "1px solid black",
                                    borderLeft: "none",
                                    padding: "2px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  <strong>Invoice No:</strong>{" "}
                                <input type="text" value={solarInvoiceNumber} onChange={(e) => setSolarInvoiceNumber(e.target.value)}></input>
                                </td>
                                <td
                                  style={{
                                    width: "50%",
                                    borderTop: "1px solid black",
                                    borderBottom: "1px solid black",
                                    borderRight: "none",
                                    borderLeft: "none",
                                    padding: "2px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  <label htmlFor="TransportMode">
                                    <strong>Transport Mode:</strong>
                                    <input
                                      type="text"
                                      id="TransportMode"
                                      defaultValue="ROAD"
                                      style={{
                                        marginLeft: "8px",
                                        fontSize: "12px",
                                        border: "none",
                                        background: "transparent",
                                      }}
                                    />
                                  </label>
                                </td>
                              </tr>

                              <tr>
                                <td
                                  style={{
                                    width: "50%",
                                    borderTop: "1px solid black",
                                    borderBottom: "1px solid black",
                                    borderRight: "1px solid black",
                                    borderLeft: "none",
                                    padding: "2px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  <label htmlFor="date-of-issue3">
                                    <strong>Invoice Date:</strong>
                                  </label>
                                  <input
                                    type="text"
                                    id="date-of-issue3"
                                    name="date-of-issue"
                                    value={issueDate3}
                                    onChange={(e) =>
                                      setIssueDate3(e.target.value)
                                    }
                                    style={{
                                      fontSize: "12px",
                                      border: "none",
                                      background: "transparent",
                                      marginLeft: 0,
                                    }}
                                  />
                                </td>
                                <td
                                  style={{
                                    width: "50%",
                                    borderTop: "1px solid black",
                                    borderBottom: "1px solid black",
                                    borderRight: "none",
                                    borderLeft: "none",
                                    padding: "2px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  <label htmlFor="solar-vehicle-number">
                                    <strong>Vehicle Number:</strong>
                                    <input
                                      type="text"
                                      id="solar-vehicle-number"
                                      defaultValue={vehicleNo}
                                      style={{
                                        marginLeft: "8px",
                                        fontSize: "12px",
                                        border: "none",
                                        background: "transparent",
                                      }}
                                      onChange={(e) =>
                                        setVehicleNo(e.target.value)
                                      }
                                    />
                                  </label>
                                </td>
                              </tr>

                              <tr>
                                <td
                                  style={{
                                    width: "50%",
                                    borderTop: "1px solid black",
                                    borderBottom: "1px solid black",
                                    borderRight: "1px solid black",
                                    borderLeft: "none",
                                    padding: "2px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  <label htmlFor="reverse-charge">
                                    <strong>Reverse Charge (Y/N):</strong>
                                    <input
                                      type="text"
                                      id="reverse-charge"
                                      defaultValue="N"
                                      maxLength={1}
                                      style={{
                                        width: "30px",
                                        marginLeft: "8px",
                                        fontSize: "12px",
                                        border: "none",
                                        background: "transparent",
                                      }}
                                    />
                                  </label>
                                </td>
                                <td
                                  style={{
                                    width: "50%",
                                    borderTop: "1px solid black",
                                    borderBottom: "1px solid black",
                                    borderRight: "none",
                                    borderLeft: "none",
                                    padding: "2px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  <label htmlFor="date-of-visit">
                                    <strong>Date of Visit:</strong>
                                    <input
                                      type="text"
                                      id="date-of-visit"
                                      defaultValue={dateofvisit}
                                      onChange={(e) =>
                                        setDateofvisit(e.target.value)
                                      }
                                      style={{
                                        marginLeft: "8px",
                                        fontSize: "12px",
                                        border: "none",
                                        background: "transparent",
                                      }}
                                    />
                                  </label>
                                </td>
                              </tr>

                              <tr>
                                <td
                                  style={{
                                    width: "50%",
                                    borderTop: "1px solid black",
                                    borderBottom: "1px solid black",
                                    borderRight: "1px solid black",
                                    borderLeft: "none",
                                    padding: "2px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  <label htmlFor="state-of-supply">
                                    <strong>State:</strong>
                                    <input
                                      type="text"
                                      id="state-of-supply"
                                      defaultValue="Maharashtra"
                                      style={{
                                        marginLeft: "8px",
                                        fontSize: "12px",
                                        border: "none",
                                        background: "transparent",
                                      }}
                                    />
                                  </label>
                                </td>
                                <td
                                  style={{
                                    width: "50%",
                                    borderTop: "1px solid black",
                                    borderBottom: "1px solid black",
                                    borderRight: "none",
                                    borderLeft: "none",
                                    padding: "2px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  <label htmlFor="place-of-supply">
                                    <strong>Place of Supply:</strong>
                                    <input
                                      type="text"
                                      id="place-of-supply"
                                      defaultValue={placeofSupply}
                                      onChange={(e) =>
                                        setPlaceofSupply(e.target.value)
                                      }
                                      style={{
                                        marginLeft: "8px",
                                        fontSize: "12px",
                                        border: "none",
                                        background: "transparent",
                                      }}
                                    />
                                  </label>
                                </td>
                              </tr>

                              <tr>
                                <td
                                  style={{
                                    width: "50%",
                                    borderTop: "1px solid black",
                                    borderBottom: "1px solid black",
                                    borderRight: "1px solid black",
                                    borderLeft: "none",
                                    padding: "2px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  <label htmlFor="code">
                                    <strong>Code:</strong>
                                    <input
                                      type="text"
                                      id="code"
                                      defaultValue={code}
                                      onChange={(e) =>
                                        setCode(e.target.value)
                                      }
                                      style={{
                                        width: "20%",
                                        marginLeft: "8px",
                                        fontSize: "12px",
                                        border: "none",
                                        background: "transparent",
                                      }}
                                    />
                                  </label>
                                </td>
                                <td
                                  style={{
                                    width: "50%",
                                    borderTop: "1px solid black",
                                    borderBottom: "1px solid black",
                                    borderRight: "none",
                                    borderLeft: "none",
                                    padding: "2px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                    verticalAlign: "middle",
                                  }}
                                />
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div
                          style={{
                            width: "100%",
                            margin: "5px 0",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                              backgroundColor: "#fdefb2",
                              fontWeight: "bold",
                              fontSize: "14px",
                              padding: "2px 0px",
                              borderTop: "1px solid black"
                            }}
                          >
                            <p>Quote To Party </p>
                            <p>Ship to Party</p>
                          </div>
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              textAlign: "left",
                            }}
                          >
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    borderLeft: "none",
                                    padding: "2px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                  }}
                                >
                                  <label htmlFor="QuoteToPartyName">
                                    <strong>Name:</strong>
                                    <input
                                      type="text"
                                      id="QuoteToPartyName"
                                      value={partyName3}
                                      onChange={(e) =>
                                        setPartyName3(e.target.value)
                                      }
                                      defaultValue=""
                                      style={{
                                        width: "80%",
                                        marginLeft: "8px",
                                        fontSize: "12px",
                                        border: "transparent",
                                        background: "transparent",
                                      }}
                                    />
                                  </label>
                                </td>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    borderLeft: "none",
                                    padding: "2px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                  }}
                                >
                                  <label htmlFor="ShiptoPartyName">
                                    <strong>Name:</strong>
                                    <input
                                      type="text"
                                      id="ShiptoPartyName"
                                      defaultValue={shipName}
                                      onChange={(e) =>
                                        setShipName(e.target.value)
                                      }
                                      style={{
                                        width: "80%",
                                        marginLeft: "8px",
                                        fontSize: "12px",
                                        border: "transparent",
                                        background: "transparent",
                                      }}
                                    />
                                  </label>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    borderLeft: "none",
                                    padding: "2px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                  }}
                                >
                                  <label htmlFor="QuoteToPartyAddress">
                                    <strong>Address:</strong>
                                    <input
                                      type="text"
                                      id="QuoteToPartyAddress"
                                      defaultValue={quoteAddress}
                                      onChange={(e) =>
                                        setQuoteAddress(e.target.value)
                                      }
                                      style={{
                                        width: "80%",
                                        marginLeft: "8px",
                                        fontSize: "12px",
                                        border: "transparent",
                                        background: "transparent",
                                      }}
                                    />
                                  </label>
                                </td>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    borderLeft: "none",
                                    padding: "2px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                  }}
                                >
                                  <label htmlFor="ShiptoPartyAddress">
                                    <strong>Address:</strong>
                                    <input
                                      type="text"
                                      id="ShiptoPartyAddress"
                                      defaultValue={shipAddress}
                                      onChange={(e) =>
                                        setShipAddress(e.target.value)
                                      }
                                      style={{
                                        width: "80%",
                                        marginLeft: "8px",
                                        fontSize: "12px",
                                        border: "transparent",
                                        background: "transparent",
                                      }}
                                    />
                                  </label>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    borderLeft: "none",
                                    padding: "2px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                  }}
                                >
                                  <label htmlFor="QuoteToPartyGSTN">
                                    <strong>GSTN:</strong>
                                    <input
                                      type="text"
                                      id="QuoteToPartyGSTN"
                                      defaultValue={quotegstin}
                                      onChange={(e) =>
                                        setQuoteGstin(e.target.value)
                                      }
                                      style={{
                                        width: "50%",
                                        marginLeft: "8px",
                                        fontSize: "12px",
                                        border: "transparent",
                                        background: "transparent",
                                      }}
                                    />
                                  </label>
                                </td>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    borderLeft: "none",
                                    padding: "2px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                  }}
                                >
                                  <label htmlFor="ShiptoPartyGSTN">
                                    <strong>GSTN:</strong>
                                    <input
                                      type="text"
                                      id="ShiptoPartyGSTN"
                                      defaultValue={shipGstin}
                                      onChange={(e) =>
                                        setShipGstin(e.target.value)
                                      }
                                      style={{
                                        width: "50%",
                                        marginLeft: "8px",
                                        fontSize: "12px",
                                        border: "transparent",
                                        background: "transparent",
                                      }}
                                    />
                                  </label>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    borderLeft: "none",
                                    padding: "2px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                  }}
                                >
                                  <label htmlFor="QuoteToPartyState">
                                    <strong>State:</strong>
                                    <input
                                      type="text"
                                      defaultValue="Maharashtra"
                                      id="QuoteToPartyState"
                                      style={{
                                        marginLeft: "8px",
                                        fontSize: "12px",
                                        border: "transparent",
                                        background: "transparent",
                                      }}
                                    />
                                  </label>
                                </td>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    borderLeft: "none",
                                    padding: "2px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                  }}
                                >
                                  <label htmlFor="ShiptoPartyState">
                                    <strong>State:</strong>
                                    <input
                                      type="text"
                                      defaultValue="Maharashtra"
                                      id="ShiptoPartyState"
                                      style={{
                                        marginLeft: "8px",
                                        fontSize: "12px",
                                        border: "transparent",
                                        background: "transparent",
                                      }}
                                    />
                                  </label>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    borderLeft: "none",
                                    padding: "2px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                  }}
                                >
                                  <label htmlFor="QuoteToPartyCode">
                                    <strong>Code:</strong>
                                    <input
                                      type="text"
                                      defaultValue={quotesCode}
                                      onChange={(e) =>
                                        setQuoteCode(e.target.value)
                                      }
                                      id="QuoteToPartyCode"
                                        style={{
                                        width: "20%",
                                        marginLeft: "8px",
                                        fontSize: "12px",
                                        border: "transparent",
                                        background: "transparent",
                                      }}
                                    />
                                  </label>
                                </td>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    borderLeft: "none",
                                    padding: "2px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                  }}
                                >
                                  <label htmlFor="ShiptoPartyCode">
                                    <strong>Code:</strong>
                                    <input
                                      type="text"
                                      defaultValue={shipCode}
                                      onChange={(e) =>
                                        setShipCode(e.target.value)
                                      }
                                      id="ShiptoPartyCode"
                                      style={{
                                        width: "20%",
                                        marginLeft: "8px",
                                        fontSize: "12px",
                                        border: "transparent",
                                        background: "transparent",
                                      }}
                                    />
                                  </label>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="solar-rate">
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                            }}
                          >
                            <thead>
                              <tr
                                style={{ fontSize: "10px", fontWeight: "bold" }}
                              >
                                <th
                                  rowSpan="2"
                                  style={{
                                    backgroundColor: "#fdefb2",
                                    padding: "5px",
                                    textAlign: "center",
                                    border: "1px solid #000",
                                  }}
                                >
                                  Sr. No
                                </th>
                                <th
                                  rowSpan="2"
                                  style={{
                                    backgroundColor: "#fdefb2",
                                    padding: "5px",
                                    textAlign: "center",
                                    border: "1px solid #000",
                                  }}
                                >
                                  Description
                                </th>
                                <th
                                  rowSpan="2"
                                  style={{
                                    backgroundColor: "#fdefb2",
                                    padding: "5px",
                                    textAlign: "center",
                                    border: "1px solid #000",
                                  }}
                                >
                                  UOM
                                </th>
                                <th
                                  rowSpan="2"
                                  style={{
                                    backgroundColor: "#fdefb2",
                                    padding: "5px",
                                    textAlign: "center",
                                    border: "1px solid #000",
                                  }}
                                >
                                  Qty
                                </th>
                                <th
                                  rowSpan="2"
                                  style={{
                                    backgroundColor: "#fdefb2",
                                    padding: "5px",
                                    textAlign: "center",
                                    border: "1px solid #000",
                                  }}
                                >
                                  Rate
                                </th>
                                <th
                                  rowSpan="2"
                                  style={{
                                    backgroundColor: "#fdefb2",
                                    padding: "5px",
                                    textAlign: "center",
                                    border: "1px solid #000",
                                  }}
                                >
                                  Taxable Amount
                                </th>
                                <th
                                  colSpan="2"
                                  style={{
                                    backgroundColor: "#fdefb2",
                                    padding: "5px",
                                    textAlign: "center",
                                    border: "1px solid #000",
                                  }}
                                >
                                  CGST
                                </th>
                                <th
                                  colSpan="2"
                                  style={{
                                    backgroundColor: "#fdefb2",
                                    padding: "5px",
                                    textAlign: "center",
                                    border: "1px solid #000",
                                  }}
                                >
                                  SGST
                                </th>
                                <th
                                  colSpan="3"
                                  style={{
                                    backgroundColor: "#fdefb2",
                                    padding: "5px",
                                    textAlign: "center",
                                    border: "1px solid #000",
                                  }}
                                >
                                  Total
                                </th>
                              </tr>
                              <tr
                                style={{ fontSize: "10px", fontWeight: "bold" }}
                              >
                                {[
                                  "Rate",
                                  "Amount",
                                  "Rate",
                                  "Amount",
                                  "Rate",
                                  "Amount",
                                  "Total",
                                ].map((heading, index) => (
                                  <th
                                    key={index}
                                    style={{
                                      backgroundColor: "#fdefb2",
                                      padding: "5px",
                                      textAlign: "center",
                                      border: "1px solid #000",
                                    }}
                                  >
                                    {heading}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {calculatedRows.map((row, index) => (
                                <tr
                                  key={index}
                                  style={{
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                      padding: "5px",
                                    }}
                                  >
                                    {row.srNo}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                      padding: "5px",
                                    }}
                                  >
                                    <textarea
                                      value={items[index]?.description || ""}
                                      onChange={(e) => {
                                        const updatedItems = [...items];
                                        updatedItems[index].description =
                                          e.target.value;
                                        setItems(updatedItems);
                                      }}
                                      rows={3}
                                      style={{
                                        width: "100%",
                                        padding: "2px",
                                        border: "none",
                                        fontSize: "10px",
                                        background: "transparent",
                                        boxSizing: "border-box",
                                        resize: "none",
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                      }}
                                    />
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                      padding: "5px",
                                    }}
                                  >
                                    {row.uom}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                      padding: "5px",
                                    }}
                                  >
                                    {row.qty}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                      padding: "5px",
                                    }}
                                  >
                                    {isNaN(Number(row.rate)) ? "" : row.rate}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                      padding: "5px",
                                    }}
                                  >
                                    {isNaN(Number(row.taxableAmount))
                                      ? ""
                                      : row.taxableAmount}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                      padding: "5px",
                                    }}
                                  >
                                    {row.cgst}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                      padding: "5px",
                                    }}
                                  >
                                    {isNaN(Number(row.cgstAmount))
                                      ? ""
                                      : row.cgstAmount}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                      padding: "5px",
                                    }}
                                  >
                                    {row.sgst}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                      padding: "5px",
                                    }}
                                  >
                                    {isNaN(Number(row.sgstAmount))
                                      ? ""
                                      : row.sgstAmount}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                      padding: "5px",
                                    }}
                                  >
                                    {row.totalRate}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                      padding: "5px",
                                    }}
                                  >
                                    {isNaN(Number(row.totalTax))
                                      ? ""
                                      : row.totalTax}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                      padding: "5px",
                                    }}
                                  >
                                    {isNaN(Number(row.grandTotal))
                                      ? ""
                                      : row.grandTotal}
                                  </td>
                                </tr>
                              ))}

                              <tr
                                style={{ fontSize: "10px", fontWeight: "bold" }}
                              >
                                <td
                                  colSpan="5"
                                  style={{
                                    backgroundColor: "#fdefb2",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                    padding: "5px",
                                  }}
                                >
                                  <strong>Total</strong>
                                </td>
                                <td
                                  style={{
                                    backgroundColor: "#fdefb2",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                    padding: "5px",
                                  }}
                                >
                                  <strong>
                                    {isNaN(Number(totals.beforeTax))
                                      ? ""
                                      : totals.beforeTax}
                                  </strong>
                                </td>
                                <td
                                  style={{ border: "1px solid" }}
                                  colSpan="2"
                                ></td>
                                <td
                                  style={{ border: "1px solid" }}
                                  colSpan="2"
                                ></td>
                                <td
                                  style={{ border: "1px solid" }}
                                  colSpan="2"
                                ></td>
                                <td
                                  style={{
                                    backgroundColor: "#fdefb2",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                    padding: "5px",
                                  }}
                                >
                                  <strong>
                                    {isNaN(Number(totals.tax))
                                      ? ""
                                      : totals.tax}
                                  </strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="difficult-container">
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              borderTop: '1px solid black'
                            }}
                          >
                            <div style={{ width: "60%" }}>
                              <div
                                style={{
                                  backgroundColor: "#d9edf7",
                                  padding: "5px",
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                  textAlign: "center",
                                  borderBottom: "1px solid #000",
                                }}
                              >
                                Other comments or special Instructions
                              </div>

                              <div
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                  padding: "5px",
                                  textAlign: "center",
                                }}
                                htmlFor="Handoverdates"
                              >
                                <strong>Handover Date:</strong>
                                <input
                                  type="text"
                                  defaultValue={handhoverDate}
                                  onChange={(e) =>
                                    setHandhoverDate(e.target.value)
                                  }
                                  id="Handoverdates"
                                  style={{
                                    fontSize: "16px",
                                    marginLeft: "8px",
                                    border: "transparent",
                                    background: "transparent",
                                  }}
                                />
                              </div>

                              <table
                                style={{
                                  width: "100%",
                                  borderCollapse: "collapse",
                                }}
                              >
                                <thead>
                                  <tr>
                                    <th
                                      style={{
                                        backgroundColor: "rgb(207, 207, 123)",
                                        padding: "5px",
                                        border: "1px solid #000",
                                        borderLeft: "none",
                                        fontSize: "12px",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Bank Details
                                    </th>
                                    <th
                                      style={{
                                        backgroundColor: "rgb(207, 207, 123)",
                                        padding: "5px",
                                        border: "1px solid #000",
                                        borderLeft: "none",
                                        fontSize: "12px",
                                        textAlign: "center",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Company Details
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td
                                      style={{
                                        fontSize: "16px",
                                        padding: "5px",
                                        border: "1px solid #000",
                                        borderLeft: "none",
                                        fontWeight: "bold",
                                        textAlign: "left",
                                      }}
                                    >
                                      A/C No.: 50200063151545
                                    </td>
                                    <td
                                      rowSpan={2}
                                      style={{
                                        textAlign: "center",
                                        padding: "5px",
                                        border: "1px solid #000",
                                        borderLeft: "none",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      TECHKISAN AUTOMATION
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        padding: "5px",
                                        border: "1px solid #000",
                                        borderLeft: "none",
                                        fontSize: "12px",
                                        textAlign: "left",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Bank Name: HDFC BANK
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        padding: "5px",
                                        border: "1px solid #000",
                                        borderLeft: "none",
                                        fontSize: "12px",
                                        textAlign: "left",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Bank IFSC Code: HDFC0000963
                                    </td>
                                    <td
                                      rowSpan={3}
                                      style={{
                                        textAlign: "center",
                                        padding: "5px",
                                        border: "1px solid #000",
                                        borderLeft: "none",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      GSTN: 27AAQFT9534N1Z5
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        padding: "5px",
                                        border: "1px solid #000",
                                        borderLeft: "none",
                                        fontSize: "12px",
                                        textAlign: "left",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Mobile No.: 7972025213 / 9511831914
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        padding: "5px",
                                        border: "1px solid #000",
                                        borderLeft: "none",
                                        fontSize: "12px",
                                        textAlign: "left",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Mail Id: tkn.automation@gmail.com
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <div style={{height: '5px', backgroundColor: "rgb(253, 239, 178)", borderRight: "1px solid"}}></div>
                              <div
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                }}
                              >
                                <div style={{ width: "55%" }}>
<table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "center",
    fontSize: "11px",
  }}
>
  <thead>
    <tr>
      <th
        colSpan={2}
        style={{
          border: "1px solid #000",
          padding: "2px",
          backgroundColor: "#d0dae6",
          fontWeight: "bold",
        }}
      >
        PANEL'S <br />
        SERIAL NO:-
      </th>
    </tr>
  </thead>
  <tbody>
    {panelCells.reduce((rows, cell, i) => {
      if (i % 2 === 0) rows.push([cell]);
      else rows[rows.length - 1].push(cell);
      return rows;
    }, []).map((row, rowIndex) => (
      <tr key={rowIndex}>
        {row.map((val, colIndex) => {
          const index = rowIndex * 2 + colIndex;
          return (
            <td
              key={index}
              style={{
                border: "1px solid #000",
                padding: "2px",
              }}
            >
              <input
                value={val}
                onChange={(e) => handlePanelChange(e, index)}
                onKeyDown={(e) => handlePanelKeyDown(e, index)}
                ref={(el) => (panelInputRefs.current[index] = el)}
                style={{ border: "none", width: "100px" }}
              />
            </td>
          );
        })}
        {row.length < 2 && (
          <td
            style={{
              border: "1px solid #000",
              padding: "2px",
            }}
          ></td>
        )}
      </tr>
    ))}
  </tbody>
</table>

                                </div>
                                <div style={{ width: "45%" }}>
                                  <table style={{
                                      width: "100%",
                                      borderCollapse: "collapse",
                                      textAlign: "center",
                                      fontSize: "11px",
                                    }}>
                                    <thead>
                                      <tr>
                                        <th
                                          style={{
                                            border: "1px solid #000",
                                            padding: "2px",
                                            backgroundColor: "#d0dae6",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          INVERTER <br />
                                          SERIAL NO:-
                                        </th>
                                        <th
                                          style={{
                                            border: "1px solid #000",
                                            padding: "2px",
                                          }}
                                        >
                                          <input 
                                          value={inverterSNo}
                                          onChange={(e)=>{setInverterSNo(e.target.value)}}
                                          style={{border: "none", width: "100px", textAlign: "center",}}></input>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td
                                          colSpan={2}
                                          className="highlight"
                                          style={{
                                            border: "1px solid #000",
                                            padding: "2px",
                                            backgroundColor: "yellow",
                                            fontWeight: "bold",
                                            color: "red",
                                            
                                          }}
                                        >
                                          <input 
                                          style={{
                                            border: "none",
                                            width: '0px',
                                            backgroundColor: "yellow",
                                          }}
                                          >
                                          </input>
                                          Warranty:
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="highlight"
                                          style={{
                                            border: "1px solid #000",
                                            padding: "2px 20px",
                                            backgroundColor: "yellow",
                                            fontWeight: "bold",
                                            color: "red",
                                          }}
                                        >
                                          Panels:
                                        </td>
                                         <td
                                         
                                          className="highlight"
                                          style={{
                                            border: "1px solid #000",
                                            padding: "2px",
                                            backgroundColor: "yellow",
                                            fontWeight: "bold",
                                            color: "red",
                                          }}
                                        >
                                          <input 
                                          style={{
                                            border: "none",
                                            width: '20px',
                                            backgroundColor: 'yellow',
                                            textAlign: 'right',
                                            marginRight: '5px',
                                            color: 'red',
                                            fontWeight: "bold",
                                          }}
                                          defaultValue={"25"}
                                          >
                                          </input>
                                          years
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          className="highlight"
                                          style={{
                                            border: "1px solid #000",
                                            padding: "2px",
                                            backgroundColor: "yellow",
                                            fontWeight: "bold",
                                            color: "red",
                                          }}
                                        >
                                          Inverter:
                                        </td>
                                        <td
                                          
                                          className="highlight"
                                          style={{
                                            border: "1px solid #000",
                                            padding: "2px 20px",
                                            backgroundColor: "yellow",
                                            fontWeight: "bold",
                                            color: "red",
                                          }}
                                        >
                                          <input 
                                          style={{
                                            border: "none",
                                            width: '20px',
                                            backgroundColor: 'yellow',
                                            textAlign: 'right',
                                            marginRight: '5px',
                                            color: 'red',
                                            fontWeight: "bold",
                                          }}
                                          defaultValue={"10"}
                                          > 
                                          </input>
                                          years
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>

                            <div
                              style={{
                                width: "40%",
                              }}
                            >
                              <table
                                style={{
                                  width: "100%",
                                  borderCollapse: "collapse",
                                }}
                              >
                                <tbody>
                                  <tr>
                                    <td
                                      className="label total-amount"
                                      style={{
                                        padding: "5px",
                                        border: "1px solid #000",
                                        borderTop: "none",
                                        borderRight: "none",
                                        fontSize: "12px",
                                        textAlign: "right",
                                        color: "#000",
                                        fontWeight: "bold",
                                        backgroundColor: "#d9edf7",
                                      }}
                                    >
                                      Total Amount Before Tax
                                    </td>
                                    <td
                                      className="value total-amount"
                                      style={{
                                        padding: "5px",
                                        border: "1px solid #000",
                                        borderTop: "none",
                                        borderRight: "none",
                                        fontSize: "12px",
                                        textAlign: "right",
                                        color: "#000",
                                        fontWeight: "bold",
                                        backgroundColor: "#d9edf7",
                                      }}
                                    >
                                      <strong>
                                        {isNaN(Number(totals.beforeTax))
                                          ? ""
                                          : totals.beforeTax}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      className="label tax-row"
                                      style={{
                                        padding: "5px",
                                        border: "1px solid #000",
                                        borderTop: "none",
                                        borderRight: "none",
                                        fontSize: "12px",
                                        textAlign: "right",
                                        color: "#000",
                                        fontWeight: "bold",
                                        backgroundColor: "#f5d0c5",
                                      }}
                                    >
                                      Total Tax Amount GST
                                    </td>
                                    <td
                                      className="value tax-row"
                                      style={{
                                        padding: "5px",
                                        border: "1px solid #000",
                                        borderTop: "none",
                                        borderRight: "none",
                                        fontSize: "12px",
                                        textAlign: "right",
                                        color: "#000",
                                        fontWeight: "bold",
                                        backgroundColor: "#f5d0c5",
                                      }}
                                    >
                                      <strong>
                                        {isNaN(Number(totals.tax))
                                          ? ""
                                          : totals.tax}
                                      </strong>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      className="label total-row"
                                      style={{
                                        color: "#000",
                                        padding: "5px",
                                        border: "1px solid #000",
                                        borderTop: "none",
                                        borderRight: "none",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        backgroundColor: "#d9edf7",
                                        textAlign: "right",
                                      }}
                                    >
                                      Total Payable Amount With Tax
                                    </td>
                                    <td
                                      className="value total-row"
                                      style={{
                                        padding: "5px",
                                        border: "1px solid #000",
                                        borderTop: "none",
                                        borderRight: "none",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        backgroundColor: "#d9edf7",
                                        textAlign: "right",
                                      }}
                                    >
                                      <input
                                        type="number"
                                        value={totalPayable}
                                        onChange={(e) => {
                                          setTotalPayable(e.target.value); // Let the user type freely
                                        }}
                                        onBlur={() => {
                                          const value =
                                            parseFloat(totalPayable);
                                          if (!isNaN(value)) {
                                            setTotalPayable(value.toFixed(2)); // Add .00 if needed
                                          }
                                        }}
                                        style={{
                                          color: "#000",
                                          width: "100%",
                                          border: "none",
                                          background: "transparent",
                                          fontSize: "20px",
                                          fontWeight: "bold",
                                          textAlign: "center",
                                        }}
                                      />
                                    </td>
                                  </tr>
                                  <tr style={{ border: "1px solid" }}>
                                    <td
                                      colSpan="2"
                                      className="label words-row"
                                      style={{
                                        columnSpan: "2",
                                        backgroundColor: "#f5d0c5",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      <b
                                        style={{
                                          color: "#000",
                                          fontSize: "12px",
                                        }}
                                      >
                                        In Words:
                                      </b>
                                      <p
                                        style={{
                                          fontWeight: "lighter",
                                          color: "#000",
                                          fontSize: "12px",
                                        }}
                                      >
                                        {solarTotalInWords} Rupees Only
                                      </p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                              <div
                                className="certification"
                                style={{
                                  textAlign: "center",
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                  margin: "10px 0",
                                }}
                              >
                                <p
                                  style={{
                                    lineHeight: "normal",
                                    fontSize: "10px",
                                  }}
                                >
                                  Certified that the particulars given above are
                                  true and correct
                                </p>
                                <img
                                  src={signaturebase64}
                                  alt="Signature"
                                  style={{
                                    // marginLeft: "125px",
                                    margin: "0px auto",
                                    width: "100px",
                                    height: "100px",
                                  }}
                                />
                                <div
                                  className="company-name"
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    lineHeight: "normal",
                                  }}
                                >
                                  <p>TechKisan Automation</p>
                                  <p style={{ fontWeight: "normal" }}>
                                    Authorized Signatory
                                  </p>
                                </div>
                                <hr></hr>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    lineHeight: "normal",
                                    marginTop: "10px",
                                  }}
                                >
                                  <p style={{ fontWeight: "normal" }}>
                                    <b>Terms & Conditions:</b> All Disputes are Subject to Home Jurisdiction
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* TAX QUOTATION */}
                {activeItem === "tax-quote" && (
                  <div className="content-box">
                    {/* <h2>Add-Reciept</h2> */}
                    <div>
                      <div className="button-container-invoice">
                        {/* Save Button */}
                        <LoadingButton 
                          className="save-button-invoice" 
                          onClick={handleSaveTaxQuote} 
                          isLoading={isLoading}
                          disabled={isSavedTaxQuote || isLoading}
                        >
                          Save
                        </LoadingButton>

                        {/* Print Button */}
                        <button
                          className="print-button-invoice"
                          onClick={handlePrint}
                          disabled={!isSavedTaxQuote}
                        >
                          Print
                        </button>
                      </div>
                      <p style={{ color: "green" }}>
                        {successMessageTaxQuote ? successMessageTaxQuote : ""}
                      </p>
                      <p style={{ color: "red" }}>
                        {errorMessageTaxQuote ? errorMessageTaxQuote : ""}
                      </p>

                      <div
                        className="invoice-container"
                        ref={componentRef}
                        style={{
                          width: "753px",
                          margin: "10px auto",
                          // marginLeft: "2.5%",
                          padding: "5px",
                          border: "1px solid #000",
                          backgroundColor: "#fff",
                          fontFamily: "Arial, sans-serif",
                          overflow: "auto",
                          fontSize: "smaller",
                        }}
                      >
                        <div style={{ textAlign: "center" }}>
                          <h2
                            style={{
                              color: "black",
                              marginBottom: "5px",
                            }}
                          >
                            Tax Quotation
                          </h2>
                        </div>
                        <div
                          className="invoice-header"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #000",
                            marginBottom: "5px",
                          }}
                        >
                          <div style={{ textAlign: "center" }}>
                            <img
                              src={logobase64}
                              alt="Company Logo"
                              style={{
                                paddingRight: "1%",
                                width: "200px",
                                height: "50px",
                              }}
                            />
                          </div>

                          <div
                            className="invoice-info"
                            style={{ width: "30%" }}
                          >
                            <div
                              className="invoice-info-row"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "10px",
                              }}
                            >
                              <label
                                htmlFor="invoice-no"
                                style={{ fontWeight: "bold" }}
                              >
                                Quotation No.:
                              </label>
                              <input
                                type="text"
                                id="invoice-no"
                                name="invoice-no"
                                value={taxQuotationNumber}
                                readOnly
                                style={{ border: "none", maxWidth: "120px" }}
                              />
                            </div>
                            <div
                              className="invoice-info-row"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "10px",
                              }}
                            >
                              <label
                                htmlFor="date-of-issue"
                                style={{ fontWeight: "bold" }}
                              >
                                Quotation Date:
                              </label>
                              <input
                                type="text"
                                id="date-of-issue"
                                name="date-of-issue"
                                value={issueDate4}
                                style={{ border: "none", maxWidth: "120px" }}
                                onChange={(e) => {
                                  setIssueDate4(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          className="invoice-fromto"
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            margin: "5px 0px",
                          }}
                        >
                          <div
                            className="from-section"
                            style={{ textAlign: "left", width: "40%" }}
                          >
                            <h3
                              style={{
                                fontWeight: "bolder",
                                fontSize: "larger",
                                color: "green",
                              }}
                            >
                              Quotation By
                            </h3>
                            <p>Techkisan Automation,</p>
                            <p>Nakade Complex, Mama Chawk, Civil Line</p>
                            <p>Gondia, Maharashtra, India - 441601</p>
                            <p>
                              <strong>Mobile No. :</strong>
                              <span style={{ margin: "0 3px" }}></span>
                              7972021213 | 9511831914
                            </p>
                            <p>
                              <strong>Email I'd :</strong>
                              <span style={{ margin: "0px 9px" }}></span>
                              tkn.automation@gmail.com
                            </p>
                            <p>
                              <strong>GST No. :</strong>
                              <span style={{ margin: "0px 9px" }}></span>
                              27AAQFT9534N1Z5
                            </p>
                          </div>
                          <div
                            className="to-section"
                            style={{ textAlign: "left", width: "40%" }}
                          >
                            <h3
                              style={{
                                fontWeight: "bolder",
                                fontSize: "larger",
                                color: "green",
                              }}
                            >
                              Quotation To
                            </h3>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              >
                                M/s.{" "}
                              </label>
                              <input
                                type="text"
                                name="partyName"
                                onChange={(e) =>
                                  setPartyNameTaxQuote(e.target.value)
                                }
                                value={partyNameTaxQuote}
                                style={{ width: "100%", border: "none" }}
                              />
                            </div>
                             <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              >
                              
                              </label>
                              <input
                                type="text"
                                name="partyName"
                                onChange={(e) =>
                                  setPartyNameTaxQuote2(e.target.value)
                                }
                                value={partyNameTaxQuote2}
                                style={{ width: "100%", border: "none" }}
                              />
                            </div>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              >
                                Address:
                              </label>
                              <input
                                style={{ border: "none", width: "100%" }}
                                type="text"
                                value={taxQuotAddress1}
                                onChange={(e) => {
                                  setTaxQuotAddress1(e.target.value);
                                }}
                              />
                            </div>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              ></label>
                              <input
                                style={{ border: "none", width: "100%" }}
                                type="text"
                                value={taxQuotAddress2}
                                onChange={(e) => {
                                  setTaxQuotAddress2(e.target.value);
                                }}
                              />
                            </div>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              ></label>
                              <input
                                style={{ border: "none", width: "100%" }}
                                type="text"
                                value={taxQuotAddress3}
                                onChange={(e) => {
                                  setTaxQuotAddress3(e.target.value);
                                }}
                              />
                            </div>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              >
                                Mobile No.:{" "}
                              </label>
                              <input
                                style={{ border: "none", width: "100%" }}
                                type="text"
                                value={taxQuotMobile}
                                onChange={(e) => {
                                  setTaxQuotMobile(e.target.value);
                                }}
                              />
                            </div>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              >
                                GST No.:{" "}
                              </label>
                              <input
                                style={{ border: "none", width: "100%" }}
                                type="text"
                                value={taxQuotGSTNo}
                                onChange={(e) => {
                                  setTaxQuotGSTNo(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div
                          className="invoice-table"
                          style={{ width: "100%", overflowX: "auto" }}
                        >
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              tableLayout: "fixed",
                            }}
                          >
                            <thead
                              style={{
                                height: "40px",
                                backgroundColor: "#d5e8d6",
                              }}
                            >
                              <tr>
                                <th
                                  style={{
                                    width: "4%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                  }}
                                >
                                  S.N.
                                </th>
                                <th
                                  style={{
                                    width: "34%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                  }}
                                >
                                  Product Description
                                </th>
                                <th
                                  style={{
                                    width: "10%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                  }}
                                >
                                  HSN
                                </th>
                                <th
                                  style={{
                                    width: "9%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                  }}
                                >
                                  Qty(N)
                                </th>
                                <th
                                  style={{
                                    width: "11%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                  }}
                                >
                                  Rate(₹)
                                </th>
                                <th
                                  style={{
                                    width: "12%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                    paddingBottom: "0px",
                                  }}
                                >
                                  Amount(₹)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {taxQuoteRows.map((row, index) => (
                                <tr key={index}>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                    }}
                                  >
                                    {index + 1}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      maxWidth: "200px",
                                      wordWrap: "break-word",
                                      overflowWrap: "break-word",
                                    }}
                                  >
                                    <textarea
                                      rows="3"
                                      style={{
                                        width: "100%",
                                        resize: "none",
                                        overflow: "hidden",
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        marginTop: "0px",
                                        border: "none",
                                        outline: "none",
                                        boxShadow: "none",
                                      }}
                                      value={row.desc}
                                      data-taxquote-index={index}
                                      onChange={(e) =>
                                        handleTaxQuoteChange(
                                          index,
                                          "desc",
                                          e.target.value
                                        )
                                      }
                                      onKeyDown={(e) =>
                                        handleKeyPress({
                                          index,
                                          field: "desc",
                                          event: e,
                                          rows: taxQuoteRows,
                                          setRows: setTaxQuoteRows,
                                          rowSelector: taxQuoteDescSelector,
                                        })
                                      }
                                    />
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                    }}
                                  >
                                    <input
                                      type="text"
                                      value={row.hsn}
                                      style={{
                                        width: "100%",
                                        border: "none",
                                        outline: "none",
                                        fontSize: "14px",
                                      }}
                                      onChange={(e) =>
                                        handleTaxQuoteChange(
                                          index,
                                          "hsn",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                    }}
                                  >
                                    <input
                                      type="number"
                                      value={row.qty}
                                      style={{
                                        width: "100%",
                                        border: "none",
                                        outline: "none",
                                        fontSize: "14px",
                                      }}
                                      onChange={(e) =>
                                        handleTaxQuoteChange(
                                          index,
                                          "qty",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                    }}
                                  >
                                    <input
                                      type="number"
                                      value={row.rate}
                                      data-taxquote-rate-index={index}
                                      style={{
                                        width: "100%",
                                        border: "none",
                                        outline: "none",
                                        fontSize: "14px",
                                      }}
                                      onChange={(e) =>
                                        handleTaxQuoteChange(
                                          index,
                                          "rate",
                                          e.target.value
                                        )
                                      }
                                      onKeyDown={(e) =>
                                        handleKeyPress({
                                          index,
                                          field: "rate",
                                          event: e,
                                          rows: taxQuoteRows,
                                          setRows: setTaxQuoteRows,
                                          rowSelector: taxQuoteRateSelector,
                                        })
                                      }
                                    />
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                    }}
                                  >
                                    <input
                                      type="text"
                                      value={row.amount}
                                      readOnly
                                      style={{
                                        width: "100%",
                                        border: "none",
                                        outline: "none",
                                        fontSize: "14px",
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                <td
                                  colSpan="5"
                                  style={{
                                    textAlign: "right",
                                    fontWeight: "bold",
                                    padding: "3px",
                                    border: "1px solid #000",
                                  }}
                                >
                                  Total (₹):
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #000",
                                    padding: "3px",
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={taxTotalAmountQuote.toFixed(2)}
                                    readOnly
                                    style={{
                                      width: "100%",
                                      border: "none",
                                      outline: "none",
                                      fontSize: "14px",
                                    }}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td
                                  colSpan="5"
                                  style={{
                                    textAlign: "right",
                                    fontWeight: "bold",
                                    border: "1px solid #000",
                                    padding: "3px",
                                    position: "relative",
                                  }}
                                  onClick={() => setShowDropdownQuote(true)}
                                  onBlur={() =>
                                    setTimeout(
                                      () => setShowDropdownQuote(false),
                                      200
                                    )
                                  }
                                >
                                {showDropdownQuote ? (
                                  <select
                                    value={taxTypeQuote}
                                    onChange={(e) => setTaxTypeQuote(e.target.value)}
                                    autoFocus
                                    style={{
                                      width: "110px",
                                      fontSize: "12px",
                                    }}
                                  >
                                    {Object.entries(taxOptionsQuote).map(([key, value]) => (
                                      <option key={key} value={key}>
                                        {value.label}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  taxOptionsQuote[taxTypeQuote]?.label || ""
                                )}

                                </td>
                                <td
                                  style={{ border: "1px solid #000", padding: "3px" }}
                                >
                                  <input
                                    type="text"
                                    value={gstAmountQuote.toFixed(2)}
                                    readOnly
                                    style={{
                                      width: "100%",
                                      border: "none",
                                      outline: "none",
                                      fontSize: "14px",
                                    }}
                                  />
                                </td>

                                </tr>
                                {taxTypeQuote.startsWith("IGST") && selectedTaxQuote.totalRate && (
                                  <>
                                    <tr>
                                      <td
                                        colSpan="5"
                                        style={{
                                          textAlign: "right",
                                          fontWeight: "bold",
                                          padding: "3px",
                                          border: "1px solid #000",
                                        }}
                                      >
                                        -CGST {Number((selectedTaxQuote.totalRate / 2) * 100).toFixed(2)}%
                                      </td>
                                      <td style={{ border: "1px solid #000" }}>
                                        <input
                                          type="text"
                                          value={(gstAmountQuote / 2).toFixed(2)}
                                          readOnly
                                          style={{
                                            width: "100%",
                                            border: "none",
                                            outline: "none",
                                            fontSize: "14px",
                                          }}
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        colSpan="5"
                                        style={{
                                          textAlign: "right",
                                          fontWeight: "bold",
                                          padding: "3px",
                                          border: "1px solid #000",
                                        }}
                                      >
                                        -SGST {Number((selectedTaxQuote.totalRate / 2) * 100).toFixed(2)}%
                                      </td>
                                      <td style={{ border: "1px solid #000" }}>
                                        <input
                                          type="text"
                                          value={(gstAmountQuote / 2).toFixed(2)}
                                          readOnly
                                          style={{
                                            width: "100%",
                                            border: "none",
                                            outline: "none",
                                            fontSize: "14px",
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  </>
                                )}

                              <tr>
                                <td
                                  colSpan="5"
                                  style={{
                                    textAlign: "right",
                                    fontWeight: "bold",
                                    padding: "3px",
                                    border: "1px solid #000",
                                  }}
                                >
                                  Round Off (₹):
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #000",
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={taxRoundOffQuote.toFixed(2)}
                                    readOnly
                                    style={{
                                      width: "100%",
                                      border: "none",
                                      outline: "none",
                                      fontSize: "14px",
                                    }}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td
                                  colSpan="5"
                                  style={{
                                    textAlign: "right",
                                    fontWeight: "bold",
                                    padding: "3px",
                                    border: "1px solid #000",
                                  }}
                                >
                                  Final Total (₹):
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #000",
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={taxRoundedTotalQuote.toFixed(2)}
                                    readOnly
                                    style={{
                                      width: "100%",
                                      border: "none",
                                      outline: "none",
                                      fontSize: "14px",
                                    }}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td
                                  colSpan="6"
                                  style={{
                                    textAlign: "right",
                                    padding: "3px",
                                    border: "1px solid #000",
                                  }}
                                >
                                  <b>Amount in Words:</b>
                                  <p>{taxTotalInWordsQuote} Rupees Only</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div
                          className="footer-section"
                          style={{
                            marginTop: "2px",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            className="payment-section"
                            style={{
                              textAlign: "left",
                              maxWidth: "70%",
                            }}
                          >
                            <h3
                              style={{
                                fontWeight: "bold",
                                marginTop: "5px",
                                color: "green",
                              }}
                            >
                              Terms and Conditions
                            </h3>

                            <div
                              className="payment-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                                textAlign: "left",
                              }}
                            >
                              <ol
                                style={{
                                  paddingLeft: "20px",
                                  listStyleType: "decimal",
                                  fontSize: "12px",
                                }}
                              >
                                <li>
                                  The quotation provided is valid for a period
                                  of 15 days from the date of issuance. Any
                                  changes in scope, material cost, or
                                  availability after this period may require a
                                  revised quotation.
                                </li>
                                <li>
                                  An advance payment of 50% is required to
                                  initiate the order. The remaining 50% shall be
                                  payable upon successful delivery or completion
                                  of the project, whichever is applicable.
                                </li>
                              </ol>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                              <h3
                                style={{
                                  fontWeight: "bold",
                                  marginTop: "5px",
                                  color: "green",
                                }}
                              >
                                Additional Notes
                              </h3>
                              <p style={{ fontSize: "12px" }}>
                                The quotation is based on current market rates
                                and scope of work. Any modifications or delays
                                may impact the final pricing or timeline. Terms
                                are subject to mutual agreement and
                                confirmation.
                              </p>
                            </div>
                          </div>
                          <div
                            className="signature-section"
                            style={{
                              textAlign: "left",
                              marginTop: "5px",
                              marginRight: "10px",
                            }}
                          >
                            <p>
                              <strong>For Techkisan Automation</strong>
                            </p>
                            <img
                              src={signaturebase64}
                              alt="Signature"
                              style={{
                                width: "105px",
                                height: "100px",
                                marginLeft: "40px",
                              }}
                            />
                            <p style={{ fontSize: "10px", marginLeft: "25px" }}>
                              <i>Computer Generated Invoice</i>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* NO TAX QUOTATION */}
                {activeItem === "notax-quote" && (
                  <div className="content-box">
                    {/* <h2>Add-Reciept</h2> */}
                    <div>
                      <div className="button-container-invoice">
                        {/* Save Button */}
                        <LoadingButton 
                          className="save-button-invoice" 
                          onClick={handleSaveQuote} 
                          isLoading={isLoading}
                          disabled={isSavedQuote || isLoading}
                        >
                          Save
                        </LoadingButton>

                        {/* Print Button */}
                        <button
                          className="print-button-invoice"
                          onClick={handlePrint}
                          disabled={!isSavedQuote}
                        >
                          Print
                        </button>
                        <p style={{ color: "green" }}>
                          {successMessageNoTaxQuote
                            ? successMessageNoTaxQuote
                            : ""}
                        </p>
                        <p style={{ color: "red" }}>
                          {errorMessageNoTaxQuote ? errorMessageNoTaxQuote : ""}
                        </p>
                      </div>

                      <div
                        className="invoice-container"
                        ref={componentRef}
                        style={{
                          width: "753px",
                          margin: "10px auto",
                          // marginLeft: "2.5%",
                          padding: "5px",
                          border: "1px solid #000",
                          backgroundColor: "#fff",
                          fontFamily: "Arial, sans-serif",
                          overflow: "auto",
                          fontSize: "smaller",
                        }}
                      >
                        <div style={{ textAlign: "center" }}>
                          <h2
                            style={{
                              color: "black",
                              marginBottom: "5px",
                            }}
                          >
                            Quotation
                          </h2>
                        </div>
                        <div
                          className="invoice-header"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #000",
                          }}
                        >
                          <div style={{ textAlign: "center" }}>
                            <img
                              src={logobase64}
                              alt="Company Logo"
                              style={{
                                paddingRight: "1%",
                                width: "200px",
                                height: "50px",
                              }}
                            />
                          </div>
                          <div
                            className="invoice-info"
                            style={{ width: "30%" }}
                          >
                            <div
                              className="invoice-info-row"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "10px",
                              }}
                            >
                              <label
                                htmlFor="invoice-no"
                                style={{ fontWeight: "bold" }}
                              >
                                Quotation No.:
                              </label>
                              <input
                                type="text"
                                id="invoice-no"
                                name="invoice-no"
                                value={notaxQuotationNumber}
                                style={{ border: "none", maxWidth: "120px" }}
                                readOnly
                              />
                            </div>
                            <div
                              className="invoice-info-row"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "10px",
                              }}
                            >
                              <label
                                htmlFor="date-of-issue"
                                style={{ fontWeight: "bold" }}
                              >
                                Quotation Date:
                              </label>
                              <input
                                type="text"
                                id="date-of-issue"
                                name="date-of-issue"
                                value={issueDate5}
                                style={{ border: "none", maxWidth: "120px" }}
                                onChange={(e) => {
                                  setIssueDate5(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          className="invoice-fromto"
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            margin: "5px 0px",
                          }}
                        >
                          <div
                            className="from-section"
                            style={{ textAlign: "left", width: "40%" }}
                          >
                            <h3
                              style={{
                                fontWeight: "bolder",
                                fontSize: "larger",
                                color: "green",
                              }}
                            >
                              Quotation By
                            </h3>
                            <p>Techkisan Automation,</p>
                            <p>Nakade Complex, Mama Chawk, Civil Line</p>
                            <p>Gondia, Maharashtra, India - 441601</p>
                            <p>
                              <strong>Mobile No. :</strong>
                              <span style={{ margin: "0 3px" }}></span>
                              7972021213 | 9511831914
                            </p>
                            <p>
                              <strong>Email I'd :</strong>
                              <span style={{ margin: "0px 9px" }}></span>
                              tkn.automation@gmail.com
                            </p>
                          </div>
                          <div
                            className="to-section"
                            style={{ textAlign: "left", width: "40%" }}
                          >
                            <h3
                              style={{
                                fontWeight: "bolder",
                                fontSize: "larger",
                                color: "green",
                              }}
                            >
                              Quotation To
                            </h3>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              >
                                M/s.{" "}
                              </label>
                              <input
                                type="text"
                                value={partyNameNoTaxQuote}
                                style={{ width: "100%", border: "none" }}
                                onChange={(e) => {
                                  setPartyNameNoTaxQuote(e.target.value);
                                }}
                              />
                            </div>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              >
                                
                              </label>
                              <input
                                type="text"
                                value={partyNameNoTaxQuote2}
                                style={{ width: "100%", border: "none" }}
                                onChange={(e) => {
                                  setPartyNameNoTaxQuote2(e.target.value);
                                }}
                              />
                            </div>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              >
                                Address:
                              </label>
                              <input
                                style={{ border: "none", width: "100%" }}
                                type="text"
                                value={notaxQuotAddress1}
                                onChange={(e) => {
                                  setNotaxQuotAddress1(e.target.value);
                                }}
                              />
                            </div>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              ></label>
                              <input
                                style={{ border: "none", width: "100%" }}
                                type="text"
                                value={notaxQuotAddress2}
                                onChange={(e) => {
                                  setNotaxQuotAddress2(e.target.value);
                                }}
                              />
                            </div>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              ></label>
                              <input
                                style={{ border: "none", width: "100%" }}
                                type="text"
                                value={notaxQuotAddress3}
                                onChange={(e) => {
                                  setNotaxQuotAddress3(e.target.value);
                                }}
                              />
                            </div>
                            <div
                              className="to-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                              }}
                            >
                              <label
                                style={{ width: "40%", fontWeight: "bold" }}
                              >
                                Mobile No.:{" "}
                              </label>
                              <input
                                style={{ border: "none", width: "100%" }}
                                type="text"
                                value={notaxQuotMobile}
                                onChange={(e) => {
                                  setNotaxQuotMobile(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div
                          className="invoice-table"
                          style={{
                            width: "100%",
                          }}
                        >
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              tableLayout: "fixed",
                            }}
                          >
                            <thead
                              style={{
                                height: "40px",
                                backgroundColor: "#d5e8d6",
                              }}
                            >
                              <tr>
                                <th
                                  style={{
                                    width: "4%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                  }}
                                >
                                  S.N.
                                </th>
                                <th
                                  style={{
                                    width: "34%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                  }}
                                >
                                  Product Description
                                </th>
                                <th
                                  style={{
                                    width: "10%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                  }}
                                >
                                  HSN
                                </th>
                                <th
                                  style={{
                                    width: "9%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                  }}
                                >
                                  Qty(N)
                                </th>
                                <th
                                  style={{
                                    width: "11%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                  }}
                                >
                                  Rate(₹)
                                </th>
                                <th
                                  style={{
                                    width: "12%",
                                    border: "1px solid #000",
                                    textAlign: "left",
                                    paddingBottom: "0px",
                                  }}
                                >
                                  Amount(₹)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {noTaxQuoteRows.map((row, index) => (
                                <tr key={index}>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                    }}
                                  >
                                    {index + 1}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                      maxWidth: "200px",
                                      wordWrap: "break-word",
                                      overflowWrap: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    <textarea
                                      rows="3"
                                      style={{
                                        width: "100%",
                                        resize: "none",
                                        overflow: "hidden",
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        marginTop: "0px",
                                        border: "none",
                                        outline: "none",
                                        boxShadow: "none",
                                      }}
                                      value={row.desc}
                                      data-notaxquote-index={index}
                                      onChange={(e) =>
                                        handleNoTaxQuoteChange(
                                          index,
                                          "desc",
                                          e.target.value
                                        )
                                      }
                                      onKeyDown={(e) =>
                                        handleKeyPress({
                                          index,
                                          field: "desc",
                                          event: e,
                                          rows: noTaxQuoteRows,
                                          setRows: setNoTaxQuoteRows,
                                          rowSelector: noTaxQuoteDescSelector,
                                        })
                                      }
                                    />
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                    }}
                                  >
                                    <input
                                      type="text"
                                      value={row.hsn}
                                      style={{
                                        width: "100%",
                                        border: "none",
                                        outline: "none",
                                        fontSize: "14px",
                                        boxShadow: "none",
                                      }}
                                      onChange={(e) =>
                                        handleNoTaxQuoteChange(
                                          index,
                                          "hsn",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                    }}
                                  >
                                    <input
                                      type="number"
                                      value={row.qty}
                                      style={{
                                        width: "100%",
                                        border: "none",
                                        outline: "none",
                                        fontSize: "14px",
                                        boxShadow: "none",
                                      }}
                                      onChange={(e) =>
                                        handleNoTaxQuoteChange(
                                          index,
                                          "qty",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                    }}
                                  >
                                    <input
                                      type="number"
                                      value={row.rate}
                                      data-notaxquote-rate-index={index}
                                      style={{
                                        width: "100%",
                                        border: "none",
                                        outline: "none",
                                        fontSize: "14px",
                                        boxShadow: "none",
                                      }}
                                      onChange={(e) =>
                                        handleNoTaxQuoteChange(
                                          index,
                                          "rate",
                                          e.target.value
                                        )
                                      }
                                      onKeyDown={(e) =>
                                        handleKeyPress({
                                          index,
                                          field: "rate",
                                          event: e,
                                          rows: noTaxQuoteRows,
                                          setRows: setNoTaxQuoteRows,
                                          rowSelector: noTaxQuoteRateSelector,
                                        })
                                      }
                                    />
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #000",
                                      textAlign: "left",
                                    }}
                                  >
                                    <input
                                      type="text"
                                      value={row.amount}
                                      readOnly
                                      style={{
                                        width: "100%",
                                        border: "none",
                                        outline: "none",
                                        fontSize: "14px",
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                <td
                                  colSpan="5"
                                  style={{
                                    textAlign: "right",
                                    fontWeight: "bold",
                                    padding: "3px",
                                    border: "1px solid #000",
                                  }}
                                >
                                  Total (₹):
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #000",
                                    padding: "3px",
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={noTaxTotalAmountQuote.toFixed(2)}
                                    readOnly
                                    style={{
                                      width: "100%",
                                      border: "none",
                                      outline: "none",
                                      fontSize: "14px",
                                    }}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td
                                  colSpan="5"
                                  style={{
                                    textAlign: "right",
                                    fontWeight: "bold",
                                    padding: "3px",
                                    border: "1px solid #000",
                                  }}
                                >
                                  Round Off (₹):
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #000",
                                    padding: "3px",
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={noTaxRoundOffQuote.toFixed(2)}
                                    readOnly
                                    style={{
                                      width: "100%",
                                      border: "none",
                                      outline: "none",
                                      fontSize: "14px",
                                    }}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td
                                  colSpan="5"
                                  style={{
                                    textAlign: "right",
                                    fontWeight: "bold",
                                    padding: "3px",
                                    border: "1px solid #000",
                                  }}
                                >
                                  Final Total (₹):
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #000",
                                    padding: "3px",
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={noTaxFinalTotalQuote}
                                    readOnly
                                    style={{
                                      width: "100%",
                                      border: "none",
                                      outline: "none",
                                      fontSize: "14px",
                                    }}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td
                                  colSpan="6"
                                  style={{
                                    textAlign: "right",
                                    border: "1px solid #000",
                                    padding: "3px",
                                  }}
                                >
                                  <b>Amount in Words: </b>
                                  <p>{noTaxTotalInWordsQuote} Rupees Only</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div
                          className="footer-section"
                          style={{
                            marginTop: "2px",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            className="payment-section"
                            style={{
                              textAlign: "left",
                              maxWidth: "70%",
                            }}
                          >
                            <h3
                              style={{
                                fontWeight: "bold",
                                marginTop: "5px",
                                color: "green",
                              }}
                            >
                              Terms and Conditions
                            </h3>

                            <div
                              className="payment-section-row"
                              style={{
                                display: "flex",
                                justifyContent: "left",
                                textAlign: "left",
                              }}
                            >
                              <ol
                                style={{
                                  paddingLeft: "20px",
                                  listStyleType: "decimal",
                                  fontSize: "12px",
                                }}
                              >
                                <li>
                                  The quotation provided is valid for a period
                                  of 15 days from the date of issuance. Any
                                  changes in scope, material cost, or
                                  availability after this period may require a
                                  revised quotation.
                                </li>
                                <li>
                                  An advance payment of 50% is required to
                                  initiate the order. The remaining 50% shall be
                                  payable upon successful delivery or completion
                                  of the project, whichever is applicable.
                                </li>
                              </ol>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                              <h3
                                style={{
                                  fontWeight: "bold",
                                  marginTop: "5px",
                                  color: "green",
                                }}
                              >
                                Additional Notes
                              </h3>
                              <p style={{ fontSize: "12px" }}>
                                The quotation is based on current market rates
                                and scope of work. Any modifications or delays
                                may impact the final pricing or timeline. Terms
                                are subject to mutual agreement and
                                confirmation.
                              </p>
                            </div>
                          </div>
                          <div
                            className="signature-section"
                            style={{
                              textAlign: "left",
                              marginTop: "5px",
                              marginRight: "10px",
                            }}
                          >
                            <p>
                              <strong>For Techkisan Automation</strong>
                            </p>
                            <img
                              src={signaturebase64}
                              alt="Signature"
                              style={{
                                width: "105px",
                                height: "100px",
                                marginLeft: "40px",
                              }}
                            />
                            <p style={{ fontSize: "10px", marginLeft: "25px" }}>
                              <i>Computer Generated Invoice</i>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* SOLAR QUOTATION */}
                {activeItem === "solar-quote" && (
                  <div
                    style={{
                      minHeight: "100vh",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "start",
                      padding: "40px",
                      gap: "30px",
                      backgroundColor: "#f8f8f8",
                    }}
                  >
                    {/* 1st BORDER CONTAINER */}
                    <div
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #000",
                        maxWidth: "800px",
                        width: "100%",
                        padding: "20px",
                        boxSizing: "border-box",
                      }}
                    >
                      {/* HEADER ROW */}
                      <HeaderRow />
                      {/* IMAGE */}
                      <div
                        style={{ textAlign: "center", marginBottom: "20px" }}
                      >
                        <img
                          src={communitybase64}
                          alt="Green Energy"
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                            margin: "auto",
                          }}
                        />
                      </div>

                      {/* TABLE */}
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          marginBottom: "20px",
                        }}
                      >
                        <tbody>
                          {[
                            ["CLIENTNAME", "Dilip Yerne Sir"],
                            ["ADDRESS", "Gondia"],
                            ["PROPOSAL", "6KW"],
                            ["REF.NO.", "TKN/24-25/140/G"],
                            ["DATE", "14-09-2024"],
                          ].map(([key, val]) => (
                            <tr key={key}>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "8px",
                                  fontWeight: "bold",
                                  width: "40%",
                                }}
                              >
                                {key}
                              </td>
                              <td
                                style={{
                                  border: "1px solid #000",
                                  padding: "8px",
                                }}
                              >
                                {val}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* FOOTER */}
                      <div
                        style={{
                          textAlign: "center",
                          marginTop: "20px",
                          lineHeight: "1.5",
                        }}
                      >
                        <h2 style={{ margin: "10px 0", fontSize: "28px" }}>
                          Techkisan Automation
                        </h2>
                        <p style={{ margin: "4px 0" }}>
                          Nakade Complex, Mama Chawk, Civil Line, Gondia-441601
                        </p>
                        <p style={{ margin: "4px 0" }}>(Maharashtra) India</p>
                        <hr
                          style={{
                            borderTop: "1px dotted #000",
                            margin: "20px auto",
                            width: "80%",
                          }}
                        />
                        <p style={{ margin: "4px 0" }}>
                          <strong>HQ No.:</strong> 7387052833
                        </p>
                        <p style={{ margin: "4px 0" }}>
                          <strong>Cell:</strong> +91 7972025213 / 9511831914
                        </p>
                        <p style={{ margin: "4px 0", color: "blue" }}>
                          <a
                            href="https://www.techkisan.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none", color: "blue" }}
                          >
                            www.techkisan.in
                          </a>{" "}
                          | info@techkisan.in
                        </p>
                      </div>
                    </div>

                    {/* 2nd BORDER CONTAINER */}
                    <div
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #000",
                        maxWidth: "800px",
                        width: "100%",
                        padding: "20px",
                        boxSizing: "border-box",
                      }}
                    >
                      {/* REPEATED HEADER ROW */}
                      <HeaderRow />
                      {/* PARAGRAPH CONTENT */}
                      <p
                        style={{
                          fontSize: "14px",
                          lineHeight: "1.6",
                          textAlign: "justify",
                        }}
                      >
                        The Proposal itself is a legally binding offer to
                        contract and in the event of an award to Techkisan
                        Services, it shall execute an Agreement that will be the
                        complete agreement between the parties, however, where
                        the parties do not execute any such Agreement, then the
                        terms and conditions mentioned in this Proposal shall
                        govern any purchase order(s) issued by the Customer in
                        reference to the installation of rooftop solar power
                        system.
                      </p>
                      {/* 2-COLUMN SECTION: CONFIDENTIAL TEXT + IMAGE */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginTop: "20px",
                          gap: "20px",
                        }}
                      >
                        {/* LEFT TEXT */}
                        <div style={{ flex: "1 1 60%", minWidth: "250px" }}>
                          <p
                            style={{
                              fontSize: "14px",
                              lineHeight: "1.6",
                              textAlign: "justify",
                            }}
                          >
                            This Proposal constitutes confidential and
                            proprietary information of Techkisan Services
                            (Company) and requires that Customer treat the
                            information contained in this Proposal as
                            confidential. Customer may use the information
                            contained in this Proposal solely for the purposes
                            of evaluating this Proposal and executing the
                            Agreement with Company. This proposal and all
                            supporting documents and manuals provided to
                            Customer in connection with this Proposal shall
                            remain the property of Company and must be returned
                            immediately upon request.
                          </p>
                        </div>

                        {/* RIGHT IMAGE */}
                        <div
                          style={{
                            flex: "1 1 35%",
                            minWidth: "200px",
                            textAlign: "center",
                          }}
                        >
                          <img
                            src={solarbase64}
                            alt="Confidential Info"
                            style={{ maxWidth: "100%", height: "auto" }}
                          />
                        </div>
                      </div>

                      {/* SECOND PARAGRAPH BELOW THE TWO-COLUMN SECTION */}
                      <div style={{ marginTop: "20px" }}>
                        <p
                          style={{
                            fontSize: "14px",
                            lineHeight: "1.6",
                            textAlign: "justify",
                          }}
                        >
                          This Proposal is based upon the set of requirements
                          provided by the customer to Company and certain
                          reasonable assumptions taken by Company and that may
                          be set forth by Owner. If Customer alters the
                          requirements or if any assumption stated herein are
                          false or inaccurate, then this Proposal, including
                          pricing, may change. Implementation of any services
                          detailed in this Proposal is subject to applicable
                          legal and regulatory norms and requirements in force
                          as on the date when services are to be implemented and
                          such implementation may vary to cater to the
                          requirements of such applicable legal and regulatory
                          norms and requirements.
                        </p>
                      </div>

                      {/* IMAGE BELOW SECOND PARAGRAPH */}
                      <div style={{ textAlign: "center" }}>
                        <img
                          src={solarhandbase64}
                          alt="Legal Norms"
                          style={{ maxWidth: "100%", height: "auto" }}
                        />
                      </div>
                    </div>

                    {/* 3rd Container */}
                    <div
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #000",
                        maxWidth: "800px",
                        width: "100%",
                        padding: "20px",
                        boxSizing: "border-box",
                        marginBottom: "30px",
                      }}
                    >
                      {/* Header repeated again */}
                      <HeaderRow />

                      {/* Content for 3rd Container */}
                      <p
                        style={{
                          fontSize: "14px",
                          lineHeight: "1.6",
                          textAlign: "justify",
                        }}
                      >
                        <strong>Techkisan Automation</strong> is a leading
                        player in the solar energy sector, based in Maharashtra
                        and serving the services in different region. With a
                        legacy of six years in the renewable energy field,
                        Techkisan Services has been at the forefront of
                        delivering innovative and sustainable solar solutions to
                        its diverse clientele.
                      </p>
                      {/* Services Heading */}
                      <h3
                        style={{
                          fontSize: "18px",
                          backgroundColor: "orange",
                          color: "white",
                          padding: "10px",
                          borderRadius: "5px",
                          marginTop: "30px",
                        }}
                      >
                        SERVICES:
                      </h3>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "30px",
                          marginTop: "30px",
                        }}
                      >
                        {[
                          {
                            title: "On-Grid Solutions:",
                            text: "Techkisan Automation specializes in designing and implementing on-grid solar systems tailored to meet the energy needs of residential, commercial, and industrial clients. These solutions are seamlessly integrated into existing power grids, optimizing energy consumption and reducing costs.",
                          },
                          {
                            title: "Off-Grid Solutions:",
                            text: "Providing energy independence, Techkisan Automation offers off-grid solar solutions that empower clients in remote areas or places with unreliable grid connectivity. These customized systems ensure a reliable and continuous power supply, promoting sustainability and self-sufficiency.",
                          },
                          {
                            title: "Solar Water Heater:",
                            text: "Techkisan Automation excels in harnessing solar energy for water heating purposes. Their solar water heaters are designed to be energy-efficient, environmentally friendly, and cost-effective, catering to both residential and commercial applications.",
                          },
                          {
                            title: "Heat Pump Solutions:",
                            text: "The company extends its expertise to heat pump technologies, offering efficient and eco-friendly heating solutions for various applications. Techkisan Automation integrates heat pump systems with renewable energy sources to enhance sustainability.",
                          },
                          {
                            title: "Automatic Cleaning System:",
                            text: "Techkisan Automation understands the importance of maintaining optimal efficiency in solar panels.The company provides cutting-edge automatic cleaning systems that ensure the longevity and performance of solar installations, minimizing maintenance efforts.",
                          },
                          {
                            title: "AMC Contracts:",
                            text: "Techkisan Automation offers Annual Maintenance Contracts (AMCs) to provide comprehensive support and upkeep for solar installations. These contracts guarantee regular inspections, preventive maintenance, and timely repairs, ensuring the longevity and efficiency of the solar systems.",
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              flexDirection:
                                index % 2 === 0 ? "row" : "row-reverse",
                              alignItems: "flex-start",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              style={{
                                flex: "0 0 70%",
                                backgroundColor: "#f0f0f0",
                                padding: "10px 20px",
                                borderRadius: "10px",
                                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <h3
                                style={{
                                  color: "#1E90FF",
                                  fontSize: "18px",
                                  marginBottom: "10px",
                                }}
                              >
                                {item.title}
                              </h3>
                              <p
                                style={{
                                  color: "#333",
                                  lineHeight: "1.6",
                                  textAlign: "justify",
                                  fontSize: "14px",
                                }}
                              >
                                {item.text}
                              </p>
                            </div>
                            <div style={{ flex: "0 0 48%" }}></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* 4th Container */}
                    <div
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #000",
                        maxWidth: "800px",
                        width: "100%",
                        padding: "20px",
                        boxSizing: "border-box",
                        marginBottom: "30px",
                      }}
                    >
                      {/* Header repeated again */}
                      <HeaderRow />

                      {/* Content for 4th Container */}
                      <h2
                        style={{
                          fontSize: "18px",
                          backgroundColor: "#2c72d9", // nice blue shade
                          color: "white",
                          padding: "8px 15px",
                          margin: "0",
                          textAlign: "center",
                          borderRadius: "4px",
                        }}
                      >
                        PROPOSED BILL OF MATERIAL (BOM)
                      </h2>
                      {/* Table */}
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          marginTop: "15px",
                          textAlign:"left"
                        }}
                      >
                        <thead>
                          <tr>
                            <th style={thStyle}>ITEM</th>
                            <th style={thStyle}>DESCRIPTION</th>
                            <th style={thStyle}>MAKE</th>
                            <th style={thStyle}>REMARKS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            [
                              "SOLAR PV MODULE",
                              "Bi-Facial Solar Module 520-540 Watts",
                              "Adani",
                              "Warranty: Product Warranty of 12 years and linear performance warranty of 30 years.",
                            ],
                            [
                              "SOLAR GRID TIE INVERTER",
                              "Power conditioning unit with efficiency above 98% with upto 30% overloading",
                              "Ksolar",
                              "Warranty: 10 Years. Test Report from OEM of all Inverter with Serial Number shall be provided.",
                            ],
                            [
                              "MODULE MOUNTING STRUCTURE",
                              "Site specific structure, Mounted on Structure Fixed Tilt",
                              "Hot Dipped Galvanized",
                              "Structure Required: Flatform of 7 Feet sand above According Azimuth Angle",
                            ],
                            [
                              "LEAKAGE PROOF LIQUID",
                              "The cracked concrete approval is valid for fixing with normal Threaded rods, rebars and an internal threaded sleeve",
                              "DeWalt/Dr.fixit",
                              "Approved for overhead applications and in dry, wet and water filled holes",
                            ],
                            [
                              "AC CABLES",
                              "LT Aluminum Armored(XLPE Coated) cable-1100 V",
                              "Polycab/Anchor/RR",
                              "Test Certificate from OEM will be provided.",
                            ],
                            [
                              "DC CABLES",
                              "1000 V 1 C x 4 sq.mm UV Protected DC Annealed Tinned-Copper, TUV Certified.",
                              "Polycab/Microtek/waaree",
                              "Test Certificate from OEM will be provided.",
                            ],
                            [
                              "ACDB/DCDB",
                              "IP54–Outdoor Double Door CRCA Sheet, Powder Coated Panel",
                              "MNRE Approved",
                              "N/A",
                            ],
                            [
                              "MC4 CONNECTORS",
                              "Single-contact electrical connectors commonly used for connecting solar panels",
                              "Elmex",
                              "N/A",
                            ],
                            [
                              "EARTHING DOWN CONDUCTOR",
                              "16Sq.Mm (XLPE Coated single core)",
                              "Reputed",
                              "N/A",
                            ],
                            [
                              "Earthing Rod",
                              "As per IEEE Standard Copper bonded 25mm die Electrode 1mtr With 5kg disco approved back fill chemical Compound",
                              "Excel/Reputed",
                              "N/A",
                            ],
                            [
                              "Lightening Arrestor",
                              "Copper Bounded",
                              "Reputed",
                              "N/A",
                            ],
                            [
                              "Net Meter",
                              "Net Meter Bidirectional",
                              "HPL/L&T",
                              "As per IEC62561.",
                            ],
                            [
                              "Generation Meter",
                              "Operated Unidirectional Energy Meter",
                              "HPL/L&T",
                              "MSEDCL Approved",
                            ],
                          ].map(([item, description, make, remarks], index) => (
                            <tr key={index}>
                              <td style={tdBlueStyle}>{item}</td>
                              <td style={tdStyle}>{description}</td>
                              <td style={tdStyle}>{make}</td>
                              <td style={tdStyle}>{remarks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* 5th container */}
                    <div
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #000",
                        maxWidth: "800px",
                        width: "100%",
                        padding: "20px",
                        boxSizing: "border-box",
                        marginBottom: "30px",
                        marginTop: "30px",
                      }}
                    >
                      {/* Header repeated again */}
                      <HeaderRow />
                      <h2
                        style={{
                          fontSize: "18px",
                          backgroundColor: "#2c72d9",
                          color: "white",
                          padding: "8px 15px",
                          margin: "0",
                          textAlign: "center",
                          borderRadius: "4px",
                        }}
                      >
                        SOLAR ROOFTOP SYSTEM PROPOSAL
                      </h2>
                      {/* Letter content */}
                      <div
                        style={{
                          fontSize: "14px",
                          lineHeight: "2",
                          color: "#000",
                          textAlign: "left",
                        }}
                      >
                        <p>
                          <strong>TO,</strong>
                          <br />
                          Dilip Yerne Sir,
                          <br />
                          Gondia
                        </p>

                        <p>
                          <strong>Subject:</strong> Proposal for Turnkey Solar
                          PV Rooftop Projects at Your Gondia Premises
                        </p>

                        <p>
                          <strong>Respected Sir,</strong>
                        </p>

                        <p>
                          We appreciate the opportunity to present our turnkey
                          EPC services for the (AC) / (DC) Solar Grid Tie
                          Rooftop Mounted Projects at your premises in Gondia.
                          We are pleased to provide our quotation with the
                          lowest price for the following services:
                        </p>
                        {/* Offer Label */}
                        <p>
                          <strong>Offer (6KW):</strong>
                        </p>
                        <p>
                          Price for 6 KW Solar PV plant as per the
                          aforementioned scope of work on Turnkey basis as
                          below:-
                        </p>

                        {/* Table */}
                        <>
                          <style>{`
    .table-bordered {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      margin-bottom: 20px;
      border: 1px solid #000;
    }
    .table-bordered th,
    .table-bordered td {
      padding: 3px;
      border: 1px solid #000;
    }
  `}</style>

                          <table className="table-bordered">
                            <thead>
                              <tr style={{ backgroundColor: "#ffeb3b" }}>
                                <th>Sr. No</th>
                                <th>Parameter</th>
                                <th>Adani Offering (Bifacial)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>Solar PV Plant Capacity</td>
                                <td>6KW, On Grid SPV System (6KVA Inverter)</td>
                              </tr>
                              <tr>
                                <td>2</td>
                                <td>Price Basis</td>
                                <td>Turnkey EPC</td>
                              </tr>
                              <tr>
                                <td>3</td>
                                <td>Validity of Offer</td>
                                <td>15 Days from date of Offer</td>
                              </tr>

                              <tr
                                style={{
                                  backgroundColor: "#ffeb3b",
                                  fontWeight: "bold",
                                }}
                              >
                                <td colSpan={3} style={{ textAlign: "left" }}>
                                  Project Price
                                </td>
                              </tr>
                              <tr>
                                <td rowSpan={3}></td>
                                <td>Total price</td>
                                <td>3,70,000 Rs.</td>
                              </tr>
                              <tr>
                                <td>GST 13.8%</td>
                                <td>51,060 Rs.</td>
                              </tr>
                              <tr>
                                <td>TOTAL PAYABLE PRICE</td>
                                <td>4,20,000 Rs.</td>
                              </tr>
                            </tbody>
                          </table>
                        </>

                        <p>
                          {" "}
                          <strong>Note:</strong> Purchase orders will be split
                          into two parts: 70% for Supplies and 30% for
                          Installation. GST at 12% will be applicable on
                          Supplies, and 18% on Installations. Any changes in
                          duties or taxes imposed by the Government of India
                          after the submission of this offer will be charged
                          extra at actual.
                        </p>
                        <h4
                          style={{
                            textAlign: "center",
                            textDecoration: "underline",
                            color: "#2c72d9",
                          }}
                        >
                          {" "}
                          This offer strictly adheres to the terms and
                          conditions specified in the Terms & Conditions.{" "}
                        </h4>
                        <p>
                          We trust that the above terms will meet your
                          requirements and provide us with the opportunity to
                          demonstrate our capabilities in your esteemed
                          organization. For any inquiries, please feel free to
                          contact us.
                        </p>
                        <div
                          style={{
                            textAlign: "right",
                            marginTop: "30px",
                            color: "#2c72d9",
                          }}
                        >
                          <p style={{ margin: 0 }}>Thanks & Regards,</p>
                          <p style={{ margin: 0 }}>From TechKisan Automation</p>
                          <p style={{ margin: 0 }}>Authorized Signature</p>
                        </div>
                      </div>
                    </div>

                    {/* 6th container */}
                    <div
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #000",
                        maxWidth: "800px",
                        width: "100%",
                        padding: "20px",
                        boxSizing: "border-box",
                        marginBottom: "30px",
                        marginTop: "30px",
                      }}
                    >
                      {/* Header repeated again */}
                      <HeaderRow />
                      <h2
                        style={{
                          fontSize: "18px",
                          backgroundColor: "#2c72d9",
                          color: "white",
                          padding: "5px 0px",
                          margin: "0",
                          textAlign: "center",
                          borderRadius: "4px",
                        }}
                      >
                        SUBSIDY FOR RESIDENTIAL HOUSEHOLD
                      </h2>
                      <p
                        style={{
                          fontSize: "14px",
                          lineHeight: "2",
                          textAlign: "left",
                        }}
                      >
                        <strong>
                          Rs.30,000/- per kW upto 2kw, Rs.18,000/-{" "}
                        </strong>
                        per kW for additional capacity upto 3kW Total Subsidy
                        for systems larger than{" "}
                        <strong>3 kW capped at Rs 78,000/- </strong> Suitable
                        Rooftop Solar Plant Capacity for households
                      </p>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          marginTop: "10px",
                          fontSize: "14px",
                        }}
                      >
                        <thead>
                          <tr style={{ backgroundColor: "orange" ,color:"#fff"}}>
                            <th
                              style={{
                                padding: "3px",
                                border: "1px solid black",
                                fontWeight:"bold"
                              }}
                            >
                              Average Monthly Electricity Consumption (Units)
                            </th>
                            <th
                              style={{
                                padding: "3px",
                                border: "1px solid black",
                                 fontWeight:"bold"
                              }}
                            >
                              Suitable Rooftop Solar Capacity
                            </th>
                            <th
                              style={{
                                padding: "3px",
                                border: "1px solid black",
                                 fontWeight:"bold"
                              }}
                            >
                              Applicable Subsidy
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td
                              style={{
                                padding: "3px",
                                border: "1px solid black",
                                 fontWeight:"bold"
                              }}
                            >
                              0 - 120
                            </td>
                            <td
                              style={{
                                padding: "3px",
                                border: "1px solid black",
                                 fontWeight:"bold"
                              }}
                            >
                              1 - 2 kW
                            </td>
                            <td
                              style={{
                                padding: "3px",
                                border: "1px solid black",
                                 fontWeight:"bold"
                              }}
                            >
                              ₹30,000/- per kW
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: "3px",
                                border: "1px solid black",
                                 fontWeight:"bold"
                              }}
                            >
                              150 - 300
                            </td>
                            <td
                              style={{
                                padding: "3px",
                                border: "1px solid black",
                                 fontWeight:"bold"
                              }}
                            >
                              2 - 3 kW
                            </td>
                            <td
                              style={{
                                padding: "3px",
                                border: "1px solid black",
                                 fontWeight:"bold"
                              }}
                            >
                              ₹30,000/- per kW x 2kW = ₹60,000/-
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: "3px",
                                border: "1px solid black",
                                 fontWeight:"bold"
                              }}
                            >
                              &gt; 300
                            </td>
                            <td
                              style={{
                                padding: "3px",
                                border: "1px solid black",
                                 fontWeight:"bold"
                              }}
                            >
                              Above 3kW to 10kW (Capped)
                            </td>
                            <td
                              style={{
                                padding: "3px",
                                border: "1px solid black",
                                 fontWeight:"bold"
                              }}
                            >
                              ₹30,000/- per kW x 2kW + ₹18,000/- = ₹78,000/-
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <p
                        style={{
                          backgroundColor: "orange",
                          fontSize: "14px",
                          lineHeight: "1.5",
                          marginTop: "25px",
                          fontWeight: "bold",
                        }}
                      >
                        Subsidy for Group Housing Society/Resident Welfare
                        Association (GHS/RWA) Rs.18,000 per kW for common
                        facilities, including EV charging, upto 500kW capacity
                        (@3kWper house) with the upper limit being inclusive of
                        individual rooftop plants installed by individual
                        residents in the GHS/RWA
                      </p>
                      <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <img
                          src={solarpanelbase64}
                          alt="Solar Panels"
                          style={{ maxWidth: "100%", height: "auto" }}
                        />
                      </div>
                    </div>
                    {/* 7th container */}
                    <div
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #000",
                        maxWidth: "800px",
                        width: "100%",
                        padding: "20px",
                        boxSizing: "border-box",
                        marginBottom: "30px",
                        marginTop: "30px",
                      }}
                    >
                      {/* Header repeated again */}
                      <HeaderRow />
                      <h2
                        style={{
                          fontSize: "18px",
                          backgroundColor: "#2c72d9",
                          color: "white",
                          padding: "5px 0px",
                          margin: "0",
                          textAlign: "center",
                          borderRadius: "4px",
                        }}
                      >
                        General Terms and Conditions
                      </h2>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          fontSize: "12px",
                          marginTop: "15px",
                          textAlign:"left"
                        }}
                      >
                        <tbody>
                          {[
                            ["Location", "Your premises at–"],
                            [
                              "Project Scope",
                              "Design, Supply, Installation, Commissioning and Licensing of 6 KW Grid Tied Roof Top Mounted Solar power plant under Net Metering arrangement with MSEDCL.",
                            ],
                            ["Bill of Material", "As per attached."],
                            ["Connection Information", "As per Attached."],
                            ["Concept Drawings", "Not Attached."],
                            [
                              "Customer Scope",
                              `1. Plumbing arrangement for regular cleaning of panels.<br />
         2. Water and Electricity to be provided free of cost during project execution.<br />
         3. Covered/Safe place for storing the material.<br />
         4. Internet connection/IP address for connectivity<br />
         5. Any changes required to existing electrical installation to implement Net Metering and which is not part of Solar system.`,
                            ],
                            [
                              "Licensing Scope",
                              "MSEDCL approval as below will be in Techkisan Services Scope. However licensing charges other than the net meter if any required to be paid shall be charged at actual.",
                            ],
                            [
                              "Delivery",
                              "All components shall be delivered at site (including unloading at site). Imported components shall be cleared at customs, transported, delivered at site by the Techkisan Automation.",
                            ],
                            [
                              "Testing and Commissioning Process",
                              "Techkisan Automation to develop a testing, commissioning and acceptance plan for approval by you.",
                            ],
                            [
                              "Payment Terms",
                              `1. 20% against Work Order<br />
         2. 75% against Solar Sanction Letter<br />
         3. 05% after project commissioning`,
                            ],
                            [
                              "Insurance",
                              "Insurance intransit and upto Erection will be in our scope. Thereafter you to take necessary Insurance coverage for all risks.",
                            ],
                            [
                              "Defect Liability",
                              "One Year From the date of Commissioning.",
                            ],
                            [
                              "Warranties",
                              `1. Modules come with product warranty of 12 years and performance warranty of 25 years.<br />
         2. Inverters come with manufacturer warranty of 8-10 years.<br />
         3. All equipment including Cables/ACDB Panel etc. supplied by us shall carry original equipment Warranty terms.<br />
         4. Our Warranties are not valid for any mishandling, abuse, wear and tear, sabotage/forcemajeure conditions.<br/>
         5. And tear,sabotage/for cemajeure conditions.`,
                            ],
                             [
                              "Offer Validity",
                              "Our offer will remain valid for your acceptance upto 15days,and there after subject To our confirmation.",
                            ],
                             [
                              "Timeline",
                              "The system will be installed within 90days' time frame, from the time of Unhindered site Access and Techno-Commercially Clear Order along with advance.Subject to timely payment as per mutually agreed payment terms.",
                            ],
                          ].map(([label, value], index) => (
                            <tr key={index}>
                              <td
                                style={{
                                  backgroundColor: "orange",
                                  color: "#fff",
                                  padding: "3px",
                                  border: "1px solid black",
                                  fontWeight: "bold",
                                  verticalAlign: "top",
                                  width: "30%",
                                }}
                              >
                                {label}
                              </td>
                              <td
                                style={{
                                  padding: "3px",
                                  border: "1px solid black",
                                  verticalAlign: "top",
                                  fontSize:"13px"
                                }}
                                dangerouslySetInnerHTML={{ __html: value }}
                              />
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <h1
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          color: "#000",
                          fontSize: "20px",
                          marginTop: "20px",
                        }}
                      >
                        Note:- Government Subsidy not available in Commercial
                        Projects.
                      </h1>
                    </div>
                    {/* 8th container */}
                    <div
                      style={{
                        backgroundColor: "white",
                        border: "1px solid #000",
                        maxWidth: "800px",
                        width: "100%",
                        padding: "20px",
                        boxSizing: "border-box",
                        marginBottom: "30px",
                        marginTop: "30px",
                      }}
                    >
                      {/* Header repeated again */}
                      <HeaderRow />
                      <h2
                        style={{
                          fontSize: "18px",
                          backgroundColor: "#2c72d9",
                          color: "white",
                          padding: "5px 0px",
                          margin: "0",
                          textAlign: "center",
                          borderRadius: "4px",
                        }}
                      >
                        AREAS SEREVED
                      </h2>
                      <div
                        style={{
                          border: "1px solid #000",
                          padding: "10px",
                          marginTop: "10px",
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-around",
                          gap: "15px",
                        }}
                      >
                        {[
                          { icon: "🏭", label: "Industrial" },
                          { icon: "🏨", label: "Resort & Banquet Hall" },
                          { icon: "🏥", label: "Hospitals" },
                          { icon: "🏫", label: "Education Institute" },
                          { icon: "🏠", label: "Residential" },
                          { icon: "🏢", label: "Housing Society" },
                        ].map((item, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              width: "45%",
                              padding: "5px",
                              border: "1px solid #ccc",
                              borderRadius: "8px",
                              backgroundColor: "#fff",
                            }}
                          >
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: "yellow",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "20px",
                                marginRight: "10px",
                              }}
                            >
                              {item.icon}
                            </div>
                            <span
                              style={{ fontSize: "14px", fontWeight: "500" }}
                            >
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                      <h2
                        style={{
                          fontSize: "18px",
                          backgroundColor: "#2c72d9",
                          color: "white",
                          padding: "5px 0px",
                          margin: "0",
                          marginTop: "20px",
                          textAlign: "center",
                          borderRadius: "4px",
                        }}
                      >
                        BANK DETAILS
                      </h2>
                      <div
                        style={{
                          padding: "10px 0 0 0",
                          lineHeight: "2em",
                          textAlign: "left",
                        }}
                      >
                        <p>
                          <strong>BANK – </strong>
                          <span
                            style={{ color: "#003366", fontWeight: "bold" }}
                          >
                            HDFC BANK
                          </span>
                        </p>
                        <p>
                          <strong>BRANCH – </strong>
                          <span style={{ color: "#003366" }}>
                            Gondia Branch
                          </span>
                        </p>
                        <p>
                          <strong>ACCOUNT NO. – </strong>
                          <span style={{ color: "#003366" }}>
                            50200063151545
                          </span>
                        </p>
                        <p>
                          <strong>IFSC CODE – </strong>
                          <span style={{ color: "#003366" }}>HDFC0000963</span>
                        </p>
                        <p>
                          <strong>ACCOUNT NAME – </strong>
                          <span>TECHKISAN AUTOMATION</span>
                        </p>
                        <p>
                          <strong>GSTIN – </strong>
                          <span>27AAQFT9534N1Z</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeItem === "add-sales" && (
                  <div className="content-box">
                    <div className="sales-voucher-container">
                      <h2>Add Sales Voucher</h2>
                      <div className="header">
                        <div className="header-row">
                          <div className="aligned-item">
                            <label>Series:</label>
                            <input type="text" />
                          </div>
                          <div className="aligned-item">
                            <label>Main Date:</label>
                            <input type="date" />
                          </div>
                          <div className="aligned-item">
                            <label>Vch No.:</label>
                            <input type="text" />
                          </div>
                          <div className="aligned-item">
                            <label>Sale Type:</label>
                            <select>
                              <option>L/GST-5%</option>
                              <option>L/GST-12%</option>
                              <option>L/GST-18%</option>
                              <option>L/GST-28%</option>
                              <option>L/GST-Exempt</option>
                              <option>L/GST-ItemWise</option>
                              <option>L/GST-MultiRate</option>
                            </select>
                          </div>
                          <div className="aligned-item">
                            <label>Tax Type:</label>
                            <select>
                              <option value="GST">GST</option>
                              <option value="VAT">VAT</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="party-section">
                        <label>Party:</label>
                        <input type="text" />
                        <label>Mat. Centre:</label>
                        <input type="text" />
                      </div>

                      <div className="narration-section">
                        <label>Narration:</label>
                        <input type="text" />
                      </div>

                      <div className="table-section">
                        <table>
                          <thead>
                            <tr>
                              <th>S.N.</th>
                              <th>Item</th>
                              <th>Qty.</th>
                              <th>Unit</th>
                              <th>Price (Rs.)</th>
                              <th>Amount (Rs.)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...Array(100)].map((_, index) => (
                              <tr
                                key={index}
                                className={index >= 10 ? "hidden-row" : ""}
                              >
                                <td>{index + 1}</td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="totals-section">
                        <span>0.00 (Alt. Qty. = 0.00)</span>
                        <span>0.00</span>
                      </div>

                      <div className="gst-section">
                        <div className="gst-summary">
                          <h4>GST Summary</h4>
                          <table>
                            <thead>
                              <tr>
                                <th>Tax Rate</th>
                                <th>Taxable Amt.</th>
                                <th>GST</th>
                                <th>SGST</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="total-gst">
                            <label>Total:</label>
                            <input type="text"></input>
                            <input type="text"></input>
                          </div>
                        </div>
                        <div className="bill-sundry">
                          <h4>Bill Sundry</h4>
                          <table>
                            <thead>
                              <tr>
                                <th>S.N.</th>
                                <th>Bill Sundry</th>
                                <th>@</th>
                                <th>Amount (Rs)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[...Array(100)].map((_, index) => (
                                <tr
                                  key={index}
                                  className={index >= 5 ? "hidden-row" : ""}
                                >
                                  <td>{index + 1}</td>
                                  <td>
                                    <input type="text" />
                                  </td>
                                  <td>
                                    <input type="text" />
                                  </td>
                                  <td>
                                    <input type="text" />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="footer">
                        <button>Vch. Detail</button>
                        <button>Master Detail</button>
                        <button>Party Dash Board</button>
                        <button>Vch Image</button>
                        <button>Acc Image</button>
                        <button>Item Image</button>
                        <button>Update Discount</button>
                        <button>Check Scheme</button>
                        <button>Save</button>
                        <button>Quit</button>
                      </div>
                    </div>
                  </div>
                )}

                {activeItem === "add-purchase" && (
                  <div className="content-box">
                    <div className="purchase-voucher-container">
                      <h2>Add Purchase Voucher</h2>
                      <div className="header">
                        <div className="header-row">
                          <div className="aligned-item">
                            <label>Series:</label>
                            <input type="text" />
                          </div>
                          <div className="aligned-item">
                            <label>Main Date:</label>
                            <input type="date" />
                          </div>
                          <div className="aligned-item">
                            <label>Vch No.:</label>
                            <input type="text" />
                          </div>
                          <div className="aligned-item">
                            <label>Purc Type:</label>
                            <select>
                              <option>L/GST-5%</option>
                              <option>L/GST-12%</option>
                              <option>L/GST-18%</option>
                              <option>L/GST-28%</option>
                              <option>L/GST-Exempt</option>
                              <option>L/GST-ItemWise</option>
                              <option>L/GST-MultiRate</option>
                            </select>
                          </div>
                          <div className="aligned-item">
                            <label>Tax Type:</label>
                            <select>
                              <option value="GST">GST</option>
                              <option value="VAT">VAT</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="party-section">
                        <label>Party:</label>
                        <input type="text" />
                        <label>Mat. Centre:</label>
                        <input type="text" />
                      </div>

                      <div className="narration-section">
                        <label>Narration:</label>
                        <input type="text" />
                      </div>

                      <div className="table-section">
                        <table>
                          <thead>
                            <tr>
                              <th>S.N.</th>
                              <th>Item</th>
                              <th>Qty.</th>
                              <th>Unit</th>
                              <th>Price (Rs.)</th>
                              <th>Amount (Rs.)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...Array(100)].map((_, index) => (
                              <tr
                                key={index}
                                className={index >= 10 ? "hidden-row" : ""}
                              >
                                <td>{index + 1}</td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="totals-section">
                        <span>0.00 (Alt. Qty. = 0.00)</span>
                        <span>0.00</span>
                      </div>

                      <div className="gst-section">
                        <div className="gst-summary">
                          <h4>GST Summary</h4>
                          <table>
                            <thead>
                              <tr>
                                <th>Tax Rate</th>
                                <th>Taxable Amt.</th>
                                <th>GST</th>
                                <th>SGST</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                                <td>
                                  <input type="text" />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="total-gst">
                            <label>Total:</label>
                            <input type="text"></input>
                            <input type="text"></input>
                          </div>
                        </div>
                        <div className="bill-sundry">
                          <h4>Bill Sundry</h4>
                          <table>
                            <thead>
                              <tr>
                                <th>S.N.</th>
                                <th>Bill Sundry</th>
                                <th>@</th>
                                <th>Amount (Rs)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[...Array(100)].map((_, index) => (
                                <tr
                                  key={index}
                                  className={index >= 5 ? "hidden-row" : ""}
                                >
                                  <td>{index + 1}</td>
                                  <td>
                                    <input type="text" />
                                  </td>
                                  <td>
                                    <input type="text" />
                                  </td>
                                  <td>
                                    <input type="text" />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="footer">
                        <button>Vch. Detail</button>
                        <button>Master Detail</button>
                        <button>Party Dash Board</button>
                        <button>Vch Image</button>
                        <button>Acc Image</button>
                        <button>Item Image</button>
                        <button>Update Discount</button>
                        <button>Check Scheme</button>
                        <button>Save</button>
                        <button>Quit</button>
                      </div>
                    </div>
                  </div>
                )}

                {activeItem === "stock-status" && (
                  <div className="content-box">
                    <div className="stockstatus-container">
                      <h2>Stock Status</h2>
                      <div className="stockstatus-row">
                        <label>Report Date:</label>
                        <input type="date" />
                      </div>
                      <div className="stockstatus-row">
                        <label>Show Zero Stock Items?</label>
                        <input type="text" />
                      </div>
                      <div className="stockstatus-row">
                        <label>Show Parent Group?</label>
                        <input type="text" />
                      </div>
                      <div className="stockstatus-row">
                        <label>Report to be shown in:</label>
                        <select>
                          <option>Main Unit</option>
                          <option>Alt. Unit</option>
                          <option>Both Units</option>
                        </select>
                      </div>
                      <div className="stockstatus-row">
                        <label>Treat Main/Alt. Unit as Compound Unit?</label>
                        <input type="text" />
                      </div>
                      <div className="stockstatus-row">
                        <label>Item to be Shown by:</label>
                        <input type="text" />
                      </div>
                      <div className="stockstatus-row">
                        <label>Show Value of Items?</label>
                        <input type="text" />
                      </div>
                      <div className="stockstatus-row">
                        <label>Show MRP Also?</label>
                        <input type="text" />
                      </div>
                      <button className="stockstatus-button">OK</button>
                    </div>
                  </div>
                )}

                {activeItem === "acc-ledger" && (
                  <div className="content-box">
                    <h2>Account Ledger</h2>
                    <p>This is the content for Account Ledger</p>
                  </div>
                )}

                {activeItem === "item-summary" && (
                  <div className="content-box">
                    <div className="monthlysummery-container">
                      <h2>Inventory - Monthly Summery</h2>

                      <div className="item-section">
                        <label>Item:</label>
                        <input type="text" defaultValue="ITEM-1" />
                        <label> ( Unit : BOX ) </label>
                      </div>
                      <div className="table-section-ms">
                        <table>
                          <thead>
                            <tr>
                              <th>Month</th>
                              <th>Qty. In</th>
                              <th>Qty. Out</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>January</td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                              <td>
                                <input type="text" />
                              </td>
                            </tr>
                          </tbody>
                          <tfoot>
                            <tr>
                              <th>Total</th>
                              <th></th>
                              <th></th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeItem === "all-invoices" && (
                  <div className="content-box">
                    <div className="admin-table-container">
                      <div className="tab-bar">
                        {[{label: 'All Invoices', value: 'all'}, {label: 'Solar Invoices', value: 'solar'}, {label: 'Tax Invoices', value: 'tax'}, {label: 'No Tax Invoices', value: 'notax'}].map(tab => (
                          <button
                            key={tab.value}
                            className={`tab-btn${selectedInvoiceType === tab.value ? ' active' : ''}`}
                            onClick={() => setSelectedInvoiceType(tab.value)}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                      <table className="employee-table">
                        <thead>
                          <tr>
                            <th>INVOICE NO</th>
                            <th>INVOICE TYPE</th>
                            <th>PARTY NAME</th>
                            <th>DATE OF ISSUE</th>
                            <th>FILE NAME</th>
                            <th>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allInvoices.length > 0 ? (
                            allInvoices
                              .filter((invoice) => {
                                if (selectedInvoiceType === "all") return true;
                                const invoiceNum = invoice.invoiceNumber || "";
                                if (
                                  selectedInvoiceType === "solar" &&
                                  (invoiceNum.startsWith("TKN-S-") || invoiceNum.startsWith("TKN/"))
                                )
                                  return true;
                                if (
                                  selectedInvoiceType === "tax" &&
                                  invoiceNum.startsWith("TKN-TI-")
                                )
                                  return true;
                                if (
                                  selectedInvoiceType === "notax" &&
                                  invoiceNum.startsWith("TKN-INV-")
                                )
                                  return true;
                                return false;
                              })
                              .reverse()
                              .map((invoice) => (
                                <tr key={invoice.id}>
                                  <td>{invoice?.invoiceNumber || "NA"}</td>
                                  <td>
                                    {invoice.invoiceNumber?.startsWith("TKN-S-") || invoice.invoiceNumber.startsWith("TKN/")
                                      ? "Solar Invoice"
                                      : invoice.invoiceNumber?.startsWith("TKN-TI-")
                                      ? "Tax Invoice"
                                      : invoice.invoiceNumber?.startsWith("TKN-INV-")
                                      ? "No Tax Invoice"
                                      : "NA"}
                                  </td>
                                  <td>{invoice?.partyName || "-"}</td>
                                  <td>{invoice?.DateOfIssue || "NA"}</td>
                                  <td>
                                    {invoice?.invoiceNumber
                                      ? `${invoice.invoiceNumber}.pdf`
                                      : "NA"}
                                  </td>
                                  <td>
                                    <a
                                      style={{ color: "blue" }}
                                      href={invoice.invoicePDF}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      LINK
                                    </a>
                                  </td>
                                </tr>
                              ))
                          ) : (
                            <tr>
                              <td colSpan="8" className="no-data">
                                No Invoices found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeItem === "all-quotes" && (
                   <div className="content-box">
                   <div className="admin-table-container">
                     <div className="tab-bar">
                       {[{label: 'All Quotations', value: 'all'}, {label: 'Tax Quotations', value: 'tax'}, {label: 'No Tax Quotations', value: 'notax'}].map(tab => (
                         <button
                           key={tab.value}
                           className={`tab-btn${selectedQuotationType === tab.value ? ' active' : ''}`}
                           onClick={() => setSelectedQuotationType(tab.value)}
                         >
                           {tab.label}
                         </button>
                       ))}
                     </div>
                     <table className="employee-table">
                       <thead>
                         <tr>
                           <th>QUOTATION NO</th>
                           <th>QUOTATION TYPE</th>
                           <th>PARTY NAME</th>
                           <th>DATE OF ISSUE</th>
                           <th>FILE NAME</th>
                           <th>ACTION</th>
                         </tr>
                       </thead>
                       <tbody>
                         {allQuotations.length > 0 ? (
                           allQuotations.reverse()
                             .filter((quotation) => {
                               if (selectedQuotationType === "all") return true;
                               const quotationNum = quotation.quotationNumber || "";
                               if (selectedQuotationType === "tax" && quotationNum.startsWith("TKN-TQ-")) return true;
                               if (selectedQuotationType === "notax" && quotationNum.startsWith("TKN-NTQ-")) return true;
                               return false;
                             })
                             .map((quotation) => (
                               <tr key={quotation.id}>
                                 <td>{quotation?.quotationNumber || "NA"}</td>
                                 <td>
                                   {
                                     quotation.quotationNumber?.startsWith("TKN-TQ-")
                                     ? "Tax Quotation"
                                     : quotation.quotationNumber?.startsWith("TKN-NTQ-")
                                     ? "No Tax Quotation"
                                     : "NA"}
                                 </td>
                                 <td>{quotation?.partyName || "-"}</td>
                                 <td>{quotation?.DateOfIssue || "NA"}</td>
                                 <td>
                                   {quotation?.quotationNumber
                                     ? `${quotation.quotationNumber}.pdf`
                                     : "NA"}
                                 </td>
                                 <td>
                                   <a
                                     style={{ color: "blue" }}
                                     href={quotation.quotationPDF}
                                     target="_blank"
                                     rel="noopener noreferrer"
                                   >
                                     LINK
                                   </a>
                                 </td>
                               </tr>
                             ))
                         ) : (
                           <tr>
                             <td colSpan="8" className="no-data">
                               No Quotations found
                             </td>
                           </tr>
                         )}
                       </tbody>
                     </table>
                   </div>
                 </div>
                )}

                {activeItem === "gst-summary" && (
                  <div className="content-box">
                  
                  </div>
                )}
              </div>
            </div>
          )}
          {/* accounting section */}
          {activeSection === "Accounting" && (
            <p className="comming-soon">Coming Soon.....</p>
          )}
          {activeSection === "Company" && (
            <p className="comming-soon">Coming Soon.....</p>
          )}
          {activeSection === "Tools" && (
            <p className="comming-soon">Coming Soon.....</p>
          )}
          {activeSection === "Modules" && (
            <p className="comming-soon">Coming Soon.....</p>
          )}
          {activeSection === "Add-Ons" && (
            <p className="comming-soon">Coming Soon.....</p>
          )}
          {activeSection === "Setting" && (
            <p className="comming-soon">Coming Soon.....</p>
          )}
          {activeSection === "Logout" && (
            <div className="logout-container">
              <h2>Logout</h2>
              <p>Are you sure you want to logout?</p>
              <button onClick={handlelogout}>Yes</button>
              <button onClick={() => setActiveSection("")}>No</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
