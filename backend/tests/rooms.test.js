const request = require("supertest");
const app = require("../src/app");

describe("Rooms CRUD API", () => {

    let roomId;

    test("GET /api/rooms should return all rooms", async () => {
        const response = await request(app)
            .get("/api/rooms");

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe(
            "Rooms fetched successfully"
        );

        expect(Array.isArray(response.body.data)).toBe(true);
    });


    test("POST /api/rooms should create a new room", async () => {
        const response = await request(app)
            .post("/api/rooms")
            .send({
                name: "Jest Test Room",
                room_type: "Lecture",
                capacity: 40
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe(
            "Room created successfully"
        );

        expect(response.body.data).toHaveProperty("roomId");

        roomId = response.body.data.roomId;

        expect(typeof roomId).toBe("number");
    });


    test("GET /api/rooms/:id should return the created room", async () => {
        const response = await request(app)
            .get(`/api/rooms/${roomId}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe(
            "Room fetched successfully"
        );

        expect(response.body.data.id).toBe(roomId);

        expect(response.body.data.name).toBe(
            "Jest Test Room"
        );
    });


    test("PUT /api/rooms/:id should update the room", async () => {
        const response = await request(app)
            .put(`/api/rooms/${roomId}`)
            .send({
                name: "Jest Updated Room",
                room_type: "Lab",
                capacity: 50,
                is_available: 1
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe(
            "Room updated successfully"
        );
    });


    test("GET /api/rooms/:id should return updated data", async () => {
        const response = await request(app)
            .get(`/api/rooms/${roomId}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.data.name).toBe(
            "Jest Updated Room"
        );

        expect(response.body.data.room_type).toBe("Lab");

        expect(Number(response.body.data.capacity)).toBe(50);
    });


    test("DELETE /api/rooms/:id should delete the room", async () => {
        const response = await request(app)
            .delete(`/api/rooms/${roomId}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe(
            "Room deleted successfully"
        );
    });


    test("GET /api/rooms/:id should return 404 after deletion", async () => {
        const response = await request(app)
            .get(`/api/rooms/${roomId}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.success).toBe(false);

        expect(response.body.message).toBe(
            "Room not found"
        );
    });

});