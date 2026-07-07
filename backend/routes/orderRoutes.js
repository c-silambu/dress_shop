const r=require('express').Router();
const c=require('../controllers/orderController');
const {protect}=require('../middleware/auth');

r.post('/',protect,c.create);
r.get('/my-orders',protect,c.myOrders);
r.get('/route-check',(req,res)=>res.json({ordersRoute:'ok',cancelRoute:true}));
r.put('/:id/cancel',protect,c.cancelOrder);
r.patch('/:id/cancel',protect,c.cancelOrder);
r.put('/cancel/:id',protect,c.cancelOrder);

module.exports=r;
