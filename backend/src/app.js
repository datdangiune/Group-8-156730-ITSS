const express = require('express');
require('dotenv').config();
const sequelize = require('./database');
const router = require('./routes/route');
const adminRoutes = require('./routes/admin'); // Import admin routes
const authRoutes = require('./routes/auth'); // Import auth routes
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const { decrypt } = require('./util/encryption');
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép tất cả frontend kết nối
  },
});
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
  
    // Nhận sự kiện từ A
    socket.on("updateService", (data) => {
      console.log("Service updated:", data);
  
      // Gửi sự kiện cho tất cả client (bao gồm cả B)
      io.emit("serviceUpdated", data);
    });
  
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
app.use('/api/admin', adminRoutes); // Register admin routes under /api prefix
app.use('/api/auth', authRoutes); // Register auth routes under /api prefix
router(app);

app.get('/', (req, res) => {
    res.send('Welcome to the Pet Care API!');
});

sequelize.sync({ force: false})
    .then(() => {
        console.log('Database synced successfully.');
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        }); 
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });