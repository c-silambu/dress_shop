import React, { useEffect, useState } from "react";
import { Package, ChevronDown, ChevronUp, XCircle, X, AlertTriangle } from "lucide-react";
import api from "../api/api";

const STATUS_STYLE = {
  "Order Placed": "bg-blue-100 text-blue-700",
  "Accepted":     "bg-indigo-100 text-indigo-700",
  "Packed":       "bg-purple-100 text-purple-700",
  "Shipped":      "bg-amber-100 text-amber-700",
  "Out for Delivery": "bg-orange-100 text-orange-700",
  "Delivered":    "bg-green-100 text-green-700",
  "Cancelled":    "bg-red-100 text-red-600",
};

const CANCEL_REASONS = [
  "Changed my mind",
  "Ordered by mistake",
  "Found better price elsewhere",
  "Delivery time too long",
  "Payment issue",
  "Other",
];

const CANCELLABLE = ["Order Placed", "Accepted", "Packed"];

function CancelModal({ order, onClose, onSuccess }) {
  const [reason, setReason] = useState("");
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    const finalReason = reason === "Other" ? custom.trim() : reason;
    if (!finalReason) return setErr("Please select or enter a reason.");
    setLoading(true);
    try {
      await api.put(`/orders/${order._id}/cancel`, { reason: finalReason });
      onSuccess();
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to cancel order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-red-100">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">Cancel Order</p>
              <p className="text-xs text-slate-400">#{order._id?.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Select a reason</p>
        <div className="space-y-2">
          {CANCEL_REASONS.map((r) => (
            <button
              key={r}
              onClick={() => { setReason(r); setErr(""); }}
              className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-bold transition ${
                reason === r
                  ? "bg-red-500 text-white"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {reason === "Other" && (
          <textarea
            className="input mt-3 resize-none text-sm"
            rows={2}
            placeholder="Describe your reason..."
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
          />
        )}

        {err && <p className="mt-2 text-xs font-bold text-red-500">{err}</p>}

        <div className="mt-4 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-black text-slate-600 hover:bg-slate-200">
            Keep Order
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-black text-white transition hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? "Cancelling…" : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, onCancelled }) {
  const [expanded, setExpanded] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const canCancel = CANCELLABLE.includes(order.orderStatus);

  return (
    <>
      <div className="glass-card overflow-hidden rounded-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Order ID</p>
            <p className="mt-0.5 text-sm font-black text-slate-900">#{order._id?.slice(-8).toUpperCase()}</p>
            <p className="mt-1 text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}</p>
          </div>
          <span className={`rounded-xl px-3 py-1 text-xs font-black ${STATUS_STYLE[order.orderStatus] || "bg-slate-100 text-slate-600"}`}>
            {order.orderStatus}
          </span>
        </div>

        {/* Stats row */}
        <div className="mx-4 mb-3 grid grid-cols-3 divide-x divide-slate-100 rounded-xl bg-slate-50 py-2">
          <div className="px-3">
            <p className="text-[10px] font-bold text-slate-400">Amount</p>
            <p className="mt-0.5 text-sm font-black text-blue-600">₹{order.amount}</p>
          </div>
          <div className="px-3">
            <p className="text-[10px] font-bold text-slate-400">Items</p>
            <p className="mt-0.5 text-sm font-black text-slate-800">{order.items?.length || 0}</p>
          </div>
          <div className="px-3">
            <p className="text-[10px] font-bold text-slate-400">Payment</p>
            <p className="mt-0.5 text-[11px] font-bold text-slate-700 leading-tight">{order.paymentMethod === "Cash on Delivery" ? "COD" : "Online"}</p>
          </div>
        </div>

        {/* Cancel reason (if cancelled) */}
        {order.orderStatus === "Cancelled" && order.cancelReason && (
          <div className={`mx-4 mb-3 flex items-start gap-2 rounded-xl px-3 py-2.5 ${
            order.cancelledByAdmin ? "bg-orange-50" : "bg-red-50"
          }`}>
            <XCircle className={`mt-0.5 h-4 w-4 shrink-0 ${
              order.cancelledByAdmin ? "text-orange-400" : "text-red-400"
            }`} />
            <div>
              {order.cancelledByAdmin && (
                <p className="text-[10px] font-bold uppercase tracking-wider text-orange-500 mb-0.5">
                  ⚠️ Cancelled by Store
                </p>
              )}
              <p className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                {order.cancelledByAdmin ? "Reason" : "Cancel Reason"}
              </p>
              <p className={`text-xs font-bold ${
                order.cancelledByAdmin ? "text-orange-700" : "text-red-700"
              }`}>
                {order.cancelReason}
              </p>
            </div>
          </div>
        )}

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-between border-t border-slate-100 px-4 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50"
        >
          <span>View Details</span>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {/* Expanded details */}
        {expanded && (
          <div className="border-t border-slate-100 px-4 pb-4 pt-3 space-y-3">
            {/* Products */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Products</p>
            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-50 p-2">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-black text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {item.size && `Size: ${item.size}`}{item.size && item.color && " • "}{item.color && `Color: ${item.color}`}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-black text-blue-600">₹{item.price}</p>
                    <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Address */}
            {order.address && (
              <>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Delivery Address</p>
                <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700 leading-relaxed">
                  <p className="font-black text-slate-900">{order.address.fullName}</p>
                  <p>{order.address.address}</p>
                  <p>{order.address.city}{order.address.district ? `, ${order.address.district}` : ""}</p>
                  <p>{order.address.state} — {order.address.pincode}</p>
                  <p className="mt-1 font-bold text-slate-600">📞 {order.address.phone}</p>
                </div>
              </>
            )}

            {/* Cancel button */}
            {canCancel && (
              <button
                onClick={() => setShowCancel(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3 text-sm font-black text-red-500 ring-1 ring-red-100 transition hover:bg-red-500 hover:text-white"
              >
                <XCircle className="h-4 w-4" /> Cancel Order
              </button>
            )}
          </div>
        )}
      </div>

      {showCancel && (
        <CancelModal
          order={order}
          onClose={() => setShowCancel(false)}
          onSuccess={() => { setShowCancel(false); onCancelled(); }}
        />
      )}
    </>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/orders/my-orders")
      .then((r) => setOrders(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <section className="min-h-screen bg-[#f8fbff] pb-28 md:pb-12">
      {/* Header */}
      <div className="luxury-gradient relative overflow-hidden px-4 pb-8 pt-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-pink-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur ring-2 ring-white/30">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">My Orders</h1>
              <p className="text-xs text-blue-200">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 pt-5">
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        ) : !orders.length ? (
          <div className="mt-16 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50">
              <Package className="h-10 w-10 text-blue-300" />
            </div>
            <p className="mt-4 text-lg font-black text-slate-700">No orders yet</p>
            <p className="mt-1 text-sm text-slate-400">Shop something amazing!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} onCancelled={load} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
