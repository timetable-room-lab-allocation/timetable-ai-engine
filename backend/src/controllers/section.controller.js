const pool = require("../config/db");
const { successResponse } = require("../utils/apiResponse");

const getAllSections = async (req, res) => {
    try {
        const [sections] = await pool.query(
            `SELECT
                s.id,
                s.name,
                s.students,
                s.duration,
                s.room_type_required,
                s.course_id,
                c.code AS course_code,
                c.name AS course_name,
                s.student_group_id,
                sg.name AS student_group_name,
                s.lecturer_id,
                l.name AS lecturer_name
             FROM sections s
             JOIN courses c
                ON s.course_id = c.id
             JOIN student_groups sg
                ON s.student_group_id = sg.id
             LEFT JOIN lecturers l
                ON s.lecturer_id = l.id`
        );

        return successResponse(
            res,
            200,
            "Sections fetched successfully",
            sections
        );
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch sections"
        });
    }
};

const getSectionById = async (req, res) => {
    try {
        const { id } = req.params;

        const [sections] = await pool.query(
            `SELECT
                s.id,
                s.name,
                s.students,
                s.duration,
                s.room_type_required,
                s.course_id,
                c.code AS course_code,
                c.name AS course_name,
                s.student_group_id,
                sg.name AS student_group_name,
                s.lecturer_id,
                l.name AS lecturer_name
             FROM sections s
             JOIN courses c
                ON s.course_id = c.id
             JOIN student_groups sg
                ON s.student_group_id = sg.id
             LEFT JOIN lecturers l
                ON s.lecturer_id = l.id
             WHERE s.id = ?`,
            [id]
        );

        if (sections.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        return successResponse(
            res,
            200,
            "Section fetched successfully",
            sections[0]
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch section"
        });
    }
};

const createSection = async (req, res) => {
    try {
        const {
            course_id,
            student_group_id,
            lecturer_id,
            name,
            students,
            duration,
            room_type_required
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO sections
            (
                course_id,
                student_group_id,
                lecturer_id,
                name,
                students,
                duration,
                room_type_required
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                course_id,
                student_group_id,
                lecturer_id || null,
                name,
                students,
                duration,
                room_type_required
            ]
        );

        return successResponse(
            res,
            201,
            "Section created successfully",
            {
                sectionId: result.insertId
            }
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create section"
        });
    }
};

const updateSection = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            course_id,
            student_group_id,
            lecturer_id,
            name,
            students,
            duration,
            room_type_required
        } = req.body;

        const [result] = await pool.query(
            `UPDATE sections
             SET course_id = ?,
                 student_group_id = ?,
                 lecturer_id = ?,
                 name = ?,
                 students = ?,
                 duration = ?,
                 room_type_required = ?
             WHERE id = ?`,
            [
                course_id,
                student_group_id,
                lecturer_id || null,
                name,
                students,
                duration,
                room_type_required,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        return successResponse(
            res,
            200,
            "Section updated successfully"
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update section"
        });
    }
};

const deleteSection = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM sections WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        return successResponse(
            res,
            200,
            "Section deleted successfully"
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete section"
        });
    }
};

module.exports = {
    getAllSections,
    getSectionById,
    createSection,
    updateSection,
    deleteSection
};