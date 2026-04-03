import { ZodError } from "zod";

export const globalErrorHandler=(err,req,res,next)=>{
    
    if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: err.errors.map(e => e.message), // send array of validation errors
        });
      }

      if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
          success: false,
          message: messages,
        });
      }
    
    const message=err.message || "Internal Server Error!!";
    const statusCode=err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        status: err.status || "Error",
        message: message,
        stack: err.stack?.split('\n')
    })
}