import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Heart, Home, MoreVertical, ShoppingBag, User, X } from "lucide-react";

const menuItems = [
  { name: "Home", path: "/" },
  { name: "Women's Dress", path: "/dress" },
  { name: "Jewellery", path: "/jewellery" },
  { name: "About", path: "/about" },
];

const bottomNav = [
  { icon: Home, path: "/", label: "Home" },
  { icon: Heart, path: "/favourites", label: "Wishlist" },
  { icon: ShoppingBag, path: "/cart", label: "Cart" },
  { icon: User, path: "/profile", label: "Profile" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Top navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/95 shadow-sm backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-400/30 blur-md group-hover:bg-pink-400/30 transition" />
              <img src="/logo.png" alt="logo" className="relative h-10 w-10 rounded-full object-cover ring-2 ring-blue-200 group-hover:ring-pink-300 transition md:h-12 md:w-12" />
            </div>
            <div>
              <p className="text-base font-black leading-none text-slate-900 md:text-xl">Women's Styles</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-blue-500">Fashion & Jewellery</p>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-0.5 rounded-2xl border border-slate-100 bg-slate-50 p-1 md:flex">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    isActive ? "bg-blue-600 text-white shadow-md shadow-blue-300/40" : "text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop icons */}
          <div className="hidden items-center gap-1.5 md:flex">
            {[{ to: "/favourites", icon: Heart, hover: "hover:bg-pink-500" }, { to: "/cart", icon: ShoppingBag, hover: "hover:bg-blue-600" }, { to: "/profile", icon: User, hover: "hover:bg-slate-800" }].map(({ to, icon: Icon, hover }) => (
              <Link key={to} to={to} className={`rounded-xl bg-slate-100 p-2.5 text-slate-600 transition hover:text-white ${hover}`}>
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>

          {/* Mobile three-dot */}
          <button className="rounded-xl bg-slate-100 p-2.5 text-slate-600 md:hidden" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="h-5 w-5" /> : <MoreVertical className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile dropdown menu */}
        {open && (
          <div className="border-t border-slate-100 bg-white/98 px-3 pb-4 pt-2 shadow-2xl md:hidden">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* Mobile bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/80 bg-white/98 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNav.map(({ icon: Icon, path, label }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} className="flex flex-col items-center gap-0.5 px-3 py-1">
                <div className={`rounded-xl p-2 transition ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-300/50" : "text-slate-400"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-[10px] font-semibold ${active ? "text-blue-600" : "text-slate-400"}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
