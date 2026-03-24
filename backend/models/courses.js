const mongoose=require('mongoose');
const schema=mongoose.Schema;
const objectid=schema.ObjectId;

const CourseSchema=new schema({
    title:{type:String,required:true},
    description:String,
    price:{type:Number, required:true},
    image:String,
    teacherId:{type:objectid, required:true,ref:'users'},
    published:{type:Boolean, default:false}
},{timestamps:true})

const CourseModel=mongoose.model('courses',CourseSchema);

module.exports= CourseModel;