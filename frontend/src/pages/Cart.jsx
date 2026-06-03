import React, { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api, { imgUrl } from "../api/api";

export default function Cart() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const loadCart = () => api.get("/cart").then((response) => setItems(response.data)).catch(() => setItems([]));

  useEffect(() => {
    loadCart();
  }, []);

  const total = items.reduce((sum, item) => {
    const productPrice = item.product?.discountPrice || item.product?.price || 0;
    return sum + productPrice * item.quantity;
  }, 0);

  const updateQuantity = async (id, quantity) => {
    await api.put(`/cart/${id}`, { quantity: Math.max(1, quantity) });
    loadCart();
  };

  const removeItem = async (id) => {
    await api.delete(`/cart/${id}`);
    loadCart();
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-blue-600">Shopping Bag</p>
          <h1 className="text-4xl font-black text-blue-950 md:text-5xl">Your Cart</h1>
        </div>
        <ShoppingBag className="h-12 w-12 text-blue-600" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item._id} className="grid gap-4 rounded-[2rem] border border-blue-100 bg-white p-4 shadow-xl shadow-blue-950/5 md:grid-cols-[130px_1fr_auto] md:items-center">
              <img src={imgUrl(item.product?.images?.[0])} alt={item.product?.name} className="h-36 w-full rounded-3xl object-cover md:w-32" />
              <div>
                <h3 className="text-2xl font-black text-slate-950">{item.product?.name}</h3>
                <p className="mt-1 font-bold text-blue-700">₹{item.product?.discountPrice || item.product?.price}</p>
                <p className="text-sm text-slate-500">{item.product?.subCategory}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="rounded-full bg-blue-50 p-3 text-blue-700" onClick={() => updateQuantity(item._id, item.quantity - 1)}><Minus className="h-4 w-4" /></button>
                <span className="min-w-8 text-center text-xl font-black">{item.quantity}</span>
                <button className="rounded-full bg-blue-50 p-3 text-blue-700" onClick={() => updateQuantity(item._id, item.quantity + 1)}><Plus className="h-4 w-4" /></button>
                <button onClick={() => removeItem(item._id)} className="rounded-full bg-red-50 p-3 text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-[2rem] border border-blue-100 bg-white p-6 shadow-2xl shadow-blue-950/10">
          <h2 className="text-2xl font-black text-slate-950">Order Summary</h2>
          <div className="mt-5 space-y-3 text-slate-600">
            <div className="flex justify-between"><span>Items</span><b>{items.length}</b></div>
            <div className="flex justify-between"><span>Subtotal</span><b>₹{total}</b></div>
            <div className="flex justify-between"><span>Delivery</span><b className="text-green-600">Free</b></div>
          </div>
          <div className="mt-5 border-t pt-5">
            <div className="flex justify-between text-2xl font-black text-blue-950"><span>Total</span><span>₹{total}</span></div>
          </div>
          <button onClick={() => navigate("/checkout")} className="btn-primary mt-6 w-full">Proceed to Checkout</button>
        </div>
      </div>
    </section>
  );
}
