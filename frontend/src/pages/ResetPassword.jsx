import React, { useState } from "react";
import { Lock } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api";

export default function ResetPassword() {
  const { token } = useParams();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault(); setError("");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match");
    setLoading(true);
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password: form.password });
      setMessage(data.message);
    } catch (err) { setError(err.response?.data?.message || "Unable to reset password"); }
    finally { setLoading(false); }
  };

  return <section className="page-shell">
    <div className="section-wrap flex min-h-[calc(100vh-74px)] items-center justify-center py-10">
      <form onSubmit={submit} className="fashion-panel w-full max-w-lg p-6 md:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[#15120f] text-white"><Lock size={28} /></div>
        <h1 className="mt-5 text-center text-4xl font-black text-[#15120f]">Set new password</h1>
        <div className="mt-7 space-y-4">
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="New password" className="input" minLength={6} autoComplete="new-password" required />
          <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Confirm new password" className="input" minLength={6} autoComplete="new-password" required />
        </div>
        {message && <div className="mt-4 border border-green-200 bg-green-50 p-3 text-sm font-bold text-green-800">{message}</div>}
        {error && <div role="alert" className="mt-4 border border-[#e6b8c5] bg-[#fff1f5] p-3 text-sm font-bold text-[#8f163d]">{error}</div>}
        {!message && <button disabled={loading} className="btn-primary mt-5 w-full disabled:opacity-60">{loading ? "Changing..." : "Change password"}</button>}
        {message && <Link to="/login" className="btn-primary mt-5 block w-full text-center">Go to login</Link>}
      </form>
    </div>
  </section>;
}
