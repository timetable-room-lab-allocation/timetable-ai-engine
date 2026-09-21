const pool = require("../config/db");
const { successResponse } = require("../utils/apiResponse");

const getAllRooms = async (req, res) => {
    try {
        const [rooms] = await pool.query(
            "SELECT * FROM rooms"
        );

        return successResponse(
            res,
            200,
            "Rooms fetched successfully",
            rooms
        );
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch rooms"
        });
    }
};

const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rooms] = await pool.query(
            "SELECT * FROM rooms WHERE id = ?",
            [id]
        );

        if (rooms.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        return successResponse(
            res,
            200,
            "Room fetched successfully",
            rooms[0]
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch room"
        });
    }
};

const createRoom = async (req, res) => {
    try {
        const {
            name,
            room_type,
            capacity
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO rooms
            (name, room_type, capacity)
            VALUES (?, ?, ?)`,
            [name, room_type, capacity]
        );

        return successResponse(
            res,
            201,
            "Room created successfully",
            {
                roomId: result.insertId
            }
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create room"
        });
    }
};

const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            room_type,
            capacity,
            is_available
        } = req.body;

        const [result] = await pool.query(
            `UPDATE rooms
             SET name = ?,
                 room_type = ?,
                 capacity = ?,
                 is_available = ?
             WHERE id = ?`,
            [
                name,
                room_type,
                capacity,
                is_available,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        return successResponse(
            res,
            200,
            "Room updated successfully"
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update room"
        });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM rooms WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        return successResponse(
            res,
            200,
            "Room deleted successfully"
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete room"
        });
    }
};

module.exports = {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom
};