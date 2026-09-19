from models.allocation import Allocation
from scoring.scoring import calculate_total_score


def rank_allocations(
    allocations: list[Allocation]
):

    scored_allocations = []

    for allocation in allocations:

        score = calculate_total_score(
            allocation
        )

        scored_allocations.append({
            "allocation": allocation,
            "score": score
        })

    scored_allocations.sort(
        key=lambda item: item["score"],
        reverse=True
    )

    return scored_allocations
