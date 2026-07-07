const Order=require('../models/Order');
const Product=require('../models/Product');
const User=require('../models/User');
const mongoose=require('mongoose');

const restockOrderItems=async(items=[])=>{
  for(const item of items){
    const productId=item.product?.toString();
    const quantity=Number(item.quantity||0);
    if(!productId||!mongoose.Types.ObjectId.isValid(productId)||quantity<=0) continue;
    await Product.findByIdAndUpdate(productId,{$inc:{stock:quantity}});
  }
};

const findUserOrderByDisplayId=async(rawId,userId)=>{
  const id=String(rawId||'').replace(/^#/,'').trim().toLowerCase();
  if(!id) return null;

  const orders=await Order.find({user:userId}).sort('-createdAt');
  const exact=orders.find((order)=>order._id.toString().toLowerCase()===id);
  if(exact) return exact;
  if(id.length<6) return null;

  const matches=orders.filter((order)=>{
    const fullId=order._id.toString().toLowerCase();
    return fullId.endsWith(id)||fullId.startsWith(id);
  });
  return matches.length===1?matches[0]:null;
};

exports.create=async(req,res)=>{
  try{
    const order=await Order.create({...req.body,user:req.user._id});
    for(const item of req.body.items||[])
      await Product.findByIdAndUpdate(item.product,{$inc:{stock:-item.quantity}});
    res.status(201).json(order);
  }catch(e){res.status(500).json({message:e.message})}
};

exports.myOrders=async(req,res)=>{
  try{
    const orders=await Order.find({user:req.user._id}).lean().sort('-createdAt');
    // convert _id and user ObjectIds to strings for clean JSON
    const result=orders.map(o=>({
      ...o,
      _id:o._id.toString(),
      user:o.user?.toString(),
      items:(o.items||[]).map(item=>({
        ...item,
        _id:item._id?.toString(),
        product:item.product?.toString(),
      })),
    }));
    res.json(result);
  }catch(e){res.status(500).json({message:e.message})}
};

exports.cancelOrder=async(req,res)=>{
  try{
    if(!req.user?._id) return res.status(401).json({message:'Not authorized. Please login again.'});
    const requestedId=String(req.params.id||'').replace(/^#/,'').trim();
    let order=null;

    if(mongoose.Types.ObjectId.isValid(requestedId)){
      order=await Order.findById(requestedId);
    }

    if(order&&order.user.toString()!==req.user._id.toString())
      return res.status(403).json({message:'Not authorized to cancel this order'});

    if(!order){
      order=await findUserOrderByDisplayId(requestedId,req.user._id);
    }

    if(!order)
      return res.status(404).json({message:'Order not found. Please refresh your orders and try again.'});

    const nonCancellable=['Shipped','Out for Delivery','Delivered','Cancelled'];
    if(nonCancellable.includes(order.orderStatus))
      return res.status(400).json({message:'This order cannot be cancelled at this stage'});
    order.orderStatus='Cancelled';
    order.deliveryStatus='Cancelled';
    order.cancelReason=req.body.reason||'Cancelled by user';
    order.cancelledByAdmin=false;
    await order.save();
    try{
      await restockOrderItems(order.items);
    }catch(restockError){
      console.error('restockOrderItems error:',restockError.message);
    }
    res.json(order);
  }catch(e){
    console.error('cancelOrder error:',e.message);
    res.status(500).json({message:e.message});
  }
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
