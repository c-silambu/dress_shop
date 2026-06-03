const mongoose=require('mongoose');
const productSchema=new mongoose.Schema({name:{type:String,required:true},mainCategory:{type:String,enum:['Women’s Dress','Jewellery'],required:true},subCategory:String,price:{type:Number,required:true},discountPrice:Number,about:String,description:String,sizes:[String],colors:[String],stock:{type:Number,default:0},images:[String],status:{type:String,enum:['Active','Inactive'],default:'Active'}},{timestamps:true});
module.exports=mongoose.model('Product',productSchema);
