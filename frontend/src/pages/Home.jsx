import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Gem, ShoppingBag, Sparkles } from "lucide-react";

const heroSlides = [
  {
    tag: "New Season",
    title: "Dresses and jewels for every beautiful occasion",
    text: "Shop polished women's fashion with elegant silhouettes, festive details, and everyday sparkle.",
    image: "https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=1800",
    align: "center 18%",
  },
  {
    tag: "Jewellery Edit",
    title: "Small details that make the whole look glow",
    text: "Discover necklaces, earrings, bracelets, and statement pieces curated for modern styling.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=90",
    align: "center",
  },
  {
    tag: "Daily Style",
    title: "Fresh dress picks with a premium store feel",
    text: "From soft daily outfits to celebration-ready fashion, find pieces that feel easy and special.",
    image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1800",
    align: "center 15%",
  },
];

const collections = [
  { label: "Ethnic Dresses", to: "/dress", image: "https://images.unsplash.com/photo-1612722432474-b971cdcea546?auto=format&fit=crop&w=900&q=85" },
  { label: "Everyday Wear", to: "/dress", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85" },
  { label: "Statement Jewellery", to: "/jewellery", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85" },
  { label: "Occasion Glow", to: "/jewellery", image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=900&q=85" },
];

const featureLinks = [
  { title: "Women's Dresses", text: "New silhouettes, festive pieces, and daily looks.", to: "/dress", icon: ShoppingBag },
  { title: "Jewellery Picks", text: "Necklaces, earrings, bracelets, and rings.", to: "/jewellery", icon: Gem },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveSlide((v) => (v + 1) % heroSlides.length), 5200);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[activeSlide];

  return (
    <main className="page-shell">
      <section className="relative min-h-[calc(100vh-74px)] overflow-hidden bg-[#f6f0e8]">
        {heroSlides.map((item, index) => (
          <img
            key={item.image}
            src={item.image}
            alt={item.title}
            className={`absolute inset-0 h-full w-full object-cover transition duration-1000 ${index === activeSlide ? "opacity-100" : "opacity-0"}`}
            style={{ objectPosition: item.align }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbfaf7] via-[#fbfaf7]/82 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#15120f]/20 via-transparent to-transparent" />

        <div className="section-wrap relative flex min-h-[calc(100vh-74px)] items-center py-16">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 border border-[#e1d4c8] bg-white/72 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#324414] backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Women's Styles Boutique
            </div>
            <p className="editorial-kicker">{slide.tag}</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.02] tracking-tight text-[#15120f] md:text-6xl lg:text-7xl">
              {slide.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#514a42] md:text-lg">{slide.text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/dress" className="btn-primary">
                Shop Dresses <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/jewellery" className="btn-soft">
                Shop Jewellery
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-6 hidden items-center gap-4 md:flex">
          <span className="text-2xl font-black text-[#15120f]">{String(activeSlide + 1).padStart(2, "0")}</span>
          <div className="h-px w-16 bg-[#15120f]" />
          <span className="text-sm font-bold text-[#756f66]">{String(heroSlides.length).padStart(2, "0")}</span>
        </div>
      </section>

      <section className="section-wrap py-14 md:py-20">
        <div className="mb-8 text-center">
          <p className="editorial-kicker">Top Categories</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#15120f] md:text-5xl">Shop the collection</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {collections.map((item) => (
            <Link key={item.label} to={item.to} className="group relative overflow-hidden bg-white">
              <div className="product-image-bg aspect-[3/4] overflow-hidden">
                <img src={item.image} alt={item.label} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="absolute inset-x-6 bottom-0 translate-y-1/2 bg-white px-4 py-3 text-center shadow-lg transition group-hover:-translate-y-2">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#15120f]">{item.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[#e9e0d7] bg-white">
        <div className="section-wrap grid gap-0 md:grid-cols-2">
          {featureLinks.map(({ title, text, to, icon: Icon }) => (
            <Link key={title} to={to} className="group flex items-center justify-between border-[#e9e0d7] py-10 md:border-r md:px-10">
              <div className="flex items-center gap-5">
                <div className="flex h-14 w-14 items-center justify-center border border-[#e9e0d7] text-[#a91d4b]">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#15120f]">{title}</h3>
                  <p className="mt-1 text-sm text-[#756f66]">{text}</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-[#15120f] transition group-hover:translate-x-1 group-hover:text-[#a91d4b]" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
