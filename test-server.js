// Test server para verificar Excel
const express = require("express");
const app = express();
app.use(express.static("public"));

app.get("/test-excel", (req, res) => {
    const fs = require("fs");
    try {
        if (fs.existsSync("./public/Descriptions.xlsx")) {
            res.json({ exists: true, message: "Excel OK" });
        } else {
            res.json({ exists: false, message: "Excel no encontrado" });
        }
    } catch (e) {
        res.json({ error: e.message });
    }
});

app.listen(3001, () => console.log("Test server en :3001"));
