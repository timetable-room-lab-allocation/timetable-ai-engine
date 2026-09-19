from dataclasses import dataclass
from typing import List


@dataclass
class Room:
    id: int
    name: str
    room_type: str
    capacity: int
    equipment: List[str]
    available: bool = True