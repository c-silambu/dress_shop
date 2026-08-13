import React, { useEffect, useState } from "react";
import {
  ShoppingBag, X, User, Phone, MapPin, Package,
  CreditCard, XCircle, Search, ChevronDown, RefreshCw, Sparkles,
} from "lucide-react";
import api from "../../api/api";

const STATUSES = ["Order Placed","Accepted","Packed","Shipped","Out for Delivery","Delivered","Cancellation Requested","Cancelled"];

const STATUS_STYLE = {
  "Order Placed":     { bg: "rgba(99,102,241,0.15)",  text: "#818cf8", border: "rgba(99,102,241,0.3)",  dot: "#6366f1" },
  "Accepted":         { bg: "rgba(139,92,246,0.15)", text: "#a78bfa", border: "rgba(139,92,246,0.3)", dot: "#8b5cf6" },
  "Packed":           { bg: "rgba(59,130,246,0.15)",  text: "#60a5fa", border: "rgba(59,130,246,0.3)",  dot: "#3b82f6" },
  "Shipped":          { bg: "rgba(245,158,11,0.15)",  text: "#fbbf24", border: "rgba(245,158,11,0.3)",  dot: "#f59e0b" },
  "Out for Delivery": { bg: "rgba(249,115,22,0.15)",  text: "#fb923c", border: "rgba(249,115,22,0.3)",  dot: "#f97316" },
  "Delivered":        { bg: "rgba(16,185,129,0.15)",  text: "#34d399", border: "rgba(16,185,129,0.3)",  dot: "#10b981" },
  "Cancelled":        { bg: "rgba(239,68,68,0.15)",   text: "#f87171", border: "rgba(239,68,68,0.3)",   dot: "#ef4444" },
  "Cancellation Requested": { bg: "rgba(249,115,22,0.15)", text: "#fb923c", border: "rgba(249,115,22,0.3)", dot: "#f97316" },
};

const ADMIN_CANCEL_REASONS = [
  "Unfortunately out of stock",
  "Product discontinued",
  "Payment verification failed",
  "Delivery not available in this area",
  "Suspected fraudulent order",
  "Other",
];

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || { bg: "rgba(255,255,255,0.08)", text: "rgba(255,255,255,0.5)", border: "rgba(255,255,255,0.1)", dot: "rgba(255,255,255,0.4)" };
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black" style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
      {status}
    </span>
  );
}

