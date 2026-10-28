const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const TicketSchema = mongoose.Schema({
    ticketId: {
        type: String,
        unique: true,
    
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Critical"],
        required: true,
        default: "Low"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assuming there's a User model
        default: null
    },
    name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: null,
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Open", "In Progress", "Closed", "Resolved"],
        required: true,
        default: "Open"
    },
    groups: {
        type: String,
        enum: [
            "Tech Support", "Marketing", "Sales", "Development", "Admin", 
            "IT Supports", "HR", "Travel", "Payroll", "Pocket HRMS", "Reimbursements"
        ],
        required: true
    },
    attachFile: [{
        data: Buffer,
        filename: String,
        contentType: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    closeAt: {
        type: Date,
        default: null
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee", 
        default: null
    },
    assignedToName: {
        type: String,
        default: null
    },
});

TicketSchema.plugin(AutoIncrement, { inc_field: "ticketNumber", start_seq: 1 });

// 🔥 Use a post-save hook to set ticketId after ticketNumber is generated
TicketSchema.post("save", async function (doc) {
    if (!doc.ticketId) {
        doc.ticketId = `TKN-${String(doc.ticketNumber).padStart(5, "0")}`;
        await doc.save(); // Save the updated ticket with ticketId
    }
});

module.exports = mongoose.model("Ticket", TicketSchema);
