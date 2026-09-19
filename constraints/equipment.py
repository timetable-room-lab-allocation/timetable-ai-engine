from models.allocation import Allocation


def check_equipment(allocation: Allocation):
    required_equipment = set(allocation.section.equipment_required)
    available_equipment = set(allocation.room.equipment)

    missing_equipment = required_equipment - available_equipment

    if missing_equipment:
        return {
            "feasible": False,
            "constraint": "equipment",
            "message": (
                f"Required equipment is missing: "
                f"{', '.join(sorted(missing_equipment))}."
            )
        }

    return {
        "feasible": True,
        "constraint": "equipment",
        "message": "All required equipment is available."
    }