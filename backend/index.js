// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// require("dotenv").config();

// const connectDB = require("./config/db");


// const app = express();
// connectDB();

// app.use(cors({
//   origin: [
//     "https://playora-toys-frontend.onrender.com",  
//     "http://localhost:3000", 
//     "http://localhost:5173"],
//   credentials: true
// }));

// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb"  }));


// // Auth
// app.use("/api/user/auth", require("./routes/user/authRoutes"));
// app.use("/api/admin/auth", require("./routes/admin/adminAuthRoutes"));

// // Products
// app.use("/api/user/products", require("./routes/user/productRoutes"));
// app.use("/api/admin/products", require("./routes/admin/adminProductRoutes"));

// // Cart & Wishlist
// app.use("/api/user/cart", require("./routes/user/cartRoutes"));
// app.use("/api/user/wishlist", require("./routes/user/wishlistRoutes"));

// // Orders
// app.use("/api/user/orders", require("./routes/user/orderRoutes"));
// app.use("/api/admin/orders", require("./routes/admin/adminOrderRoutes"));


// app.use("/api/admin/users", require("./routes/admin/adminUserRoutes"));

// app.use("/api/user", require("./routes/user/userRoutes"));
// app.use("/api/admin", require("./routes/admin/adminRoutes"));


// app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// const errorHandler = require("./middlewares/errorHandler");
// app.use(errorHandler);

// console.log("Backend running");


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// Connect to Database with error handling
connectDB().catch(err => {
  console.error("Database connection failed:", err);
  process.exit(1);
});

// CORS configuration
const allowedOrigins = [
  "https://playora-toys-frontend.onrender.com",
  "http://localhost:3000",
  "http://localhost:5173"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "Playora Toys API is running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/user/auth",
      admin: "/api/admin/auth",
      products: "/api/user/products"
    }
  });
});

// Routes
app.use("/api/user/auth", require("./routes/user/authRoutes"));
app.use("/api/admin/auth", require("./routes/admin/adminAuthRoutes"));
app.use("/api/user/products", require("./routes/user/productRoutes"));
app.use("/api/admin/products", require("./routes/admin/adminProductRoutes"));
app.use("/api/user/cart", require("./routes/user/cartRoutes"));
app.use("/api/user/wishlist", require("./routes/user/wishlistRoutes"));
app.use("/api/user/orders", require("./routes/user/orderRoutes"));
app.use("/api/admin/orders", require("./routes/admin/adminOrderRoutes"));
app.use("/api/admin/users", require("./routes/admin/adminUserRoutes"));
app.use("/api/user", require("./routes/user/userRoutes"));
app.use("/api/admin", require("./routes/admin/adminRoutes"));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.url,
    method: req.method
  });
});

// Error handler
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});