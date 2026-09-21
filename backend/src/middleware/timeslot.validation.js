const validateTimeslot = (req, res, next) => {
    const {
        day,
        start_time,
        end_time
    } = req.body;

    const errors = [];

    // Validate day
    if (!day || typeof day !== "string" || !day.trim()) {
        errors.push("day is required");
    }

    // Validate start_time
    if (!start_time) {
        errors.push("start_time is required");
    }

    // Validate end_time
    if (!end_time) {
        errors.push("end_time is required");
    }

    // Validate time format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;

    if (start_time && !timeRegex.test(start_time)) {
        errors.push("start_time must be a valid time");
    }

    if (end_time && !timeRegex.test(end_time)) {
        errors.push("end_time must be a valid time");
    }

    // Validate time order
    if (
        start_time &&
        end_time &&
        timeRegex.test(start_time) &&
        timeRegex.test(end_time)
    ) {
        const start = start_time.split(":").map(Number);
        const end = end_time.split(":").map(Number);

        const startMinutes = start[0] * 60 + start[1];
        const endMinutes = end[0] * 60 + end[1];

        if (endMinutes <= startMinutes) {
            errors.push("end_time must be after start_time");
        }
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

module.exports = validateTimeslot;