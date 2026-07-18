const Order=require('../models/Order');
const Product=require('../models/Product');
const User=require('../models/User');
const Coupon=require('../models/Coupon');
const Subscriber=require('../models/Subscriber');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const {configured:mailConfigured,sendMail}=require('../utils/mailer');

const escapeHtml=(value)=>String(value??'').replace(/[&<>"']/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const money=(value)=>`₹${Number(value||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const displayId=(order)=>order._id.toString().slice(-8).toUpperCase();
const couponEligibility=async(coupon,subtotal,user)=>{
  const now=new Date();
  if(!coupon.active)return {eligible:false,reason:'Coupon is inactive'};
  if(coupon.startDate&&coupon.startDate>now)return {eligible:false,reason:`Starts on ${coupon.startDate.toLocaleDateString('en-IN')}`};
  if(coupon.expiryDate&&coupon.expiryDate<now)return {eligible:false,reason:'Coupon has expired'};
  if(coupon.usageLimit>0&&coupon.usedCount>=coupon.usageLimit)return {eligible:false,reason:'Usage limit reached'};
  if(subtotal<coupon.minimumOrder)return {eligible:false,reason:`Add ${money(coupon.minimumOrder-subtotal)} more to use this coupon`};
  if(coupon.firstOrderOnly&&await Order.exists({user:user._id,orderStatus:{$ne:'Cancelled'}}))return {eligible:false,reason:'Valid only on your first order'};
  if(coupon.subscriberOnly&&!await Subscriber.exists({email:user.email,active:true}))return {eligible:false,reason:'Available only for newsletter subscribers'};
  if(coupon.perUserLimit>0&&await Order.countDocuments({user:user._id,couponCode:coupon.code,orderStatus:{$ne:'Cancelled'}})>=coupon.perUserLimit)return {eligible:false,reason:'You have already used this coupon'};
  let discount=coupon.type==='percentage'?subtotal*(coupon.value/100):coupon.value;
  if(coupon.maximumDiscount>0)discount=Math.min(discount,coupon.maximumDiscount);
  discount=Math.min(subtotal,Math.round(discount*100)/100);
  return {eligible:true,reason:'Eligible for this order',discount};
};

exports.availableCoupons=async(req,res)=>{
  try{const subtotal=Math.max(0,Number(req.query.subtotal||0));const coupons=await Coupon.find({active:true}).sort('-createdAt');const result=[];for(const coupon of coupons){const eligibility=await couponEligibility(coupon,subtotal,req.user);result.push({_id:coupon._id,code:coupon.code,description:coupon.description,type:coupon.type,value:coupon.value,minimumOrder:coupon.minimumOrder,maximumDiscount:coupon.maximumDiscount,expiryDate:coupon.expiryDate,...eligibility})}res.json(result)}catch(error){res.status(500).json({message:'Unable to load coupons'})}
};
const sendOrderConfirmation=async(order,user)=>{
  if(!mailConfigured()||!user?.email)return false;
  const rows=order.items.map(item=>`<tr><td style="padding:10px;border-bottom:1px solid #eee">${escapeHtml(item.name)}${item.size?`<br><small>Size: ${escapeHtml(item.size)}</small>`:''}${item.color?`<br><small>Colour: ${escapeHtml(item.color)}</small>`:''}</td><td style="padding:10px;text-align:center;border-bottom:1px solid #eee">${item.quantity}</td><td style="padding:10px;text-align:right;border-bottom:1px solid #eee">${money(item.price*item.quantity)}</td></tr>`).join('');
  await sendMail({to:user.email,subject:`Order confirmed #${displayId(order)} | Women's Styles`,text:`Thank you for your order. Order #${displayId(order)}. Total: ${money(order.amount)}. Payment: ${order.paymentMethod} (${order.paymentStatus}).`,html:`<div style="max-width:650px;margin:auto;font-family:Arial,sans-serif;color:#2a211b;line-height:1.6"><h1 style="color:#9b6d25">Thank you for your order!</h1><p>Hi ${escapeHtml(user.name||order.address?.fullName||'Customer')}, your order <b>#${displayId(order)}</b> has been placed successfully.</p><table style="width:100%;border-collapse:collapse"><thead><tr><th style="padding:10px;text-align:left;background:#f5f1ea">Item</th><th style="padding:10px;background:#f5f1ea">Qty</th><th style="padding:10px;text-align:right;background:#f5f1ea">Amount</th></tr></thead><tbody>${rows}</tbody><tfoot><tr><td colspan="2" style="padding:14px;text-align:right"><b>Total</b></td><td style="padding:14px;text-align:right"><b>${money(order.amount)}</b></td></tr></tfoot></table><p><b>Payment:</b> ${escapeHtml(order.paymentMethod)} — ${escapeHtml(order.paymentStatus)}</p><p><b>Delivery address:</b><br>${escapeHtml(order.address?.fullName)}<br>${escapeHtml(order.address?.address)}, ${escapeHtml(order.address?.city)}, ${escapeHtml(order.address?.district)}<br>${escapeHtml(order.address?.state)} - ${escapeHtml(order.address?.pincode)}</p><p style="color:#777;font-size:12px">This email is your order bill and confirmation.</p></div>`});
  return true;
};
const sendCancellationConfirmation=async(order,user)=>{
  if(!mailConfigured()||!user?.email)return false;
  const paid=order.paymentStatus==='Paid';
  const refund=paid?`Your refund of ${money(order.amount)} will be credited to your original payment method within 7 working days.`:'No online payment was collected for this order, so no refund is required.';
  await sendMail({to:user.email,subject:`Cancellation confirmed #${displayId(order)} | Women's Styles`,text:`Your order #${displayId(order)} cancellation has been accepted. ${refund}`,html:`<div style="max-width:620px;margin:auto;font-family:Arial,sans-serif;color:#2a211b;line-height:1.7"><h1 style="color:#9b6d25">Cancellation confirmed</h1><p>Hi ${escapeHtml(user.name||'Customer')}, your cancellation for order <b>#${displayId(order)}</b> has been accepted by Women’s Styles.</p><div style="background:#f5f1ea;padding:18px;border-left:4px solid #9b6d25"><b>${escapeHtml(refund)}</b></div><p><b>Cancellation reason:</b> ${escapeHtml(order.cancelReason||'Order cancelled')}</p><p>If you need help, please reply to this email.</p></div>`});
  return true;
};

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
    if(!Array.isArray(req.body.items)||!req.body.items.length)return res.status(400).json({message:'Your cart is empty'});
    const items=[];let subtotal=0;
    for(const raw of req.body.items){const product=await Product.findById(raw.product);const quantity=Math.max(1,Number(raw.quantity||1));if(!product||product.status!=='Active')return res.status(400).json({message:'A product is unavailable'});if(product.stock<quantity)return res.status(400).json({message:`Only ${product.stock} of ${product.name} available`});if(product.sizes.length&&!product.sizes.includes(raw.size))return res.status(400).json({message:`Select a valid size for ${product.name}`});if(product.colors.length&&!product.colors.includes(raw.color))return res.status(400).json({message:`Select a valid colour for ${product.name}`});const price=Number(product.discountPrice||product.price);subtotal+=price*quantity;items.push({product:product._id,name:product.name,price,quantity,size:raw.size,color:raw.color,image:product.images?.[0]})}
    let couponCode='',discount=0;
    if(req.body.couponCode){const coupon=await Coupon.findOne({code:String(req.body.couponCode).trim().toUpperCase()});if(!coupon)return res.status(400).json({message:'Coupon not found'});const eligibility=await couponEligibility(coupon,subtotal,req.user);if(!eligibility.eligible)return res.status(400).json({message:eligibility.reason});couponCode=coupon.code;discount=eligibility.discount}
    const amount=Math.max(0,subtotal-discount);
    let paymentStatus='Pending';
    let razorpayPaymentId;
    if(req.body.paymentMethod==='Razorpay'){
      try{
        const proof=jwt.verify(String(req.body.paymentProof||''),process.env.JWT_SECRET);
        const existingOrder=await Order.findOne({user:req.user._id,razorpayPaymentId:proof.paymentId});
        if(existingOrder)return res.json(existingOrder);
        if(Number(proof.amount)!==Math.round(amount*100)) return res.status(400).json({message:'Paid amount does not match order total'});
        paymentStatus='Paid';
        razorpayPaymentId=proof.paymentId;
      }catch(error){return res.status(400).json({message:'Valid Razorpay payment confirmation is required'})}
    }
    const order=await Order.create({...req.body,items,subtotal,discount,couponCode,amount,paymentStatus,razorpayPaymentId,user:req.user._id});
    for(const item of items) await Product.findOneAndUpdate({_id:item.product,stock:{$gte:item.quantity}},{$inc:{stock:-item.quantity,soldCount:item.quantity}});
    if(couponCode)await Coupon.updateOne({code:couponCode},{$inc:{usedCount:1}});
    try{if(await sendOrderConfirmation(order,req.user)){order.confirmationEmailSentAt=new Date();await order.save()}}catch(mailError){console.error('Order confirmation email failed:',mailError.message)}
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

    const nonCancellable=['Shipped','Out for Delivery','Delivered','Cancelled','Cancellation Requested'];
    if(nonCancellable.includes(order.orderStatus))
      return res.status(400).json({message:'This order cannot be cancelled at this stage'});
    order.orderStatus='Cancellation Requested';
    order.deliveryStatus='Cancellation Requested';
    order.cancelReason=req.body.reason||'Cancelled by user';
    order.cancelledByAdmin=false;
    await order.save();
    res.json(order);
  }catch(e){
    console.error('cancelOrder error:',e.message);
    res.status(500).json({message:e.message});
  }
};

exports.adminOrders=async(req,res)=>
  res.json(await Order.find().populate('user','name email phone').sort('-createdAt'));

exports.updateStatus=async(req,res)=>{
  try{
    const status=req.body.orderStatus||req.body.status;
    const order=await Order.findById(req.params.id).populate('user','name email phone');
    if(!order)return res.status(404).json({message:'Order not found'});
    const wasCancelled=order.orderStatus==='Cancelled';
    order.orderStatus=status;order.deliveryStatus=status;
    if(status==='Cancelled'){
      order.cancelReason=req.body.cancelReason||order.cancelReason||'Cancellation accepted by admin.';
      order.cancelledByAdmin=true;
      if(!wasCancelled){try{await restockOrderItems(order.items)}catch(error){console.error('Admin cancellation restock failed:',error.message)}}
    }
    await order.save();
    if(status==='Cancelled'&&!wasCancelled&&!order.cancellationEmailSentAt){
      try{if(await sendCancellationConfirmation(order,order.user)){order.cancellationEmailSentAt=new Date();await order.save()}}catch(mailError){console.error('Cancellation email failed:',mailError.message)}
    }
    res.json(order);
  }catch(error){res.status(500).json({message:error.message})}
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
