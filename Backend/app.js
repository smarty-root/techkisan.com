require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const cron = require('node-cron');

const db = require('./configs/mongoose-connection');
const messageModel = require('./models/message-model');
const employeeModel = require('./models/employee-model');
const managerModel = require('./models/manager-model');
const internModel = require('./models/intern-model');
const groupChatModel = require('./models/group-chat-model');
const groupMessageModel = require('./models/groups-messges');

const indexRoute = require('./routes/indexRoute');
const employeesRoute = require('./routes/employeeRoute');
const adminRoute = require('./routes/adminRoutes');
const managerRoute = require('./routes/managerRoutes');
const internRoute = require('./routes/internRoutes');
const ticketRoute=require("./routes/TicketRoutes")
const groupRoute = require('./routes/groupRoutes');

const app = express();
const server = http.createServer(app);

// ===== Middleware =====
app.use(cookieParser());
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "10mb", extended: false }));

// ===== CORS =====
const originList = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://techkisan.com",
  "https://www.techkisan.com",
  "https://techkisan.in",
  "https://www.techkisan.in"
  ];

app.use(cors({
  origin: originList,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// ===== Session =====
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET || 'default_secret',
}));

// ===== Static Files =====
app.use(express.static(path.join(__dirname, 'public')));

// ===== Routes =====
app.use('/', indexRoute);
app.use("/ticket",ticketRoute);
app.use('/employees', employeesRoute);
app.use('/admin', adminRoute);
app.use('/manager', managerRoute);
app.use('/intern', internRoute);
app.use('/groups', groupRoute);

// ===== Socket.IO =====
const io = new Server(server, {
  cors: {
    origin: originList,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  socket.on('userOnline', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('updateUserStatus', [...onlineUsers.keys()]);
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('updateUserStatus', [...onlineUsers.keys()]);
  });

  socket.on('sendMessage', async (messageData) => {
    try {
      const { senderId, receiverId, text, file } = messageData;
      const fileData = file
        ? {
            data: Buffer.from(file.data, 'base64'),
            contentType: file.contentType,
            name: file.name,
          }
        : null;

      const message = new messageModel({
        sender: senderId,
        recipient: receiverId,
        message: text,
        file: fileData,
        timestamp: new Date(),
        isRead: false,
      });

      await message.save();
      io.emit('receiveMessage', message);
    } catch (err) {
      console.error('Error saving message:', err.message);
    }
  });

  socket.on('sendGroupMessage', async (messageData) => {
    try {
      const { senderId, groupId, text, file, senderModel } = messageData;
      console.log(senderId,groupId,text,file,senderModel);
      const fileData = file
        ? {
            data: Buffer.from(file.data, 'base64'),
            contentType: file.contentType,
            name: file.name,
          }
        : null;

      const message = new groupMessageModel({
        sender: senderId,
        groupId: groupId,
        message: text,
        senderModel: senderModel,
        file: fileData,
        timestamp: new Date(),
        isRead: false,
      });

      await message.save();

      // Get the group to find all members
      const group = await groupChatModel.findById(groupId);
      
      // Emit the message to all online group members
      group.members.forEach(memberId => {
        const memberSocketId = onlineUsers.get(memberId.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit('receiveGroupMessage', message);
        }
      });
    } catch (err) {
      console.error('Error saving group message:', err.message);
    }
  });
});

// ===== Attendance Cron Job =====
cron.schedule('59 23 * * *', async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updateAttendance = async (users) => {
      const updatePromises = users.map(async (user) => {
        const punchedToday = user.punchRecords.some((punch) => {
          const punchDate = new Date(punch);
          punchDate.setHours(0, 0, 0, 0);
          return punchDate.getTime() === today.getTime();
        });

        const status = punchedToday
          ? 'P'
          : ['CL', 'SL', 'H', 'P'].includes(user.status)
          ? user.status
          : 'A';

        user.attendance.push({ date: today, status });
        return user.save();
      });

      await Promise.all(updatePromises);
    };

    await Promise.all([
      updateAttendance(await employeeModel.find()),
      updateAttendance(await managerModel.find()),
      updateAttendance(await internModel.find()),
    ]);

    console.log('[Cron] Attendance updated successfully.');
  } catch (error) {
    console.error('[Cron] Error updating attendance:', error);
  }
});

// ===== Start Server =====
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
