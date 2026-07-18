const mongoose=require('mongoose');
const schema=new mongoose.Schema({name:{type:String,required:true,unique:true,trim:true},slug:{type:String,unique:true,lowercase:true},description:String,image:String,parent:String,active:{type:Boolean,default:true}},{timestamps:true});
schema.pre('validate',function(){if(!this.slug&&this.name)this.slug=this.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')});
module.exports=mongoose.model('Category',schema);
