import mongoose from "mongoose";
const schema = new mongoose.Schema({ user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}, message:{type:String,required:true}, project:{type:mongoose.Schema.Types.ObjectId,ref:"Project"}, task:{type:mongoose.Schema.Types.ObjectId,ref:"Task"}, read:{type:Boolean,default:false} },{timestamps:true});
export default mongoose.model("Notification",schema);
