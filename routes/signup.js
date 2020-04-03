const { Router } = require("express");
const router = Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config({ path: "var.env" });
const validate = require("../middleware/validation");

router.post(
    "",
    validate([
        check("username", "Username must be 6 chars min").isLength({ min: 6 }),
        check("password", "Password must be 6 chars min").isLength({ min: 6 })
    ]),
    async (req, res) => {
        const { username, password } = req.body;
        const candidate = await User.findOne({ username });
        if (candidate) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(200).json({ message: "User was created" });
    }
);

module.exports = router;
