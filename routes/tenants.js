const express = require("express");
const router = express.Router();
const db = require("../db");

// Add tenant
router.post("/add", (req, res) => {
    const { name, floor, rent, water_bill, phone } = req.body;

const sql = `INSERT INTO tenants (name, floor, rent, water_bill, phone)VALUES (?, ?, ?, ?, ?)`;

    db.query(sql, [name, floor, rent, water_bill, phone], (err) => {
        if (err) throw err;
        res.send("Tenant added");
    });
});

// Get all tenants
router.get("/", (req, res) => {
    db.query("SELECT * FROM tenants", (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

module.exports = router;