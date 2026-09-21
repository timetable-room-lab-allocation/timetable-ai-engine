const express = require("express");

const {
    getAllStudentGroups,
    getStudentGroupById,
    createStudentGroup,
    updateStudentGroup,
    deleteStudentGroup
} = require("../controllers/studentGroup.controller");

const validateStudentGroup = require("../middleware/studentGroup.validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Student Groups
 *   description: Student group management APIs
 */

/**
 * @swagger
 * /api/student-groups:
 *   get:
 *     summary: Get all student groups
 *     tags: [Student Groups]
 *     responses:
 *       200:
 *         description: Student groups fetched successfully
 *       500:
 *         description: Failed to fetch student groups
 */
router.get("/", getAllStudentGroups);


/**
 * @swagger
 * /api/student-groups/{id}:
 *   get:
 *     summary: Get a student group by ID
 *     tags: [Student Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student group ID
 *     responses:
 *       200:
 *         description: Student group fetched successfully
 *       404:
 *         description: Student group not found
 *       500:
 *         description: Failed to fetch student group
 */
router.get("/:id", getStudentGroupById);


/**
 * @swagger
 * /api/student-groups:
 *   post:
 *     summary: Create a new student group
 *     tags: [Student Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - student_count
 *             properties:
 *               name:
 *                 type: string
 *                 example: AI Group 1
 *               student_count:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       201:
 *         description: Student group created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Failed to create student group
 */
router.post("/", validateStudentGroup, createStudentGroup);


/**
 * @swagger
 * /api/student-groups/{id}:
 *   put:
 *     summary: Update a student group
 *     tags: [Student Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - student_count
 *             properties:
 *               name:
 *                 type: string
 *                 example: AI Group 1
 *               student_count:
 *                 type: integer
 *                 example: 35
 *     responses:
 *       200:
 *         description: Student group updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Student group not found
 *       500:
 *         description: Failed to update student group
 */
router.put("/:id", validateStudentGroup, updateStudentGroup);


/**
 * @swagger
 * /api/student-groups/{id}:
 *   delete:
 *     summary: Delete a student group
 *     tags: [Student Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student group ID
 *     responses:
 *       200:
 *         description: Student group deleted successfully
 *       404:
 *         description: Student group not found
 *       500:
 *         description: Failed to delete student group
 */
router.delete("/:id", deleteStudentGroup);

module.exports = router;