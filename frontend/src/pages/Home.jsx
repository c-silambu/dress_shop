import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Sparkles, Star } from "lucide-react";

const heroSlides = [
  {
    tag: "Premium Ethnic Wear",
    title: "Blue elegance for every beautiful moment",
    text: "Explore fresh dress styles with soft glow and modern shopping feel.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    accent: "from-blue-900/90 via-blue-800/60",
  },
  {
    tag: "Jewellery Glow",
    title: "Shine brighter with classy jewellery picks",
    text: "Modern jewellery collections with rich reflections and luxury styling.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    accent: "from-slate-900/90 via-pink-900/40",
  },
  {
    tag: "New Collection",
    title: "Trendy dresses made for daily confidence",
    text: "Simple, stylish layouts for a professional store look.",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80",
    accent: "from-slate-950/90 via-blue-950/50",
  },
  {
    tag: "Festive Mood",
    title: "Soft festive looks with premium feel",
    text: "Give your customers a clean shopping experience.",
    image: "https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?auto=format&fit=crop&w=1200&q=80",
    accent: "from-pink-950/80 via-slate-900/60",
  },
  {
    tag: "Modern Accessories",
    title: "Complete your style with glowing details",
    text: "Beautiful slides, collection cards, and smooth effects.",
    image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=80",
    accent: "from-blue-950/90 via-slate-900/50",
  },
];

const dressCollection = [
  { tag: "Campus Ethnic", title: "Churidar mood", image: "https://images.unsplash.com/photo-1612722432474-b971cdcea546?auto=format&fit=crop&w=900&q=80" },
  { tag: "Elegant Daily", title: "Cotton comfort", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80" },
  { tag: "Wedding", title: "Lehenga glow", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80" },
  { tag: "Celebration", title: "Saree style", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80" },
];

const jewelleryCollection = [
  { tag: "Necklace", title: "Royal shine", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80" },
  { tag: "Earrings", title: "Soft sparkle", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80" },
  { tag: "Bracelet", title: "Daily glow", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=80" },
  { tag: "Rings", title: "Premium detail", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80" },
];

const stats = [
  { value: "500+", label: "Products" },
  { value: "2K+", label: "Customers" },
  { value: "4.9★", label: "Rating" },
  { value: "Free", label: "Delivery" },
];

function CollectionSection({ eyebrow, title, items, buttonText, to }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:py-16">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">{eyebrow}</span>
          <h2 className="mt-2 text-2xl font-black text-slate-900 md:text-4xl">{title}</h2>
        </div>
        <Link to={to} className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-4 py-2 text-xs font-bold text-blue-600 shadow-sm transition hover:bg-blue-600 hover:text-white md:text-sm">
          All <ArrowRight size={14} />
        </Link>
      </div>

      {/* Bento grid — fixed heights, no CSS grid rows conflict */}
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4">
        {/* Big card — spans 2 cols */}
        <Link to={to} className="group relative col-span-2 overflow-hidden rounded-2xl md:rounded-3xl" style={{ height: "340px" }}>
          <img src={items[0].image} alt={items[0].title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-300 md:text-xs">{items[0].tag}</p>
            <h3 className="mt-1 text-xl font-black text-white md:text-3xl">{items[0].title}</h3>
          </div>
        </Link>

        {/* 3 small cards */}
        {items.slice(1).map((item) => (
          <Link to={to} key={item.title} className="group relative overflow-hidden rounded-2xl md:rounded-3xl" style={{ height: "160px" }}>
            <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-blue-300">{item.tag}</p>
              <h3 className="text-sm font-black text-white md:text-base">{item.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveSlide((c) => (c + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = heroSlides[activeSlide];

  return (
    <main className="bg-slate-50 pb-20 md:pb-0">
      {/* Hero */}
      <section className="relative h-[92vh] min-h-[560px] max-h-[900px] overflow-hidden">
        {heroSlides.map((s, i) => (
          <img
            key={s.image}
            src={s.image}
            alt={s.title}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${i === activeSlide ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className={`absolute inset-0 bg-gradient-to-br ${slide.accent} to-transparent transition-all duration-1000`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

        {/* Hero content */}
        <div className="relative flex h-full flex-col justify-end px-5 pb-16 md:justify-center md:px-12 md:pb-0">
          <div className="max-w-lg">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur">
              <Sparkles size={11} /> Women's Styles • Premium Store
            </div>
            <p className="mb-1 text-xs font-black uppercase tracking-[0.4em] text-blue-300">{slide.tag}</p>
            <h1 className="text-3xl font-black leading-[1.1] text-white md:text-5xl lg:text-6xl">{slide.title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">{slide.text}</p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link to="/dress" className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/40 transition hover:bg-blue-500">
                <ShoppingBag size={15} /> Shop Dress
              </Link>
              <Link to="/jewellery" className="flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20">
                <Star size={15} /> Jewellery
              </Link>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-6 right-5 flex gap-1.5 md:bottom-8 md:right-10">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setActiveSlide(i)} className={`rounded-full transition-all duration-300 ${i === activeSlide ? "h-2 w-8 bg-white" : "h-2 w-2 bg-white/40"}`} />
          ))}
        </div>

        {/* Slide counter */}
        <div className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-2 md:flex">
          <span className="text-2xl font-black text-white">{String(activeSlide + 1).padStart(2, "0")}</span>
          <div className="h-12 w-px bg-white/30" />
          <span className="text-sm font-bold text-white/40">{String(heroSlides.length).padStart(2, "0")}</span>
        </div>
      </section>

      {/* Stats strip */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-around px-4 py-3 md:py-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-base font-black text-blue-600 md:text-xl">{s.value}</p>
              <p className="text-[10px] font-semibold text-slate-500 md:text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <CollectionSection eyebrow="Dress Collection" title="Modern women's dress" items={dressCollection} buttonText="All Dress" to="/dress" />

      {/* Banner */}
      <div className="mx-auto max-w-7xl px-4 pb-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 shadow-2xl md:rounded-[2rem] md:p-10">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-8 left-20 h-32 w-32 rounded-full bg-pink-500/20 blur-2xl" />
          <div className="relative max-w-sm">
            <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">New Arrivals</span>
            <h2 className="mt-3 text-2xl font-black text-white md:text-4xl">Exclusive jewellery collection</h2>
            <p className="mt-2 text-sm text-blue-100">Hand-picked pieces for every occasion.</p>
            <Link to="/jewellery" className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-blue-700 shadow-lg transition hover:bg-blue-50">
              Explore <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <CollectionSection eyebrow="Jewellery Collection" title="Glowing jewellery picks" items={jewelleryCollection} buttonText="All Jewels" to="/jewellery" />
    </main>
  );
}
