const { AppError } = require("../utilities/appError");


exports.validate=(schema,source="body")=>(req,res,next)=>{
    
    const data=req[source];

    const result=schema.safeParse(data);

    if (!result.success) {
        // Use Zod flatten to get field-specific errors
        const { fieldErrors } = result.error.flatten();
        const messages = Object.values(fieldErrors)
            .flat()
            .filter(Boolean); // flatten array of arrays and remove undefined
        throw new AppError(messages.join(", "), 400);
    }

    req[source]=result.data;
    next();
}