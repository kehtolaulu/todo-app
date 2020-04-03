const { check, validationResult } = require("express-validator");

module.exports = (checks) => {
    return [...checks, (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({
                errors: errors.array()
            });
        }
        next();
    }];
};
