import React, { useState } from "react";
import { Eye, EyeOff, Lock, ShieldCheck, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post("/admin/login", form);
      localStorage.setItem("adminToken", data.token);
      navigate("/admin");
    } catch {
      alert("Invalid admin login");
    }
  };

  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden bg-blue-950 p-4">
      <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />
      <form onSubmit={handleSubmit} className="relative w-full max-w-md rounded-[2.5rem] border border-white/20 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-2xl">
        <div className="mb-8 text-center">
          <img src="/logo.png" alt="logo" className="mx-auto h-20 w-20 rounded-full bg-white object-cover ring-4 ring-white/20" />
          <h1 className="mt-4 text-4xl font-black">Admin Login</h1>
          <p className="mt-1 text-blue-200">Women's Styles control panel</p>
        </div>

        <label className="relative block">
          <UserRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-200" />
          <input
            name="username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full rounded-2xl border border-white/20 bg-white/10 p-4 pl-12 font-bold outline-none placeholder:text-blue-300 focus:border-white"
            placeholder="Username"
            required
          />
        </label>

        <label className="relative mt-4 block">
          <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-200" />
          <input
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            type={showPassword ? "text" : "password"}
            className="w-full rounded-2xl border border-white/20 bg-white/10 p-4 pl-12 pr-12 font-bold outline-none placeholder:text-blue-300 focus:border-white"
            placeholder="Password"
            required
          />
          <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white">
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </label>

        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-white py-4 font-black text-blue-700 shadow-xl transition hover:-translate-y-1">
          <ShieldCheck className="h-5 w-5" /> Login Securely
        </button>
      </form>
    </section>
  );
}
