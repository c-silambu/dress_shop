import React, { useState } from "react";
import { BarChart3, LogOut, Menu, Package, ShoppingBag, Users, X, ChevronRight, Sparkles } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";

const links = [
  { label: "Dashboard", to: "/admin", icon: BarChart3, color: "from-violet-500 to-purple-600" },
  { label: "Products",  to: "/admin/products", icon: Package,  color: "from-blue-500 to-cyan-500" },
  { label: "Orders",   to: "/admin/orders",   icon: ShoppingBag, color: "from-emerald-500 to-teal-500" },
  { label: "Users",    to: "/admin/users",    icon: Users,    color: "from-rose-500 to-pink-500" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sideOpen, setSideOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1a1040 40%, #0f172a 100%)" }}>

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-72 lg:flex-col" style={{ background: "rgba(255,255,255,0.04)", borderRight: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(24px)" }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-7">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}>
            <img src="/logo.png" alt="logo" className="h-10 w-10 rounded-xl object-cover" />
            <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
              <Sparkles className="h-2.5 w-2.5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-base font-black text-white tracking-tight">Women's Styles</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#a78bfa" }}>Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-4">
          {links.map((item) => {
            const Icon = item.icon;
            const active = item.to === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3.5 font-bold transition-all duration-200 ${
                  active
                    ? "text-white shadow-lg"
                    : "text-white/50 hover:text-white/80"
                }`}
                style={active ? { background: "rgba(139,92,246,0.25)", border: "1px solid rgba(139,92,246,0.4)" } : { border: "1px solid transparent" }}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}>
                  <Icon className="h-4.5 w-4.5 text-white h-5 w-5" />
                </div>
                <span className="text-sm">{item.label}</span>
                {active && <ChevronRight className="ml-auto h-4 w-4 text-violet-300" />}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 font-bold text-white/50 transition hover:text-white"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <LogOut className="h-4 w-4 text-red-400" />
            </div>
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Top Bar ── */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 lg:hidden" style={{ background: "rgba(15,12,41,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Link to="/admin" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}>
            <img src="/logo.png" alt="logo" className="h-8 w-8 rounded-lg object-cover" />
          </div>
          <span className="text-base font-black text-white">Admin Panel</span>
        </Link>
        <button
          onClick={() => setSideOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-white/70 hover:text-white"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          {sideOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ── Mobile Drawer ── */}
      {sideOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSideOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 flex flex-col" style={{ background: "linear-gradient(160deg,#1a0a3e 0%,#0f172a 100%)", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex items-center gap-3 px-6 py-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}>
                <img src="/logo.png" alt="logo" className="h-10 w-10 rounded-xl object-cover" />
              </div>
              <div>
                <p className="text-base font-black text-white">Women's Styles</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300">Admin Panel</p>
              </div>
            </div>
            <nav className="flex-1 space-y-1 px-4">
              {links.map((item) => {
                const Icon = item.icon;
                const active = item.to === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(item.to);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/admin"}
                    onClick={() => setSideOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 font-bold transition-all ${active ? "text-white" : "text-white/50 hover:text-white/80"}`}
                    style={active ? { background: "rgba(139,92,246,0.25)", border: "1px solid rgba(139,92,246,0.4)" } : { border: "1px solid transparent" }}
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm">{item.label}</span>
                    {active && <ChevronRight className="ml-auto h-4 w-4 text-violet-300" />}
                  </NavLink>
                );
              })}
            </nav>
            <div className="p-4">
              <button onClick={logout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 font-bold text-red-400 hover:text-red-300" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="min-h-screen lg:pl-72">
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="fixed bottom-0 inset-x-0 z-40 flex lg:hidden" style={{ background: "rgba(15,12,41,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {links.map((item) => {
          const Icon = item.icon;
          const active = item.to === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              className="flex flex-1 flex-col items-center gap-1 py-3 transition"
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${active ? `bg-gradient-to-br ${item.color}` : ""}`}>
                <Icon className={`h-5 w-5 ${active ? "text-white" : "text-white/40"}`} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider ${active ? "text-violet-300" : "text-white/30"}`}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

    </div>
  );
}
