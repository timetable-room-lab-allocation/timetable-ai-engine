from models.allocation import Allocation


def check_duration(allocation: Allocation):

    start_hour = int(allocation.timeslot.start[:2])
    end_hour = int(allocation.timeslot.end[:2])

    slot_duration = end_hour - start_hour
    required_duration = allocation.section.duration

    if required_duration > slot_duration:
        return {
            "feasible": False,
            "constraint": "duration",
            "message": (
                f"Section requires {required_duration} hours, "
                f"but the time slot provides {slot_duration} hours."
            )
        }

    return {
        "feasible": True,
        "constraint": "duration",
        "message": "Time slot duration is sufficient."
    }
