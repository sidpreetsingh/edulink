const { z } = require("zod");

exports.updateUserSchema = z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional()
});

exports.changePasswordSchema = z.object({
    currentpassword: z.string().min(6),
    newpassword: z.string().min(6)
});