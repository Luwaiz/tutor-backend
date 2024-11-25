const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
	{
		courseName: {
			type: String,
			required: true,
			trim: true,
		},
		hours: {
			type: Number,
			required: true,
		},
		courseDescription: {
			type: String,
			required: true,
		},
		uploadedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User", // Reference to the User who uploaded the course
			required: true,
		},
		lessons: {
			type: Number,
			required: true,
		},
		content: [
			{
				title: { type: String, required: true },
				description: { type: String, required: true },
			},
		],
		quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }], // New field
		category: {
			type: String,
			enum: ["Sciences", "Literature", "Tech", "Others"], // Allowed categories
			required: true,
		},
	},

	{ timestamps: true }
); // Automatically add createdAt and updatedAt fields

module.exports = mongoose.model("Course", CourseSchema);
