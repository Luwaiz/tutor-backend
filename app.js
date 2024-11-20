const mongoose = require("mongoose");
const cors = require('cors')
require("dotenv").config();

const express = require("express");
const authRoutes = require("./routes/auth");
const app = express();
const PORT = process.env.PORT || 3000;
const MongoUri = process.env.MONGO_URI;

// Middleware to parse JSON requests
app.use(cors())
app.use(express.json());
app.use("/api/auth", authRoutes);

// Basic route
app.get("/", (req, res) => {
	res.send("Welcome to My API!");
	console.log(process.env.PORT);
});

// Start the server
mongoose
	.connect(MongoUri)
	.then(() => {
		console.log("Connected to MongoDB");

		app.listen(PORT, () => {
			console.log(`Server is running on http://localhost:${PORT}`);
		});
	})
	.catch((e) => {
		console.error(e);
	});
