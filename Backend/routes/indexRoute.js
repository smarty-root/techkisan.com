const express = require('express')
const router=express.Router()
const managerModel=require("../models/manager-model")
const employeeModel=require('../models/employee-model')
const employeeImgModel=require("../models/employeeimg-model")
const taxInvoiceModel=require('../models/taxinvoice-model')
const noTaxinvoiceModel=require('../models/no-taxinvoice-model')
const messageModel = require('../models/message-model')
const groupMessageModel = require('../models/groups-messges')
const upload=require("../configs/mutler-setup")
router.get('/', function(req, res){
    res.send('Hello, World!')
})

// router.get("/assignments" , async function(req, res){
// const employee=await employeeModel.findOne({username:"pradumankathade3ec2e4"})
// const manager=await managerModel.findOne({username:"johndoea9465d"})
// employee.manager=manager._id

// manager.employees=employee._id
// await manager.save()
// await employee.save()
// res.send("Assigned successfully")


// })

router.get("/messages", async (req, res) => {
    try {
      const messages = await messageModel.find();
      const groupMessages = await groupMessageModel.find();
      res.json({messages,groupMessages});
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  router.get("/download_invoice/:id",async (req, res) => {
    try {
      let invoice = await taxInvoiceModel.findById(req.params.id);
  
      if (!invoice) {
        invoice = await noTaxinvoiceModel.findById(req.params.id);
      }
  
      if (!invoice || !invoice.invoicePDF) {
        return res.status(404).json({ message: "Invoice not found" });
      }
  
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Invoice_${invoice.invoiceNumber}.pdf`,
      });
  
      res.send(invoice.invoicePDF);
    } catch (error) {
      res.status(500).json({ message: "Error fetching invoice", error });
    }
  });
  
  router.post("/employee-update", upload.single("Image"),async (req, res) => {
    try{
      const submitFormData = { ...req.body };

      
      if (submitFormData.Image === '' || Array.isArray(submitFormData.Image)) {
        delete submitFormData.Image;
      }
      
      // Optional: remove all empty strings from form data
      Object.keys(submitFormData).forEach((key) => {
        if (submitFormData[key] === '') {
          delete submitFormData[key];
        }
    })
      let  employee = await employeeModel.findByIdAndUpdate(submitFormData._id, submitFormData, { new: true });
     
      if (!employee) {
        employee = await managerModel.findByIdAndUpdate(submitFormData._id, submitFormData, { new: true });
      }
      if(req.file){
        const empimg = await employeeImgModel.findOne({employee:employee._id});
        if(empimg){
          empimg.Image=req.file.buffer
          empimg.Imagetype=req.file.mimetype
          await empimg.save()
        }else{
          const newEmpimg = new employeeImgModel({
            employee: employee._id,
            Image: req.file.buffer,
            Imagetype: req.file.mimetype,
          });
          await newEmpimg.save();
        }
      }
      await employee.save();
      res.status(200).json({ message: "Employee updated successfully"});
    }catch(error){
      console.error(error.message);
      res.status(500).json({ message: "Error updating employee" });
    }
  })
  
  router.get("/getmanagers",async (req, res) => {
    try {
      const managers = await managerModel.find();
      res.status(200).json(managers);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Error fetching managers" });
    }
  })

  router.get("/unread_messages/:id", async (req, res) => {
    try{
      const unreadMessages = await messageModel.find({
        recipient: req.params.id,
        isRead: false,
      });
      console.log(unreadMessages)
      res.status(200).json(unreadMessages);
    }catch(error){
      console.error(error.message);
      res.status(500).json({ message: "Error fetching unread messages" });
    }
  })

  router.put('/messages/mark-read', async (req, res) => {
    try {
      const { senderId, receiverId } = req.body;
      if (!senderId || !receiverId) {
        return res.status(400).json({ error: 'Sender and receiver IDs are required' });
      }
      await messageModel.updateMany(
        { sender:senderId, recipient:receiverId, isRead: false },
        { $set: { isRead: true } }
      );
      res.json({ success: true });
    } catch (err) {
      console.error('Error marking messages as read:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  });
  router.get('/unread-messages-count/:receiverId', async (req, res) => {
    try {
      const receiverId = req.params.receiverId;
  
      const unreadCounts = await messageModel.aggregate([
        { $match: { recipient: receiverId, isRead: false } },
        {
          $group: {
            _id: '$sender',
            count: { $sum: 1 }
          }
        }
      ]);
  
      // Logging each sender's unread count
      for (const entry of unreadCounts) {
        console.log(`Sender: ${entry._id}, Unread Count: ${entry.count}`);
      }
  
      res.json(unreadCounts); // returns: [{ _id: senderId, count: number }]
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
module.exports = router