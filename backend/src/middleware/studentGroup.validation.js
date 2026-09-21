const validateStudentGroup = (req, res, next) => {
    const {
        name,
        student_count
    } = req.body;

    const errors = [];

    if (!name || typeof name !== "string" || !name.trim()) {
        errors.push("name is required");
    }

    if (
        student_count === undefined ||
        student_count === null
    ) {
        errors.push("student_count is required");
    } else if (
        !Number.isInteger(Number(student_count)) ||
        Number(student_count) <= 0
    ) {
        errors.push("student_count must be a positive integer");
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

module.exports = validateStudentGroup;
