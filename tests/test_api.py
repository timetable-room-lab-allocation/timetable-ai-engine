from fastapi.testclient import TestClient

from fastapi_app import app


client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "ok"
    assert data["service"] == "fastapi-ai-engine"


def test_recommendations_endpoint():

    payload = {
        "section": {
            "id": 101,
            "name": "Artificial Intelligence",
            "students": 40,
            "student_group": "G1",
            "duration": 2,
            "room_type_required": "lab",
            "equipment_required": ["GPU"],
            "lecturer_id": 1
        },

        "lecturer": {
            "id": 1,
            "name": "Dr. Ahmed",
            "available_slots": [
                "Sunday_10_12"
            ],
            "preferred_slots": [
                "Sunday_10_12"
            ]
        },

        "rooms": [
            {
                "id": 1,
                "name": "Lab 1",
                "room_type": "lab",
                "capacity": 30,
                "equipment": ["GPU"],
                "available": True
            },
            {
                "id": 2,
                "name": "Lab 2",
                "room_type": "lab",
                "capacity": 50,
                "equipment": ["GPU", "Projector"],
                "available": True
            }
        ],

        "timeslots": [
            {
                "id": 1,
                "day": "Sunday",
                "start": "10:00",
                "end": "12:00"
            }
        ],

        "existing_allocations": []
    }

    response = client.post(
        "/api/recommendations",
        json=payload
    )

    assert response.status_code == 200

    data = response.json()

    assert "section" in data
    assert "recommendations" in data

    assert data["section"] == "Artificial Intelligence"

    assert isinstance(data["recommendations"], list)


def test_recommendations_excludes_invalid_room():

    payload = {
        "section": {
            "id": 101,
            "name": "Artificial Intelligence",
            "students": 40,
            "student_group": "G1",
            "duration": 2,
            "room_type_required": "lab",
            "equipment_required": ["GPU"],
            "lecturer_id": 1
        },

        "lecturer": {
            "id": 1,
            "name": "Dr. Ahmed",
            "available_slots": [
                "Sunday_10_12"
            ],
            "preferred_slots": [
                "Sunday_10_12"
            ]
        },

        "rooms": [
            {
                "id": 1,
                "name": "Small Lab",
                "room_type": "lab",
                "capacity": 20,
                "equipment": ["GPU"],
                "available": True
            },
            {
                "id": 2,
                "name": "Large Lab",
                "room_type": "lab",
                "capacity": 50,
                "equipment": ["GPU"],
                "available": True
            }
        ],

        "timeslots": [
            {
                "id": 1,
                "day": "Sunday",
                "start": "10:00",
                "end": "12:00"
            }
        ],

        "existing_allocations": []
    }

    response = client.post(
        "/api/recommendations",
        json=payload
    )

    assert response.status_code == 200

    data = response.json()

    recommendations = data["recommendations"]

    room_names = [
        recommendation["room"]
        for recommendation in recommendations
    ]

    assert "Small Lab" not in room_names
    assert "Large Lab" in room_names