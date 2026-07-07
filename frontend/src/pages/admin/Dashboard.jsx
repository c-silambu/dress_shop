import React, { useEffect, useState } from "react";
import { CheckCircle2, Clock, IndianRupee, Package, ShoppingBag, TrendingUp, Users, XCircle } from "lucide-react";
import api from "../../api/api";

const STAT_CONFIG = {
  totalIncome: { label: "Total Revenue", icon: IndianRupee, prefix: "Rs. " },
  totalProducts: { label: "Total Products", icon: Package },
  totalUsers: { label: "Total Customers", icon: Users },
  todayTotalOrders: { label: "Today's Orders", icon: ShoppingBag },
  pendingOrders: { label: "Pending Orders", icon: Clock },
  deliveredOrders: { label: "Delivered Orders", icon: CheckCircle2 },
  cancelledOrders: { label: "Cancelled Orders", icon: XCircle },
};

function StatCard({ statKey, value }) {
  const cfg = STAT_CONFIG[statKey] || { label: statKey.replace(/([A-Z])/g, " $1"), icon: TrendingUp };
  const Icon = cfg.icon;

  return (
    <div className="border border-white/10 bg-white/[0.04] p-5 transition hover:border-[#d6b36a]/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">{cfg.label}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-white">
            {cfg.prefix || ""}{typeof value === "number" ? value.toLocaleString("en-IN") : value ?? "-"}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center border border-[#d6b36a]/35 text-[#d6b36a]">
          <Icon className="h-6 w-6" />
        </div>
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

  const statOrder = ["totalIncome", "totalProducts", "totalUsers", "todayTotalOrders", "pendingOrders", "deliveredOrders", "cancelledOrders"];

  return (
    <div className="space-y-6">
      <div className="border border-white/10 bg-[#15120f] p-6 md:p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#d6b36a]">Admin Dashboard</p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">Store Overview</h1>
            <p className="mt-2 text-sm text-white/45">Monitor products, customers, revenue, and order movement.</p>
          </div>
          <div className="inline-flex items-center gap-2 border border-[#324414] bg-[#1d2710] px-4 py-2 text-xs font-black text-[#c8e59d]">
            <span className="h-2 w-2 rounded-full bg-[#c8e59d]" />
            Live Data
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => <div key={i} className="h-32 animate-pulse bg-white/[0.04]" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statOrder.map((key) => key in summary ? <StatCard key={key} statKey={key} value={summary[key]} /> : null)}
        </div>
      )}
    </div>
  );
}
