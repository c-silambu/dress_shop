const Order=require('../models/Order');
const Product=require('../models/Product');
const User=require('../models/User');

exports.create=async(req,res)=>{
  try{
    const order=await Order.create({...req.body,user:req.user._id});
    for(const item of req.body.items||[])
      await Product.findByIdAndUpdate(item.product,{$inc:{stock:-item.quantity}});
    res.status(201).json(order);
  }catch(e){res.status(500).json({message:e.message})}
};

exports.myOrders=async(req,res)=>
  res.json(await Order.find({user:req.user._id}).populate('items.product').sort('-createdAt'));

exports.cancelOrder=async(req,res)=>{
  try{
    if(!req.user) return res.status(401).json({message:'Not authorized. Please login again.'});
    const order=await Order.findById(req.params.id);
    if(!order) return res.status(404).json({message:'Order not found'});
    if(order.user.toString()!==req.user._id.toString())
      return res.status(403).json({message:'Not authorized to cancel this order'});
    const nonCancellable=['Shipped','Out for Delivery','Delivered','Cancelled'];
    if(nonCancellable.includes(order.orderStatus))
      return res.status(400).json({message:'Order cannot be cancelled at this stage'});
    order.orderStatus='Cancelled';
    order.deliveryStatus='Cancelled';
    order.cancelReason=req.body.reason||'Cancelled by user';
    order.cancelledByAdmin=false;
    await order.save();
    res.json(order);
  }catch(e){res.status(500).json({message:e.message})}
};

exports.adminOrders=async(req,res)=>
  res.json(await Order.find().populate('user','name email phone').sort('-createdAt'));

exports.updateStatus=async(req,res)=>{
  const status=req.body.orderStatus||req.body.status;
  const update={orderStatus:status,deliveryStatus:status};
  if(status==='Cancelled'){
    update.cancelReason=req.body.cancelReason||'Unfortunately out of stock. Cancelled by admin.';
    update.cancelledByAdmin=true;
  }
  res.json(await Order.findByIdAndUpdate(req.params.id,update,{new:true}));
};

exports.summary=async(req,res)=>{
  const start=new Date(); start.setHours(0,0,0,0);
  const orders=await Order.find();
  const today=orders.filter(o=>o.createdAt>=start);
  res.json({
    todayTotalOrders:today.length,
    totalIncome:orders.reduce((s,o)=>s+(o.amount||0),0),
    totalProducts:await Product.countDocuments(),
    totalUsers:await User.countDocuments(),
    pendingOrders:orders.filter(o=>!['Delivered','Cancelled'].includes(o.orderStatus)).length,
    deliveredOrders:orders.filter(o=>o.orderStatus==='Delivered').length,
    cancelledOrders:orders.filter(o=>o.orderStatus==='Cancelled').length,
  });
};
