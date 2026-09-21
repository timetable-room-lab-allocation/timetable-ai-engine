const pool = require("../config/db");
const { successResponse } = require("../utils/apiResponse");

const getAllEquipment = async (req, res) => {
    try {
        const [equipment] = await pool.query(
            "SELECT * FROM equipment"
        );

        successResponse(
            res,
            200,
            "Equipment fetched successfully",
            equipment
        );

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch equipment"
        });
    }
};

const getEquipmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const [equipment] = await pool.query(
            "SELECT * FROM equipment WHERE id = ?",
            [id]
        );

        if (equipment.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Equipment not found"
            });
        }

        successResponse(
            res,
            200,
            "Equipment fetched successfully",
            equipment[0]
        );

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch equipment"
        });
    }
};

const createEquipment = async (req, res) => {
    try {
        const { name } = req.body;

        const [result] = await pool.query(
            "INSERT INTO equipment (name) VALUES (?)",
            [name]
        );

        successResponse(
            res,
            201,
            "Equipment created successfully",
            {
                equipmentId: result.insertId
            }
        );

    } catch (error) {
        console.error(error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Equipment already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create equipment"
        });
    }
};

const updateEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const [result] = await pool.query(
            "UPDATE equipment SET name = ? WHERE id = ?",
            [name, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Equipment not found"
            });
        }

        successResponse(
            res,
            200,
            "Equipment updated successfully"
        );

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update equipment"
        });
    }
};

const deleteEquipment = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM equipment WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Equipment not found"
            });
        }

        successResponse(
            res,
            200,
            "Equipment deleted successfully"
        );

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete equipment"
        });
    }
};

module.exports = {
    getAllEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment
};