require("dotenv").config({ path: __dirname + "/.env" });
const express=require('express');
const app=express();
const cors = require("cors");
const path = require('path');
app.use(cors({
    origin: "http://localhost:5173",  // your frontend URL
    credentials: true,                // if you plan to send cookies
  }));


app.use(express.json())
 


const connectDB=require("./config/db");
const authRouter = require("./routes/authRoutes");
const userRouter= require("./routes/userRoutes");
const courseRouter=require("./routes/courseRoutes");
const adminRouter=require("./routes/adminRoutes");
const purchaseRouter=require("./routes/purchaseRoutes");
const publicRouter=require("./routes/publicRoutes");
const { globalErrorHandler } = require("./middlewares/globalErrorHandler");
const { AppError } = require("./utilities/appError");

connectDB();

app.use('/api/auth',authRouter)
app.use('/api/users',userRouter)
app.use('/api/courses',courseRouter)
app.use('/api/admin',adminRouter)
app.use('/api/purchases',purchaseRouter);
app.use('/api',publicRouter);

app.use(/^\/api\/.*/, (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl}`, 404));
  });


app.use(globalErrorHandler);


app.listen(3000);