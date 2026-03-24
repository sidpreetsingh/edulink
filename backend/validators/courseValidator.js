const { z } = require("zod");
const { objectId } = require("./objectIdValidator");

exports.createCourseSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    price: z.coerce.number().positive(),
    image: z.string().url()
}).strict();

exports.updateCourseSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    price: z.coerce.number().positive().optional()
}).strict();

exports.courseIdParam = z.object({
    courseId: objectId
});