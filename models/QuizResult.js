const  mongoose = require("mongoose");

const QuizResultSchema = new mongoose.Schema({
	studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
	category: { type: String, enum: ["Sciences", "Literature", "Tech", "Others"], required: true },
	score: { type: Number, required: true },
	timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("QuizResult", QuizResultSchema);
