from models.allocation import Allocation


def check_room_type(allocation: Allocation):
    required_type = allocation.section.room_type_required
    actual_type = allocation.room.room_type

    if required_type != actual_type:
        return {
            "feasible": False,
            "constraint": "room_type",
            "message": (
                f"Section requires a {required_type}, "
                f"but {allocation.room.name} is a {actual_type}."
            )
        }

    return {
        "feasible": True,
        "constraint": "room_type",
        "message": "Room type matches the section requirement."
    }