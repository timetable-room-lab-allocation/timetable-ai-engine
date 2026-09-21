const validateEquipment = (req, res, next) => {
    const { name } = req.body;

    const errors = [];

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

module.exports = validateEquipment;