from models.allocation import Allocation


def check_lecturer_availability(allocation: Allocation):

    slot = allocation.timeslot

    slot_key = f"{slot.day}_{slot.start[:2]}_{slot.end[:2]}"

    if slot_key not in allocation.lecturer.available_slots:
        return {
            "feasible": False,
            "constraint": "lecturer_availability",
            "message": (
                f"{allocation.lecturer.name} is not available "
                f"at {slot.day} {slot.start}-{slot.end}."
            )
        }

    return {
        "feasible": True,
        "constraint": "lecturer_availability",
        "message": "Lecturer is available at this time."
    }