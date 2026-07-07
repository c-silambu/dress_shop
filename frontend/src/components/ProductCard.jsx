import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Zap } from "lucide-react";
import api, { imgUrl } from "../api/api";

export default function ProductCard({ p }) {
  const navigate = useNavigate();
  const price = Number(p.discountPrice || p.price || 0);
  const mrp = Number(p.price || 0);
  const discount = p.discountPrice && mrp ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const addToCart = async (e) => {
    e.preventDefault();
    await api.post("/cart", { product: p._id, quantity: 1 });
    alert("Added to cart");
  };

  const addToFavourite = async (e) => {
    e.preventDefault();
    await api.post("/favourites", { product: p._id });
    alert("Added to favourite");
  };

  const buyNow = (e) => {
    e.preventDefault();
    navigate("/checkout", { state: { buyNow: p } });
  };

  return (
    <Link to={`/product/${p._id}`} className="group block">
      <div className="relative overflow-hidden product-image-bg" style={{ aspectRatio: "3 / 4" }}>
        <img
          src={imgUrl(p.images?.[0])}
          alt={p.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        {discount > 0 && (
          <span className="absolute left-3 top-3 bg-[#a91d4b] px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white">
            {discount}% off
          </span>
        )}

        <button
          onClick={addToFavourite}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#15120f] shadow-sm transition hover:text-[#a91d4b]"
          title="Add to wishlist"
        >
          <Heart className="h-4 w-4" />
        </button>

        <div className="absolute inset-x-4 bottom-4 flex translate-y-4 flex-col gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button onClick={addToCart} className="btn-primary w-full py-3 text-[10px]">
            <ShoppingBag className="h-3.5 w-3.5" /> Add Cart
          </button>
          <button onClick={buyNow} className="btn-soft w-full bg-white py-3 text-[10px]">
            <Zap className="h-3.5 w-3.5" /> Buy Now
          </button>
        </div>
      </div>

      <div className="pt-4 text-center">
        <p className="editorial-kicker text-[9px]">{p.mainCategory}</p>
        <h3 className="mx-auto mt-1 line-clamp-2 min-h-[2.5rem] max-w-[15rem] text-sm font-black leading-tight text-[#15120f] md:text-base">
          {p.name}
        </h3>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm font-black text-[#15120f]">Rs. {price.toLocaleString("en-IN")}</span>
          {p.discountPrice && (
            <span className="text-xs font-semibold text-[#9c948b] line-through">Rs. {mrp.toLocaleString("en-IN")}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
