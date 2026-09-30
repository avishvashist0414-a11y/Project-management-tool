import {Router} from "express";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import Comment from "../models/Comment.js";
import Notification from "../models/Notification.js";
import {io} from "../index.js";
const router=Router();
async function projectForTask(task,uid){return Project.findOne({_id:task.project,members:uid})}
router.get("/project/:projectId",async(req,res,next)=>{try{const p=await Project.findOne({_id:req.params.projectId,members:req.user.id});if(!p)return res.status(404).json({message:"Project not found"});res.json(await Task.find({project:p._id}).populate("assignee","name email").populate("createdBy","name").sort({createdAt:-1}))}catch(e){next(e)}});
router.post("/project/:projectId",async(req,res,next)=>{try{const p=await Project.findOne({_id:req.params.projectId,members:req.user.id});if(!p)return res.status(404).json({message:"Project not found"});const t=await Task.create({...req.body,project:p._id,createdBy:req.user.id});const result=await t.populate("assignee","name email");if(t.assignee){await Notification.create({user:t.assignee,project:p._id,task:t._id,message:`You were assigned “${t.title}”`});io.to(`user:${t.assignee}`).emit("notification")}io.to(`project:${p._id}`).emit("board:update");res.status(201).json(result)}catch(e){next(e)}});
router.patch("/:id",async(req,res,next)=>{try{const t=await Task.findById(req.params.id);if(!t||!await projectForTask(t,req.user.id))return res.status(404).json({message:"Task not found"});const allowed=["title","description","status","priority","dueDate","assignee"];for(const k of allowed)if(req.body[k]!==undefined)t[k]=req.body[k]||null;await t.save();io.to(`project:${t.project}`).emit("board:update");res.json(await t.populate("assignee","name email"))}catch(e){next(e)}});
router.delete("/:id",async(req,res,next)=>{try{const t=await Task.findById(req.params.id);if(!t||!await projectForTask(t,req.user.id))return res.status(404).json({message:"Task not found"});await Comment.deleteMany({task:t._id});await t.deleteOne();io.to(`project:${t.project}`).emit("board:update");res.json({message:"Task deleted"})}catch(e){next(e)}});
router.get("/:id/comments",async(req,res,next)=>{try{const t=await Task.findById(req.params.id);if(!t||!await projectForTask(t,req.user.id))return res.status(404).json({message:"Task not found"});res.json(await Comment.find({task:t._id}).populate("author","name").sort({createdAt:1}))}catch(e){next(e)}});
router.post("/:id/comments",async(req,res,next)=>{try{const t=await Task.findById(req.params.id);if(!t||!await projectForTask(t,req.user.id))return res.status(404).json({message:"Task not found"});if(!req.body.text?.trim())return res.status(400).json({message:"Comment cannot be empty"});const c=await Comment.create({task:t._id,author:req.user.id,text:req.body.text});io.to(`project:${t.project}`).emit("comment:new");res.status(201).json(await c.populate("author","name"))}catch(e){next(e)}});
export default router;
