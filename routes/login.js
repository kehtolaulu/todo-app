const { Router } = require('express');
const router = Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config({ path: 'var.env' });

router.post(
    '',
    [
        check('username', 'Provide username').exists(),
        check('password', 'Provide password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(401).json({
                    errors: errors.array(),
                    message: 'Incorrect login data'
                });
            }
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            const correctPassword = await bcrypt.compare(password, user.password);
            if (!correctPassword) {
                return res.status(401).json({ message: 'Incorrect password' });
            }
            const token = jwt.sign(
                { userId: user.id },
                process.env.PRIVATE_KEY,
                { expiresIn: '1h' }
            );
            res.json({ token, userId: user.id });
        } catch (e) {
            res.status(401).json({ message: 'Something went wrong' });
        }
    });

module.exports = router;
