from models.room import Room
from models.section import Section
from models.lecturer import Lecturer
from models.timeslot import TimeSlot
from models.allocation import Allocation

from scoring.explanation import (
    explain_allocation
)

from engine.allocation_engine import (
    rank_feasible_allocations
)

from engine.constraint_engine import (
    validate_allocation,
    validate_allocation_with_context
)

from scoring.scoring import (
    score_capacity_fit,
    score_equipment_match,
    score_lecturer_preference,
    calculate_total_score
)




# =========================
# Create Section
# =========================

ai_section = Section(
    id=101,
    name="Artificial Intelligence",
    students=40,
    student_group="G1",
    room_type_required="lab",
    equipment_required=["GPU"],
    lecturer_id=1,
    duration=2,
)


# =========================
# Create Lecturer
# =========================

lecturer = Lecturer(
    id=1,
    name="Dr. Ahmed",
    available_slots=["Sunday_10_12"],
    preferred_slots=["Sunday_10_12"]
)


# =========================
# Create Room
# =========================

lab_1 = Room(
    id=1,
    name="Lab 1",
    room_type="classroom",
    capacity=30,
    equipment=["Projector"],
    available=False
)

room_2 = Room(
    id=2,
    name="Room 2",
    room_type="lab",
    capacity=50,
    equipment=["GPU", "Projector"],
    available=True
)




# =========================
# Create Time Slot
# =========================

slot = TimeSlot(
    id=1,
    day="Sunday",
    start="10:00",
    end="12:00"
    
)


# =========================
# Create AI Allocation
# =========================

ai_allocation = Allocation(
    section=ai_section,
    lecturer=lecturer,
    room=lab_1,
    timeslot=slot
)

ai_scoring_allocation = Allocation(
    section=ai_section,
    lecturer=lecturer,
    room=room_2,
    timeslot=slot
)



# =========================
# Create Database Section
# =========================

database_section = Section(
    id=102,
    name="Database",
    students=25,
    student_group="G1",  # نفس مجموعة AI
    room_type_required="classroom",
    equipment_required=["Projector"],
    lecturer_id=1,
    duration=2,
)

# =========================
# Create Database Allocation
# =========================

database_allocation = Allocation(
    section=database_section,
    lecturer=lecturer,
    room=lab_1,
    timeslot=slot
)


# =========================
# Check Lecturer Conflict
# =========================

existing_allocations = [
    ai_allocation
]

result = validate_allocation_with_context(
    database_allocation,
    existing_allocations
)


# =========================
# Print Result
# =========================

print(result)


capacity_score = score_capacity_fit(
    ai_scoring_allocation
)

equipment_score = score_equipment_match(
    ai_scoring_allocation
)

preference_score = score_lecturer_preference(
    ai_scoring_allocation
)

total_score = calculate_total_score(
    ai_scoring_allocation
)

print("Capacity Score:", capacity_score)
print("Equipment Score:", equipment_score)
print("Lecturer Preference Score:", preference_score)
print("Total Score:", total_score)


# ==========================================
# Integration Test
# ==========================================

rooms = [
    room_2,

    Room(
        id=3,
        name="Room 3",
        room_type="lab",
        capacity=60,
        equipment=["GPU"],
        available=True
    ),

    Room(
        id=4,
        name="Room 4",
        room_type="lab",
        capacity=35,
        equipment=["GPU", "Projector"],
        available=True
    )
]


timeslots = [
    slot,

    TimeSlot(
        id=2,
        day="Sunday",
        start="12:00",
        end="14:00"
    ),

    TimeSlot(
        id=3,
        day="Monday",
        start="10:00",
        end="12:00"
    )
]


ranked_allocations = rank_feasible_allocations(
    section=ai_section,
    lecturer=lecturer,
    rooms=rooms,
    timeslots=timeslots,
    existing_allocations=[]
)


print("\n=== Ranked Allocations ===")

for index, item in enumerate(
    ranked_allocations,
    start=1
):

    allocation = item["allocation"]

    print(
        f"{index}. "
        f"{allocation.room.name} | "
        f"{allocation.timeslot.day} "
        f"{allocation.timeslot.start}-"
        f"{allocation.timeslot.end} | "
        f"Score: {item['score']}"
    )

# ==========================================
# Explain Best Allocation
# ==========================================

if ranked_allocations:

    best_allocation = ranked_allocations[0]["allocation"]

    explanation = explain_allocation(
        best_allocation
    )

    print("\n=== Best Allocation Explanation ===")

    print(
        "Room:",
        explanation["room"]
    )

    print(
        "Time:",
        explanation["day"],
        explanation["start"],
        "-",
        explanation["end"]
    )

    print(
        "Scores:",
        explanation["scores"]
    )

    print("Reasons:")

    for reason in explanation["reasons"]:
        print("-", reason)    



from engine.recommendation_engine import (
    generate_recommendations
)


# ==========================================
# Backend Output Test
# ==========================================

result = generate_recommendations(
    section=ai_section,
    lecturer=lecturer,
    rooms=rooms,
    timeslots=timeslots,
    existing_allocations=[]
)


print("\n=== Backend JSON Output ===") 

import json

print(
    json.dumps(
        result,
        indent=4
    )
)

