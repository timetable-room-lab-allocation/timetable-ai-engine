from models.allocation import Allocation


def check_capacity(allocation: Allocation):
    section_students = allocation.section.students
    room_capacity = allocation.room.capacity

    if section_students > room_capacity:
        return {
            "feasible": False,
            "constraint": "capacity",
            "message": (
                f"Room capacity is {room_capacity}, "
                f"but the section has {section_students} students."
            )
        }

    return {
        "feasible": True,
        "constraint": "capacity",
        "message": "Room capacity is sufficient."
    }