function OrderDetailModal({ order, onClose, onUpdate }) {
  const [status, setStatus] = useState(order.orderStatus);
  const [cancelReason, setCancelReason] = useState(ADMIN_CANCEL_REASONS[0]);
  const [customReason, setCustomReason] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (status === order.orderStatus) return onClose();
    setSaving(true);
    try {
      const payload = { orderStatus: status };
      if (status === "Cancelled" && order.orderStatus !== "Cancellation Requested") {
        payload.cancelReason = cancelReason === "Other"
          ? (customReason.trim() || "Cancelled by admin")
          : cancelReason;
      }
      await api.put(`/admin/orders/${order._id}/status`, payload);
      onUpdate();
      onClose();
    } finally { setSaving(false); }
  };

  const img = (item) => {
    if (!item.image) return null;
    return item.image.startsWith("http") ? item.image : `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/${item.image}`;
  };

  const glassPanel = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1.25rem" };

  return (
    <div className="admin-order-modal fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }}>
      <div className="admin-order-dialog flex max-h-[93vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl" style={{ background: "linear-gradient(160deg,#1a0a3e 0%,#0f172a 100%)", border: "1px solid rgba(139,92,246,0.25)", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>

        {/* Header */}
        <div className="admin-order-header flex shrink-0 items-center justify-between px-5 py-4" style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.4),rgba(168,85,247,0.2))", borderBottom: "1px solid rgba(139,92,246,0.2)" }}>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">Order Details</p>
            <p className="text-lg font-black text-white">#{order._id?.slice(-8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl text-white/60 transition hover:text-white" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="admin-order-body flex-1 space-y-4 overflow-y-auto p-5">

          {/* Customer */}
          <div style={glassPanel} className="admin-order-customer p-4 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-violet-300">Customer</p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}>
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-black text-white">{order.user?.name || "—"}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{order.user?.email || "—"}</p>
              </div>
            </div>
            {order.user?.phone && (
              <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                <Phone className="h-3.5 w-3.5 text-violet-400" />
                {order.user.phone}
              </div>
            )}
          </div>

          {/* Products */}
          <div className="admin-order-products">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.15em] text-violet-300">Products ({order.items?.length || 0})</p>
            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3" style={glassPanel}>
                  {img(item) ? (
                    <img src={img(item)} alt={item.name} className="h-14 w-14 shrink-0 rounded-xl object-cover" style={{ border: "1px solid rgba(255,255,255,0.1)" }} />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <Package className="h-6 w-6 text-white/30" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-black text-white">{item.name}</p>
                    <div className="mt-0.5 flex flex-wrap gap-x-2 text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-black text-violet-300">₹{item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Address */}
          {order.address && (
            <div style={glassPanel} className="admin-order-address p-4">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.15em] text-violet-300">Delivery Address</p>
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                  <p className="font-black text-white">{order.address.fullName}</p>
                  <p>{order.address.address}</p>
                  <p>{[order.address.city, order.address.district].filter(Boolean).join(", ")}</p>
                  <p>{order.address.state} — {order.address.pincode}</p>
                  <p className="mt-1 font-bold text-emerald-300">📞 {order.address.phone}</p>
                  {order.address.alternatePhone && <p style={{ color: "rgba(255,255,255,0.3)" }}>Alt: {order.address.alternatePhone}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Payment */}
          <div style={glassPanel} className="admin-order-payment flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-bold text-white">{order.paymentMethod}</span>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-violet-300">₹{order.amount}</p>
              <p className="text-[10px] font-black" style={{ color: order.paymentStatus === "Paid" ? "#34d399" : "#fbbf24" }}>
                {order.paymentStatus || "Pending"}
              </p>
            </div>
          </div>

          {/* Cancel reason (already cancelled) */}
          {order.orderStatus === "Cancelled" && order.cancelReason && (
            <div className="admin-order-cancel p-4" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "1.25rem" }}>
              <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-red-400">Cancel Reason</p>
              <div className="flex items-start gap-2">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <div>
                  {order.cancelledByAdmin && <p className="text-[10px] font-bold text-orange-400 mb-0.5">Cancelled by Admin</p>}
                  <p className="text-sm font-bold text-red-300">{order.cancelReason}</p>
                </div>
              </div>
            </div>
          )}

          <p className="text-center text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
            Placed on {new Date(order.createdAt).toLocaleString("en-IN")}
          </p>
        </div>

        {/* Footer */}
        <div className="admin-order-footer shrink-0 p-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.15em] text-violet-300">Update Status</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full appearance-none rounded-2xl py-3 pl-4 pr-8 text-sm font-bold text-white outline-none"
                style={{ background: "#fff", border: "1px solid #d5c9b9", color: "#241b16", colorScheme: "light" }}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#756f66]" />
            </div>
            <button
              onClick={save}
              disabled={saving}
              className="rounded-2xl px-5 text-sm font-black text-white transition disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", boxShadow: "0 8px 20px rgba(124,58,237,0.3)" }}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>

          {status === "Cancelled" && order.orderStatus !== "Cancelled" && order.orderStatus !== "Cancellation Requested" && (
            <div className="mt-4 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-red-400">Cancel Reason (shown to customer)</p>
              <div className="space-y-1.5">
                {ADMIN_CANCEL_REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setCancelReason(r)}
                    className="w-full rounded-xl px-3 py-2.5 text-left text-xs font-bold transition"
                    style={cancelReason === r
                      ? { background: "rgba(239,68,68,0.3)", border: "1px solid rgba(239,68,68,0.5)", color: "#fca5a5" }
                      : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                  >
                    {r}
                  </button>
                ))}
              </div>
              {cancelReason === "Other" && (
                <textarea
                  rows={2}
                  placeholder="Enter custom cancel reason…"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full resize-none rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected, setSelected] = useState(null);

  const load = () => {
    setLoading(true);
    api.get("/admin/orders")
      .then((r) => setOrders(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, []);

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === "All" || o.orderStatus === filterStatus;
    const q = search.toLowerCase();
    const matchSearch = !q || o._id?.toLowerCase().includes(q) || o.user?.name?.toLowerCase().includes(q) || o.user?.phone?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = STATUSES.reduce((acc, s) => { acc[s] = orders.filter((o) => o.orderStatus === s).length; return acc; }, {});

  const glassCard = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" };

  return (
    <div className="admin-orders-page space-y-5 pb-24 lg:pb-8">

      {/* Header */}
      <div className="flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between" style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.2),rgba(5,150,105,0.1))", border: "1px solid rgba(16,185,129,0.25)" }}>
        <div>
          <div className="mb-1 inline-flex items-center gap-2 rounded-full px-3 py-1" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)" }}>
            <Sparkles className="h-3 w-3 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Order Management</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight sm:text-3xl">Orders</h1>
          <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>{orders.length} total orders</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 self-start rounded-2xl px-4 py-2.5 text-sm font-bold text-emerald-300 transition hover:text-emerald-200 sm:self-auto" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Status Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        <button
          onClick={() => setFilterStatus("All")}
          className="shrink-0 rounded-full px-4 py-1.5 text-xs font-black transition"
          style={filterStatus === "All"
            ? { background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff", border: "1px solid transparent" }
            : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          All ({orders.length})
        </button>
        {STATUSES.map((s) => {
          const st = STATUS_STYLE[s];
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="shrink-0 rounded-full px-4 py-1.5 text-xs font-black transition"
              style={filterStatus === s
                ? { background: st.bg, color: st.text, border: `1px solid ${st.border}` }
                : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {s} ({counts[s] || 0})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <label className="relative block pt-5 text-[10px] font-black uppercase tracking-widest text-emerald-300">Search orders
        <Search className="absolute bottom-4 left-4 h-4 w-4 text-white/30" />
        <input
          className="w-full rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-white outline-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          placeholder="Search by order ID, name or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>

      {/* Orders List */}
      {loading && !orders.length ? (
        <div className="space-y-3">
          {[1,2,3,4].map((i) => <div key={i} className="h-20 animate-pulse rounded-2xl" style={{ background: "rgba(255,255,255,0.05)" }} />)}
        </div>
      ) : !filtered.length ? (
        <div className="py-16 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-white/10" />
          <p className="mt-3 font-black" style={{ color: "rgba(255,255,255,0.2)" }}>No orders found</p>
        </div>
      ) : (
        <div className="admin-orders-list space-y-2.5">
          {filtered.map((order) => {
            const st = STATUS_STYLE[order.orderStatus] || STATUS_STYLE["Order Placed"];
            return (
              <button
                key={order._id}
                onClick={() => setSelected(order)}
                className="admin-order-row group w-full rounded-2xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5"
                style={{ ...glassCard, borderRadius: "1rem" }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition" style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.2)" }}>
                      <ShoppingBag className="h-5 w-5 text-violet-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-white">{order.user?.name || "Unknown User"}</p>
                      <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                        #{order._id?.slice(-8).toUpperCase()} &bull; {new Date(order.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <StatusBadge status={order.orderStatus} />
                    <span className="text-sm font-black text-violet-300">₹{order.amount}</span>
                  </div>
                </div>
                {order.orderStatus === "Cancelled" && order.cancelReason && (
                  <div className="mt-2.5 flex items-center gap-1.5 rounded-xl px-3 py-2" style={{ background: order.cancelledByAdmin ? "rgba(249,115,22,0.12)" : "rgba(239,68,68,0.1)", border: order.cancelledByAdmin ? "1px solid rgba(249,115,22,0.2)" : "1px solid rgba(239,68,68,0.2)" }}>
                    <XCircle className="h-3 w-3 shrink-0" style={{ color: order.cancelledByAdmin ? "#fb923c" : "#f87171" }} />
                    <p className="truncate text-[11px] font-bold" style={{ color: order.cancelledByAdmin ? "#fdba74" : "#fca5a5" }}>
                      {order.cancelledByAdmin ? "Admin: " : ""}{order.cancelReason}
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {selected && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onUpdate={() => { load(); setSelected(null); }}
        />
      )}
    </div>
  );
}
