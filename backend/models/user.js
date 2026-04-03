const mongoose=require("mongoose");
const schema=mongoose.Schema;
const objectid=schema.ObjectId;

const UserSchema=new schema({
    email:{type:String,unique:true,required:true,trim:true,lowercase:true},
    name: { type: String, required: true, trim: true, minlength: 2 },
    password:{type:String,required:true},
    role: {type:String,enum:["admin","teacher","student"],default:"student"},
    profileImage: { type: String, default: null },
    purchasedCoursesId: [{type:objectid,ref:'courses'}],
    createdCoursesId: [{type:objectid,ref:'courses'}],
},{timestamps:true})

const UserModel=mongoose.model('users',UserSchema);

module.exports=UserModel;