const { Router } = require('express');
const router = Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config({ path: 'var.env' });

router.post(
    '',
    [
        check('username', 'Username must be 6 chars min').isLength({ min: 6 }),
        check('password', 'Password must be 6 chars min').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect data'
                });
            }
            const { username, password } = req.body;
            const candidate = await User.findOne({ username });
            if (candidate) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({ username, password: hashedPassword });
            await user.save();
            res.status(200).json({ message: 'User was created' });
        } catch (e) {
            res.status(500).json({ message: 'Something went wrong' });
        }
    }
);

module.exports = router;
