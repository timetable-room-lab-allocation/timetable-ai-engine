const pool = require("../config/db");
const { successResponse } = require("../utils/apiResponse");

const getAllStudentGroups = async (req, res) => {
    try {
        const [groups] = await pool.query(
            "SELECT * FROM student_groups"
        );

        return successResponse(
            res,
            200,
            "Student groups fetched successfully",
            groups
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch student groups"
        });
    }
};

const getStudentGroupById = async (req, res) => {
    try {
        const { id } = req.params;

        const [groups] = await pool.query(
            "SELECT * FROM student_groups WHERE id = ?",
            [id]
        );

        if (groups.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student group not found"
            });
        }

        return successResponse(
            res,
            200,
            "Student group fetched successfully",
            groups[0]
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch student group"
        });
    }
};

const createStudentGroup = async (req, res) => {
    try {
        const { name, student_count } = req.body;

        const [result] = await pool.query(
            `INSERT INTO student_groups
             (name, student_count)
             VALUES (?, ?)`,
            [name, student_count]
        );

        return successResponse(
            res,
            201,
            "Student group created successfully",
            {
                studentGroupId: result.insertId
            }
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create student group"
        });
    }
};

const updateStudentGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, student_count } = req.body;

        const [result] = await pool.query(
            `UPDATE student_groups
             SET name = ?, student_count = ?
             WHERE id = ?`,
            [name, student_count, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Student group not found"
            });
        }

        return successResponse(
            res,
            200,
            "Student group updated successfully"
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update student group"
        });
    }
};

const deleteStudentGroup = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM student_groups WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Student group not found"
            });
        }

        return successResponse(
            res,
            200,
            "Student group deleted successfully"
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete student group"
        });
    }
};

module.exports = {
    getAllStudentGroups,
    getStudentGroupById,
    createStudentGroup,
    updateStudentGroup,
    deleteStudentGroup
};