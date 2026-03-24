const { z } = require("zod");
const { objectId } = require("./objectIdValidator");

exports.courseIdParam = z.object({
    courseId: objectId
}).strict();