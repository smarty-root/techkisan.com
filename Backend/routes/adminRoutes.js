const express = require('express');
const router=express.Router();
const bcryptjs = require('bcryptjs');
const adminModel=require('../models/admin-model');
const employeeModel=require('../models/employee-model');
const {loginUser}=require("../controllers/adminController");
const managerModel = require('../models/manager-model');
const internModel=require("../models/intern-model")
const announcementModel=require("../models/Announcement-model");
const AnnouncementModel = require('../models/Announcement-model');
const upload=require("../configs/mutler-setup")
const noTaxinvoiceModel = require('../models/no-taxinvoice-model');
const taxInvoiceModel=require("../models/taxinvoice-model");
const taxinvoiceModel = require('../models/taxinvoice-model');
const uploadToDrive = require('../configs/google-drive');
const uploadToDriveNoTax = require('../configs/google-drive-notax');
const uploadToDriveSolar = require('../configs/google-drive-solartax');
const uploadToDriveTaxQuotation = require('../configs/google-drive-taxquotation');
const uploadToDriveNoTaxQuotation = require('../configs/google-drive-notaxquotation');
const puppeteer = require('puppeteer');
const solarinvoiceModel=require("../models/solar-invoices-model")
const taxQuotationModel=require("../models/tax-quotation")
const noTaxQuotationModel=require("../models/notax-quotaion-model")
router.post('/create', async(req, res) => {
    try{ bcryptjs.genSalt("admin123", async function (err, salt) {
     const hashedPassword = await bcryptjs.hash("admin123", 10);
      const newadmin = new adminModel({
       Name: "Test Admin",
       Email: "test@admin.com",
       Password: hashedPassword
      })
      await newadmin.save()
     res.send("Successfully created Admin")
     })}catch(err){ console.log(err) }
     });

router.post("/login",loginUser)

