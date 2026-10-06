const express = require("express");

const router = express.Router();

const { registerUser, loginUser } = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

//Protected route
router.get("/profile", protect, (req, res) => {
    res.json({
        message: "You can access this protected route",
        user: req.user
    });
});

router.get("/admin-test", protect, admin, (req, res) => {
    res.json({
        message: "Welcome Admin! You have admin access."
    });
});


module.exports = router;
