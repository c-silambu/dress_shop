import React, { useEffect, useState } from "react";
import {
  IndianRupee, Package, ShoppingBag, Users,
  TrendingUp, Clock, CheckCircle2, XCircle, Sparkles,
} from "lucide-react";
import api from "../../api/api";

const STAT_CONFIG = {
  totalIncome:      { label: "Total Revenue",      icon: IndianRupee,   grad: "from-violet-500 to-purple-700",  glow: "rgba(124,58,237,0.35)",  prefix: "₹" },
  totalProducts:    { label: "Total Products",     icon: Package,       grad: "from-blue-500 to-cyan-600",      glow: "rgba(59,130,246,0.35)" },
  totalUsers:       { label: "Total Customers",    icon: Users,         grad: "from-rose-500 to-pink-600",      glow: "rgba(244,63,94,0.35)" },
  todayTotalOrders: { label: "Today's Orders",     icon: ShoppingBag,   grad: "from-emerald-500 to-teal-600",   glow: "rgba(16,185,129,0.35)" },
  pendingOrders:    { label: "Pending Orders",     icon: Clock,         grad: "from-amber-500 to-orange-500",   glow: "rgba(245,158,11,0.35)" },
  deliveredOrders:  { label: "Delivered Orders",   icon: CheckCircle2,  grad: "from-green-500 to-emerald-600",  glow: "rgba(34,197,94,0.35)" },
  cancelledOrders:  { label: "Cancelled Orders",   icon: XCircle,       grad: "from-red-500 to-rose-600",       glow: "rgba(239,68,68,0.35)" },
};

function StatCard({ statKey, value }) {
  const cfg = STAT_CONFIG[statKey] || { label: statKey.replace(/([A-Z])/g, " $1"), icon: TrendingUp, grad: "from-slate-500 to-slate-600", glow: "rgba(100,116,139,0.3)" };
  const Icon = cfg.icon;

  return (
    <div className="group relative overflow-hidden rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", boxShadow: `0 8px 32px ${cfg.glow}` }}>
      {/* Glow bg */}
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${cfg.grad} opacity-20 blur-xl transition-all duration-300 group-hover:opacity-30`} />

      <div className="relative">
        <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${cfg.grad}`} style={{ boxShadow: `0 8px 20px ${cfg.glow}` }}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.45)" }}>{cfg.label}</p>
        <p className="mt-1.5 text-3xl font-black text-white tracking-tight">
          {cfg.prefix || ""}{typeof value === "number" ? value.toLocaleString("en-IN") : value ?? "—"}
        </p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/summary")
      .then((r) => setSummary(r.data))
      .catch(() => setSummary({}))
      .finally(() => setLoading(false));
  }, []);

  const statOrder = ["totalIncome","totalProducts","totalUsers","todayTotalOrders","pendingOrders","deliveredOrders","cancelledOrders"];

  return (
    <div className="space-y-6 pb-24 lg:pb-8">

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8" style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.3) 0%,rgba(168,85,247,0.15) 50%,rgba(16,185,129,0.2) 100%)", border: "1px solid rgba(139,92,246,0.3)", backdropFilter: "blur(20px)" }}>
        {/* Orbs */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(circle,#a855f7,transparent)" }} />
        <div className="pointer-events-none absolute -bottom-10 right-1/3 h-32 w-32 rounded-full opacity-20 blur-2xl" style={{ background: "radial-gradient(circle,#10b981,transparent)" }} />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1" style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)" }}>
              <Sparkles className="h-3 w-3 text-violet-300" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">Admin Dashboard</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight md:text-4xl">Store Overview</h1>
            <p className="mt-1 text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
              Monitor your store performance in real-time
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl px-4 py-2.5" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)" }}>
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-xs font-bold text-emerald-300">Live Data</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1,2,3,4,5,6,7].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-3xl" style={{ background: "rgba(255,255,255,0.05)" }} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statOrder.map((key) =>
            key in summary ? <StatCard key={key} statKey={key} value={summary[key]} /> : null
          )}
        </div>
      )}

    </div>
  );
}
