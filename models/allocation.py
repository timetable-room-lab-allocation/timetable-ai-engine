from dataclasses import dataclass

from .section import Section
from .lecturer import Lecturer
from .room import Room
from .timeslot import TimeSlot


@dataclass
class Allocation:
    section: Section
    lecturer: Lecturer
    room: Room
    timeslot: TimeSlot