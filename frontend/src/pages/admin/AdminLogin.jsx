import React, { useState } from "react";
import { Eye, EyeOff, Lock, ShieldCheck, UserRound, Sparkles } from "lucide-react";
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
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1a1040 50%, #0f172a 100%)" }}>

      {/* Floating orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #10b981, transparent)" }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="relative w-full max-w-md">

        {/* Card */}
        <div className="rounded-3xl p-8" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(40px)", boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)" }}>

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl" style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", boxShadow: "0 20px 40px rgba(124,58,237,0.4)" }}>
              <img src="/logo.png" alt="logo" className="h-16 w-16 rounded-xl object-cover" />
              <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}>
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Welcome Back</h1>
            <p className="mt-1.5 text-sm font-medium" style={{ color: "#a78bfa" }}>Women's Styles · Admin Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest" style={{ color: "#a78bfa" }}>Username</label>
              <div className="relative">
                <UserRound className="absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 h-5 w-5" style={{ color: "#7c3aed" }} />
                <input
                  name="username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                  placeholder="Enter username"
                  required
                  onFocus={(e) => { e.target.style.border = "1px solid rgba(139,92,246,0.6)"; e.target.style.boxShadow = "0 0 0 4px rgba(139,92,246,0.15)"; }}
                  onBlur={(e) => { e.target.style.border = "1px solid rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest" style={{ color: "#a78bfa" }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: "#7c3aed" }} />
                <input
                  name="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-2xl py-4 pl-12 pr-12 text-sm font-bold text-white outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                  placeholder="Enter password"
                  required
                  onFocus={(e) => { e.target.style.border = "1px solid rgba(139,92,246,0.6)"; e.target.style.boxShadow = "0 0 0 4px rgba(139,92,246,0.15)"; }}
                  onBlur={(e) => { e.target.style.border = "1px solid rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 transition hover:text-white" style={{ color: "#7c3aed" }}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl px-4 py-3 text-sm font-bold text-red-300" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-black text-white transition-all duration-200 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", boxShadow: "0 16px 32px rgba(124,58,237,0.4)" }}
            >
              <ShieldCheck className="h-5 w-5" />
              {loading ? "Signing in…" : "Sign In Securely"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.25)" }}>
            Women's Styles Admin · Secure Access Only
          </p>
        </div>
      </div>
    </div>
  );
}
