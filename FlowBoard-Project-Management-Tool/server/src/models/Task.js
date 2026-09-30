import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({ title:{type:String,required:true,trim:true}, description:String, project:{type:mongoose.Schema.Types.ObjectId,ref:"Project",required:true}, assignee:{type:mongoose.Schema.Types.ObjectId,ref:"User",default:null}, status:{type:String,enum:["todo","progress","done"],default:"todo"}, priority:{type:String,enum:["Low","Medium","High"],default:"Medium"}, dueDate:Date, createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"} },{timestamps:true});
export default mongoose.model("Task",taskSchema);
