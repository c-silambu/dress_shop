import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  PackageCheck,
  Phone,
  User,
  ChevronRight,
  Heart,
  ShoppingBag,
  Sparkles,
  Mail,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const menuItems = [
    {
      icon: PackageCheck,
      label: "My Orders",
      sub: "Track & manage your orders",
      action: () => navigate("/orders"),
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      accent: "group-hover:bg-blue-600",
    },
    {
      icon: Heart,
      label: "Favourites",
      sub: "Your saved wishlist items",
      action: () => navigate("/favourites"),
      iconBg: "bg-pink-100",
      iconColor: "text-pink-500",
      accent: "group-hover:bg-pink-500",
    },
    {
      icon: ShoppingBag,
      label: "My Cart",
      sub: "View items in your bag",
      action: () => navigate("/cart"),
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      accent: "group-hover:bg-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fbff] pb-28 md:pb-12">
      {/* ── Hero Banner ── */}
      <div className="luxury-gradient relative overflow-hidden px-4 pb-24 pt-10">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-pink-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 left-6 h-36 w-36 rounded-full bg-blue-300/20 blur-2xl" />
        <div className="pointer-events-none absolute right-1/3 top-1/2 h-24 w-24 rounded-full bg-white/10 blur-xl" />

        {/* Badge */}
        <div className="relative mx-auto flex max-w-sm justify-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur ring-1 ring-white/20">
            <Sparkles className="h-3 w-3 text-yellow-300" />
            Women's Styles Member
          </span>
        </div>

        {/* Avatar */}
        <div className="relative mx-auto flex max-w-sm flex-col items-center">
          <div className="glow relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 backdrop-blur ring-4 ring-white/40">
            <span className="text-3xl font-black text-white">{initials}</span>
            <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-400 ring-2 ring-white">
              <span className="h-2 w-2 rounded-full bg-white" />
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-white">
            {user?.name || "User"}
          </h1>
          <p className="mt-0.5 text-sm text-blue-200/80">
            {user?.email || user?.phone || "Member"}
          </p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="relative mx-auto max-w-md px-4">
        {/* Info Glass Cards */}
        <div className="-mt-10 grid grid-cols-2 gap-3">
          <div className="glass-card rounded-2xl p-4">
            <div className="mb-1.5 flex items-center gap-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100">
                <User className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Name
              </p>
            </div>
            <p className="truncate text-sm font-black text-slate-900">
              {user?.name || "—"}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-4">
            <div className="mb-1.5 flex items-center gap-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-pink-100">
                <Phone className="h-3.5 w-3.5 text-pink-500" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Phone
              </p>
            </div>
            <p className="truncate text-sm font-black text-slate-900">
              {user?.phone || "—"}
            </p>
          </div>
        </div>

        {/* Section Label */}
        <p className="mb-2 mt-6 px-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
          Quick Access
        </p>

        {/* Menu Items */}
        <div className="space-y-2.5">
          {menuItems.map(({ icon: Icon, label, sub, action, iconBg, iconColor, accent }) => (
            <button
              key={label}
              onClick={action}
              className="group glass-card flex w-full items-center gap-4 rounded-2xl px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} transition-all duration-200 ${accent} group-hover:[&>svg]:text-white`}
              >
                <Icon className={`h-5 w-5 ${iconColor} transition-colors duration-200`} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-black text-slate-900">{label}</p>
                <p className="text-xs text-slate-400">{sub}</p>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white">
                <ChevronRight className="h-4 w-4 text-slate-400 transition-colors duration-200 group-hover:text-white" />
              </div>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
            Account
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-red-50 py-4 text-sm font-black text-red-500 ring-1 ring-red-100 transition-all duration-200 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-200 active:scale-[0.98]"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>

        {/* Footer note */}
        <p className="mt-5 text-center text-[11px] text-slate-400">
          Women's Styles · Member Account
        </p>
      </div>
    </div>
  );
}
