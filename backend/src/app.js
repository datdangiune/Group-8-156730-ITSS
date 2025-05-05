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
const {VNPay} = require('vnpay');
const {HashAlgorithm, ProductCode} = require('./enums')
const vnpay = new VNPay({
  tmnCode: process.env.vnp_TmnCode,
  secureSecret: process.env.vnp_HashSecret,
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true, // optional
  hashAlgorithm: HashAlgorithm.SHA512, // optional
  enableLog: true, // optional
  //loggerFn: ignoreLogger, // optional
  endpoints: {
    paymentEndpoint: 'paymentv2/vpcpay.html',
    queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
    getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
},
})
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
app.get('/payment-url', (req, res)=>{
  const urlString = vnpay.buildPaymentUrl(
    {
        vnp_Amount: 10000,
        vnp_IpAddr: '1.1.1.1',
        vnp_TxnRef: '123456',
        vnp_OrderInfo: 'Payment for order 123456',
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: `http://localhost:3000/vnpay-return`,
    },
    {
        logger: {
            type: 'pick',
            fields: ['createdAt', 'method', 'paymentUrl'], // Select fields want to log
            //loggerFn: (data) => consoleLogger(data), // Log to console, or use your custom logger
        },
    },
);
return res.json({ paymentUrl: urlString });
})
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