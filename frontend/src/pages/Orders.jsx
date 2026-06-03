import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/my-orders").then((response) => setOrders(response.data));
  }, []);

  return (
    <section className="mx-auto max-w-6xl p-4 py-10">
      <h1 className="mb-6 text-4xl font-black text-blue-900">My Orders</h1>
      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order._id} className="rounded-3xl border border-blue-100 bg-white p-5 shadow">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h3 className="font-bold text-blue-950">Order #{order._id?.slice(-6)}</h3>
                <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">{order.orderStatus}</span>
            </div>
            <p className="mt-4 font-bold">Amount: ₹{order.amount}</p>
            <p className="text-slate-600">Payment: {order.paymentMethod}</p>
            <p className="text-slate-600">Delivery: {order.deliveryStatus}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
