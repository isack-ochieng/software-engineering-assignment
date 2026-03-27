const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/authDB");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27018/authDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Register route
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = new User({ name, email, password });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
});

// Start server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});