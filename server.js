const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const SECRET = "rent_secret_key";

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(bodyParser.json());

app.get("/", (req, res) => {
    if (req.session.user) {
        res.redirect("/index.html");   // dashboard
    } else {
        res.redirect("/login.html");   // login page
    }
});

app.use(express.static("public"));


const ADMIN_USER = "mamathasuresh";
const ADMIN_PASS = "ammu1234";

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (username === "mamathasuresh" && password === "ammu1234") {

        const token = jwt.sign(
            { user: "admin" },
            SECRET,
            { expiresIn: "1d" }
        );

        res.json({ success: true, token });

    } else {
        res.json({ success: false, message: "Invalid credentials" });
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.send("Logged out");
});

app.get("/check-auth", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
});

const tenantRoutes = require("./routes/tenants");
const paymentRoutes = require("./routes/payments");

function auth(req, res, next) {

    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).send("No token");
    }

    try {
        jwt.verify(token, SECRET);
        next();
    } catch (err) {
        res.status(401).send("Invalid token");
    }
}

app.use("/tenants", auth, tenantRoutes);
app.use("/payments", auth, paymentRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});