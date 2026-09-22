from models.allocation import Allocation


def check_lecturer_conflict(
    allocation: Allocation,
    existing_allocations: list[Allocation]
):
    for existing in existing_allocations:

        same_lecturer = (
            allocation.lecturer.id
            == existing.lecturer.id
        )

        same_timeslot = (
            allocation.timeslot.day
            == existing.timeslot.day
            and allocation.timeslot.start
            == existing.timeslot.start
            and allocation.timeslot.end
            == existing.timeslot.end
        )

        if same_lecturer and same_timeslot:
            return {
                "feasible": False,
                "constraint": "lecturer_conflict",
                "message": (
                    f"{allocation.lecturer.name} is already assigned "
                    f"to {existing.section.name} at "
                    f"{existing.timeslot.day} "
                    f"{existing.timeslot.start}-"
                    f"{existing.timeslot.end}."
                )
            }

    return {
        "feasible": True,
        "constraint": "lecturer_conflict",
        "message": "No lecturer conflict detected."
    }