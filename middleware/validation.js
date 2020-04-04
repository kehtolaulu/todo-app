const { validationResult } = require("express-validator");

module.exports = (checks) => {
    const summary = (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        next();
    };
    return [...checks, summary];
};
