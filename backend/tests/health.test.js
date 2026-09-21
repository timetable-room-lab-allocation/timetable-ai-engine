const request = require("supertest");
const app = require("../src/app");

describe("Health API", () => {

    test("GET /api/health should return backend status", async () => {

        const response = await request(app)
            .get("/api/health");

        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual({
            status: "ok",
            service: "backend"
        });
    });

});