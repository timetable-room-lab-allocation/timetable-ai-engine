const validateCourse = (req, res, next) => {
    const { code, name } = req.body;

    const errors = [];

    if (!code || typeof code !== "string" || !code.trim()) {
        errors.push("code is required");
    }

    if (!name || typeof name !== "string" || !name.trim()) {
        errors.push("name is required");
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

module.exports = validateCourse;