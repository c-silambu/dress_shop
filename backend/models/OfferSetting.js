const mongoose=require('mongoose');
module.exports=mongoose.model('OfferSetting',new mongoose.Schema({enabled:{type:Boolean,default:false},label:String,message:String,couponCode:{type:String,uppercase:true},buttonText:{type:String,default:'Shop Now'},buttonUrl:{type:String,default:'/dress'},startDate:Date,endDate:Date},{timestamps:true}));
