const mongoose=require('mongoose');
module.exports=mongoose.model('Subscriber',new mongoose.Schema({email:{type:String,required:true,unique:true,lowercase:true,trim:true},active:{type:Boolean,default:true},subscribedAt:{type:Date,default:Date.now},unsubscribedAt:Date,lastEmailedAt:Date,lastEmailSubject:String},{timestamps:true}));
