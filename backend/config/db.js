const mongoose=require("mongoose");

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database is connected!!");
    }catch(err){
        console.log("There is an error in connection:",err.message);
        process.exit(1);
    }
}

module.exports = connectDB;

