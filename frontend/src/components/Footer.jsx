import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="logo" className="h-11 w-11 rounded-2xl object-cover bg-white" />
              <div>
                <p className="text-lg font-black">Women's Styles</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Fashion & Jewellery</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">Modern women's dress and jewellery shopping with a premium experience.</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {["/", "/dress", "/jewellery", "/about"].map((path, i) => (
                <Link key={path} to={path} className="rounded-lg bg-slate-800 px-3 py-1.5 font-semibold text-slate-300 transition hover:bg-blue-600 hover:text-white">
                  {["Home", "Dress", "Jewellery", "About"][i]}
                </Link>
              ))}
            </div>
          </div>

          {/* Store */}
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Our Store</p>
            <p className="flex gap-2 text-sm text-slate-300">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pink-400" />
              Aruppukottai Main road, Bus stand, Kariyapatti - 626 106.
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Contact</p>
            <p className="flex items-center gap-2 text-sm text-slate-300">
              <Phone className="h-4 w-4 text-pink-400" /> 91506 48548
            </p>
            <p className="mt-1 text-sm text-slate-300 pl-6">8098954035</p>
            <a
              href="https://instagram.com/womensstyles"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2.5 text-sm font-black text-white transition hover:opacity-90"
            >
              <FaInstagram className="h-4 w-4" /> Follow on Instagram
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-5 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Women's Styles. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
