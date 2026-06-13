import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, PackageCheck, Phone, User, ChevronRight, Heart, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: PackageCheck, label: "My Orders", sub: "Track your orders", action: () => navigate("/orders"), color: "bg-blue-50 text-blue-600" },
    { icon: Heart, label: "Favourites", sub: "Saved items", action: () => navigate("/favourites"), color: "bg-pink-50 text-pink-500" },
    { icon: ShoppingBag, label: "Cart", sub: "Items in bag", action: () => navigate("/cart"), color: "bg-indigo-50 text-indigo-600" },
  ];

  return (
    <section className="min-h-screen bg-slate-50 pb-24 md:pb-10">
      {/* Header banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-4 pb-16 pt-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-6 left-10 h-28 w-28 rounded-full bg-pink-500/20 blur-xl" />
        <div className="relative mx-auto max-w-lg text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur ring-4 ring-white/30">
            <User className="h-10 w-10 text-white" />
          </div>
          <h1 className="mt-3 text-2xl font-black text-white">{user?.name || "User"}</h1>
          <p className="mt-1 text-sm text-blue-200">Women's Styles Member</p>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4">
        {/* Info cards */}
        <div className="-mt-8 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-slate-200/80">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Name</p>
            <p className="mt-1 truncate text-sm font-black text-slate-900">{user?.name || "—"}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-slate-200/80">
            <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400"><Phone className="h-3 w-3" /> Phone</p>
            <p className="mt-1 truncate text-sm font-black text-slate-900">{user?.phone || "—"}</p>
          </div>
        </div>

        {/* Menu items */}
        <div className="mt-4 space-y-2">
          {menuItems.map(({ icon: Icon, label, sub, action, color }) => (
            <button key={label} onClick={action} className="flex w-full items-center gap-4 rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-slate-200/80 transition hover:ring-blue-200">
              <div className={`rounded-xl p-2.5 ${color}`}><Icon className="h-5 w-5" /></div>
              <div className="flex-1 text-left">
                <p className="text-sm font-black text-slate-900">{label}</p>
                <p className="text-xs text-slate-400">{sub}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button onClick={logout} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 py-4 text-sm font-black text-red-500 ring-1 ring-red-100 transition hover:bg-red-100">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </section>
  );
}
