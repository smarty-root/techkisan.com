const express = require('express');
const router = express.Router();
const TicketModel = require('../models/ticket-model');
const upload =require("../configs/mutler-setup")
const employeeModel = require('../models/employee-model');
const managerModel = require('../models/manager-model');
const internModel = require('../models/intern-model');
const ticketModel = require('../models/ticket-model');

// Create a new ticket

router.post('/create_ticket',upload.single("file"), async (req, res) => {
    try{
        const {subject,priority,status,group,description,tags,employeeData}=req.body;
        console.log(employeeData)
        var employee=await employeeModel.findById(employeeData);
        if(!employee){
             employee=await managerModel.findById(employeeData);
            
            if(!employee){
                 employee=await internModel.findById(employeeData);
                if(!employee){
                    return res.status(400).json({message:"Employee not found"});
                }
            }
        }
        if(!subject || !priority || !status || !group || !description || !tags){
            return res.status(400).json({message:"Please fill all the fields"});
        }
        console.log(employee)
        
        const file = req.file ? {
            data: req.file.buffer,
            filename: req.file.originalname,
            contentType: req.file.mimetype
        } : null;
        const ticket = new TicketModel({
            subject,
            priority,
            status,
            groups: group,
            message:description,
            userId: employee._id,
            name: employee.firstName + " " + employee.lastName,
            email: employee.email,
            tags,
            employeeData,
            attachFile: file,
            createdAt: Date.now()
        });
        employee.Tickets.push(ticket._id);
        await ticket.save();
        await employee.save();

        return res.status(200).json({ message: "Ticket created successfully", ticket });
    }catch(err){
        console.error(err.message);
        return res.status(500).json({ message: "Unable to create a ticket" });
    }
})
router.post("/create_ticket_user",upload.single("file"), async (req, res) => {
    try{
        const {subject,priority,status,group,description,tags ,User,name}=req.body;
        console.log(req.body)
        if(!subject || !priority || !status || !group || !description || !tags){
            return res.status(400).json({message:"Please fill all the fields"});
        }
        const file = req.file ? {
            data: req.file.buffer,
            filename: req.file.originalname,
            contentType: req.file.mimetype
        } : null;
        const ticket = new TicketModel({
            subject,
            priority,
            status,
            groups: group,
            message:description,
            userId: User,
            name: name,
            email: null,
            tags,
            attachFile: file,
            createdAt: Date.now()
        });
        await ticket.save();
        return res.status(200).json({ message: "Ticket created successfully", ticket });
    }catch(err){
        console.error(err.message);
        return res.status(500).json({ message: "Unable to create a ticket" });
    }
})
router.get('/get_tickets',async (req, res) => {
    try {
        const tickets = await TicketModel.find()
        return res.status(200).json({ message: "Tickets fetched successfully", tickets });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Unable to fetch tickets" });
    }
})
router.get('/get_ticket/:id',async (req, res) => {
    try {
        const ticket = await TicketModel.find({userId: req.params.id})
        if(!ticket){
            return res.status(400).json({message:"Ticket not found"});
        }
        return res.status(200).json({ message: "Ticket fetched successfully", ticket });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Unable to fetch ticket" });
    }
})
router.delete('/delete_ticket/:id',async (req, res) => {
    try {
        const ticket = await TicketModel.findByIdAndDelete(req.params.id);
         if(!ticket){
            return res.status(400).json({message:"Ticket not found"});
        }
        const employee = await employeeModel.findById(ticket.userId);
        if(employee){
            employee.Tickets = employee.Tickets.filter(ticketId => ticketId.toString() !== ticket._id.toString());
            await employee.save();
        }
        const manager = await managerModel.findById(ticket.userId);
        if(manager){
            manager.Tickets = manager.Tickets.filter(ticketId => ticketId.toString() !== ticket._id.toString());
            await manager.save();
        }
        return res.status(200).json({ message: "Ticket deleted successfully", ticket });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Unable to delete ticket" });
    }
})

router.get("/get_my_tickets",async (req, res) => {
    try{
        const employeeId = req.query.employeeId;
        
        const tickets=await ticketModel.find({userId:employeeId})
        console.log(tickets)
        if(!tickets){
            return res.status(400).json({message:"Tickets not found"});
        }
        return res.status(200).json({ message: "Tickets fetched successfully", tickets });
    }catch(err){
        console.error(err.message);
        return res.status(500).json({ message: "Unable to fetch tickets" });
    }
})

router.put("/assigned_agent",async (req, res) => {
    try{
        const {ticketNo, agentAssigned} = req.body;
        var employee = await employeeModel.findById(agentAssigned);
        if(!employee){
            employee = await managerModel.findById(agentAssigned);
            if(!employee){
                employee = await internModel.findById(agentAssigned);
                if(!employee){
                    return res.status(400).json({message:"Employee not found"});
                }
            }
        }
        
        var agentAssignedName = employee.firstName + " " + employee.lastName;
        
        const ticket = await TicketModel.findOneAndUpdate(
            { ticketId: ticketNo }, 
            { assignedTo: agentAssigned, assignedToName: agentAssignedName }, 
            { new: true }
          );
        if(!ticket){
            return res.status(400).json({message:"Ticket not found"});
        }
    
        return res.status(200).json({ message: "Ticket updated successfully", ticket });
    }catch(err){
        console.error(err.message);
        return res.status(500).json({ message: "Unable to update ticket" });
    }
})

router.get("/get_assigned_agent",async (req, res) => {
    const { employeeId } = req.query;
    console.log(employeeId)
    try{
        const ticket = await TicketModel.find({assignedTo:employeeId});
        console.log(ticket)
        if(!ticket){
            return res.status(400).json({message:"Ticket not found"});
        }
        return res.status(200).json({ message: "Ticket fetched successfully", ticket });
}
    catch(err){
        console.error(err.message);
        return res.status(500).json({ message: "Unable to fetch ticket" });
    }
})

// Edit ticket route
router.put('/edit_ticket/:id', upload.single("file"), async (req, res) => {
    try {
        console.log(req.body)
        const { subject, priority, status, group, description, tags } = req.body;
        const ticketId = req.params.id;

        // Prepare update object
        const updateData = {
            subject,
            priority,
            status,
            groups: group,
            message: description,
            tags,
            // If status is changed to Closed, update closeAt
            ...(status === 'Closed' ? { closeAt: Date.now() } : {})
        };

        // If new file is uploaded, add it to update data
        if (req.file) {
            updateData.attachFile = {
                data: req.file.buffer,
                filename: req.file.originalname,
                contentType: req.file.mimetype
            };
        }

        // Find and update the ticket
        const updatedTicket = await TicketModel.findByIdAndUpdate(
            ticketId,
            updateData,
            { new: true } // Return the updated document
        );

        if (!updatedTicket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // If ticket status is changed to Closed, update employee's ticket list
        if (status === 'Closed') {
            const employee = await employeeModel.findById(updatedTicket.userId);
            if (employee) {
                // Update the ticket status in employee's ticket list
                await employeeModel.updateOne(
                    { _id: updatedTicket.userId, "Tickets._id": ticketId },
                    { $set: { "Tickets.$.status": "Closed" } }
                );
            }
        }

        return res.status(200).json({ 
            message: "Ticket updated successfully", 
            ticket: updatedTicket 
        });
    } catch (error) {
        console.error("Error updating ticket:", error);
        return res.status(500).json({ message: "Unable to update ticket" });
    }
});

module.exports = router;