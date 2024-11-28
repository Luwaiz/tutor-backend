const express = require("express");
const Course = require("../models/Course");
const Quiz = require("../models/Quiz");
const QuizResult = require('../models/QuizResult');
const updateProgress = require('../middleware/UpgradeProgress'); 
const authenticateJWT = require("../middleware/AuthenticateJWT");

const router = express.Router();

// Endpoint to upload a new course
router.post("/upload", authenticateJWT, async (req, res) => {
	const {
		courseName,
		hours,
		courseDescription,
		lessons,
		content,
		category, // Include category in request body
	} = req.body;

	// The user who uploads the course is retrieved from the authenticated token
	const uploadedBy = req.user.id;

	// Define allowed categories
	const validCategories = ["Sciences", "Literature", "Tech", "Others"];

	// Validate the category
	if (!validCategories.includes(category)) {
		return res.status(400).json({ message: "Invalid category" });
	}

	try {
		// Create and save the course
		const newCourse = new Course({
			courseName,
			hours,
			uploadedBy,
			lessons,
			content,
			courseDescription,
			category, // Save the category
		});

		await newCourse.save();

		res.status(201).json({
			message: "Course uploaded successfully",
			course: newCourse,
		});
	} catch (error) {
		console.error("Error uploading course:", error);
		res.status(500).json({ message: "Server error", error });
	}
});

// Endpoint to get all courses
router.get("/allCourses", authenticateJWT, async (req, res) => {
	try {
		// Retrieve all courses
		const courses = await Course.find();

		// Respond with the list of courses
		res.status(200).json(courses);
	} catch (error) {
		console.error("Error fetching courses:", error);
		res.status(500).json({ message: "Server error", error });
	}
});
router.post("/enroll/:courseId", authenticateJWT, async (req, res) => {
	const { courseId } = req.params;
	const userId = req.user.id;

	try {
		// Check if the course exists
		const course = await Course.findById(courseId);
		if (!course) {
			return res.status(404).json({ message: "Course not found" });
		}

		// Get the user and add the course to their enrolledCourses
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if the user is already enrolled
		if (user.enrolledCourses.includes(courseId)) {
			return res
				.status(400)
				.json({ message: "You are already enrolled in this course" });
		}

		user.enrolledCourses.push(courseId);
		await user.save();

		res.status(200).json({ message: "Successfully enrolled in the course" });
	} catch (error) {
		console.error("Error enrolling in course:", error);
		res.status(500).json({ message: "Server error", error });
	}
});
router.get("/enrolled-courses", authenticateJWT, async (req, res) => {
	const userId = req.user.id;

	try {
		// Find the user and populate the enrolled courses
		const user = await User.findById(userId).populate("enrolledCourses");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({ enrolledCourses: user.enrolledCourses });
	} catch (error) {
		console.error("Error fetching enrolled courses:", error);
		res.status(500).json({ message: "Server error", error });
	}
});
router.post("/:courseId/quiz", authenticateJWT, async (req, res) => {
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
  router.get("/:courseId/quizzes", authenticateJWT, async (req, res) => {
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
  
  router.get("/category/:category", async (req, res) => {
	try {
		const { category } = req.params;

		// Validate category
		const validCategories = ["Sciences", "Literature", "Tech", "Others"];
		if (!validCategories.includes(category)) {
			return res.status(400).json({ error: "Invalid category" });
		}

		const courses = await Course.find({ category });

		res.status(200).json(courses);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to fetch courses by category" });
	}
});


router.post('/api/quiz-result', async (req, res) => {
	const { studentId, courseId, category, score } = req.body;

	try {
		// Save the quiz result
		await QuizResult.create({ studentId, courseId, category, score });

		// Update the student's progress in the category
		await updateProgress(studentId, category);

		res.status(200).json({ message: 'Quiz result saved and progress updated.' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to save quiz result or update progress.' });
	}
});

module.exports = router;
