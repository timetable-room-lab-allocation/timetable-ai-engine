const request = require("supertest");
const app = require("../src/app");

describe("Validation API Tests", () => {

    test("POST /api/sections should reject invalid data", async () => {
        const response = await request(app)
            .post("/api/sections")
            .send({
                name: "",
                students: -10,
                duration: 0,
                room_type_required: ""
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);

        expect(response.body.message).toBe("Validation failed");

        expect(response.body.errors).toContain("course_id is required");
        expect(response.body.errors).toContain("student_group_id is required");
        expect(response.body.errors).toContain("name is required");
        expect(response.body.errors).toContain(
            "students must be a positive integer"
        );
        expect(response.body.errors).toContain(
            "duration must be a positive integer"
        );
        expect(response.body.errors).toContain(
            "room_type_required is required"
        );
    });


    test("POST /api/rooms should reject missing required fields", async () => {
        const response = await request(app)
            .post("/api/rooms")
            .send({
                name: "",
                room_type: "",
                capacity: -5
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);

        expect(response.body.message).toBe(
            "name, room_type and capacity are required"
        );
    });

});