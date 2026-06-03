import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";

const menuItems = [
  { name: "Home", path: "/" },
  { name: "Women’s Dress", path: "/dress" },
  { name: "Jewellery", path: "/jewellery" },
  { name: "About", path: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100/80 bg-white/90 shadow-sm backdrop-blur-2xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="group flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Women’s Styles logo"
            className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-200 transition group-hover:scale-105 group-hover:ring-pink-200"
          />
          <div>
            <p className="text-lg font-black leading-none text-blue-950 md:text-2xl">Women’s Styles</p>
            <p className="hidden text-[10px] font-bold uppercase tracking-[0.25em] text-blue-500 md:block">Fashion & Jewellery</p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-blue-100 bg-white/80 p-1 shadow-lg shadow-blue-950/5 md:flex">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-full px-5 py-2 text-sm font-bold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-300/50"
                    : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button className="rounded-full bg-blue-50 p-3 text-blue-700 transition hover:-translate-y-1 hover:bg-blue-600 hover:text-white">
            <Search className="h-5 w-5" />
          </button>
          <Link className="rounded-full bg-blue-50 p-3 text-blue-700 transition hover:-translate-y-1 hover:bg-pink-500 hover:text-white" to="/favourites">
            <Heart className="h-5 w-5" />
          </Link>
          <Link className="rounded-full bg-blue-50 p-3 text-blue-700 transition hover:-translate-y-1 hover:bg-blue-600 hover:text-white" to="/cart">
            <ShoppingBag className="h-5 w-5" />
          </Link>
          <Link className="rounded-full bg-blue-50 p-3 text-blue-700 transition hover:-translate-y-1 hover:bg-blue-950 hover:text-white" to="/profile">
            <User className="h-5 w-5" />
          </Link>
        </div>

        <button className="rounded-full bg-blue-50 p-3 text-blue-700 md:hidden" onClick={() => setOpen((value) => !value)}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-blue-100 bg-white px-4 py-4 shadow-xl md:hidden">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 font-bold text-slate-700 hover:bg-blue-50"
            >
              {item.name}
            </Link>
          ))}
          <div className="mt-4 flex gap-3 px-4 text-blue-700">
            <Link to="/favourites" className="rounded-full bg-blue-50 p-3"><Heart /></Link>
            <Link to="/cart" className="rounded-full bg-blue-50 p-3"><ShoppingBag /></Link>
            <Link to="/profile" className="rounded-full bg-blue-50 p-3"><User /></Link>
          </div>
        </div>
      )}
    </header>
  );
}
