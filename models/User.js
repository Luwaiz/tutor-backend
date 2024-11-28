const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
	},
	enrolledCourses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course", // Reference to the Course model
		},
	],
	categoriesProgress: {
		Sciences: {
			completedCourses: { type: Number, default: 0 },
			totalQuizzesTaken: { type: Number, default: 0 },
			averageScore: { type: Number, default: 0 },
			lastUpdated: { type: Date, default: null },
		},
		Literature: {
			completedCourses: { type: Number, default: 0 },
			totalQuizzesTaken: { type: Number, default: 0 },
			averageScore: { type: Number, default: 0 },
			lastUpdated: { type: Date, default: null },
		},
		Tech: {
			completedCourses: { type: Number, default: 0 },
			totalQuizzesTaken: { type: Number, default: 0 },
			averageScore: { type: Number, default: 0 },
			lastUpdated: { type: Date, default: null },
		},
		Others: {
			completedCourses: { type: Number, default: 0 },
			totalQuizzesTaken: { type: Number, default: 0 },
			averageScore: { type: Number, default: 0 },
			lastUpdated: { type: Date, default: null },
		},
	},
});

// Export the User model
module.exports = mongoose.model("User ", UserSchema);
