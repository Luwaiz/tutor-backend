const express = require("express");
const Course = require("../models/Course");
const Quiz = require("../models/Quiz");
const authenticateJWT = require("../middleware/AuthenticateJWT");

const router = express.Router();

// Endpoint to create a quiz for a course
router.post("/courses/:courseId/quiz", authenticateJWT, async (req, res) => {
  const { courseId } = req.params;
  const { title, questions } = req.body;

  try {
    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create the quiz
    const quiz = new Quiz({
      courseId,
      title,
      questions,
    });

    // Save the quiz
    await quiz.save();

    // Link the quiz to the course
    course.quizzes.push(quiz._id);
    await course.save();

    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Endpoint to fetch all quizzes for a course
router.get("/courses/:courseId/quizzes", authenticateJWT, async (req, res) => {
  const { courseId } = req.params;

  try {
    // Fetch the quizzes for the course
    const quizzes = await Quiz.find({ courseId });
    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ message: "No quizzes found for this course" });
    }

    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Endpoint to fetch a single quiz (optional)
router.get("/quiz/:quizId", authenticateJWT, async (req, res) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
