import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, PackageCheck, Phone, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleOrders = () => {
    navigate("/orders");
  };

  return (
    <section className="min-h-[70vh] bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-14">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-blue-100">
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-pink-500 p-8 text-white">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/30 backdrop-blur">
                <User size={44} />
              </div>

              <div>
                <h1 className="text-4xl font-black">My Profile</h1>
                <p className="mt-2 text-white/80">
                  Manage your account and orders
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-8 md:grid-cols-2">
            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-500">
                Customer Name
              </p>
              <h2 className="mt-2 text-2xl font-black text-blue-950">
                {user?.name || "User"}
              </h2>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-pink-50 p-6">
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-pink-500">
                <Phone size={17} />
                Phone Number
              </p>
              <h2 className="mt-2 text-2xl font-black text-blue-950">
                {user?.phone || "Not available"}
              </h2>
            </div>
          </div>

          <div className="flex flex-col gap-4 px-8 pb-8 sm:flex-row">
            <button
              onClick={handleOrders}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-4 font-bold text-white shadow-xl shadow-blue-200 transition hover:-translate-y-1 hover:bg-blue-700"
            >
              <PackageCheck size={20} />
              My Orders
            </button>

            <button
              onClick={logout}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-500 px-6 py-4 font-bold text-white shadow-xl shadow-red-100 transition hover:-translate-y-1 hover:bg-red-600"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}