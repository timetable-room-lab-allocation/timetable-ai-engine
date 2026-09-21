const validateSection = (req, res, next) => {
    const {
        course_id,
        student_group_id,
        lecturer_id,
        name,
        students,
        duration,
        room_type_required
    } = req.body;

    const errors = [];

    // Required fields
    if (!course_id) {
        errors.push("course_id is required");
    }

    if (!student_group_id) {
        errors.push("student_group_id is required");
    }

    if (!name || typeof name !== "string" || !name.trim()) {
        errors.push("name is required");
    }

    if (students === undefined || students === null) {
        errors.push("students is required");
    } else if (!Number.isInteger(Number(students)) || Number(students) <= 0) {
        errors.push("students must be a positive integer");
    }

    if (duration === undefined || duration === null) {
        errors.push("duration is required");
    } else if (!Number.isInteger(Number(duration)) || Number(duration) <= 0) {
        errors.push("duration must be a positive integer");
    }

    if (!room_type_required || typeof room_type_required !== "string") {
        errors.push("room_type_required is required");
    }

    // Optional lecturer_id
    if (
        lecturer_id !== undefined &&
        lecturer_id !== null &&
        (!Number.isInteger(Number(lecturer_id)) || Number(lecturer_id) <= 0)
    ) {
        errors.push("lecturer_id must be a positive integer");
    }

    if (errors.length > 0) {
    return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
    });
}

    next();
};

module.exports = validateSection;