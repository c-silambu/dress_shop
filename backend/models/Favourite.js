const mongoose=require('mongoose');
const favSchema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},product:{type:mongoose.Schema.Types.ObjectId,ref:'Product'}},{timestamps:true});
favSchema.index({user:1,product:1},{unique:true});
module.exports=mongoose.model('Favourite',favSchema);
