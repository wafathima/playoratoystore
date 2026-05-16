const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");


const app = express();
connectDB();

app.use(cors({
  origin: ["https://playora-toys-frontend.onrender.com",  
    "http://localhost:3000", 
    "http://localhost:5173"],
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb"  }));


// Auth
app.use("/api/user/auth", require("./routes/user/authRoutes"));
app.use("/api/admin/auth", require("./routes/admin/adminAuthRoutes"));

// Products
app.use("/api/user/products", require("./routes/user/productRoutes"));
app.use("/api/admin/products", require("./routes/admin/adminProductRoutes"));

// Cart & Wishlist
app.use("/api/user/cart", require("./routes/user/cartRoutes"));
app.use("/api/user/wishlist", require("./routes/user/wishlistRoutes"));

// Orders
app.use("/api/user/orders", require("./routes/user/orderRoutes"));
app.use("/api/admin/orders", require("./routes/admin/adminOrderRoutes"));


app.use("/api/admin/users", require("./routes/admin/adminUserRoutes"));

app.use("/api/user", require("./routes/user/userRoutes"));
app.use("/api/admin", require("./routes/admin/adminRoutes"));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));



const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

console.log("Backend running");


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

