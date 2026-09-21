const pool = require("../config/db");
const { successResponse } = require("../utils/apiResponse");

const getAllAllocations = async (req, res) => {
    try {
        const [allocations] = await pool.query(
            `SELECT
                a.id,
                a.section_id,
                s.name AS section_name,
                a.lecturer_id,
                l.name AS lecturer_name,
                a.room_id,
                r.name AS room_name,
                a.timeslot_id,
                t.day,
                t.start_time,
                t.end_time,
                a.score,
                a.status,
                a.created_at
             FROM allocations a
             JOIN sections s
                ON a.section_id = s.id
             JOIN lecturers l
                ON a.lecturer_id = l.id
             JOIN rooms r
                ON a.room_id = r.id
             JOIN timeslots t
                ON a.timeslot_id = t.id
             ORDER BY a.id DESC`
        );

        return successResponse(
            res,
            200,
            "Allocations fetched successfully",
            allocations
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch allocations"
        });
    }
};

const getAllocationById = async (req, res) => {
    try {
        const { id } = req.params;

        const [allocations] = await pool.query(
            `SELECT
                a.id,
                a.section_id,
                s.name AS section_name,
                a.lecturer_id,
                l.name AS lecturer_name,
                a.room_id,
                r.name AS room_name,
                a.timeslot_id,
                t.day,
                t.start_time,
                t.end_time,
                a.score,
                a.status,
                a.created_at
             FROM allocations a
             JOIN sections s
                ON a.section_id = s.id
             JOIN lecturers l
                ON a.lecturer_id = l.id
             JOIN rooms r
                ON a.room_id = r.id
             JOIN timeslots t
                ON a.timeslot_id = t.id
             WHERE a.id = ?`,
            [id]
        );

        if (allocations.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Allocation not found"
            });
        }

        return successResponse(
            res,
            200,
            "Allocation fetched successfully",
            allocations[0]
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch allocation"
        });
    }
};

const createAllocation = async (req, res) => {
    try {
        const {
            section_id,
            lecturer_id,
            room_id,
            timeslot_id,
            score,
            status
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO allocations
            (
                section_id,
                lecturer_id,
                room_id,
                timeslot_id,
                score,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                section_id,
                lecturer_id,
                room_id,
                timeslot_id,
                score || 0,
                status || "Draft"
            ]
        );

        return successResponse(
            res,
            201,
            "Allocation created successfully",
            {
                allocationId: result.insertId
            }
        );

    } catch (error) {
        console.error(error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "This allocation conflicts with an existing allocation"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create allocation"
        });
    }
};

const updateAllocation = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            section_id,
            lecturer_id,
            room_id,
            timeslot_id,
            score,
            status
        } = req.body;

        const [result] = await pool.query(
            `UPDATE allocations
             SET section_id = ?,
                 lecturer_id = ?,
                 room_id = ?,
                 timeslot_id = ?,
                 score = ?,
                 status = ?
             WHERE id = ?`,
            [
                section_id,
                lecturer_id,
                room_id,
                timeslot_id,
                score,
                status,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Allocation not found"
            });
        }

        return successResponse(
            res,
            200,
            "Allocation updated successfully"
        );

    } catch (error) {
        console.error(error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "This allocation conflicts with an existing allocation"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update allocation"
        });
    }
};

const deleteAllocation = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM allocations WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Allocation not found"
            });
        }

        return successResponse(
            res,
            200,
            "Allocation deleted successfully"
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete allocation"
        });
    }
};

module.exports = {
    getAllAllocations,
    getAllocationById,
    createAllocation,
    updateAllocation,
    deleteAllocation
};