from models.allocation import Allocation


def check_room_conflict(
    allocation: Allocation,
    existing_allocations: list[Allocation]
):
    for existing in existing_allocations:

        same_room = (
            allocation.room.id
            == existing.room.id
        )

        same_timeslot = (
            allocation.timeslot.day
            == existing.timeslot.day
            and allocation.timeslot.start
            == existing.timeslot.start
            and allocation.timeslot.end
            == existing.timeslot.end
        )

        if same_room and same_timeslot:
            return {
                "feasible": False,
                "constraint": "room_conflict",
                "message": (
                    f"{allocation.room.name} is already assigned "
                    f"to {existing.section.name} at "
                    f"{existing.timeslot.day} "
                    f"{existing.timeslot.start}-"
                    f"{existing.timeslot.end}."
                )
            }

    return {
        "feasible": True,
        "constraint": "room_conflict",
        "message": "No room conflict detected."
    }