const jwt = require('jsonwebtoken');
const User = require('../models/User');
exports.protect = async (req,res,next)=>{
  const header=req.headers.authorization||''; const token=header.startsWith('Bearer ')?header.split(' ')[1]:null;
  if(!token) return res.status(401).json({message:'Not authorized'});
  try{ const decoded=jwt.verify(token,process.env.JWT_SECRET); req.user=await User.findById(decoded.id).select('-password'); next(); }
  catch(e){ res.status(401).json({message:'Invalid token'}); }
};
exports.adminProtect=(req,res,next)=>{
  const header=req.headers.authorization||''; const token=header.startsWith('Bearer ')?header.split(' ')[1]:null;
  if(!token) return res.status(401).json({message:'Admin not authorized'});
  try{ const d=jwt.verify(token,process.env.JWT_SECRET); if(!d.admin) throw new Error(); req.admin=d; next(); }
  catch(e){ res.status(401).json({message:'Invalid admin token'}); }
};
