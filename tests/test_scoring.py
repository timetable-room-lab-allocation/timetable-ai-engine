import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from models.allocation import Allocation
from models.section import Section
from models.lecturer import Lecturer
from models.room import Room
from models.timeslot import TimeSlot

from scoring.scoring import (
    score_capacity_fit,
    score_equipment_match,
    score_lecturer_preference,
    score_compactness,
    score_room_utilization,
    calculate_total_score
)

from scoring.ranking import rank_allocations

from scoring.explanation import explain_allocation


# ==========================================
# Helpers
# ==========================================

def create_section(
    section_id=1,
    students=30,
    student_group="G1",
    equipment_required=None
):
    return Section(
        id=section_id,
        name=f"Section {section_id}",
        students=students,
        student_group=student_group,
        duration=2,
        room_type_required="lecture",
        equipment_required=equipment_required or [],
        lecturer_id=1
    )


def create_lecturer(
    lecturer_id=1,
    preferred_slots=None
):
    return Lecturer(
        id=lecturer_id,
        name=f"Lecturer {lecturer_id}",
        available_slots=["Sunday_09_11"],
        preferred_slots=preferred_slots or []
    )


def create_room(
    room_id=1,
    capacity=40,
    equipment=None
):
    return Room(
        id=room_id,
        name=f"Room {room_id}",
        room_type="lecture",
        capacity=capacity,
        equipment=equipment or [],
        available=True
    )


def create_timeslot(
    timeslot_id=1,
    start="09:00",
    end="11:00"
):
    return TimeSlot(
        id=timeslot_id,
        day="Sunday",
        start=start,
        end=end
    )


def create_allocation(
    section=None,
    lecturer=None,
    room=None,
    timeslot=None
):
    return Allocation(
        section=section or create_section(),
        lecturer=lecturer or create_lecturer(),
        room=room or create_room(),
        timeslot=timeslot or create_timeslot()
    )


# ==========================================
# Capacity Fit Tests
# ==========================================

def test_capacity_fit_full_room():
    allocation = create_allocation(
        section=create_section(students=40),
        room=create_room(capacity=40)
    )

    assert score_capacity_fit(allocation) == 100


def test_capacity_fit_partial_room():
    allocation = create_allocation(
        section=create_section(students=20),
        room=create_room(capacity=40)
    )

    assert score_capacity_fit(allocation) == 50


def test_capacity_fit_exceeds_capacity():
    allocation = create_allocation(
        section=create_section(students=50),
        room=create_room(capacity=40)
    )

    assert score_capacity_fit(allocation) == 0


# ==========================================
# Equipment Tests
# ==========================================

def test_equipment_match_all_available():
    allocation = create_allocation(
        section=create_section(
            equipment_required=["projector", "computer"]
        ),
        room=create_room(
            equipment=["projector", "computer"]
        )
    )

    assert score_equipment_match(allocation) == 100


def test_equipment_match_partial():
    allocation = create_allocation(
        section=create_section(
            equipment_required=["projector", "computer"]
        ),
        room=create_room(
            equipment=["projector"]
        )
    )

    assert score_equipment_match(allocation) == 50


def test_equipment_match_none_required():
    allocation = create_allocation(
        section=create_section(
            equipment_required=[]
        ),
        room=create_room()
    )

    assert score_equipment_match(allocation) == 100


# ==========================================
# Lecturer Preference Tests
# ==========================================

def test_lecturer_preference_matches():
    allocation = create_allocation(
        lecturer=create_lecturer(
            preferred_slots=["Sunday_09_11"]
        )
    )

    assert score_lecturer_preference(allocation) == 100


def test_lecturer_preference_does_not_match():
    allocation = create_allocation(
        lecturer=create_lecturer(
            preferred_slots=["Monday_09_11"]
        )
    )

    assert score_lecturer_preference(allocation) == 0


# ==========================================
# Compactness Tests
# ==========================================

def test_compactness_consecutive_classes():
    current = create_allocation(
        section=create_section(
            section_id=2,
            student_group="G1"
        ),
        timeslot=create_timeslot(
            timeslot_id=2,
            start="11:00",
            end="13:00"
        )
    )

    previous = create_allocation(
        section=create_section(
            section_id=1,
            student_group="G1"
        ),
        timeslot=create_timeslot(
            timeslot_id=1,
            start="09:00",
            end="11:00"
        )
    )

    assert score_compactness(
        current,
        [previous, current]
    ) == 100


