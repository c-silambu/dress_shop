import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Phone, Sparkles, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Auth({ registerMode = false }) {
  const [isRegister, setIsRegister] = useState(registerMode);
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isRegister) await register(form);
      else await login(form.phone, form.password);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Authentication failed");
    }
  };

  const fields = [
    ...(isRegister ? [
      { name: "name", placeholder: "User name", icon: User, required: true },
      { name: "email", placeholder: "Email", icon: Mail, required: false },
    ] : []),
    { name: "phone", placeholder: "Phone number", icon: Phone, required: true },
  ];

  return (
    <section className="page-shell">
      <div className="section-wrap grid min-h-[calc(100vh-74px)] items-center gap-10 py-10 md:grid-cols-[1fr_480px]">
        <div className="hidden md:block">
          <p className="editorial-kicker">Women's Styles</p>
          <h1 className="mt-4 max-w-2xl text-5xl font-black leading-tight tracking-tight text-[#15120f]">
            {isRegister ? "Create your boutique shopping account" : "Welcome back to your boutique account"}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#756f66]">
            Login to manage cart, favourites, checkout, and order tracking for dresses and jewellery.
          </p>
          <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
            {["Secure login", "Track orders", "Save favourites"].map((item) => (
              <div key={item} className="border border-[#e9e0d7] bg-white p-4">
                <Sparkles className="h-4 w-4 text-[#a91d4b]" />
                <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-[#15120f]">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="fashion-panel p-6 md:p-8">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-[#15120f] text-white">
              {isRegister ? <User size={28} /> : <Lock size={28} />}
            </div>
            <p className="editorial-kicker">Account</p>
            <h2 className="mt-3 text-4xl font-black text-[#15120f]">{isRegister ? "Register" : "Login"}</h2>
            <p className="mt-2 text-sm text-[#756f66]">{isRegister ? "Create your account and start shopping" : "Enter phone number and password"}</p>
          </div>

          <div className="space-y-4">
            {fields.map(({ name, placeholder, icon: Icon, required }) => (
              <div key={name} className="relative">
                <Icon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a91d4b]" />
                <input name={name} onChange={handleChange} placeholder={placeholder} className="input input-with-leading-icon" required={required} />
              </div>
            ))}

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a91d4b]" />
              <input
                name="password"
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input input-with-leading-icon input-with-trailing-icon"
                required
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#756f66] hover:text-[#a91d4b]">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button className="btn-primary mt-6 w-full">{isRegister ? "Create Account" : "Login"}</button>
          <button type="button" onClick={() => setIsRegister((value) => !value)} className="btn-soft mt-3 w-full">
            {isRegister ? "Already have an account? Login" : "New user? Create account"}
          </button>
        </form>
      </div>
    </section>
  );
}
