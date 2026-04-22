const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  exposedHeaders: ['Content-Disposition']
}));
app.use(express.json());

// Serve uploaded QR code images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Store io instance in app for use in controllers
app.set('io', io);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('Client connected for real-time alerts');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Import Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const batchRoutes = require('./routes/batches');
const scanRoutes = require('./routes/scans');
const analyticsRoutes = require('./routes/analytics');
const alertRoutes = require('./routes/alerts');
const companyRoutes = require('./routes/companies');
const distributorRoutes = require('./routes/distributor');
const retailerRoutes = require('./routes/retailer');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/distributor', distributorRoutes);
app.use('/api/retailer', retailerRoutes);

app.get('/', (req, res) => res.send('SnackShield Production Server API.'));

// DB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/snackshield';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Synchronized.'))
  .catch(err => console.error('Database Connection Refused:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Senior Architect Server active on port ${PORT}`);
  console.log('Real-time alerts enabled via Socket.IO');
});
