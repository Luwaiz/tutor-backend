const express = require("express");
const Course = require("../models/Course");
const authenticateJWT = require("../middleware/AuthenticateJWT");

const router = express.Router();

// Endpoint to upload a new course
router.post("/upload", authenticateJWT, async (req, res) => {
    const { courseName, hours, lessons, content } = req.body;

    // The user who uploads the course is retrieved from the authenticated token
    const uploadedBy = req.user.id;

    try {
        // Create and save the course
        const newCourse = new Course({
            courseName,
            hours,
            uploadedBy,
            lessons,
            content,
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

module.exports = router;
