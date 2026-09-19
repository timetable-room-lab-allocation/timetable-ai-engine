from models.allocation import Allocation

from engine.constraint_engine import (
    validate_allocation_with_context
)

from scoring.ranking import rank_allocations


def generate_feasible_allocations(
    section,
    lecturer,
    rooms,
    timeslots,
    existing_allocations
):

    feasible_allocations = []

    for room in rooms:

        for timeslot in timeslots:

            allocation = Allocation(
                section=section,
                lecturer=lecturer,
                room=room,
                timeslot=timeslot
            )

            result = validate_allocation_with_context(
                allocation,
                existing_allocations
            )

            if result["feasible"]:
                feasible_allocations.append(
                    allocation
                )

    return feasible_allocations


def rank_feasible_allocations(
    section,
    lecturer,
    rooms,
    timeslots,
    existing_allocations
):

    feasible_allocations = (
        generate_feasible_allocations(
            section,
            lecturer,
            rooms,
            timeslots,
            existing_allocations
        )
    )

    ranked_allocations = rank_allocations(
        feasible_allocations
    )

    return ranked_allocations
