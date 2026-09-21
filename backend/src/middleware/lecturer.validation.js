const validateLecturer = (req, res, next) => {
    const { user_id, name } = req.body;

    const errors = [];

    // name is required
    if (!name || typeof name !== "string" || !name.trim()) {
        errors.push("name is required");
    }

    // user_id is optional
    if (
        user_id !== undefined &&
        user_id !== null &&
        (!Number.isInteger(Number(user_id)) || Number(user_id) <= 0)
    ) {
        errors.push("user_id must be a positive integer");
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

module.exports = validateLecturer;