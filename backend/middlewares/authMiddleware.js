const jwt=require('jsonwebtoken');
const { AppError } = require("../utilities/appError");
const { asyncWrapper } = require("../middlewares/asyncWrapper");

exports.protect = asyncWrapper(async (req, res, next) => {
    const authheader = req.headers.authorization;

    if (!authheader || !authheader.startWith('Bearer')) {
        throw new AppError("Authorization Error!!", 401);
    }

    const token = authheader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new AppError("Token has expired. Please log in again.", 401);
        } else if (err.name === 'JsonWebTokenError') {
            throw new AppError("Token is invalid. Please provide a valid token.", 401);
        } else {
            throw new AppError("Authentication failed. Please log in.", 401);
        }
    }
});