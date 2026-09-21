const pool = require("../config/db");
const { successResponse } = require("../utils/apiResponse");

const getAllTimeslots = async (req, res) => {
    try {
        const [timeslots] = await pool.query(
            "SELECT * FROM timeslots"
        );

        return successResponse(
            res,
            200,
            "Timeslots fetched successfully",
            timeslots
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch timeslots"
        });
    }
};

const getTimeslotById = async (req, res) => {
    try {
        const { id } = req.params;

        const [timeslots] = await pool.query(
            "SELECT * FROM timeslots WHERE id = ?",
            [id]
        );

        if (timeslots.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Timeslot not found"
            });
        }

        return successResponse(
            res,
            200,
            "Timeslot fetched successfully",
            timeslots[0]
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch timeslot"
        });
    }
};

const createTimeslot = async (req, res) => {
    try {
        const {
            day,
            start_time,
            end_time
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO timeslots
             (day, start_time, end_time)
             VALUES (?, ?, ?)`,
            [day, start_time, end_time]
        );

        return successResponse(
            res,
            201,
            "Timeslot created successfully",
            {
                timeslotId: result.insertId
            }
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create timeslot"
        });
    }
};

const updateTimeslot = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            day,
            start_time,
            end_time
        } = req.body;

        const [result] = await pool.query(
            `UPDATE timeslots
             SET day = ?,
                 start_time = ?,
                 end_time = ?
             WHERE id = ?`,
            [day, start_time, end_time, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Timeslot not found"
            });
        }

        return successResponse(
            res,
            200,
            "Timeslot updated successfully"
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update timeslot"
        });
    }
};

const deleteTimeslot = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM timeslots WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Timeslot not found"
            });
        }

        return successResponse(
            res,
            200,
            "Timeslot deleted successfully"
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete timeslot"
        });
    }
};

module.exports = {
    getAllTimeslots,
    getTimeslotById,
    createTimeslot,
    updateTimeslot,
    deleteTimeslot
};