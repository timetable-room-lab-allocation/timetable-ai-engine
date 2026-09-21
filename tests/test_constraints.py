import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from models.allocation import Allocation
from models.section import Section
from models.lecturer import Lecturer
from models.room import Room
from models.timeslot import TimeSlot
from constraints.room_type import check_room_type
from constraints.lecturer_availability import check_lecturer_availability
from constraints.room_availability import check_room_availability
from constraints.duration import check_duration
from constraints.student_group_conflict import check_student_group_conflict
from constraints.capacity import check_capacity
from constraints.equipment import check_equipment
from constraints.room_conflict import check_room_conflict
from constraints.lecturer_conflict import check_lecturer_conflict


# =========================================================
# Test Data
# =========================================================

def create_section(
    students=30,
    equipment_required=None,
    room_type_required="lecture"
):
    return Section(
        id=1,
        name="AI Section",
        students=students,
        student_group="G1",
        duration=2,
        room_type_required=room_type_required,
        equipment_required=equipment_required or [],
        lecturer_id=1
    )


def create_lecturer(lecturer_id=1):
    return Lecturer(
        id=lecturer_id,
        name=f"Lecturer {lecturer_id}",
        available_slots=["Sunday-09:00-11:00"],
        preferred_slots=[]
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
# Capacity Tests
# =========================================================

def test_capacity_is_sufficient():
    allocation = create_allocation(
        section=create_section(students=30),
        room=create_room(capacity=40)
    )

    result = check_capacity(allocation)

    assert result["feasible"] is True
    assert result["constraint"] == "capacity"


def test_capacity_is_not_sufficient():
    allocation = create_allocation(
        section=create_section(students=50),
        room=create_room(capacity=40)
    )

    result = check_capacity(allocation)

    assert result["feasible"] is False
    assert result["constraint"] == "capacity"
    assert "50" in result["message"]
    assert "40" in result["message"]


# =========================================================
# Equipment Tests
# =========================================================

def test_equipment_is_available():
    allocation = create_allocation(
        section=create_section(
            equipment_required=["projector", "computer"]
        ),
        room=create_room(
            equipment=["projector", "computer", "whiteboard"]
        )
    )

    result = check_equipment(allocation)

    assert result["feasible"] is True
    assert result["constraint"] == "equipment"


def test_equipment_is_missing():
    allocation = create_allocation(
        section=create_section(
            equipment_required=["projector", "computer"]
        ),
        room=create_room(
            equipment=["projector"]
        )
    )

    result = check_equipment(allocation)

    assert result["feasible"] is False
    assert result["constraint"] == "equipment"
    assert "computer" in result["message"]


# =========================================================
# Room Conflict Tests
# =========================================================

def test_room_conflict_detected():
    timeslot = create_timeslot()

    existing_allocation = create_allocation(
        section=create_section(),
        room=create_room(room_id=1),
        timeslot=timeslot
    )

    new_allocation = create_allocation(
        section=Section(
            id=2,
            name="Web Section",
            students=25,
            student_group="G2",
            duration=2,
            room_type_required="lecture",
            equipment_required=[],
            lecturer_id=2
        ),
        room=create_room(room_id=1),
        timeslot=timeslot
    )

    result = check_room_conflict(
        new_allocation,
        [existing_allocation]
    )

    assert result["feasible"] is False
    assert result["constraint"] == "room_conflict"


def test_room_conflict_not_detected_when_different_room():
    timeslot = create_timeslot()

    existing_allocation = create_allocation(
        room=create_room(room_id=1),
        timeslot=timeslot
    )

    new_allocation = create_allocation(
        section=Section(
            id=2,
            name="Web Section",
            students=25,
            student_group="G2",
            duration=2,
            room_type_required="lecture",
            equipment_required=[],
            lecturer_id=2
        ),
        room=create_room(room_id=2),
        timeslot=timeslot
    )

    result = check_room_conflict(
        new_allocation,
        [existing_allocation]
    )

    assert result["feasible"] is True


# =========================================================
# Lecturer Conflict Tests
# =========================================================

def test_lecturer_conflict_detected():
    timeslot = create_timeslot()

    lecturer = create_lecturer(lecturer_id=1)

    existing_allocation = create_allocation(
        lecturer=lecturer,
        timeslot=timeslot
    )

    new_allocation = create_allocation(
        section=Section(
            id=2,
            name="Web Section",
            students=25,
            student_group="G2",
            duration=2,
            room_type_required="lecture",
            equipment_required=[],
            lecturer_id=1
        ),
        lecturer=lecturer,
        room=create_room(room_id=2),
        timeslot=timeslot
    )

    result = check_lecturer_conflict(
        new_allocation,
        [existing_allocation]
    )

    assert result["feasible"] is False
    assert result["constraint"] == "lecturer_conflict"


def test_lecturer_conflict_not_detected_when_different_lecturer():
    timeslot = create_timeslot()

    existing_allocation = create_allocation(
        lecturer=create_lecturer(lecturer_id=1),
        timeslot=timeslot
    )

    new_allocation = create_allocation(
        section=Section(
            id=2,
            name="Web Section",
            students=25,
            student_group="G2",
            duration=2,
            room_type_required="lecture",
            equipment_required=[],
            lecturer_id=2
        ),
        lecturer=create_lecturer(lecturer_id=2),
        room=create_room(room_id=2),
        timeslot=timeslot
    )

    result = check_lecturer_conflict(
        new_allocation,
        [existing_allocation]
    )

    assert result["feasible"] is True


# =========================================================
# Room Type Tests
# =========================================================

def test_room_type_matches():
    allocation = create_allocation(
        section=create_section(room_type_required="lecture"),
        room=Room(
            id=1,
            name="Lecture Room",
            room_type="lecture",
            capacity=40,
            equipment=[],
            available=True
        )
    )

    result = check_room_type(allocation)

    assert result["feasible"] is True
    assert result["constraint"] == "room_type"


def test_room_type_does_not_match():
    allocation = create_allocation(
        section=create_section(room_type_required="lab"),
        room=Room(
            id=1,
            name="Lecture Room",
            room_type="lecture",
            capacity=40,
            equipment=[],
            available=True
        )
    )

    result = check_room_type(allocation)

    assert result["feasible"] is False
    assert result["constraint"] == "room_type"
    assert "lab" in result["message"]
    assert "lecture" in result["message"]


# =========================================================
# Lecturer Availability Tests
# =========================================================

def test_lecturer_is_available():
    allocation = create_allocation(
        lecturer=Lecturer(
            id=1,
            name="Dr. Ahmed",
            available_slots=["Sunday_09_11"],
            preferred_slots=[]
        ),
        timeslot=TimeSlot(
            id=1,
            day="Sunday",
            start="09:00",
            end="11:00"
        )
    )

    result = check_lecturer_availability(allocation)

    assert result["feasible"] is True
    assert result["constraint"] == "lecturer_availability"


def test_lecturer_is_not_available():
    allocation = create_allocation(
        lecturer=Lecturer(
            id=1,
            name="Dr. Ahmed",
            available_slots=["Monday_09_11"],
            preferred_slots=[]
        ),
        timeslot=TimeSlot(
            id=1,
            day="Sunday",
            start="09:00",
            end="11:00"
        )
    )

    result = check_lecturer_availability(allocation)

    assert result["feasible"] is False
    assert result["constraint"] == "lecturer_availability"
    assert "not available" in result["message"]


# =========================================================
# Room Availability Tests
# =========================================================

def test_room_is_available():
    allocation = create_allocation(
        room=create_room()
    )

    result = check_room_availability(allocation)

    assert result["feasible"] is True
    assert result["constraint"] == "room_availability"


def test_room_is_not_available():
    allocation = create_allocation(
        room=Room(
            id=1,
            name="Room 1",
            room_type="lecture",
            capacity=40,
            equipment=[],
            available=False
        )
    )

    result = check_room_availability(allocation)

    assert result["feasible"] is False
    assert result["constraint"] == "room_availability"
    assert "unavailable" in result["message"]


# =========================================================
# Duration Tests
# =========================================================

def test_duration_is_sufficient():
    allocation = create_allocation(
        section=create_section()
    )

    result = check_duration(allocation)

    assert result["feasible"] is True
    assert result["constraint"] == "duration"


def test_duration_is_not_sufficient():
    allocation = create_allocation(
        section=Section(
            id=1,
            name="AI Section",
            students=30,
            student_group="G1",
            duration=3,
            room_type_required="lecture",
            equipment_required=[],
            lecturer_id=1
        ),
        timeslot=TimeSlot(
            id=1,
            day="Sunday",
            start="09:00",
            end="11:00"
        )
    )

    result = check_duration(allocation)

    assert result["feasible"] is False
    assert result["constraint"] == "duration"
    assert "3 hours" in result["message"]
    assert "2 hours" in result["message"]


# =========================================================
# Student Group Conflict Tests
# =========================================================

def test_student_group_conflict_detected():
    timeslot = create_timeslot()

    existing_allocation = create_allocation(
        section=create_section()
    )

    new_allocation = create_allocation(
        section=Section(
            id=2,
            name="Web Section",
            students=25,
            student_group="G1",
            duration=2,
            room_type_required="lecture",
            equipment_required=[],
            lecturer_id=2
        ),
        room=create_room(room_id=2),
        lecturer=create_lecturer(lecturer_id=2),
        timeslot=timeslot
    )

    result = check_student_group_conflict(
        new_allocation,
        [existing_allocation]
    )

    assert result["feasible"] is False
    assert result["constraint"] == "student_group_conflict"


def test_student_group_conflict_not_detected_when_different_group():
    timeslot = create_timeslot()

    existing_allocation = create_allocation(
        section=create_section()
    )

    new_allocation = create_allocation(
        section=Section(
            id=2,
            name="Web Section",
            students=25,
            student_group="G2",
            duration=2,
            room_type_required="lecture",
            equipment_required=[],
            lecturer_id=2
        ),
        room=create_room(room_id=2),
        lecturer=create_lecturer(lecturer_id=2),
        timeslot=timeslot
    )

    result = check_student_group_conflict(
        new_allocation,
        [existing_allocation]
    )

    assert result["feasible"] is True
    assert result["constraint"] == "student_group_conflict"
