const pool = require("../config/db");
const { successResponse } = require("../utils/apiResponse");

const getAllLecturers = async (req, res) => {
    try {
        const [lecturers] = await pool.query(
            "SELECT * FROM lecturers"
        );

        return successResponse(
            res,
            200,
            "Lecturers fetched successfully",
            lecturers
        );
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch lecturers"
        });
    }
};

const getLecturerById = async (req, res) => {
    try {
        const { id } = req.params;

        const [lecturers] = await pool.query(
            "SELECT * FROM lecturers WHERE id = ?",
            [id]
        );

        if (lecturers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Lecturer not found"
            });
        }

        return successResponse(
            res,
            200,
            "Lecturer fetched successfully",
            lecturers[0]
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch lecturer"
        });
    }
};

const createLecturer = async (req, res) => {
    try {
        const { user_id, name } = req.body;

        const [result] = await pool.query(
            `INSERT INTO lecturers (user_id, name)
             VALUES (?, ?)`,
            [user_id || null, name]
        );

        return successResponse(
            res,
            201,
            "Lecturer created successfully",
            {
                lecturerId: result.insertId
            }
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create lecturer"
        });
    }
};

const updateLecturer = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, name } = req.body;

        const [result] = await pool.query(
            `UPDATE lecturers
             SET user_id = ?, name = ?
             WHERE id = ?`,
            [user_id || null, name, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Lecturer not found"
            });
        }

        return successResponse(
            res,
            200,
            "Lecturer updated successfully"
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update lecturer"
        });
    }
};

const deleteLecturer = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM lecturers WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Lecturer not found"
            });
        }

        return successResponse(
            res,
            200,
            "Lecturer deleted successfully"
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete lecturer"
        });
    }
};

module.exports = {
    getAllLecturers,
    getLecturerById,
    createLecturer,
    updateLecturer,
    deleteLecturer
};