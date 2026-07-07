import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Heart, Home, Menu, ShoppingBag, User, X } from "lucide-react";

const menuItems = [
  { name: "Home", path: "/" },
  { name: "Dresses", path: "/dress" },
  { name: "Jewellery", path: "/jewellery" },
  { name: "About", path: "/about" },
];

const bottomNav = [
  { icon: Home, path: "/", label: "Home" },
  { icon: Heart, path: "/favourites", label: "Wishlist" },
  { icon: ShoppingBag, path: "/cart", label: "Cart" },
  { icon: User, path: "/profile", label: "Profile" },
];

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <img src="/logo.png" alt="Women's Styles" className="h-10 w-10 rounded-full border border-[#e6d8cc] bg-white object-cover p-0.5 md:h-11 md:w-11" />
      <div>
        <p className="text-lg font-black leading-none tracking-tight text-[#15120f] md:text-2xl">Women's Styles</p>
        <p className="mt-1 text-[9px] font-black uppercase tracking-[0.32em] text-[#a91d4b]">Dress & Jewellery</p>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#e9e0d7] bg-[#fffdf9]/95 backdrop-blur-xl">
        <div className="section-wrap flex h-[74px] items-center justify-between">
          <Link to="/" onClick={() => setOpen(false)}>
            <BrandMark />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-bold transition ${
                    isActive ? "text-[#a91d4b]" : "text-[#15120f] hover:text-[#a91d4b]"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {[
              { to: "/favourites", icon: Heart, label: "Wishlist" },
              { to: "/cart", icon: ShoppingBag, label: "Cart" },
              { to: "/profile", icon: User, label: "Profile" },
            ].map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                title={label}
                className="flex h-10 w-10 items-center justify-center border border-transparent text-[#15120f] transition hover:border-[#e9e0d7] hover:bg-white hover:text-[#a91d4b]"
              >
                <Icon className="h-5 w-5" />
              </Link>
            ))}
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center border border-[#e9e0d7] bg-white text-[#15120f] md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-[#e9e0d7] bg-[#fffdf9] px-4 py-3 shadow-xl md:hidden">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block border-b border-[#eee5dc] px-1 py-3 text-sm font-black uppercase tracking-[0.18em] ${
                    isActive ? "text-[#a91d4b]" : "text-[#15120f]"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#e9e0d7] bg-[#fffdf9]/98 backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-4">
          {bottomNav.map(({ icon: Icon, path, label }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} className="flex flex-col items-center gap-1 py-2.5">
                <Icon className={`h-5 w-5 ${active ? "text-[#a91d4b]" : "text-[#756f66]"}`} />
                <span className={`text-[10px] font-bold ${active ? "text-[#a91d4b]" : "text-[#756f66]"}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
