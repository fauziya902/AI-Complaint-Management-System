const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const complaintRoutes = require("./routes/complaintRoutes");
require("dotenv").config();
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/complaints", complaintRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/admin", adminRoutes);
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
// Example: GET /api/users
app.get('/api/users', async (req, res) => {
  const users = await User.find().select('-password'); // Password chhor kar sab bhejien
  res.json(users);
});
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));


