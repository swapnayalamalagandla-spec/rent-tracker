const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(bodyParser.json());

app.use(session({
    secret: "rentapp",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        sameSite: "none"
    }
}));

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

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        req.session.user = { username: "admin" };
        res.json({ success: true });
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
    if (req.session.user) {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
}

app.use("/tenants",  tenantRoutes);
app.use("/payments", auth, paymentRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});