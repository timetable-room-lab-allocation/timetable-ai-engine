from models.allocation import Allocation


def check_room_availability(allocation: Allocation):

    if not allocation.room.available:
        return {
            "feasible": False,
            "constraint": "room_availability",
            "message": (
                f"{allocation.room.name} is currently unavailable."
            )
        }

    return {
        "feasible": True,
        "constraint": "room_availability",
        "message": "Room is available."
    }
