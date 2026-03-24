const { AppError } = require("../utilities/appError");
const { asyncWrapper } = require("./asyncWrapper");

exports.authorize = (...allowedRoles) =>
    asyncWrapper(async (req, res, next) => {
        if (!req.user) {
            throw new AppError("Not authenticated", 401);
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new AppError("Access Denied!! You dont have permission to access this!!", 403);
        }

        next();
    });