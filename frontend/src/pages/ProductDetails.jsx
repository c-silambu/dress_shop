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
    api
      .get(`/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        return api.get(`/products/category/${encodeURIComponent(response.data.mainCategory)}`);
      })
      .then((response) => setRelated(response.data.filter((item) => item._id !== id).slice(0, 4)))
      .catch(() => setRelated([]));
  }, [id]);

  if (!product) {
    return <div className="p-10 text-center font-bold text-blue-700">Loading...</div>;
  }

  const price = product.discountPrice || product.price;

  const addToCart = async () => {
    await api.post("/cart", { product: product._id, quantity });
    alert("Added to cart");
  };

  const addToFavourite = async () => {
    await api.post("/favourites", { product: product._id });
    alert("Added to favourite");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2.5rem] border border-white/70 bg-white/80 p-4 shadow-2xl shadow-blue-950/10 backdrop-blur">
          <div className="reflection-card overflow-hidden rounded-[2rem] bg-blue-50">
            <img src={imgUrl(product.images?.[0])} alt={product.name} className="h-[460px] w-full object-cover transition duration-700 hover:scale-110 md:h-[620px]" />
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/70 bg-white/85 p-6 shadow-2xl shadow-blue-950/10 backdrop-blur md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-blue-600">{product.mainCategory}</p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-slate-950 md:text-6xl">{product.name}</h1>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-black text-amber-600">
            <Star className="h-4 w-4 fill-current" /> 4.5 Ratings • Premium Quality
          </div>

          <div className="mt-6 flex items-end gap-4">
            <p className="text-5xl font-black text-blue-700">₹{price}</p>
            {product.discountPrice && <p className="pb-2 text-xl font-bold text-slate-400 line-through">₹{product.price}</p>}
          </div>

          <p className="mt-5 leading-8 text-slate-600">{product.about || product.description}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-blue-50 p-4">
              <p className="text-sm font-black text-slate-500">Available Sizes</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes?.map((size) => <span key={size} className="rounded-full bg-white px-4 py-2 font-black text-blue-700 shadow-sm">{size}</span>)}
              </div>
            </div>
            <div className="rounded-3xl bg-pink-50 p-4">
              <p className="text-sm font-black text-slate-500">Colors</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors?.map((color) => <span key={color} className="rounded-full bg-white px-4 py-2 font-black text-pink-600 shadow-sm">{color}</span>)}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <span className="font-black text-slate-700">Quantity</span>
            <button className="rounded-full bg-blue-50 p-3 text-blue-700" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-10 text-center text-xl font-black">{quantity}</span>
            <button className="rounded-full bg-blue-50 p-3 text-blue-700" onClick={() => setQuantity((value) => value + 1)}>
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-5 font-bold text-slate-700">Stock: {product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <button onClick={() => navigate("/checkout", { state: { buyNow: product, quantity } })} className="btn-primary flex items-center justify-center gap-2">
              <Zap className="h-5 w-5" /> Buy Now
            </button>
            <button onClick={addToCart} className="btn-soft flex items-center justify-center gap-2">
              <ShoppingBag className="h-5 w-5" /> Cart
            </button>
            <button onClick={addToFavourite} className="rounded-full bg-pink-50 px-5 py-3 font-black text-pink-600 transition hover:-translate-y-1 hover:bg-pink-100">
              <Heart className="mr-2 inline h-5 w-5" /> Favourite
            </button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-3xl border border-blue-100 p-4">
              <Truck className="text-blue-600" /> <span className="font-bold text-slate-700">Fast delivery support</span>
            </div>
            <div className="flex items-center gap-3 rounded-3xl border border-blue-100 p-4">
              <ShieldCheck className="text-blue-600" /> <span className="font-bold text-slate-700">Secure checkout</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-6 mt-16 text-3xl font-black text-blue-950">Related Products</h2>
      <div className="grid gap-6 md:grid-cols-4">
        {related.map((item) => <ProductCard key={item._id} p={item} />)}
      </div>
    </section>
  );
}
