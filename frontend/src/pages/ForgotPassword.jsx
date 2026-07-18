import React, { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError(""); setMessage(""); setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send reset email");
    } finally { setLoading(false); }
  };

  return <section className="page-shell">
    <div className="section-wrap flex min-h-[calc(100vh-74px)] items-center justify-center py-10">
      <form onSubmit={submit} className="fashion-panel w-full max-w-lg p-6 md:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[#15120f] text-white"><Mail size={28} /></div>
        <h1 className="mt-5 text-center text-4xl font-black text-[#15120f]">Forgot password?</h1>
        <p className="mt-2 text-center text-sm leading-6 text-[#756f66]">Enter your registered email. We will send a reset link valid for 15 minutes.</p>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="input mt-7" autoComplete="email" required />
        {message && <div className="mt-4 border border-green-200 bg-green-50 p-3 text-sm font-bold text-green-800">{message}</div>}
        {error && <div role="alert" className="mt-4 border border-[#e6b8c5] bg-[#fff1f5] p-3 text-sm font-bold text-[#8f163d]">{error}</div>}
        <button disabled={loading} className="btn-primary mt-5 w-full disabled:opacity-60">{loading ? "Sending..." : "Send reset link"}</button>
        <Link to="/login" className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-[#a91d4b]"><ArrowLeft size={16} /> Back to login</Link>
      </form>
    </div>
  </section>;
}
