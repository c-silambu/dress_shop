import React, { useEffect, useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Package, X, XCircle } from "lucide-react";
import api from "../api/api";

const STATUS_STYLE = {
  "Order Placed": "bg-[#eef5e8] text-[#324414]",
  "Accepted": "bg-[#f7f1eb] text-[#75542a]",
  "Packed": "bg-[#f7f1eb] text-[#75542a]",
  "Shipped": "bg-[#fff6df] text-[#8b6828]",
  "Out for Delivery": "bg-[#fff6df] text-[#8b6828]",
  "Delivered": "bg-[#eef5e8] text-[#324414]",
  "Cancelled": "bg-[#fff1f5] text-[#a91d4b]",
  "Cancellation Requested": "bg-[#fff7ed] text-[#c2410c]",
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
    if (!finalReason) return setErr("Please select a reason first.");
    const orderId = order._id?.toString() || order.id?.toString();
    if (!orderId) return setErr("Invalid order. Please refresh the page and try again.");

    setLoading(true);
    setErr("");
    try {
      await api.put(`/orders/${orderId}/cancel`, { reason: finalReason });
      onSuccess();
    } catch (e) {
      const status = e.response?.status;
      const serverMsg = e.response?.data?.message;
      if (status === 404) setErr("Order not found. Please refresh the page and try again.");
      else if (status === 403) setErr("You are not authorized to cancel this order.");
      else if (status === 401) setErr("Session expired. Please login again.");
      else if (status === 400) setErr(serverMsg || "This order cannot be cancelled now.");
      else setErr(serverMsg || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-[#fff1f5] text-[#a91d4b]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-black text-[#15120f]">Cancel Order</p>
              <p className="text-xs text-[#756f66]">#{order._id?.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center border border-[#e9e0d7] text-[#756f66]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="editorial-kicker text-[9px]">Select a reason</p>
        <div className="mt-3 space-y-2">
          {CANCEL_REASONS.map((r) => (
            <button
              key={r}
              onClick={() => { setReason(r); setErr(""); }}
              className={`w-full border px-4 py-3 text-left text-sm font-bold transition ${reason === r ? "border-[#a91d4b] bg-[#a91d4b] text-white" : "border-[#e9e0d7] bg-white text-[#15120f] hover:border-[#a91d4b]"}`}
            >
              {r}
            </button>
          ))}
        </div>

        {reason === "Other" && (
          <textarea className="input mt-3 resize-none text-sm" rows={2} placeholder="Describe your reason..." value={custom} onChange={(e) => setCustom(e.target.value)} />
        )}

        {err && (
          <div className="mt-3 flex items-start justify-between gap-2 border border-[#f0d5dc] bg-[#fff1f5] px-3 py-2.5">
            <p className="text-xs font-bold text-[#a91d4b]">{err}</p>
            <button onClick={() => setErr("")} className="shrink-0 text-[#a91d4b]"><X className="h-3.5 w-3.5" /></button>
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button onClick={onClose} className="btn-soft">Keep Order</button>
          <button onClick={submit} disabled={loading} className="btn-primary bg-[#a91d4b] hover:bg-[#761131] disabled:opacity-60">
            {loading ? "Cancelling..." : "Yes, Cancel"}
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
      <div className="order-card border border-[#e9e0d7] bg-white">
        <div className="flex items-start justify-between gap-3 p-5">
          <div>
            <p className="editorial-kicker text-[9px]">Order ID</p>
            <p className="mt-1 text-lg font-black text-[#15120f]">#{order._id?.slice(-8).toUpperCase()}</p>
            <p className="mt-1 text-xs text-[#756f66]">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
          </div>
          <span className={`px-3 py-1.5 text-xs font-black ${STATUS_STYLE[order.orderStatus] || "bg-[#f7f1eb] text-[#756f66]"}`}>
            {order.orderStatus}
          </span>
        </div>

        <div className="mx-5 mb-4 grid grid-cols-3 border border-[#e9e0d7] bg-[#fbfaf7] py-3">
          <div className="px-3"><p className="text-[10px] font-bold text-[#756f66]">Amount</p><p className="mt-1 text-sm font-black text-[#15120f]">Rs. {order.amount}</p></div>
          <div className="border-x border-[#e9e0d7] px-3"><p className="text-[10px] font-bold text-[#756f66]">Items</p><p className="mt-1 text-sm font-black text-[#15120f]">{order.items?.length || 0}</p></div>
          <div className="px-3"><p className="text-[10px] font-bold text-[#756f66]">Payment</p><p className="mt-1 text-xs font-black text-[#15120f]">{order.paymentMethod === "Cash on Delivery" ? "COD" : "Online"}</p></div>
        </div>

        {["Cancelled","Cancellation Requested"].includes(order.orderStatus) && order.cancelReason && (
          <div className="mx-5 mb-4 flex items-start gap-2 border border-[#f0d5dc] bg-[#fff1f5] px-3 py-2.5">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#a91d4b]" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#a91d4b]">{order.orderStatus === "Cancellation Requested" ? "Waiting for admin approval" : order.cancelledByAdmin ? "Cancelled by Store" : "Cancel Reason"}</p>
              <p className="text-xs font-bold text-[#761131]">{order.cancelReason}</p>
            </div>
          </div>
        )}

        <button onClick={() => setExpanded((v) => !v)} className="flex w-full items-center justify-between border-t border-[#e9e0d7] px-5 py-4 text-xs font-black uppercase tracking-[0.18em] text-[#756f66] hover:text-[#15120f]">
          <span>View Details</span>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {expanded && (
          <div className="border-t border-[#e9e0d7] px-5 pb-5 pt-4">
            <p className="editorial-kicker text-[9px]">Products</p>
            <div className="mt-3 space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#fbfaf7] p-2">
                  {item.image && <img src={item.image} alt={item.name} className="h-14 w-14 object-cover" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-black text-[#15120f]">{item.name}</p>
                    <p className="text-[10px] text-[#756f66]">{item.size && `Size: ${item.size}`}{item.size && item.color && " / "}{item.color && `Color: ${item.color}`}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-black text-[#a91d4b]">Rs. {item.price}</p>
                    <p className="text-[10px] text-[#756f66]">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {order.address && (
              <div className="mt-4">
                <p className="editorial-kicker text-[9px]">Delivery Address</p>
                <div className="mt-2 bg-[#fbfaf7] p-3 text-xs leading-6 text-[#756f66]">
                  <p className="font-black text-[#15120f]">{order.address.fullName}</p>
                  <p>{order.address.address}</p>
                  <p>{order.address.city}{order.address.district ? `, ${order.address.district}` : ""}</p>
                  <p>{order.address.state} - {order.address.pincode}</p>
                  <p className="mt-1 font-bold">Phone: {order.address.phone}</p>
                </div>
              </div>
            )}

            {canCancel && (
              <button onClick={() => setShowCancel(true)} className="order-cancel-button mt-4 flex w-full items-center justify-center gap-2 py-3 text-sm font-black transition">
                <XCircle className="h-4 w-4" /> Cancel Order
              </button>
            )}
          </div>
        )}
      </div>

      {showCancel && <CancelModal order={order} onClose={() => setShowCancel(false)} onSuccess={() => { setShowCancel(false); onCancelled(); }} />}
    </>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/orders/my-orders").then((r) => setOrders(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <section className="page-shell luxury-account luxury-orders">
      <div className="border-b border-[#e9e0d7] bg-white">
        <div className="section-wrap py-10 md:py-14">
          <p className="editorial-kicker">Account History</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#15120f] md:text-5xl">My Orders</h1>
          <p className="mt-2 text-sm text-[#756f66]">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="orders-list section-wrap max-w-3xl py-8">
        {loading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-36 animate-pulse bg-[#eee5dc]" />)}</div>
        ) : !orders.length ? (
          <div className="mt-12 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center border border-[#e9e0d7] bg-white">
              <Package className="h-10 w-10 text-[#a91d4b]" />
            </div>
            <p className="mt-4 text-lg font-black text-[#15120f]">No orders yet</p>
            <p className="mt-1 text-sm text-[#756f66]">Shop something beautiful to see it here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => <OrderCard key={order._id} order={order} onCancelled={load} />)}
          </div>
        )}
      </div>
    </section>
  );
}
