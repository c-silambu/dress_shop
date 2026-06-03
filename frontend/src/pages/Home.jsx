import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const heroSlides = [
  {
    tag: "Premium Ethnic Wear",
    title: "Blue elegance for every beautiful moment",
    text: "Explore fresh dress styles with soft glow, premium cards, and modern shopping feel.",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "Jewellery Glow",
    title: "Shine brighter with classy jewellery picks",
    text: "Modern jewellery collections with rich reflections and blue-white luxury styling.",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "New Collection",
    title: "Trendy dresses made for daily confidence",
    text: "Simple, stylish, and mobile-friendly layouts for a professional store look.",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "Festive Mood",
    title: "Soft festive looks with premium feel",
    text: "Give your customers a clean shopping experience with attractive visual sections.",
    image:
      "https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "Modern Accessories",
    title: "Complete your style with glowing details",
    text: "Beautiful hero slides, collection cards, and smooth animation effects.",
    image:
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=80",
  },
];

const dressCollection = [
  {
    tag: "Campus Ethnic",
    title: "Churidar mood",
    image:
      "https://images.unsplash.com/photo-1612722432474-b971cdcea546?auto=format&fit=crop&w=900&q=80",
  },
{
  tag: "Elegant Daily",
  title: "Cotton comfort",
  image:
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
},
{
  tag: "Wedding",
  title: "Lehenga glow",
  image:
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
},
  {
    tag: "Celebration",
    title: "Saree style",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80",
  },
];

const jewelleryCollection = [
  {
    tag: "Necklace",
    title: "Royal shine",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
  },
  {
    tag: "Earrings",
    title: "Soft sparkle",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
  },
  {
    tag: "Bracelet",
    title: "Daily glow",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=80",
  },
  {
    tag: "Rings",
    title: "Premium detail",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",
  },
];

function CollectionSection({ eyebrow, title, subtitle, items, buttonText, to }) {
  return (
    <section className="relative max-w-7xl mx-auto px-4 py-16 overflow-hidden">
      <div className="absolute left-0 top-20 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute right-4 bottom-20 h-56 w-56 rounded-full bg-sky-300/20 blur-3xl" />

      <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
        <div>
          <p className="text-blue-600 font-bold uppercase tracking-[0.35em] text-xs">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl md:text-5xl font-black text-slate-950">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-slate-500 leading-7">{subtitle}</p>
        </div>

        <Link
          to={to}
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-bold text-white shadow-xl shadow-blue-500/25 transition hover:-translate-y-1 hover:bg-blue-700"
        >
          {buttonText}
          <ArrowRight size={18} className="transition group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="relative grid md:grid-cols-4 gap-5">
        {items.map((item, index) => (
          <article
            key={item.title}
            className={`group reflection-card min-h-[360px] overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-2xl shadow-blue-950/10 transition duration-500 hover:-translate-y-2 ${
              index === 0 ? "md:col-span-2 md:row-span-2 md:min-h-[520px]" : ""
            }`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-300">
                {item.tag}
              </p>
              <h3 className="mt-2 text-3xl md:text-4xl font-black leading-tight drop-shadow-lg">
                {item.title}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[activeSlide];

  return (
    <main className="overflow-hidden bg-[radial-gradient(circle_at_top_left,#dbeafe_0,#f8fbff_32%,#ffffff_100%)]">
      <section className="relative min-h-[82vh] px-4 py-10 md:py-16">
        <div className="absolute inset-0 hero-grid opacity-60" />
        <div className="absolute -top-24 right-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-10 left-0 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center min-h-[72vh]">
          <div className="z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-bold text-blue-700 shadow-lg shadow-blue-500/10 backdrop-blur">
              <Sparkles size={16} />
              Women’s Styles Premium Store
            </div>

            <p className="mt-8 text-blue-600 font-black uppercase tracking-[0.35em] text-xs">
              {slide.tag}
            </p>
            <h1 className="mt-4 max-w-3xl text-5xl md:text-7xl font-black leading-[0.95] text-slate-950">
              {slide.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-600 leading-8">
              {slide.text}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/dress"
                className="rounded-full bg-blue-600 px-8 py-4 font-bold text-white shadow-2xl shadow-blue-500/30 transition hover:-translate-y-1 hover:bg-blue-700"
              >
                Explore Dress
              </Link>
              <Link
                to="/jewellery"
                className="rounded-full border border-blue-200 bg-white/80 px-8 py-4 font-bold text-blue-700 shadow-xl shadow-blue-500/10 backdrop-blur transition hover:-translate-y-1 hover:border-blue-500"
              >
                Explore Jewellery
              </Link>
            </div>
          </div>

          <div className="relative h-[520px] lg:h-[620px]">
            <div className="absolute inset-0 rounded-[3rem] bg-blue-600/20 blur-3xl" />
            <div className="reflection-card hero-slide-card absolute inset-0 overflow-hidden rounded-[3rem] border border-white/70 bg-white/40 shadow-2xl shadow-blue-950/20 backdrop-blur">
              <img
                key={slide.image}
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover hero-slide-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 rounded-[2rem] border border-white/30 bg-white/15 p-6 text-white backdrop-blur-xl">
                {/* <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-200">
                  Slide 0{activeSlide + 1}
                </p> */}
                <h2 className="mt-2 text-3xl md:text-5xl font-black">{slide.tag}</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CollectionSection
        eyebrow="Dress Collection"
        title="Modern women’s dress collections"
        subtitle="These home page collection images are design images only. Your actual product images will show on the Dress product page when you add products from admin."
        items={dressCollection}
        buttonText="Explore More Dress Collection"
        to="/dress"
      />

      <CollectionSection
        eyebrow="Jewellery Collection"
        title="Blue-white glowing jewellery picks"
        subtitle="Jewellery page product cards will automatically show the images you upload from admin product management."
        items={jewelleryCollection}
        buttonText="Explore More Jewels"
        to="/jewellery"
      />
    </main>
  );
}
