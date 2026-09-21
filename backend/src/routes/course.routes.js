const express = require("express");

const {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
} = require("../controllers/course.controller");

const validateCourse = require("../middleware/course.validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management APIs
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Courses fetched successfully
 *       500:
 *         description: Failed to fetch courses
 */
router.get("/", getAllCourses);


/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course fetched successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Failed to fetch course
 */
router.get("/:id", getCourseById);


/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *             properties:
 *               code:
 *                 type: string
 *                 example: AI101
 *               name:
 *                 type: string
 *                 example: Artificial Intelligence
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Failed to create course
 */
router.post("/", validateCourse, createCourse);


/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *             properties:
 *               code:
 *                 type: string
 *                 example: AI102
 *               name:
 *                 type: string
 *                 example: Machine Learning
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Course not found
 *       500:
 *         description: Failed to update course
 */
router.put("/:id", validateCourse, updateCourse);


/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Failed to delete course
 */
router.delete("/:id", deleteCourse);

module.exports = router;