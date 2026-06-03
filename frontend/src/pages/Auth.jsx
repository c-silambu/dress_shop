import React, { useState } from "react";
import { Eye, Lock, Phone, Sparkles, User, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Auth({ registerMode = false }) {
  const [isRegister, setIsRegister] = useState(registerMode);
  const [form, setForm] = useState({});
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (isRegister) {
        await register(form);
      } else {
        await login(form.phone, form.password);
      }

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <section className="relative min-h-[80vh] overflow-hidden bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-12">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div className="hidden md:block">
          <div className="rounded-[2.5rem] bg-gradient-to-br from-blue-700 via-blue-600 to-pink-500 p-1 shadow-2xl shadow-blue-200">
            <div className="rounded-[2.4rem] bg-white/10 p-10 text-white backdrop-blur-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-sm font-bold">
                <Sparkles size={18} />
                Premium Fashion Store
              </div>

              <h1 className="text-5xl font-black leading-tight">
                {isRegister ? "Create your fashion account" : "Welcome back"}
              </h1>

              <p className="mt-5 max-w-md text-lg text-white/85">
                Login or register to manage cart, favourites, checkout and your
                latest Women’s Styles orders.
              </p>

              <div className="mt-10 grid gap-4">
                {["Secure login", "Track orders", "Save favourites"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-white/15 px-5 py-4 font-bold backdrop-blur"
                    >
                      ✨ {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[2.5rem] border border-blue-100 bg-white/90 p-8 shadow-2xl shadow-blue-100 backdrop-blur md:p-10"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              {isRegister ? <User size={30} /> : <Lock size={30} />}
            </div>

            <p className="font-bold uppercase tracking-[0.25em] text-blue-600">
              Women’s Styles
            </p>

            <h2 className="mt-3 text-4xl font-black text-blue-950">
              {isRegister ? "Register" : "Login"}
            </h2>

            <p className="mt-2 text-slate-500">
              {isRegister
                ? "Create your account and start shopping"
                : "Enter your phone number and password"}
            </p>
          </div>

          <div className="space-y-4">
            {isRegister && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" />
                  <input
                    name="name"
                    onChange={handleChange}
                    placeholder="User name"
                    className="w-full rounded-2xl border border-blue-100 bg-blue-50/60 py-4 pl-12 pr-4 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" />
                  <input
                    name="email"
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full rounded-2xl border border-blue-100 bg-blue-50/60 py-4 pl-12 pr-4 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" />
              <input
                name="phone"
                onChange={handleChange}
                placeholder="Phone number"
                className="w-full rounded-2xl border border-blue-100 bg-blue-50/60 py-4 pl-12 pr-4 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" />
              <input
                name="password"
                onChange={handleChange}
                type="password"
                placeholder="Password"
                className="w-full rounded-2xl border border-blue-100 bg-blue-50/60 py-4 pl-12 pr-12 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                required
              />
              <Eye className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <button className="mt-6 w-full rounded-full bg-gradient-to-r from-blue-700 to-blue-500 py-4 font-black text-white shadow-xl shadow-blue-200 transition hover:-translate-y-1 hover:shadow-2xl">
            {isRegister ? "Create Account" : "Login"}
          </button>

          <button
            type="button"
            onClick={() => setIsRegister((value) => !value)}
            className="mt-5 w-full rounded-full border border-blue-100 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
          >
            {isRegister
              ? "Already have an account? Login"
              : "New user? Create account"}
          </button>
        </form>
      </div>
    </section>
  );
}