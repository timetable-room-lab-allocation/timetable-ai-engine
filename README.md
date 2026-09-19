# Timetable AI Engine

An AI-powered timetable generation and room allocation engine.

This project is responsible for generating feasible timetable recommendations based on rooms, lecturers, student groups, time slots, constraints, and allocation conflicts.

The AI Engine is implemented in **Python** and exposed through a **FastAPI** API so that the main backend can communicate with it using HTTP/JSON.

---

## 1. Project Overview

The system receives timetable requirements and generates ranked recommendations for suitable:

* Rooms
* Days
* Time slots
* Allocation combinations

The engine first checks whether an allocation satisfies all required constraints.

Only feasible allocations are passed to the scoring and ranking system.

The final recommendations include a score and an explanation of why each allocation was recommended.

---

## 2. System Architecture

```text
React Frontend
      │
      ▼
Node.js / Express Backend
      │
      │ HTTP / JSON
      ▼
FastAPI
      │
      ▼
AI Recommendation Engine
      │
      ├── Constraint Engine
      ├── Allocation Engine
      ├── Scoring / Ranking
      └── Explanation
      │
      ▼
Recommendations
      │
      ▼
FastAPI → Node.js → React
```

### Responsibilities

**React**

* User interface
* Sends timetable requests to the main backend
* Displays recommendations

**Node.js / Express**

* Main backend
* Authentication and business logic
* Database communication
* Communicates with the AI service

**FastAPI**

* AI service/API layer
* Receives JSON requests from Node.js
* Converts request data into Python objects
* Calls the AI Engine
* Returns JSON recommendations

**AI Engine**

* Constraint validation
* Feasible allocation generation
* Scoring
* Ranking
* Explanation

---

## 3. Project Structure

```text
timetable-ai-engine/
│
├── api/
│   ├── __init__.py
│   └── main.py
│
├── models/
│   ├── __init__.py
│   ├── section.py
│   ├── lecturer.py
│   ├── room.py
│   ├── timeslot.py
│   └── allocation.py
│
├── engine/
│   ├── __init__.py
│   ├── allocation_engine.py
│   ├── constraint_engine.py
│   └── recommendation_engine.py
│
├── constraints/
│   ├── __init__.py
│   ├── capacity.py
│   ├── room_type.py
│   ├── equipment.py
│   ├── lecturer_availability.py
│   ├── lecturer_conflict.py
│   ├── student_group_conflict.py
│   ├── room_conflict.py
│   ├── room_availability.py
│   └── duration.py
│
├── scoring/
│   ├── __init__.py
│   ├── ranking.py
│   ├── explanation.py
│   ├── compactness.py
│   └── room_utilization.py
│
├── tests/
│   └── ...
│
├── api/
│   └── main.py
│
├── main.py
├── requirements.txt
├── .gitignore
└── README.md
```

---

# 4. Core Data Models

## Section

Represents a course section.

```python
Section(
    id,
    name,
    students,
    student_group,
    duration,
    room_type_required,
    equipment_required,
    lecturer_id
)
```

## Lecturer

Represents a lecturer and their availability/preferences.

```python
Lecturer(
    id,
    name,
    available_slots,
    preferred_slots
)
```

## Room

Represents a classroom or laboratory.

```python
Room(
    id,
    name,
    room_type,
    capacity,
    equipment,
    available
)
```

## TimeSlot

Represents a possible teaching period.

```python
TimeSlot(
    id,
    day,
    start,
    end
)
```

## Allocation

Represents a complete assignment:

```text
Section + Lecturer + Room + TimeSlot
```

---

# 5. Constraint Engine

The Constraint Engine determines whether an allocation is feasible.

The current constraints include:

### Capacity

Checks whether the room can accommodate the number of students.

```text
students <= room capacity
```

### Room Type

Checks whether the room type satisfies the section requirement.

Example:

```text
Required: lab
Room: lab
→ Feasible
```

### Equipment

Checks whether all required equipment is available in the room.

Example:

```text
Required:
GPU

Room equipment:
GPU, Projector

→ Feasible
```

### Lecturer Availability

Checks whether the lecturer is available during the selected time slot.

### Room Availability

Checks whether the selected room is available.

### Duration

Checks whether the selected time slot satisfies the required duration.

### Lecturer Conflict

Prevents a lecturer from teaching two different sections during the same time slot.

### Student Group Conflict

Prevents the same student group from having two different sections during the same time slot.

### Room Conflict

Prevents the same room from being assigned to two different sections during the same time slot.

---

# 6. Allocation Pipeline

The main allocation process follows this flow:

```text
Input Data
    │
    ▼
Generate Possible Allocations
    │
    ▼
Validate Constraints
    │
    ├── Invalid → Reject
    │
    └── Valid
          │
          ▼
      Score Allocation
          │
          ▼
      Rank Allocations
          │
          ▼
      Generate Explanation
          │
          ▼
      Recommendations
```

