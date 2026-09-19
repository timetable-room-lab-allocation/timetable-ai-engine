from models.allocation import Allocation


# ==========================================
# Capacity Fit Score
# ==========================================

def score_capacity_fit(allocation: Allocation):

    students = allocation.section.students
    capacity = allocation.room.capacity

    if students > capacity:
        return 0

    utilization = students / capacity

    score = utilization * 100

    return round(score, 2)


# ==========================================
# Equipment Match Score
# ==========================================

def score_equipment_match(allocation: Allocation):

    required_equipment = set(
        allocation.section.equipment_required
    )

    available_equipment = set(
        allocation.room.equipment
    )

    if not required_equipment:
        return 100

    matched_equipment = (
        required_equipment
        & available_equipment
    )

    score = (
        len(matched_equipment)
        / len(required_equipment)
    ) * 100

    return round(score, 2)


# ==========================================
# Lecturer Preference Score
# ==========================================

def score_lecturer_preference(allocation: Allocation):

    slot = allocation.timeslot

    slot_key = (
        f"{slot.day}_"
        f"{slot.start[:2]}_"
        f"{slot.end[:2]}"
    )

    if slot_key in allocation.lecturer.preferred_slots:
        return 100

    return 0


# ==========================================
# Compactness Score
# ==========================================

def score_compactness(
    allocation: Allocation,
    allocations: list[Allocation]
):
    """
    Measures how compact the schedule is for
    the same student group.

    Consecutive classes receive a high score.
    Large gaps between classes reduce the score.
    """

    group_id = allocation.section.id

    group_allocations = [
        a
        for a in allocations
        if a.section.id == group_id
        and a.timeslot.day == allocation.timeslot.day
    ]

    if len(group_allocations) <= 1:
        return 100

    current_start = int(
        allocation.timeslot.start[:2]
    )

    current_end = int(
        allocation.timeslot.end[:2]
    )

    gaps = []

    for other in group_allocations:

        if other is allocation:
            continue

        other_start = int(
            other.timeslot.start[:2]
        )

        other_end = int(
            other.timeslot.end[:2]
        )

        # Other class before current class
        if other_end <= current_start:

            gap = current_start - other_end
            gaps.append(gap)

        # Other class after current class
        elif other_start >= current_end:

            gap = other_start - current_end
            gaps.append(gap)

    if not gaps:
        return 100

    minimum_gap = min(gaps)

    # Consecutive classes
    if minimum_gap == 0:
        return 100

    # One-hour gap
    if minimum_gap == 1:
        return 80

    # Two-hour gap
    if minimum_gap == 2:
        return 60

    # Three-hour gap
    if minimum_gap == 3:
        return 40

    # Four hours or more
    return 20


# ==========================================
# Room Utilization Score
# ==========================================

def score_room_utilization(allocation: Allocation):

    students = allocation.section.students
    capacity = allocation.room.capacity

    if capacity <= 0:
        return 0

    if students > capacity:
        return 0

    utilization = students / capacity

    # Ideal utilization is around 80%-100%.
    if utilization >= 0.80:
        return 100

    if utilization >= 0.60:
        return 80

    if utilization >= 0.40:
        return 60

    if utilization >= 0.20:
        return 40

    return 20


# ==========================================
# Total Score
# ==========================================

def calculate_total_score(
    allocation: Allocation,
    allocations: list[Allocation] | None = None
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

    # Keep backward compatibility.
    if allocations is None:
        allocations = [allocation]

    compactness_score = score_compactness(
        allocation,
        allocations
    )

    room_utilization_score = (
        score_room_utilization(
            allocation
        )
    )

    total_score = (
        capacity_score * 0.25
        + equipment_score * 0.15
        + lecturer_preference_score * 0.25
        + compactness_score * 0.20
        + room_utilization_score * 0.15
    )

    return round(total_score, 2)