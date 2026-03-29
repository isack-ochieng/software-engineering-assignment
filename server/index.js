const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/authDB");

const app = express();
app.use(express.json());
app.use(cors());

// JWT Secret
const JWT_SECRET = "your-super-secret-jwt-key";
const JWT_EXPIRES_IN = "7d";

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/authDB")
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ==================== SIGNUP ROUTE ====================
app.post("/signup", async (req, res) => {
    console.log("Signup request received:", req.body); // Debug log
    
    const { name, email, password, employeeId, role, department } = req.body;
    
    // Validation
    if (!name || !email || !password || !employeeId) {
        return res.status(400).json({ 
            message: "Please fill in all required fields (*)" 
        });
    }
    
    if (password.length < 8) {
        return res.status(400).json({ 
            message: "Password must be at least 8 characters long" 
        });
    }
    
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email: email.toLowerCase() }, { employeeId }] 
        });
        
        if (existingUser) {
            if (existingUser.email === email.toLowerCase()) {
                return res.status(400).json({ 
                    message: "User with this email already exists" 
                });
            }
            if (existingUser.employeeId === employeeId) {
                return res.status(400).json({ 
                    message: "Employee ID already exists" 
                });
            }
        }
        
        // Create new user
        const user = new User({
            name,
            email: email.toLowerCase(),
            password,
            employeeId,
            role: role || 'employee',
            department: department || '',
            isActive: true,
            isVerified: true, // Set to true - no email verification needed
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        await user.save();
        console.log("User created successfully:", user.email); // Debug log
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
        
        // Return user info (excluding password)
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            employeeId: user.employeeId,
            role: user.role,
            department: user.department,
            createdAt: user.createdAt
        };
        
        res.status(201).json({
            message: "Account created successfully!",
            token,
            user: userResponse
        });
        
    } catch (error) {
        console.error("Signup error details:", error); // Detailed error log
        res.status(500).json({ 
            message: "Error creating account. Please try again.",
            error: error.message // This helps with debugging
        });
    }
});

// ==================== LOGIN ROUTE ====================
app.post("/login", async (req, res) => {
    console.log("Login request received:", req.body.email); // Debug log
    
    const { email, password, rememberMe } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ 
            message: "Please enter your email and password" 
        });
    }
    
    try {
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.status(401).json({ 
                message: "Invalid email or password" 
            });
        }
        
        // Check if account is active
        if (!user.isActive) {
            return res.status(401).json({ 
                message: "Account is deactivated. Please contact administrator" 
            });
        }
        
        // Verify password
        const isPasswordValid = user.comparePassword(password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: "Invalid email or password" 
            });
        }
        
        // Update last login time
        user.lastLogin = new Date();
        await user.save();
        
        // Generate JWT token
        const tokenExpiry = rememberMe ? "30d" : "1d";
        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email, 
                role: user.role,
                name: user.name
            },
            JWT_SECRET,
            { expiresIn: tokenExpiry }
        );
        
        // Return user info
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            employeeId: user.employeeId,
            role: user.role,
            department: user.department,
            lastLogin: user.lastLogin
        };
        
        res.status(200).json({
            message: "Login successful",
            token,
            user: userResponse
        });
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            message: "Error logging in. Please try again." 
        });
    }
});

// ==================== GET USER PROFILE ====================
app.get("/profile", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({ user });
        
    } catch (error) {
        console.error("Profile error:", error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

// ==================== TEST ROUTE ====================
app.get("/test", (req, res) => {
    res.json({ message: "Server is working!" });
});

// ==================== HEALTH CHECK ====================
app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "OK", 
        message: "Server is running",
        timestamp: new Date()
    });
});

// ==================== START SERVER ====================
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📡 Test the server: http://localhost:${PORT}/test`);
    console.log(`💾 MongoDB: mongodb://127.0.0.1:27018/authDB`);
});