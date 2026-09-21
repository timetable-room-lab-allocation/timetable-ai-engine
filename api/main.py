from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from models.section import Section
from models.lecturer import Lecturer
from models.room import Room
from models.timeslot import TimeSlot
from models.allocation import Allocation
from engine.recommendation_engine import generate_recommendations


app = FastAPI(
    title="Timetable AI Engine",
    description="AI Engine API for timetable and room allocation",
    version="1.0.0"
)


# =========================
# Request Models
# =========================

class SectionRequest(BaseModel):
    id: int
    name: str
    students: int
    student_group: str
    duration: int
    room_type_required: str
    equipment_required: List[str]
    lecturer_id: int


class LecturerRequest(BaseModel):
    id: int
    name: str
    available_slots: List[str]
    preferred_slots: List[str]


class RoomRequest(BaseModel):
    id: int
    name: str
    room_type: str
    capacity: int
    equipment: List[str]
    available: bool = True


class TimeSlotRequest(BaseModel):
    id: int
    day: str
    start: str
    end: str


class AllocationRequest(BaseModel):
    section: SectionRequest
    lecturer: LecturerRequest
    room: RoomRequest
    timeslot: TimeSlotRequest


class RecommendationRequest(BaseModel):
    section: SectionRequest
    lecturer: LecturerRequest
    rooms: List[RoomRequest]
    timeslots: List[TimeSlotRequest]
    existing_allocations: List[AllocationRequest] = []


# =========================
# Root
# =========================

@app.get("/")
def root():
    return {
        "message": "Timetable AI Engine is running"
    }


# =========================
# Recommendations
# =========================

@app.post("/api/recommendations")
def recommendations(request: RecommendationRequest):

    # =========================
    # Convert Section
    # =========================

    section = Section(
        id=request.section.id,
        name=request.section.name,
        students=request.section.students,
        student_group=request.section.student_group,
        duration=request.section.duration,
        room_type_required=request.section.room_type_required,
        equipment_required=request.section.equipment_required,
        lecturer_id=request.section.lecturer_id
    )


    # =========================
    # Convert Lecturer
    # =========================

    lecturer = Lecturer(
        id=request.lecturer.id,
        name=request.lecturer.name,
        available_slots=request.lecturer.available_slots,
        preferred_slots=request.lecturer.preferred_slots
    )


    # =========================
    # Convert Rooms
    # =========================

    rooms = [
        Room(
            id=room.id,
            name=room.name,
            room_type=room.room_type,
            capacity=room.capacity,
            equipment=room.equipment,
            available=room.available
        )
        for room in request.rooms
    ]


    # =========================
    # Convert TimeSlots
    # =========================

    timeslots = [
        TimeSlot(
            id=slot.id,
            day=slot.day,
            start=slot.start,
            end=slot.end
        )
        for slot in request.timeslots
    ]


    # =========================
    # Convert Existing Allocations
    # =========================

    existing_allocations = []

    for item in request.existing_allocations:

        existing_section = Section(
            id=item.section.id,
            name=item.section.name,
            students=item.section.students,
            student_group=item.section.student_group,
            duration=item.section.duration,
            room_type_required=item.section.room_type_required,
            equipment_required=item.section.equipment_required,
            lecturer_id=item.section.lecturer_id
        )

        existing_lecturer = Lecturer(
            id=item.lecturer.id,
            name=item.lecturer.name,
            available_slots=item.lecturer.available_slots,
            preferred_slots=item.lecturer.preferred_slots
        )

        existing_room = Room(
            id=item.room.id,
            name=item.room.name,
            room_type=item.room.room_type,
            capacity=item.room.capacity,
            equipment=item.room.equipment,
            available=item.room.available
        )

        existing_timeslot = TimeSlot(
            id=item.timeslot.id,
            day=item.timeslot.day,
            start=item.timeslot.start,
            end=item.timeslot.end
        )

        existing_allocations.append(
            Allocation(
                section=existing_section,
                lecturer=existing_lecturer,
                room=existing_room,
                timeslot=existing_timeslot
            )
        )


    # =========================
    # Run AI Recommendation Engine
    # =========================

    result = generate_recommendations(
        section=section,
        lecturer=lecturer,
        rooms=rooms,
        timeslots=timeslots,
        existing_allocations=existing_allocations
    )


    # =========================
    # Return Result
    # =========================

    return result
