import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Star, Zap } from "lucide-react";
import api, { imgUrl } from "../api/api";

export default function ProductCard({ p }) {
  const navigate = useNavigate();
  const price = Number(p.discountPrice || p.price || 0);
  const mrp = Number(p.price || 0);
  const discount = p.discountPrice && mrp ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const addToCart = async (e) => { e.preventDefault(); await api.post("/cart", { product: p._id, quantity: 1 }); alert("Added to cart"); };
  const addToFavourite = async (e) => { e.preventDefault(); await api.post("/favourites", { product: p._id }); alert("Added to favourite"); };
  const buyNow = (e) => { e.preventDefault(); navigate("/checkout", { state: { buyNow: p } }); };

  return (
    <Link to={`/product/${p._id}`} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-blue-200">
      {/* Image */}
      <div className="relative overflow-hidden bg-slate-100" style={{ paddingBottom: "110%" }}>
        <img src={imgUrl(p.images?.[0])} alt={p.name} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />

        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-lg bg-red-500 px-2 py-0.5 text-[10px] font-black text-white md:left-3 md:top-3 md:px-2.5 md:text-xs">
            -{discount}%
          </span>
        )}

        <button onClick={addToFavourite} className="absolute right-2 top-2 rounded-xl bg-white/90 p-1.5 text-slate-400 shadow-sm backdrop-blur transition hover:text-pink-500 md:right-3 md:top-3 md:p-2">
          <Heart className="h-3.5 w-3.5 md:h-4 md:w-4" />
        </button>

        {/* Hover actions */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full flex-col gap-1.5 bg-gradient-to-t from-black/60 to-transparent p-3 transition duration-300 group-hover:translate-y-0 md:p-3">
          <button onClick={buyNow} className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2 text-xs font-black text-white shadow transition hover:bg-blue-500">
            <Zap className="h-3 w-3" /> Buy Now
          </button>
          <button onClick={addToCart} className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white py-2 text-xs font-black text-slate-800 shadow transition hover:bg-slate-100">
            <ShoppingBag className="h-3 w-3" /> Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3 md:p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">{p.mainCategory}</p>
        <h3 className="mt-1 line-clamp-2 flex-1 text-xs font-bold text-slate-800 md:text-sm">{p.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="text-sm font-black text-slate-900 md:text-base">₹{price}</span>
            {p.discountPrice && <span className="ml-1.5 text-xs text-slate-400 line-through">₹{mrp}</span>}
          </div>
          <span className="flex items-center gap-0.5 rounded-lg bg-amber-50 px-1.5 py-0.5 text-[10px] font-black text-amber-600">
            <Star className="h-2.5 w-2.5 fill-current" /> 4.5
          </span>
        </div>
      </div>
    </Link>
  );
}
