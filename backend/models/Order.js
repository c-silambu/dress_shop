const mongoose=require('mongoose');
const orderSchema=new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  items:[{product:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},name:String,price:Number,quantity:Number,size:String,color:String,image:String}],
  address:{fullName:String,phone:String,alternatePhone:String,address:String,city:String,district:String,state:String,pincode:String},
  amount:Number,
  paymentMethod:{type:String,enum:['Razorpay','Cash on Delivery']},
  paymentStatus:{type:String,default:'Pending'},
  razorpayPaymentId:String,
  orderStatus:{type:String,default:'Order Placed'},
  deliveryStatus:{type:String,default:'Order Placed'},
  cancelReason:{type:String,default:''},
  cancelledByAdmin:{type:Boolean,default:false},
  confirmationEmailSentAt:Date,
  cancellationEmailSentAt:Date,
},{timestamps:true});
module.exports=mongoose.model('Order',orderSchema);
