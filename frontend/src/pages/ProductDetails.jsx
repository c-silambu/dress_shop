import React, { useEffect, useState } from "react";
import { ChevronLeft, Heart, Minus, Package, Plus, ShieldCheck, ShoppingBag, Star, Truck, Zap } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api, { imgUrl } from "../api/api";
import ProductCard from "../components/ProductCard";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    setSelectedImg(0);
    api.get(`/products/${id}`)
      .then((r) => {
        setProduct(r.data);
        return api.get(`/products/category/${encodeURIComponent(r.data.mainCategory)}`);
      })
      .then((r) => setRelated(r.data.filter((i) => i._id !== id).slice(0, 4)))
      .catch(() => setRelated([]));
  }, [id]);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm font-bold text-slate-500">Loading product...</p>
        </div>
      </div>
    );
  }

  const price = Number(product.discountPrice || product.price || 0);
  const mrp = Number(product.price || 0);
  const discount = product.discountPrice && mrp ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const images = product.images?.length ? product.images : [null];

  const addToCart = async () => { await api.post("/cart", { product: product._id, quantity }); alert("Added to cart!"); };
  const addToFavourite = async () => {
    await api.post("/favourites", { product: product._id });
    setWishlisted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28 md:pb-10">
      {/* Back button */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-blue-600">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
      </div>

      <div className="mx-auto max-w-6xl px-3 pt-4 md:px-6 md:pt-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr] lg:gap-10">

          {/* ── Left: Images ── */}
          <div className="space-y-2.5">
            {/* Main image */}
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 md:rounded-3xl">
              {discount > 0 && (
                <span className="absolute left-3 top-3 z-10 rounded-xl bg-red-500 px-2.5 py-1 text-xs font-black text-white shadow">
                  -{discount}% OFF
                </span>
              )}
              <button
                onClick={addToFavourite}
                className={`absolute right-3 top-3 z-10 rounded-xl p-2.5 shadow transition ${wishlisted ? "bg-pink-500 text-white" : "bg-white text-slate-400 hover:text-pink-500"}`}
              >
                <Heart className="h-5 w-5" fill={wishlisted ? "currentColor" : "none"} />
              </button>
              <img
                src={imgUrl(images[selectedImg])}
                alt={product.name}
                className="h-[300px] w-full object-cover md:h-[480px] lg:h-[520px]"
              />
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl ring-2 transition md:h-20 md:w-20 ${i === selectedImg ? "ring-blue-600" : "ring-transparent"}`}
                  >
                    <img src={imgUrl(img)} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Details ── */}
          <div>
            {/* Category + name */}
            <span className="inline-block rounded-lg bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-blue-600">
              {product.mainCategory}
            </span>
            <h1 className="mt-2 text-2xl font-black leading-tight text-slate-900 md:text-3xl lg:text-4xl">{product.name}</h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-1.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`h-3.5 w-3.5 ${s <= 4 ? "fill-amber-400 text-amber-400" : "fill-amber-200 text-amber-200"}`} />
                ))}
                <span className="ml-1 text-xs font-black text-amber-600">4.5</span>
              </div>
              <span className="text-xs text-slate-400">• Premium Quality</span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <span className="text-3xl font-black text-slate-900 md:text-4xl">₹{price}</span>
              {product.discountPrice && (
                <>
                  <span className="text-base font-semibold text-slate-400 line-through">₹{mrp}</span>
                  <span className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-black text-green-600">Save ₹{mrp - price}</span>
                </>
              )}
            </div>

            {/* Description */}
            {(product.about || product.description) && (
              <p className="mt-4 text-sm leading-relaxed text-slate-500">{product.about || product.description}</p>
            )}

            {/* Sizes + Colors */}
            <div className="mt-4 space-y-3">
              {product.sizes?.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-slate-400">Sizes</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <span key={s} className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {product.colors?.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-slate-400">Colors</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <span key={c} className="rounded-xl border border-pink-200 bg-pink-50 px-3 py-1.5 text-xs font-black text-pink-600">{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="mt-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-slate-400" />
              <span className={`text-sm font-bold ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            {/* Quantity */}
            <div className="mt-4 flex items-center gap-3">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Quantity</p>
              <div className="flex items-center gap-2 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
                <button onClick={() => setQuantity((v) => Math.max(1, v - 1))} className="rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-base font-black text-slate-900">{quantity}</span>
                <button onClick={() => setQuantity((v) => v + 1)} className="rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/checkout", { state: { buyNow: product, quantity } })}
                className="col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-sm font-black text-white shadow-lg shadow-blue-300/40 transition hover:bg-blue-500 active:scale-[0.98] md:col-span-1"
              >
                <Zap className="h-4 w-4" /> Buy Now
              </button>
              <button
                onClick={addToCart}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-blue-600 py-4 text-sm font-black text-blue-600 transition hover:bg-blue-50 active:scale-[0.98]"
              >
                <ShoppingBag className="h-4 w-4" /> Add to Cart
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {[
                { icon: Truck, text: "Free Delivery", sub: "On all orders" },
                { icon: ShieldCheck, text: "Secure Payment", sub: "100% protected" },
              ].map(({ icon: Icon, text, sub }) => (
                <div key={text} className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-slate-100">
                  <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800">{text}</p>
                    <p className="text-[10px] text-slate-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-12 md:mt-16">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 md:text-2xl">You may also like</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
              {related.map((item) => <ProductCard key={item._id} p={item} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
