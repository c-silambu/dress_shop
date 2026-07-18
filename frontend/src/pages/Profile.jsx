import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Heart, LogOut, PackageCheck, Phone, ShoppingBag, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const menuItems = [
    { icon: PackageCheck, label: "My Orders", sub: "Track and manage orders", action: () => navigate("/orders") },
    { icon: Heart, label: "Favourites", sub: "Saved wishlist items", action: () => navigate("/favourites") },
    { icon: ShoppingBag, label: "My Cart", sub: "View your shopping bag", action: () => navigate("/cart") },
  ];

  return (
    <section className="page-shell luxury-account luxury-profile">
      <div className="border-b border-[#e9e0d7] bg-white">
        <div className="section-wrap py-10 md:py-14">
          <p className="editorial-kicker">Member Account</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#15120f] md:text-5xl">Profile</h1>
        </div>
      </div>

      <div className="section-wrap grid gap-6 py-8 md:grid-cols-[360px_1fr] md:py-12">
        <aside className="profile-identity fashion-panel p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center bg-[#15120f] text-2xl font-black text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-black text-[#15120f]">{user?.name || "User"}</h2>
              <p className="truncate text-sm text-[#756f66]">{user?.email || user?.phone || "Member"}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            <div className="border border-[#e9e0d7] bg-[#fbfaf7] p-4">
              <p className="editorial-kicker text-[9px]">Name</p>
              <p className="mt-1 truncate text-sm font-black text-[#15120f]">{user?.name || "-"}</p>
            </div>
            <div className="border border-[#e9e0d7] bg-[#fbfaf7] p-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#a91d4b]" />
                <p className="editorial-kicker text-[9px]">Phone</p>
              </div>
              <p className="mt-1 truncate text-sm font-black text-[#15120f]">{user?.phone || "-"}</p>
            </div>
          </div>
        </aside>

        <div className="profile-menu space-y-3">
          {menuItems.map(({ icon: Icon, label, sub, action }) => (
            <button
              key={label}
              onClick={action}
              className="group flex w-full items-center gap-4 border border-[#e9e0d7] bg-white p-5 text-left transition hover:border-[#15120f]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#f6f0e8] text-[#a91d4b]">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-base font-black text-[#15120f]">{label}</p>
                <p className="text-sm text-[#756f66]">{sub}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-[#756f66] transition group-hover:translate-x-1 group-hover:text-[#a91d4b]" />
            </button>
          ))}

          <button onClick={logout} className="btn-soft w-full border-[#ead7df] text-[#a91d4b] hover:border-[#a91d4b]">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>
    </section>
  );
}
