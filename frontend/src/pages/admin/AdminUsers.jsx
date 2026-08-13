import React, { useEffect, useState } from "react";
import { Users, Search, Mail, Phone, Calendar, Sparkles } from "lucide-react";
import api from "../../api/api";

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
}

const AVATAR_GRADS = [
  "from-violet-500 to-purple-600",
  "from-rose-500 to-pink-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-indigo-500 to-violet-500",
];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/users")
      .then((r) => setUsers(r.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.toLowerCase().includes(q);
  });

  const glassCard = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" };

  return (
    <div className="space-y-5 pb-24 lg:pb-8">

      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between" style={{ background: "linear-gradient(135deg,rgba(244,63,94,0.2),rgba(168,85,247,0.1))", border: "1px solid rgba(244,63,94,0.25)" }}>
        <div>
          <div className="mb-1 inline-flex items-center gap-2 rounded-full px-3 py-1" style={{ background: "rgba(244,63,94,0.15)", border: "1px solid rgba(244,63,94,0.25)" }}>
            <Sparkles className="h-3 w-3 text-rose-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Customer Management</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight sm:text-3xl">Users</h1>
          <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>{users.length} registered customers</p>
        </div>
      </div>

      {/* Search */}
      <label className="relative block pt-5 text-[10px] font-black uppercase tracking-widest text-rose-300">Search customers
        <Search className="absolute bottom-4 left-4 h-4 w-4 text-white/30" />
        <input
          className="w-full rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-white outline-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          placeholder="Search by name, email or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>

      {/* Desktop Table */}
      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map((i) => <div key={i} className="h-16 animate-pulse rounded-2xl" style={{ background: "rgba(255,255,255,0.04)" }} />)}
        </div>
      ) : !filtered.length ? (
        <div className="py-16 text-center">
          <Users className="mx-auto h-12 w-12 text-white/10" />
          <p className="mt-3 font-black" style={{ color: "rgba(255,255,255,0.2)" }}>No users found</p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden overflow-hidden rounded-3xl md:block" style={glassCard}>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Customer","Email","Phone","Joined"].map((h) => (
                    <th key={h} className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.35)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, idx) => (
                  <tr key={user._id} className="transition hover:bg-white/5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? <img src={user.avatar} alt={user.name || "Customer"} referrerPolicy="no-referrer" className="h-9 w-9 shrink-0 rounded-xl object-cover" /> : <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${AVATAR_GRADS[idx % AVATAR_GRADS.length]} text-sm font-black text-white`}>{getInitials(user.name)}</div>}
                        <span className="text-sm font-black text-white">{user.name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>{user.email || "—"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>{user.phone || "—"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>
                        {new Date(user.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-2.5 md:hidden">
            {filtered.map((user, idx) => (
              <div key={user._id} className="flex items-center gap-4 rounded-2xl p-4" style={glassCard}>
                {user.avatar ? <img src={user.avatar} alt={user.name || "Customer"} referrerPolicy="no-referrer" className="h-12 w-12 shrink-0 rounded-2xl object-cover" /> : <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${AVATAR_GRADS[idx % AVATAR_GRADS.length]} text-base font-black text-white`}>{getInitials(user.name)}</div>}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-black text-white">{user.name || "—"}</p>
                  <div className="mt-1 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      <Mail className="h-3 w-3 text-rose-400 shrink-0" />
                      <span className="truncate">{user.email || "—"}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                        <Phone className="h-3 w-3 text-violet-400 shrink-0" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                      <Calendar className="h-3 w-3 shrink-0" />
                      <span>{new Date(user.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
