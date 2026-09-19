from dataclasses import dataclass


@dataclass(frozen=True)
class TimeSlot:
    id: int
    day: str
    start: str
    end: str