---

# 7. Scoring and Ranking

After invalid allocations are removed, the remaining feasible allocations are scored.

The scoring system considers factors such as:

* Capacity fit
* Lecturer preference
* Room utilization
* Timetable compactness
* Other project-defined scoring criteria

The feasible allocations are then ranked according to their scores.

---

# 8. Explanation System

Each recommendation contains reasons explaining the resulting score.

Example:

```json
{
  "score": 88.67,
  "reasons": [
    "Capacity fit is not optimal.",
    "All required equipment is available.",
    "The time slot matches the lecturer's preference."
  ]
}
```

This makes the recommendation system more transparent and easier to understand.

---

# 9. FastAPI

The AI Engine is exposed through FastAPI.

## Start the API

From the project root:

```bash
uvicorn api.main:app --reload
```

The API will run at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

OpenAPI specification:

```text
http://127.0.0.1:8000/openapi.json
```

---

# 10. API Endpoint

## Generate Recommendations

```http
POST /api/recommendations
```

Full local URL:

```text
http://127.0.0.1:8000/api/recommendations
```

---

# 11. Request Example

```json
{
  "section": {
    "id": 1,
    "name": "Artificial Intelligence",
    "students": 40,
    "student_group": "G1",
    "duration": 2,
    "room_type_required": "lab",
    "equipment_required": [
      "GPU"
    ],
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
      "id": 2,
      "name": "Room 2",
      "room_type": "lab",
      "capacity": 30,
      "equipment": [
        "GPU"
      ],
      "available": true
    },
    {
      "id": 3,
      "name": "Room 3",
      "room_type": "lab",
      "capacity": 50,
      "equipment": [
        "GPU"
      ],
      "available": true
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
```

---

# 12. Response Example

```json
{
  "section": "Artificial Intelligence",
  "recommendations": [
    {
      "room": "Room 3",
      "day": "Sunday",
      "start": "10:00",
      "end": "12:00",
      "score": 88.67,
      "reasons": [
        "Capacity fit is not optimal.",
        "All required equipment is available.",
        "The time slot matches the lecturer's preference."
      ]
    }
  ]
}
```

---

# 13. Existing Allocations

The API supports sending existing timetable allocations.

This allows the AI Engine to detect conflicts with already scheduled sections.

The engine checks:

```text
Lecturer Conflict
Student Group Conflict
Room Conflict
```

Example:

```text
Existing:

Database
Room 2
Sunday 10:00 - 12:00

New section:

Artificial Intelligence
Room 2
Sunday 10:00 - 12:00

Result:

Room 2 is rejected.
```

The engine can then recommend another feasible room/time combination.

---

# 14. Backend Integration

The main backend is responsible for communicating with this AI service.

```text
Node.js
   │
   │ POST /api/recommendations
   ▼
FastAPI
   │
   ▼
AI Engine
   │
   ▼
Recommendations
   │
   ▼
FastAPI
   │
   ▼
Node.js
```

The Node.js backend should not implement the AI constraints or scoring logic.

Its responsibility is to:

1. Receive data from the frontend.
2. Validate/authenticate the request.
3. Send the required JSON to FastAPI.
4. Receive the AI recommendations.
5. Return the result to the frontend.

---

# 15. Testing

The FastAPI endpoint can be tested using Swagger.

Open:

```text
http://127.0.0.1:8000/docs
```

Then:

```text
POST /api/recommendations
```

Select:

```text
Try it out
```

Paste the request JSON and execute.

A successful request should return:

```text
HTTP 200
```

with a JSON response containing the recommendations.

---

# 16. Technologies

### Programming Language

* Python

### API

* FastAPI
* Uvicorn
* Pydantic

### Architecture

* Constraint-based allocation
* Feasibility filtering
* Scoring
* Ranking
* Explainable recommendations

---

# 17. Current Status

```text
[✓] Data Models
[✓] Constraint Engine
[✓] Allocation Generation
[✓] Conflict Detection
[✓] Scoring
[✓] Ranking
[✓] Compactness
[✓] Room Utilization
[✓] Explanation System
[✓] Recommendation Engine
[✓] FastAPI API
[✓] Swagger Testing
[✓] Existing Allocation Support
[ ] Node.js Integration
[ ] Frontend Integration
```

---

# 18. Development Workflow

The recommended development flow is:

```text
1. Frontend sends timetable request
              ↓
2. Node.js receives request
              ↓
3. Node.js sends JSON to FastAPI
              ↓
4. FastAPI converts JSON to Python models
              ↓
5. AI Engine generates feasible allocations
              ↓
6. Scoring and ranking
              ↓
7. Explanation generation
              ↓
8. FastAPI returns JSON
              ↓
9. Node.js returns result to frontend
```

---

## Author

Timetable AI Engine developed as part of the project's AI component.

The AI component is responsible for constraint validation, allocation generation, scoring, ranking, and explainable timetable recommendations.
