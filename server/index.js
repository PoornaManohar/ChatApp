require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Models
const User = require('./models/User');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------
// 🔌 MongoDB Connection
// ---------------------------------------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// In-memory tracker for Online Status only (MongoDB is overkill for rapid status changes)
const onlineUsers = new Map(); // socketId -> userId

// ---------------------------------------------------------
// 🌐 REST API Routes
// ---------------------------------------------------------

// 1. Check if user exists
app.post('/api/auth/check', async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Login with Password
app.post('/api/auth/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.password !== password) {
      // For demo simple text match. In prod use bcrypt.compare(password, user.password)
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Register (Sign Up)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { phone, name, password } = req.body;
    const userId = phone.replace(/\D/g, '');

    // Check if exists
    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const newUser = new User({
      phone,
      name,
      password, // Save plain text per user request
      status: 'Available',
      avatar: `https://i.pravatar.cc/150?u=${userId}`
    });

    await newUser.save();
    res.json({ success: true, user: newUser });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch messages for a chat
app.get('/api/messages/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------
// 📡 Socket.IO Event Handlers
// ---------------------------------------------------------
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // Register user
  socket.on('register', ({ userId }) => {
    socket.userId = userId;
    socket.join(userId); // Join a room specific to this user
    onlineUsers.set(socket.id, userId);
    console.log(`👤 User registered and joined room: ${userId}`);
    io.emit('online-users', Array.from(onlineUsers.values()));
  });

  // User joins a chat room
  socket.on('join', async ({ chatId, userId }) => {
    socket.join(chatId);
    socket.userId = userId;
    console.log(`📱 User ${userId} joined room: ${chatId}`);

    // Fetch history from DB
    try {
      const messages = await Message.find({ chatId }).sort({ timestamp: 1 });
      socket.emit('chat-history', messages);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  });

  // Handle new message
  socket.on('message', async (data) => {
    const { chatId, senderId, text, image, timestamp } = data;

    // Create message object
    const newMessage = new Message({
      chatId,
      senderId,
      text,
      image,
      timestamp: timestamp || Date.now(),
      status: 'sent'
    });

    try {
      // Save to MongoDB
      const savedMessage = await newMessage.save();
      console.log(`💬 Saved message: ${savedMessage.text} in ${chatId}`);

      // Broadcast to specific chat room (for open chat screens)
      io.to(chatId).emit('message', savedMessage);

      // Identify Recipient to send notification/list update
      const [userA, userB] = chatId.split('_');
      const recipientId = userA === senderId ? userB : userA;

      // Emit 'new-message' to both Sender (for list update) and Recipient
      io.to(recipientId).emit('new-message', savedMessage);
      io.to(senderId).emit('new-message', savedMessage);

      // Simulate delivery update
      setTimeout(async () => {
        savedMessage.status = 'delivered';
        await savedMessage.save(); // Update status in DB
        io.to(chatId).emit('message-status', { messageId: savedMessage.id, status: 'delivered' });
      }, 500);

    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  // Typing
  socket.on('typing', ({ chatId, userId, isTyping }) => {
    socket.to(chatId).emit('typing', { userId, isTyping });
  });

  // Disconnect
  socket.on('disconnect', () => {
    const userId = onlineUsers.get(socket.id);
    onlineUsers.delete(socket.id);
    console.log(`❌ User disconnected: ${userId || socket.id}`);
    io.emit('online-users', Array.from(onlineUsers.values()));
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 WhatsApp Server (MongoDB) running on port ${PORT}`);
});
