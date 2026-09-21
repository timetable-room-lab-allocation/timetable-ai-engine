const express = require("express");

const {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom
} = require("../controllers/room.controller");

const validateRoom = require("../middleware/room.validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management APIs
 */

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: Rooms fetched successfully
 *       500:
 *         description: Failed to fetch rooms
 */
router.get("/", getAllRooms);


/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Get a room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room fetched successfully
 *       404:
 *         description: Room not found
 *       500:
 *         description: Failed to fetch room
 */
router.get("/:id", getRoomById);


/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - room_type
 *               - capacity
 *             properties:
 *               name:
 *                 type: string
 *                 example: Room 4
 *               room_type:
 *                 type: string
 *                 example: Lecture
 *               capacity:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       201:
 *         description: Room created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Failed to create room
 */
router.post("/", validateRoom, createRoom);


/**
 * @swagger
 * /api/rooms/{id}:
 *   put:
 *     summary: Update a room
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - room_type
 *               - capacity
 *             properties:
 *               name:
 *                 type: string
 *                 example: Room 4
 *               room_type:
 *                 type: string
 *                 example: Lab
 *               capacity:
 *                 type: integer
 *                 example: 60
 *               is_available:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Room updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Room not found
 *       500:
 *         description: Failed to update room
 */
router.put("/:id", validateRoom, updateRoom);


/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     summary: Delete a room
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *       404:
 *         description: Room not found
 *       500:
 *         description: Failed to delete room
 */
router.delete("/:id", deleteRoom);

module.exports = router;