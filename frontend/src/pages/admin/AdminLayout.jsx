import React, { useState } from "react";
import { BarChart3, ChevronRight, LogOut, Menu, Package, ShoppingBag, Users, X, Tags, Store } from "lucide-react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const links = [
  { label: "Dashboard", to: "/admin", icon: BarChart3 },
  { label: "Categories", to: "/admin/categories", icon: Tags },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Store & Offers", to: "/admin/commerce", icon: Store },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sideOpen, setSideOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const navItems = (onClick) => links.map((item) => {
    const Icon = item.icon;
    const active = item.to === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(item.to);
    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.to === "/admin"}
        onClick={onClick}
        className={`group flex items-center gap-3 border px-4 py-3.5 font-black transition ${
          active ? "border-[#d6b36a] bg-[#d6b36a] text-[#15120f]" : "border-white/10 text-white/62 hover:border-white/25 hover:text-white"
        }`}
      >
        <Icon className="h-5 w-5" />
        <span className="text-sm">{item.label}</span>
        {active && <ChevronRight className="ml-auto h-4 w-4" />}
      </NavLink>
    );
  });

  return (
    <div className="admin-shell min-h-screen bg-[#0f0d0a] text-white">
      <aside className="admin-sidebar hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-white/10 lg:bg-[#15120f]">
        <Link to="/admin" className="flex items-center gap-3 px-6 py-7">
          <img src="/logo.png" alt="Women's Styles" className="h-12 w-12 rounded-full bg-white object-cover p-1" />
          <div>
            <p className="text-lg font-black tracking-tight">Women's Styles</p>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#d6b36a]">Admin Studio</p>
          </div>
        </Link>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4">{navItems()}<Link to="/" className="flex items-center gap-3 border border-white/10 px-4 py-3.5 text-sm font-black text-white/60"><Store className="h-5 w-5"/>View Storefront</Link></nav>

        <div className="p-4">
          <button onClick={logout} className="flex w-full items-center gap-3 border border-white/10 px-4 py-3.5 text-sm font-black text-white/58 transition hover:border-[#a91d4b] hover:text-[#ff9bb7]">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#15120f]/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link to="/admin" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Women's Styles" className="h-9 w-9 rounded-full bg-white object-cover p-1" />
          <span className="text-base font-black">Admin Studio</span>
        </Link>
        <button onClick={() => setSideOpen((v) => !v)} className="flex h-10 w-10 items-center justify-center border border-white/10 text-white/80">
          {sideOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {sideOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSideOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-[#15120f] p-4">
            <div className="mb-5 flex items-center gap-3 px-2 py-3">
              <img src="/logo.png" alt="Women's Styles" className="h-11 w-11 rounded-full bg-white object-cover p-1" />
              <div>
                <p className="font-black">Women's Styles</p>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#d6b36a]">Admin Studio</p>
              </div>
            </div>
            <nav className="flex-1 space-y-2">{navItems(() => setSideOpen(false))}</nav>
            <button onClick={logout} className="border border-white/10 px-4 py-3 text-sm font-black text-[#ff9bb7]">Logout</button>
          </div>
        </div>
      )}

      <main className="admin-main min-h-screen lg:pl-72">
        <div className="admin-content p-4 pb-24 md:p-8 lg:pb-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
