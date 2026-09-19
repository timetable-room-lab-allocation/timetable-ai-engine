from constraints.capacity import check_capacity
from constraints.room_type import check_room_type
from constraints.equipment import check_equipment
from constraints.lecturer_availability import check_lecturer_availability
from constraints.lecturer_conflict import check_lecturer_conflict
from constraints.student_group_conflict import check_student_group_conflict
from constraints.room_conflict import check_room_conflict
from constraints.room_availability import check_room_availability
from constraints.duration import check_duration


# ==========================================
# Validate One Allocation
# ==========================================

def validate_allocation(allocation):

    results = [
        check_capacity(allocation),
        check_room_type(allocation),
        check_equipment(allocation),
        check_lecturer_availability(allocation),
        check_room_availability(allocation),
        check_duration(allocation)
    ]

    violations = [
        result for result in results
        if not result["feasible"]
    ]

    return {
        "feasible": len(violations) == 0,
        "violations": violations
    }


# ==========================================
# Validate Allocation With Context
# ==========================================

def validate_allocation_with_context(
    allocation,
    existing_allocations
):

    results = [
        check_capacity(allocation),
        check_room_type(allocation),
        check_equipment(allocation),
        check_lecturer_availability(allocation),
        check_room_availability(allocation),
        check_duration(allocation),

        check_lecturer_conflict(
            allocation,
            existing_allocations
        ),

        check_student_group_conflict(
            allocation,
            existing_allocations
        ),

        check_room_conflict(
            allocation,
            existing_allocations
        )
    ]

    violations = [
        result for result in results
        if not result["feasible"]
    ]

    return {
        "feasible": len(violations) == 0,
        "violations": violations
    }
