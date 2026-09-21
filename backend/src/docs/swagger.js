const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Timetable AI Engine API",
            version: "1.0.0",
            description:
                "API documentation for the Timetable AI Engine Backend"
        },

        servers: [
            {
                url: "http://localhost:5000",
                description: "Local Development Server"
            }
        ]
    },

    apis: [
        "./src/routes/*.js",
        "./src/app.js"
    ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;