from dataclasses import dataclass
from typing import List


@dataclass
class Section:
    id: int
    name: str
    students: int
    student_group: str
    duration: int
    room_type_required: str
    equipment_required: List[str]
    lecturer_id: int