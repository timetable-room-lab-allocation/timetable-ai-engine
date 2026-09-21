const express = require("express");

const {
    getAllEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment
} = require("../controllers/equipment.controller");

const validateEquipment = require("../middleware/equipment.validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Equipment
 *   description: Equipment management APIs
 */

/**
 * @swagger
 * /api/equipment:
 *   get:
 *     summary: Get all equipment
 *     tags: [Equipment]
 *     responses:
 *       200:
 *         description: Equipment fetched successfully
 *       500:
 *         description: Failed to fetch equipment
 */
router.get("/", getAllEquipment);


/**
 * @swagger
 * /api/equipment/{id}:
 *   get:
 *     summary: Get equipment by ID
 *     tags: [Equipment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment ID
 *     responses:
 *       200:
 *         description: Equipment fetched successfully
 *       404:
 *         description: Equipment not found
 *       500:
 *         description: Failed to fetch equipment
 */
router.get("/:id", getEquipmentById);


/**
 * @swagger
 * /api/equipment:
 *   post:
 *     summary: Create new equipment
 *     tags: [Equipment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Projector
 *     responses:
 *       201:
 *         description: Equipment created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Failed to create equipment
 */
router.post("/", validateEquipment, createEquipment);


/**
 * @swagger
 * /api/equipment/{id}:
 *   put:
 *     summary: Update equipment
 *     tags: [Equipment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Smart Projector
 *     responses:
 *       200:
 *         description: Equipment updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Equipment not found
 *       500:
 *         description: Failed to update equipment
 */
router.put("/:id", validateEquipment, updateEquipment);


/**
 * @swagger
 * /api/equipment/{id}:
 *   delete:
 *     summary: Delete equipment
 *     tags: [Equipment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment ID
 *     responses:
 *       200:
 *         description: Equipment deleted successfully
 *       404:
 *         description: Equipment not found
 *       500:
 *         description: Failed to delete equipment
 */
router.delete("/:id", deleteEquipment);

module.exports = router;