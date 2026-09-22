from models.allocation import Allocation


def check_student_group_conflict(
    allocation: Allocation,
    existing_allocations: list[Allocation]
):
    for existing in existing_allocations:

        same_group = (
            allocation.section.student_group
            == existing.section.student_group
        )

        same_timeslot = (
            allocation.timeslot.day
            == existing.timeslot.day
            and allocation.timeslot.start
            == existing.timeslot.start
            and allocation.timeslot.end
            == existing.timeslot.end
        )

        if same_group and same_timeslot:
            return {
                "feasible": False,
                "constraint": "student_group_conflict",
                "message": (
                    f"Student group "
                    f"{allocation.section.student_group} "
                    f"is already assigned to "
                    f"{existing.section.name} at "
                    f"{existing.timeslot.day} "
                    f"{existing.timeslot.start}-"
                    f"{existing.timeslot.end}."
                )
            }

    return {
        "feasible": True,
        "constraint": "student_group_conflict",
        "message": "No student group conflict detected."
    }