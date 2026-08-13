import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Zap } from "lucide-react";
import api, { imgUrl } from "../api/api";
import { useToast } from "../context/ToastContext";

export default function ProductCard({ p }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [cartState, setCartState] = useState("idle");
  const price = Number(p.discountPrice || p.price || 0);
  const mrp = Number(p.price || 0);
  const discount = p.discountPrice && mrp ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const addToCart = async (e) => {
    e.preventDefault();
    if (p.sizes?.length || p.colors?.length) { navigate(`/product/${p._id}`); return; }
    try { setCartState("adding"); await api.post("/cart", { product: p._id, quantity: 1 }); setCartState("added"); setTimeout(() => setCartState("idle"), 1800); }
    catch (error) { setCartState("idle"); if (error.response?.status === 401) navigate("/login"); else toast.error(error.response?.data?.message || "Unable to add to cart"); }
  };

  const addToFavourite = async (e) => {
    e.preventDefault();
    try { await api.post("/favourites", { product: p._id }); toast.success("Added to wishlist"); }
    catch (error) { if (error.response?.status === 401) navigate("/login"); else toast.error("Unable to add to wishlist"); }
  };

  const buyNow = (e) => {
    e.preventDefault();
    if (p.sizes?.length || p.colors?.length) { navigate(`/product/${p._id}`); return; }
    navigate("/checkout", { state: { buyNow: p } });
  };

  return (
    <Link to={`/product/${p._id}`} className="product-card-new group block">
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

        <div className="product-card-actions">
          <button onClick={addToCart} disabled={cartState === "adding"} className="product-card-cart">
            <ShoppingBag /> {cartState === "adding" ? "Adding..." : cartState === "added" ? "Added to Bag ✓" : "Add to Cart"}
          </button>
          <button onClick={buyNow} className="product-card-buy">
            <Zap /> Buy Now
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
