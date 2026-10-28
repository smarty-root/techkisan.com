const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,

  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,

  },
  message: String,
  file: {
    data: Buffer, // Store the binary data
    contentType: String, // File type (e.g., 'image/png', 'application/pdf')
    name: String, // Original file name
  },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "GroupChat" },
});

module.exports = mongoose.model('Message', messageSchema);
