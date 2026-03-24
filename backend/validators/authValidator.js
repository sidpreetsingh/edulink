const { z } = require("zod");

exports.signupSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters")
}).strict();

exports.signinSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password is required")
}).strict();