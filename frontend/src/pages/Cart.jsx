import React, { useEffect, useState } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api, { imgUrl } from "../api/api";

export default function Cart() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const loadCart = () => api.get("/cart").then((r) => setItems(r.data)).catch(() => setItems([]));
  useEffect(() => { loadCart(); }, []);

  const total = items.reduce((sum, item) => sum + (item.product?.discountPrice || item.product?.price || 0) * item.quantity, 0);
  const updateQuantity = async (id, qty) => { await api.put(`/cart/${id}`, { quantity: Math.max(1, qty) }); loadCart(); };
  const removeItem = async (id) => { await api.delete(`/cart/${id}`); loadCart(); };

  return (
    <section className="min-h-screen bg-slate-50 pb-24 md:pb-10">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-5 md:py-8">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="rounded-2xl bg-blue-600 p-3 text-white">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 md:text-3xl">Shopping Cart</h1>
            <p className="text-xs text-slate-500">{items.length} item{items.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-5 md:pt-8">
        {!items.length ? (
          <div className="mt-16 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-300">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <p className="mt-4 text-lg font-black text-slate-700">Your cart is empty</p>
            <button onClick={() => navigate("/dress")} className="mt-4 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white">Start Shopping</button>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
            {/* Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item._id} className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200/80 md:gap-4 md:p-4">
                  <img src={imgUrl(item.product?.images?.[0])} alt={item.product?.name} className="h-20 w-20 flex-shrink-0 rounded-xl object-cover md:h-28 md:w-28 md:rounded-2xl" />
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">{item.product?.mainCategory}</p>
                      <h3 className="mt-0.5 truncate text-sm font-black text-slate-900 md:text-base">{item.product?.name}</h3>
                      <p className="mt-0.5 text-sm font-bold text-blue-600">₹{item.product?.discountPrice || item.product?.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1">
                        <button className="rounded-lg bg-white p-1 shadow-sm text-slate-600" onClick={() => updateQuantity(item._id, item.quantity - 1)}><Minus className="h-3 w-3" /></button>
                        <span className="w-6 text-center text-sm font-black">{item.quantity}</span>
                        <button className="rounded-lg bg-white p-1 shadow-sm text-slate-600" onClick={() => updateQuantity(item._id, item.quantity + 1)}><Plus className="h-3 w-3" /></button>
                      </div>
                      <button onClick={() => removeItem(item._id)} className="ml-auto rounded-xl bg-red-50 p-2 text-red-400 transition hover:bg-red-100">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="h-fit rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 md:p-6">
              <h2 className="text-lg font-black text-slate-900">Order Summary</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between text-slate-600"><span>Subtotal ({items.length} items)</span><span className="font-bold text-slate-900">₹{total}</span></div>
                <div className="flex justify-between text-slate-600"><span>Delivery</span><span className="font-bold text-green-600">Free</span></div>
                <div className="flex justify-between text-slate-600"><span>Discount</span><span className="font-bold text-green-600">—</span></div>
              </div>
              <div className="my-4 border-t border-dashed border-slate-200" />
              <div className="flex justify-between">
                <span className="font-black text-slate-900">Total</span>
                <span className="text-xl font-black text-blue-600">₹{total}</span>
              </div>
              <button onClick={() => navigate("/checkout")} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-300/40 transition hover:bg-blue-500">
                Checkout <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
