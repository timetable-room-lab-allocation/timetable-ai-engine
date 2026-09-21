const express = require("express");

const {
    getAllLecturers,
    getLecturerById,
    createLecturer,
    updateLecturer,
    deleteLecturer
} = require("../controllers/lecturer.controller");

const validateLecturer = require("../middleware/lecturer.validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Lecturers
 *   description: Lecturer management APIs
 */

/**
 * @swagger
 * /api/lecturers:
 *   get:
 *     summary: Get all lecturers
 *     tags: [Lecturers]
 *     responses:
 *       200:
 *         description: Lecturers fetched successfully
 *       500:
 *         description: Failed to fetch lecturers
 */
router.get("/", getAllLecturers);


/**
 * @swagger
 * /api/lecturers/{id}:
 *   get:
 *     summary: Get a lecturer by ID
 *     tags: [Lecturers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Lecturer ID
 *     responses:
 *       200:
 *         description: Lecturer fetched successfully
 *       404:
 *         description: Lecturer not found
 *       500:
 *         description: Failed to fetch lecturer
 */
router.get("/:id", getLecturerById);


/**
 * @swagger
 * /api/lecturers:
 *   post:
 *     summary: Create a new lecturer
 *     tags: [Lecturers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: Dr. Ahmed Mohamed
 *     responses:
 *       201:
 *         description: Lecturer created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Failed to create lecturer
 */
router.post("/", validateLecturer, createLecturer);


/**
 * @swagger
 * /api/lecturers/{id}:
 *   put:
 *     summary: Update a lecturer
 *     tags: [Lecturers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Lecturer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: Dr. Ahmed Ali
 *     responses:
 *       200:
 *         description: Lecturer updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Lecturer not found
 *       500:
 *         description: Failed to update lecturer
 */
router.put("/:id", validateLecturer, updateLecturer);


/**
 * @swagger
 * /api/lecturers/{id}:
 *   delete:
 *     summary: Delete a lecturer
 *     tags: [Lecturers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Lecturer ID
 *     responses:
 *       200:
 *         description: Lecturer deleted successfully
 *       404:
 *         description: Lecturer not found
 *       500:
 *         description: Failed to delete lecturer
 */
router.delete("/:id", deleteLecturer);

module.exports = router;