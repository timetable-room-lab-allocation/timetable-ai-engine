const request = require("supertest");
const app = require("../src/app");

describe("Sections CRUD API", () => {

    let sectionId;

    test("GET /api/sections should return all sections", async () => {
        const response = await request(app)
            .get("/api/sections");

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe(
            "Sections fetched successfully"
        );

        expect(Array.isArray(response.body.data)).toBe(true);
    });


    test("POST /api/sections should create a new section", async () => {
        const response = await request(app)
            .post("/api/sections")
            .send({
                course_id: 1,
                student_group_id: 1,
                lecturer_id: 1,
                name: "Jest Test Section",
                students: 25,
                duration: 1,
                room_type_required: "Lecture"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe(
            "Section created successfully"
        );

        expect(response.body.data).toHaveProperty("sectionId");

        sectionId = response.body.data.sectionId;

        expect(typeof sectionId).toBe("number");
    });


    test("GET /api/sections/:id should return the created section", async () => {
        const response = await request(app)
            .get(`/api/sections/${sectionId}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe(
            "Section fetched successfully"
        );

        expect(response.body.data.id).toBe(sectionId);

        expect(response.body.data.name).toBe(
            "Jest Test Section"
        );

        expect(Number(response.body.data.students)).toBe(25);

        expect(Number(response.body.data.duration)).toBe(1);

        expect(response.body.data.room_type_required).toBe(
            "Lecture"
        );
    });


    test("PUT /api/sections/:id should update the section", async () => {
        const response = await request(app)
            .put(`/api/sections/${sectionId}`)
            .send({
                course_id: 1,
                student_group_id: 1,
                lecturer_id: 1,
                name: "Jest Updated Section",
                students: 30,
                duration: 2,
                room_type_required: "Lab"
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe(
            "Section updated successfully"
        );
    });


    test("GET /api/sections/:id should return updated section data", async () => {
        const response = await request(app)
            .get(`/api/sections/${sectionId}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.data.name).toBe(
            "Jest Updated Section"
        );

        expect(Number(response.body.data.students)).toBe(30);

        expect(Number(response.body.data.duration)).toBe(2);

        expect(response.body.data.room_type_required).toBe(
            "Lab"
        );
    });


    test("DELETE /api/sections/:id should delete the section", async () => {
        const response = await request(app)
            .delete(`/api/sections/${sectionId}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe(
            "Section deleted successfully"
        );
    });


    test("GET /api/sections/:id should return 404 after deletion", async () => {
        const response = await request(app)
            .get(`/api/sections/${sectionId}`);

        expect(response.statusCode).toBe(404);

        expect(response.body.success).toBe(false);

        expect(response.body.message).toBe(
            "Section not found"
        );
    });

});