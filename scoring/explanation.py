from models.allocation import Allocation

from scoring.scoring import (
    score_capacity_fit,
    score_equipment_match,
    score_lecturer_preference
)


def explain_allocation(
    allocation: Allocation
):

    capacity_score = score_capacity_fit(
        allocation
    )

    equipment_score = score_equipment_match(
        allocation
    )

    lecturer_preference_score = (
        score_lecturer_preference(
            allocation
        )
    )

    explanation = {
        "room": allocation.room.name,
        "day": allocation.timeslot.day,
        "start": allocation.timeslot.start,
        "end": allocation.timeslot.end,

        "scores": {
            "capacity_fit": capacity_score,
            "equipment_match": equipment_score,
            "lecturer_preference": lecturer_preference_score
        },

        "reasons": []
    }

    if capacity_score >= 80:
        explanation["reasons"].append(
            "Good capacity fit."
        )
    else:
        explanation["reasons"].append(
            "Capacity fit is not optimal."
        )

    if equipment_score == 100:
        explanation["reasons"].append(
            "All required equipment is available."
        )
    else:
        explanation["reasons"].append(
            "Some required equipment is missing."
        )

    if lecturer_preference_score == 100:
        explanation["reasons"].append(
            "The time slot matches the lecturer's preference."
        )
    else:
        explanation["reasons"].append(
            "The time slot does not match the lecturer's preference."
        )

    return explanation
