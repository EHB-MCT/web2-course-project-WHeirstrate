const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decode = jwt.verify(token, 'AnA.R0s()'); // secret value to confirm -> has to be the same as authController.js secret value

        req.user = decode;
        next();

    } catch (err) {
        res.json({
            message: "Authentication failed!"
        });
    }
};

module.exports = authenticate;