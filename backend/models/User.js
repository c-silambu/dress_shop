const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
  name:{type:String,required:true,trim:true},
  email:{type:String,unique:true,sparse:true,trim:true,lowercase:true},
  phone:{type:String,unique:true,sparse:true,trim:true},
  password:{type:String,select:false},
  avatar:{type:String,trim:true},
  authProvider:{type:String,enum:['local','google'],default:'local'},
  googleId:{type:String,unique:true,sparse:true,select:false},
  passwordResetToken:{type:String,select:false},
  passwordResetExpires:{type:Date,select:false}
},{timestamps:true});
module.exports=mongoose.model('User',userSchema);
