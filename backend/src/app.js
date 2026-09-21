const express = require("express");
const pool = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const roomRoutes = require("./routes/room.routes");
const lecturerRoutes = require("./routes/lecturer.routes");
const courseRoutes = require("./routes/course.routes");
const studentGroupRoutes = require("./routes/studentGroup.routes");
const equipmentRoutes = require("./routes/equipment.routes");
const timeslotRoutes = require("./routes/timeslot.routes");
const sectionRoutes = require("./routes/section.routes");
const allocationRoutes = require("./routes/allocation.routes");
const aiRoutes = require("./routes/ai.routes");
const { testFastAPI } = require("./services/fastapi.service");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const app = express();


// =========================
// JSON Middleware
// =========================

app.use(express.json());

// =========================
// Swagger API Documentation
// =========================

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);


// =========================
// Main API Routes
// =========================

app.use("/api/allocations", allocationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/lecturers", lecturerRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/student-groups", studentGroupRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/timeslots", timeslotRoutes);


// =========================
// Root Route
// =========================

/**
 * @swagger
 * /:
 *   get:
 *     summary: Check backend API status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Backend API is running
 */
app.get("/", (req, res) => {
    res.json({
        message: "Timetable Backend API is running"
    });
});


// =========================
// Health Check - Backend
// =========================

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check backend health
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Backend is running successfully
 */
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        service: "backend"
    });
});


// =========================
// Health Check - Database
// =========================

/**
 * @swagger
 * /api/health/db:
 *   get:
 *     summary: Check database connection
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Database is connected successfully
 *       500:
 *         description: Database connection error
 */
app.get("/api/health/db", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1 AS ok");

        res.json({
            database: "connected",
            result: rows[0]
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            database: "error",
            message: error.message
        });
    }
});


// =========================
// Health Check - FastAPI
// =========================

/**
 * @swagger
 * /api/health/fastapi:
 *   get:
 *     summary: Check FastAPI connection
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: FastAPI is connected successfully
 *       500:
 *         description: FastAPI connection error
 */
app.get("/api/health/fastapi", async (req, res) => {
    try {
        const data = await testFastAPI();

        res.json({
            fastapi: "connected",
            response: data
        });
    } catch (error) {
        res.status(500).json({
            fastapi: "error",
            message: error.message
        });
    }
});


// =========================
// 404 Handler
// =========================

app.use(notFound);


// =========================
// Global Error Handler
// =========================

app.use(errorHandler);


module.exports = app;