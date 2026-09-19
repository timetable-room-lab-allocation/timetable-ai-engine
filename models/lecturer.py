from dataclasses import dataclass
from typing import List


@dataclass
class Lecturer:
    id: int
    name: str
    available_slots: List[str]
    preferred_slots: List[str]