import React, { useEffect, useState } from "react";
import { Heart, Minus, Plus, ShieldCheck, ShoppingBag, Star, Truck, Zap } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api, { imgUrl } from "../api/api";
import ProductCard from "../components/ProductCard";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((r) => {
        setProduct(r.data);
        return api.get(`/products/category/${encodeURIComponent(r.data.mainCategory)}`);
      })
      .then((r) => setRelated(r.data.filter((i) => i._id !== id).slice(0, 4)))
      .catch(() => setRelated([]));
  }, [id]);

  if (!product) return <div className="p-10 text-center font-bold text-blue-700">Loading...</div>;

  const price = product.discountPrice || product.price;

  const addToCart = async () => { await api.post("/cart", { product: product._id, quantity }); alert("Added to cart"); };
  const addToFavourite = async () => { await api.post("/favourites", { product: product._id }); alert("Added to favourite"); };

  return (
    <section className="mx-auto max-w-7xl px-3 py-6 md:px-4 md:py-10">
      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        {/* Image */}
        <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/80 p-3 shadow-xl backdrop-blur md:rounded-[2.5rem] md:p-4">
          <div className="reflection-card overflow-hidden rounded-xl bg-blue-50 md:rounded-[2rem]">
            <img
              src={imgUrl(product.images?.[0])}
              alt={product.name}
              className="h-[280px] w-full object-cover transition duration-700 hover:scale-110 md:h-[500px] lg:h-[620px]"
            />
          </div>
        </div>

        {/* Details */}
        <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-xl backdrop-blur md:rounded-[2.5rem] md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-blue-600">{product.mainCategory}</p>
          <h1 className="mt-2 text-2xl font-black leading-tight text-slate-950 md:mt-3 md:text-4xl lg:text-6xl">{product.name}</h1>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-600 md:px-4 md:py-2 md:text-sm">
            <Star className="h-3 w-3 fill-current md:h-4 md:w-4" /> 4.5 Ratings • Premium Quality
          </div>

          <div className="mt-4 flex items-end gap-3">
            <p className="text-3xl font-black text-blue-700 md:text-5xl">₹{price}</p>
            {product.discountPrice && <p className="pb-1 text-base font-bold text-slate-400 line-through md:pb-2 md:text-xl">₹{product.price}</p>}
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">{product.about || product.description}</p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-blue-50 p-3 md:rounded-3xl md:p-4">
              <p className="text-xs font-black text-slate-500">Sizes</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.sizes?.map((s) => <span key={s} className="rounded-full bg-white px-3 py-1 text-xs font-black text-blue-700 shadow-sm md:px-4 md:py-2">{s}</span>)}
              </div>
            </div>
            <div className="rounded-2xl bg-pink-50 p-3 md:rounded-3xl md:p-4">
              <p className="text-xs font-black text-slate-500">Colors</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.colors?.map((c) => <span key={c} className="rounded-full bg-white px-3 py-1 text-xs font-black text-pink-600 shadow-sm md:px-4 md:py-2">{c}</span>)}
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-5 flex items-center gap-3">
            <span className="text-sm font-black text-slate-700">Qty</span>
            <button className="rounded-full bg-blue-50 p-2 text-blue-700 md:p-3" onClick={() => setQuantity((v) => Math.max(1, v - 1))}><Minus className="h-4 w-4" /></button>
            <span className="min-w-8 text-center text-lg font-black">{quantity}</span>
            <button className="rounded-full bg-blue-50 p-2 text-blue-700 md:p-3" onClick={() => setQuantity((v) => v + 1)}><Plus className="h-4 w-4" /></button>
          </div>

          <p className="mt-3 text-sm font-bold text-slate-700">Stock: {product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>

          {/* Action Buttons */}
          <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-3">
            <button onClick={() => navigate("/checkout", { state: { buyNow: product, quantity } })} className="btn-primary col-span-2 flex items-center justify-center gap-2 text-sm md:col-span-1">
              <Zap className="h-4 w-4" /> Buy Now
            </button>
            <button onClick={addToCart} className="btn-soft flex items-center justify-center gap-2 text-sm">
              <ShoppingBag className="h-4 w-4" /> Cart
            </button>
            <button onClick={addToFavourite} className="rounded-full bg-pink-50 px-4 py-3 text-sm font-black text-pink-600 transition hover:bg-pink-100">
              <Heart className="mr-1 inline h-4 w-4" /> Fav
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 md:gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-blue-100 p-3 md:rounded-3xl md:p-4">
              <Truck className="h-4 w-4 text-blue-600" /> <span className="text-xs font-bold text-slate-700 md:text-sm">Fast delivery</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-blue-100 p-3 md:rounded-3xl md:p-4">
              <ShieldCheck className="h-4 w-4 text-blue-600" /> <span className="text-xs font-bold text-slate-700 md:text-sm">Secure checkout</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-5 mt-12 text-2xl font-black text-blue-950 md:text-3xl">Related Products</h2>
      <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
        {related.map((item) => <ProductCard key={item._id} p={item} />)}
      </div>
    </section>
  );
}
