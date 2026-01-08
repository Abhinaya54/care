const router = require("express").Router();
const { login, signup } = require("../controllers/auth.controller");

// Health check route
router.get("/", (req, res) => res.json({ status: "ok", message: "Auth API is working!" }));

// Public auth routes
router.post("/login", login);
router.post("/signup", signup);
// Alias/register route to match requested API
router.post("/register", signup);

module.exports = router;
