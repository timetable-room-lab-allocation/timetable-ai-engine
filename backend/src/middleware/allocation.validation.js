const validateAllocation = (req, res, next) => {
    const {
        section_id,
        lecturer_id,
        room_id,
        timeslot_id,
        score,
        status
    } = req.body;

    const errors = [];

    const requiredIds = [
        ["section_id", section_id],
        ["lecturer_id", lecturer_id],
        ["room_id", room_id],
        ["timeslot_id", timeslot_id]
    ];

    requiredIds.forEach(([field, value]) => {
        if (value === undefined || value === null) {
            errors.push(`${field} is required`);
        } else if (
            !Number.isInteger(Number(value)) ||
            Number(value) <= 0
        ) {
            errors.push(`${field} must be a positive integer`);
        }
    });

    if (score !== undefined && score !== null) {
        if (
            isNaN(Number(score)) ||
            Number(score) < 0 ||
            Number(score) > 100
        ) {
            errors.push("score must be a number between 0 and 100");
        }
    }

    const allowedStatuses = [
        "Draft",
        "Approved",
        "Rejected"
    ];

    if (
        status !== undefined &&
        status !== null &&
        !allowedStatuses.includes(status)
    ) {
        errors.push(
            "status must be Draft, Approved, or Rejected"
        );
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

module.exports = validateAllocation;