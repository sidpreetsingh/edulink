require("dotenv").config({ path: __dirname + "/.env" });
const express=require('express');
const app=express();
app.use(express.json())

const connectDB=require("./config/db");
const authRouter = require("./routes/authRoutes");
const userRouter= require("./routes/userRoutes");
const courseRouter=require("./routes/courseRoutes");
const adminRouter=require("./routes/adminRoutes");
const purchaseRouter=require("./routes/purchaseRoutes");
const publicRouter=require("./routes/publicRoutes");
const { globalErrorHandler } = require("./middlewares/globalErrorHandler");

connectDB();

app.use('/api/auth',authRouter)
app.use('/api/users',userRouter)
app.use('/api/courses',courseRouter)
app.use('/api/admin',adminRouter)
app.use('/api/purchases',purchaseRouter);
app.use('/api',publicRouter);


app.use(globalErrorHandler);


app.listen(3000);