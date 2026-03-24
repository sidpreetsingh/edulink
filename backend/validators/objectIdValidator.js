const { z } = require("zod");

exports.objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"); //24 hex character long objectId as a string