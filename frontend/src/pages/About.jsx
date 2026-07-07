import React from "react";
import { Gem, ShoppingBag, Sparkles } from "lucide-react";

export default function About() {
  return (
    <section className="page-shell">
      <div className="section-wrap grid min-h-[70vh] items-center gap-10 py-12 md:grid-cols-[0.95fr_1.05fr] md:py-20">
        <div>
          <p className="editorial-kicker">About Us</p>
          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-[#15120f] md:text-6xl">
            Women's dress and jewellery, curated with boutique care.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#756f66]">
            Women's Styles brings together modern dress collections and jewellery picks for daily looks, celebrations, and gifting. The store is built to keep shopping simple, polished, and comfortable.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: ShoppingBag, label: "Fashion Picks" },
              { icon: Gem, label: "Jewellery Edit" },
              { icon: Sparkles, label: "Premium Feel" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="border border-[#e9e0d7] bg-white p-4">
                <Icon className="h-5 w-5 text-[#a91d4b]" />
                <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-[#15120f]">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img className="h-[420px] w-full object-cover" src="https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=900" alt="Dress collection" />
          <img className="mt-12 h-[420px] w-full object-cover" src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85" alt="Jewellery collection" />
        </div>
      </div>
    </section>
  );
}
