const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'var.env' });

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization; // "Bearer TOKEN"
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}
