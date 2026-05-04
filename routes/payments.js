const express = require("express");
const router = express.Router();
const db = require("../db");


// 💰 MARK MONTH AS PAID (SIMPLE SYSTEM)
router.post("/pay", (req, res) => {
    const { tenant_id, month, year } = req.body;

    const sql = `
    INSERT INTO payments (tenant_id, month, year, status, payment_date)
    VALUES (?, ?, ?, 'Paid', NOW())
    ON DUPLICATE KEY UPDATE
        status = 'Paid',
        payment_date = NOW()
    `;

    db.query(sql, [tenant_id, month, year], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error saving payment");
        }
        res.send("Payment updated successfully");
    });
});

// 📋 GET MONTHLY STATUS (FOR DASHBOARD)
router.get("/status", (req, res) => {

    const { month, year } = req.query;

    const sql = `
    SELECT 
        t.id,
        t.name,
        t.floor,
        t.rent,
        t.water_bill,

        IF(p.status = 'Paid', 1, 0) AS is_paid,
        p.payment_date

    FROM tenants t

    LEFT JOIN payments p
        ON t.id = p.tenant_id
        AND p.month = ?
        AND p.year = ?
    `;

    db.query(sql, [month, year], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error fetching data");
        }

        const data = result.map(t => {

            const total = Number(t.rent || 0) + Number(t.water_bill || 0);

            const paid = t.is_paid ? total : 0;

            const balance = total - paid;

            let status = "Unpaid";
            if (balance <= 0) status = "Paid";
            else if (paid > 0) status = "Partial";

            return {
                ...t,
                total,
                paid_amount: paid,
                balance,
                status
            };
        });

        res.json(data);
    });
});

// 📜 PAYMENT HISTORY (ALL MONTHS)
router.get("/history/:id", (req, res) => {

    const tenantId = req.params.id;

    const sql = `
        SELECT 
            month,
            year,
            status,
            payment_date
        FROM payments
        WHERE tenant_id = ?
        ORDER BY year DESC, id DESC
    `;

    db.query(sql, [tenantId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error fetching history");
        }

        res.json(result);
    });
});
module.exports = router;