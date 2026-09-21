const express = require("express");

const {
    getAllAllocations,
    getAllocationById,
    createAllocation,
    updateAllocation,
    deleteAllocation
} = require("../controllers/allocation.controller");

const validateAllocation = require("../middleware/allocation.validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Allocations
 *   description: Room and timetable allocation management APIs
 */

/**
 * @swagger
 * /api/allocations:
 *   get:
 *     summary: Get all allocations
 *     tags: [Allocations]
 *     responses:
 *       200:
 *         description: Allocations fetched successfully
 *       500:
 *         description: Failed to fetch allocations
 */
router.get("/", getAllAllocations);


/**
 * @swagger
 * /api/allocations/{id}:
 *   get:
 *     summary: Get an allocation by ID
 *     tags: [Allocations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Allocation ID
 *     responses:
 *       200:
 *         description: Allocation fetched successfully
 *       404:
 *         description: Allocation not found
 *       500:
 *         description: Failed to fetch allocation
 */
router.get("/:id", getAllocationById);


/**
 * @swagger
 * /api/allocations:
 *   post:
 *     summary: Create a new allocation
 *     tags: [Allocations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - section_id
 *               - lecturer_id
 *               - room_id
 *               - timeslot_id
 *             properties:
 *               section_id:
 *                 type: integer
 *                 example: 1
 *               lecturer_id:
 *                 type: integer
 *                 example: 1
 *               room_id:
 *                 type: integer
 *                 example: 2
 *               timeslot_id:
 *                 type: integer
 *                 example: 1
 *               score:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 87.5
 *               status:
 *                 type: string
 *                 enum:
 *                   - Draft
 *                   - Approved
 *                   - Rejected
 *                 example: Draft
 *     responses:
 *       201:
 *         description: Allocation created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Failed to create allocation
 */
router.post("/", validateAllocation, createAllocation);


/**
 * @swagger
 * /api/allocations/{id}:
 *   put:
 *     summary: Update an allocation
 *     tags: [Allocations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Allocation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - section_id
 *               - lecturer_id
 *               - room_id
 *               - timeslot_id
 *             properties:
 *               section_id:
 *                 type: integer
 *                 example: 1
 *               lecturer_id:
 *                 type: integer
 *                 example: 1
 *               room_id:
 *                 type: integer
 *                 example: 3
 *               timeslot_id:
 *                 type: integer
 *                 example: 6
 *               score:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 90
 *               status:
 *                 type: string
 *                 enum:
 *                   - Draft
 *                   - Approved
 *                   - Rejected
 *                 example: Approved
 *     responses:
 *       200:
 *         description: Allocation updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Allocation not found
 *       500:
 *         description: Failed to update allocation
 */
router.put("/:id", validateAllocation, updateAllocation);


/**
 * @swagger
 * /api/allocations/{id}:
 *   delete:
 *     summary: Delete an allocation
 *     tags: [Allocations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Allocation ID
 *     responses:
 *       200:
 *         description: Allocation deleted successfully
 *       404:
 *         description: Allocation not found
 *       500:
 *         description: Failed to delete allocation
 */
router.delete("/:id", deleteAllocation);

module.exports = router;