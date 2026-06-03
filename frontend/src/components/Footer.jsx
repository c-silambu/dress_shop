import React from "react";
import { MapPin, Phone, Sparkles } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-20 overflow-hidden bg-blue-950 text-white">
      <div className="relative mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-pink-500/20 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Women’s Styles logo" className="h-16 w-16 rounded-full bg-white object-cover ring-4 ring-white/20" />
            <div>
              <h2 className="text-3xl font-black">Women’s Styles</h2>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-200">Premium Store</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-blue-100">
            Modern women’s dress and jewellery shopping with premium blue, white and soft pink styling.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-blue-100">
            <Sparkles className="h-4 w-4" /> Fashion • Jewellery • Style
          </div>
        </div>

        <div className="relative rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
          <h3 className="text-lg font-black">Visit our store</h3>
          <p className="mt-4 flex gap-3 text-blue-100">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-pink-200" />
            Aruppukottai Main road, Bus stand, Kariyapatti - 626 106.
          </p>
        </div>

        <div className="relative rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
          <h3 className="text-lg font-black">Contact</h3>
          <p className="mt-4 flex items-center gap-3 text-blue-100">
            <Phone className="h-5 w-5 text-pink-200" /> 91506 48548, 8098954035
          </p>
          <a
            href="https://instagram.com/womensstyles"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-black text-blue-700 transition hover:-translate-y-1 hover:bg-pink-50"
          >
            <FaInstagram className="h-5 w-5" /> Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
