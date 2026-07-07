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
      <div className="flex min-h-screen items-center justify-center bg-[#fbfaf7]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#15120f] border-t-transparent" />
          <p className="text-sm font-bold text-[#756f66]">Loading product...</p>
        </div>
      </div>
    );
  }

  const price = Number(product.discountPrice || product.price || 0);
  const mrp = Number(product.price || 0);
  const discount = product.discountPrice && mrp ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const images = product.images?.length ? product.images : [null];

  const addToCart = async () => {
    await api.post("/cart", { product: product._id, quantity });
    alert("Added to cart!");
  };

  const addToFavourite = async () => {
    await api.post("/favourites", { product: product._id });
    setWishlisted(true);
  };

  return (
    <div className="page-shell">
      <div className="border-b border-[#e9e0d7] bg-white px-4 py-3">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm font-bold text-[#756f66] transition hover:text-[#a91d4b]">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
      </div>

      <div className="section-wrap pt-5 md:pt-10">
        <div className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="space-y-3">
            <div className="relative overflow-hidden border border-[#e9e0d7] product-image-bg">
              {discount > 0 && (
                <span className="absolute left-3 top-3 z-10 bg-[#a91d4b] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
                  {discount}% off
                </span>
              )}
              <button
                onClick={addToFavourite}
                className={`absolute right-3 top-3 z-10 rounded-full p-2.5 shadow transition ${wishlisted ? "bg-[#a91d4b] text-white" : "bg-white text-[#756f66] hover:text-[#a91d4b]"}`}
              >
                <Heart className="h-5 w-5" fill={wishlisted ? "currentColor" : "none"} />
              </button>
              <img src={imgUrl(images[selectedImg])} alt={product.name} className="h-[340px] w-full object-cover md:h-[560px] lg:h-[640px]" />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`h-16 w-16 flex-shrink-0 overflow-hidden border transition md:h-20 md:w-20 ${i === selectedImg ? "border-[#15120f]" : "border-[#e9e0d7]"}`}
                  >
                    <img src={imgUrl(img)} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:pt-5">
            <p className="editorial-kicker">{product.mainCategory}</p>
            <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-[#15120f] md:text-5xl">{product.name}</h1>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1 border border-[#eadfcf] bg-white px-3 py-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`h-3.5 w-3.5 ${s <= 4 ? "fill-[#b68a35] text-[#b68a35]" : "fill-[#dfd1b8] text-[#dfd1b8]"}`} />
                ))}
                <span className="ml-1 text-xs font-black text-[#8b6828]">4.5</span>
              </div>
              <span className="text-xs font-semibold text-[#756f66]">Premium Quality</span>
            </div>

            <div className="mt-5 flex flex-wrap items-baseline gap-3 border-y border-[#e9e0d7] py-5">
              <span className="text-3xl font-black text-[#15120f] md:text-4xl">Rs. {price.toLocaleString("en-IN")}</span>
              {product.discountPrice && (
                <>
                  <span className="text-base font-semibold text-[#9c948b] line-through">Rs. {mrp.toLocaleString("en-IN")}</span>
                  <span className="bg-[#eff5e8] px-2.5 py-1 text-xs font-black text-[#324414]">
                    Save Rs. {(mrp - price).toLocaleString("en-IN")}
                  </span>
                </>
              )}
            </div>

            {(product.about || product.description) && (
              <p className="mt-5 text-sm leading-7 text-[#756f66]">{product.about || product.description}</p>
            )}

            <div className="mt-5 space-y-4">
              {product.sizes?.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-[#756f66]">Sizes</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <span key={s} className="border border-[#e9e0d7] bg-white px-3 py-1.5 text-xs font-black text-[#15120f]">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {product.colors?.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-[#756f66]">Colors</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <span key={c} className="border border-[#ead7df] bg-white px-3 py-1.5 text-xs font-black text-[#a91d4b]">{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center gap-2">
              <Package className="h-4 w-4 text-[#756f66]" />
              <span className={`text-sm font-bold ${product.stock > 0 ? "text-[#324414]" : "text-[#a91d4b]"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <p className="text-xs font-black uppercase tracking-widest text-[#756f66]">Quantity</p>
              <div className="flex items-center gap-2 border border-[#e9e0d7] bg-white p-1">
                <button onClick={() => setQuantity((v) => Math.max(1, v - 1))} className="bg-[#f7f1eb] p-2 text-[#15120f] transition hover:bg-[#efe4da]">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-base font-black text-[#15120f]">{quantity}</span>
                <button onClick={() => setQuantity((v) => v + 1)} className="bg-[#f7f1eb] p-2 text-[#15120f] transition hover:bg-[#efe4da]">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={() => navigate("/checkout", { state: { buyNow: product, quantity } })} className="btn-primary col-span-2 py-4 md:col-span-1">
                <Zap className="h-4 w-4" /> Buy Now
              </button>
              <button onClick={addToCart} className="btn-soft py-4">
                <ShoppingBag className="h-4 w-4" /> Add to Cart
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { icon: Truck, text: "Free Delivery", sub: "On all orders" },
                { icon: ShieldCheck, text: "Secure Payment", sub: "100% protected" },
              ].map(({ icon: Icon, text, sub }) => (
                <div key={text} className="flex items-center gap-3 border border-[#e9e0d7] bg-white p-3.5">
                  <div className="bg-[#f6f0e8] p-2 text-[#324414]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#15120f]">{text}</p>
                    <p className="text-[10px] text-[#756f66]">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-14 md:mt-20">
            <div className="mb-7 text-center">
              <p className="editorial-kicker">Curated For You</p>
              <h2 className="mt-3 text-3xl font-black text-[#15120f] md:text-4xl">You may also like</h2>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-8 lg:grid-cols-4">
              {related.map((item) => <ProductCard key={item._id} p={item} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
