const { Router } = require("express");
const { check } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const validate = require("../middleware/validation");

const router = Router();

router.post(
    "",
    validate([
        check("username", "Provide username").exists(),
        check("password", "Provide password").exists()
    ]),
    async (req, res) => {
        const { username, password } = req.body;
        let token = await authenticate(username, password);
        if (token) {
            res.json({ token });
        } else {
            res.status(400).json({ message: "Bad credentials" });
        }
    }
);

const authenticate = async (username, password) => {
    const user = await User.findOne({ username });
    const correctPassword = await bcrypt.compare(password, (user && user.password) || "");
    if (!correctPassword) return null;

    return jwt.sign(
        { userId: user.id, username: user.username },
        process.env.PRIVATE_KEY
        /*{ expiresIn: "1h" }*/
    );
};

module.exports = router;
