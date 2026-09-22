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
    rejected_allocations = []

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
                feasible_allocations.append(allocation)

            else:
                rejected_allocations.append({
                    "room": room.name,
                    "room_id": room.id,
                    "day": timeslot.day,
                    "start": timeslot.start,
                    "end": timeslot.end,
                    "violations": result["violations"]
                })

    print("\n========== AI DEBUG ==========")
    print("TOTAL FEASIBLE:", len(feasible_allocations))
    print("TOTAL REJECTED:", len(rejected_allocations))

    for item in rejected_allocations:
        print("\nREJECTED:")
        print(item)

    print("========== END DEBUG ==========\n")

    return feasible_allocations


def rank_feasible_allocations(
    section,
    lecturer,
    rooms,
    timeslots,
    existing_allocations
):
    feasible_allocations = generate_feasible_allocations(
        section,
        lecturer,
        rooms,
        timeslots,
        existing_allocations
    )

    ranked_allocations = rank_allocations(
        feasible_allocations
    )

    return ranked_allocations