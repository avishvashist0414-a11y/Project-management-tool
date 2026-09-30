import mongoose from "mongoose";
const schema = new mongoose.Schema({ task:{type:mongoose.Schema.Types.ObjectId,ref:"Task",required:true}, author:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}, text:{type:String,required:true,trim:true} },{timestamps:true});
export default mongoose.model("Comment",schema);
