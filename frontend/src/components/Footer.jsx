import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-[#e9e0d7] bg-[#15120f] text-white">
      <div className="section-wrap py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Women's Styles" className="h-12 w-12 rounded-full bg-white object-cover p-1" />
              <div>
                <p className="text-2xl font-black tracking-tight">Women's Styles</p>
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#d6b36a]">Dress & Jewellery</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/58">
              A polished fashion store for everyday dresses, occasion wear, jewellery, and styling details.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {["/", "/dress", "/jewellery", "/about"].map((path, i) => (
                <Link key={path} to={path} className="border border-white/12 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/70 transition hover:border-[#d6b36a] hover:text-[#d6b36a]">
                  {["Home", "Dresses", "Jewellery", "About"][i]}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="editorial-kicker text-[#d6b36a]">Visit</p>
            <p className="mt-4 flex gap-3 text-sm leading-7 text-white/64">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#d6b36a]" />
              Aruppukottai Main road, Bus stand, Kariyapatti - 626 106.
            </p>
          </div>

          <div>
            <p className="editorial-kicker text-[#d6b36a]">Contact</p>
            <p className="mt-4 flex items-center gap-3 text-sm text-white/64">
              <Phone className="h-4 w-4 text-[#d6b36a]" /> 91506 48548
            </p>
            <p className="mt-2 pl-7 text-sm text-white/64">8098954035</p>
            <a
              href="https://instagram.com/womensstyles"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 border border-[#d6b36a] px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#d6b36a] transition hover:bg-[#d6b36a] hover:text-[#15120f]"
            >
              <FaInstagram className="h-4 w-4" /> Instagram
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5 text-center text-xs text-white/35">
          © {new Date().getFullYear()} Women's Styles. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
