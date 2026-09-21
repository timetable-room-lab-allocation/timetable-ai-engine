const express = require("express");

const {
    getAllSections,
    getSectionById,
    createSection,
    updateSection,
    deleteSection
} = require("../controllers/section.controller");

const validateSection = require("../middleware/section.validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sections
 *   description: Section management APIs
 */

/**
 * @swagger
 * /api/sections:
 *   get:
 *     summary: Get all sections
 *     tags: [Sections]
 *     responses:
 *       200:
 *         description: Sections fetched successfully
 *       500:
 *         description: Failed to fetch sections
 */
router.get("/", getAllSections);


/**
 * @swagger
 * /api/sections/{id}:
 *   get:
 *     summary: Get a section by ID
 *     tags: [Sections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Section ID
 *     responses:
 *       200:
 *         description: Section fetched successfully
 *       404:
 *         description: Section not found
 *       500:
 *         description: Failed to fetch section
 */
router.get("/:id", getSectionById);


/**
 * @swagger
 * /api/sections:
 *   post:
 *     summary: Create a new section
 *     tags: [Sections]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course_id
 *               - student_group_id
 *               - name
 *               - students
 *               - duration
 *               - room_type_required
 *             properties:
 *               course_id:
 *                 type: integer
 *                 example: 1
 *               student_group_id:
 *                 type: integer
 *                 example: 1
 *               lecturer_id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: AI101 - Group 2
 *               students:
 *                 type: integer
 *                 example: 30
 *               duration:
 *                 type: integer
 *                 example: 2
 *               room_type_required:
 *                 type: string
 *                 example: Lecture
 *     responses:
 *       201:
 *         description: Section created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Failed to create section
 */
router.post("/", validateSection, createSection);


/**
 * @swagger
 * /api/sections/{id}:
 *   put:
 *     summary: Update a section
 *     tags: [Sections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Section ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course_id
 *               - student_group_id
 *               - name
 *               - students
 *               - duration
 *               - room_type_required
 *             properties:
 *               course_id:
 *                 type: integer
 *                 example: 1
 *               student_group_id:
 *                 type: integer
 *                 example: 1
 *               lecturer_id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: AI101 - Group 2
 *               students:
 *                 type: integer
 *                 example: 35
 *               duration:
 *                 type: integer
 *                 example: 2
 *               room_type_required:
 *                 type: string
 *                 example: Lab
 *     responses:
 *       200:
 *         description: Section updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Section not found
 *       500:
 *         description: Failed to update section
 */
router.put("/:id", validateSection, updateSection);


/**
 * @swagger
 * /api/sections/{id}:
 *   delete:
 *     summary: Delete a section
 *     tags: [Sections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Section ID
 *     responses:
 *       200:
 *         description: Section deleted successfully
 *       404:
 *         description: Section not found
 *       500:
 *         description: Failed to delete section
 */
router.delete("/:id", deleteSection);

module.exports = router;