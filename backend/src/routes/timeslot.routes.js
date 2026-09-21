const express = require("express");

const {
    getAllTimeslots,
    getTimeslotById,
    createTimeslot,
    updateTimeslot,
    deleteTimeslot
} = require("../controllers/timeslot.controller");

const validateTimeslot = require("../middleware/timeslot.validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Timeslots
 *   description: Timeslot management APIs
 */

/**
 * @swagger
 * /api/timeslots:
 *   get:
 *     summary: Get all timeslots
 *     tags: [Timeslots]
 *     responses:
 *       200:
 *         description: Timeslots fetched successfully
 *       500:
 *         description: Failed to fetch timeslots
 */
router.get("/", getAllTimeslots);


/**
 * @swagger
 * /api/timeslots/{id}:
 *   get:
 *     summary: Get a timeslot by ID
 *     tags: [Timeslots]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Timeslot ID
 *     responses:
 *       200:
 *         description: Timeslot fetched successfully
 *       404:
 *         description: Timeslot not found
 *       500:
 *         description: Failed to fetch timeslot
 */
router.get("/:id", getTimeslotById);


/**
 * @swagger
 * /api/timeslots:
 *   post:
 *     summary: Create a new timeslot
 *     tags: [Timeslots]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - day
 *               - start_time
 *               - end_time
 *             properties:
 *               day:
 *                 type: string
 *                 example: Sunday
 *               start_time:
 *                 type: string
 *                 format: time
 *                 example: "10:00"
 *               end_time:
 *                 type: string
 *                 format: time
 *                 example: "12:00"
 *     responses:
 *       201:
 *         description: Timeslot created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Failed to create timeslot
 */
router.post("/", validateTimeslot, createTimeslot);


/**
 * @swagger
 * /api/timeslots/{id}:
 *   put:
 *     summary: Update a timeslot
 *     tags: [Timeslots]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Timeslot ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - day
 *               - start_time
 *               - end_time
 *             properties:
 *               day:
 *                 type: string
 *                 example: Monday
 *               start_time:
 *                 type: string
 *                 format: time
 *                 example: "12:00"
 *               end_time:
 *                 type: string
 *                 format: time
 *                 example: "14:00"
 *     responses:
 *       200:
 *         description: Timeslot updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Timeslot not found
 *       500:
 *         description: Failed to update timeslot
 */
router.put("/:id", validateTimeslot, updateTimeslot);


/**
 * @swagger
 * /api/timeslots/{id}:
 *   delete:
 *     summary: Delete a timeslot
 *     tags: [Timeslots]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Timeslot ID
 *     responses:
 *       200:
 *         description: Timeslot deleted successfully
 *       404:
 *         description: Timeslot not found
 *       500:
 *         description: Failed to delete timeslot
 */
router.delete("/:id", deleteTimeslot);

module.exports = router;