const mongoose=require("mongoose");
const schema=mongoose.Schema;
const objectid=schema.ObjectId;

const PurchaseSchema=new schema({
    userId:{type:objectid,required:true,ref:'users'},
    courseId:{type:objectid,required:true,ref:'courses'},
    price:{type:Number},
    status: {
        type : String, 
        enum: ["active", "expired", "refunded", "completed"], 
        default: "active"
    }
},{timestamps:true})

PurchaseSchema.index({userId,courseId},{unique:true})//this ensures that we still prevent duplicates in race conditions as it 
                                                     // does faster lookup since it is indexed!!!

const PurchaseModel=mongoose.model('purchases',PurchaseSchema)

module.exports=PurchaseModel