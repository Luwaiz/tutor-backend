const User = require("../models/User");
const QuizResult = require('../models/QuizResult');
async function updateProgress(studentId, category) {
	try {
		// Fetch all quiz results for this student in the specified category
		const results = await QuizResult.find({ studentId, category });

		// Calculate progress
		const totalQuizzesTaken = results.length;
		const averageScore =
			totalQuizzesTaken > 0
				? results.reduce((sum, result) => sum + result.score, 0) / totalQuizzesTaken
				: 0;

		// Update the student's progress in the corresponding category
		await User.updateOne(
			{ _id: studentId },
			{
				$set: {
					[`categoriesProgress.${category}`]: {
						totalQuizzesTaken,
						averageScore,
						lastUpdated: new Date(),
					},
				},
			}
		);
	} catch (error) {
		console.error('Failed to update progress:', error);
	}
}

module.exports = updateProgress;