const app = require("./src/app");

const PORT = 5000;

app.get("/test", (req, res) => {
    res.json({
        message: "TEST ROUTE WORKS"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});