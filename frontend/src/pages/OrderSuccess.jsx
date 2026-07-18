import React from "react";
import { Check, PackageCheck, ReceiptText } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";

export default function OrderSuccess(){
  const {state}=useLocation();
  if(!state?.orderId)return <Navigate to="/orders" replace/>;
  const shortId=String(state.orderId).slice(-8).toUpperCase();
  return <main className="order-success-page"><section className="order-success-card"><div className="order-success-icon"><Check/></div><p className="order-success-kicker">Order confirmed</p><h1>Order placed successfully!</h1><p className="order-success-copy">Thank you for shopping with Women’s Styles. Your order confirmation and bill will be sent to your registered email.</p><div className="order-success-details"><div><ReceiptText/><span><small>Order number</small><b>#{shortId}</b></span></div><div><PackageCheck/><span><small>{state.paymentStatus==="Paid"?"Amount paid":"Order total"}</small><b>₹{Number(state.amount||0).toLocaleString("en-IN")}</b></span></div></div><Link className="order-track-button" to="/orders"><PackageCheck/> Track Your Order</Link><Link className="order-continue-link" to="/dress">Continue shopping</Link></section></main>;
}
