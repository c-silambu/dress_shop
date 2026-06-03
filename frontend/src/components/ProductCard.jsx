import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Star, Zap } from "lucide-react";
import api, { imgUrl } from "../api/api";

export default function ProductCard({ p }) {
  const navigate = useNavigate();
  const price = Number(p.discountPrice || p.price || 0);
  const mrp = Number(p.price || 0);
  const discount = p.discountPrice && mrp ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const addToCart = async (event) => {
    event.preventDefault();
    await api.post("/cart", { product: p._id, quantity: 1 });
    alert("Added to cart");
  };

  const addToFavourite = async (event) => {
    event.preventDefault();
    await api.post("/favourites", { product: p._id });
    alert("Added to favourite");
  };

  const buyNow = (event) => {
    event.preventDefault();
    navigate("/checkout", { state: { buyNow: p } });
  };

  return (
    <Link to={`/product/${p._id}`} className="group block overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-xl shadow-blue-950/5 transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-950/15">
      <div className="reflection-card relative h-72 overflow-hidden bg-blue-50">
        <img src={imgUrl(p.images?.[0])} alt={p.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        {discount > 0 && (
          <span className="absolute left-4 top-4 rounded-full bg-pink-500 px-3 py-1 text-xs font-black text-white shadow-lg">
            {discount}% OFF
          </span>
        )}
        <button onClick={addToFavourite} className="absolute right-4 top-4 rounded-full bg-white/90 p-3 text-pink-500 shadow-lg backdrop-blur transition hover:scale-110">
          <Heart className="h-5 w-5" />
        </button>
        <div className="absolute inset-x-4 bottom-4 flex translate-y-8 gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button onClick={buyNow} className="flex flex-1 items-center justify-center gap-1 rounded-full bg-blue-600 px-3 py-3 text-sm font-black text-white shadow-lg">
            <Zap className="h-4 w-4" /> Buy Now
          </button>
          <button onClick={addToCart} className="rounded-full bg-white px-4 py-3 font-black text-blue-700 shadow-lg">
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-blue-600">{p.mainCategory}</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-black text-amber-600">
            <Star className="h-3 w-3 fill-current" /> 4.5
          </span>
        </div>
        <h3 className="mt-3 line-clamp-2 text-xl font-black text-slate-950">{p.name}</h3>
        <p className="mt-1 text-sm text-slate-500">{p.subCategory || "Premium Collection"}</p>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-2xl font-black text-blue-700">₹{price}</span>
          {p.discountPrice && <span className="text-sm font-bold text-slate-400 line-through">₹{p.price}</span>}
        </div>
      </div>
    </Link>
  );
}
