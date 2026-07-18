import React, { useState } from "react";
import { Eye, EyeOff, Lock, ShieldCheck, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/admin/login", form);
      localStorage.setItem("adminToken", data.token);
      navigate("/admin");
    } catch {
      setError("Invalid username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login flex min-h-screen items-center justify-center bg-[#0f0d0a] p-4">
      <div className="admin-login-card grid w-full max-w-5xl overflow-hidden border border-white/10 bg-[#15120f] md:grid-cols-[1fr_430px]">
        <div className="hidden p-10 md:flex md:flex-col md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Women's Styles" className="h-12 w-12 rounded-full bg-white object-cover p-1" />
              <div>
                <p className="text-2xl font-black text-white">Women's Styles</p>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#d6b36a]">Admin Studio</p>
              </div>
            </div>
            <h1 className="mt-14 max-w-lg text-5xl font-black leading-tight tracking-tight text-white">
              Manage your fashion store with clarity.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/45">
              Products, orders, customers, and revenue stay in one focused workspace.
            </p>
          </div>
          <p className="text-xs font-bold text-white/28">Secure access only</p>
        </div>

        <form onSubmit={handleSubmit} className="border-l border-white/10 bg-white p-7 md:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center bg-[#15120f] text-white">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <p className="editorial-kicker">Admin Login</p>
            <h2 className="mt-3 text-4xl font-black text-[#15120f]">Welcome back</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-[#756f66]">Username</label>
              <div className="relative">
                <UserRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a91d4b]" />
                <input
                  name="username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="input pl-12"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-[#756f66]">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a91d4b]" />
                <input
                  name="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  type={showPassword ? "text" : "password"}
                  className="input pl-12 pr-12"
                  placeholder="Enter password"
                  required
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#756f66] hover:text-[#a91d4b]">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {error && <div className="mt-4 border border-[#f0d5dc] bg-[#fff1f5] px-4 py-3 text-sm font-bold text-[#a91d4b]">{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-60">
            <ShieldCheck className="h-5 w-5" />
            {loading ? "Signing in..." : "Sign In Securely"}
          </button>
        </form>
      </div>
    </div>
  );
}
