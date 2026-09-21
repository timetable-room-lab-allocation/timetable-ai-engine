const pool = require("../config/db");
const { successResponse } = require("../utils/apiResponse");

const getAllCourses = async (req, res) => {
    try {
        const [courses] = await pool.query(
            "SELECT * FROM courses"
        );

        return successResponse(
            res,
            200,
            "Courses fetched successfully",
            courses
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses"
        });
    }
};

const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;

        const [courses] = await pool.query(
            "SELECT * FROM courses WHERE id = ?",
            [id]
        );

        if (courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        return successResponse(
            res,
            200,
            "Course fetched successfully",
            courses[0]
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch course"
        });
    }
};

const createCourse = async (req, res) => {
    try {
        const { code, name } = req.body;

        const [result] = await pool.query(
            `INSERT INTO courses (code, name)
             VALUES (?, ?)`,
            [code, name]
        );

        return successResponse(
            res,
            201,
            "Course created successfully",
            {
                courseId: result.insertId
            }
        );

    } catch (error) {
        console.error(error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Course code already exists"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create course"
        });
    }
};

const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, name } = req.body;

        const [result] = await pool.query(
            `UPDATE courses
             SET code = ?, name = ?
             WHERE id = ?`,
            [code, name, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        return successResponse(
            res,
            200,
            "Course updated successfully"
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update course"
        });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM courses WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        return successResponse(
            res,
            200,
            "Course deleted successfully"
        );

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete course"
        });
    }
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};