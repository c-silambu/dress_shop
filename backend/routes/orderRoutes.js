const r=require('express').Router();
const c=require('../controllers/orderController');
const {protect}=require('../middleware/auth');

r.post('/',protect,c.create);
r.get('/my-orders',protect,c.myOrders);
r.put('/:id/cancel',protect,c.cancelOrder);

module.exports=r;
