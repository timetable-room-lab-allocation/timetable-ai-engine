from engine.allocation_engine import (
    rank_feasible_allocations
)

from scoring.explanation import (
    explain_allocation
)


def generate_recommendations(
    section,
    lecturer,
    rooms,
    timeslots,
    existing_allocations
):

    ranked_allocations = rank_feasible_allocations(
        section=section,
        lecturer=lecturer,
        rooms=rooms,
        timeslots=timeslots,
        existing_allocations=existing_allocations
    )

    recommendations = []

    for item in ranked_allocations:

        allocation = item["allocation"]

        explanation = explain_allocation(
            allocation
        )

        recommendations.append({
            "room_id": allocation.room.id,
            "room": allocation.room.name,

            "day": allocation.timeslot.day,

            "start": allocation.timeslot.start,

            "end": allocation.timeslot.end,

            "score": item["score"],

            "reasons": explanation["reasons"]
        })

    return {
        "section": section.name,
        "recommendations": recommendations
    }