def test_compactness_one_hour_gap():
    current = create_allocation(
        section=create_section(
            section_id=2,
            student_group="G1"
        ),
        timeslot=create_timeslot(
            start="12:00",
            end="14:00"
        )
    )

    previous = create_allocation(
        section=create_section(
            section_id=1,
            student_group="G1"
        ),
        timeslot=create_timeslot(
            start="09:00",
            end="11:00"
        )
    )

    assert score_compactness(
        current,
        [previous, current]
    ) == 80


def test_compactness_two_hour_gap():
    current = create_allocation(
        section=create_section(
            section_id=2,
            student_group="G1"
        ),
        timeslot=create_timeslot(
            start="13:00",
            end="15:00"
        )
    )

    previous = create_allocation(
        section=create_section(
            section_id=1,
            student_group="G1"
        ),
        timeslot=create_timeslot(
            start="09:00",
            end="11:00"
        )
    )

    assert score_compactness(
        current,
        [previous, current]
    ) == 60


def test_compactness_large_gap():
    current = create_allocation(
        section=create_section(
            section_id=2,
            student_group="G1"
        ),
        timeslot=create_timeslot(
            start="15:00",
            end="17:00"
        )
    )

    previous = create_allocation(
        section=create_section(
            section_id=1,
            student_group="G1"
        ),
        timeslot=create_timeslot(
            start="09:00",
            end="11:00"
        )
    )

    assert score_compactness(
        current,
        [previous, current]
    ) == 20


# ==========================================
# Room Utilization Tests
# ==========================================

def test_room_utilization_80_percent():
    allocation = create_allocation(
        section=create_section(students=32),
        room=create_room(capacity=40)
    )

    assert score_room_utilization(allocation) == 100


def test_room_utilization_60_percent():
    allocation = create_allocation(
        section=create_section(students=24),
        room=create_room(capacity=40)
    )

    assert score_room_utilization(allocation) == 80


def test_room_utilization_40_percent():
    allocation = create_allocation(
        section=create_section(students=16),
        room=create_room(capacity=40)
    )

    assert score_room_utilization(allocation) == 60


def test_room_utilization_20_percent():
    allocation = create_allocation(
        section=create_section(students=8),
        room=create_room(capacity=40)
    )

    assert score_room_utilization(allocation) == 40


def test_room_utilization_exceeds_capacity():
    allocation = create_allocation(
        section=create_section(students=50),
        room=create_room(capacity=40)
    )

    assert score_room_utilization(allocation) == 0


# ==========================================
# Total Score Tests
# ==========================================

def test_total_score_returns_valid_score():
    allocation = create_allocation(
        lecturer=create_lecturer(
            preferred_slots=["Sunday_09_11"]
        )
    )

    score = calculate_total_score(
        allocation,
        [allocation]
    )

    assert 0 <= score <= 100


# ==========================================
# Ranking Tests
# ==========================================

def test_rank_allocations_highest_score_first():

    allocation_1 = create_allocation(
        section=create_section(
            section_id=1,
            students=32
        ),
        room=create_room(
            room_id=1,
            capacity=40
        ),
        lecturer=create_lecturer(
            preferred_slots=["Sunday_09_11"]
        )
    )

    allocation_2 = create_allocation(
        section=create_section(
            section_id=2,
            students=10
        ),
        room=create_room(
            room_id=2,
            capacity=40
        ),
        lecturer=create_lecturer(
            preferred_slots=["Monday_09_11"]
        )
    )

    results = rank_allocations([
        allocation_2,
        allocation_1
    ])

    assert results[0]["score"] >= results[1]["score"]


# ==========================================
# Explanation Tests
# ==========================================

def test_explanation_contains_basic_information():

    allocation = create_allocation(
        lecturer=create_lecturer(
            preferred_slots=["Sunday_09_11"]
        )
    )

    result = explain_allocation(allocation)

    assert result["room"] == allocation.room.name
    assert result["day"] == "Sunday"
    assert result["start"] == "09:00"
    assert result["end"] == "11:00"

    assert "scores" in result
    assert "reasons" in result

    assert len(result["reasons"]) == 3