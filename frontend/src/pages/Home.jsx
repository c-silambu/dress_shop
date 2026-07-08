import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Gem, ShoppingBag, Sparkles } from "lucide-react";

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

const lookbook = [
  {
    title: "College churidar mood",
    tag: "Campus Ethnic",
    to: "/dress",
    image: "https://images.unsplash.com/photo-1632826727346-43a7ac6bcb1b?auto=format&fit=crop&q=80&w=1100",
    tall: true,
  },
  {
    title: "Churidar studio mood",
    tag: "Everyday Ethnic",
    to: "/dress",
    image: "https://images.pexels.com/photos/13584944/pexels-photo-13584944.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    title: "Pastel salwar comfort",
    tag: "Soft Festive",
    to: "/dress",
    image: "https://images.pexels.com/photos/26973350/pexels-photo-26973350.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    title: "Modern saree mood",
    tag: "Celebration",
    to: "/dress",
    image: "https://images.pexels.com/photos/12327758/pexels-photo-12327758.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    title: "Reception lehenga glow",
    tag: "Wedding",
    to: "/jewellery",
    image: "https://images.pexels.com/photos/34767007/pexels-photo-34767007.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
];

const curatedEdit = {
  title: "Silk Saree Edit",
  tag: "36 Styles",
  text: "Traditional sarees, festive drapes, and rich Indian styling for weddings and celebrations.",
  to: "/dress",
  image: "https://images.unsplash.com/photo-1632826727346-43a7ac6bcb1b?auto=format&fit=crop&q=80&w=1100",
};

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

      <section className="bg-[#f5f2fb] py-12 md:py-16">
        <div className="mx-auto w-full max-w-[1060px] px-4">
          <div className="mb-6 max-w-[680px]">
            <p className="editorial-kicker">Curated Edits</p>
            <h2 className="mt-3 font-serif text-4xl font-black leading-[0.98] text-[#15120f] md:text-6xl">
              Collections made to scroll, save, and style.
            </h2>
          </div>

          <div className="grid overflow-hidden border border-[#e4dff3] bg-white shadow-[0_22px_70px_rgba(54,42,116,0.12)] md:grid-cols-[1.36fr_1fr]">
            <div className="relative min-h-[380px] overflow-hidden md:min-h-[640px]">
              <img src={curatedEdit.image} alt={curatedEdit.title} className="h-full w-full object-cover" />
              <button
                type="button"
                aria-label="Previous edit"
                className="absolute left-8 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/55 bg-white/10 text-white backdrop-blur transition hover:bg-white/25"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>

            <div className="relative flex min-h-[380px] items-center overflow-hidden bg-[#34218d] p-8 text-white md:min-h-[640px] md:p-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_25%,rgba(255,255,255,0.12),transparent_18rem),linear-gradient(155deg,#19152f_0%,#422ca8_52%,#6247ff_100%)]" />
              <div className="relative max-w-[19rem]">
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white">{curatedEdit.tag}</p>
                <h3 className="mt-4 font-serif text-4xl font-black leading-none md:text-5xl">{curatedEdit.title}</h3>
                <p className="mt-5 text-xs font-semibold leading-6 text-white/78">{curatedEdit.text}</p>
                <Link to={curatedEdit.to} className="mt-5 inline-flex items-center gap-2 border border-white/35 bg-white/10 px-4 py-2 text-xs font-black text-white transition hover:bg-white/18">
                  Explore <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <button
                type="button"
                aria-label="Next edit"
                className="absolute right-8 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white/80 transition hover:text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap py-14 md:py-20">
        <div className="mb-8 text-center">
          <p className="editorial-kicker">Top Categories</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#15120f] md:text-5xl">Shop the collection</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((item) => (
            <Link key={item.label} to={item.to} className="group block bg-white">
              <div className="product-image-bg aspect-[3/4] overflow-hidden">
                <img src={item.image} alt={item.label} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="mx-6 -mt-6 relative bg-white px-4 py-4 text-center shadow-lg transition group-hover:-translate-y-1">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#15120f]">{item.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#fbf6f1] py-14 md:py-20">
        <div className="section-wrap">
          <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="editorial-kicker">Lookbook</p>
              <h2 className="mt-3 max-w-3xl font-serif text-4xl font-black leading-[0.98] text-[#15120f] md:text-6xl">
                Editorial frames for festive nights and city days.
              </h2>
            </div>
            <Link to="/dress" className="btn-soft w-fit">
              Explore Looks <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.08fr_0.82fr_0.82fr]">
            {lookbook.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className={`group relative min-h-[260px] overflow-hidden border border-[#e4d6c9] bg-[#15120f] shadow-[0_18px_48px_rgba(21,18,15,0.12)] ${
                  item.tall ? "md:col-span-2 lg:col-span-1 lg:row-span-2 lg:min-h-[520px]" : "lg:min-h-[252px]"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#15120f]/82 via-[#15120f]/22 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#d7b56d]">{item.tag}</p>
                  <h3 className="mt-2 max-w-[18rem] font-serif text-3xl font-black leading-none text-white md:text-4xl">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
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

      <section className="bg-[#fbfaf7] py-14 md:py-20">
        <div className="section-wrap">
          <div className="relative overflow-hidden border border-[#dfd0c4] bg-[#15120f] p-6 shadow-[0_22px_70px_rgba(21,18,15,0.12)] md:p-12">
            <img
              src="https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=1400"
              alt="New season dress offer"
              className="absolute inset-0 h-full w-full object-cover opacity-35"
              style={{ objectPosition: "center 18%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#15120f]/95 via-[#761131]/72 to-[#324414]/74" />
            <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#d7b56d]">Weekend Exclusive</p>
                <h2 className="mt-4 max-w-3xl font-serif text-4xl font-black leading-[0.98] text-white md:text-6xl">
                  Flat 30% off on new-season dresses.
                </h2>
                <p className="mt-5 max-w-2xl text-sm font-semibold leading-7 text-white/76 md:text-base">
                  Use code STYLE30 on premium dresses, satin slips, festive sets, and occasion-ready looks.
                </p>
              </div>
              <Link to="/dress" className="btn-primary border border-white/18 bg-[#a91d4b] hover:bg-[#324414]">
                Shop Offer <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
