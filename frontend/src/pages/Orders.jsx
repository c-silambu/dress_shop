import React, { useEffect, useState } from "react";
import { Package, ChevronRight } from "lucide-react";
import api from "../api/api";

const statusColor = {
  "Order Placed": "bg-blue-100 text-blue-600",
  "Accepted": "bg-indigo-100 text-indigo-600",
  "Packed": "bg-purple-100 text-purple-600",
  "Shipped": "bg-amber-100 text-amber-600",
  "Out for Delivery": "bg-orange-100 text-orange-600",
  "Delivered": "bg-green-100 text-green-700",
  "Cancelled": "bg-red-100 text-red-600",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => { api.get("/orders/my-orders").then((r) => setOrders(r.data)); }, []);

  return (
    <section className="min-h-screen bg-slate-50 pb-24 md:pb-10">
      <div className="bg-white border-b border-slate-200 px-4 py-5 md:py-8">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="rounded-2xl bg-blue-600 p-3 text-white"><Package className="h-5 w-5" /></div>
          <div>
            <h1 className="text-xl font-black text-slate-900 md:text-3xl">My Orders</h1>
            <p className="text-xs text-slate-500">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-5">
        {!orders.length ? (
          <div className="mt-16 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-300">
              <Package className="h-10 w-10" />
            </div>
            <p className="mt-4 text-lg font-black text-slate-700">No orders yet</p>
            <p className="mt-1 text-sm text-slate-400">Shop something amazing!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order._id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80 md:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-400">Order ID</p>
                    <p className="mt-0.5 text-sm font-black text-slate-900">#{order._id?.slice(-8).toUpperCase()}</p>
                  </div>
                  <span className={`rounded-xl px-3 py-1 text-xs font-black ${statusColor[order.orderStatus] || "bg-slate-100 text-slate-600"}`}>
                    {order.orderStatus}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400">Amount</p>
                    <p className="mt-0.5 text-sm font-black text-blue-600">₹{order.amount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400">Payment</p>
                    <p className="mt-0.5 text-xs font-bold text-slate-700">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400">Delivery</p>
                    <p className="mt-0.5 text-xs font-bold text-slate-700">{order.deliveryStatus || "—"}</p>
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
