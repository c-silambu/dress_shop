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
    <section className="page-shell">
      <div className="border-b border-[#e9e0d7] bg-white">
        <div className="section-wrap py-9 md:py-12">
          <p className="editorial-kicker">Shopping Bag</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-[#15120f] md:text-5xl">Your cart</h1>
              <p className="mt-2 text-sm text-[#756f66]">{items.length} item{items.length !== 1 ? "s" : ""} selected</p>
            </div>
            <ShoppingBag className="hidden h-10 w-10 text-[#a91d4b] md:block" />
          </div>
        </div>
      </div>

      <div className="section-wrap pt-6 md:pt-10">
        {!items.length ? (
          <div className="mx-auto mt-16 max-w-md text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center border border-[#e9e0d7] bg-white text-[#a91d4b]">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <p className="mt-5 text-xl font-black text-[#15120f]">Your cart is empty</p>
            <p className="mt-2 text-sm text-[#756f66]">Add a dress or jewellery piece to begin checkout.</p>
            <button onClick={() => navigate("/dress")} className="btn-primary mt-6">Start Shopping</button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item._id} className="grid grid-cols-[92px_1fr] gap-4 border border-[#e9e0d7] bg-white p-3 md:grid-cols-[132px_1fr] md:p-4">
                  <img src={imgUrl(item.product?.images?.[0])} alt={item.product?.name} className="h-28 w-full object-cover product-image-bg md:h-36" />
                  <div className="flex min-w-0 flex-col justify-between">
                    <div>
                      <p className="editorial-kicker text-[9px]">{item.product?.mainCategory}</p>
                      <h3 className="mt-1 truncate text-base font-black text-[#15120f] md:text-xl">{item.product?.name}</h3>
                      <p className="mt-2 text-sm font-black text-[#a91d4b]">
                        Rs. {Number(item.product?.discountPrice || item.product?.price || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex items-center border border-[#e9e0d7] bg-[#fbfaf7]">
                        <button className="p-2 text-[#15120f]" onClick={() => updateQuantity(item._id, item.quantity - 1)}><Minus className="h-3.5 w-3.5" /></button>
                        <span className="w-9 text-center text-sm font-black">{item.quantity}</span>
                        <button className="p-2 text-[#15120f]" onClick={() => updateQuantity(item._id, item.quantity + 1)}><Plus className="h-3.5 w-3.5" /></button>
                      </div>
                      <button onClick={() => removeItem(item._id)} className="ml-auto flex h-9 w-9 items-center justify-center border border-[#f0d5dc] text-[#a91d4b] transition hover:bg-[#fff1f5]">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit border border-[#e9e0d7] bg-white p-6">
              <h2 className="text-2xl font-black text-[#15120f]">Order summary</h2>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between text-[#756f66]"><span>Subtotal</span><span className="font-black text-[#15120f]">Rs. {total.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between text-[#756f66]"><span>Delivery</span><span className="font-black text-[#324414]">Free</span></div>
                <div className="flex justify-between text-[#756f66]"><span>Taxes</span><span className="font-black text-[#15120f]">Calculated at checkout</span></div>
              </div>
              <div className="my-6 border-t border-dashed border-[#d8cbc0]" />
              <div className="flex justify-between">
                <span className="text-lg font-black text-[#15120f]">Total</span>
                <span className="text-2xl font-black text-[#15120f]">Rs. {total.toLocaleString("en-IN")}</span>
              </div>
              <button onClick={() => navigate("/checkout")} className="btn-primary mt-6 w-full">
                Checkout <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => navigate("/dress")} className="btn-soft mt-3 w-full">
                Continue Shopping
              </button>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
