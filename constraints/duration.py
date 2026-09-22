from models.allocation import Allocation


def check_duration(allocation: Allocation):

    start_hour = int(allocation.timeslot.start[:2])
    start_minute = int(allocation.timeslot.start[3:5])

    end_hour = int(allocation.timeslot.end[:2])
    end_minute = int(allocation.timeslot.end[3:5])

    start_total_minutes = start_hour * 60 + start_minute
    end_total_minutes = end_hour * 60 + end_minute

    slot_duration = end_total_minutes - start_total_minutes
    required_duration = allocation.section.duration

    if required_duration > slot_duration:
        return {
            "feasible": False,
            "constraint": "duration",
            "message": (
                f"Section requires {required_duration} minutes, "
                f"but the time slot provides {slot_duration} minutes."
            )
        }

    return {
        "feasible": True,
        "constraint": "duration",
        "message": "Time slot duration is sufficient."
    }