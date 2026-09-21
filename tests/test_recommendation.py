import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from models.section import Section
from models.lecturer import Lecturer
from models.room import Room
from models.timeslot import TimeSlot
from models.allocation import Allocation

from engine.allocation_engine import (
    generate_feasible_allocations,
    rank_feasible_allocations
)

from engine.recommendation_engine import (
    generate_recommendations
)


# ==========================================
# Helpers
# ==========================================

def create_section(
    section_id=1,
    students=30,
    student_group="G1",
    equipment_required=None,
    room_type_required="lecture"
):
    return Section(
        id=section_id,
        name=f"Section {section_id}",
        students=students,
        student_group=student_group,
        duration=2,
        room_type_required=room_type_required,
        equipment_required=equipment_required or [],
        lecturer_id=1
    )


def create_lecturer(
    lecturer_id=1,
    preferred_slots=None,
    available_slots=None
):
    return Lecturer(
        id=lecturer_id,
        name=f"Lecturer {lecturer_id}",
        available_slots=(
            available_slots
            or ["Sunday_09_11", "Sunday_11_13"]
        ),
        preferred_slots=(
            preferred_slots
            or ["Sunday_09_11"]
        )
    )


def create_room(
    room_id=1,
    capacity=40,
    room_type="lecture",
    equipment=None,
    available=True
):
    return Room(
        id=room_id,
        name=f"Room {room_id}",
        room_type=room_type,
        capacity=capacity,
        equipment=equipment or [],
        available=available
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


# ==========================================
# generate_feasible_allocations
# ==========================================

def test_generate_feasible_allocations_returns_valid_allocations():

    section = create_section(
        students=30
    )

    lecturer = create_lecturer()

    rooms = [
        create_room(
            room_id=1,
            capacity=40
        ),
        create_room(
            room_id=2,
            capacity=50
        )
    ]

    timeslots = [
        create_timeslot(
            timeslot_id=1,
            start="09:00",
            end="11:00"
        )
    ]

    result = generate_feasible_allocations(
        section=section,
        lecturer=lecturer,
        rooms=rooms,
        timeslots=timeslots,
        existing_allocations=[]
    )

    assert len(result) == 2

    for allocation in result:
        assert allocation.section == section
        assert allocation.lecturer == lecturer
        assert allocation.room in rooms
        assert allocation.timeslot in timeslots


def test_generate_feasible_allocations_excludes_invalid_room():

    section = create_section(
        students=60
    )

    lecturer = create_lecturer()

    rooms = [
        create_room(
            room_id=1,
            capacity=40
        ),
        create_room(
            room_id=2,
            capacity=80
        )
    ]

    timeslots = [
        create_timeslot()
    ]

    result = generate_feasible_allocations(
        section=section,
        lecturer=lecturer,
        rooms=rooms,
        timeslots=timeslots,
        existing_allocations=[]
    )

    assert len(result) == 1
    assert result[0].room.id == 2


def test_generate_feasible_allocations_excludes_unavailable_room():

    section = create_section()

    lecturer = create_lecturer()

    rooms = [
        create_room(
            room_id=1,
            capacity=40,
            available=False
        ),
        create_room(
            room_id=2,
            capacity=40,
            available=True
        )
    ]

    timeslots = [
        create_timeslot()
    ]

    result = generate_feasible_allocations(
        section=section,
        lecturer=lecturer,
        rooms=rooms,
        timeslots=timeslots,
        existing_allocations=[]
    )

    assert len(result) == 1
    assert result[0].room.id == 2


def test_generate_feasible_allocations_excludes_wrong_room_type():

    section = create_section(
        room_type_required="lab"
    )

    lecturer = create_lecturer()

    rooms = [
        create_room(
            room_id=1,
            room_type="lecture"
        ),
        create_room(
            room_id=2,
            room_type="lab"
        )
    ]

    timeslots = [
        create_timeslot()
    ]

    result = generate_feasible_allocations(
        section=section,
        lecturer=lecturer,
        rooms=rooms,
        timeslots=timeslots,
        existing_allocations=[]
    )

    assert len(result) == 1
    assert result[0].room.id == 2


def test_generate_feasible_allocations_excludes_missing_equipment():

    section = create_section(
        equipment_required=["projector"]
    )

    lecturer = create_lecturer()

    rooms = [
        create_room(
            room_id=1,
            equipment=[]
        ),
        create_room(
            room_id=2,
            equipment=["projector"]
        )
    ]

    timeslots = [
        create_timeslot()
    ]

    result = generate_feasible_allocations(
        section=section,
        lecturer=lecturer,
        rooms=rooms,
        timeslots=timeslots,
        existing_allocations=[]
    )

    assert len(result) == 1
    assert result[0].room.id == 2


def test_generate_feasible_allocations_excludes_unavailable_lecturer_slot():

    section = create_section()

    lecturer = create_lecturer(
        available_slots=["Sunday_09_11"]
    )

    rooms = [
        create_room()
    ]

    timeslots = [
        create_timeslot(
            start="11:00",
            end="13:00"
        )
    ]

    result = generate_feasible_allocations(
        section=section,
        lecturer=lecturer,
        rooms=rooms,
        timeslots=timeslots,
        existing_allocations=[]
    )

    assert result == []


# ==========================================
# Conflict Tests
# ==========================================

def test_generate_feasible_allocations_excludes_room_conflict():

    section = create_section(
        section_id=2
    )

    lecturer = create_lecturer(
        lecturer_id=2
    )

    room = create_room(
        room_id=1
    )

    timeslot = create_timeslot()

    existing_allocation = Allocation(
        section=create_section(
            section_id=1
        ),
        lecturer=create_lecturer(
            lecturer_id=1
        ),
        room=room,
        timeslot=timeslot
    )

    result = generate_feasible_allocations(
        section=section,
        lecturer=lecturer,
        rooms=[room],
        timeslots=[timeslot],
        existing_allocations=[existing_allocation]
    )

    assert result == []


def test_generate_feasible_allocations_excludes_student_group_conflict():

    section = create_section(
        section_id=2,
        student_group="G1"
    )

    lecturer = create_lecturer(
        lecturer_id=2
    )

    room = create_room(
        room_id=2
    )

    timeslot = create_timeslot()

    existing_allocation = Allocation(
        section=create_section(
            section_id=1,
            student_group="G1"
        ),
        lecturer=create_lecturer(
            lecturer_id=1
        ),
        room=create_room(
            room_id=1
        ),
        timeslot=timeslot
    )

    result = generate_feasible_allocations(
        section=section,
        lecturer=lecturer,
        rooms=[room],
        timeslots=[timeslot],
        existing_allocations=[existing_allocation]
    )

    assert result == []


# ==========================================
# Ranking
# ==========================================

def test_rank_feasible_allocations_returns_ranked_results():

    section = create_section(
        students=30
    )

    lecturer = create_lecturer(
        preferred_slots=["Sunday_09_11"]
    )

    rooms = [
        create_room(
            room_id=1,
            capacity=40
        ),
        create_room(
            room_id=2,
            capacity=100
        )
    ]

    timeslots = [
        create_timeslot(
            timeslot_id=1,
            start="09:00",
            end="11:00"
        ),
        create_timeslot(
            timeslot_id=2,
            start="11:00",
            end="13:00"
        )
    ]

    result = rank_feasible_allocations(
        section=section,
        lecturer=lecturer,
        rooms=rooms,
        timeslots=timeslots,
        existing_allocations=[]
    )

    assert len(result) > 0

    scores = [
        item["score"]
        for item in result
    ]

    assert scores == sorted(
        scores,
        reverse=True
    )


# ==========================================
# Recommendation Engine
# ==========================================

def test_generate_recommendations_returns_expected_structure():

    section = create_section(
        students=30
    )

    lecturer = create_lecturer(
        preferred_slots=["Sunday_09_11"]
    )

    rooms = [
        create_room(
            room_id=1,
            capacity=40
        )
    ]

    timeslots = [
        create_timeslot(
            start="09:00",
            end="11:00"
        )
    ]

    result = generate_recommendations(
        section=section,
        lecturer=lecturer,
        rooms=rooms,
        timeslots=timeslots,
        existing_allocations=[]
    )

    assert result["section"] == section.name

    assert "recommendations" in result

    assert len(
        result["recommendations"]
    ) == 1


def test_generate_recommendations_contains_required_fields():

    section = create_section()

    lecturer = create_lecturer()

    rooms = [
        create_room()
    ]

    timeslots = [
        create_timeslot()
    ]

    result = generate_recommendations(
        section=section,
        lecturer=lecturer,
        rooms=rooms,
        timeslots=timeslots,
        existing_allocations=[]
    )

    recommendation = result["recommendations"][0]

    assert "room_id" in recommendation
    assert "room" in recommendation
    assert "day" in recommendation
    assert "start" in recommendation
    assert "end" in recommendation
    assert "score" in recommendation
    assert "reasons" in recommendation


def test_generate_recommendations_excludes_infeasible_options():

    section = create_section(
        students=60
    )

    lecturer = create_lecturer()

    rooms = [
        create_room(
            room_id=1,
            capacity=40
        ),
        create_room(
            room_id=2,
            capacity=80
        )
    ]

    timeslots = [
        create_timeslot()
    ]

    result = generate_recommendations(
        section=section,
        lecturer=lecturer,
        rooms=rooms,
        timeslots=timeslots,
        existing_allocations=[]
    )

    recommendations = result["recommendations"]

    assert len(recommendations) == 1

    assert recommendations[0]["room_id"] == 2


def test_generate_recommendations_returns_empty_when_no_feasible_option():

    section = create_section(
        students=100
    )

    lecturer = create_lecturer()

    rooms = [
        create_room(
            room_id=1,
            capacity=40
        ),
        create_room(
            room_id=2,
            capacity=50
        )
    ]

    timeslots = [
        create_timeslot()
    ]

    result = generate_recommendations(
        section=section,
        lecturer=lecturer,
        rooms=rooms,
        timeslots=timeslots,
        existing_allocations=[]
    )

    assert result["recommendations"] == []


def test_generate_recommendations_contains_reasons():

    section = create_section()

    lecturer = create_lecturer(
        preferred_slots=["Sunday_09_11"]
    )

    rooms = [
        create_room()
    ]

    timeslots = [
        create_timeslot()
    ]

    result = generate_recommendations(
        section=section,
        lecturer=lecturer,
        rooms=rooms,
        timeslots=timeslots,
        existing_allocations=[]
    )

    recommendation = result["recommendations"][0]

    assert isinstance(
        recommendation["reasons"],
        list
    )

    assert len(
        recommendation["reasons"]
    ) > 0