const validateRoom = (req, res, next) => {
    const { name, room_type, capacity } = req.body;

    if (!name || !room_type || capacity === undefined) {
        return res.status(400).json({
            success: false,
            message: "name, room_type and capacity are required"
        });
    }

    if (typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "name must be a valid string"
        });
    }

    if (typeof room_type !== "string" || room_type.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "room_type must be a valid string"
        });
    }

    if (!Number.isInteger(Number(capacity)) || Number(capacity) <= 0) {
        return res.status(400).json({
            success: false,
            message: "capacity must be a positive integer"
        });
    }

    next();
};

module.exports = validateRoom;