router.get('/admindata',async function (req, res){
    try {
        const authHeader = req.headers.authorization;
        
        
       
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }
    
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }
    
        const employee = await employeeModel.find()
        const manager = await managerModel.find()
        const intern = await internModel.find()
        const taxinvoice=await taxinvoiceModel.find()
        const noTaxinvoice=await noTaxinvoiceModel.find()
        const solarinvoice=await solarinvoiceModel.find()
        const Announcement=await announcementModel.find()
        const taxQuotation=await taxQuotationModel.find()
        const noTaxQuotation=await noTaxQuotationModel.find()
        const [employeeData, managerData, internData] = await Promise.all([
            employee,
            manager,
            intern,
            taxinvoice,
            noTaxinvoice
        ]);
        const [taxinvoiceData, noTaxinvoiceData,solarinvoiceData] = await Promise.all([
          taxinvoice,
          noTaxinvoice,
          solarinvoice
      ]);
      const [taxQuotationData, noTaxQuotationData] = await Promise.all([
        taxQuotation,
        noTaxQuotation
    ]);
      const allQuotations=[...taxQuotationData,...noTaxQuotationData]
      const allInvoices=[...taxinvoiceData,...noTaxinvoiceData,...solarinvoiceData]
        const allUsers = [...employeeData, ...managerData, ...internData];
        const employeeCount = await employeeModel.countDocuments()
        const managerCount=await managerModel.countDocuments()
        const internCount=await internModel.countDocuments()
        const totalsEmployess=employeeCount+managerCount;
        const admin = await adminModel.find()
        if (!employee) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!admin){
            return res.status(401).json({ message: 'Invalid credentials' });
        }
      
        res.status(200).json({
            success: true,
            employeeCount: totalsEmployess,
            internCount: internCount,
            employee: allUsers,
            Announcement:Announcement,
            allInvoices: allInvoices,
            allQuotations:allQuotations

        })
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
    });
    router.put('/update_announcement/:id', async (req, res) => {
        try {
            const { Announcement } = req.body;
            await announcementModel.findByIdAndUpdate(req.params.id, { Announcement });
            res.json({ success: true, message: "Announcement updated!" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    router.post('/add_announcement', async (req, res) => {
        try {
            const { message } = req.body;
            const newAnnouncement = new announcementModel({
                Announcement: message,
            });
    
            await newAnnouncement.save();
            res.status(201).json({ success: true, message: "Announcement posted successfully!" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    router.delete('/delete_announcement/:id', async (req, res) => {
        try {
            await AnnouncementModel.findByIdAndDelete(req.params.id);
            res.json({ success: true, message: "Announcement deleted!" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
  //  no tax invoice 
    router.post("/save_notaxinvoice", async (req, res) => {
        try {
          const { invoiceNumber,invoiceHTML , PartyName,DateofIssue} = req.body;

          const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
          })
          const page = await browser.newPage();
          await page.setContent(invoiceHTML, { waitUntil: "networkidle0" });
          const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
          });
          
          const pdfFileName = `${invoiceNumber}.pdf`;
          const pdfLink = await uploadToDriveNoTax(pdfBuffer, pdfFileName);
          // Create new invoice entry
          const newNoTaxInvoice = new noTaxinvoiceModel({
            invoiceNumber: invoiceNumber,
            partyName: PartyName,
            DateOfIssue: DateofIssue,
            invoicePDF: pdfLink,
          });
          await newNoTaxInvoice.save();
          res.json({ message: "Invoice saved successfully" }).status(200);
        }catch (error) {
          console.error("Error saving invoice:", error.message);
          res.status(500).json({ message: "Failed to save invoice" });
        }

      });
      
      router.get("/invoice/latest", async (req, res) => {
        try {
          const lastInvoice = await noTaxinvoiceModel.findOne().sort({ _id: -1 }); // Fetch the latest inserted invoice
          let nextInvoiceNumber = "TKN-INV-01"; // Default for the first invoice
          if (lastInvoice && lastInvoice.invoiceNumber) {
            const match = lastInvoice.invoiceNumber.match(/TKN-INV-(\d+)/);
            // Extract the number and increment it
            if (match) {
              const nextNumber = String(parseInt(match[1]) + 1).padStart(2, "0");
              nextInvoiceNumber = `TKN-INV-${nextNumber}`;
              console.log(nextInvoiceNumber)
            }
          }
      
          res.json({ invoiceNumber: nextInvoiceNumber });
        } catch (error) {
          res.status(500).json({ error: "Error fetching invoice number" });
        }
      });
    router.get("/taxinvoice/latest",async(req,res)=>{
      try {
        const lastInvoice = await taxInvoiceModel.findOne().sort({ _id: -1 }); // Fetch the latest inserted invoice
    
        let nextInvoiceNumber = "TKN-TI-01"; // Default for the first invoice
    
        if (lastInvoice && lastInvoice.invoiceNumber) {
          const match = lastInvoice.invoiceNumber.match(/TKN-TI-(\d+)/);
          if (match) {
            const nextNumber = String(parseInt(match[1]) + 1).padStart(2, "0");
            nextInvoiceNumber = `TKN-TI-${nextNumber}`;
          }
        }
    
        res.json({ invoiceNumber: nextInvoiceNumber });
      } catch (error) {
        res.status(500).json({ error: "Error fetching invoice number" });
      }
    });

    router.get("/solarinvoice/latest",async(req,res)=>{
      try {
        const lastInvoice = await solarinvoiceModel.findOne().sort({ _id: -1 });
        let nextInvoiceNumber = `TKN/${new Date().getFullYear()}/00/G`; // Default for the first invoice
    
    
        res.json({ invoiceNumber: nextInvoiceNumber });
      } catch (error) {
        res.status(500).json({ error: "Error fetching invoice number" });
      }
    });

    router.post("/save_solarinvoice", upload.single("invoicePDF"), async (req, res) => {
      try {
        const { invoiceNumber,invoiceHTML,PartyName,DateofIssue } = req.body;
      
        const browser = await puppeteer.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        })
        const page = await browser.newPage();
        await page.setContent(invoiceHTML, { waitUntil: "networkidle0" });
        const pdfBuffer = await page.pdf({
          format: "A4",
          printBackground: true,
        });
        const pdfFileName = `${invoiceNumber}.pdf`;
        const pdfLink = await uploadToDriveSolar(pdfBuffer, pdfFileName);
        // Create new invoice entry
        const newSolarInvoice = new solarinvoiceModel({
          invoiceNumber:invoiceNumber,
          partyName:PartyName,
          DateOfIssue: DateofIssue,
          invoicePDF:pdfLink
        })
        await newSolarInvoice.save();
        res.json({ message: "Invoice saved successfully" }).status(200);
      }catch(e){
       if(e.code===11000){
        return res.status(400).json({
          message: `${e.keyValue.invoiceNumber} Invoice Number Already Exists`,
          field: e.keyPattern, 
          value: e.keyValue,  
        });
       }
        console.error("Error saving invoice:", e.message);
        res.status(500).json({ message: "Failed to save invoice" });

      }

    })
    // tax invoice 
    router.post("/save_taxinvoice", async (req, res) => {
      try {
        const { invoiceNumber,PartyName,DateofIssue,invoiceHTML } = req.body;
        const browser=await puppeteer.launch({
          headless:true,
          args:["--no-sandbox","--disable-setuid-sandbox"]
        })
        const page = await browser.newPage();
        await page.setContent(invoiceHTML,{waitUntil:"networkidle0"});
        const pdfBuffer = await page.pdf({
          format:"A4",
          printBackground:true
        })
        await browser.close();
        const pdfFileName = `${invoiceNumber}.pdf`;
        const pdfLink = await uploadToDrive(pdfBuffer, pdfFileName);
        
        // Create new invoice entry
        const newTaxInvoice = new taxInvoiceModel({
          invoiceNumber:invoiceNumber,
          partyName:PartyName,
          DateOfIssue: DateofIssue,
          invoicePDF:pdfLink
        })
        // Upload PDF to Google Drive
        await newTaxInvoice.save();
        res.json({ message: "Invoice saved successfully" }).status(200);
      }catch(e){
        console.log("Error saving invoice:", e.message);
        res.status(500).json({ message: "Failed to save invoice" });

      }
    });

    router.delete("/delete_employee/:id", async (req, res) => {
      try {
        const { id } = req.params;
    
        let deletedUser = await employeeModel.findByIdAndDelete(id);
        if (!deletedUser) deletedUser = await managerModel.findByIdAndDelete(id);
        if (!deletedUser) deletedUser = await internModel.findByIdAndDelete(id);
    
        if (deletedUser) {
          return res.json({ success: true, message: "User deleted successfully!" });
        } else {
          return res.status(404).json({ success: false, message: "User not found!" });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    router.delete("/delete_invoice/:id",async(req,res)=>{
      const { id } = req.params;
      try{
      let deletedInvoice = await noTaxinvoiceModel.findByIdAndDelete(id);
      if (!deletedInvoice) deletedInvoice = await taxInvoiceModel.findByIdAndDelete(id);
      if (!deletedInvoice) deletedInvoice = await solarinvoiceModel.findByIdAndDelete(id);
  
      if (deletedInvoice) {
        return res.json({ success: true, message: "Invoice deleted successfully!" });
      } else {
        return res.status(404).json({ success: false, message: "Ivoice not found!" });
      }
    }catch (error) {
      res.status(500).json({ error: error.message });
    }
    })
  
    router.get("/taxquotation/latest",async(req,res)=>{
      try{
        const lastInvoice = await taxQuotationModel.findOne().sort({ _id: -1 }); // Fetch the latest inserted invoice
    
        let nextInvoiceNumber = "TKN-TQ-01"; // Default for the first invoice
    
        if (lastInvoice && lastInvoice.quotationNumber) {
          const match = lastInvoice.quotationNumber.match(/TKN-TQ-(\d+)/);
          if (match) {
            const nextNumber = String(parseInt(match[1]) + 1).padStart(2, "0");
            nextInvoiceNumber = `TKN-TQ-${nextNumber}`;
          }
        }
    
        res.json({ quotationNumber: nextInvoiceNumber });

      }
      catch (error) {
        res.status(500).json({ error: "Error fetching invoice number" });
      }
    })

    router.post("/save_taxquotation",async(req,res)=>{
      try{
        const { quotationNumber,PartyName,DateofIssue,quotationHTML } = req.body;
        const browser=await puppeteer.launch({
          headless:true,
          args:["--no-sandbox","--disable-setuid-sandbox"]
        })
        const page = await browser.newPage();
        await page.setContent(quotationHTML,{waitUntil:"networkidle0"});
        const pdfBuffer = await page.pdf({
          format:"A4",
          printBackground:true
        })
        await browser.close();
        const pdfFileName = `${quotationNumber}.pdf`;
        const pdfLink = await uploadToDriveTaxQuotation(pdfBuffer, pdfFileName);
        
        // Create new invoice entry
        const newTaxQuotation = new taxQuotationModel({
          quotationNumber:quotationNumber,
          partyName:PartyName,
          DateOfIssue: DateofIssue,
          quotationPDF:pdfLink
        })
        // Upload PDF to Google Drive
        await newTaxQuotation.save();
        res.json({ message: "Invoice saved successfully" }).status(200);
      }catch(e){
        console.log("Error saving invoice:", e.message);
        res.status(500).json({ message: "Failed to save invoice" });

      }
    })

    router.get("/notaxquotation/latest",async(req,res)=>{
      try{
        const lastInvoice = await noTaxQuotationModel.findOne().sort({ _id: -1 }); // Fetch the latest inserted invoice
        let nextInvoiceNumber = "TKN-NTQ-01"; // Default for the first invoice
    
        if (lastInvoice && lastInvoice.quotationNumber) {
          const match = lastInvoice.quotationNumber.match(/TKN-NTQ-(\d+)/);
          if (match) {
            const nextNumber = String(parseInt(match[1]) + 1).padStart(2, "0");
            nextInvoiceNumber = `TKN-NTQ-${nextNumber}`;
          }
        }
    
        res.json({ quotationNumber: nextInvoiceNumber });

      }
      catch (error) {
        res.status(500).json({ error: "Error fetching invoice number" });
      }

    })

    router.post("/save_notaxquotation",async(req,res)=>{
      try{
        const { quotationNumber,PartyName,DateofIssue,quotationHTML } = req.body;
        const browser=await puppeteer.launch({
          headless:true,
          args:["--no-sandbox","--disable-setuid-sandbox"]
        })
        const page = await browser.newPage();
        await page.setContent(quotationHTML,{waitUntil:"networkidle0"});
        const pdfBuffer = await page.pdf({
          format:"A4",
          printBackground:true
        })
        await browser.close();
        const pdfFileName = `${quotationNumber}.pdf`;
        const pdfLink = await uploadToDriveNoTaxQuotation(pdfBuffer, pdfFileName);

        const newNoTaxQuotation = new noTaxQuotationModel({
          quotationNumber:quotationNumber,
          partyName:PartyName,
          DateOfIssue: DateofIssue,
          quotationPDF:pdfLink
        })
        await newNoTaxQuotation.save();
        res.json({ message: "Invoice saved successfully" }).status(200);
      }catch(e){
        console.log("Error saving invoice:", e.message);
        res.status(500).json({ message: "Failed to save invoice" });

      }

    })

   
module.exports = router