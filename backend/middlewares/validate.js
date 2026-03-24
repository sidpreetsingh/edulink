const { AppError } = require("../utilities/appError");


exports.validate=(schema,source="body")=>(req,res,next)=>{
    
    const data=req[source];

    const result=schema.safeParse(data);

    if(!result.success){
        const message=result.error.errors.map(e=>e.message).join(", ");
        throw new AppError(message, 400);
    }

    req[source]=result.data;
    next();
}