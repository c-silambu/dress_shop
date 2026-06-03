const Cart=require('../models/Cart');
exports.add=async(req,res)=>{const item=await Cart.findOneAndUpdate({user:req.user._id,product:req.body.product},{...req.body,user:req.user._id},{upsert:true,new:true});res.status(201).json(item)};
exports.list=async(req,res)=>res.json(await Cart.find({user:req.user._id}).populate('product'));
exports.update=async(req,res)=>res.json(await Cart.findOneAndUpdate({_id:req.params.id,user:req.user._id},req.body,{new:true}));
exports.remove=async(req,res)=>{await Cart.findOneAndDelete({_id:req.params.id,user:req.user._id});res.json({message:'Removed'})};
