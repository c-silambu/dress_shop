import React, { useEffect, useState } from "react";
import { IndianRupee, Package, ShoppingBag, Users } from "lucide-react";
import api from "../../api/api";

const iconMap = {
  totalIncome: IndianRupee,
  totalProducts: Package,
  totalUsers: Users,
  todayOrders: ShoppingBag,
};

export default function Dashboard() {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    api.get("/admin/summary").then((response) => setSummary(response.data)).catch(() => setSummary({}));
  }, []);

  return (
    <section>
      <div className="mb-8 rounded-[2rem] bg-gradient-to-br from-blue-700 to-blue-950 p-8 text-white shadow-2xl shadow-blue-950/20">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-blue-200">Admin Dashboard</p>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">Store Overview</h1>
        <p className="mt-3 max-w-2xl text-blue-100">Track orders, income, products and users in a premium dashboard UI.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(summary).map(([key, value]) => {
          const Icon = iconMap[key] || BarFallback;
          return (
            <div key={key} className="rounded-[2rem] border border-blue-100 bg-white p-6 shadow-xl shadow-blue-950/5">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Icon className="h-7 w-7" />
              </div>
              <p className="text-sm font-black uppercase tracking-widest text-slate-400">{key.replace(/([A-Z])/g, " $1")}</p>
              <h3 className="mt-3 text-4xl font-black text-blue-950">{value}</h3>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function BarFallback() {
  return <ShoppingBag className="h-7 w-7" />;
}
