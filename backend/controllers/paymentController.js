const Razorpay=require('razorpay');
const crypto=require('crypto');
const jwt=require('jsonwebtoken');

const configured=()=>process.env.RAZORPAY_KEY_ID&&process.env.RAZORPAY_KEY_SECRET;

exports.createOrder=async(req,res)=>{
  try{
    if(!configured()) return res.status(503).json({message:'Razorpay is not configured'});
    const amount=Number(req.body.amount);
    if(!Number.isFinite(amount)||amount<=0) return res.status(400).json({message:'Invalid payment amount'});
    const instance=new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET});
    const order=await instance.orders.create({amount:Math.round(amount*100),currency:'INR',receipt:`ws_${Date.now()}`});
    res.json({...order,keyId:process.env.RAZORPAY_KEY_ID});
  }catch(e){res.status(502).json({message:e.error?.description||e.message||'Unable to start payment'})}
};

exports.verify=async(req,res)=>{
  if(!configured()) return res.status(503).json({message:'Razorpay is not configured'});
  const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
  if(!razorpay_order_id||!razorpay_payment_id||!razorpay_signature) return res.status(400).json({message:'Incomplete payment response'});
  const sign=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
  const verified=sign.length===razorpay_signature.length&&crypto.timingSafeEqual(Buffer.from(sign),Buffer.from(razorpay_signature));
  if(!verified) return res.status(400).json({message:'Payment verification failed'});
  try{
    const instance=new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET});
    const paymentOrder=await instance.orders.fetch(razorpay_order_id);
    if(paymentOrder.status!=='paid') return res.status(400).json({message:'Payment is not complete'});
    const paymentProof=jwt.sign({paymentId:razorpay_payment_id,razorpayOrderId:razorpay_order_id,amount:paymentOrder.amount},process.env.JWT_SECRET,{expiresIn:'15m'});
    res.json({verified:true,paymentId:razorpay_payment_id,orderId:razorpay_order_id,paymentProof});
  }catch(e){res.status(502).json({message:'Unable to confirm payment with Razorpay'})}
};
