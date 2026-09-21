from models.allocation import Allocation
from models.section import Section
from models.lecturer import Lecturer
from models.room import Room
from models.timeslot import TimeSlot

from engine.constraint_engine import (
    validate_allocation,
    validate_allocation_with_context
)


# =========================================================
# Test Data Helpers
# =========================================================

def create_section(
    section_id=1,
    name="AI Section",
    students=30,
    student_group="G1",
    duration=2,
    room_type_required="lecture",
    equipment_required=None,
    lecturer_id=1
):
    return Section(
        id=section_id,
        name=name,
        students=students,
        student_group=student_group,
        duration=duration,
        room_type_required=room_type_required,
        equipment_required=equipment_required or [],
        lecturer_id=lecturer_id
    )


def create_lecturer(
    lecturer_id=1,
    name="Dr. Ahmed"
):
    return Lecturer(
        id=lecturer_id,
        name=name,
        available_slots=["Sunday_09_11"],
        preferred_slots=[]
    )


def create_room(
    room_id=1,
    name="Room 1",
    capacity=40,
    room_type="lecture",
    equipment=None,
    available=True
):
    return Room(
        id=room_id,
        name=name,
        room_type=room_type,
        capacity=capacity,
        equipment=equipment or [],
        available=available
    )


def create_timeslot():
    return TimeSlot(
        id=1,
        day="Sunday",
        start="09:00",
        end="11:00"
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


# =========================================================
# validate_allocation Tests
# =========================================================

def test_validate_allocation_valid():
    allocation = create_allocation()

    result = validate_allocation(allocation)

    assert result["feasible"] is True
    assert result["violations"] == []


def test_validate_allocation_detects_violation():
    allocation = create_allocation(
        section=create_section(students=60),
        room=create_room(capacity=40)
    )

    result = validate_allocation(allocation)

    assert result["feasible"] is False
    assert len(result["violations"]) > 0

    constraints = [
        violation["constraint"]
        for violation in result["violations"]
    ]

    assert "capacity" in constraints


# =========================================================
# validate_allocation_with_context Tests
# =========================================================

def test_validate_allocation_with_context_detects_room_conflict():
    timeslot = create_timeslot()

    existing_allocation = create_allocation(
        section=create_section(
            section_id=1,
            name="AI Section"
        ),
        room=create_room(room_id=1),
        timeslot=timeslot
    )

    new_allocation = create_allocation(
        section=create_section(
            section_id=2,
            name="Web Section",
            lecturer_id=2
        ),
        lecturer=create_lecturer(lecturer_id=2),
        room=create_room(room_id=1),
        timeslot=timeslot
    )

    result = validate_allocation_with_context(
        new_allocation,
        [existing_allocation]
    )

    assert result["feasible"] is False

    constraints = [
        violation["constraint"]
        for violation in result["violations"]
    ]

    assert "room_conflict" in constraints


def test_validate_allocation_with_context_detects_student_group_conflict():
    timeslot = create_timeslot()

    existing_allocation = create_allocation(
        section=create_section(
            section_id=1,
            name="AI Section",
            student_group="G1"
        )
    )

    new_allocation = create_allocation(
        section=create_section(
            section_id=2,
            name="Web Section",
            student_group="G1",
            lecturer_id=2
        ),
        lecturer=create_lecturer(lecturer_id=2),
        room=create_room(room_id=2),
        timeslot=timeslot
    )

    result = validate_allocation_with_context(
        new_allocation,
        [existing_allocation]
    )

    assert result["feasible"] is False

    constraints = [
        violation["constraint"]
        for violation in result["violations"]
    ]

    assert "student_group_conflict" in constraints
