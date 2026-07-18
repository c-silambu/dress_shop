const r=require('express').Router();
const c=require('../controllers/authController');

r.post('/register',c.register);
r.post('/login',c.login);
r.post('/forgot-password',c.forgotPassword);
r.post('/reset-password/:token',c.resetPassword);

module.exports=r;
