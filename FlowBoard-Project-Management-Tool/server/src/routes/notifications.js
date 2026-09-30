import {Router} from "express";
import Notification from "../models/Notification.js";
const router=Router();
router.get("/",async(req,res,next)=>{try{res.json(await Notification.find({user:req.user.id}).sort({createdAt:-1}).limit(30))}catch(e){next(e)}});
router.patch("/:id/read",async(req,res,next)=>{try{const n=await Notification.findOneAndUpdate({_id:req.params.id,user:req.user.id},{read:true},{new:true});if(!n)return res.status(404).json({message:"Notification not found"});res.json(n)}catch(e){next(e)}});
export default router;
