const express = require("express");

const {
    generateRecommendations
} = require("../controllers/ai.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: AI timetable recommendation APIs
 */

/**
 * @swagger
 * /api/ai/recommendations:
 *   post:
 *     summary: Generate timetable recommendations
 *     description: Sends timetable allocation data to the AI engine and returns recommended room and timeslot allocations.
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             section_id: 1
 *             students: 30
 *             duration: 1
 *             room_type_required: Lecture
 *     responses:
 *       200:
 *         description: Recommendations generated successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: AI recommendation service error
 */
router.post("/recommendations", generateRecommendations);

module.exports = router;