const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  title: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: { type: [String], required: true },
      correctAnswer: { type: Number, required: true }, // Index of the correct option
    },
  ],
});

module.exports = mongoose.model("Quiz", QuizSchema);
