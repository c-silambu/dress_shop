import React, { useState } from "react";
import { BarChart3, LogOut, Menu, Package, ShoppingBag, Users, X } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

const links = [
  { label: "Dashboard", to: "/admin", icon: BarChart3 },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
  { label: "Users", to: "/admin/users", icon: Users },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Mobile topbar */}
      <div className="flex items-center justify-between bg-blue-950 px-4 py-3 lg:hidden">
        <Link to="/admin" className="flex items-center gap-2">
          <img src="/logo.png" alt="logo" className="h-10 w-10 rounded-full bg-white object-cover" />
          <span className="text-lg font-black text-white">Admin</span>
        </Link>
        <button onClick={() => setSideOpen((v) => !v)} className="rounded-full bg-white/10 p-2 text-white">
          {sideOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${sideOpen ? "block" : "hidden"} bg-blue-950 p-4 text-white lg:block lg:min-h-screen lg:w-72`}>
        <Link to="/admin" className="mb-8 hidden items-center gap-3 rounded-[1.5rem] bg-white/10 p-3 lg:flex">
          <img src="/logo.png" alt="Women's Styles logo" className="h-14 w-14 rounded-full bg-white object-cover" />
          <div>
            <h2 className="text-xl font-black">Women's Styles</h2>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">Admin</p>
          </div>
        </Link>

        <nav className="grid gap-2">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                onClick={() => setSideOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition ${
                    isActive ? "bg-white text-blue-700 shadow-lg" : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon className="h-5 w-5" /> {item.label}
              </NavLink>
            );
          })}
        </nav>

        <button onClick={logout} className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-pink-500 px-4 py-3 font-black text-white transition hover:bg-pink-600">
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
