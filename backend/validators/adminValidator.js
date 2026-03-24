const { z } = require("zod");
const { objectId } = require("./objectIdValidator");

exports.userIdParam = z.object({
    userId: objectId
}).strict();

exports.purchIdParam = z.object({
    purchId: objectId
}).strict();

exports.changeRoleSchema = z.object({
    role: z.enum(["student", "teacher", "admin"])
}).strict();