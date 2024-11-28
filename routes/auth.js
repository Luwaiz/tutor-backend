const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticateJWT = require("../middleware/AuthenticateJWT");
const router = express.Router();
require("dotenv").config();
// Sign Up
router.post("/signup", async (req, res) => {
	const { username, email, password } = req.body;

	try {
		// Check if the user already exists
		const existingUser = await User.findOne({ $or: [{ username }, { email }] });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "Username or email already exists" });
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new user
		const newUser = new User({
			username,
			email,
			password: hashedPassword,
		});

		// Save the user to the database
		await newUser.save();

		res.status(201).json({ message: "User  created successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
});

// Login
router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	try {
		// Check if user exists by username or email
		const user = await User.findOne({
			$or: [{ username }, { email: username }],
		});
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Generate JWT
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		res.json({
			message: "Login successful",
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
			},
		});
	} catch (error) {
		console.error("Login error:", error); // Log the error
		res.status(500).json({ message: "Server error" });
	}
});
router.get('/user', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id; // Assuming the user ID is stored in the token
        const user = await User.findById(userId).select('username email'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/progress/:studentId
router.get("/progress/:studentId", async (req, res) => {
    const { studentId } = req.params;

    try {
        // Fetch the user's progress data
        const user = await User.findById(studentId, "categoriesProgress username email");

        if (!user) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Return the progress data
        res.json({
            message: "Progress retrieved successfully",
            username: user.username,
            email: user.email,
            categoriesProgress: user.categoriesProgress,
        });
    } catch (error) {
        console.error("Error retrieving progress:", error);
        res.status(500).json({ message: "Server error" });
    }
});
module.exports = router;
